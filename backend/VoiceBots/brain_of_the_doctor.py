import os
import base64
from dotenv import load_dotenv
from openai import OpenAI  # type: ignore

# --------------------------
# Load environment variables
# --------------------------
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("⚠️ OPENROUTER_API_KEY not found in .env file")


# --------------------------
# Encode image (bytes or path)
# --------------------------
def encode_image(image_input) -> str:
    """
    Encodes an image into base64.
    Accepts either a file path (str) or raw bytes.
    """
    if isinstance(image_input, str):  # file path
        if not os.path.exists(image_input):
            raise FileNotFoundError(f"Image not found: {image_input}")
        with open(image_input, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")

    elif isinstance(image_input, (bytes, bytearray)):  # raw bytes
        return base64.b64encode(image_input).decode("utf-8")

    else:
        raise TypeError("encode_image expects a file path (str) or raw bytes")


# --------------------------
# Analyze image with query
# --------------------------
def analyze_image_with_query(query: str, encoded_image: str = None,
                             model="google/gemini-2.5-flash") -> str:
    """
    Sends a text + optional image query to OpenRouter Gemini model and returns the response.
    """
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )

    try:
        messages = [{"role": "user", "content": [{"type": "text", "text": query}]}]

        # Add image only if provided
        if encoded_image:
            messages[0]["content"].append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}
            })

        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.2,
            max_tokens=1024,
            top_p=1,
            stream=False
        )

        return response.choices[0].message.content

    except Exception as e:
        raise RuntimeError(f"Error calling API: {e}")
