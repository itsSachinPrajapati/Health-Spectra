import os
import urllib.parse
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db

# ----------------- ENV -----------------
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
load_dotenv()

# ----------------- FLASK APP -----------------
app = Flask(_name_)

CORS(
    app,
    resources={r"/api/*": {
        "origins": [
            "https://healthspectra.site",
            "https://www.healthspectra.site",
            "https://doctor.healthspectra.site"
        ]
    }},
    supports_credentials=True
)

# ----------------- DATABASE CONFIG -----------------

MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = urllib.parse.quote_plus(os.getenv("MYSQL_PASSWORD", ""))
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_DB = os.getenv("MYSQL_DB")

if MYSQL_USER and MYSQL_PASSWORD and MYSQL_HOST and MYSQL_DB:
    try:
        app.config["SQLALCHEMY_DATABASE_URI"] = (
            f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
        )
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

        db.init_app(app)
        print("✅ DB initialized")

    except Exception as e:
        print("❌ DB init failed:", e)
else:
    print("⚠️ DB config missing — running without DB")

# ----------------- IMPORT MODELS & ROUTES -----------------
from models import User, Consultation, Category, DoctorList, Appointment

from routes.consultation import consultation_bp
from routes.predict import predict_bp
from routes.doctor_match import match_doctor_bp
from routes.VoiceBot import voicebot_bp
from routes.ReportAnalyzer import report_bp
from routes.Users import users_bp
from routes.Auth import auth_bp
from routes.categories import categories_bp
from routes.populardoctors import popular_doctors_bp
from routes.book_appointment import book_appointment_bp
from routes.doctor_portal import doctor_bp

# ----------------- REGISTER BLUEPRINTS -----------------

# Non-DB critical routes (always needed)
app.register_blueprint(match_doctor_bp, url_prefix="/api")
app.register_blueprint(consultation_bp, url_prefix="/api")
app.register_blueprint(voicebot_bp, url_prefix="/api")
app.register_blueprint(predict_bp, url_prefix="/api")
app.register_blueprint(report_bp, url_prefix="/api")

# DB dependent routes (still included, but will fail only if used)
app.register_blueprint(users_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(categories_bp, url_prefix="/api")
app.register_blueprint(popular_doctors_bp)
app.register_blueprint(book_appointment_bp)
app.register_blueprint(doctor_bp)

# ----------------- ROUTES -----------------
@app.route("/")
def home():
    return "HealthSpectra API running"

@app.route("/health")
def health():
    return "OK"

@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)

# ----------------- SAFE TABLE CREATION -----------------
try:
    with app.app_context():
        db.create_all()
        print("✅ Tables checked/created")
except Exception as e:
    print(f"⚠️ Database initialization warning: {e}")

# ----------------- RUN SERVER -----------------
if _name_ == "_main_":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Starting server on port {port}")
    app.run(host="0.0.0.0", port=port)
