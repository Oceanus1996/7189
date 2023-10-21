<?php
echo "真的进来吗 ";
session_start();

if (!isset($_SESSION['user_json'])) {
    echo "请先登录!";
    exit();
}

$userData = json_decode($_SESSION['user_json'], true);
$username = $userData['username'];
?>
