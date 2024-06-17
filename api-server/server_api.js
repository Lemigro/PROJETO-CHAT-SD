const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware CORS para tratar o erro de servidor
app.use(cors());

// Rota para obter uma imagem de gato
app.get("/api/cat", async (req, res) => {
  try {
    const response = await axios.get(
      "https://a25f59e9-b862-478e-8f08-376912e10913-00-382p5a52w8ozj.spock.replit.dev/gato"
    );
    const imageUrl = response.data;
    res.json( response.data );
  } catch (error) {
    res.status(500).json({ error: "Falha ao receber a imagem do Gato" });
  }
});

// Rota para obter informações do clima
app.get("/api/weather/:city", async (req, res) => {
  const city = req.params.city;
  console.log(city);
  try {
    const response = await axios.get(
      `https://a25f59e9-b862-478e-8f08-376912e10913-00-382p5a52w8ozj.spock.replit.dev/clima/${city}`
    ); 

    res.json(response.data);
    
  } catch (error) {
    res.status(500).json({ error: "Falha ao receber as informações do clima" });
  }
});

// Rota para obter um conselho aleatório
app.get("/api/advice", async (req, res) => {
  try {
    const response = await axios.get(
      "https://a25f59e9-b862-478e-8f08-376912e10913-00-382p5a52w8ozj.spock.replit.dev/conselho"
    );
    const advice = response.data.advice;
    res.send(advice);
  } catch (error) {
    res.status(500).json({ error: "Falha ao receber o conselho" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});
