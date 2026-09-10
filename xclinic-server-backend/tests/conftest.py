"""Pytest fixtures shared by the backend test suite.

Environment variables required by ``app.core.config.Settings`` must be set
before any ``app.*`` module is imported (the settings singleton is built at
import time), so this happens at the top of the file, before the app import.
"""
import os
from pathlib import Path

TEST_DB_PATH = Path(__file__).parent / "test_xclinic.db"

os.environ.setdefault("JWT_SECRET", "test-jwt-secret")
os.environ.setdefault("JWT_REFRESH_SECRET", "test-jwt-refresh-secret")
os.environ.setdefault("DATABASE_URL", f"sqlite:///{TEST_DB_PATH}")
os.environ.setdefault("POSTGRES_USER", "test")
os.environ.setdefault("POSTGRES_PASSWORD", "test")
os.environ.setdefault("POSTGRES_DB", "test")
os.environ.setdefault("ALLOWED_HOSTS", "testserver,localhost,127.0.0.1")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.core.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(autouse=True)
def _fresh_database():
    """Recreate all tables around every test so tests stay isolated."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def registered_user(client):
    payload = {
        "username": "jdoe",
        "email": "jdoe@example.com",
        "password": "Str0ng!Pass",
    }
    response = client.post("/register/", json=payload)
    assert response.status_code == 201
    return payload
