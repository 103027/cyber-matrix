import paramiko, requests, re
import ipaddress
import os
import time
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Flask, request, jsonify, send_file
import json
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
import google.generativeai as genai
import tempfile
from app.models.scans import add_scan, add_subdomain_count, add_exposed_port_count, add_asset_count, add_passwordhash_count, get_scans_by_email, add_Vulnerability_count
from app.services.chat_handler import query_text_document
bp = Blueprint('subdomains', __name__)

KALI_IP = "44.207.6.16"
KALI_USERNAME = "kali"
# KALI_KEY_PATH = "D:/Sem 7/FYP-1/kali.pem"
KALI_KEY_PATH = "/Users/hassanmuzaffar/Downloads/kali.pem"
WORDLIST_PATH = "/usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt"
NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch={}"
LOGO_PATH = os.path.join(os.path.dirname(__file__), "logo.png")
GEMINI_API_KEY = "AIzaSyAX9bRZaWmywRuUKSiFVSDKEYwj6sZ3Ajo"
genai.configure(api_key=GEMINI_API_KEY)
PROJECT_DOCUMENT_PATH = os.path.join(os.path.dirname(__file__), "Learn.txt")  
with open(PROJECT_DOCUMENT_PATH, "r", encoding="utf-8") as file:
    project_context = file.read()
    
def ssh_execute_command(ip, username, key_path, command):
    """
    Executes a command on a remote SSH server and returns the output or error.
    """
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=ip, username=username, key_filename=key_path)

        stdin, stdout, stderr = ssh.exec_command(command)
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()
        
        ssh.close()

        return output if not error else None, error if error else None
    except Exception as e:
        return None, str(e)

def sanitize_output(output):
    return [line.split("Found: ")[1].strip() for line in output.splitlines() if "Found:" in line]

def get_subdomain_status(subdomains):
    subdomain_status = []
    for subdomain in subdomains:
        try:
            response = requests.get(f"http://{subdomain}", timeout=5)
            status_code = response.status_code
        except requests.exceptions.RequestException:
            status_code = "N/A"
        subdomain_status.append({"subdomain": subdomain, "status": status_code})
    return subdomain_status

def extract_hostnames(output, domain):
    return list({line.split("-")[0].strip("| ").strip() for line in output.splitlines() if "| " in line and domain in line})

def parse_nslookup_output(output):
    addresses = []
    capture = False
    for line in output.splitlines():
        if "Non-authoritative answer:" in line:
            capture = True
        elif capture and "Address:" in line:
            addresses.append(line.split("Address:")[1].strip())
    return addresses

def extract_cn_values(output):
    patterns = {
        "subject": r"subject=.*?CN=([^\n,]+)",
        "issuer_cn": r"issuer=.*?CN=([^\n,]+)",
        "issuer_org": r"issuer=.*?O=([^,]+)"
    }
    return {
        "subject_cn": re.search(patterns["subject"], output).group(1) if re.search(patterns["subject"], output) else "Not Found",
        "issuer_cn": re.search(patterns["issuer_cn"], output).group(1) if re.search(patterns["issuer_cn"], output) else "Not Found",
        "issuer_org": re.search(patterns["issuer_org"], output).group(1) if re.search(patterns["issuer_org"], output) else "Not Found"
    }
def extract_robot_url(output):
    urls = []
    for line in output.splitlines():
        line = line.strip()
    # Match Disallow or Allow lines with `/` URLs that have content after `/`
        if line.lower().startswith("disallow:") or line.lower().startswith("allow:"):
            url = line.split(":", 1)[1].strip()
            if url.startswith("/") and len(url) > 1:  # Ensure it starts with `/` and has more content
                urls.append(url)
    return urls

def get_url_(output):
    data = output.splitlines()
    current_url = None  # Variable to store the current URL
    location_url = None  # Variable to store the Location URL
    status_code = None   # Variable to store the status code

    for i, line in enumerate(data):
        # Check if the line contains a URL
        if "http://" in line or "https://" in line:
            # Extract the URL from the line
            parts = line.split()
            for part in parts:
                if part.startswith("http://") or part.startswith("https://"):
                    current_url = part  # Save the current URL
                    break

        # Check if the line contains "Location"
        if "Location" in line:
            parts = line.split()
            for part in parts:
                if part.startswith("http://") or part.startswith("https://"):
                    location_url = part  # Save the Location URL
                    break

        # Check if the line contains "HTTP request sent, awaiting response..." for the status code
        if "HTTP request sent, awaiting response..." in line:
            # Extract the status code (e.g., 301, 200, etc.)
            match = re.search(r"\b\d{3}\b", line)
            if match:
                status_code = match.group(0)

        # Break the loop once all required information is found
        if current_url and location_url and status_code:
            break

    # Store the information in a dictionary
    result = {
        "url": current_url,
        "location": location_url,
        "status_code": status_code
    }

    return result

def get_title_server(output):
    title = None
    server = None

    if output:
        lines = output.splitlines()
        for line in lines:
            if line.lower().startswith("server:"):
                server = line.split(":", 1)[1].strip()
            elif line.lower().startswith("title:"):
                title = line.split(":", 1)[1].strip()

    # Return the results
    result = {
        "title": title,
        "server": server,
        
    }

    return result

def get_clean_ip(output):
    results = []
    # Regular expression to match Port, State, Service, Reason, and Version
    # Updated regex to separate Reason and Version accurately
    regex = r"^(\d+/tcp)\s+(\S+)\s+(\S+)\s+(.+?)(?:\s+ttl\s+\d+\s+(.*))?$"
    # Split the output into lines and parse each line
    for line in output.splitlines():
        match = re.match(regex, line)
        if match:
            port, state, service, reason, version = match.groups()
            results.append({
                "Port": port.strip(),
                "State": state.strip(),
                "Server": service.strip(),
                "Reason": reason.strip(),
                "Version Number": version.strip() if version else ""  # Ensure version is captured if present
            })
    return results

def host_to_decimal(host):
    return int(ipaddress.IPv4Address(host))

def host_to_hex(host):
    return hex(int(ipaddress.IPv4Address(host)))

def extractall(host):
    command = f"ipcalc {host}"
    output, error = ssh_execute_command(KALI_IP, KALI_USERNAME, KALI_KEY_PATH, command)
    
    if error:
        return jsonify({'error': 'Error while fetching information', 'message': error}), 500
    
    # Extract relevant information using regex
    network = re.search(r'Network:\s+([\d\.\/]+)', output)
    netmask = re.search(r'Netmask:\s+([\d\.]+) = (\d+)', output)
    wildcard = re.search(r'Wildcard:\s+([\d\.]+)', output)
    host_min = re.search(r'HostMin:\s+([\d\.]+)', output)
    host_max = re.search(r'HostMax:\s+([\d\.]+)', output)
    broadcast = re.search(r'Broadcast:\s+([\d\.]+)', output)
    hosts = re.search(r'Hosts/Net:\s+([\d\.]+)', output)
    
    # Assign extracted values
    network_address = network.group(1) if network else None
    network_mask = netmask.group(1) if netmask else None
    network_mask_bits = netmask.group(2) if netmask else None
    cisco_wildcard = wildcard.group(1) if wildcard else None
    hostmin = host_min.group(1) if host_min else None
    hostmax = host_max.group(1) if host_max else None
    broadcast_address = broadcast.group(1) if broadcast else None
    total_address = hosts.group(1) if hosts else None
    
    return network_address, network_mask, network_mask_bits, broadcast_address, cisco_wildcard, hostmin, hostmax,total_address

def generate_pdf_report(nikto_data):
    """Generate a well-designed PDF report from Nikto JSON data with text wrapping."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    # Custom Style for Wrapping Text
    wrap_style = ParagraphStyle(name="WrapStyle", fontSize=10, leading=12, wordWrap=True)

    elements = []

    try:
        logo = Image(LOGO_PATH, width=80, height=80)  # Adjust width & height
    except Exception:
        logo = Paragraph("<b>[Logo Missing]</b>", styles['Normal'])

    current_date = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Create a table with three columns: Logo (Left), Cyber-Matrix (Center), Date (Right)
    header_table = Table([[logo, Paragraph("<b>Cyber-Matrix</b>", styles['Title']), Paragraph(f"<b>Date:</b> {current_date}", styles['Normal'])]], 
                        colWidths=[100, 300, 100])  # Adjust column widths

    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),   # Align logo to the left
        ('ALIGN', (1, 0), (1, 0), 'CENTER'), # Align Cyber-Matrix to the center
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),  # Align Date to the right
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), # Align all items to the top
    ]))

    elements.append(header_table)
    elements.append(Spacer(1, 20))  # Add spacing after header


    # 🏷️ Report Title
    title = f"Nikto Security Scan Report for {nikto_data.get('host', 'Unknown Host')}"
    elements.append(Paragraph(title, styles['Title']))
    elements.append(Spacer(1, 12))

    # 🏷️ Summary Table (Fix Overlapping Issues)
    summary_data = [
        ["Field", "Value"],
        ["Target Host", nikto_data.get("host", "N/A")],
        ["Target IP", nikto_data.get("ip", "N/A")],
        ["Port", str(nikto_data.get("port", "N/A"))],  # Ensure it's a string
        ["Server Banner", nikto_data.get("banner", "N/A")]
    ]

    summary_table = Table(summary_data, colWidths=[150, 350])  # Wider columns to prevent overlap
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(summary_table)
    elements.append(Spacer(1, 20))

    # 🏷️ Vulnerabilities Section
    elements.append(Paragraph("Vulnerabilities Found", styles['Heading2']))

    if "vulnerabilities" in nikto_data and nikto_data["vulnerabilities"]:
        vuln_table_data = [["ID", "Method", "Message", "Reference"]]  # Table Headers

        for vuln in nikto_data["vulnerabilities"]:
            vuln_table_data.append([
                vuln.get("id", "N/A"),
                vuln.get("method", "N/A"),
                Paragraph(vuln.get("msg", "N/A"), wrap_style),  # Wrap text inside the column
                Paragraph(vuln.get("references", "N/A"), wrap_style)  # Wrap reference URLs
            ])

        vuln_table = Table(vuln_table_data, colWidths=[60, 60, 280, 130])  # Adjusted column widths
        vuln_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkred),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lavender),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(vuln_table)
    else:
        elements.append(Paragraph("No vulnerabilities found.", styles['Normal']))

    # 🏷️ Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer    

def remove_ansi(text):
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    return ansi_escape.sub('', text)

def ssh_execute_command2(command):
    """
    Executes a command on the remote Kali Linux machine via SSH.
    
    :param command: The command to execute (e.g., 'whatweb example.com')
    :return: The command output
    """
    try:
        
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=KALI_IP, username=KALI_USERNAME, key_filename=KALI_KEY_PATH)

        stdin, stdout, stderr = ssh.exec_command(command)
        output = remove_ansi(stdout.read().decode().strip())
        error = remove_ansi(stderr.read().decode().strip())
        
        ssh.close()

        return output if output else None, error if error else None
    except Exception as e:
        return None, str(e)

def extract_clean_technologies(summary):
    technologies = []
    matches = summary.split(',')

    for match in matches:
        tech = match.strip()
        # Extract content inside square brackets
        extracted = re.search(r'\[(.*?)\]', tech)
        if extracted:
            clean_tech = extracted.group(1)
            # Ignore URLs and non-technology values
            if not clean_tech.startswith("http"):
                if clean_tech == "proxygen-bolt":
                    clean_tech = "proxygen"
                technologies.append(clean_tech)
    
    return technologies

def extract_cve(technologies):
    cve_results = {}
    for tech in technologies:
        try:
            response = requests.get(NVD_API_URL.format(tech))
            if response.status_code == 200:
                cve_data = response.json().get("vulnerabilities", [])
                cve_list = []
                for cve in cve_data[:10]:
                    cve_id = cve.get("cve", {}).get("id", "N/A")
                    severity = cve.get("cve", {}).get("metrics", {}).get("cvssMetricV2", [{}])[0].get("baseSeverity", "Unknown")
                    cve_list.append({"CVE ID": cve_id, "Severity": severity})
                cve_results[tech] = cve_list
            else:
                cve_results[tech] = f"Error fetching data: {response.status_code}"
        except Exception as e:
            cve_results[tech] = f"API request failed: {str(e)}"
    
    return cve_results


@bp.route('/get_subdomains', methods=['GET'])
@jwt_required()
def get_subdomains():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400

   
    command = f"gobuster dns -d {domain} -w {WORDLIST_PATH} | head -n 30"
    output, error = ssh_execute_command(KALI_IP, KALI_USERNAME, KALI_KEY_PATH, command)

    if error:
        return jsonify({"error": error}), 500

    sanitized_output = sanitize_output(output)
    subdomain_status = get_subdomain_status(sanitized_output)

    return jsonify({"domain": domain, "Sub-domains": subdomain_status})

@bp.route('/get_target_info', methods=['GET'])
@jwt_required()
def get_target_info():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    identity = get_jwt_identity()
    email = identity.get("email")
    print("email",email)

    commands = {
        "dns": f"nmap --script dns-brute -sn {domain} | head -n 20",
        "ip": f"nslookup {domain}",
        "common_names": f"echo | openssl s_client -connect {domain}:443 2>/dev/null | openssl x509 -noout -subject -issuer",
        "organization": f"whois {domain} | grep -i 'Registrant Organization' | awk -F': ' '{{print $2}}'",
        "robots": f"wget -qO- {domain}/robots.txt | head -n 100",
        "Title": f"""
        curl -sI {domain} | grep -i "server" && \
        echo "Title: $(curl -s {domain} | grep -oP '(?<=<title>).*?(?=</title>)')"
        """,
        "Content_Length": f"""
        wget --spider --server-response {domain} 2>&1 | grep -i "Content-Length" | tail -n 1
        """
    }

    results = {}

    for key, command in commands.items():
        output, error = ssh_execute_command(KALI_IP, KALI_USERNAME, KALI_KEY_PATH, command)
        if error:
            return jsonify({"error": error}), 500

        if key == "dns":
            results["DNS"] = extract_hostnames(output, domain)
        elif key == "ip":
            results["IP"] = parse_nslookup_output(output)
        elif key == "common_names":
            cert_info = extract_cn_values(output)
            results["Subject CN"] = cert_info["subject_cn"]
            results["Issuer CN"] = cert_info["issuer_cn"]
            results["Issuer Organization"] = cert_info["issuer_org"]
        elif key == "organization":
            results["Organization Name"] = output.strip()
        elif key == "robots":
            robot_url = extract_robot_url(output)
            results["Robot"] = robot_url
        elif key == "Title":
            title = get_title_server(output)
            Title = title["title"]
            webserver = title["server"]
            results["Title"] = Title
            results["Web Server"] = webserver
        elif key == "Content_Length":
            results["Content Length"] = output

    try:
        # Set up the SSH client
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # Connect to the remote server
        ssh_client.connect(hostname=KALI_IP, username=KALI_USERNAME, key_filename=KALI_KEY_PATH)
        
        # Run the wget command on the remote server
        stdin, stdout, stderr = ssh_client.exec_command(f"wget {domain}")  # Using -qO- to suppress output and get HTML
        
        # Capture the standard output and error
        output = stderr.read().decode().strip()
        error = stderr.read().decode().strip()

        # Close the SSH connection
        ssh_client.close()
        url = get_url_(output)
        location = url["location"]
        status_code = url["status_code"]
        url_ = url["url"]
        # Check if there was any output, otherwise return the error
        if output:
            results["Url"] = url_
            results["Location"] = location
            results["Status_Code"] = status_code
            
        elif error:
            return jsonify({'error': 'Error running wget', 'message': error}), 500
        else:
            return jsonify({'error': 'No output from wget'}), 500

    except Exception as e:
        return jsonify({'error': 'Failed to fetch URL via SSH', 'message': str(e)}), 500
    try:
        add_scan(
            email=email,
            new_total=1,
            new_date=[datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")],
            subdomain_count=0,  # Replace with real count if needed
            asset_count=0,
            exposed_port=0,
            passwordhash_count=0,
            Vulnerabilities_count=0
        )
    except Exception as e:
        return jsonify({"error": "Failed to update scan info", "message": str(e)}), 500
    results["domain"] = domain

    return jsonify(results)

@bp.route('/get_ip_ports', methods=['GET'])
@jwt_required()
def get_ip_ports():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    identity = get_jwt_identity()
    email = identity.get("email")
    try:

        # Set up SSH client
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Connect to the remote Kali instance
        ssh_client.connect(hostname=KALI_IP, username=KALI_USERNAME, key_filename=KALI_KEY_PATH)
        

        # Run the nmap command
        command = f"nmap -T5 -p1-1000 -sV -d2 {domain}"
        print(f"Running command: {command}")  # Debug
        stdin, stdout, stderr = ssh_client.exec_command(command)

        # Read command output
        output = stdout.read().decode(errors="replace").strip()
        error = stderr.read().decode(errors="replace").strip()

        # Close the SSH connection
        ssh_client.close()
        results = get_clean_ip(output)        
        # Handle output and errors
        if not output and error:
            return jsonify({"error": "Command failed", "details": error}), 500
        print("results",len(results))
        try:
            add_scan(
            email=email,
            new_total=1,
            new_date=[datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")],
            subdomain_count=0,  # Replace with real count if needed
            asset_count=0,
            exposed_port=0,
            passwordhash_count=0,
            Vulnerabilities_count=0
        )
            open_count = sum(1 for entry in results if entry.get("State") == "open")
            add_exposed_port_count(email, open_count)
            asset_count = len(results)
            add_asset_count(email, asset_count)
        except Exception as e:
            return jsonify({"error": "Failed to update scan info", "message": str(e)}), 500
        

        return jsonify({'data': results}), 200
    except Exception as e:
        print(f"Exception occurred: {e}")  # Debug
        return jsonify({'error': 'Failed to fetch URL via SSH', 'message': str(e)}), 500

@bp.route('/new_subdomain', methods=['GET'])
@jwt_required()
def new_subdomain():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    identity = get_jwt_identity()
    email = identity.get("email")
    try:
        # Set up SSH client
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # Connect to the remote Kali instance
        ssh_client.connect(hostname=KALI_IP, username=KALI_USERNAME, key_filename=KALI_KEY_PATH)

        # Run the assetfinder command
        command = f"assetfinder --subs-only {domain}"
        print(f"Running command: {command}")  # Debug

        # Execute the command and capture both stdout and stderr
        stdin, stdout, stderr = ssh_client.exec_command(command)

        # Read stdout and stderr
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()

        # Check if there was any error in stderr
        if error:
            print(f"Error from stderr: {error}")  # Debug
            return jsonify({'error': 'Error while fetching subdomains', 'message': error}), 500

        # Check if no subdomains were found
        if not output:
            return jsonify({'error': 'No subdomains found'}), 404

        # Return the subdomains
        subdomains = output.splitlines()
        print("subdomains",len(subdomains))
        try:
            add_scan(
            email=email,
            new_total=1,
            new_date=[datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")],
            subdomain_count=0,  # Replace with real count if needed
            asset_count=0,
            exposed_port=0,
            passwordhash_count=0,
            Vulnerabilities_count=0
        )
            add_subdomain_count(email, len(subdomains))
        except Exception as e:
            return jsonify({"error": "Failed to update scan info", "message": str(e)}), 500
        return jsonify({'subdomains': subdomains})

    except Exception as e:
        print(f"Exception occurred: {e}")  # Debug
        return jsonify({'error': 'Failed to fetch subdomains via SSH', 'message': str(e)}), 500
@bp.route('/get_status', methods=['GET'])
@jwt_required()
def get_status():
    subdomain = request.args.get('domain')
    if not subdomain:
        return jsonify({"error": "Domain parameter is required"}), 400
    try:
        response = requests.get(f"http://{subdomain}", timeout=5)
        status_code = response.status_code
    except requests.exceptions.RequestException:
        status_code = "500"
    
    # Return status as a dictionary, not as a set
    return jsonify({'status': status_code})
@bp.route('/get_sipcalc', methods=['GET'])
@jwt_required()
def get_sipcalc():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    identity = get_jwt_identity()
    email = identity.get("email")
    command = f"nslookup {domain}"
    output, error = ssh_execute_command(KALI_IP, KALI_USERNAME, KALI_KEY_PATH, command)
    if error:
        return jsonify({'error': 'Error while fetching information', 'message': error}), 500
    else:
        host = parse_nslookup_output(output)
        host_decimal = host_to_decimal(host[0])
        host_hexa = host_to_hex(host[0])
        network_address,network_mask,network_mask_bits,broadcast_address,cisco_wildcard,hostmin,hostmax,total=extractall(host[0])
        total = int(total)
        total+=2
        network_mask_hex=host_to_hex(network_mask)
        try:
            add_scan(
            email=email,
            new_total=1,
            new_date=[datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")],
            subdomain_count=0,  # Replace with real count if needed
            asset_count=0,
            exposed_port=0,
            passwordhash_count=0,
            Vulnerabilities_count=0
        )
        except Exception as e:
            return jsonify({"error": "Failed to update scan info", "message": str(e)}), 500
        return jsonify({'Host Address':host[0],
                        'Host Address(decimal)':host_decimal,
                        'Host Address(Hex)':host_hexa,
                        'network-address': network_address,
                        'Network Mask': network_mask,
                        'Network Mask(bits)':network_mask_bits,
                        'Network Mask(hex)':network_mask_hex,
                        'Broadcast Address': broadcast_address,
                        'Cisco Wildcard': cisco_wildcard,
                        'Host-min': hostmin,
                        'Host-max':hostmax,
                        'Address in Network': total
                        })


def run_nikto(domain):
    """Run Nikto via SSH, wait dynamically for it to finish, and return the JSON output."""
    

    nikto_command = f"nikto -h {domain} -o output.json -Format json -nointeractive -maxtime 70s"
    
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=KALI_IP, username=KALI_USERNAME, key_filename=KALI_KEY_PATH)

        stdin, stdout, stderr = ssh.exec_command(nikto_command)

        start_time = time.time()
        while not stdout.channel.exit_status_ready():
            if time.time() - start_time > 75:
                break
            time.sleep(2)

        exit_status = stdout.channel.recv_exit_status()

        sftp = ssh.open_sftp()
        try:
            remote_file = sftp.file("output.json", "r")
            file_content = remote_file.read().decode("utf-8")
            remote_file.close()
        except FileNotFoundError:
            file_content = None
        sftp.close()

        ssh.close()

        if file_content:
            return json.loads(file_content), None
        else:
            return None, "Nikto scan completed, but no output file found"

    except Exception as e:
        return None, f"SSH command execution failed: {str(e)}"

@bp.route('/nikto', methods=['GET'])
@jwt_required()
def download_report():
    """Run Nikto and generate a downloadable PDF report."""
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    identity = get_jwt_identity()
    email = identity.get("email")
    nikto_data, error = run_nikto(domain)
    if error:
        return jsonify({"error": error}), 500

    pdf_buffer = generate_pdf_report(nikto_data)
    try:
        add_scan(
            email=email,
            new_total=1,
            new_date=[datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")],
            subdomain_count=0,  # Replace with real count if needed
            asset_count=0,
            exposed_port=0,
            passwordhash_count=0,
            Vulnerabilities_count=0
        )
    except Exception as e:
        return jsonify({"error": "Failed to update scan info", "message": str(e)}), 500


    return send_file(pdf_buffer, mimetype='application/pdf',
                     as_attachment=True, download_name=f"Nikto_Report_{domain}.pdf")

@bp.route('/cve',methods=['GET'])
@jwt_required()
def extract_technologies():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    identity = get_jwt_identity()
    email = identity.get("email")
    print(email)
    print(domain)
    command = f"timeout 10 whatweb -v {domain}"
    output, error = ssh_execute_command2(command)
    print(output,error)
    if error:
        return {"error": error}

    if not output:
        return jsonify({"error": "No output received"}), 500

    # Extract the "Summary" line
    summary_match = re.search(r'Summary\s*:\s*(.*)', output)
    if not summary_match:
        return jsonify({"error": "No Summary found"}), 500

    summary = summary_match.group(1)

    # Extract technologies from the summary (splitting by commas)
    technologies = extract_clean_technologies(summary)
    
    # return jsonify({"technologies": technologies})
    cve_results = extract_cve(technologies)
    print(cve_results)
    total_count = sum(len(cves) for cves in cve_results.values()) 
    print(total_count)

    try:
        add_scan(
            email=email,
            new_total=1,
            new_date=[datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")],
            subdomain_count=0,  # Replace with real count if needed
            asset_count=0,
            exposed_port=0,
            passwordhash_count=0,
            Vulnerabilities_count=0
        )
        add_Vulnerability_count(email,total_count)
    except Exception as e:
        return jsonify({"error": "Failed to update scan info", "message": str(e)}), 500
    return jsonify({"technologies": technologies, "cve_results": cve_results})
    

# @bp.route('/chat',methods=['POST'])
# def chat():
#     """Handles user queries, restricting responses to the project's document."""
#     data = request.json
#     user_message = data.get("message", "").strip()

#     if not user_message:
#         return jsonify({"error": "No message provided"}), 400

#     try:
#         model = genai.GenerativeModel("gemini-2.0-flash")

#         # Send the project document as context
#         prompt = f"""You are a chatbot that only answers based on the following project details:
#         ---
#         {project_context}
#         ---
#         If the user asks anything outside this document, reply with: "I don't have information about it."
#         User Query: {user_message}"""

#         response = model.generate_content(prompt)
#         return jsonify({"response": response.text})
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@bp.route('/chat', methods=['GET', 'POST'])
@jwt_required()
def chat():
    if request.method == 'POST':
        data = request.json
        user_message = data.get("message", "").strip()
        num_chunks = data.get("num_chunks", 10)
    else:  # GET method
        user_message = request.args.get("msg", "").strip()
        num_chunks = int(request.args.get("chunks", 5))

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    result = query_text_document(user_message, num_chunks)
    if result:
        return jsonify(result)
    else:
        return jsonify({"error": "No result found"}), 404

@bp.route('/crack_hash', methods=['POST'])
@jwt_required()
def crack_hash():
    data = request.get_json()
    hash_value = data.get("hash_value")
    hash_type = data.get("hash_type")
    identity = get_jwt_identity()
    email = identity.get("email")
    if not hash_value or not hash_type:
        return jsonify({"error": "Hash and hash_type are required"}), 400

    # 1. Save hash to a remote temp file on Kali
    remote_temp_hash = "/tmp/temp_hash.txt"
    echo_command = f"echo '{hash_value}' > {remote_temp_hash}"
    _, echo_error = ssh_execute_command(KALI_IP, KALI_USERNAME, KALI_KEY_PATH, echo_command)
    if not _ and echo_error:
        return jsonify({"error": f"Failed to write hash on Kali: {echo_error}"}), 500

    # 2. Run john on the remote file
    command = f"john --format={hash_type} --wordlist=/usr/share/wordlists/rockyou.txt {remote_temp_hash}"
    output, error = ssh_execute_command(KALI_IP, KALI_USERNAME, KALI_KEY_PATH, command)
    print(output)
    

    # Check if john actually cracked the password
    command_show = f"john --show --format={hash_type} {remote_temp_hash}"
    cracked_output, cracked_error = ssh_execute_command(KALI_IP, KALI_USERNAME, KALI_KEY_PATH, command_show)

    if cracked_error:
        return jsonify({"error": f"Error showing cracked passwords: {cracked_error}"}), 500

    if not cracked_output:
        return jsonify({"error": "No cracked passwords found"}), 500
    
    cracked_passwords = []
    lines = cracked_output.split("\n")
    for line in lines:
        if ":" in line:  # We expect a line in the format: 'hash:password'
            parts = line.split(":")
            if len(parts) > 1:
                cracked_passwords.append(parts[1].strip())
    if not cracked_passwords:
        return jsonify({"error": "No valid cracked passwords found"}), 500
    # Return only the cracked passwords
    try:
        add_passwordhash_count(email, len(cracked_passwords))   
    except Exception as e:
        return jsonify({"error": "Failed to update scan info", "message": str(e)}), 500
    return jsonify({"result": cracked_passwords})

@bp.route('/get_dashboard_data', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    identity = get_jwt_identity()
    email = identity.get("email")
    scan_info = get_scans_by_email(email)
    if not scan_info:
        return jsonify({"error": "No scan info found"}), 404
    return jsonify({"scan_info": scan_info})

