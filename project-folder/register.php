<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $pdo = connectDB();

    $usertype = $_POST['usertype'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $re_password = password_hash($_POST['re_password'], PASSWORD_DEFAULT);
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $phone_number = $_POST['phone_number'];
    $account_number = $_POST['account_number'];
    $address = $_POST['address'];

    if ($_POST['password'] !== $_POST['re_password']) {
        echo "Passwords do not match!";
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO users (usertype, email, password, re_password, firstname, lastname, phone_number, account_number, address) 
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$usertype, $email, $password, $re_password, $firstname, $lastname, $phone_number, $account_number, $address]);
        echo "Registration successful! <a href='login.php'>Login here</a>";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>

<!-- Bootstrap 5 Registration Form -->
<form method="POST">
    <input type="text" name="usertype" placeholder="User Type" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Password" required>
    <input type="password" name="re_password" placeholder="Confirm Password" required>
    <input type="text" name="firstname" placeholder="First Name" required>
    <input type="text" name="lastname" placeholder="Last Name" required>
    <input type="text" name="phone_number" placeholder="Phone Number" required>
    <input type="text" name="account_number" placeholder="Account Number" required>
    <input type="text" name="address" placeholder="Address" required>
    <button type="submit">Register</button>
</form>
