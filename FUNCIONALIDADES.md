# Funcionalidades — xclinic-server-backend

API backend construída em **FastAPI** com persistência em **PostgreSQL** (via SQLAlchemy) e migrações gerenciadas por **Alembic**.

## Autenticação e Usuários

- **Cadastro de usuário** — `POST /register/`
  Cria um novo usuário (username, email, senha). Retorna `409 Conflict` se usuário/email já existir.
- **Login** — `POST /login/`
  Autentica usuário e senha, retorna par de tokens JWT (access + refresh).
- **Refresh de token** — `POST /token/refresh`
  Gera novo access/refresh token a partir de um refresh token válido.
- **Listagem de usuários (autenticada)** — `GET /users/`
  Endpoint protegido por token de acesso (atualmente retorna dados mockados).
- **Listagem real de usuários (dev)** — `GET /list-users/`
  Lista usuários persistidos no banco (username/email). Marcado no código como uso apenas para desenvolvimento.
- **Dashboard** — `GET /dashboard/`
  Endpoint protegido que retorna dados mockados de estatísticas do usuário autenticado.

### Segurança de senha e tokens (`app/core/security.py`)
- Hash de senha com **bcrypt** (`passlib`).
- Validação de força de senha: mínimo 8 caracteres, exige maiúscula, minúscula, número e símbolo.
- Geração e verificação de **JWT** (access e refresh), com tipos distintos (`access`/`refresh`) e segredos/expiração configuráveis.

## Itens

- **Listagem de itens** — `GET /items/`
  Endpoint simples que retorna itens (atualmente com dados mockados).

## Infraestrutura e Segurança de Requisições

- **CORS** configurado (origens, métodos e headers permitidos).
- **Middleware de validação de requisição** (`app/core/middleware.py`):
  - Validação de `Host` header contra lista de hosts permitidos (`ALLOWED_HOSTS`).
  - Validação de path da requisição.
  - Exigência de `Content-Length` em uploads `x-www-form-urlencoded` e limite máximo de tamanho (`MAX_FORM_BODY_SIZE`).
  - Headers de segurança na resposta: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`.
  - Header `X-Process-Time` com tempo de processamento da requisição.
- **Tratamento global de exceções** — captura erros não tratados, loga detalhes internamente e retorna mensagem genérica ao cliente (evita vazamento de stack trace).
- **Logging de segurança** configurado via `logging`.
- **Health check** — `GET /` e `GET /ping` para verificação de disponibilidade da API.

## Configuração (`app/core/config.py`)

- Carregamento de variáveis de ambiente a partir de arquivo `.env` e/ou variáveis do sistema.
- Configurações suportadas: nome da aplicação, e-mail de admin, limite de itens por usuário, hosts permitidos, tamanho máximo de corpo de formulário, segredos e tempos de expiração de JWT (access/refresh), URL do banco e credenciais PostgreSQL.

## Banco de Dados

- Conexão com PostgreSQL via SQLAlchemy (`app/core/database.py`).
- Inicialização automática do schema do banco na subida da aplicação (`init_db`).
- Migrações de schema com **Alembic** (criar, aplicar, reverter e listar migrações).
- Modelo de dados `User`: `id`, `username` (único), `email` (único), `hashed_password`.

## Infraestrutura / Deploy

- **Docker**: Dockerfile da aplicação e `docker-compose.yml` para orquestração local (API + banco + cache).
- **Kubernetes**: manifests para deployment da API, banco de dados, Redis (cache) e Nginx (proxy reverso), incluindo ConfigMaps, Secrets, Services e PersistentVolumeClaims.
- **Nginx** como proxy reverso (`nginx.conf`).
- **CI**: workflow no GitHub Actions (`.github/workflows/ci.yml`).
- Script `run.sh` para execução simplificada da aplicação.

## Estado atual / observações

- Os endpoints `/users/`, `/dashboard/` e `/items/` retornam atualmente **dados mockados**, não refletindo dados reais do banco (exceto `/list-users/`).
- `/list-users/` está sinalizado no código como endpoint apenas para desenvolvimento, não recomendado para produção.
