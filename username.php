<?php
session_start();

if (!isset($_SESSION['user_json'])) {
    echo "请先登录!";
    exit();
}

$userData = json_decode($_SESSION['user_json'], true);
$username = $userData['username'];  // 从解码的数组中取得用户名

header('Content-Type: application/json');  // 设置响应头，告诉前端这是一个JSON格式的响应
echo json_encode(['username' => $username]); 
?>

