# XCLINIC - Full Project

Repositório unificado do projeto XClinic, reunindo o frontend/app híbrido e o backend em um único monorepo.

## Estrutura

- [`xclinic-hybrid-app/`](./xclinic-hybrid-app) — Aplicativo híbrido (Next.js + Capacitor, Android/iOS).
- [`xclinic-server-backend/`](./xclinic-server-backend) — Backend (FastAPI/Python).

Cada diretório mantém seu próprio histórico de commits, importado via `git subtree` a partir dos repositórios originais:

- https://github.com/AWTECHTHE/xclinic-hybrid-app
- https://github.com/AWTECHTHE/xclinic-server-backend

> **Este é agora o repositório oficial do projeto.** Os repositórios originais acima
> ficarão disponíveis apenas para consulta histórica e serão arquivados futuramente.
> Todo novo desenvolvimento deve ser feito aqui.

Consulte o `README.md` de cada subprojeto para instruções específicas de build, execução e deploy.

## Rodando tudo junto (docker-compose)

Na raiz do monorepo:

```bash
cp .env.example .env   # ajuste os valores conforme necessário
docker compose up --build
```

Isso sobe: Nginx (porta 90), API FastAPI (porta 8000, atrás do Nginx), Postgres (5432),
Redis (6380) e o app Next.js (3000), já configurado para chamar a API via `NEXT_PUBLIC_API_URL`.

As credenciais reais do backend continuam em `xclinic-server-backend/config/dev.env`.

> `xclinic-server-backend/docker-compose.yml` (dentro do subprojeto) é um
> compose **standalone/legado**, de antes da unificação em monorepo — usa
> nomes de serviço diferentes (`awlicite_*`) e não é mantido. Use sempre o
> `docker-compose.yml` da raiz, acima.

## Testes

```bash
# Backend (a partir de xclinic-server-backend/)
pip install -r requirements-dev.txt
pytest

# Frontend (a partir de xclinic-hybrid-app/)
yarn install
yarn test
```

## CI/CD

O monorepo usa GitHub Actions com path filters, na raiz (`.github/workflows/`):

- `backend-ci.yml` — roda quando algo em `xclinic-server-backend/**` muda.
- `app-ci.yml` — roda quando algo em `xclinic-hybrid-app/**` muda.

Cada workflow só é disparado quando o subprojeto correspondente é alterado.
