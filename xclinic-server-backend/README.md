# xclinic-server-backend

> Este subprojeto faz parte do monorepo [XCLINIC-FULL](../README.md). Para
> subir a stack completa (API + app + banco + Redis + Nginx) da forma
> recomendada, veja o `README.md` da raiz do monorepo e rode
> `docker compose up --build` a partir de lá. As instruções abaixo são para
> rodar **só a API**, sem Docker, útil para desenvolvimento local rápido.

## Instalação (rodando a API sozinha, sem Docker)

Clone o repositório e entre neste subprojeto:

```bash
git clone https://github.com/AWTECHTHE/XCLINIC-FULL.git
cd XCLINIC-FULL/xclinic-server-backend
```

Crie e ative um ambiente virtual (opcional, mas recomendado):

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

Instale as dependências:

```bash
pip install -r requirements.txt
# para rodar os testes também:
pip install -r requirements-dev.txt
```

### Configurando as variáveis de ambiente

Copie `config/.exemple.env` para `config/dev.env` (é o arquivo que
`app/core/config.py` carrega por padrão) e ajuste os valores:

```bash
cp config/.exemple.env config/dev.env
```

Variáveis suportadas (ver `app/core/config.py` para a lista completa e os
valores padrão):

```
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_db
JWT_SECRET=troque-por-um-segredo-forte
JWT_EXPIRATION=60          # minutos (access token)
JWT_REFRESH_SECRET=troque-por-outro-segredo-forte
JWT_REFRESH_EXPIRATION=1   # dias (refresh token)
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Rodando a aplicação

```bash
uvicorn app.main:app --reload
```

A API sobe em `http://localhost:8000` (docs interativas em `/docs`).

> `run.sh`, nesta pasta, **não inicia a aplicação** — é um script de
> provisionamento de máquina (instala Docker, Docker Compose e Minikube via
> `apt`/`snap`, requer `sudo`). Use-o só se precisar preparar um host do
> zero; para rodar a API, use `uvicorn` (acima) ou o `docker-compose.yml` da
> raiz do monorepo.

### Testes

```bash
pytest
```

## Gerenciando migrações (Alembic)

Rodando localmente (fora do Docker), a partir desta pasta:

```bash
# aplicar todas as migrações pendentes
alembic upgrade head

# gerar uma nova migração a partir de mudanças nos modelos
alembic revision --autogenerate -m "descrição da mudança"

# reverter até a migração inicial
alembic downgrade base

# listar o histórico de migrações
alembic history
```

Via Docker (a partir da raiz do monorepo, usando o `docker-compose.yml`
oficial — o serviço da API se chama `api`):

```bash
docker compose exec api alembic upgrade head
docker compose exec api alembic revision --autogenerate -m "descrição da mudança"
```

## Acessando o banco de dados no DBeaver

1. Abra o DBeaver.
2. Clique em `Database` > `New Database Connection`.
3. Selecione `PostgreSQL` e clique em `Next`.
4. Preencha os campos com as informações do seu `config/dev.env` (ou do
   `.env` da raiz do monorepo, se estiver usando `docker-compose`):
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: valor de `POSTGRES_DB`
   - **Username**: valor de `POSTGRES_USER`
   - **Password**: valor de `POSTGRES_PASSWORD`
5. Clique em `Test Connection` para verificar a conexão.
6. Se a conexão for bem-sucedida, clique em `Finish`.
