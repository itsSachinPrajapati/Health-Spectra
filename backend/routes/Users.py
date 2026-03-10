from flask import Blueprint, request, jsonify
from extensions import db
from models import User

users_bp = Blueprint("users", __name__)

# Save or update user
@users_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    email = data.get("email")
    role = data.get("role", "patient")
    name = data.get("name", "")

    if not email:
        return jsonify({"error": "Email required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, name=name, role=role)
        db.session.add(user)
    else:
        user.role = role
        user.name = name
    db.session.commit()

    return jsonify({"message": "User saved"}), 201

# Fetch user by email
@users_bp.route("/users/<email>", methods=["GET"])
def get_user(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "email": user.email,
        "name": user.name,
        "role": user.role
    }), 200



