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

// Vérification de l'utilisateur
$error_message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Vérifier si le mot de passe en base est haché
        if (password_verify($password, $user["password"])) {
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["email"] = $user["email"];
            header("Location: game.php"); // Rediriger vers le jeu
            exit();
        } else {
            
            $error_message = "Mot de passe incorrect.";
        }
    } else {
        $error_message = "Utilisateur non trouvé.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style-connection.css">
    <title>Connexion</title>
</head>
<body>
<div class="login-container">
        <h2>USER LOGIN</h2>
        <form method="POST">
            <div class="input-group">
                <span class="icon">&#128100;</span>
                <input type="email" name="email" placeholder="Email ID" required>
            </div>
            <div class="input-group">
                <span class="icon">&#128274;</span>
                <input type="password" name="password" placeholder="Password" required>
            </div>
            <button type="submit">LOGIN</button>
            <a href="#" class="reset-password">Reset Password</a>
        </form>
    </div>
   
</body>
</html>


