from itsdangerous import URLSafeTimedSerializer
from flask import current_app  # Use current_app to access Flask context

def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='email-confirmation-salt')

def confirm_token(token, expiration=3600):
    try:
        serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        email = serializer.loads(token, salt='email-confirmation-salt', max_age=expiration)
        return email
    except:
        return False
