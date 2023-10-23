<?php
require "mysql.php";
session_start();
$str = $_POST['datas'];
// $str = "{\"message\":\"URLs stored successfully!\",\"data\":[{\"title\":\"South East Queensland cleans up - ABC (none) - Australian Broadcasting Corporation\",\"image\":\"http:\/\/www.abc.net.au\/reslib\/201101\/r702380_5400964.jpg\",\"url\":\"http:\/\/www.abc.net.au\/local\/photos\/2011\/01\/16\/3113930.htm\",\"grabbedMarkersCount\":1}]}";
$arr = json_decode($str,true);
$url = $arr['data']['0']['url'];
$userid = json_decode($_SESSION['user_json'],true)['id'];
$sql = "select * from user_do where `userid` = '{$userid}' and `xy` = '{$url}'";
$del_query=@mysqli_query($conn,$sql);
$obj = mysqli_fetch_object($del_query);
if ($obj){
    echo "already exist";
//    echo "<script>alert('already exist');window.location='index.html'</script>";
    die;
}

$insertSql = "insert into user_do(`userid`,`xy`) values('{$userid}','{$url}')";
$query=@mysqli_query($conn,$insertSql);
echo "save successful";