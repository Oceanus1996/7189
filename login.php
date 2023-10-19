<?php
require "mysql.php";
$username = $_POST['username'];
$password = $_POST['password'];
if (!$username || !$password){
    echo "<script>alert('username or password should be filled');window.location='login.html'</script>";
    die;
}
$sql = "select * from users where `username` = '{$username}' and `password` = '{$password}'";
$del_query=@mysqli_query($conn,$sql);
while ($obj = mysqli_fetch_object($del_query)){
    $re['id'] = $obj->id;
    $re['username'] = $obj->username;
}
mysqli_close($conn);
if ($re){
    session_start();
    $re = json_encode($re);
    $_SESSION['user_json']=$re;
    echo "<script>alert('log in successful');window.location='select1.html'</script>";
}else{
    echo "<script>alert('log in fail');window.location='login.html'</script>";
}


session_start(); // 启动会话

// 检查 Session 变量是否存在
if (isset($_SESSION['user_json'])) {
    // 获取用户信息
    $user_data = json_decode($_SESSION['user_json'], true);

    // 现在，$user_data 包含用户的信息，您可以在此页面上使用它。
    echo "欢迎回来，" . $user_data['username'];
} else {
    // 用户未登录，执行未登录用户的操作，例如重定向到登录页面
    header("Location: login.html");
    exit();
}
