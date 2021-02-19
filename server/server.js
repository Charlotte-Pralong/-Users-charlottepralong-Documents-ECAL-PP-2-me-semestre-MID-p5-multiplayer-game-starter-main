const express = require("express");
const socket = require("socket.io");
const app = express();
let Player = require("./Player");

let server = app.listen(3000);
console.log("The server is now running");

app.use(express.static("public"));

let io = socket(server);

let players = [];

setInterval(updateGame, 16);

io.sockets.on("connection", socket => {
  console.log(`New connection ${socket.id}`);
  players.push(new Player(socket.id));

  socket.on("update player", data =>
    socket.broadcast.emit("update player", data)
  );

  socket.on("update game", data => socket.broadcast.emit("update game", data));

  socket.on("disconnect", () => {
    io.sockets.emit("disconnect", socket.id);
    players = players.filter(player => player.id !== socket.id);
  });
});

io.sockets.on("disconnect", socket => {
  io.sockets.emit("disconnect", socket.id);
  players = players.filter(player => player.id !== socket.id);
});

function updateGame() {
  io.sockets.emit("heartbeat", players);
}
