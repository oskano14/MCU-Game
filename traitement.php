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

// Vérifier si les champs sont remplis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = trim($_POST["nom"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if (!empty($nom) && !empty($email) && !empty($password)) {
        // Hachage du mot de passe
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Insertion dans la base de données
        $stmt = $pdo->prepare("INSERT INTO users (nom, email, password) VALUES (?, ?, ?)");
        if ($stmt->execute([$nom, $email, $hashedPassword])) {
            echo "✅ Inscription réussie !";
            header("Location: page-acueil.html"); // Redirection après succès
            exit();
        } else {
            echo "❌ Erreur lors de l'inscription.";
        }
    } else {
        echo "❌ Tous les champs sont obligatoires.";
    }
} else {
    echo "❌ Requête invalide.";
}
?>
