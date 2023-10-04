<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// check if received
if (isset($_POST['grabbed'])) {
    $urls = json_decode($_POST['grabbed']);
    $_SESSION["grabbedUrls"] = $urls;

    $response = array(
        'message' => 'URLs stored successfully!',
        'data' => $urls
    );
    echo json_encode($response);
    exit;  
}


if (isset($_GET['action']) && $_GET['action'] == 'fetch_urls') {
    $grabbedUrls = isset($_SESSION["grabbedUrls"]) ? $_SESSION["grabbedUrls"] : [];
    echo json_encode($grabbedUrls);
    exit; 
}
?>

