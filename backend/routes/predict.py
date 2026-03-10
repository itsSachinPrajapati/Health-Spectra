# backend/routes/predict.py

from flask import Blueprint, request, jsonify, send_from_directory
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import os
import gdown

predict_bp = Blueprint("predict", __name__)

# ---- Paths ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))               # backend/routes
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))        # backend
MODEL_PATH = os.path.join(PROJECT_ROOT, "notebooks", "models", "model.h5")

# ---- Ensure model exists (download if missing) ----
if not os.path.exists(MODEL_PATH):
    print("Model not found. Downloading from Google Drive...")

    FILE_ID = "1MyvbSeeZGyUcx9ZGEx4KP42Wf7gitK5G"
    url = f"https://drive.google.com/uc?id={FILE_ID}"

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    gdown.download(url, MODEL_PATH, quiet=False)

    print("Model downloaded successfully.")

# ---- Load model once ----
model = load_model(MODEL_PATH)

# Make sure order matches training
CLASS_LABELS = ['glioma', 'meningioma', 'notumor', 'pituitary']

# ---- Upload folder ----
UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def prepare(image_path, size=128):
    img = load_img(image_path, target_size=(size, size))
    arr = img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr


@predict_bp.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files or request.files["file"].filename == "":
        return jsonify({"error": "No file uploaded"}), 400

    f = request.files["file"]
    save_path = os.path.join(UPLOAD_FOLDER, f.filename)
    f.save(save_path)

    x = prepare(save_path)

    preds = model.predict(x)
    idx = int(np.argmax(preds, axis=1)[0])
    conf = float(np.max(preds, axis=1)[0])

    label = CLASS_LABELS[idx]
    display = "No Tumor" if label == "notumor" else f"Tumor: {label}"

    return jsonify({
        "result": display,
        "raw_label": label,
        "confidence": round(conf * 100, 2),
        "file_url": f"/api/uploads/{f.filename}"
    })


@predict_bp.route("/uploads/<filename>", methods=["GET"])
def uploaded(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)