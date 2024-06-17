const {WebSocketServer} = require("ws");
// const dotenv = require("dotenv");

// dotenv.config();

const port = process.env.PORT || 8080;

const wss = new WebSocketServer({port: port});
// console.log(port, " porta");

wss.on("connection", (ws) => {
    ws.on("error", console.error);

    ws.on("message", (data) =>{
        wss.clients.forEach((client) => client.send(data.toString()))
    })

    console.log("Client connected");
})