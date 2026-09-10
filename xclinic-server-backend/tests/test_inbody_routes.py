from app.routers import inbody as inbody_router
from app.services.extraction.base import BioimpedanceExtractor, ExtractedMetrics, ExtractionResult


def _auth_headers(client, registered_user):
    response = client.post(
        "/login/",
        json={"username": registered_user["username"], "password": registered_user["password"]},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def _create_patient(client, headers):
    response = client.post(
        "/patients/", json={"name": "Paciente Teste"}, headers=headers
    )
    assert response.status_code == 201
    return response.json()


def test_inbody_upload_requires_auth(client):
    response = client.post(
        "/inbody/",
        data={"patient_id": "1"},
        files={"file": ("relatorio.pdf", b"%PDF-1.4 fake", "application/pdf")},
    )
    assert response.status_code == 401


def test_inbody_upload_creates_reading_with_unavailable_extraction(client, registered_user):
    headers = _auth_headers(client, registered_user)
    patient = _create_patient(client, headers)

    response = client.post(
        "/inbody/",
        data={"patient_id": str(patient["id"])},
        files={"file": ("relatorio.pdf", b"%PDF-1.4 fake content", "application/pdf")},
        headers=headers,
    )
    assert response.status_code == 201
    body = response.json()

    assert body["reading"]["patient_id"] == patient["id"]
    assert body["reading"]["raw_data"]["file"]["filename"] == "relatorio.pdf"
    # Sem LLM_PROVIDER/LLM_API_KEY configurados neste ambiente, o extrator
    # padrão é o "indisponível": nunca inventa dados clínicos.
    assert body["reading"]["raw_data"]["extraction_status"] == "unavailable"
    assert body["reading"]["weight_kg"] is None
    assert body["analise_obesidade"]["imc"] is None
    assert body["analise_obesidade"]["extraction_status"] == "unavailable"

    # A leitura deve ter sido persistida de verdade (não só na resposta).
    readings = client.get(f"/patients/{patient['id']}/readings/", headers=headers)
    assert len(readings.json()) == 1


class _FakeExtractor(BioimpedanceExtractor):
    def extract(self, pdf_bytes: bytes, filename: str) -> ExtractionResult:
        return ExtractionResult(
            status="extracted",
            metrics=ExtractedMetrics(weight_kg=70, height_cm=175, body_fat_percent=18.5),
        )


def test_inbody_upload_computes_imc_when_extraction_available(client, registered_user, monkeypatch):
    monkeypatch.setattr(inbody_router, "get_extractor", lambda: _FakeExtractor())

    headers = _auth_headers(client, registered_user)
    patient = _create_patient(client, headers)

    response = client.post(
        "/inbody/",
        data={"patient_id": str(patient["id"])},
        files={"file": ("relatorio.pdf", b"%PDF-1.4 fake content", "application/pdf")},
        headers=headers,
    )
    assert response.status_code == 201
    body = response.json()

    assert body["reading"]["weight_kg"] == 70
    assert body["analise_obesidade"]["extraction_status"] == "extracted"
    # IMC = 70 / 1.75^2 ≈ 22.9 -> faixa "Normal"
    assert body["analise_obesidade"]["imc"]["valor"] == 22.9
    assert body["analise_obesidade"]["imc"]["categoria"] == "Normal"
    assert body["analise_obesidade"]["pgc"]["valor"] == 18.5


def test_inbody_upload_rejects_non_pdf(client, registered_user):
    headers = _auth_headers(client, registered_user)
    patient = _create_patient(client, headers)

    response = client.post(
        "/inbody/",
        data={"patient_id": str(patient["id"])},
        files={"file": ("relatorio.txt", b"not a pdf", "text/plain")},
        headers=headers,
    )
    assert response.status_code == 400


def test_inbody_upload_rejects_patient_not_owned(client):
    client.post(
        "/register/",
        json={"username": "profE", "email": "e@example.com", "password": "Str0ng!Pass"},
    )
    login_e = client.post("/login/", json={"username": "profE", "password": "Str0ng!Pass"})
    headers_e = {"Authorization": f"Bearer {login_e.json()['access_token']}"}
    patient = _create_patient(client, headers_e)

    client.post(
        "/register/",
        json={"username": "profF", "email": "f@example.com", "password": "Str0ng!Pass"},
    )
    login_f = client.post("/login/", json={"username": "profF", "password": "Str0ng!Pass"})
    headers_f = {"Authorization": f"Bearer {login_f.json()['access_token']}"}

    response = client.post(
        "/inbody/",
        data={"patient_id": str(patient["id"])},
        files={"file": ("relatorio.pdf", b"%PDF-1.4 fake", "application/pdf")},
        headers=headers_f,
    )
    assert response.status_code == 404
