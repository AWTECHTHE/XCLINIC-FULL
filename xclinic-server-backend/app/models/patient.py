from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    birth_date = Column(Date, nullable=True)
    # "M", "F" or "O" (outro/não informado) - mantido como texto simples para
    # portabilidade entre bancos (evita tipos ENUM específicos de dialeto).
    sex = Column(String(1), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    readings = relationship(
        "BioimpedanceReading", back_populates="patient", cascade="all, delete-orphan"
    )

# ...existing code...
