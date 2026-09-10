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
  Endpoint protegido por token de acesso. Lista usuários reais persistidos no banco, com paginação via `skip`/`limit` (limite máximo controlado por `ITEMS_PER_USER`).
- **Dashboard** — `GET /dashboard/`
  Endpoint protegido que retorna dados do usuário autenticado e estatísticas reais (total de usuários cadastrados).

### Segurança de senha e tokens (`app/core/security.py`)
- Hash de senha com **bcrypt** (`passlib`).
- Validação de força de senha: mínimo 8 caracteres, exige maiúscula, minúscula, número e símbolo.
- Geração e verificação de **JWT** (access e refresh), com tipos distintos (`access`/`refresh`) e segredos/expiração configuráveis.

## Pacientes e Bioimpedância

- **Cadastro de paciente** — `POST /patients/`
  Cria um paciente (nome, data de nascimento, sexo) vinculado ao profissional autenticado (`owner_id`).
- **Listagem de pacientes** — `GET /patients/` (paginada via `skip`/`limit`)
- **Detalhe, atualização e remoção** — `GET|PATCH|DELETE /patients/{id}`
- Todas as rotas de paciente são **escopadas ao profissional autenticado**: um profissional não enxerga nem manipula pacientes de outro (retorna `404` em vez de `403`, para não vazar a existência do registro).
- **Leituras de bioimpedância (série temporal)** — `POST /patients/{id}/readings/` e `GET /patients/{id}/readings/`
  Cada leitura guarda peso, altura, %gordura, massa magra, água corporal total, metabolismo basal, ângulo de fase e o `raw_data` (JSON bruto de origem, ex: resultado de um parsing futuro via Docling/LLM), preservado para auditoria/reprocessamento.
- Modelos: `app/models/patient.py` (`Patient`), `app/models/bioimpedance.py` (`BioimpedanceReading`, 1:N com `Patient`).
- **Upload de relatório de bioimpedância** — `POST /inbody/` (multipart: `patient_id` + `file` PDF)
  Recebe o PDF já esperado pela tela de upload do frontend (`FileUpload.tsx`) e cria uma `BioimpedanceReading` para o paciente informado (validando que o paciente pertence ao profissional autenticado). **Ainda não faz extração real dos dados clínicos** (isso depende de integrar Docling + um LLM, como descrito no MVP): a leitura criada vem com todos os campos numéricos nulos e `analise_obesidade.extraction_status = "pending"`. O arquivo em si não é persistido em storage nenhum ainda (sem S3/disco configurado) — apenas nome, tamanho e content-type ficam em `raw_data.file`, para rastreabilidade.
  - **Pendente no frontend**: `uploadPage.tsx`/`FileUpload.tsx` ainda não enviam `patient_id` (não existe UI de seleção/gestão de paciente no frontend hoje) — o endpoint já está pronto, mas a tela precisa ser atualizada para escolher o paciente antes do upload.
  - **Pendente no backend**: plugar a extração real via Docling + LLM no lugar do placeholder.

## Itens

- **Listagem de itens** — `GET /items/`
  Endpoint simples que ainda retorna dados mockados: não existe um modelo/tabela `Item` no banco. Pendente definir o domínio (campos, dono, persistência) antes de implementar de verdade.

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
- Migrações de schema com **Alembic** (criar, aplicar, reverter e listar migrações) — **atenção**: `alembic/versions/` está vazio hoje (nenhuma migração foi gerada ainda, nem para `users`); na prática o schema é criado inteiramente por `init_db()` via `Base.metadata.create_all()`. `docker-compose.yml` já roda `alembic upgrade head` antes de subir a API, mas isso é um no-op sem migrações — gerar uma baseline com `alembic revision --autogenerate` (com um Postgres real rodando) é uma pendência separada.
- Modelo de dados `User`: `id`, `username` (único), `email` (único), `hashed_password`.
- Modelo de dados `Patient`: `id`, `owner_id` (FK `users.id`), `name`, `birth_date`, `sex`, `created_at`.
- Modelo de dados `BioimpedanceReading`: `id`, `patient_id` (FK `patients.id`), `measured_at`, métricas de bioimpedância, `raw_data` (JSON), `created_at`.

## Infraestrutura / Deploy

- **Docker**: Dockerfile da aplicação e `docker-compose.yml` para orquestração local (API + banco + cache).
- **Kubernetes**: manifests para deployment da API, banco de dados, Redis (cache) e Nginx (proxy reverso), incluindo ConfigMaps, Secrets, Services e PersistentVolumeClaims.
- **Nginx** como proxy reverso (`nginx.conf`).
- **CI**: workflow no GitHub Actions (`.github/workflows/ci.yml`).
- Script `run.sh` para execução simplificada da aplicação.

## Testes

- Suíte de testes com **pytest** + `TestClient` em `tests/` (banco SQLite isolado por teste, fora do fluxo de dados de produção).
- Cobertura atual: registro (sucesso, senha fraca, usuário duplicado), login (sucesso/falha), refresh de token, listagem de usuários (com e sem autenticação), dashboard, CRUD de pacientes (incluindo isolamento entre profissionais), leituras de bioimpedância e upload de relatório via `/inbody/` (autenticação, validação de tipo de arquivo, isolamento entre profissionais).
- Rodar localmente: `pip install -r requirements-dev.txt && pytest`.

## Estado atual / observações

- `GET /items/` ainda retorna **dados mockados** — não há modelo `Item` persistido no banco.
- `/list-users/` foi removido: sua funcionalidade (listar usuários reais autenticado) foi incorporada ao `GET /users/`, que agora é paginado.
- Corrigida incompatibilidade `passlib` + `bcrypt`: a combinação `passlib==1.7.4` + `bcrypt>=4.1` quebrava **todo** hash/verificação de senha (registro e login retornavam erro 500). `bcrypt` foi fixado em `4.0.1` até que o `passlib` seja atualizado/substituído.
