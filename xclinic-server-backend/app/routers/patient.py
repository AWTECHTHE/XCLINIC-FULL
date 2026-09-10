from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User as UserModel
from app.routers.user import get_current_user
from app.schemas import patient as schemas
from app.schemas import bioimpedance as bio_schemas
from app.services import patient_service, user_service

router = APIRouter()


def get_current_db_user(
    token_payload: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserModel:
    """Resolve o payload do JWT (username em 'sub') para o usuário real no banco."""
    username = token_payload.get("sub")
    user = user_service.get_user_by_username(db, username) if username else None
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def _get_owned_patient_or_404(db: Session, owner_id: int, patient_id: int):
    patient = patient_service.get_patient(db, owner_id, patient_id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    return patient


@router.post("/patients/", response_model=schemas.Patient, status_code=status.HTTP_201_CREATED)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    return patient_service.create_patient(db, current_user.id, patient)


@router.get("/patients/", response_model=list[schemas.Patient])
def list_patients(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    if skip < 0:
        raise HTTPException(status_code=400, detail="skip must be >= 0")
    limit = max(1, min(limit, 100))
    return patient_service.get_patients(db, current_user.id, skip=skip, limit=limit)


@router.get("/patients/{patient_id}", response_model=schemas.Patient)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    return _get_owned_patient_or_404(db, current_user.id, patient_id)


@router.patch("/patients/{patient_id}", response_model=schemas.Patient)
def update_patient(
    patient_id: int,
    patient_update: schemas.PatientUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    db_patient = _get_owned_patient_or_404(db, current_user.id, patient_id)
    return patient_service.update_patient(db, db_patient, patient_update)


@router.delete("/patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    db_patient = _get_owned_patient_or_404(db, current_user.id, patient_id)
    patient_service.delete_patient(db, db_patient)


@router.post(
    "/patients/{patient_id}/readings/",
    response_model=bio_schemas.BioimpedanceReading,
    status_code=status.HTTP_201_CREATED,
)
def create_reading(
    patient_id: int,
    reading: bio_schemas.BioimpedanceReadingCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    _get_owned_patient_or_404(db, current_user.id, patient_id)
    return patient_service.create_reading(db, patient_id, reading)


@router.get("/patients/{patient_id}/readings/", response_model=list[bio_schemas.BioimpedanceReading])
def list_readings(
    patient_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    _get_owned_patient_or_404(db, current_user.id, patient_id)
    if skip < 0:
        raise HTTPException(status_code=400, detail="skip must be >= 0")
    limit = max(1, min(limit, 200))
    return patient_service.get_readings(db, patient_id, skip=skip, limit=limit)

# ...existing code...
