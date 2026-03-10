import logging
import speech_recognition as sr # type: ignore
from pydub import AudioSegment # type: ignore
from dotenv import load_dotenv
import os
from io import BytesIO
from groq import Groq # type: ignore
import tempfile

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# --- Set ffmpeg and ffprobe paths manually (to remove warnings) ---
AudioSegment.converter = r"C:\ffmpeg\bin\ffmpeg.exe"
AudioSegment.ffmpeg = r"C:\ffmpeg\bin\ffmpeg.exe"
AudioSegment.ffprobe = r"C:\ffmpeg\bin\ffprobe.exe"

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def record_audio(file_path, timeout=100, phrase_time_limit=200):
    """
    Record audio from the microphone and save it as an MP3 file.
    """
    recognizer = sr.Recognizer()

    try:
        with sr.Microphone() as source:
            logging.info("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=1)
            logging.info("🎤 Start speaking now...")

            # Record the audio
            audio_data = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
            logging.info("✅ Recording complete.")

            # Convert to MP3 using ffmpeg
            wav_data = audio_data.get_wav_data()
            audio_segment = AudioSegment.from_wav(BytesIO(wav_data))
            audio_segment.export(file_path, format="mp3", bitrate="128k")

            logging.info(f"✅ Audio saved to {file_path}")

    except Exception as e:
        logging.error(f"An error occurred while recording: {e}")


import tempfile

def transcribe_with_groq(stt_model: str, audio_bytes: bytes = None, audio_filepath: str = None, GROQ_API_KEY: str = None):
    client = Groq(api_key=GROQ_API_KEY)

    if audio_bytes:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmpf:
            tmpf.write(audio_bytes)
            tmp_path = tmpf.name
    elif audio_filepath:
        tmp_path = audio_filepath
    else:
        raise ValueError("Either audio_bytes or audio_filepath must be provided")

    with open(tmp_path, "rb") as f:
        transcription = client.audio.transcriptions.create(
            model=stt_model,
            file=f
        )

    if audio_bytes:  # cleanup temp if we created it
        os.remove(tmp_path)

    return transcription.text
