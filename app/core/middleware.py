
from fastapi import FastAPI
import time

def add_middlewares(app: FastAPI):
    @app.middleware("http")
    async def add_process_time_header(request, call_next):
        response = await call_next(request)
        response.headers["X-Process-Time"] = str(time.time())
        return response

# ...existing code...