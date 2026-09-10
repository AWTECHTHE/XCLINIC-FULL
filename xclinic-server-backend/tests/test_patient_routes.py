def _auth_headers(client, registered_user):
    response = client.post(
        "/login/",
        json={"username": registered_user["username"], "password": registered_user["password"]},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _create_patient(client, headers, name="Maria Silva"):
    response = client.post(
        "/patients/",
        json={"name": name, "birth_date": "1990-05-20", "sex": "F"},
        headers=headers,
    )
    assert response.status_code == 201
    return response.json()


def test_create_and_list_patients(client, registered_user):
    headers = _auth_headers(client, registered_user)
    patient = _create_patient(client, headers)
    assert patient["name"] == "Maria Silva"
    assert patient["sex"] == "F"

    response = client.get("/patients/", headers=headers)
    assert response.status_code == 200
    names = [p["name"] for p in response.json()]
    assert "Maria Silva" in names


def test_patients_require_auth(client):
    response = client.get("/patients/")
    assert response.status_code == 401


def test_get_patient_not_found(client, registered_user):
    headers = _auth_headers(client, registered_user)
    response = client.get("/patients/999", headers=headers)
    assert response.status_code == 404


def test_patients_are_scoped_to_owner(client):
    # Profissional A cria um paciente
    client.post(
        "/register/",
        json={"username": "profA", "email": "a@example.com", "password": "Str0ng!Pass"},
    )
    login_a = client.post("/login/", json={"username": "profA", "password": "Str0ng!Pass"})
    headers_a = {"Authorization": f"Bearer {login_a.json()['access_token']}"}
    patient = _create_patient(client, headers_a, name="Paciente da A")

    # Profissional B não deve enxergar o paciente da A
    client.post(
        "/register/",
        json={"username": "profB", "email": "b@example.com", "password": "Str0ng!Pass"},
    )
    login_b = client.post("/login/", json={"username": "profB", "password": "Str0ng!Pass"})
    headers_b = {"Authorization": f"Bearer {login_b.json()['access_token']}"}

    response = client.get(f"/patients/{patient['id']}", headers=headers_b)
    assert response.status_code == 404

    response = client.get("/patients/", headers=headers_b)
    assert response.json() == []


def test_update_and_delete_patient(client, registered_user):
    headers = _auth_headers(client, registered_user)
    patient = _create_patient(client, headers)

    response = client.patch(
        f"/patients/{patient['id']}", json={"name": "Maria S. Silva"}, headers=headers
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Maria S. Silva"

    response = client.delete(f"/patients/{patient['id']}", headers=headers)
    assert response.status_code == 204

    response = client.get(f"/patients/{patient['id']}", headers=headers)
    assert response.status_code == 404


def test_create_and_list_readings(client, registered_user):
    headers = _auth_headers(client, registered_user)
    patient = _create_patient(client, headers)

    response = client.post(
        f"/patients/{patient['id']}/readings/",
        json={
            "weight_kg": 70.5,
            "height_cm": 170,
            "body_fat_percent": 22.3,
            "raw_data": {"source": "test"},
        },
        headers=headers,
    )
    assert response.status_code == 201
    reading = response.json()
    assert reading["patient_id"] == patient["id"]
    assert reading["weight_kg"] == 70.5

    response = client.get(f"/patients/{patient['id']}/readings/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_readings_require_owned_patient(client):
    client.post(
        "/register/",
        json={"username": "profC", "email": "c@example.com", "password": "Str0ng!Pass"},
    )
    login_c = client.post("/login/", json={"username": "profC", "password": "Str0ng!Pass"})
    headers_c = {"Authorization": f"Bearer {login_c.json()['access_token']}"}
    patient = _create_patient(client, headers_c)

    client.post(
        "/register/",
        json={"username": "profD", "email": "d@example.com", "password": "Str0ng!Pass"},
    )
    login_d = client.post("/login/", json={"username": "profD", "password": "Str0ng!Pass"})
    headers_d = {"Authorization": f"Bearer {login_d.json()['access_token']}"}

    response = client.post(
        f"/patients/{patient['id']}/readings/", json={"weight_kg": 80}, headers=headers_d
    )
    assert response.status_code == 404
