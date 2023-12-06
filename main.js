"use strict";
let sprite;
let fruit;
let score = 0;

function startGame() {
  sprite = new SpriteBuilder(30, 30, "red", 185, 185);
  fruit = new SpriteBuilder(25, 25, "green", 270, 185);

  gameArea.start();
}

let gameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

class SpriteBuilder {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.posY = 0;
    this.posX = 0;

    this.update = function () {
      let ctx = gameArea.context;
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.newPos = function () {
      this.x += this.posX;
      this.y += this.posY;
    };
    this.wallCollision = function () {
      let crash = false;

      if (this.x < 0 || this.x > 370) {
        return (crash = true);
      } else if (this.y < 0 || this.y > 370) {
        return (crash = true);
      }
    };
    this.randomSpawn = function () {
      let fruitLoctionX = Math.floor(Math.random() * 360);
      let fruitLoctionY = Math.floor(Math.random() * 360);

      this.x = fruitLoctionX;
      this.y = fruitLoctionY;
    };
    this.fruitCollison = function (otherobj) {
      const myleft = this.x;
      const myright = this.x + this.width;
      const mytop = this.y;
      const mybottom = this.y + this.height;
      const otherleft = otherobj.x;
      const otherright = otherobj.x + otherobj.width;
      const othertop = otherobj.y;
      const otherbottom = otherobj.y + otherobj.height;
      let fruitCrash = false;
      if (
        mybottom < othertop ||
        mytop > otherbottom ||
        myright < otherleft ||
        myleft > otherright
      ) {
        fruitCrash = true;
      }
      return fruitCrash;
    };
  }
}

function updateGameArea() {
  if (sprite.wallCollision()) {
    gameArea.stop();
    gameOverString();
    createStartOverBtn();
  } else {
    gameArea.clear();
    sprite.newPos();
    sprite.update();
    fruit.update();
    if (!sprite.fruitCollison(fruit)) {
      fruit.randomSpawn();
    }
  }
}

function moveSprite(e) {
  let keypress = e.key;
  if (keypress === "w") {
    sprite.posY = -1;
    sprite.posX = 0;
  } else if (keypress === "s") {
    sprite.posY = 1;
    sprite.posX = 0;
  } else if (keypress === "d") {
    sprite.posY = 0;
    sprite.posX = 1;
  } else if (keypress === "a") {
    sprite.posY = 0;
    sprite.posX = -1;
  }
}

function gameOverString() {
  let ctx = gameArea.context;
  ctx.textAlign = "center";
  ctx.font = "50px comic sans";
  ctx.fillText("GAME OVER", 200, 200);
}

function createStartOverBtn() {
  let startOverbtn = document.createElement("button");
  startOverbtn.innerText = "Start Over";
  document.body.appendChild(startOverbtn);

  startOverbtn.addEventListener("click", function () {
    startGame();
    document.body.removeChild(startOverbtn);
  });
}

document.onkeydown = moveSprite;
document.onload = startGame();
