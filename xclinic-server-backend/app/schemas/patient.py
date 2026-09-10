from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field

class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    birth_date: Optional[date] = None
    sex: Optional[Literal["M", "F", "O"]] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    birth_date: Optional[date] = None
    sex: Optional[Literal["M", "F", "O"]] = None

class Patient(PatientBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True
