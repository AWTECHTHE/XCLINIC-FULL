# app/core/init_db.py
from app.core.database import Base, engine
from app.models import user, patient, bioimpedance

def init_db():
    # Import all models here
    from app.models.user import User
    from app.models.patient import Patient
    from app.models.bioimpedance import BioimpedanceReading

    # Create all tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()