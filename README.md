# XCLINIC - Full Project

Repositório unificado do projeto XClinic, reunindo o frontend/app híbrido e o backend em um único monorepo.

## Estrutura

- [`xclinic-hybrid-app/`](./xclinic-hybrid-app) — Aplicativo híbrido (Next.js + Capacitor, Android/iOS).
- [`xclinic-server-backend/`](./xclinic-server-backend) — Backend (FastAPI/Python).

Cada diretório mantém seu próprio histórico de commits, importado via `git subtree` a partir dos repositórios originais:

- https://github.com/AWTECHTHE/xclinic-hybrid-app
- https://github.com/AWTECHTHE/xclinic-server-backend

Consulte o `README.md` de cada subprojeto para instruções específicas de build, execução e deploy.
