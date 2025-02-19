#!/bin/bash

# Verificando se a execução é via sudo
if [ "$(id -u)" != "0" ]; then
    echo "Este script deve ser executado como root ou com sudo"
    exit 1
fi

echo "Iniciando instalação do Docker, Kubernetes, Docker Compose e Snap..."

# Instalando o Snap
echo "Instalando o Snap..."
apt-get update
apt-get install -y snapd

# 1. Instalando o Docker
echo "Instalando o Docker..."

# Atualiza pacotes e instala dependências necessárias
apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    lsb-release \
    software-properties-common

# Adicionando a chave oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Adicionando o repositório do Docker
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

# Instalando o Docker
apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io

# Habilitando o Docker para iniciar automaticamente
systemctl enable docker
systemctl start docker

# Verificando a instalação do Docker
docker --version

# 2. Instalando o Kubernetes (Minikube)
echo "Instalando o Kubernetes (Minikube)..."

# Instalando dependências do Kubernetes
apt-get install -y curl wget apt-transport-https
snap install kubectl --classic

# Baixando e instalando o Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
chmod +x minikube-linux-amd64
mv minikube-linux-amd64 /usr/local/bin/minikube
sudo apt-get update
sudo apt-get install docker-compose-plugin
# Iniciando o Minikube
minikube start

# Verificando a instalação do Minikube
minikube version

# 3. Instalando o Docker Compose
echo "Instalando o Docker Compose..."

# Baixando a versão mais recente do Docker Compose
curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Tornando o Docker Compose executável
chmod +x /usr/local/bin/docker-compose

# Verificando a instalação do Docker Compose
docker-compose --version

echo "Instalação do Docker, Kubernetes (Minikube), Docker Compose e Snap concluída!"
