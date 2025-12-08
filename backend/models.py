from pydantic import BaseModel, EmailStr, Field
from typing import Literal, List


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    message: str = Field(..., min_length=1)


# ---------------- ASK MODELS ----------------
class AskTurn(BaseModel):
    role: Literal["ai", "user"]
    message: str = Field(..., min_length=1)


class AskRequest(BaseModel):
    conversation: List[AskTurn]
