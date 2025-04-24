
# 📘 Documentação - Sistema de Carteira Digital

Este projeto consiste em um sistema de carteira digital com **NestJS (backend)** e **React (frontend)**. Ele permite cadastro, autenticação, transferências, reversões e visualização de usuários/transações.

---

## 🔧 Requisitos

- [Node.js](https://nodejs.org/en/) (v18+)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- (Opcional) [DBeaver](https://dbeaver.io/) para visualizar o banco

---

## 🚀 Rodando o Backend (NestJS)

1. **Clone o projeto e acesse a pasta do backend:**

```bash
git clone https://github.com/WilliamKly/wallet-api.git
cd wallet-api
```

2. **Crie um arquivo `.env` na raiz com o seguinte conteúdo:**

```env
JWT_SECRET=supersecret
JWT_EXPIRES_IN=1d
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=wallet
```

3. **Suba os containers com Docker:**

```bash
docker-compose up --build
```

> Esse comando irá subir:
> - PostgreSQL (porta 5432)
> - RabbitMQ (portas 5672 e 15672)
> - API NestJS (porta 3001)

4. **Verifique se a API está funcionando:**

Acesse [http://localhost:3001](http://localhost:3001) no navegador ou use ferramentas como o [Postman](https://www.postman.com/).


## 🐇 Painel RabbitMQ

- Acesse: [http://localhost:15672](http://localhost:15672)
- Login: `guest`
- Senha: `guest`




# 📘 API - Carteira Digital

Esta API permite criar usuários, autenticar, realizar depósitos, transferências, reversões e consultar saldo e transações.

> Todas as rotas que exigem autenticação devem receber o token JWT no header:  
> `Authorization: Bearer <access_token>`

---

## 🔐 Autenticação

### Criar Usuário

`POST /users`

```json
{
  "name": "wildasl",
  "email": "wdasill@email.com",
  "password": "123456"
}
```

---

### Fazer Login

`POST /auth/login`

```json
{
  "email": "will@email.com",
  "password": "123456"
}
```

**Resposta:**

```json
{
  "access_token": "..."
}
```

---

## 💰 Transações

### Realizar Depósito

`POST /transactions/deposit`

**Headers:**  
`Authorization: Bearer <access_token>`

```json
{
  "amount": 5
}
```

**Resposta:**

```json
{
  "message": "Depósito realizado com sucesso",
  "newBalance": 5
}
```

---

### Transferir Dinheiro

`POST /transactions/transfer`

**Headers:**  
`Authorization: Bearer <access_token>`

```json
{
  "receiverId": "ec198177-b2c6-4db2-83ff-9c66f15e5189",
  "amount": 150
}
```

**Resposta:**

```json
{
  "message": "Transferência realizada com sucesso!",
  "transactionId": "583819e1-b8d5-41e2-b15b-2a61677b7c3f"
}
```

---

### Reverter uma Transferência

`POST /reversals/{transactionId}`

**Headers:**  
`Authorization: Bearer <access_token>`

**Resposta:**

```json
{
  "message": "Solicitação registrada",
  "reversalId": "0c5e7984-1df1-419b-ac75-984b91004821"
}
```

---

## 👥 Usuários

### Listar Todos os Usuários

`GET /users`

**Headers:**  
`Authorization: Bearer <access_token>`

**Resposta:**

```json
[
  {
    "id": "ec198177-b2c6-4db2-83ff-9c66f15e5189",
    "email": "wdasill@email.com",
    "name": "wildasl"
  }
]
```

---

### Ver Meu Saldo

`GET /users/balance`

**Headers:**  
`Authorization: Bearer <access_token>`

**Resposta:**

```json
[
  {
    "balance": "978.00"
  }
]
```

---

## 🔄 Consultar Transações

### Minhas Transações

`GET /transactions`

**Headers:**  
`Authorization: Bearer <access_token>`

**Resposta:**

```json
[
  {
    "id": "c23990d5-e076-48cf-8e0f-fce66f72f197",
    "sender": {
      "id": "fc866f51-dd46-4de5-8918-58fb6c0af739",
      "email": "testeSenhateste123@gmail.com",
      "name": "teste",
    },
    "receiver": {
      "id": "b893d7d9-bf7a-4f1d-a8e9-a418bf7364cf",
      "email": "klevissonweskley13@gmail.com",
      "name": "Wiliam Klywerston de Oliveira Silva",
    },
    "amount": "450.00",
    "reversed": false,
    "createdAt": "2025-04-23T23:52:05.183Z",
    "receiverUser": true
  }
]
```