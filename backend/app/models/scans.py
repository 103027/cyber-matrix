from flask import current_app
from datetime import datetime

# Add a scan record for a user
def add_scan(email, new_total, new_date, subdomain_count, asset_count, exposed_port, passwordhash_count):
    db = current_app.db

    update_result = db.scans.update_one(
        {'email': email},  # match by email only
        {
            '$inc': {'total_count': new_total},
            '$push': {'date': {'$each': new_date}},
            '$setOnInsert': {
                'subdomain_count': subdomain_count,
                'asset_count': asset_count,
                'expose_port': exposed_port,
                'passwordhash_count': passwordhash_count
            }
        },
        upsert=True
    )

    return update_result.modified_count > 0 or update_result.upserted_id is not None

def add_subdomain_count(email, new_subdomain_count):
    db = current_app.db
    update_result = db.scans.update_one(
        {'email': email},
        {'$inc': {'subdomain_count': new_subdomain_count}}
    )
    return update_result.modified_count > 0
def add_exposed_port_count(email, new_exposed_port_count):
    db = current_app.db
    update_result = db.scans.update_one(
        {'email': email},
        {'$inc': {'expose_port': new_exposed_port_count}}
    )
    return update_result.modified_count > 0
def add_asset_count(email, new_asset_count):
    db = current_app.db
    update_result = db.scans.update_one(
        {'email': email},
        {'$inc': {'asset_count': new_asset_count}}
    )
    return update_result.modified_count > 0
# Retrieve all scans for a given user
def add_passwordhash_count(email, new_passwordhash_count):
    db = current_app.db
    update_result = db.scans.update_one(
        {'email': email},
        {'$inc': {'passwordhash_count': new_passwordhash_count}}
    )
    return update_result.modified_count > 0
def get_scans_by_email(email):
    db = current_app.db
    scans = list(db.scans.find({'email': email}))
    for scan in scans:
        scan.pop('_id', None)  # Safely remove the _id field if it exists
    return scans

