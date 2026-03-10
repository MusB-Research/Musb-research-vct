from cryptography.fernet import Fernet
from app.config import get_settings

settings = get_settings()
cipher_suite = Fernet(settings.ENCRYPTION_KEY.encode())

import re

def validate_password(password: str) -> tuple[bool, str]:
    """Validates password strength based on specific criteria."""
    if len(password) < 10:
        return False, "Password must be at least 10 characters long."
    if len(password) > 32:
        return False, "Password must not exceed 32 characters."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character."
    return True, ""

def encrypt_data(data: str) -> str:
    """Encrypts a string of data."""
    if not data:
        return data
    return cipher_suite.encrypt(data.encode()).decode()

def decrypt_data(encrypted_data: str) -> str:
    """Decrypts an encrypted string of data."""
    if not encrypted_data:
        return encrypted_data
    try:
        return cipher_suite.decrypt(encrypted_data.encode()).decode()
    except Exception:
        # If decryption fails (e.g., data was not encrypted), return as is
        return encrypted_data
