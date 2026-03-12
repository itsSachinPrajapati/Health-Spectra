import os
import urllib.parse
from flask import Flask, send_from_directory
from flask_cors import CORS   #type: ignore
from dotenv import load_dotenv
from extensions import db

# ----------------- ENV -----------------
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
load_dotenv()

# ----------------- FLASK APP -----------------
app = Flask(__name__)

# Enable CORS for frontend
from flask_cors import CORS

CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:5174"]}},
    supports_credentials=True,
    methods=["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"]
)
# ----------------- DATABASE CONFIG -----------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)

# SQLite fallback
SQLITE_PATH = os.path.join(INSTANCE_DIR, "app.db")
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{SQLITE_PATH}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# MySQL (if set in .env)
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = urllib.parse.quote_plus(os.getenv("MYSQL_PASSWORD", ""))
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_DB = os.getenv("MYSQL_DB", "healthspectra")

app.config['SQLALCHEMY_BINDS'] = {
    "mysql_db": f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
}

# ----------------- INITIALIZE DB -----------------
db.init_app(app)

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
app.register_blueprint(match_doctor_bp, url_prefix="/api")
app.register_blueprint(consultation_bp, url_prefix="/api")
app.register_blueprint(voicebot_bp, url_prefix="/api")
app.register_blueprint(predict_bp, url_prefix="/api")
app.register_blueprint(report_bp, url_prefix="/api")
app.register_blueprint(users_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(categories_bp, url_prefix="/api")
app.register_blueprint(popular_doctors_bp)
app.register_blueprint(book_appointment_bp, url_prefix="")
app.register_blueprint(doctor_bp, url_prefix="")

# ----------------- ROUTES -----------------
@app.route("/")
def home():
    return "Hello, world!"

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory("static", filename)

# ----------------- CREATE TABLES -----------------
with app.app_context():
    db.create_all()  # creates all tables in default + binds

# ----------------- RUN SERVER -----------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
