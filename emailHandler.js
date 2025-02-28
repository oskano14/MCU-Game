function sendWinnerEmail(email, score) {
  fetch("send-email.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      score: score,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Email envoyé avec succès !");
      } else {
        alert("Erreur : " + data.error);
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi de l'email. Réessayez plus tard.");
    });
}

window.sendWinnerEmail = sendWinnerEmail;
