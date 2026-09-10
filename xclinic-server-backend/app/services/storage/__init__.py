from app.core.config import settings
from .base import StorageBackend, StoredFile
from .local_disk import LocalDiskStorage

__all__ = ["StorageBackend", "StoredFile", "LocalDiskStorage", "get_storage"]


def get_storage() -> StorageBackend:
    """Backend de storage único hoje: disco local. Trocar aqui quando um
    object storage real (S3/GCS/etc.) for adotado."""
    return LocalDiskStorage(settings.UPLOAD_DIR)
