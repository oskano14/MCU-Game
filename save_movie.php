<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Charger la configuration depuis .env
$conConfig = parse_ini_file(__DIR__ . "/.env");
if (!$conConfig) {
    die("❌ Erreur : Impossible de charger le fichier .env.");
}

$host = $conConfig["host"];
$username = $conConfig["username"];
$password = $conConfig["password"];
$dbName = $conConfig["dbName"];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbName;charset=utf8", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("❌ Erreur de connexion : " . $e->getMessage());
}

// Vérifier si un film a été sélectionné
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST["movie"])) {
    $movie = trim($_POST["movie"]);

    // Insérer dans la table `movie`
    $stmt = $pdo->prepare("INSERT INTO movie (name) VALUES (?)");
    if ($stmt->execute([$movie])) {
        echo "✅ Film enregistré avec succès !";
        header("Location: login.php"); // Redirection vers la page de connexion
        exit();
    } else {
        echo "❌ Erreur lors de l'enregistrement du film.";
    }
} else {
    echo "❌ Aucun film sélectionné.";
}
?>
