# models.py
from extensions import db
from datetime import datetime
import pytz

# ----------------- Helper for UTC datetime -----------------
def utcnow():
    return datetime.utcnow().replace(tzinfo=pytz.UTC)

# ----------------- User (SQLite) -----------------
class User(db.Model):
    __tablename__ = "user"
    __bind_key__ = None  # default SQLite

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100))
    role = db.Column(db.String(50))
    clerk_id = db.Column(db.String(50))
    created_on = db.Column(db.DateTime, default=utcnow)

    def __repr__(self):
        return f"<User {self.id} - {self.email}>"

class Doctor(db.Model):
    __tablename__ = "doctor"
    __bind_key__ = "mysql_db"  # MySQL bind

    id = db.Column(db.Integer, primary_key=True)
    specialist = db.Column(db.String(100))
    description = db.Column(db.String(255))
    image = db.Column(db.String(255))

    def __repr__(self):
        return f"<Doctor {self.id} - {self.specialist}>"


# ----------------- Consultation (SQLite) -----------------
class Consultation(db.Model):
    __tablename__ = "consultation"
    __bind_key__ = None  # default SQLite

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    email = db.Column(db.String(120))
    notes = db.Column(db.Text)
    selected_doctor = db.Column(db.String(100))
    session_id = db.Column(db.String(50))
    messages = db.Column(db.Text)
    report = db.Column(db.Text)
    created_on = db.Column(db.DateTime, default=utcnow)

    def __repr__(self):
        return f"<Consultation {self.id} - {self.session_id}>"


# ----------------- Category (MySQL) -----------------
class Category(db.Model):
    __tablename__ = "categories"
    __bind_key__ = "mysql_db"  # MySQL

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    image = db.Column(db.String(255))

    def __repr__(self):
        return f"<Category {self.id} - {self.name}>"


# ----------------- DoctorList (MySQL) -----------------
class DoctorList(db.Model):
    __tablename__ = "doctorlist"
    __bind_key__ = "mysql_db"

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
    
    
class Appointment(db.Model):
    __tablename__ = "appointments"
    __bind_key__ = "mysql_db"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctorlist.id"))

    
    doctor_name = db.Column(db.String(255))
    patient_name = db.Column(db.String(255))
    patient_email = db.Column(db.String(255))

    appointment_date = db.Column(db.Date)

    # NEW
    queue_number = db.Column(db.Integer)
    booking_type = db.Column(db.Enum("queue", "slot"), default="queue")

    time_slot = db.Column(db.String(50))

    issue = db.Column(db.Text)

    status = db.Column(db.Enum("upcoming", "expired", "cancelled"), default="upcoming")

    video_session_id = db.Column(db.String(255))
    video_token = db.Column(db.String(512))

    doctor_address = db.Column(db.String(255))
    doctor_image = db.Column(db.String(255))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    doctor = db.relationship("DoctorList", backref="appointments")