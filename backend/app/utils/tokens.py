import secrets
import hashlib

def generate_secure_token() -> str:
    """
    Generate a high-entropy cryptographically secure URL-safe token.
    48 bytes of entropy results in a ~64 character string.
    """
    return secrets.token_urlsafe(48)

def hash_token(token: str) -> str:
    """
    Hash the token using SHA256 before storing it in the database.
    This prevents plain-text tokens from being stolen if the DB is compromised.
    """
    return hashlib.sha256(token.encode()).hexdigest()
