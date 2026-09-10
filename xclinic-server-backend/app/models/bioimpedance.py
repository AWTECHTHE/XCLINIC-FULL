from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class BioimpedanceReading(Base):
    """Uma leitura/medição de bioimpedância de um paciente (série temporal)."""

    __tablename__ = "bioimpedance_readings"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    measured_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    body_fat_percent = Column(Float, nullable=True)
    lean_mass_kg = Column(Float, nullable=True)
    total_body_water_l = Column(Float, nullable=True)
    basal_metabolic_rate = Column(Float, nullable=True)
    phase_angle = Column(Float, nullable=True)

    # Payload bruto extraído do relatório/PDF de origem (ex: resultado do
    # parsing via Docling/LLM), preservado para auditoria e reprocessamento.
    raw_data = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="readings")

# ...existing code...
