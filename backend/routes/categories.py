from flask import Blueprint, jsonify
from models import Category  

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/doctor-categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()  
    result = []
    for cat in categories:
        result.append({
            "id": cat.id,
            "name": cat.name,
            "image": cat.image   # just store relative path
        })
    return jsonify(result)
