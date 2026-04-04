from app.core.config import REFRESH_TOKEN_EXPIRE_DAYS
from typing import Any
from fastapi import APIRouter, Depends, status, Response, Request, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import jwt
from pydantic import ValidationError

from app.core.config import SECRET_KEY, ALGORITHM

from app.core import security
from app.core.database import get_db
from app.schemas.User import UserCreate, UserOut
from app.schemas.Token import Token, TokenData
from app.services.auth import auth_service
from app.api import deps
from app.models.user import User
from app.repositories import user_repo

router = APIRouter()

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED,tags=["auth"])
def register(
    user_in: UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create a new user account.
    """
    return auth_service.create_user_account(db, email=user_in.email, plain_password=user_in.password)

@router.post("/login", response_model=Token, tags=["auth"])
def login(
    response: Response,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, retrieve an access token for future requests.
    """
    user = auth_service.authenticate_user(
        db, email=form_data.username, plain_password=form_data.password
    )
    access_token = security.create_access_token(user_id=user.id, role=user.role)
    refresh_token = security.create_refresh_token(user_id=user.id, role=user.role)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=False, # set to True in production with HTTPS
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserOut)
def read_users_me(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get current logged in user.
    """
    return current_user

@router.post("/refresh", response_model=Token, tags=["auth"])
def refresh_token_generator(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
) -> Any:
    """
    Refresh the access token.
    """
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = TokenData(user_id=int(user_id))
    except (jwt.PyJWTError, ValidationError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = user_repo.get_user_by_id(db, user_id=token_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    access_token = security.create_access_token(user_id=user.id, role=user.role)
    new_refresh_token = security.create_refresh_token(user_id=user.id, role=user.role)
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=False, # set to True in production with HTTPS
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/logout", tags=["auth"])
def logout(
    response: Response
) -> Any:
    """
    Logout the current user.
    """
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {
        "message": "Logout successful"
    }