const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const { translate } = require("@vitalets/google-translate-api");

// Carregar variáveis de ambiente do .env na pasta api-server ou backend
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
// Se não encontrar, tenta no backend
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.join(__dirname, '../backend/.env') });
}

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Gemini
// A chave de API é obtida automaticamente da variável de ambiente GEMINI_API_KEY
const ai = new GoogleGenAI({});

// Rota para obter uma imagem de gato (usando The Cat API)
app.get("/api/cat", async (req, res) => {
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search");
    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error("Erro ao buscar imagem de gato:", error);
    res.status(500).json({ error: "Falha ao receber a imagem do Gato" });
  }
});

// Rota para obter informações do clima (usando OpenWeatherMap API)
// Nota: Para usar esta API, você precisa de uma chave gratuita em https://openweathermap.org/api
app.get("/api/weather/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY || "demo";
  
  try {
    // Se não tiver chave configurada, retorna dados mockados para demonstração
    if (apiKey === "demo" || !process.env.OPENWEATHER_API_KEY) {
      return res.json({
        city: city,
        temp_min: Math.floor(Math.random() * 10 + 15) + "°C",
        temp_max: Math.floor(Math.random() * 10 + 25) + "°C",
        humidity: Math.floor(Math.random() * 40 + 50) + "%",
        description: "Ensolarado"
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    res.json({
      city: response.data.name,
      temp_min: response.data.main.temp_min + "°C",
      temp_max: response.data.main.temp_max + "°C",
      humidity: response.data.main.humidity + "%",
      description: response.data.weather[0].description
    });
    
  } catch (error) {
    console.error("Erro ao buscar clima:", error);
    res.status(500).json({ error: "Falha ao receber as informações do clima" });
  }
});

// Rota para obter um conselho aleatório (usando Advice Slip API) - traduzido para português
app.get("/api/advice", async (req, res) => {
  try {
    const response = await axios.get("https://api.adviceslip.com/advice");
    const adviceEnglish = response.data.slip.advice;
    
    // Traduzir para português brasileiro
    try {
      const translated = await translate(adviceEnglish, { to: "pt" });
      const advicePortuguese = translated.text;
      res.send(advicePortuguese);
    } catch (translateError) {
      console.error("Erro na tradução, retornando em inglês:", translateError);
      // Em caso de erro na tradução, retorna o conselho em inglês
      res.send(adviceEnglish);
    }
  } catch (error) {
    console.error("Erro ao buscar conselho:", error);
    res.status(500).json({ error: "Falha ao receber o conselho" });
  }
});

// Rota para consultar o CEP pelo número (usando ViaCEP API)
app.get("/api/cep/:cep", async (req, res) => {
  const { cep } = req.params;
  // Remove caracteres não numéricos
  const cleanCep = cep.replace(/\D/g, "");
  
  try {
    if (cleanCep.length !== 8) {
      return res.status(400).json({ error: "CEP deve conter 8 dígitos" });
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (response.data.erro) {
      return res.status(404).json({ error: "CEP não encontrado" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Erro ao consultar CEP:", error);
    res.status(500).json({ error: "Falha ao consultar o CEP" });
  }
});

// Rota para consultar o CEP pela rua e cidade (usando ViaCEP API)
app.get("/api/cep/:uf/:cidade/:rua", async (req, res) => {
  const { uf, cidade, rua } = req.params;
  
  try {
    // ViaCEP requer que a busca seja feita por UF, cidade e logradouro
    const logradouro = decodeURIComponent(rua);
    const cidadeEncoded = decodeURIComponent(cidade);
    const ufUpper = uf.toUpperCase();

    const response = await axios.get(
      `https://viacep.com.br/ws/${ufUpper}/${cidadeEncoded}/${logradouro}/json/`
    );

    if (response.data.length === 0 || response.data[0].erro) {
      return res.status(404).json({ error: "Endereço não encontrado" });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Erro ao consultar CEP por endereço:", error);
    res.status(500).json({ error: "Falha ao consultar o CEP" });
  }
});

// Rota para chat completion (Gemini)
app.post("/api/openai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY não configurada. Configure no arquivo .env" });
    }

    // Adiciona contexto de data atual para o Gemini
    const currentDate = new Date();
    const dateContext = `Data e hora atual: ${currentDate.toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}. Sempre use esta data quando perguntarem sobre data, dia da semana ou hora atual.`;
    
    // Prepara a mensagem com contexto
    const messageWithContext = `${dateContext}\n\nPergunta do usuário: ${message}`;

    // Tenta primeiro com gemini-2.5-flash, se falhar tenta gemini-1.5-flash
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messageWithContext,
      });
    } catch (firstError) {
      // Se o modelo 2.5 estiver sobrecarregado, tenta o 1.5
      if (firstError.status === 503 || firstError.message?.includes("overloaded")) {
        console.log("Modelo gemini-2.5-flash sobrecarregado, tentando gemini-1.5-flash...");
        response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: messageWithContext,
        });
      } else {
        throw firstError;
      }
    }

    res.json({ response: response.text });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    
    let errorMessage = "Falha ao processar a mensagem com Gemini";
    if (error.status === 503 || error.message?.includes("overloaded")) {
      errorMessage = "O modelo Gemini está temporariamente sobrecarregado. Tente novamente em alguns instantes.";
    } else if (error.status === 401) {
      errorMessage = "Chave de API inválida. Verifique sua GEMINI_API_KEY no arquivo .env";
    } else if (error.message) {
      errorMessage = `Erro: ${error.message}`;
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// Rota para geração de imagem (Gemini - usando Imagen 3)
app.post("/api/openai/image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt é obrigatório" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY não configurada. Configure no arquivo .env" });
    }

    // Gemini não tem geração de imagem direta, mas podemos usar o modelo para descrever
    // ou retornar uma mensagem informando que precisa usar outro serviço
    // Alternativamente, podemos usar a API do Imagen do Google Cloud
    // Por enquanto, vamos retornar um erro informativo
    res.status(501).json({ 
      error: "Geração de imagem não está disponível com Gemini. Use outro serviço ou configure o Imagen API do Google Cloud." 
    });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    res.status(500).json({ error: "Falha ao gerar imagem com Gemini" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
  if (!process.env.GEMINI_API_KEY) {
    console.log("⚠️  AVISO: GEMINI_API_KEY não configurada. Configure no arquivo .env para usar as funcionalidades do Gemini.");
  }
});
