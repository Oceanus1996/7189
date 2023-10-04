<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
// 检查是否接收到grabbed URLs
if (isset($_POST['grabbed'])) {
    $urls = json_decode($_POST['grabbed']);
    $_SESSION["grabbedUrls"] = $urls;

    $response = array(
        'message' => 'URLs stored successfully!',
        'data' => $urls
    );
    echo json_encode($response);
    exit;  // 如果这个请求是为了存储数据，那么此处结束
}

// 获取存储在session中的grabbed URLs（如果存在的话）
if (isset($_GET['action']) && $_GET['action'] == 'fetch_urls') {
    $grabbedUrls = isset($_SESSION["grabbedUrls"]) ? $_SESSION["grabbedUrls"] : [];
    echo json_encode($grabbedUrls);
    exit;  // 这里正确地结束这个请求
}
?>

