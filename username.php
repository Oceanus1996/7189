<?php
session_start();

if (!isset($_SESSION['user_json'])) {
    echo "Login first!";
    exit();
}

$userData = json_decode($_SESSION['user_json'], true);
$username = $userData['username']; 

header('Content-Type: application/json');  
echo json_encode(['username' => $username]); 
?>

