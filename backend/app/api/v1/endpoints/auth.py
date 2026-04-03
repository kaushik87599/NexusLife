from typing import Any
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core import security
from app.core.database import get_db
from app.schemas.User import UserCreate, UserOut
from app.schemas.Token import Token
from app.services.auth import auth_service
from app.api import deps
from app.models.user import User

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

@router.post("/login", response_model=Token,tags=["auth"])
def login(
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
