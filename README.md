# xclinic-server-backend

## Instalação

### Siga os passos abaixo para configurar o ambiente e rodar a aplicação:

Clone o repositório:

```
git clone https://github.com/AWTECHTHE/xclinic-server-backend.git
cd xclinic-server-backend/backend/
```
# Criar e ativar um ambiente virtual (opcional, mas recomendado)
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Instalar FastAPI e Uvicorn
pip install fastapi uvicorn
chmod +x /home/matheus-levi/Documentos/WorkSpace/AWTech/xclinic-server-backend/kubernetes/install.sh

# Configure as variáveis de ambiente: 
# Copie o arquivo .env da pasta 'config' para a raiz do projeto e adicione as variáveis necessárias como em '.env.template'.
cp ./config/.env .env

Um exemplo básico:

```


# ============================
# General Settings
# ============================
DEBUG=1           # 0 para produção, 1 para desenvolvimento
SECRET_KEY=       # Insira sua SECRET_KEY
ALLOWED_HOSTS=    # Adicione hosts separados por vírgulas

# ============================
# JWT Configuration
# ============================
#minutes
ACCESS_TOKEN_LIFETIME=60
#DAYS
REFRESH_TOKEN_LIFETIME=1
# ============================
# Database Configuration
# ============================
DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db
POSTGRES_DB=your_db
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### Executando a aplicação

#### Usando `run.sh`

1. Certifique-se de que o script `run.sh` tem permissão de execução:
   ```
   chmod +x run.sh
   ```

2. Execute o script como root ou usando `sudo`:
   ```
   sudo ./run.sh
   ```

#### Usando `docker-compose`

1. Construa e inicie os containers Docker:
   ```
   docker compose -f docker-compose.yml up --build
   ```

2. Execute as migrações do banco de dados:
   ```
   docker compose exec xclinic_api alembic upgrade head
   ```

### Gerenciando Migrações

#### Gerar uma nova migração

Para gerar uma nova migração, execute:
```
docker-compose run xclinic_api alembic revision --autogenerate -m "Initial migration"
```

#### Aplicar migrações

Para aplicar migrações, execute:
```
docker-compose run xclinic_api alembic upgrade head
```

#### Reverter migrações

Para reverter migrações, execute:
```
docker-compose run xclinic_api alembic downgrade base
```

#### Listar migrações

Para listar todas as migrações, execute:
```
docker-compose exec xclinic_api alembic history
```

#### Remover todas as migrações

Para remover todas as migrações, execute:
```
rm -rf /home/matheus-levi/Documentos/WorkSpace/AWTech/xclinic-server-backend/alembic/versions/*
```

### Acessando o banco de dados no DBeaver

1. Abra o DBeaver.
2. Clique em `Database` > `New Database Connection`.
3. Selecione `PostgreSQL` e clique em `Next`.
4. Preencha os campos com as seguintes informações:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `your_db` (substitua pelo nome do seu banco de dados)
   - **Username**: `your_user` (substitua pelo nome do seu usuário)
   - **Password**: `your_password` (substitua pela sua senha)
5. Clique em `Test Connection` para verificar a conexão.
6. Se a conexão for bem-sucedida, clique em `Finish`.

Agora você pode acessar e gerenciar o banco de dados PostgreSQL usando o DBeaver.
