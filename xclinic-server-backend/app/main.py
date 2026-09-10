from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, item, patient
from app.core.middleware import add_middlewares
from app.core.init_db import init_db
import logging

# Configurar logging de segurança
logger = logging.getLogger("security")
logger.setLevel(logging.INFO)

app = FastAPI(
    title="xclinic-server-backend",
    description="API for xclinic Backend",
    version="0.0.1"
)

# Configurar CORS com origem segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],  # Configurar domínios específicos
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600
)

# Inicializar banco de dados
init_db()

# Adicionar middlewares
add_middlewares(app)

# Incluir roteadores
app.include_router(user.router)
app.include_router(item.router)
app.include_router(patient.router)

@app.get("/")
async def health():
    return {"message": 'API is up and running! "The happiness of your life depends upon the quality of your thoughts." - Marcus Aurelius 🏛️🌿📜🏺'}

@app.get("/ping")
async def ping():
    return {"message": "pong"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    path = request.scope.get("path", "")
    # Registrar erro com detalhes para debug
    logger.error(
        f"Unhandled exception on {path}",
        extra={
            "method": request.method,
            "path": path,
            "error_type": type(exc).__name__,
        },
        exc_info=True
    )
    # Retornar mensagem genérica para o cliente
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later."},
    )
