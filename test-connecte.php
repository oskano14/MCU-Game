<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=mcu-test;charset=utf8", "root", "root", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "✅ Connexion réussie à la base de données !";
} catch (PDOException $e) {
    die("❌ Erreur de connexion : " . $e->getMessage());
}
?>
