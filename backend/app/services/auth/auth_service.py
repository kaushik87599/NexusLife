from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from pydantic.networks import EmailStr
from app.models.user import User
from app.core.security import verify_passwords, hash_password
from app.repositories import user_repo

def authenticate_user(db: Session, email: EmailStr, plain_password: str) -> User:
    """
    Authenticates a user by email and password.
    it is a service 
    
    Raises:
        HTTPException (401): If user not found or password incorrect.
    """
    user = user_repo.get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_passwords(plain_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

def create_user_account(db: Session, email: EmailStr, plain_password: str) -> User:
    """
    Creates a new user account with a hashed password.
    it is a service 
    
    Raises:
        HTTPException (400): If a user with the same email already exists.
    """
    user = user_repo.get_user_by_email(db, email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
    
    hashed_password = hash_password(plain_password)
    return user_repo.create_user(db, email=email, hashed_password=hashed_password)
