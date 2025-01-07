import paramiko, requests, re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('subdomains', __name__)

KALI_IP = "3.92.229.147"
KALI_USERNAME = "kali"
# KALI_KEY_PATH = "D:/Sem 7/FYP-1/kali.pem"
KALI_KEY_PATH = "/Users/hassanmuzaffar/Downloads/kali.pem"
WORDLIST_PATH = "/usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt"

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

    results["domain"] = domain

    return jsonify(results)

@bp.route('/get_ip_ports', methods=['GET'])
@jwt_required()
def get_ip_ports():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400
    
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

