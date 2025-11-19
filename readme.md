# Projeto Chat - SD

## 🚀 Como Subir o Projeto

### ⚡ Início Rápido

```bash
# 1. Instalar dependências
npm install
npm run install:all

# 2. Configurar Gemini (opcional, mas necessário para funcionalidades de IA)
# Crie um arquivo .env na pasta api-server/ com:
# GEMINI_API_KEY=sua-chave-aqui

# 3. Subir todos os servidores (backend, API server e CRUD)
npm run start:all

# 4. Em outro terminal, servir o frontend
cd frontend
python -m http.server 8000
# ou
npx http-server -p 8000

# 5. Acessar http://localhost:8000 no navegador
```

**⚠️ Importante:** 
- Para desenvolvimento local, altere a linha 176 de `frontend/js/script.js` para usar `ws://localhost:8080` ao invés do servidor em produção.
- Para usar as funcionalidades do Gemini, configure a API key no arquivo `.env` da pasta `api-server/`.
- As APIs públicas (gato, conselho, CEP) funcionam sem configuração adicional.
- A API de clima funciona sem chave (dados de demonstração), mas para dados reais configure `OPENWEATHER_API_KEY` no `.env`.

---

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- NPM ou Yarn

### Passo a Passo

#### 1. Instalar Dependências

**Opção A: Instalar tudo de uma vez (Recomendado)**

Na raiz do projeto, execute:
```bash
npm install
npm run install:all
```

**Opção B: Instalar manualmente**

Instale as dependências de cada parte do projeto:

```bash
# Instalar dependências do Backend (WebSocket)
cd backend
npm install

# Instalar dependências do API Server
cd ../api-server
npm install
```

#### 2. Subir os Servidores

**Opção A: Subir tudo de uma vez (Recomendado)**

Na raiz do projeto, execute:
```bash
npm run start:all
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev:all
```

**Opção B: Subir separadamente**

**Backend (WebSocket Server):**
O backend é o servidor WebSocket que gerencia as mensagens do chat em tempo real.

```bash
cd backend
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

O servidor WebSocket estará rodando na porta **8080** (ou na porta definida pela variável de ambiente `PORT`).

**API Server (Express):**
O API Server fornece as rotas para as APIs externas (gato, clima, conselho, CEP).

```bash
cd api-server
npm start
```

O servidor estará rodando em **http://localhost:3000**

#### 3. Servir o Frontend

Você tem duas opções para servir o frontend:

**Opção 1: Usar um servidor HTTP simples (Recomendado)**

Com Python:
```bash
cd frontend
python -m http.server 8000
```

Ou com Node.js (usando http-server):
```bash
# Instalar globalmente (se ainda não tiver)
npm install -g http-server

# Servir o frontend
cd frontend
http-server -p 8000
```

**Opção 2: Abrir diretamente no navegador**

Simplesmente abra o arquivo `frontend/index.html` no navegador. **Nota:** Se usar esta opção, você precisará ajustar o script.js para usar `ws://localhost:8080` ao invés do servidor em produção.

#### 4. Acessar a Aplicação

Abra seu navegador e acesse:
- **Frontend:** http://localhost:8000 (ou o caminho do arquivo HTML)
- **API Server:** http://localhost:3000
- **Backend WebSocket:** ws://localhost:8080

### ⚠️ Nota Importante

O frontend está configurado para se conectar ao WebSocket em produção (`wss://projeto-chat-sd-backend.onrender.com`). Para desenvolvimento local, você precisará alterar a linha 176 do arquivo `frontend/js/script.js`:

```javascript
// De:
websocket = new WebSocket("wss://projeto-chat-sd-backend.onrender.com");

// Para:
websocket = new WebSocket("ws://localhost:8080");
```

### 📋 Resumo dos Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Backend (WebSocket) | 8080 | Servidor de chat em tempo real |
| API Server | 3000 | Servidor de APIs (gato, clima, conselho, CEP, Gemini) |
| CRUD Pessoas | 3001 | API CRUD de pessoas com Swagger |
| Frontend | 8000 | Interface do usuário |

---

## ENTREGAS DO CHAT SEMANA 1
<!-- 1 - Implementar uma tela de login para salvar o nome do usuário para poder identificar no chat - OK
2 - Desenvolver o LAYOUT da tela login e da tela do chat com CSS pode usar Bootstrap, Materialize e etc.. OK
3 - Tratar as mensagens de usuários para ficarem dos lados certo, ou seja, do usuário em questão do lado esquerdo e de quem enviou do lado direito OK
4 - Enviar a mensagem ao apertar enter OK
5 - Não enviar mensagem se o campo estiver vazio OK -->
____________________________________________________________________________________________
## ENTREGAS DO CHAT SEMANA 2
<!-- 1 - Ajuste para que quando tiver muitas mensagens o chat fazer o scroll das mensagens para baixo, ou seja, rola a tela para o fim OK -->
<!-- 2 - Implemente a execução de 3 sons (pode ser de animais) para quando digitar a chamada (nome do animal ou som) na tela do chat o som em questão ser executado. OK -->
<!-- 3 - Adicione 3 das APIs públicas listadas abaixo. Exemplo, quando eu digitar imagem gato, ele me envia uma imagem de um gato, mas tem outras inúmeras APIs. Essas APIs devem ser integradas em uma aplicação EXCLUSIVA para servir rotas para as três APIS que estarão implementas nessa nova aplicação. Podem usar o expressjs. OK -->
<!-- 4 - Adicione o web service do VIA para consultar cep pelo número e pela rua. Você deve criar uma aplicação que irá mascarar essas chamadas numa nova aplicação. Podem usar o expressjs. OK -->
<!-- 5 - Implemente um CRUD para pessoas com a documentação do Swagger com os seguintes campos: Nome, Idade, CPF, Email e Sexo. Essa aplicação deve está em uma novo projeto para ser chamado no chat como uma API. OK -->
____________________________________________________________________________________________

## ENTREGAS DO CHAT SEMANA 3 - FINAL
<!-- 1 - Integre o chat com a API de chat do Google Gemini. Para isso você precisa obter uma chave de API gratuita no Google AI Studio. Use o link abaixo para acessar as referências de uso. OK -->
<!-- 2 -  Use o recurso (endpoint) de geração de imagem.  Exemplo, ao digitar no chat "gere uma imagem de gato" (esse prompt irá gerar uma imagem e retornar para você uma URL para ser adicionada em um src de um img). Use o link abaixo para acessar as referência de uso. OK -->
<!-- 3 -  Use o de completion para criar o chat conversacional com Gemini. Use os links abaixo para acessar as referência de uso. OK -->

---

## 📝 Funcionalidades Implementadas

### Sons de Animais
Ao digitar no chat palavras como "cachorro", "dog", "au au", "gato", "cat", "miau", "vaca", "cow", "mu", etc., o som correspondente será reproduzido automaticamente.

### CRUD de Pessoas
Sistema completo de CRUD com documentação Swagger disponível em `http://localhost:3001/api-docs`.

**Comandos no chat:**
- `/pessoas` - Lista todas as pessoas
- `/pessoa criar |Nome|Idade|CPF|Email|Sexo` - Cria uma nova pessoa
- `/pessoa buscar {id}` - Busca uma pessoa por ID
- `/pessoa deletar {id}` - Deleta uma pessoa

**Exemplo:**
```
/pessoa criar |João Silva|25|12345678900|joao@email.com|M
```

### Integração Gemini

**Configuração:**
1. Crie um arquivo `.env` na pasta `api-server/`
2. Adicione suas chaves (opcionais):
   ```
   GEMINI_API_KEY=sua-chave-aqui
   OPENWEATHER_API_KEY=sua-chave-openweather
   ```
3. Obtenha as chaves:
   - Gemini: https://aistudio.google.com/app/apikey (gratuita)
   - OpenWeatherMap (opcional, para clima real): https://openweathermap.org/api

**Nota:** A API de clima funciona sem chave (retorna dados de demonstração), mas para dados reais você precisa de uma chave gratuita do OpenWeatherMap.

**Comandos no chat:**
- `/gemini {sua mensagem}` ou `/chat {sua mensagem}` - Conversa com Gemini
- `/gere uma imagem de {descrição}` - Gera uma imagem (nota: geração de imagem requer configuração adicional)

**Exemplos:**
```
/gemini O que é JavaScript?
/chat Explique como funciona a inteligência artificial
```

---

## 📋 Resumo dos Serviços Atualizado

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Backend (WebSocket) | 8080 | Servidor de chat em tempo real |
| API Server | 3000 | Servidor de APIs distribuídas (gato, clima, conselho, CEP, Gemini) |
| CRUD Pessoas | 3001 | API CRUD de pessoas com Swagger |
| Frontend | 8000 | Interface do usuário |

## 🌐 APIs Externas Utilizadas

O projeto utiliza o conceito de **sistemas distribuídos**, onde o `api-server` atua como um gateway/proxy para várias APIs públicas:

- **The Cat API** - Imagens aleatórias de gatos (https://thecatapi.com)
- **Advice Slip API** - Conselhos aleatórios (https://api.adviceslip.com)
- **ViaCEP** - Consulta de CEP brasileiro (https://viacep.com.br)
- **OpenWeatherMap** - Dados de clima (opcional, requer chave API)
- **Google Gemini** - Chat conversacional com IA (requer chave API gratuita)