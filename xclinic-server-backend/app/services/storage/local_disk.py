import uuid
from pathlib import Path

from .base import StorageBackend, StoredFile


class LocalDiskStorage(StorageBackend):
    """Guarda os arquivos num diretório local (`UPLOAD_DIR`, ver
    app/core/config.py). Serve para desenvolvimento e para um único servidor;
    não é replicado nem sobrevive a um redeploy sem volume persistente - é
    por isso que existe a interface `StorageBackend` (para trocar por um
    object storage de verdade quando isso importar).

    O nome de arquivo original NUNCA é usado para montar o caminho em disco
    (evita path traversal via filename malicioso) - é gerado um nome opaco
    (uuid4) por upload; o nome original fica só em `raw_data` para exibição.
    """

    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir)

    def save(self, contents: bytes, *, patient_id: int, filename: str) -> StoredFile:
        patient_dir = self.base_dir / "patients" / str(patient_id)
        patient_dir.mkdir(parents=True, exist_ok=True)

        suffix = Path(filename).suffix if filename else ""
        if len(suffix) > 10:  # sanidade: extensão absurdamente longa é suspeita
            suffix = ""
        stored_name = f"{uuid.uuid4().hex}{suffix}"

        dest = patient_dir / stored_name
        dest.write_bytes(contents)

        key = str(Path("patients") / str(patient_id) / stored_name)
        return StoredFile(key=key, size_bytes=len(contents))

    def _resolve(self, key: str) -> Path:
        # normaliza e garante que o resultado continua dentro de base_dir,
        # mesmo que `key` venha de um dado antigo/adulterado.
        resolved = (self.base_dir / key).resolve()
        if self.base_dir.resolve() not in resolved.parents and resolved != self.base_dir.resolve():
            raise ValueError("Invalid storage key")
        return resolved

    def read(self, key: str) -> bytes:
        return self._resolve(key).read_bytes()

    def delete(self, key: str) -> None:
        path = self._resolve(key)
        if path.exists():
            path.unlink()
