# backend/routes/consultation.py
from flask import Blueprint, request, jsonify
from extensions import db
from models import Consultation, User, DoctorList
from datetime import datetime
import uuid, json, requests, os
from dotenv import load_dotenv
from sqlalchemy import func

consultation_bp = Blueprint("consultation_bp", __name__)

# --- OpenRouter / LLM config ---
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")
MODEL = "google/gemini-2.5-flash"


def analyze_consultation_with_llm(raw_text: str):
    """Analyze the consultation messages and return normalized JSON"""
    base_prompt = """
You are a medical AI assistant. Extract key medical details from the consultation messages.

Always return valid JSON with this structure:
{
  "chief_complaint": "",
  "symptoms": [],
  "symptom_duration": "",
  "severity": "",
  "findings": "",
  "medicines": [],
  "recommendations": [],
  "lifestyle_advice": [],
  "ai_suggestions": [],
  "medical_specialist": ""
}

If any field is missing, return empty string "" or empty array [].
"""
    prompt = f"{base_prompt}\n\nConversation:\n{raw_text}"

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 600,
                "temperature": 0.1
            },
            timeout=30
        )

        if resp.status_code == 200:
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            try:
                return json.loads(content)
            except:
                return {"error": "LLM did not return valid JSON", "raw": content}
        else:
            return {"error": f"LLM returned {resp.status_code}", "raw": resp.text}

    except Exception as e:
        return {"error": str(e)}


# ----------------- Save Consultation -----------------
@consultation_bp.route("/save-consultation", methods=["POST"])
def save_consultation():
    try:
        data = request.get_json(silent=True) or {}

        print("Incoming request data:", data)

        user_email = data.get("email", "").strip().lower()
        notes = data.get("notes", "")
        doctor_name = data.get("selected_doctor", "").strip()
        doctor_image = data.get("doctor_image", "/images/default-doctor.png")

        if not user_email:
            return jsonify({"success": False, "error": "User email is required"}), 400
        if not doctor_name:
            return jsonify({"success": False, "error": "Doctor is required"}), 400

        # --- Lookup User in SQLite ---
        user = User.query.filter(func.lower(User.email) == user_email).first()
        if not user:
            all_emails = [u.email for u in User.query.all()]
            print("All emails in DB:", all_emails)
            return jsonify({"success": False, "error": "User not found. Signup first."}), 400

        # --- Lookup Doctor in MySQL ---
        doctor = DoctorList.query.filter(func.lower(DoctorList.name) == doctor_name.lower()).first()
        if not doctor:
            doctor = DoctorList(
            name=doctor_name,
            image=doctor_image,
            address="Not provided",
            years_of_experience=0,

            queue_start_time=None,
            queue_end_time=None,

            slot_start_time=None,
            slot_end_time=None,
            slot_duration=30
        )
            db.session.add(doctor)
            db.session.commit()
            print(f"Created new doctor: {doctor_name}")

        # --- Save Consultation ---
        session_id = str(uuid.uuid4())
        consultation = Consultation(
            user_id=user.id,
            email=user_email,
            notes=notes,
            selected_doctor=doctor.name,
            session_id=session_id,
            created_on=datetime.utcnow()
        )
        db.session.add(consultation)
        db.session.commit()
        print(f"Consultation saved for user {user_email}, session {session_id}")

        return jsonify({
            "success": True,
            "session_id": session_id,
            "doctor": {"specialist": doctor.name, "image": doctor.image}
        }), 200

    except Exception as e:
        db.session.rollback()
        import traceback; traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ----------------- End Consultation -----------------
@consultation_bp.route("/end-consultation", methods=["POST"])
def end_consultation():
    try:
        data = request.get_json() or {}
        session_id = data.get("session_id")
        raw_messages = data.get("messages", "")

        if not session_id:
            return jsonify({"success": False, "error": "Missing session_id"}), 400

        consultation = Consultation.query.filter_by(session_id=session_id).first()
        if not consultation:
            return jsonify({"success": False, "error": "Consultation not found"}), 404

        llm_data = analyze_consultation_with_llm(raw_messages)

        normalized_report = {
            "chief_complaint": llm_data.get("chief_complaint", ""),
            "symptoms": llm_data.get("symptoms", []),
            "symptom_duration": llm_data.get("symptom_duration", ""),
            "severity": llm_data.get("severity", ""),
            "findings": llm_data.get("findings", ""),
            "medicines": llm_data.get("medicines", []),
            "recommendations": llm_data.get("recommendations", []),
            "lifestyle_advice": llm_data.get("lifestyle_advice", []),
            "ai_suggestions": llm_data.get("ai_suggestions", []),
            "medical_specialist": llm_data.get("medical_specialist", consultation.selected_doctor),
            "current_date_time_UTC": datetime.utcnow().isoformat()
        }

        consultation.messages = raw_messages
        consultation.report = json.dumps(normalized_report)
        db.session.commit()

        return jsonify({"success": True, "report": normalized_report}), 200

    except Exception as e:
        db.session.rollback()
        import traceback; traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ----------------- Get Consultation by Session -----------------
@consultation_bp.route("/consultation/<session_id>", methods=["GET"])
def get_consultation(session_id):
    try:
        consultation = Consultation.query.filter_by(session_id=session_id).first()
        if not consultation:
            return jsonify({"success": False, "error": "Consultation not found"}), 404

        doctor = DoctorList.query.filter_by(name=consultation.selected_doctor).first()
        report = json.loads(consultation.report) if consultation.report else {}

        return jsonify({
            "success": True,
            "consultation": {
                "id": consultation.id,
                "session_id": consultation.session_id,
                "user_id": consultation.user_id,
                "email": consultation.email,
                "notes": consultation.notes,
                "selected_doctor": consultation.selected_doctor,
                "created_on": consultation.created_on.isoformat(),
                "doctor_image": doctor.image if doctor else None,
                "messages": consultation.messages,
                "report": report
            }
        }), 200

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ----------------- Get All Consultations by Email -----------------
@consultation_bp.route("/consultation/all", methods=["GET"])
def get_all_consultations():
    try:
        email = request.args.get("email", "").strip().lower()
        if not email:
            return jsonify({"success": False, "error": "Email is required"}), 400

        consultations = Consultation.query.filter(func.lower(Consultation.email) == email)\
                                          .order_by(Consultation.created_on.desc())\
                                          .all()
        data = []
        for c in consultations:
            report = json.loads(c.report) if c.report else {}
            data.append({
                "session_id": c.session_id,
                "notes": c.notes,
                "selected_doctor": c.selected_doctor,
                "created_on": c.created_on.isoformat(),
                "messages": c.messages,
                "report": report
            })

        return jsonify({"success": True, "consultations": data}), 200

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ----------------- Get Consultation Count by Email -----------------
@consultation_bp.route("/consultation-count", methods=["GET"])
def consultation_count():
    try:
        email = request.args.get("email", "").strip().lower()
        if not email:
            return jsonify({"count": 0, "error": "Email is required"}), 400

        count = Consultation.query.filter(func.lower(Consultation.email) == email).count()
        return jsonify({"count": count}), 200

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"count": 0, "error": str(e)}), 500
