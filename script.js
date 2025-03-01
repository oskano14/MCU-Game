window.addEventListener("load", function () {
  //canvas setup
  // Configuration du canvas

  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");

  canvas.width = 1700;
  canvas.height = 1020;
  const restartButton = document.getElementById("restartButton");

  // Ajout du bouton Gagnant

  // Gestion des entrées utilisateur
  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        // Détection des touches pour le déplacement et le tir
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          e.preventDefault(); // Empêche l'interaction avec les boutons
          this.game.player.shootTop(); // Tirer un projectile avec la barre d'espace
        } else if (e.key === "d") {
          this.game.debug = !this.game.debug;
        }
      });
      window.addEventListener("keyup", (e) => {
        // Suppression des touches de la liste quand elles sont relâchées
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  // Classe Projectile gérant les tirs
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 30;
      this.height = 25;
      this.speed = 3;
      this.markedForDeletion = false;
      this.image = document.getElementById("projectile");
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.markedForDeletion = true; // Suppression du projectile quand il sort de l'écran
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX =
        (Math.random() * -1.5 - 0.5) * (1 + this.game.gameTime / 60000);

      this.markedForDeletion = false;
      this.lives = 2;
      this.score = this.lives;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
    }
    update() {
      this.x += this.speedX - this.game.speed;
      if (this.x + this.width < 0) this.markedForDeletion = true;
      // sprite animation
    }
    draw(context) {
      if (this.game.debug) {
        context.strokeRect(this.x, this.y, this.width, this.height);
      }

      context.drawImage(
        this.image,

        this.x,
        this.y,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.font = "20px Arial";
        context.fillText(this.lives, this.x, this.y);
      }
    }
  } // Classe Enemy
  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228;
      this.height = 169;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById("angler1");
    }
  }

  class Particule {} // Classe Particule à implémenter plus tard

  // Classe du joueur
  class Player {
    constructor(game) {
      this.game = game;
      this.width = 340;
      this.height = 280;
      this.x = 20;
      this.y = 100;
      this.speedY = 0;
      this.maxSpeed = 5;
      this.projectiles = []; // Tableau des projectiles tirés
      this.image = new Image();
      this.image.src = "assets/capitain marvel.gif";
    }
    update() {
      // Déplacement vertical du joueur
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown"))
        this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      // verticale boundaries
      if (this.y > this.game.height - this.height * 0.5)
        this.y = this.game.height - this.height * 0.5;
      else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;

      // Mise à jour des projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
    }
    draw(context) {
      if (this.game.debug)
        context.strokeRect(this.x, this.y, this.width, this.height);
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--; // Réduit les munitions après un tir
      }
    }
  }

  class Layer {
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = game.width;
      this.height = game.height;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
    }
  } // Classe Layer pour le décor à implémenter plus tard
  class Background {
    constructor(game) {
      this.game = game;
      this.image1 = document.getElementById("layer0");
      //this.image2 = document.getElementById("layer2");
      //this.image3 = document.getElementById("layer3");
      this.layer1 = new Layer(this.game, this.image1, 0.5);
      //this.layer2 = new Layer(this.game, this.image2, 1);
      //this.layer3 = new Layer(this.game, this.image1, 1.5);
      this.layers = [this.layer1];
    }
    update() {
      this.layers.forEach((layer) => layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
    }
  } // Classe Background à implémenter plus tard

  // Interface utilisateur (UI)
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 50;
      this.color = "white";
      this.fontFamily = "Bangers";
    }
    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.shadowOffsetx = 2;
      context.shadowOffsety = 2;
      context.font = this.fontSize + "px " + this.fontFamily;
      //score
      context.fillText("Score : " + this.game.score, 20, 40);
      // Affichage des munitions sous forme de barres

      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 5 * i, 50, 3, 20);
      }
      // timer
      const formattedTime = (this.game.gameTime * 0.001).toFixed(1);

      context.fillText("timer : " + formattedTime, 20, 130);
      // game over message
      if (this.game.gameOver) {
        context.textAlign = "center";
        let message1;
        let message2;
        if (this.game.score > this.game.winningScore) {
          message1 = "You win!";
          message2 = "You done!";
          winnerButton.style.display = "block";
        } else {
          message1 = "You lose!";
          message2 = "Try again next time!";
        }
        context.font = "100px " + this.fontFamily;
        context.fillText(
          message1,
          this.game.width * 0.5,
          this.game.height * 0.5 - 40
        );
        context.font = "45px " + this.fontFamily;
        context.fillText(
          message2,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      }
      context.restore();
    }
  }

  // Classe principale du jeu
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.backgroundMusic = new Audio("sons/game-audio.mp3");

      this.backgroundMusic.loop = true; // Jouer en boucle
      this.backgroundMusic.volume = 0.5; // Volume réduit

      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.ammo = 50;
      this.maxAmmo = 80;
      this.ammoTimer = 0;
      this.ammoInterval = 500; // Temps de recharge des munitions en ms
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 10;
      this.gameTime = 0;
      this.timeLimit = 80000;
      this.speed = 1 + this.gameTime / 60000; // Augmente de 1 chaque minute
      this.debug = false;
    }
    startMusic() {
      this.backgroundMusic.play();
    }
    update(deltaTime) {
      // Réduction progressive de l'intervalle de génération des ennemis
      if (this.gameTime % 10000 < deltaTime) {
        // Toutes les 10 secondes
        this.enemyInterval = Math.max(400, this.enemyInterval - 100); // Réduit l'intervalle mais pas en dessous de 400 ms
      }

      if (!this.gameOver) this.gameTime += deltaTime;
      if (this.gameTime > this.timeLimit) this.endGame();

      this.background.update();
      this.background.layer1.update();
      this.player.update();
      // Gestion du rechargement automatique des munitions
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++; // Ajoute une munition

        this.ammoTimer = 0; // Réinitialise le timer
      } else {
        this.ammoTimer += deltaTime; // Ajoute le temps écoulé
      }
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
          enemy.markedForDeletion = true;
        }

        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0) {
              enemy.markedForDeletion = true;
              if (!this.gameOver) this.score += enemy.score;
              if (this.score > this.winningScore) this.gameOver = true;
            }
          }
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.background.draw(context);

      this.ui.draw(context);
      this.player.draw(context);

      this.enemies.forEach((enemy) => enemy.draw(context));
    }
    addEnemy() {
      let numEnemies = Math.floor(1 + this.gameTime / 30000); // Augmente toutes les 30 sec
      for (let i = 0; i < numEnemies; i++) {
        this.enemies.push(new Angler1(this));
      }
    }

    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
    endGame() {
      this.gameOver = true;
      restartButton.style.display = "block";
    }
    resetGame() {
      this.gameOver = false;
      this.score = 0;
      this.gameTime = 0;
      this.enemies = [];
      this.ammo = 50;
      restartButton.style.display = "none";
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  // Boucle d'animation du jeu
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas à chaque frame
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate); // Redemande une nouvelle frame d'animation
  }

  function startGame() {
    game.startMusic();
    game.gameOver = false; // Réinitialise l'état du jeu
    game.score = 0; // Remet le score à 0
    game.gameTime = 0; // Remet le temps à 0
    game.enemies = []; // Supprime tous les ennemis
    game.ammo = 50; // Recharge les munitions
    winnerButton.style.display = "none";
    restartButton.style.display = "none";
  }

  document.getElementById("startButton").addEventListener("click", function () {
    document.getElementById("startScreen").style.display = "none"; // Cache l’écran de démarrage
    document.getElementById("canvas1").style.display = "block"; // Affiche le canvas
    startGame(); // Démarre le jeu
  });

  restartButton.addEventListener("click", function () {
    game.resetGame();
  });
  const winnerButton = document.getElementById("recompenseButton");
  if (winnerButton) {
    winnerButton.addEventListener("click", sendWinnerEmail);
  } else {
    console.error("Le bouton recompenseButton est introuvable !");
  }
  document.getElementById("toggleSound").addEventListener("click", function () {
    if (game.backgroundMusic.paused) {
      game.backgroundMusic.play();
      this.textContent = "🔊 Son Activé";
    } else {
      game.backgroundMusic.pause();
      this.textContent = "🔇 Son Désactivé";
    }
  });

  animate(0);
});
