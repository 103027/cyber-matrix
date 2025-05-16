from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app

# Hash and store the password
def add_user(name, email, password):
    db = current_app.db
    hashed_password = generate_password_hash(password)  # Hash the password before storing it
    db.users.insert_one({'name': name, 'email': email, 'password': hashed_password, 'is_verified': False})

# Find a user by email
def find_user(email):
    db = current_app.db
    return db.users.find_one({'email': email})

# Verify the user's email
def verify_user(email):
    db = current_app.db
    result = db.users.update_one({'email': email}, {'$set': {'is_verified': True}})
    return result.modified_count > 0

# Check the user's password (compare the hash)
def check_password(email, password):
    user = find_user(email)
    if user and check_password_hash(user['password'], password):  # Compare hashed password
        return True
    return False

def update_user_password(email, new_password):
    db = current_app.db
    hashed_password = generate_password_hash(new_password)
    result = db.users.update_one({"email": email}, {"$set": {"password": hashed_password}})
    return result.modified_count > 0