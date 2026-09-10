from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel

class BioimpedanceReadingBase(BaseModel):
    measured_at: Optional[datetime] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    body_fat_percent: Optional[float] = None
    lean_mass_kg: Optional[float] = None
    total_body_water_l: Optional[float] = None
    basal_metabolic_rate: Optional[float] = None
    phase_angle: Optional[float] = None
    raw_data: Optional[dict[str, Any]] = None

class BioimpedanceReadingCreate(BioimpedanceReadingBase):
    pass

class BioimpedanceReading(BioimpedanceReadingBase):
    id: int
    patient_id: int
    measured_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True
