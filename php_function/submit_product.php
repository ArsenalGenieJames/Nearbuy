<?php
session_start();
include '../db.php'; 

if (!isset($_SESSION['user_id']) || $_SESSION['usertype'] !== 'seller') {
    die("Unauthorized access");
}

$user_id = $_SESSION['user_id'];
$store_name = $_POST['store_name'];
$product_name = $_POST['product_name'];
$description = $_POST['description'];
$price = $_POST['price'];
$quantity = $_POST['quantity'];
$weight = $_POST['weight'];
$size = $_POST['size'];

// Handle image upload
$image_url = null;
if ($_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['image']['tmp_name'];
    $image_name = basename($_FILES['image']['name']);
    $upload_dir = 'uploads/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir);
    }
    $target_file = $upload_dir . time() . '_' . $image_name;
    move_uploaded_file($tmp_name, $target_file);
    $image_url = $target_file;
}

try {
    $stmt = $pdo->prepare("INSERT INTO product_list 
        (user_id, store_name, product_name, description, price, quantity, weight, size, image_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $store_name, $product_name, $description, $price, $quantity, $weight, $size, $image_url]);
    echo "Product created successfully. <a href='create_product.php'>Add another</a>";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
