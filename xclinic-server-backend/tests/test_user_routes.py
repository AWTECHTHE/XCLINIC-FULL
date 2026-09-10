def _auth_headers(client, username="jdoe", password="Str0ng!Pass"):
    response = client.post("/login/", json={"username": username, "password": password})
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_register_creates_user(client):
    response = client.post(
        "/register/",
        json={"username": "newuser", "email": "new@example.com", "password": "Str0ng!Pass"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["username"] == "newuser"
    assert body["email"] == "new@example.com"
    assert "password" not in body
    assert "hashed_password" not in body


def test_register_rejects_weak_password(client):
    response = client.post(
        "/register/",
        json={"username": "weakpw", "email": "weak@example.com", "password": "alllowercase1"},
    )
    assert response.status_code == 400


def test_register_rejects_duplicate_user(client, registered_user):
    response = client.post("/register/", json=registered_user)
    assert response.status_code == 409


def test_login_success(client, registered_user):
    response = client.post(
        "/login/",
        json={"username": registered_user["username"], "password": registered_user["password"]},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]


def test_login_invalid_credentials(client, registered_user):
    response = client.post(
        "/login/",
        json={"username": registered_user["username"], "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_token_refresh_returns_new_pair(client, registered_user):
    login = client.post(
        "/login/",
        json={"username": registered_user["username"], "password": registered_user["password"]},
    )
    refresh_token = login.json()["refresh_token"]
    response = client.post(
        "/token/refresh", headers={"Authorization": f"Bearer {refresh_token}"}
    )
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_users_endpoint_requires_auth(client):
    response = client.get("/users/")
    assert response.status_code == 401


def test_users_endpoint_lists_real_users(client, registered_user):
    headers = _auth_headers(client)
    response = client.get("/users/", headers=headers)
    assert response.status_code == 200
    usernames = [u["username"] for u in response.json()]
    assert registered_user["username"] in usernames


def test_dashboard_reports_real_user_count(client, registered_user):
    headers = _auth_headers(client)
    response = client.get("/dashboard/", headers=headers)
    assert response.status_code == 200
    body = response.json()
    assert body["data"]["total_users"] == 1
