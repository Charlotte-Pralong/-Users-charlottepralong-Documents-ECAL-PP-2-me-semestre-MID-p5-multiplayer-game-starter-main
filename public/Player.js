let avatars = ["🕵", "🙄", "🙍", "👺", "🤰", "🦑"];


// c'est ici qu'on va ajouter des choses car c'est ici que processing change et met à jour tous les joueurs

class Player {
  constructor(player) {
    this.id = player.id;

    this.x = random(width);
    this.y = random(height);

    this.infected = false;
    this.avatar = random(avatars);

  }


  collide() {
    players.forEach((player) => {
      if (this.id != player.id) {
        //merci pythagore
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDistance = playerSize;

        if (distance < minDistance && this.infected &&
          !player.infected) {
          //Si je suis infectée alors j'infecte l'autre que je touche
          //&& vrai ! faux
          //if (this.infected = true && !player.infected) {
          console.log("player:" + this.id + "touched:" +
            player.id);

          player.infected = true;

          //dire à tout le monde l'autre est infecté
          socket.emit("update player", player);
        }
      }
    });

  }

  move() {
    //    this.x = mouseX;
    //  this.y = mouseY;

    this.x = lerp(this.x, mouseX, 0.05);
    this.y = lerp(this.y, mouseY, 0.05);

    this.x = constrain(this.x, playerSize / 2, width - playerSize / 2);
    this.y = constrain(this.y, playerSize / 2, height - playerSize / 2);
    //limiter/contraindre x à une valeur pour pas que le joueur sorte de la zone de jeu

  }


  draw() {
    push();
    translate(this.x, this.y);
    let avatar = this.avatar;

    if(!playMode){
      avatar ="😴"
    }
    else if (this.infected || (this.infected && this.id ==
        currentPlayer.id))
      avatar = "🦠";
    text(avatar, 0, 0);
    pop();
  }



}
