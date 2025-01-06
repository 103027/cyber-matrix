from flask import Blueprint, request, jsonify
from app.models.user import add_user, find_user, verify_user, check_password, update_user_password
from app.utils.email import send_verification_email, send_reset_password_email
from app.utils.token import confirm_token

bp = Blueprint('auth', __name__)  # Ensure Blueprint is initialized before imports

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['password']
    
    if find_user(email):
        return jsonify({'message': 'Email already registered'}), 400
    
    add_user(name, email,password)
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
    
    return jsonify({'message': 'Login successful'}), 200

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
                    <div style="color: red; font-family: Arial, sans-serif;">
                        Invalid or expired token. Please try resetting your password again.
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
            <form method="POST">
                <label>New Password:</label>
                <input type="password" name="new_password" required><br>
                <label>Confirm Password:</label>
                <input type="password" name="confirm_password" required><br>
                <button type="submit">Reset Password</button>
            </form>
        '''

    elif request.method == 'POST':
        # Verify the token
        email = confirm_token(token)
        if not email:
            return '''
                <div style="color: red; font-family: Arial, sans-serif;">
                    Invalid or expired token. Please try resetting your password again.
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

        # Ensure passwords match
        if new_password != confirm_password:
            return '''
                <div style="color: red; font-family: Arial, sans-serif;">
                    Passwords do not match. Please try again.
                </div>
                <a href="javascript:history.back()">Go Back</a>
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
                <div style="color: red; font-family: Arial, sans-serif;">
                    Error updating password. Please try again later.
                </div>
                <a href="javascript:history.back()">Go Back</a>
            ''', 500
