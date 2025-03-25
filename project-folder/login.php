<?php
include 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $pdo = connectDB();

    $phone_number = $_POST['phone_number'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM users WHERE phone_number = ?");
    $stmt->execute([$phone_number]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = $user['usertype'];
        header("Location: dashboard.php");
    } else {
        echo "Invalid phone number or password.";
    }
}
?>

<!-- Bootstrap 5 Login Form -->
<form method="POST">
    <input type="text" name="phone_number" placeholder="Phone Number" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">Login</button>
</form>
