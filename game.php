
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>marvel jeu</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bangers&display=swap"
      rel="stylesheet"
      
 />
 <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <div id="startScreen">
      <div id="tutorial">  
        <h1>Bienvenue dans le jeu !</h1>
        <p>** 🕹️Commandes **</p>
        <ul>
          <li>⬆️ Flèche Haut → Monter</li>
          <li>⬇️ Flèche Bas → Descendre</li>
          <li>🔫 Barre Espace → Tirer</li>
        </ul>
        <p>** 🎯Objectif **<p class="objectif">Détruis les ennemis et fais le meilleur score !</p> </p>
        <button id="startButton" type="button">Cliquez pour commencer</button>
      </div>
    </div>
    
  

    <canvas id="canvas1"></canvas>
   
    <!--characters-->
    <img id="player" src="assets/personnage.png" alt="" />
    <img id="angler1" src="assets/angler1.png" alt="" />

    <!--props-->
    <img id="projectile" src="assets/projectile.png" alt="" />

    <!--environement -->
    <img
      id="layer0"
      src="assets/DALL·E-2025-02-11-12.14.27-A-wide_-side-scrolling-parallax-background-for-a-futuristic-runner-game.jpg"
      alt=""
    />
    <!--bouton -->
    <button id="restartButton" type="button">Rejouer</button>
    <button id="recompenseButton" type="button">Récupérer mon cadeau</button>
    <button id="toggleSound">🔊 Activer/Désactiver le son</button>
   

    
   

    <script src="emailHandler.js"></script>
    <script src="script.js" defer></script>
  </body>
</html>
