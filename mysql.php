<?php
    header('conten-type:text/html;charset=utf-8');
    $conn=mysqli_connect("localhost:3306","root","root");
    if(!$conn)
    {
        echo mysqli_error();
        die("数据库连接失败");
        
    }
    mysqli_select_db($conn,"adventure");
    mysqli_query($conn,"set names utf-8");
    
?>