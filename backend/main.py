from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from models import ContactRequest, AskRequest
from mysqldb import SessionLocal, init_db, ContactMessage
from emailer import send_email

import httpx
from typing import List, Tuple


# ------------ rate limiter ---------------
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
init_db()

# Handle rate limit errors
@app.exception_handler(RateLimitExceeded)
def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Try again later."}
    )

# CORS for your portfolio website
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # set your domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------ CONTACT ENDPOINT ---------------
@app.post("/contact")
@limiter.limit("5/minute")
async def contact_form(request: Request, req_data: ContactRequest, db=Depends(get_db)):
    # Save to database
    entry = ContactMessage(
        name=req_data.name,
        email=req_data.email,
        message=req_data.message,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Send email
    await send_email(req_data.name, req_data.email, req_data.message)

    return {"success": True, "message": "Message sent successfully."}


# ------------- ASK ENDPOINT ----------------
AGENT_URI = "http://your-agent-endpoint/api"   # replace with real endpoint

@app.post("/ask")
@limiter.limit("10/minute")
async def ask_endpoint(req: AskRequest):
    """
    Expected input:
    {
        "conversation": [
            { "role": "user", "message": "Hello" },
            { "role": "ai", "message": "Hi there" }
        ]
    }
    """

    conversation = req.conversation

    # ---------------- Forward request to Agent ----------------
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                AGENT_URI,
                json={"conversation": [t.dict() for t in conversation]},
            )

        if response.status_code == 200:
            data = response.json()

            # agent must return:  { "reply": "some text" }
            if data.get("reply"):
                return {"reply": data["reply"]}

        # No usable reply
        return {
            "reply": "Sorry for the inconvenience, the AI agent is currently offline."
        }

    except Exception:
        # Network, timeout, crash, unreachable agent
        return {
            "reply": "Sorry for the inconvenience, the AI agent is currently offline."
        }
