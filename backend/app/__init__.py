# # app/__init__.py or wherever your create_app function is defined
# from flask import Flask
# from flask_mail import Mail
# from pymongo import MongoClient

# mail = Mail()

# def create_app():
#     global db
#     app = Flask(__name__)

#     # Load configuration
#     app.config.from_pyfile('../config.py')

#     # Initialize Flask-Mail
#     mail.init_app(app)

#     # Connect to MongoDB
    
#     client = MongoClient(app.config['MONGO_URI'])
#     app.db = client[app.config['MONGO_DBNAME']] # Create db instance
#     # app.config['DB'] = db  # Store db in the config object

#     # Register routes after app is initialized
#     from app.routes.auth import bp as auth_bp
#     from app.routes.subdomains import bp as subdomains_bp
#     app.register_blueprint(auth_bp)
#     app.register_blueprint(subdomains_bp)
    
#     return app

from flask import Flask
from flask_mail import Mail
from pymongo import MongoClient
from flask_cors import CORS

mail = Mail()

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_pyfile('../config.py')

    # Initialize Flask-Mail
    mail.init_app(app)

    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Connect to MongoDB
    try:
        client = MongoClient(app.config['MONGO_URI'])
        app.db = client[app.config['MONGO_DBNAME']]
    except Exception as e:
        raise RuntimeError(f"Failed to connect to MongoDB: {e}")

    # Register blueprints
    from app.routes.auth import bp as auth_bp
    from app.routes.subdomains import bp as subdomains_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(subdomains_bp)

    return app

