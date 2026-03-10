import os, requests
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()
match_doctor_bp = Blueprint("match_doctor", __name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = os.getenv("MODEL", "google/gemini-2.5-flash")

AI_DOCTOR_AGENTS = [
    {"specialist": "General Physician", "description": "Helps with everyday health concerns.", "image": "/doctor1.png", "type": "AI"},
    {"specialist": "Pediatrician", "description": "Expert in children's health.", "image": "/doctor2.png", "type": "AI"},
    {"specialist": "Dermatologist", "description": "Handles skin issues.", "image": "/doctor3.png", "type": "AI"},
    {"specialist": "Psychologist", "description": "Supports mental health.", "image": "/doctor4.png", "type": "AI"},
    {"specialist": "Nutritionist", "description": "Healthy eating advice.", "image": "/doctor5.png", "type": "AI"},
    {"specialist": "Cardiologist", "description": "Heart health.", "image": "/doctor6.png", "type": "AI"},
    {"specialist": "ENT Specialist", "description": "Ear, nose, throat problems.", "image": "/doctor7.png", "type": "AI"},
    {"specialist": "Orthopedic", "description": "Bone and joint pain.", "image": "/doctor8.png", "type": "AI"},
    {"specialist": "Gynecologist", "description": "Women's health.", "image": "/doctor9.png", "type": "AI"},
    {"specialist": "Dentist", "description": "Dental problems.", "image": "/doctor10.png", "type": "AI"},
]

HumanDoctor = [
    {"id": 1, "name": "Dr. Anil Sharma", "specialist": "General Physician", "description": "Helps with everyday health concerns.", "image": "/doctor1.png", "type": "Human"},
    {"id": 2, "name": "Dr. Meera Verma", "specialist": "Pediatrician", "description": "Expert in children's health.", "image": "/doctor2.png", "type": "Human"},
    {"id": 3, "name": "Dr. Richa Nair", "specialist": "Dermatologist", "description": "Handles skin issues.", "image": "/doctor3.png", "type": "Human"},
    {"id": 4, "name": "Dr. Sneha Kapoor", "specialist": "Psychologist", "description": "Supports mental health.", "image": "/doctor4.png", "type": "Human"},
    {"id": 5, "name": "Dr. Kavita Joshi", "specialist": "Nutritionist", "description": "Healthy eating advice.", "image": "/doctor5.png", "type": "Human"},
    {"id": 6, "name": "Dr. Amita Mehta", "specialist": "Cardiologist", "description": "Heart health.", "image": "/doctor6.png", "type": "Human"},
    {"id": 7, "name": "Dr. Priya Menon", "specialist": "ENT Specialist", "description": "Ear, nose, throat problems.", "image": "/doctor7.png", "type": "Human"},
    {"id": 8, "name": "Dr. Karishma Bhatia", "specialist": "Orthopedic", "description": "Bone and joint pain.", "image": "/doctor8.png", "type": "Human"},
    {"id": 9, "name": "Dr. Sameer Agarwal", "specialist": "Gynecologist", "description": "Women's health.", "image": "/doctor9.png", "type": "Human"},
    {"id": 10, "name": "Dr. Pooja Rathi", "specialist": "Dentist", "description": "Dental problems.", "image": "/doctor10.png", "type": "Human"},
    {"id": 11, "name": "Dr. Nidhi Gupta", "specialist": "General Physician", "description": "Helps with everyday health concerns.", "image": "/doctor11.png", "type": "Human"},
    {"id": 12, "name": "Dr. Rajesh Kulkarni", "specialist": "Pediatrician", "description": "Expert in children's health.", "image": "/doctor12.png", "type": "Human"},
    {"id": 13, "name": "Dr. Sanjay Rao", "specialist": "Dermatologist", "description": "Handles skin issues.", "image": "/doctor13.png", "type": "Human"},
    {"id": 14, "name": "Dr. Albert Roy", "specialist": "Psychologist", "description": "Supports mental health.", "image": "/doctor14.png", "type": "Human"},
    {"id": 15, "name": "Dr. Ramesh Iyer", "specialist": "Nutritionist", "description": "Healthy eating advice.", "image": "/doctor15.png", "type": "Human"},
    {"id": 16, "name": "Dr. Shashikanti Ghosh", "specialist": "Cardiologist", "description": "Heart health.", "image": "/doctor16.png", "type": "Human"},
    {"id": 17, "name": "Dr. Neha Singh", "specialist": "ENT Specialist", "description": "Ear, nose, throat problems.", "image": "/doctor17.png", "type": "Human"},
    {"id": 18, "name": "Dr. Vivek Chawla", "specialist": "Orthopedic", "description": "Bone and joint pain.", "image": "/doctor18.png", "type": "Human"},
    {"id": 19, "name": "Dr. Amisha Patel", "specialist": "Gynecologist", "description": "Women's health.", "image": "/doctor19.png", "type": "Human"},
    {"id": 20, "name": "Dr. Ritu Khanna", "specialist": "Dentist", "description": "Dental problems.", "image": "/doctor20.png", "type": "Human"},
]

# Keyword mapping for symptom-based matching
SYMPTOM_KEYWORDS = {
    "General Physician": ["fever", "cold", "cough", "headache", "body ache", "fatigue", "weakness", "vomiting", "nausea", "flu"],
    "Pediatrician": ["child", "baby", "infant", "toddler", "kids", "children", "pediatric", "newborn", "teenager", "adolescent"],
    "Dermatologist": ["skin", "rash", "acne", "eczema", "psoriasis", "itching", "hives", "allergy", "dermatitis", "pimple"],
    "Psychologist": ["stress", "anxiety", "depression", "mental", "therapy", "counseling", "mood", "emotional", "psychology", "behavior"],
    "Nutritionist": ["diet", "nutrition", "weight", "obesity", "eating", "food", "vitamin", "healthy", "meal", "nutritional"],
    "Cardiologist": ["heart", "chest pain", "blood pressure", "cholesterol", "cardiac", "palpitations", "hypertension", "heartbeat"],
    "ENT Specialist": ["ear", "nose", "throat", "sinus", "hearing", "tonsil", "vertigo", "earache", "sore throat", "nasal"],
    "Orthopedic": ["bone", "joint", "fracture", "sprain", "arthritis", "back pain", "knee", "shoulder", "muscle", "skeletal"],
    "Gynecologist": ["women", "pregnancy", "menstrual", "period", "ovarian", "uterine", "vaginal", "menopause", "gynecology"],
    "Dentist": ["tooth", "dental", "gum", "cavity", "teeth", "oral", "toothache", "braces", "dentist", "gingivitis"]
}

def match_symptoms_to_specialist(symptoms):
    """Match symptoms to specialist using keyword analysis"""
    symptoms_lower = symptoms.lower()
    specialist_scores = {}
    
    # Score each specialist based on keyword matches
    for specialist, keywords in SYMPTOM_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in symptoms_lower:
                score += 1
        specialist_scores[specialist] = score
    
    # Find specialist with highest score
    best_specialist = max(specialist_scores, key=specialist_scores.get)
    
    # Only return best specialist if they have at least 1 match, else General Physician
    if specialist_scores[best_specialist] > 0:
        return best_specialist
    else:
        return "General Physician"

@match_doctor_bp.route("/match-doctor", methods=["POST"])
def match_doctor():
    symptoms = (request.json or {}).get("notes", "").strip()
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    specialists_list = [d["specialist"] for d in AI_DOCTOR_AGENTS]
    ai_output = ""
    ai_success = False

    # Try AI classification first if API key exists
    if OPENROUTER_API_KEY:
        prompt = f"""
Based on these symptoms: "{symptoms}"
Choose the most appropriate medical specialist from this exact list:
{", ".join(specialists_list)}

Return ONLY the exact specialist name from the list. No explanations.
"""
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",  # Add required headers
                    "X-Title": "Doctor Matcher"
                },
                json={
                    "model": MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 20,
                    "temperature": 0.1
                },
                timeout=30
            )
            
            if response.status_code == 200:
                ai_output = response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                print("AI RAW RESPONSE:", repr(ai_output))  # Debug output
                
                # Validate AI response
                if ai_output and ai_output in specialists_list:
                    ai_success = True
                else:
                    print("AI returned invalid specialist:", ai_output)
            else:
                print(f"API Error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print("AI ERROR:", e)

    # Determine final specialist
    if ai_success:
        specialist = ai_output
        method = "ai"
    else:
        # Fallback to keyword matching
        specialist = match_symptoms_to_specialist(symptoms)
        method = "keyword"
        print(f"Using keyword matching for: '{symptoms}' -> {specialist}")

    print("FINAL SPECIALIST:", specialist, f"(method: {method})")

    ai_doctor = [d for d in AI_DOCTOR_AGENTS if d["specialist"] == specialist]
    human_doctors = [d for d in HumanDoctor if d["specialist"] == specialist]

    return jsonify({
        "ai_raw": ai_output,
        "specialist": specialist,
        "method": method,
        "ai_doctor": ai_doctor,
        "human_doctors": human_doctors,
        "symptoms_received": symptoms
    })