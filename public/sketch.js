let playerSize = 50;
let button;
let playMode;
let counter = 10;
let gameInterval;

// le jeu change de mode
// data c'est la donnée qu'on reçoit, c'est l'état du jeu
socket.on("update game", data => {
  playMode = data[0];
  conter = data[1];

  if (playMode) {
    button.hide();
  } else {
    button.show();
  }
});


function setup() {
  cv = createCanvas(500, 500);
  cv.mousePressed()
  centerCanvas();
  noStroke();
  textSize(playerSize);
  textAlign(CENTER, CENTER);

  button = createButton("Start the game!");
  button.position(windowWidth/2 - button.width/2, windowHeight/2 - button.height/2);
  button.mousePressed(startTheGame);
}

function draw() {
  background(50);


  players.forEach((player) => {
    if (currentPlayer.id == player.id) player.move();
    player.collide();
    player.draw();

  });
  //dire à tout le monde ma nouvelle position
  socket.emit("update player", currentPlayer);

  //est ce que tout le monde est infecté
  // si oui je repasse en mode attente, Sinon, le jeu continue
  if (playMode) {
    //on va faire le test pour toutes les varivales
    let allInfected = players.every(player => {
      return (player.infected == true);
    });

    if (allInfected) {
      playMode = false;
      button.show();
      socket.emit("update game",[playMode, conter]);
      // on dit à tout le monde ah le jeu est fini

text(Counter,50,20);
    }
  }
}


function resetTheGame() {
clearInterval(gameInterval);
  counter = 10;
  playMode = false;
  button.show();
  socket.emit("update game", [playMode, conter]);
}



function startTheGame() {
  console.log("ready!!");
  playMode = true;
  button.hide();
  socket.emit("update game", [playMode, conter]);

  players.forEach((player) => {
    player.infected = false;
    socket.emit("update player", player);
  })
  let randomPlayer = random(players);
  randomPlayer.infected = true;
  socket.emit("update player", randomPlayer);

  gameInterval = setInterval(updateInterval, 1000);
}
function updateInterval(){
  counter -- ;
  console.log(counter);
  if(counter==0){
    clearInterval(gameInterval);
  }
}

function mouseMoved() {
  players.forEach((player) => {
    if (currentPlayer.id == player.id) player.move();


  });

}

// function mousePressed() {
////  console.log("You are:" + currentPlayer.id);

//  currentPlayer.infected = true;}
