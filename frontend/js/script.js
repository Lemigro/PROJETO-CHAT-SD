// LOGIN
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login_form");
const loginInput = login.querySelector(".login_input");

// CHAT
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat_form");
const chatInput = chat.querySelector(".chat_input");
const chatMessage = chat.querySelector(".chat_messages");

const userName = "";

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "darkseagreen",
  "cornflowerblue",
  "darkslateblue",
  "darkkhaki",
  "deeppink",
  "hotpink",
  "gold",
  "green",
  "blue",
];

const user = { id: "", name: "", color: "" };
let websocket;

const createMessageSelfElement = (content) => {
  const div = document.createElement("div");

  div.classList.add("message_self");
  div.innerHTML = content;

  return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message_other");
  span.classList.add("message_sender");
  span.style.color = senderColor;

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;

  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

// função para rolar a pagina a cada nova mensagem enviada
const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

// Função para tocar som de animal
const playAnimalSound = (animal) => {
  const soundMap = {
    'cachorro': 'dogSound',
    'dog': 'dogSound',
    'au au': 'dogSound',
    'auau': 'dogSound',
    'gato': 'catSound',
    'cat': 'catSound',
    'miau': 'catSound',
    'meow': 'catSound',
    'vaca': 'cowSound',
    'cow': 'cowSound',
    'mu': 'cowSound',
    'moo': 'cowSound'
  };

  const soundId = soundMap[animal.toLowerCase()];
  if (soundId) {
    const audioElement = document.getElementById(soundId);
    if (audioElement) {
      audioElement.play().catch(error => {
        console.error(`Erro ao tocar som de ${animal}:`, error);
      });
    }
  }
};

// Função para verificar se a mensagem contém nome ou som de animal
const checkAnimalSound = (content) => {
  const animals = ['cachorro', 'dog', 'au au', 'auau', 'gato', 'cat', 'miau', 'meow', 'vaca', 'cow', 'mu', 'moo'];
  const lowerContent = content.toLowerCase();
  
  for (const animal of animals) {
    if (lowerContent.includes(animal)) {
      playAnimalSound(animal);
      return true;
    }
  }
  return false;
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

  // Verificar e tocar som de animal
  checkAnimalSound(content);

  if (content.startsWith("/clima")) {
    const city = content.split(" ").slice(1).join(" ");
    console.log("entrei na rota do clima no frontend")
    fetch("http://localhost:3000/api/weather/" + city)
      .then((response) => response.json())
      .then((data) => {
        const message =
          createMessageSelfElement(`Cidade: ${data.city}, Temperatura mínima: ${data.temp_min}, Temperatura máxima: ${data.temp_max}, Umidade: ${data.humidity}`);
        chatMessage.appendChild(message);
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching weather:", error));
    return;
  }

  if (content.startsWith("/imagem gato")) {
    fetch("http://localhost:3000/api/cat")
      .then((response) => response.json())
      .then((data) => {
        const imageUrl = data.imageUrl;
        const message = createMessageSelfElement(
          `<img src="${imageUrl}" alt="Gato">`
        );
        chatMessage.appendChild(message);
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching cat image:", error));
    return;
  }

  if (content.startsWith("/conselho")) {
    fetch("http://localhost:3000/api/advice")
      .then((response) => response.text())
      .then((data) => {
        const message = createMessageSelfElement(`Conselho: ${data}`);
        chatMessage.appendChild(message);
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching advice:", error));
    return;
  }

  if (content.startsWith("/cep")) {
    const cep = content.split(" ")[1];
    console.log("CEP SCRIPT",cep)
    fetch(`http://localhost:3000/api/cep/${cep}`)
      .then((response) => response.json())
      .then((data) => {
        const message = createMessageSelfElement(`CONSULTA VIA NÚMERO DO CEP -  CEP: ${cep}, 
          Logradouro: ${data.logradouro}, 
          Bairro: ${data.bairro}, 
          Cidade: ${data.localidade}, 
          Estado: ${data.uf}`);
        chatMessage.appendChild(message);
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching CEP:", error));
    return;
  }

  if (content.startsWith("/endereco")) {
    const parts = content.split(" ");
    const uf = parts[1];
    const cidade = parts[2];
    const rua = parts.slice(3).join(" ");
    fetch(`http://localhost:3000/api/cep/${uf}/${cidade}/${rua}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const message = createMessageSelfElement(`CONSULTA VIA ENDEREÇO - CEP: ${data[0].cep}, Logradouro: ${data[0].logradouro}, Bairro: ${data[0].bairro}, Cidade: ${data[0].localidade}, Estado: ${data[0].uf}`);
          chatMessage.appendChild(message);
        } else {
          const message = createMessageSelfElement(`Endereço não encontrado.`);
          chatMessage.appendChild(message);
        }
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching address:", error));
    return;
  }

  // CRUD de Pessoas
  if (content.startsWith("/pessoas")) {
    fetch("http://localhost:3001/api/pessoas")
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          const message = createMessageSelfElement("Nenhuma pessoa cadastrada.");
          chatMessage.appendChild(message);
        } else {
          const pessoasList = data.map(p => 
            `ID: ${p.id}, Nome: ${p.nome}, Idade: ${p.idade}, CPF: ${p.cpf}, Email: ${p.email}, Sexo: ${p.sexo}`
          ).join("<br>");
          const message = createMessageSelfElement(`<strong>Lista de Pessoas:</strong><br>${pessoasList}`);
          chatMessage.appendChild(message);
        }
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching pessoas:", error));
    return;
  }

  if (content.startsWith("/pessoa criar")) {
    const parts = content.split("|");
    if (parts.length < 6) {
      const message = createMessageSelfElement("Formato: /pessoa criar |Nome|Idade|CPF|Email|Sexo<br>Exemplo: /pessoa criar |João Silva|25|12345678900|joao@email.com|M");
      chatMessage.appendChild(message);
      scrollScreen();
      return;
    }
    const [, nome, idade, cpf, email, sexo] = parts;
    fetch("http://localhost:3001/api/pessoas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nome.trim(), idade: parseInt(idade.trim()), cpf: cpf.trim(), email: email.trim(), sexo: sexo.trim() })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          const message = createMessageSelfElement(`Erro: ${data.error}`);
          chatMessage.appendChild(message);
        } else {
          const message = createMessageSelfElement(`Pessoa criada com sucesso!<br>ID: ${data.id}, Nome: ${data.nome}, Idade: ${data.idade}, CPF: ${data.cpf}, Email: ${data.email}, Sexo: ${data.sexo}`);
          chatMessage.appendChild(message);
        }
        scrollScreen();
      })
      .catch((error) => console.error("Error creating pessoa:", error));
    return;
  }

  if (content.startsWith("/pessoa buscar")) {
    const id = content.split(" ")[2];
    if (!id) {
      const message = createMessageSelfElement("Formato: /pessoa buscar {id}<br>Exemplo: /pessoa buscar 1");
      chatMessage.appendChild(message);
      scrollScreen();
      return;
    }
    fetch(`http://localhost:3001/api/pessoas/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          const message = createMessageSelfElement(`Erro: ${data.error}`);
          chatMessage.appendChild(message);
        } else {
          const message = createMessageSelfElement(`Pessoa encontrada:<br>ID: ${data.id}, Nome: ${data.nome}, Idade: ${data.idade}, CPF: ${data.cpf}, Email: ${data.email}, Sexo: ${data.sexo}`);
          chatMessage.appendChild(message);
        }
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching pessoa:", error));
    return;
  }

  if (content.startsWith("/pessoa deletar")) {
    const id = content.split(" ")[2];
    if (!id) {
      const message = createMessageSelfElement("Formato: /pessoa deletar {id}<br>Exemplo: /pessoa deletar 1");
      chatMessage.appendChild(message);
      scrollScreen();
      return;
    }
    fetch(`http://localhost:3001/api/pessoas/${id}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          const message = createMessageSelfElement(`Erro: ${data.error}`);
          chatMessage.appendChild(message);
        } else {
          const message = createMessageSelfElement(`Pessoa deletada com sucesso!`);
          chatMessage.appendChild(message);
        }
        scrollScreen();
      })
      .catch((error) => console.error("Error deleting pessoa:", error));
    return;
  }

  // Gemini - Chat Completion
  if (content.startsWith("/gemini") || content.startsWith("/chatgpt") || content.startsWith("/chat")) {
    const messageText = content.replace(/^\/gemini\s+|\/chatgpt\s+|\/chat\s+/, "");
    if (!messageText) {
      const message = createMessageSelfElement("Formato: /gemini {sua mensagem} ou /chat {sua mensagem}<br>Exemplo: /gemini O que é JavaScript?");
      chatMessage.appendChild(message);
      scrollScreen();
      return;
    }
    fetch("http://localhost:3000/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageText })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          const message = createMessageSelfElement(`Erro: ${data.error}`);
          chatMessage.appendChild(message);
        } else {
          const message = createMessageSelfElement(`<strong>Gemini:</strong> ${data.response}`);
          chatMessage.appendChild(message);
        }
        scrollScreen();
      })
      .catch((error) => {
        console.error("Error calling Gemini chat:", error);
        const message = createMessageSelfElement("Erro ao conectar com Gemini. Verifique se a API key está configurada.");
        chatMessage.appendChild(message);
        scrollScreen();
      });
    return;
  }

  // Gemini - Geração de Imagem (nota: requer configuração adicional)
  if (content.startsWith("/gere uma imagem") || content.startsWith("/gerar imagem") || content.startsWith("/imagem")) {
    let prompt = "";
    if (content.startsWith("/gere uma imagem")) {
      prompt = content.replace("/gere uma imagem de", "").replace("/gere uma imagem", "").trim();
    } else if (content.startsWith("/gerar imagem")) {
      prompt = content.replace("/gerar imagem de", "").replace("/gerar imagem", "").trim();
    } else if (content.startsWith("/imagem")) {
      prompt = content.replace("/imagem", "").trim();
    }
    
    if (!prompt) {
      const message = createMessageSelfElement("Formato: /gere uma imagem de {descrição}<br>Exemplo: /gere uma imagem de um gato astronauta");
      chatMessage.appendChild(message);
      scrollScreen();
      return;
    }
    
    fetch("http://localhost:3000/api/openai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          const message = createMessageSelfElement(`Erro: ${data.error}`);
          chatMessage.appendChild(message);
        } else {
          const message = createMessageSelfElement(`<img src="${data.imageUrl}" alt="${prompt}" style="max-width: 100%; border-radius: 8px;">`);
          chatMessage.appendChild(message);
        }
        scrollScreen();
      })
      .catch((error) => {
        console.error("Error generating image:", error);
        const message = createMessageSelfElement("Erro ao gerar imagem. Verifique se a API key está configurada.");
        chatMessage.appendChild(message);
        scrollScreen();
      });
    return;
  }

  const message =
    userId == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessage.appendChild(message);

  scrollScreen();
};

const handleLogin = (event) => {
  event.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("wss://projeto-chat-sd-backend.onrender.com");

  websocket.onmessage = processMessage;
  console.log(`Usuário: ${user.name} entrou no chat`);
};

const isMessageValid = (message) => {
  return message.trim().length > 0;
};

const sendMessage = (event) => {
  // console.log("ENTREI NA MENSAGEM")
  event.preventDefault();

  const messageContent = chatInput.value;

  if (!isMessageValid(messageContent)) {
    chatInput.classList.add("invalid_input"); // Adiciona a classe de estilo
    setTimeout(() => {
      chatInput.classList.remove("invalid_input"); // Remove a classe após 3 segundos
    }, 3000);
    return; // Não envia a mensagem se ela for inválida
  }

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: messageContent,
  };  

  websocket.send(JSON.stringify(message));

  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
