from pathlib import Path
import os
from typing import Optional

ENV_FILE = Path("./config/.env")

def _load_env_file(path: Path) -> dict[str, str]:
    if not path.exists() or path.is_symlink():
        return {}

    values = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values

def _get_value(env_file_values: dict[str, str], key: str, default: Optional[str] = None) -> str:
    value = os.getenv(key, env_file_values.get(key, default))
    if value is None:
        raise RuntimeError(f"Missing required setting: {key}")
    return value

def _get_optional(env_file_values: dict[str, str], key: str, default: Optional[str] = None) -> Optional[str]:
    """Como _get_value, mas nunca levanta erro: retorna `default` (None por
    padrão) se a variável não estiver configurada em nenhum lugar."""
    return os.getenv(key, env_file_values.get(key, default))

def _get_int(env_file_values: dict[str, str], key: str, default: int) -> int:
    try:
        return int(_get_value(env_file_values, key, str(default)))
    except ValueError as exc:
        raise RuntimeError(f"Invalid integer setting: {key}") from exc

class Settings:
    def __init__(self):
        env_file_values = _load_env_file(ENV_FILE)
        self.app_name = _get_value(env_file_values, "APP_NAME", "xclinic-server-backend")
        self.admin_email = _get_value(env_file_values, "ADMIN_EMAIL", "admin@example.com")
        self.items_per_user = _get_int(env_file_values, "ITEMS_PER_USER", 50)
        self.ALLOWED_HOSTS = _get_value(env_file_values, "ALLOWED_HOSTS", "localhost,127.0.0.1")
        self.MAX_FORM_BODY_SIZE = _get_int(env_file_values, "MAX_FORM_BODY_SIZE", 1048576)
        self.JWT_SECRET = _get_value(env_file_values, "JWT_SECRET")
        self.JWT_EXPIRATION = _get_int(env_file_values, "JWT_EXPIRATION", 60)
        self.JWT_REFRESH_SECRET = _get_value(env_file_values, "JWT_REFRESH_SECRET")
        self.JWT_REFRESH_EXPIRATION = _get_int(env_file_values, "JWT_REFRESH_EXPIRATION", 1)
        self.DATABASE_URL = _get_value(env_file_values, "DATABASE_URL")
        self.POSTGRES_USER = _get_value(env_file_values, "POSTGRES_USER")
        self.POSTGRES_PASSWORD = _get_value(env_file_values, "POSTGRES_PASSWORD")
        self.POSTGRES_DB = _get_value(env_file_values, "POSTGRES_DB")
        # Extração de bioimpedância via Docling + LLM (opcional - ver
        # app/services/extraction/). Sem essas duas configuradas, o upload
        # em /inbody/ fica com extração "unavailable" em vez de simular dados.
        self.LLM_PROVIDER = _get_optional(env_file_values, "LLM_PROVIDER")
        self.LLM_API_KEY = _get_optional(env_file_values, "LLM_API_KEY")
        self.DOCLING_API_KEY = _get_optional(env_file_values, "DOCLING_API_KEY")
        # Diretório onde os PDFs enviados em /inbody/ são salvos (storage em
        # disco local - ver app/services/storage/). Em produção real, isso
        # deveria ser um volume persistente (ou trocado por um object
        # storage via um novo StorageBackend).
        self.UPLOAD_DIR = _get_value(env_file_values, "UPLOAD_DIR", "uploads")

settings = Settings()
