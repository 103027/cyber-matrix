from flask import Flask
from app import create_app
from app.routes.auth import bp as auth_bp
from app.routes.subdomains import bp as subdomains_bp

app = create_app()

# Register Blueprints
# app.register_blueprint(auth_bp, url_prefix='/auth')
# app.register_blueprint(subdomains_bp, url_prefix='/subdomains')

if __name__ == '__main__':
    app.run(debug=True)