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
    fetch("http://localhost:3000/api/weather")
      .then((response) => response.json())
      .then((data) => {
        const temp_min = data.main.temp_min;
        const humidity = data.main.humidity;
        const city = data.name;
        const message = createMessageSelfElement(`Cidade: ${city}, Temperatura minima: ${temp_min} °C,
          Umidade: ${humidity}`);
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
      .then((response) => response.json())
      .then((data) => {
        const advice = data.advice;
        const message = createMessageSelfElement(`Conselho: ${advice}`);
        chatMessage.appendChild(message);
        scrollScreen();
      })
      .catch((error) => console.error("Error fetching advice:", error));
    return;
  }

  const message =
    userId == user.id
      ? createMessageSelfElement(content)
      : createMessageOtherElement(content, userName, userColor);

  chatMessage.appendChild(message);

  scrollScreen();

  console.log(JSON.parse(data));
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

  console.log(`Usuário: ${user.name} entrou no chat`)
  //   websocket.onopen = () =>
  //     websocket.send(`Usuário: ${user.name} entrou no chat`);
};

const isMessageValid = (message) => {
  return message.trim().length > 0;
};

const sendMessage = (event) => {
  event.preventDefault();

  const messageContent = chatInput.value;

  if (messageContent.startsWith("traduzir")) {
    const [, text, targetLang] = messageContent.split(" ");
    fetch("http://localhost:3000/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, targetLang }),
    })
      .then((response) => response.json())
      .then((data) => {
        const translation = data.translation;
        const message = createMessageSelfElement(`Tradução: ${translation}`);
        chatMessage.appendChild(message);
        scrollScreen();
      })
      .catch((error) => console.error("Error ao traduzir o texto:", error));
    chatInput.value = "";
    return;
  }

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
