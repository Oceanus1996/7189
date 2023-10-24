<!-- <?php
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
} -->