# app/core/init_db.py
from app.core.database import Base, engine
from app.models import user

def init_db():
    # Import all models here
    from app.models.user import User
    
    # Create all tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()