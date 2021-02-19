const socket = io.connect("http://10.192.248.100:3000");

let players = [];

//heartbeat est une sorte de message qui va chequer si y'a des nouveaux joueurs
socket.on("heartbeat", players => updatePlayers(players));
socket.on("disconnect", playerId => removePlayer(playerId));

let currentPlayer = null;



// Callback function
socket.on("update player", data => {
  if (data) {
    let player = findPlayerById(data.id);

    if (player) {
      for (const [key, value] of Object.entries(data)) {
        player[key] = value;
      }
    }
  }
});

function updatePlayers(serverPlayers) {
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];

    if (!playerExists(playerFromServer)) {
      let player = new Player(playerFromServer);

      if (currentPlayer === null) {
        if (i == serverPlayers.length - 1) {
          currentPlayer = player;
          console.log("you are connected as : " + currentPlayer.id);
        }
      }

      players.push(player);
    }
  }
}

function playerExists(playerFromServer) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === playerFromServer.id) {
      return true;
    }
  }
  return false;
}

function findPlayerById(id) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return false;
}

function removePlayer(playerId) {
  players = players.filter(player => player.id !== playerId);
}

function windowResized() {
  centerCanvas();
}

function centerCanvas() {
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  cv.position(x, y);
}
