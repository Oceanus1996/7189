
<?php
session_start();
$acc = $_SESSION['user_json'];
if (!$acc){
    echo 1;
    die;
}