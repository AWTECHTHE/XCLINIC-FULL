from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.routers.patient import _get_owned_patient_or_404, get_current_db_user
from app.schemas import bioimpedance as bio_schemas
from app.services import patient_service

router = APIRouter()

MAX_UPLOAD_SIZE = 20 * 1024 * 1024  # 20 MB


@router.post("/inbody/", response_model=bio_schemas.InbodyUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_inbody_report(
    patient_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    """Recebe o PDF do relatório de bioimpedância e cria uma leitura para o paciente.

    NOTE: esta é a primeira versão do fluxo de upload, pensada para destravar
    a tela que já existe no frontend (FileUpload.tsx -> POST /inbody/) e
    validar o pipeline ponta a ponta. Ela ainda NÃO faz extração real dos
    dados clínicos do PDF (isso depende de integrar Docling + um LLM, como
    descrito no MVP) - por isso os campos numéricos da leitura criada vêm
    todos nulos e `analise_obesidade.extraction_status` é "pending". O
    arquivo em si também não é persistido em storage (nenhuma solução de
    armazenamento de arquivo - disco/S3/etc. - foi definida ainda); apenas
    seus metadados (nome, tamanho, content-type) ficam salvos em `raw_data`
    para rastreabilidade.
    """
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported",
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")
    if len(contents) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="File too large")

    _get_owned_patient_or_404(db, current_user.id, patient_id)

    reading_data = bio_schemas.BioimpedanceReadingCreate(
        raw_data={
            "source": "inbody_upload",
            "extraction_status": "pending",
            "file": {
                "filename": file.filename,
                "content_type": file.content_type,
                "size_bytes": len(contents),
            },
        }
    )
    db_reading = patient_service.create_reading(db, patient_id, reading_data)

    return bio_schemas.InbodyUploadResponse(
        reading=db_reading,
        analise_obesidade=bio_schemas.ObesityAnalysis(),
    )

# ...existing code...
