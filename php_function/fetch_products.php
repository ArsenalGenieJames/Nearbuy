<?php
session_start();
include '../db.php'; 

try {
    $stmt = $pdo->prepare("SELECT id, product_name, price, image_url FROM product_list");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
