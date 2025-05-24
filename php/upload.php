<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $folder = $_POST['folder'] ?? 'uploads';
    $filename = $_POST['filename'] ?? time() . '-' . basename($_FILES['image']['name']);
    
    $targetDir = __DIR__ . "/assets/items/{$folder}/";
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

    $targetFile = $targetDir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "filename" => $filename]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "move_uploaded_file failed"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request"]);
}
