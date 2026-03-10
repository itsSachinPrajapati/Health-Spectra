# backend/routes/auth.py
from flask import Blueprint, request, jsonify
from extensions import db
from models import User

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/save-user", methods=["POST"])
def save_user():
    data = request.get_json() or {}
    email = data.get("email")
    name = data.get("name", "")
    role = data.get("role", "patient")  # must come from frontend selection

    if not email or not role:
        return jsonify({"success": False, "error": "Email and role required"}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"success": True, "message": "User already exists"}), 200

    user = User(email=email, name=name, role=role)
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "message": "User saved"}), 200
