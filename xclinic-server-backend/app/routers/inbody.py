from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.routers.patient import _get_owned_patient_or_404, get_current_db_user
from app.schemas import bioimpedance as bio_schemas
from app.services import patient_service
from app.services.extraction import get_extractor

router = APIRouter()

MAX_UPLOAD_SIZE = 20 * 1024 * 1024  # 20 MB


def _imc_metric(weight_kg: float | None, height_cm: float | None) -> bio_schemas.MetricWithCategory | None:
    if not weight_kg or not height_cm:
        return None
    height_m = height_cm / 100
    imc = weight_kg / (height_m**2)
    if imc < 18.5:
        categoria = "Abaixo do peso"
    elif imc < 25:
        categoria = "Normal"
    elif imc < 30:
        categoria = "Limite"
    else:
        categoria = "Alto"
    return bio_schemas.MetricWithCategory(valor=round(imc, 1), unidade="kg/m²", categoria=categoria)


@router.post("/inbody/", response_model=bio_schemas.InbodyUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_inbody_report(
    patient_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    """Recebe o PDF do relatório de bioimpedância e cria uma leitura para o paciente.

    A extração dos dados clínicos do PDF passa por `app.services.extraction`
    (interface plugável, ver esse pacote): sem um provedor de LLM configurado
    via `LLM_PROVIDER`/`LLM_API_KEY`, a leitura criada vem com os campos
    numéricos nulos e `analise_obesidade.extraction_status = "unavailable"` -
    nunca inventamos dados clínicos que não foram de fato extraídos do PDF.

    O arquivo em si também não é persistido em storage (nenhuma solução de
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

    extraction = get_extractor().extract(contents, file.filename)
    metrics = extraction.metrics

    reading_data = bio_schemas.BioimpedanceReadingCreate(
        weight_kg=metrics.weight_kg,
        height_cm=metrics.height_cm,
        body_fat_percent=metrics.body_fat_percent,
        lean_mass_kg=metrics.lean_mass_kg,
        total_body_water_l=metrics.total_body_water_l,
        basal_metabolic_rate=metrics.basal_metabolic_rate,
        phase_angle=metrics.phase_angle,
        raw_data={
            "source": "inbody_upload",
            "extraction_status": extraction.status,
            "extraction_error": extraction.error,
            "file": {
                "filename": file.filename,
                "content_type": file.content_type,
                "size_bytes": len(contents),
            },
        },
    )
    db_reading = patient_service.create_reading(db, patient_id, reading_data)

    pgc_metric = (
        bio_schemas.MetricWithCategory(valor=metrics.body_fat_percent, unidade="%")
        if metrics.body_fat_percent is not None
        else None
    )

    return bio_schemas.InbodyUploadResponse(
        reading=db_reading,
        analise_obesidade=bio_schemas.ObesityAnalysis(
            imc=_imc_metric(metrics.weight_kg, metrics.height_cm),
            pgc=pgc_metric,
            extraction_status=extraction.status,
        ),
    )

# ...existing code...
