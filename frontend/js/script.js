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

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

  if (content.startsWith("/clima")) {
    city = content.split(" ").slice(1).join(" ");
    console.log("entrei na rota do clima no frontend")
    fetch("http://localhost:3000/api/weather/" + city)
      .then((response) => response.json())
      .then((data) => {
        const message =
          createMessageSelfElement(`Cidade: ${data.city}, Temperatura minima: ${data.temp_min}°C,
          Umidade: ${data.humidity}%`);
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
        const message = createMessageSelfElement(`CEP: ${cep}, 
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
          const message = createMessageSelfElement(`CEP: ${data[0].cep}, Logradouro: ${data[0].logradouro}, Bairro: ${data[0].bairro}, Cidade: ${data[0].localidade}, Estado: ${data[0].uf}`);
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

  const message =
    userId == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessage.appendChild(message);

  scrollScreen();

  // console.log(JSON.parse(data));
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

  // console.log('websocket sended message');
  chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
