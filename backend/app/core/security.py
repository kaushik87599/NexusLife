from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt

from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_passwords(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_current_utc_time():
    return datetime.now(timezone.utc)

def create_access_token(user_id: int, role: str = "user", expires_delta: timedelta | None = None):
    """
    Creates an encoded JWT access token.
    
    Args:
        user_id: The ID of the user (used as 'sub' in payload).
        role: The role assigned to the user (e.g., 'user', 'admin').
        expires_delta: Optional timedelta for expiration. Defaults to ACCESS_TOKEN_EXPIRE_MINUTES.
    
    Returns:
        An encoded JWT string.
    """
    to_encode = {"sub": str(user_id), "role": role}
    
    if expires_delta:
        expire = get_current_utc_time() + expires_delta
    else:
        expire = get_current_utc_time() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES or 30)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt