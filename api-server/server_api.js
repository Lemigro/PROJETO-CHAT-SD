const express = require('express');
const axios = require('axios');
const translate = require('@vitalets/google-translate-api');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware CORS para tratar o erro de servidor
app.use(cors());

// Rota para obter uma imagem de gato
app.get('/api/cat', async (req, res) => {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search');
    const imageUrl = response.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao receber a imagem do Gato' });
  }
});

// Rota para obter informações do clima
app.get('/api/weather', async (req, res) => {
  const city = req.query.city
  const apiKey = '0bcf04aa5030f64a15cba6ad627006ea'; // Substitua com sua chave da API
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    console.log(city)
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao receber as informações do clima' });
  }
});

// Rota para obter um conselho aleatório
app.get('/api/advice', async (req, res) => {
  try {
    const response = await axios.get('https://api.adviceslip.com/advice');
    const advice = response.data.slip.advice;
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao receber o conselho' });
  }
});

// Rota para traduzir um texto
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const translation = await translate(text, { to: targetLang });
    res.json({ translation: translation.text });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao traduzir o texto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});
