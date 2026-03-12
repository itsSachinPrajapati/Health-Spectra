import os
from elevenlabs.client import ElevenLabs
from gtts import gTTS

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY")


def text_to_speech_with_elevenlabs(input_text: str, output_filename: str = "final.mp3") -> str:

    output_filepath = os.path.join(os.path.dirname(__file__), output_filename)

    try:
        if not ELEVENLABS_API_KEY:
            raise ValueError("ELEVENLABS_API_KEY not set in environment variables")

        client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

        audio_generator = client.text_to_speech.convert(
            text=input_text,
            voice_id="EXAVITQu4vr4xnSDxMaL",
            model_id="eleven_multilingual_v2",
            output_format="mp3_22050_32"
        )

        with open(output_filepath, "wb") as f:
            for chunk in audio_generator:
                f.write(chunk)

        return output_filepath

    except Exception as e:
        print(f"⚠️ ElevenLabs failed ({e}), falling back to gTTS...")

        tts = gTTS(text=input_text, lang="en")
        tts.save(output_filepath)

        return output_filepath