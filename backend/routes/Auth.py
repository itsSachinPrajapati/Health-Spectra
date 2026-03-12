
from flask import Blueprint, request, jsonify
from extensions import db
from models import User

auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.route("/save-user", methods=["POST"])
def save_user():

    data = request.get_json() or {}

    email = data.get("email")
    name = data.get("name", "")
    role = data.get("role", "patient")

    if not email or not role:
        return jsonify({
            "success": False,
            "error": "Email and role required"
        }), 400


    # Check if user already exists
    user = User.query.filter_by(email=email).first()

    if user:

        # If role is different → block
        if user.role != role:
            return jsonify({
                "success": False,
                "error": "This email is already registered as " + user.role
            }), 400

        # If same role → allow login
        return jsonify({
            "success": True,
            "message": "User already exists",
            "role": user.role
        }), 200


    # Create new user
    new_user = User(
        email=email,
        name=name,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User saved",
        "role": role
    }), 201