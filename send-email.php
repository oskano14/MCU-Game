<?php
require 'email_sender.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || empty($data["email"])) {
    echo json_encode(["success" => false, "error" => "Email invalide."]);
    exit;
}

$email = $data["email"];
$score = $data["score"];

$subject = "Félicitations ! Vous avez gagné !";
$message = "Bravo, vous avez gagné avec un score de $score.";

$result = sendEmail($email, $subject, $message);

if ($result === true) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $result]);
}
?>
