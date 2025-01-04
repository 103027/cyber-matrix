import paramiko, requests, re
from flask import Blueprint, request, jsonify

bp = Blueprint('subdomains', __name__)

KALI_IP = "3.92.229.147"
KALI_USERNAME = "kali"
KALI_KEY_PATH = "D:/Sem 7/FYP-1/kali.pem"
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



@bp.route('/get_subdomains', methods=['GET'])
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
def get_target_info():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({"error": "Domain parameter is required"}), 400

    

    commands = {
        "dns": f"nmap --script dns-brute -sn {domain} | head -n 20",
        "ip": f"nslookup {domain}",
        "common_names": f"echo | openssl s_client -connect {domain}:443 2>/dev/null | openssl x509 -noout -subject -issuer",
        "organization": f"whois {domain} | grep -i 'Registrant Organization' | awk -F': ' '{{print $2}}'"
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

    results["domain"] = domain

    return jsonify(results)
