from extensions import db
from datetime import datetime
import pytz

# -------- Helper --------
def utcnow():
    return datetime.utcnow().replace(tzinfo=pytz.UTC)


# -------- User --------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100))
    role = db.Column(db.String(50))
    clerk_id = db.Column(db.String(50))

    created_on = db.Column(db.DateTime, default=utcnow)


# -------- Doctor --------
class Doctor(db.Model):
    __tablename__ = "doctor"

    id = db.Column(db.Integer, primary_key=True)
    specialist = db.Column(db.String(100))
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))


# -------- Consultation --------
class Consultation(db.Model):
    __tablename__ = "consultations"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    email = db.Column(db.String(120))

    notes = db.Column(db.Text)

    selected_doctor = db.Column(db.String(100))
    session_id = db.Column(db.String(50))

    messages = db.Column(db.Text)
    report = db.Column(db.Text)

    created_on = db.Column(db.DateTime, default=utcnow)


# -------- Category --------
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), unique=True, nullable=False)
    image = db.Column(db.String(255))


# -------- Doctor List --------
class DoctorList(db.Model):
    __tablename__ = "doctorlist"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100))
    address = db.Column(db.String(255))

    patients = db.Column(db.Integer)
    years_of_experience = db.Column(db.Integer)

    about = db.Column(db.Text)

    category_id = db.Column(db.String(100))
    category = db.Column(db.String(100))

    phone = db.Column(db.String(20))
    image = db.Column(db.String(255))

    queue_start_time = db.Column(db.Time)
    queue_end_time = db.Column(db.Time)

    slot_start_time = db.Column(db.Time)
    slot_end_time = db.Column(db.Time)

    slot_duration = db.Column(db.Integer)

    email = db.Column(db.String(255))
    clerk_user_id = db.Column(db.String(255))

    specialization = db.Column(db.String(255))
    experience = db.Column(db.Integer)

    consultation_fee = db.Column(db.Integer)
    description = db.Column(db.Text)

    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)

    appointments = db.relationship("Appointment", backref="doctor", lazy=True)


# -------- Appointment --------
class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    doctor_id = db.Column(db.Integer, db.ForeignKey("doctorlist.id"))

    doctor_name = db.Column(db.String(255))
    patient_name = db.Column(db.String(255))
    patient_email = db.Column(db.String(255))

    appointment_date = db.Column(db.Date)

    queue_number = db.Column(db.Integer)

    booking_type = db.Column(
        db.Enum("queue", "slot"), default="queue"
    )

    time_slot = db.Column(db.String(50))

    issue = db.Column(db.Text)

    status = db.Column(
        db.Enum("upcoming", "expired", "cancelled"),
        default="upcoming"
    )

    video_session_id = db.Column(db.String(255))
    video_token = db.Column(db.String(512))

    doctor_address = db.Column(db.String(255))
    doctor_image = db.Column(db.String(255))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)