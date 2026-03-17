import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from pathlib import Path

# Assuming your custom retrieval engine is in the same directory
from retrieval_engine import MARARetriever

# Force load .env from the current script's directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="MARA Backend - Memory Augmented Retail Agent")

# CORS configuration for frontend integration (Lovable, React, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the memory retriever
retriever = MARARetriever()

class ChatRequest(BaseModel):
    user_id: str
    message: str

def call_groq_api(system_instructions, user_message):
    """
    Communicates with Groq API using Llama 3.3.
    Ensures clear separation between system context and user query.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return "Error: GROQ_API_KEY missing from server environment."

    client = Groq(api_key=api_key)

    try:
        # Using the current supported high-performance model
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": user_message}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.6,
            max_tokens=500,
            top_p=1,
        )
        
        response_text = chat_completion.choices[0].message.content
        return response_text.strip() if response_text else "MARA is thinking... but no words came out."

    except Exception as e:
        return f"Groq API Error: {str(e)}"

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # 1. Retrieve Contextual Memory from Qdrant
        memories = retriever.get_contextual_memory(request.message, request.user_id)
        
        # 2. Extract Facts and Detect Potential Budget/Constraint Violations
        context_lines = []
        violation_flag = False
        
        for m in memories[:5]: # Analyzing top 5 memories
            context_lines.append(f"- {m['text']} (Category: {m['type']})")
            
            # Smart logic to flag budget concerns (200 CHF limit)
            if m['type'] == "structural" and "200 CHF" in m['text']:
                triggers = ["expensive", "luxury", "500", "pricey", "high-end"]
                if any(word in request.message.lower() for word in triggers):
                    violation_flag = True

        context_summary = "\n".join(context_lines)

        # 3. Define MARA's Personality and Context
        system_instructions = f"""
        You are MARA (Memory Augmented Retail Agent), a sophisticated shopping assistant.
        
        USER CONTEXT FROM MEMORY:
        {context_summary}

        YOUR RULES:
        1. If the user's request violates a STRUCTURAL constraint (like the 200 CHF budget), acknowledge it gently.
        2. Personalize your response based on their SEMANTIC/EPISODIC history (e.g., their love for mid-century modern or chrome).
        3. Be professional, concise, and helpful. 
        4. If you don't have a specific answer, use the context to make a relevant suggestion.
        """

        # 4. Get the AI Response
        mara_reply = call_groq_api(system_instructions, request.message)

        # Log to terminal for debugging
        print(f"--- Chat Session for {request.user_id} ---")
        print(f"User: {request.message}")
        print(f"MARA: {mara_reply}\n")

        # 5. Return JSON payload to Frontend
        return {
            "reply": mara_reply,
            "meta": {
                "context_used": memories[:3],
                "constraint_violation": violation_flag,
                "user_id": request.user_id
            }
        }

    except Exception as e:
        print(f"Critical Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error - Check terminal logs.")

if __name__ == "__main__":
    # Start the server
    uvicorn.run(app, host="0.0.0.0", port=8000)