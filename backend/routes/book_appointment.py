import os
from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db, Appointment, DoctorList
import resend

resend.api_key = os.environ.get("RESEND_API_KEY")

book_appointment_bp = Blueprint("book_appointment_bp", __name__)


# ---------------- SEND EMAIL ----------------

def send_booking_email(to_email, patient_name, doctor_name, date, time_info):

    html_content = f"""
    <html>
      <body style="font-family:sans-serif;background:#f9f9f9;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;">
          <h1>🩺 HealthSpectra</h1>

          <p>Hi {patient_name},</p>

          <p>Your appointment with <strong>{doctor_name}</strong> has been confirmed.</p>

          <ul>
            <li><strong>Date:</strong> {date}</li>
            <li><strong>Time / Queue:</strong> {time_info}</li>
          </ul>

          <p>Thank you for using HealthSpectra!</p>
        </div>
      </body>
    </html>
    """

    resend.Emails.send({
        "from": "Appointment-Booking@resend.dev",
        "to": to_email,
        "subject": "Appointment Confirmation ✅",
        "html": html_content
    })


# ---------------- POST BOOKING ----------------

@book_appointment_bp.route("/api/booking", methods=["POST"])
def book_appointment():

    data = request.get_json(silent=True) or {}

    doctor_id = data.get("doctor_id")
    patient_name = data.get("patient_name")
    patient_email = data.get("patient_email")
    appointment_date_str = data.get("appointment_date")
    time_slot = data.get("time_slot")
    issue = data.get("issue")

    if not (doctor_id and patient_name and patient_email and appointment_date_str):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    try:
        appointment_date = datetime.strptime(
            appointment_date_str, "%Y-%m-%d"
        ).date()
    except ValueError:
        return jsonify({"success": False, "message": "Invalid date format"}), 400

    doctor = DoctorList.query.filter_by(id=doctor_id).first()

    if not doctor:
        return jsonify({"success": False, "message": "Doctor not found"}), 404


    # ---------------- SLOT BOOKING ----------------

    if time_slot:

        existing = Appointment.query.filter_by(
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            time_slot=time_slot
        ).first()

        if existing:
            return jsonify({
                "success": False,
                "message": "Slot already booked"
            }), 400

        appointment = Appointment(
            doctor_id=doctor.id,
            doctor_name=doctor.name,
            patient_name=patient_name,
            patient_email=patient_email,
            appointment_date=appointment_date,
            time_slot=time_slot,
            booking_type="slot",
            issue=issue
        )

        db.session.add(appointment)
        db.session.commit()

        try:
            send_booking_email(
                patient_email,
                patient_name,
                doctor.name,
                appointment_date_str,
                time_slot
            )
        except Exception as e:
            print("Email failed:", e)

        return jsonify({
            "success": True,
            "message": "Slot booked successfully"
        })


    # ---------------- QUEUE BOOKING ----------------

    last_queue = db.session.query(
        db.func.max(Appointment.queue_number)
    ).filter_by(
        doctor_id=doctor_id,
        appointment_date=appointment_date,
        booking_type="queue"
    ).scalar()

    next_queue = (last_queue or 0) + 1

    appointment = Appointment(
        doctor_id=doctor.id,
        doctor_name=doctor.name,
        patient_name=patient_name,
        patient_email=patient_email,
        appointment_date=appointment_date,
        queue_number=next_queue,
        booking_type="queue",
        issue=issue
    )

    db.session.add(appointment)
    db.session.commit()

    try:
        send_booking_email(
            patient_email,
            patient_name,
            doctor.name,
            appointment_date_str,
            f"Queue Number {next_queue}"
        )
    except Exception as e:
        print("Email failed:", e)

    return jsonify({
        "success": True,
        "message": "Appointment booked successfully",
        "queue_number": next_queue
    })


# ---------------- GET USER BOOKINGS ----------------

@book_appointment_bp.route("/api/bookings", methods=["GET"])
def get_user_bookings():

    email = request.args.get("email")

    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required"
        }), 400

    bookings = Appointment.query.filter_by(patient_email=email).all()

    results = []

    for b in bookings:

        doctor = DoctorList.query.filter_by(id=b.doctor_id).first()

        date_obj = b.appointment_date
        today = datetime.now().date()

        # -------- SLOT BOOKING --------
        if b.time_slot:
            try:
                time_obj = datetime.strptime(
                    b.time_slot.strip(), "%I:%M %p"
                ).time()

                appointment_datetime = datetime.combine(
                    date_obj, time_obj
                )

                status = "expired" if appointment_datetime < datetime.now() else "upcoming"

            except:
                status = "upcoming"

        # -------- QUEUE BOOKING --------
        else:
            # Queue booking has no exact time → compare only date
            status = "expired" if date_obj < today else "upcoming"

        results.append({
            "id": b.id,
            "doctor_id": b.doctor_id,
            "doctor_name": b.doctor_name,
            "image": f"http://127.0.0.1:5000/static/{doctor.image}" if doctor and doctor.image else "/default-doctor.png",
            "doctor_address": doctor.address if doctor else "Unknown",
            "appointment_date": b.appointment_date.strftime("%Y-%m-%d"),
            "time_slot": b.time_slot,
            "queue_number": b.queue_number,
            "status": status
        })

    return jsonify(results)


# ---------------- DELETE BOOKING ----------------

@book_appointment_bp.route("/api/booking/<int:booking_id>", methods=["DELETE"])
def cancel_booking(booking_id):

    appointment = Appointment.query.filter_by(id=booking_id).first()

    if not appointment:
        return jsonify({
            "success": False,
            "message": "Booking not found"
        }), 404

    db.session.delete(appointment)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Booking cancelled successfully"
    })


# ---------------- DOCTOR BOOKINGS ----------------

@book_appointment_bp.route("/api/doctor/bookings", methods=["GET"])
def get_doctor_bookings():

    doctor_id = request.args.get("doctor_id")

    if not doctor_id:
        return jsonify({
            "success": False,
            "message": "Doctor ID required"
        }), 400

    bookings = Appointment.query.filter_by(doctor_id=doctor_id).all()

    results = []

    for b in bookings:

        results.append({
            "id": b.id,
            "patient_name": b.patient_name,
            "patient_email": b.patient_email,
            "appointment_date": b.appointment_date.strftime("%Y-%m-%d"),
            "time_slot": b.time_slot,
            "queue_number": b.queue_number,
            "status": b.status or "pending"
        })

    return jsonify(results)


# ---------------- CONFIRM BOOKING ----------------

@book_appointment_bp.route("/api/doctor/booking/<int:id>/confirm", methods=["PUT"])
def confirm_booking(id):

    booking = Appointment.query.get(id)

    if not booking:
        return jsonify({
            "success": False,
            "message": "Booking not found"
        }), 404

    if booking.status in ["upcoming", "pending"]:
        booking.status = "confirmed"
        db.session.commit()

        return jsonify({"success": True})

    return jsonify({
        "success": False,
        "message": "Cannot confirm"
    }), 400


# ---------------- REJECT BOOKING ----------------

@book_appointment_bp.route("/api/doctor/booking/<int:id>/reject", methods=["PUT"])
def reject_booking(id):

    booking = Appointment.query.get(id)

    if not booking:
        return jsonify({
            "success": False,
            "message": "Booking not found"
        }), 404

    if booking.status in ["upcoming", "pending"]:
        booking.status = "rejected"
        db.session.commit()

        return jsonify({"success": True})

    return jsonify({
        "success": False,
        "message": "Cannot reject"
    }), 400