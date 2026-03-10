from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from ReportAnalyzer.Report import analyze_report  

report_bp = Blueprint("report_bp", __name__)

ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "tiff"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@report_bp.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    uploaded_file = request.files["file"]

    if uploaded_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(uploaded_file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    uploaded_file.filename = secure_filename(uploaded_file.filename)

    # 🔹 Instead of text, return structured JSON
    analysis = analyze_report(uploaded_file)

    return jsonify({"analysis": analysis})
