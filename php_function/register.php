<?php
include '../db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $phonenumber = $_POST['phone_number'];
    $address = $_POST['address'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $re_password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $userType = $_POST['usertype'];

    try {
        // Check if the phone number already exists
        $check_sql = "SELECT id FROM users WHERE phone_number = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->execute([$phonenumber]);
        $existing_user = $check_stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing_user) {
            echo "<script>alert('This phone number is already registered. Please use a different number.'); window.location.href='../register.php';</script>";
            exit();
        }

        // Insert new user if phone number does not exist
        $sql = "INSERT INTO users (firstname, lastname, phone_number, address, email, password, re_password, usertype) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$firstname, $lastname, $phonenumber, $address, $email, $password, $re_password, $userType]);

        echo "<script>alert('Registration successful!'); window.location.href='../login.php';</script>";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>