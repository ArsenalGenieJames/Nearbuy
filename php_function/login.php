<?php
session_start();
include '../db.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $phone_number = $_POST['phone_number'];
    $password = $_POST['password'];

    try {
        // Fetch user from the database (modified to include firstname and lastname)
        $sql = "SELECT id, password, usertype, firstname, lastname FROM users WHERE phone_number = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$phone_number]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Debugging: Check fetched data
        if (!$user) {
            echo "<script>alert('User not found!'); window.location.href='../login.html';</script>";
            exit();
        }

        // Validate password
        if (password_verify($password, $user['password'])) {
            // Store user session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['fullname'] = $user['firstname'] . ' ' . $user['lastname'];
            $_SESSION['usertype'] = $user['usertype'];

            // Redirect based on user role
            switch ($user['usertype']) {
                case 'rider':
                    header("Location: ../rider.php");
                    break;
                case 'seller':
                    header("Location: ../seller.php");
                    break;
                case 'customer':
                    header("Location: ../customer.php");
                    break;
                case 'admin':
                    header("Location: ../admin.php");
                    break;
                default:
                    header("Location: ../index.php");
            }
            exit();
        } else {
            echo "<script>alert('Invalid credentials!'); window.location.href='../login.html';</script>";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>