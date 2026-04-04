import bcrypt
from datetime import datetime, timedelta, timezone
import jwt

from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_DAYS

def hash_password(password: str) -> str:
    # Hash a password for the first time
    # (bcrypt expects bytes, so we encode/decode)
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_passwords(plain_password: str, hashed_password: str) -> bool:
    # Check hashed password. 
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

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

def create_refresh_token(user_id: int, role: str = "user", expires_delta: timedelta | None = None):
    """
    Creates an encoded JWT refresh token.
    
    Args:
        user_id: The ID of the user (used as 'sub' in payload).
        role: The role assigned to the user (e.g., 'user', 'admin').
        expires_delta: Optional timedelta for expiration. Defaults to REFRESH_TOKEN_EXPIRE_DAYS.
    
    Returns:
        An encoded JWT string.
    """
    to_encode = {"sub": str(user_id), "role": role}
    
    if expires_delta:
        expire = get_current_utc_time() + expires_delta
    else:
        expire = get_current_utc_time() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS or 7)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt