# CRUD de Pessoas - Projeto Chat SD

API REST para gerenciamento de pessoas com documentação Swagger.

## 🚀 Como Subir

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Ou para desenvolvimento com auto-reload
npm run dev
```

O servidor estará rodando em **http://localhost:3001**

## 📚 Documentação Swagger

Acesse a documentação interativa em: **http://localhost:3001/api-docs**

## 🔌 Endpoints

### GET /api/pessoas
Lista todas as pessoas cadastradas.

### GET /api/pessoas/:id
Busca uma pessoa específica por ID.

### POST /api/pessoas
Cria uma nova pessoa.

**Body:**
```json
{
  "nome": "João Silva",
  "idade": 25,
  "cpf": "12345678900",
  "email": "joao@email.com",
  "sexo": "M"
}
```

### PUT /api/pessoas/:id
Atualiza uma pessoa existente.

**Body:** (mesmo formato do POST)

### DELETE /api/pessoas/:id
Deleta uma pessoa.

## 📝 Campos

- **nome** (string, obrigatório): Nome completo da pessoa
- **idade** (integer, obrigatório): Idade da pessoa
- **cpf** (string, obrigatório): CPF da pessoa (único)
- **email** (string, obrigatório): Email da pessoa (único)
- **sexo** (string, obrigatório): Sexo da pessoa (M, F, Outro)

## 💬 Comandos no Chat

O CRUD está integrado ao chat. Use os seguintes comandos:

- `/pessoas` - Lista todas as pessoas
- `/pessoa criar |Nome|Idade|CPF|Email|Sexo` - Cria uma nova pessoa
- `/pessoa buscar {id}` - Busca uma pessoa por ID
- `/pessoa deletar {id}` - Deleta uma pessoa

**Exemplo:**
```
/pessoa criar |João Silva|25|12345678900|joao@email.com|M
```

