<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usertype = $_POST['usertype'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $re_password = $_POST['re_password'];
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $phone_number = $_POST['phone_number'];
    $account_number = $_POST['account_number'];
    $address = $_POST['address'];

    if ($password !== $re_password) {
        die("Passwords do not match!");
    }

    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (usertype, email, password, re_password, firstname, lastname, phone_number, account_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$usertype, $email, $hashed_password, $hashed_password, $firstname, $lastname, $phone_number, $account_number, $address]);
        
        header("Location: index.php");
        exit();
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
}
?>
