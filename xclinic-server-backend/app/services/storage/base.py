from dataclasses import dataclass


@dataclass
class StoredFile:
    # Identificador opaco que StorageBackend.read()/delete() aceitam de volta
    # (para LocalDiskStorage, é o caminho relativo dentro de UPLOAD_DIR).
    key: str
    size_bytes: int


class StorageBackend:
    """Interface para armazenamento dos arquivos originais enviados (PDFs de
    bioimpedância). Implementações concretas plugam aqui - hoje só existe
    `LocalDiskStorage`; um backend de object storage (S3, GCS, etc.) é o
    ponto de extensão natural quando o projeto for para produção real.
    """

    def save(self, contents: bytes, *, patient_id: int, filename: str) -> StoredFile:
        raise NotImplementedError

    def read(self, key: str) -> bytes:
        raise NotImplementedError

    def delete(self, key: str) -> None:
        raise NotImplementedError
