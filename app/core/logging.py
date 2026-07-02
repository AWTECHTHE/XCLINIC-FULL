import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logging():
    """Configurar sistema de logging com rotação de arquivos"""
    
    # Criar diretório de logs se não existir
    logs_dir = "logs"
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)
    
    # Logger de segurança
    security_logger = logging.getLogger("security")
    security_logger.setLevel(logging.INFO)
    
    # Handler com rotação
    security_handler = RotatingFileHandler(
        f"{logs_dir}/security.log",
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    security_handler.setLevel(logging.INFO)
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    security_handler.setFormatter(formatter)
    
    security_logger.addHandler(security_handler)
    
    # Logger de aplicação
    app_logger = logging.getLogger("app")
    app_logger.setLevel(logging.DEBUG)
    
    app_handler = RotatingFileHandler(
        f"{logs_dir}/app.log",
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    app_handler.setLevel(logging.DEBUG)
    app_handler.setFormatter(formatter)
    
    app_logger.addHandler(app_handler)
    
    return security_logger, app_logger
