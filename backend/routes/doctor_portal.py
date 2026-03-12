from flask import Blueprint, request, jsonify
from extensions import db
from models import DoctorList, Appointment
from datetime import date

import os
from werkzeug.utils import secure_filename
from flask import request, jsonify

UPLOAD_FOLDER = "static/images/doctors"

doctor_bp = Blueprint("doctor_bp", __name__)


# ---------------------------------------------------
# Helper: convert doctor model to JSON
# ---------------------------------------------------
def doctor_to_dict(d):
    return {
        "id": d.id,
        "name": d.name,
        "email": d.email,
        "address": d.address,
        "phone": d.phone,
        "image": d.image,
        "patients": d.patients,
        "experience": d.years_of_experience,
        "specialization": d.category,
        "about": d.about,
        "consultation_fee": d.consultation_fee,
        "clerk_user_id": d.clerk_user_id,
        "created_at": str(d.created_at)
    }


# ---------------------------------------------------
# 1 Check if logged-in user is a doctor
# ---------------------------------------------------
@doctor_bp.route("/api/doctors/check/<clerk_user_id>", methods=["GET"])
def check_doctor(clerk_user_id):

    doctor = DoctorList.query.filter_by(clerk_user_id=clerk_user_id).first()

    if not doctor:
        return jsonify({"error": "Not authorized as doctor"}), 403

    return jsonify(doctor_to_dict(doctor))


# ---------------------------------------------------
# 2 Get Doctor Profile
# ---------------------------------------------------
@doctor_bp.route("/api/doctors/me/<clerk_user_id>", methods=["GET"])
def get_doctor_profile(clerk_user_id):

    doctor = DoctorList.query.filter_by(clerk_user_id=clerk_user_id).first()

    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    return jsonify(doctor_to_dict(doctor))


# ---------------------------------------------------
# 3 Update Doctor Profile
# ---------------------------------------------------
@doctor_bp.route("/api/doctors/update-profile", methods=["POST"])
def update_profile():

    clerk_user_id = request.form.get("clerk_user_id")

    if not clerk_user_id:
        return jsonify({"error": "Missing clerk_user_id"}), 400

    doctor = DoctorList.query.filter_by(
        clerk_user_id=clerk_user_id
    ).first()

    # Create doctor if not found
    if not doctor:
        doctor = DoctorList(clerk_user_id=clerk_user_id)
        db.session.add(doctor)

    # Update fields
    doctor.name = request.form.get("name")
    doctor.address = request.form.get("address")
    doctor.category = request.form.get("specialization")
    doctor.phone = request.form.get("phone")
    doctor.consultation_fee = request.form.get("consultation_fee")
    doctor.years_of_experience = int(request.form.get("experience") or 0)
    doctor.consultation_fee = int(request.form.get("consultation_fee") or 0)
    doctor.about = request.form.get("description") or ""

    # Handle image upload
    file = request.files.get("image")

    if file:
        filename = secure_filename(file.filename)

        upload_folder = os.path.join("static", "images", "doctors")
        os.makedirs(upload_folder, exist_ok=True)

        save_path = os.path.join(upload_folder, filename)
        file.save(save_path)

        doctor.image = f"/static/images/doctors/{filename}"

    db.session.commit()

    return jsonify({
        "message": "Doctor profile updated successfully"
    })
# ---------------------------------------------------
# 4 Doctor Dashboard
# ---------------------------------------------------


@doctor_bp.route("/api/doctors/dashboard/<clerk_user_id>", methods=["GET"])
def doctor_dashboard(clerk_user_id):

    doctor = DoctorList.query.filter_by(clerk_user_id=clerk_user_id).first()

    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    today = date.today()

    # total appointments
    total_appointments = Appointment.query.filter(
        Appointment.doctor_id == doctor.id
    ).count()

    # queue today count
    queue_today = Appointment.query.filter(
        Appointment.doctor_id == doctor.id,
        Appointment.booking_type == "queue",
        Appointment.appointment_date == today
    ).count()

    # slots today count
    slots_today = Appointment.query.filter(
        Appointment.doctor_id == doctor.id,
        Appointment.booking_type == "slot",
        Appointment.appointment_date == today
    ).count()

    # queue list for table
    queue_list_db = Appointment.query.filter(
        Appointment.doctor_id == doctor.id,
        Appointment.booking_type == "queue",
        Appointment.appointment_date == today
    ).order_by(Appointment.queue_number).all()

    queue_list = []

    for a in queue_list_db:
        queue_list.append({
            "queue_number": a.queue_number,
            "patient_name": a.patient_name,
            "issue": a.issue
        })

    return jsonify({
        "total_appointments": total_appointments,
        "queue_today": queue_today,
        "slots_today": slots_today,
        "queue_list": queue_list
    })

# ---------------------------------------------------
# 5 Doctor Appointments
# ---------------------------------------------------
@doctor_bp.route("/api/appointments/doctor/<int:doctor_id>", methods=["GET"])
def doctor_appointments(doctor_id):

    doctor = DoctorList.query.get(doctor_id)

    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    appointments = Appointment.query.filter_by(
        doctor_id=doctor.id
    ).order_by(Appointment.date.desc()).all()

    result = []

    for a in appointments:
        result.append({
            "id": a.id,
            "patient_name": a.patient_name,
            "patient_email": a.patient_email,
            "date": str(a.date),
            "time": str(a.time),
            "status": a.status,
            "meeting_link": a.meeting_link
        })

    return jsonify(result)


@doctor_bp.route("/api/doctors/register", methods=["POST"])
def register_doctor():

    data = request.json

    clerk_user_id = data.get("clerk_user_id")
    email = data.get("email")

    if not clerk_user_id or not email:
        return jsonify({"error": "Missing data"}), 400

    doctor = DoctorList.query.filter_by(
        clerk_user_id=clerk_user_id
    ).first()

    if doctor:
        return jsonify({"message": "Doctor already exists"})

    new_doctor = DoctorList(
        clerk_user_id=clerk_user_id,
        email=email
    )

    db.session.add(new_doctor)
    db.session.commit()

    return jsonify({"message": "Doctor created"})