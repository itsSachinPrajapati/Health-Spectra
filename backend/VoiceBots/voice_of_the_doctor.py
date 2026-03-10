import os
from elevenlabs import ElevenLabs  # type: ignore
from gtts import gTTS 

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")


def text_to_speech_with_elevenlabs(input_text: str, output_filename: str = "final.mp3") -> str:
    """
    Converts text to speech using ElevenLabs and saves it as an MP3 file.
    Falls back to gTTS if ElevenLabs fails.
    """
    output_filepath = os.path.join(os.path.dirname(__file__), output_filename)

    try:
        if not ELEVENLABS_API_KEY:
            raise ValueError("ELEVENLABS_API_KEY not set in environment variables")

        client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

        # Convert text to speech (returns a generator of bytes)
        audio_generator = client.text_to_speech.convert(
            text=input_text,
            voice_id="EXAVITQu4vr4xnSDxMaL",  # Your chosen voice ID
            model_id="eleven_multilingual_v2",
            output_format="mp3_22050_32"
        )

        # Save audio by iterating the generator
        with open(output_filepath, "wb") as f:
            for chunk in audio_generator:
                f.write(chunk)

        return output_filepath

    except Exception as e:
        print(f"⚠️ ElevenLabs failed ({e}), falling back to gTTS...")

        # Fallback to gTTS
        tts = gTTS(text=input_text, lang="en")
        tts.save(output_filepath)
        print("✅ Fallback gTTS audio generated.")

        return output_filepath
