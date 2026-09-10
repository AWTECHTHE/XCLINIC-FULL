from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
from jwt import InvalidTokenError
from app.core.config import settings
import re

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"
JWT_TYPE_ACCESS = "access"
JWT_TYPE_REFRESH = "refresh"

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    if not validate_password_strength(password):
        raise ValueError("Password does not meet security requirements")
    return pwd_context.hash(password)

def validate_password_strength(password: str) -> bool:
    """Validar força da senha: mín 8 chars, maiúsculas, minúsculas, números, símbolos"""
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        return False
    return True

def _create_token(data: dict, secret_key: str, token_type: str, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "type": token_type})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)

def create_access_token(data: dict, expires_delta: timedelta = None):
    expires = expires_delta or timedelta(minutes=settings.JWT_EXPIRATION)
    return _create_token(data, settings.JWT_SECRET, JWT_TYPE_ACCESS, expires)

def create_refresh_token(data: dict, expires_delta: timedelta = None):
    expires = expires_delta or timedelta(days=settings.JWT_REFRESH_EXPIRATION)
    return _create_token(data, settings.JWT_REFRESH_SECRET, JWT_TYPE_REFRESH, expires)

def verify_token(token: str, secret_key: str, expected_type: str):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        if payload.get("type") != expected_type:
            return None
        return payload
    except InvalidTokenError:
        return None
