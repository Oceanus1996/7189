<!-- <?php
require "mysql.php";
$username = $_POST['username'];
$password = $_POST['password'];
if (!$username || !$password){
    echo "<script>alert('fill the username and password');window.location='register.html'</script>";
    die;
}
$sql = "select * from users where `username` = '{$username}'";
$del_query=@mysqli_query($conn,$sql);
$obj = mysqli_fetch_object($del_query);
if ($obj){
    echo "<script>alert('username already existed');window.location='register.html'</script>";
    die;
}
$insertSql = "insert into users(`username`,`password`) values('{$username}','{$password}')";
$query=@mysqli_query($conn,$insertSql);
if ($query){
    echo "<script>alert('register successful');window.location='login.html'</script>";
    die;
} -->