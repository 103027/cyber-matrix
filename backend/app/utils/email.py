from flask_mail import Message
from flask import current_app
from app.utils.token import generate_confirmation_token
from app import mail

def send_verification_email(email):
    token = generate_confirmation_token(email)
    # backend_url = current_app.config.get("BACKEND_URL", "http://localhost:5000")
    verification_path = f"/confirm/{token}"

    msg = Message(
        "Verify Your Email",
        recipients=[email],
        sender=current_app.config["MAIL_DEFAULT_SENDER"],  # Explicitly use default sender
    )
    # msg.body = f"Click the link to verify your email: {verification_link}"
    msg.body = (
        f"Click the link below to verify your email:\n\n"
        f"http://127.0.0.1:5000{verification_path}\n\n"
        f"If you did not request this, please ignore this email."
    )
    mail.send(msg)

def send_reset_password_email(email):
    token = generate_confirmation_token(email)
    reset_link = f"/reset-password/{token}"
    #reset_link = f"http://127.0.0.1:5000/reset-password/{token}"

    msg = Message(
        "Reset Your Password",
        recipients=[email],
        sender=current_app.config["MAIL_DEFAULT_SENDER"],
    )
    msg.body = (
        f"Click the link below to reset your password:\n\n"
        f"http://127.0.0.1:5000{reset_link}\n\n"
        f"If you did not request this, please ignore this email."
    )
    mail.send(msg)

