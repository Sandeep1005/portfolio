import smtplib
from email.mime.text import MIMEText

import os
from dotenv import load_dotenv

load_dotenv()

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")

async def send_email(name: str, email: str, message: str):
    msg = MIMEText(f"Message from: {name}\nEmail: {email}\n\n{message}")
    msg["Subject"] = f"New Contact Request from {name}"
    msg["From"] = email
    msg["To"] = GMAIL_USER

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        smtp.send_message(msg)
