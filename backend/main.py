from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

from models import ContactRequest
from mysqldb import SessionLocal, init_db, ContactMessage
from emailer import send_email

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
