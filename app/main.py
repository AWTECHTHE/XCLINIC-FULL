from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routers import user, item
from app.core.middleware import add_middlewares
from app.core.init_db import init_db

app = FastAPI(
    title="xclinic-server-backend",
    description="API for xclinic Backend",
    version="0.0.1"
)

# Inicializar banco de dados
init_db()

# Adicionar middlewares
add_middlewares(app)

# Incluir roteadores
app.include_router(user.router)
app.include_router(item.router)

@app.get("/auth")
def read_auth():
    return {"message": "Auth Service"}

@app.get("/")
async def ping():
    return {"message": 'API is up and running! "The happiness of your life depends upon the quality of your thoughts." - Marcus Aurelius 🏛️🌿📜🏺'}

@app.get("/ping")
async def ping():
    return {"message": "pong"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred."},
    )