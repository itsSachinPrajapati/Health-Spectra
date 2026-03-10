import os
import base64
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

from VoiceBots.brain_of_the_doctor import encode_image, analyze_image_with_query
from VoiceBots.voice_of_the_patient import transcribe_with_groq
from VoiceBots.voice_of_the_doctor import text_to_speech_with_elevenlabs

load_dotenv()

voicebot_bp = Blueprint("voicebot", __name__)

SYSTEM_PROMPT = """You have to act as a professional doctor explaining everything in simple language.
Do not use numbers or bullet points. Your response should be step by step and in 10 lines and recommend medicine and lifestyle changes."""


@voicebot_bp.route("/dashboard/tools/voicebot", methods=["POST"])
def voicebot():
    try:
        print("🔹 Received request to /voicebot")

        # 1️⃣ Get uploaded files
        audio_file = request.files.get("audio")
        image_file = request.files.get("image")

        if not audio_file:
            return jsonify({"error": "No audio uploaded"}), 400

        print(f"🎤 Audio received: {audio_file.filename}")
        if image_file:
            print(f"🖼 Image received: {image_file.filename}")

        # 2️⃣ Transcribe audio directly from memory
        print("⏳ Starting STT...")
        audio_bytes = audio_file.read()
        speech_to_text = transcribe_with_groq(
            stt_model="whisper-large-v3",
            audio_bytes=audio_bytes,
            GROQ_API_KEY=os.environ.get("GROQ_API_KEY")
        ).strip()
        print(f"✅ STT complete: {speech_to_text}")

        # 3️⃣ Encode image if present (now works with bytes)
        encoded_image = None
        if image_file:
            print("⏳ Encoding image...")
            image_bytes = image_file.read()
            encoded_image = encode_image(image_bytes)  # ✅ works with bytes now
            print("✅ Image encoded")

        # 4️⃣ Generate doctor response
        print("⏳ Generating doctor response...")
        doctor_text = analyze_image_with_query(
            query=f"{SYSTEM_PROMPT}\nUser query: {speech_to_text}",
            encoded_image=encoded_image
        )
        print(f"✅ Doctor response generated: {doctor_text}")

        # 5️⃣ Generate voice (TTS) from doctor response
        print("⏳ Generating voice (TTS)...")
        tts_path = text_to_speech_with_elevenlabs(doctor_text)

        with open(tts_path, "rb") as f:
            audio_base64 = base64.b64encode(f.read()).decode("utf-8")

        print(f"✅ TTS complete, audio size: {len(audio_base64)} base64 chars")



        # 6️⃣ Return response
        print("📤 Sending response back to frontend")
        return jsonify({
            "speech_to_text": speech_to_text,
            "doctor_response": doctor_text,
            "voice_base64": audio_base64
        })

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return jsonify({"error": str(e)}), 500
