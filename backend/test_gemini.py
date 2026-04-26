from groq import Groq
import os
from dotenv import load_dotenv
load_dotenv()

client = Groq(api_key=os.getenv("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"))
response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[
        {"role": "user", "content": 'Return only this JSON: {"score": 8, "feedback": "test feedback here"}'}
    ]
)
print(response.choices[0].message.content)