from pydantic import BaseModel, EmailStr, field_validator
import re

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        
        # Ensure at least one lowercase, one uppercase, one digit, and one special character
        if not any(char.islower() for char in v):
            raise ValueError("Password must include at least one lowercase letter")
        if not any(char.isupper() for char in v):
            raise ValueError("Password must include at least one uppercase letter")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must include at least one number")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must include at least one special character")
            
        return v

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }
