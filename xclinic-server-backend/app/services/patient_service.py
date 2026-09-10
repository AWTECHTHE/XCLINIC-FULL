from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.models.bioimpedance import BioimpedanceReading
from app.schemas import patient as patient_schemas
from app.schemas import bioimpedance as bio_schemas

# --- Patients (sempre filtrados por owner_id: um profissional só enxerga
# e manipula os próprios pacientes) ---

def create_patient(db: Session, owner_id: int, patient: patient_schemas.PatientCreate) -> Patient:
    db_patient = Patient(owner_id=owner_id, **patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_patients(db: Session, owner_id: int, skip: int = 0, limit: int = 10) -> list[Patient]:
    return (
        db.query(Patient)
        .filter(Patient.owner_id == owner_id)
        .order_by(Patient.id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_patient(db: Session, owner_id: int, patient_id: int) -> Patient | None:
    return (
        db.query(Patient)
        .filter(Patient.id == patient_id, Patient.owner_id == owner_id)
        .first()
    )

def update_patient(
    db: Session, db_patient: Patient, patient_update: patient_schemas.PatientUpdate
) -> Patient:
    for field, value in patient_update.model_dump(exclude_unset=True).items():
        setattr(db_patient, field, value)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, db_patient: Patient) -> None:
    db.delete(db_patient)
    db.commit()

# --- Bioimpedance readings (sempre aninhadas a um paciente já validado
# como pertencente ao profissional autenticado) ---

def create_reading(
    db: Session, patient_id: int, reading: bio_schemas.BioimpedanceReadingCreate
) -> BioimpedanceReading:
    data = reading.model_dump(exclude_unset=True)
    db_reading = BioimpedanceReading(patient_id=patient_id, **data)
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)
    return db_reading

def get_readings(
    db: Session, patient_id: int, skip: int = 0, limit: int = 50
) -> list[BioimpedanceReading]:
    return (
        db.query(BioimpedanceReading)
        .filter(BioimpedanceReading.patient_id == patient_id)
        .order_by(BioimpedanceReading.measured_at)
        .offset(skip)
        .limit(limit)
        .all()
    )
