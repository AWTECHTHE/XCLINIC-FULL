from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.core.config import settings
import time

def _allowed_hosts() -> set[str]:
    return {host.strip().lower() for host in settings.ALLOWED_HOSTS.split(",") if host.strip()}

def add_middlewares(app: FastAPI):
    @app.middleware("http")
    async def validate_request(request: Request, call_next):
        host = request.headers.get("host", "").split(":", 1)[0].lower()
        allowed_hosts = _allowed_hosts()
        if allowed_hosts and host not in allowed_hosts:
            return JSONResponse(status_code=400, content={"detail": "Invalid host header"})

        path = request.scope.get("path", "")
        if not path.startswith("/"):
            return JSONResponse(status_code=400, content={"detail": "Invalid request path"})

        content_type = request.headers.get("content-type", "").split(";", 1)[0].lower()
        content_length = request.headers.get("content-length")
        if content_type == "application/x-www-form-urlencoded" and not content_length:
            return JSONResponse(status_code=411, content={"detail": "Content-Length required"})
        if content_type == "application/x-www-form-urlencoded" and content_length:
            try:
                if int(content_length) > settings.MAX_FORM_BODY_SIZE:
                    return JSONResponse(status_code=413, content={"detail": "Request body too large"})
            except ValueError:
                return JSONResponse(status_code=400, content={"detail": "Invalid content length"})

        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time

        # Headers de segurança
        response.headers["X-Process-Time"] = str(process_time)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"

        return response

# ...existing code...
