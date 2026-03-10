from flask import Blueprint, jsonify, request
from models import DoctorList

popular_doctors_bp = Blueprint("popular_doctors", __name__)


# ---------------- GET ALL DOCTORS ----------------
@popular_doctors_bp.route("/api/doctors", methods=["GET"])
def get_doctors():
    category_id = request.args.get("category_id")

    query = DoctorList.query

    if category_id:
        query = query.filter(DoctorList.category_id == category_id)

    doctors = query.limit(20).all()

    return jsonify([
        {
            "id": d.id,
            "name": d.name,
            "address": d.address,
            "years_of_experience": d.years_of_experience,
            "image": d.image,
            "category_id": d.category_id,
            "patients": d.patients,
            "about": d.about,
            "category": d.category,
            "phone": d.phone,

            # queue schedule
            "queue_start_time": d.queue_start_time.strftime("%H:%M") if d.queue_start_time else None,
            "queue_end_time": d.queue_end_time.strftime("%H:%M") if d.queue_end_time else None,

            # slot schedule
            "slot_start_time": d.slot_start_time.strftime("%H:%M") if d.slot_start_time else None,
            "slot_end_time": d.slot_end_time.strftime("%H:%M") if d.slot_end_time else None,

            "slot_duration": d.slot_duration
        }
        for d in doctors
    ])


# ---------------- GET DOCTOR BY ID ----------------
@popular_doctors_bp.route("/api/doctor/<int:doctor_id>", methods=["GET"])
def get_doctor_by_id(doctor_id):

    doctor = DoctorList.query.filter_by(id=doctor_id).first()

    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    return jsonify({
        "id": doctor.id,
        "name": doctor.name,
        "address": doctor.address,
        "years_of_experience": doctor.years_of_experience,
        "image": doctor.image,
        "patients": doctor.patients,
        "about": doctor.about,
        "phone": doctor.phone,

        "specialization": doctor.category,

        "queue_start_time": doctor.queue_start_time.strftime("%H:%M") if doctor.queue_start_time else None,
        "queue_end_time": doctor.queue_end_time.strftime("%H:%M") if doctor.queue_end_time else None,

        "slot_start_time": doctor.slot_start_time.strftime("%H:%M") if doctor.slot_start_time else None,
        "slot_end_time": doctor.slot_end_time.strftime("%H:%M") if doctor.slot_end_time else None,

        "slot_duration": doctor.slot_duration
    })