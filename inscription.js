document.getElementById("btnCommencer").addEventListener("click", function () {
  let accueil = document.getElementById("accueil");
  let identification = document.getElementById("identification");

  // Désactiver le bouton pour éviter le spam
  this.disabled = true;

  // Jouer le son du clic
  sonClic.play();

  // Masquer la page d'accueil avec un effet de fondu
  accueil.style.opacity = "0";

  setTimeout(() => {
    accueil.style.display = "none";

    // Afficher la section d'identification avec effet de transition
    identification.style.display = "flex";
    identification.style.opacity = "0";

    setTimeout(() => {
      identification.style.opacity = "1";
      btnCommencer.disabled = false; // Réactiver le bouton après la transition
    }, 100);
  }, 1000);
});

// === Gestion de la validation du formulaire d'identification ===
document
  .getElementById("formIdentification")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Empêcher la soumission réelle

    let identification = document.getElementById("identification");
    let filmsSection = document.getElementById("films");

    // Masquer la section identification avec un effet de fondu
    identification.style.opacity = "0";

    setTimeout(() => {
      identification.style.display = "none";

      // Afficher la section films avec effet fade-in
      filmsSection.style.display = "block";
      filmsSection.style.opacity = "0";

      setTimeout(() => {
        filmsSection.style.opacity = "1";
      }, 100);
    }, 500);
  });

// === Initialisation du carrousel Swiper ===
const swiper = new Swiper(".swiper-container", {
  slidesPerView: 3, // Affiche 3 films à la fois
  spaceBetween: 20, // Espacement entre les films
  loop: true, // Boucle infinie
  autoplay: {
    delay: 2000, // Défile toutes les 2 secondes
    disableOnInteraction: false, // Continue même si l'utilisateur interagit
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// === Gestion de la sélection d'un film ===
let selectedFilm = null;
const films = document.querySelectorAll(".film");
const btnJouer = document.getElementById("btnJouer");

films.forEach((film) => {
  film.addEventListener("click", function () {
    // Désélectionner l'ancien film
    if (selectedFilm) {
      selectedFilm.classList.remove("selected");
    }

    // Sélectionner le nouveau film
    selectedFilm = this;
    selectedFilm.classList.add("selected");

    // Activer et mettre à jour le texte du bouton "Jouer"
    btnJouer.textContent = `Jouer pour "${this.dataset.film}"`;
    btnJouer.disabled = false;
  });
});

btnJouer.addEventListener("click", function () {
  if (selectedFilm) {
    sonJouer.play();

    // Envoyer le film en PHP
    fetch("save_movie.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "movie=" + encodeURIComponent(selectedFilm.dataset.film),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Réponse du serveur :", data);
        window.location.href = "login.php"; // Redirige vers la page de connexion après succès
      })
      .catch((error) => console.error("Erreur :", error));
  } else {
    alert("Veuillez choisir un film !");
  }
});

// === Gestion des sons ===
const sonClic = new Audio("sons/2037 (1).mp3");
const sonJouer = new Audio(
  "sons/doctor-strange-magic-circle-shield-sound-effect-38335.mp3"
);
const sonHover = new Audio("");

// Jouer le son au survol du bouton "Commencer"
document.getElementById("btnCommencer").addEventListener("mouseenter", () => {
  sonHover.play();
});

window.onload = function () {
  document.body.style.opacity = "1";
};
