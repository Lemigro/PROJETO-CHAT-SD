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

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
};

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data);

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

  //   websocket.onopen = () =>
  //     websocket.send(`Usuário: ${user.name} entrou no chat`);
};

const isMessageValid = (message) => {
  return message.trim().length > 0;
};

const sendMessage = (event) => {
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