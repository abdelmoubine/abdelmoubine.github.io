<?php
header("Access-Control-Allow-Origin: https://abdelmoubine.github.io");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    $input = $_POST;
}

if (empty($input["name"]) || empty($input["email"]) || empty($input["message"])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit();
}

$name = strip_tags(trim($input["name"]));
$email = filter_var(trim($input["email"]), FILTER_SANITIZE_EMAIL);
$message = strip_tags(trim($input["message"]));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid email"]);
    exit();
}

$to_email = getenv("TO_EMAIL");
$subject = "New message from $name";
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();
$email_content = "Name: $name\nEmail: $email\n\nMessage:\n$message\n";

if (mail($to_email, $subject, $email_content, $headers)) {
    echo json_encode(["success" => true, "message" => "Email sent successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to send email"]);
}
?>