<?php
session_start();
$_SESSION = array();
session_destroy();
echo "<script>localStorage.removeItem('cart');</script>";
header("Location: login.php");
exit();
?>