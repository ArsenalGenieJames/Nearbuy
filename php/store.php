<?php
// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Function to send JSON response
function sendJsonResponse($success, $message, $data = null) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

try {
    // Check if the request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendJsonResponse(false, 'Method not allowed');
    }

    // Check if file was uploaded
    if (!isset($_FILES['image'])) {
        sendJsonResponse(false, 'No file uploaded');
    }

    // Get the file and path
    $file = $_FILES['image'];
    $path = $_POST['path'] ?? '';

    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendJsonResponse(false, 'File upload failed with error code: ' . $file['error']);
    }

    // Create directory if it doesn't exist
    $directory = dirname($path);
    if (!file_exists($directory)) {
        // Use recursive mkdir
        if (!mkdir($directory, 0777, true)) {
            sendJsonResponse(false, 'Failed to create directory: ' . $directory);
        }
    }

    // Move the uploaded file
    if (!move_uploaded_file($file['tmp_name'], $path)) {
        sendJsonResponse(false, 'Failed to move uploaded file to: ' . $path);
    }

    // Return success response
    sendJsonResponse(true, 'File uploaded successfully', ['path' => $path]);

} catch (Exception $e) {
    sendJsonResponse(false, $e->getMessage());
}
?>
