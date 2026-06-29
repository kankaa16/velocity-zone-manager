from flask import Blueprint, request

from flask_jwt_extended import jwt_required

from flask_jwt_extended import create_access_token

from app.models.user import User
from app.services.auth_service import create_user, get_user_by_email
from app.utils.response import success, error

auth_bp=Blueprint("auth", __name__)

@auth_bp.post("/signup")
def signup():

    body=request.get_json()

    name=body.get("name")
    email=body.get("email")
    password=body.get("password")

    if not all([name, email, password]):
        return error("All fields are required.")

    if get_user_by_email(email):
        return error("Email already exists.")

    create_user(name, email, password)

    return success(
        "User created successfully.",
        status=201
    )

@auth_bp.post("/login")
def login():

    body=request.get_json()

    email=body.get("email")
    password=body.get("password")

    user=User.query.filter_by(email=email).first()

    if not user:
        return error("Invalid credentials.", 401)

    if not user.check_password(password):
        return error("Invalid credentials.", 401)

    token=create_access_token(
        identity=str(user.id)
    )

    return success(
        "Login successful.",
        {
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }
    )