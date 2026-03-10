import fitz  # type:ignore
from PIL import Image
import pytesseract # type:ignore
from openai import OpenAI #type:ignore
import os
from dotenv import load_dotenv
import json
import re

# ------------------------
# Setup Tesseract OCR
# ------------------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ------------------------
# Load OpenRouter API key
# ------------------------
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPEN_ROUTER_API_KEY environment variable not set!")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY
)

# ------------------------
# Extract text from uploaded file
# ------------------------
def extract_text_from_upload(uploaded_file) -> str:
    uploaded_file.seek(0)
    ext = uploaded_file.filename.rsplit(".", 1)[-1].lower()
    text = ""

    if ext == "pdf":
        pdf_bytes = uploaded_file.read()
        if not pdf_bytes:
            print("⚠️ PDF file is empty!")
            return ""
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
    elif ext in ["jpg", "jpeg", "png", "tiff"]:
        image = Image.open(uploaded_file)
        text = pytesseract.image_to_string(image)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    print(f"✅ Extracted text length: {len(text)}")
    return text.strip()

# ------------------------
# Analyze report with Deepseek
# ------------------------
def analyze_report(uploaded_file):
    text = extract_text_from_upload(uploaded_file)

    if not text:
        return {"error": "No text found in the uploaded file."}

    # -------- SMART SAFE INPUT LIMIT --------
    SAFE_INPUT_CHARS = 8500  # reduced from 12000
    if len(text) > SAFE_INPUT_CHARS:
        text = text[:SAFE_INPUT_CHARS]

    prompt_text = f"""
You are a clinical medical analyst.

Return STRICTLY valid JSON.
No markdown.
No explanations outside JSON.
No trailing commas.
Must start with {{ and end with }}.

JSON structure must be EXACTLY:

{{
  "patientInfo": {{
    "name": "string",
    "age": "string",
    "sex": "string",
    "email": "string"
  }},
  "tests": [
    {{
      "testName": "string",
      "result": "string",
      "normalRange": "string",
      "status": "Normal | High | Low | Elevated",
      "explanation": "short explanation"
    }}
  ],
  "overallAssessment": [],
  "keyRisks": [],
  "lifestyleChanges": [],
  "recommendations": [],
  "futureConcerns": []
}}

Rules:
- Parse ALL tests found.
- If missing info write "Unknown".
- Explanation must be short.

Medical Report:
{text}
"""

    try:
        completion = client.chat.completions.create(
            model="anthropic/claude-3-haiku",
            messages=[
                {"role": "system", "content": "You output only valid JSON."},
                {"role": "user", "content": prompt_text}
            ],
            temperature=0,
            max_tokens=2000  # safer output limit
        )

        raw_output = completion.choices[0].message.content.strip()

        with open("last_raw_output.txt", "w", encoding="utf-8") as f:
            f.write(raw_output)

        print("📄 Raw length:", len(raw_output))

        # 🔴 Hard stop if truncated
        if not raw_output.endswith("}"):
            print("❌ Output truncated due to token limit.")
            return {
                "error": "Model output truncated. Try smaller report."
            }

        # -------- JSON CLEANING --------
        cleaned = raw_output

        cleaned = re.sub(r"```json|```", "", cleaned)
        cleaned = cleaned.replace("“", '"').replace("”", '"')
        cleaned = re.sub(r",\s*}", "}", cleaned)
        cleaned = re.sub(r",\s*]", "]", cleaned)

        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1:
            cleaned = cleaned[start:end + 1]

        return json.loads(cleaned)

    except Exception as e:
        print("❌ Exception:", e)
        return {"error": f"API error: {str(e)}"}
