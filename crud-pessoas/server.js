const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Armazenamento em memória (em produção, usar banco de dados)
let pessoas = [];
let nextId = 1;

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API CRUD de Pessoas",
      version: "1.0.0",
      description: "API para gerenciamento de pessoas com os campos: Nome, Idade, CPF, Email e Sexo",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Servidor de desenvolvimento",
      },
    ],
  },
  apis: ["./server.js"], // Caminho para os arquivos com anotações
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Pessoa:
 *       type: object
 *       required:
 *         - nome
 *         - idade
 *         - cpf
 *         - email
 *         - sexo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da pessoa
 *         nome:
 *           type: string
 *           description: Nome completo da pessoa
 *         idade:
 *           type: integer
 *           description: Idade da pessoa
 *         cpf:
 *           type: string
 *           description: CPF da pessoa
 *         email:
 *           type: string
 *           format: email
 *           description: Email da pessoa
 *         sexo:
 *           type: string
 *           enum: [M, F, Outro]
 *           description: Sexo da pessoa
 */

/**
 * @swagger
 * /api/pessoas:
 *   get:
 *     summary: Lista todas as pessoas
 *     tags: [Pessoas]
 *     responses:
 *       200:
 *         description: Lista de pessoas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pessoa'
 */
app.get("/api/pessoas", (req, res) => {
  res.json(pessoas);
});

/**
 * @swagger
 * /api/pessoas/{id}:
 *   get:
 *     summary: Busca uma pessoa por ID
 *     tags: [Pessoas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa
 *     responses:
 *       200:
 *         description: Pessoa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pessoa'
 *       404:
 *         description: Pessoa não encontrada
 */
app.get("/api/pessoas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pessoa = pessoas.find((p) => p.id === id);

  if (!pessoa) {
    return res.status(404).json({ error: "Pessoa não encontrada" });
  }

  res.json(pessoa);
});

/**
 * @swagger
 * /api/pessoas:
 *   post:
 *     summary: Cria uma nova pessoa
 *     tags: [Pessoas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pessoa'
 *     responses:
 *       201:
 *         description: Pessoa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pessoa'
 *       400:
 *         description: Dados inválidos
 */
app.post("/api/pessoas", (req, res) => {
  const { nome, idade, cpf, email, sexo } = req.body;

  // Validação básica
  if (!nome || !idade || !cpf || !email || !sexo) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  // Verificar se CPF já existe
  if (pessoas.some((p) => p.cpf === cpf)) {
    return res.status(400).json({ error: "CPF já cadastrado" });
  }

  // Verificar se email já existe
  if (pessoas.some((p) => p.email === email)) {
    return res.status(400).json({ error: "Email já cadastrado" });
  }

  const novaPessoa = {
    id: nextId++,
    nome,
    idade: parseInt(idade),
    cpf,
    email,
    sexo,
  };

  pessoas.push(novaPessoa);
  res.status(201).json(novaPessoa);
});

/**
 * @swagger
 * /api/pessoas/{id}:
 *   put:
 *     summary: Atualiza uma pessoa existente
 *     tags: [Pessoas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pessoa'
 *     responses:
 *       200:
 *         description: Pessoa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pessoa'
 *       404:
 *         description: Pessoa não encontrada
 *       400:
 *         description: Dados inválidos
 */
app.put("/api/pessoas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pessoaIndex = pessoas.findIndex((p) => p.id === id);

  if (pessoaIndex === -1) {
    return res.status(404).json({ error: "Pessoa não encontrada" });
  }

  const { nome, idade, cpf, email, sexo } = req.body;

  // Validação básica
  if (!nome || !idade || !cpf || !email || !sexo) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  // Verificar se CPF já existe em outra pessoa
  const cpfExists = pessoas.some((p) => p.cpf === cpf && p.id !== id);
  if (cpfExists) {
    return res.status(400).json({ error: "CPF já cadastrado para outra pessoa" });
  }

  // Verificar se email já existe em outra pessoa
  const emailExists = pessoas.some((p) => p.email === email && p.id !== id);
  if (emailExists) {
    return res.status(400).json({ error: "Email já cadastrado para outra pessoa" });
  }

  pessoas[pessoaIndex] = {
    id,
    nome,
    idade: parseInt(idade),
    cpf,
    email,
    sexo,
  };

  res.json(pessoas[pessoaIndex]);
});

/**
 * @swagger
 * /api/pessoas/{id}:
 *   delete:
 *     summary: Deleta uma pessoa
 *     tags: [Pessoas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da pessoa
 *     responses:
 *       200:
 *         description: Pessoa deletada com sucesso
 *       404:
 *         description: Pessoa não encontrada
 */
app.delete("/api/pessoas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pessoaIndex = pessoas.findIndex((p) => p.id === id);

  if (pessoaIndex === -1) {
    return res.status(404).json({ error: "Pessoa não encontrada" });
  }

  pessoas.splice(pessoaIndex, 1);
  res.json({ message: "Pessoa deletada com sucesso" });
});

app.listen(port, () => {
  console.log(`Servidor CRUD de Pessoas rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
});

