from flask import Blueprint, request, jsonify
from app.models.user import add_user, find_user, verify_user, check_password, update_user_password
from app.utils.email import send_verification_email, send_reset_password_email
from app.utils.token import confirm_token
import re
from flask_jwt_extended import create_access_token
from datetime import timedelta

# Ensure Blueprint is initialized before imports
bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']

    if find_user(email):
        return jsonify({'message': 'Email already registered'}), 400

    add_user(name, email, password)
    send_verification_email(email)

    return jsonify({'message': 'Registration successful. Check your email to verify your account.'}), 200


@bp.route('/confirm/<token>', methods=['GET'])
def confirm_email(token):
    try:
        # Confirm the token and extract the email
        email = confirm_token(token)
        if not email:
            return jsonify({"message": "Invalid or expired token"}), 400

        # Find the user by email
        user = find_user(email)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Set is_verified to True
        if verify_user(email):
            return """
                <!doctype html>
                <html lang="en">
                <head>
                    <title>Email Verified</title>
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.close();
                            }, 2000); // Closes the page after 2 seconds
                        };
                    </script>
                </head>
                <body>
                    
                </body>
                </html>
            """
        else:
            return jsonify({"message": "Error verifying email"}), 500

    except Exception as e:
        return jsonify({"message": "Error verifying email", "error": str(e)}), 500


@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    # Find the user by email
    user = find_user(email)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Check if password is correct
    if not check_password(email, password):
        return jsonify({'message': 'Incorrect password'}), 400

    # Check if the user's email is verified
    if not user['is_verified']:  # This will check if the value is False
        return jsonify({'message': 'Please verify your email before logging in'}), 400
    access_token = create_access_token(
    identity={'email': email},  # Include user information in the token
    expires_delta=timedelta(hours=1)  # Token expiration (adjust as needed)
)
    return jsonify({'message': 'Login successful','access_token': access_token}), 200


@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data['email']

    # Check if the user exists in the database
    user = find_user(email)
    if not user:
        return jsonify({'message': 'Email not registered'}), 404

    # Generate a password reset token
    # token = generate_confirmation_token(email)

    # Send reset password email
    send_reset_password_email(email)

    return jsonify({'message': 'Password reset email sent. Please check your email.'}), 200


@bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if request.method == 'GET':
        # Verify the token
        email = confirm_token(token)
        if not email:
            return '''
                <div style="color: red; font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Invalid or expired token</h2>
                    <p>Please try resetting your password again.</p>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.close();
                        }, 2000); // Closes the page after 2 seconds
                    };
                </script>
                ''', 400

        # Render a simple HTML form for entering a new password
        return '''
            <div style="font-family: Arial, sans-serif; margin: 50px auto; max-width: 400px; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                <h1 style="color: #333;">Cyber-Matrix</h1>
                <form method="POST" style="margin-top: 20px;">
                    <div style="margin-bottom: 15px; position: relative;">
                        <label style="display: block; margin-bottom: 5px; color: #333;">New Password:</label>
                        <input type="password" id="new_password" name="new_password" required 
                            style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                        <span onclick="togglePassword('new_password', 'toggle_new')" id="toggle_new" 
                            style="position: absolute; top: 37px; right: 10px; cursor: pointer; color: #555;">Show</span>
                    </div>
                    <div style="margin-bottom: 20px; position: relative;">
                        <label style="display: block; margin-bottom: 5px; color: #333;">Confirm Password:</label>
                        <input type="password" id="confirm_password" name="confirm_password" required 
                            style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 16px;">
                        <span onclick="togglePassword('confirm_password', 'toggle_confirm')" id="toggle_confirm" 
                            style="position: absolute; top: 37px; right: 10px; cursor: pointer; color: #555;">Show</span>
                    </div>
                    <div style="text-align: left; margin-bottom: 20px; font-size: 14px; color: #555;">
                        <p>Password must meet the following requirements:</p>
                        <ul style="text-align: left; padding-left: 20px; color: #666;">
                            <li>At least 8 characters</li>
                            <li>At least 1 special character (e.g., @, $, !, %, *, ?)</li>
                            <li>At least 1 number</li>
                            <li>At least 1 uppercase letter</li>
                        </ul>
                    </div>
                    <button type="submit" 
                            style="background-color: #333333; color: white; border: none; padding: 10px 15px; border-radius: 5px; font-size: 16px; cursor: pointer;">
                        Reset Password
                    </button>
                </form>
            </div>

            <script>
                function togglePassword(inputId, toggleId) {
                    const input = document.getElementById(inputId);
                    const toggle = document.getElementById(toggleId);
                    if (input.type === "password") {
                        input.type = "text";
                        toggle.textContent = "Hide"; // Change icon to indicate visibility
                    } else {
                        input.type = "password";
                        toggle.textContent = "Show"; // Change icon back
                    }
                }
            </script>
        '''

    elif request.method == 'POST':
        # Verify the token
        email = confirm_token(token)
        if not email:
            return '''
                <div style="color: red; font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Invalid or expired token</h2>
                    <p>Please try resetting your password again.</p>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.close();
                        }, 2000); // Closes the page after 2 seconds
                    };
                </script>
            ''', 400

        # Get new password data from form
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        password_regex = r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'

        # Ensure passwords match
        if new_password != confirm_password:
            return '''
                <div style="color: red; font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Passwords do not match</h2>
                    <p>Please try again.</p>
                    <a href="javascript:history.back()" 
                       style="display: inline-block; margin-top: 20px; color: #333333; text-decoration: none; font-weight: bold;">Go Back</a>
                </div>
            ''', 400

        if not re.match(password_regex, new_password):
            return '''
                <div style="color: red; font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Password does not meet requirements</h2>
                    <p>Your password must have:</p>
                    <ul style="text-align: left; margin-left: 30%; margin-top: 10px;">
                        <li>At least 8 characters</li>
                        <li>At least 1 uppercase letter</li>
                        <li>At least 1 number</li>
                        <li>At least 1 special character (@, $, !, %, *, ?, &)</li>
                    </ul>
                    <a href="javascript:history.back()" 
                       style="display: inline-block; margin-top: 20px; color: #333333; text-decoration: none; font-weight: bold;">Go Back</a>
                </div>
            ''', 400

        # Update the user's password in the database
        if update_user_password(email, new_password):
            return """
                <!doctype html>
                <html lang="en">
                <head>
                    <title>Password reset</title>
                    <div style="color: green; font-family: Arial, sans-serif;">
                        Password updated successfully! You can now log in with your new password.
                    </div>
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.close();
                            }, 2000); // Closes the page after 2 seconds
                        };
                    </script>
                </head>
                <body>
                    
                </body>
                </html>
            """
        else:
            return '''
                <div style="color: red; font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Error updating password</h2>
                    <p>Please try again later.</p>
                    <a href="javascript:history.back()" 
                       style="display: inline-block; margin-top: 20px; color: #007BFF; text-decoration: none; font-weight: bold;">Go Back</a>
                </div>
            ''', 500