<!DOCTYPE html>
<html lang="en">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Product</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="mb-4">Add New Product</h1>

        <?php
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            // Supabase connection details
            $supabaseUrl = "https://ilkhsxnltlmtavuucpeq.supabase.co";
            $supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsa2hzeG5sdGxtdGF2dXVjcGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjUyNzksImV4cCI6MjA1ODQwMTI3OX0.YtcFkoH7Cugo7HkA3bqXWGUXPLBTQytSbADKfwG5i88";
            $table = "products";

            // Gather data from form submission
            $category_id = $_POST['category_id'];
            $name = $_POST['name'];
            $description = $_POST['description'];
            $price = $_POST['price'];
            $stock = $_POST['stock'];
            $image_url = $_POST['image_url'];

            // Prepare data
            $data = [
                "category_id" => (int)$category_id,
                "name" => $name,
                "description" => $description,
                "price" => (float)$price,
                "stock" => (int)$stock,
                "image_url" => $image_url
            ];
            
            $payload = json_encode($data);

            // Make the request
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "$supabaseUrl/rest/v1/$table",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_HTTPHEADER => [
                    "apikey: $supabaseKey",
                    "Authorization: Bearer $supabaseKey",
                    "Content-Type: application/json",
                    "Prefer: return=representation"
                ]
            ]);

            $response = curl_exec($curl);
            $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            curl_close($curl);

            if ($http_code === 201) {
                echo '<div class="alert alert-success">Product added successfully!</div>';
            } else {
                echo '<div class="alert alert-danger">Failed to add product. Please try again.</div>';
            }
        }
        ?>

        <!-- Product Form -->
        <form method="POST">
            <div class="mb-3">
                <label for="category_id" class="form-label">Category ID</label>
                <input type="number" class="form-control" id="category_id" name="category_id" required>
            </div>
            <div class="mb-3">
                <label for="name" class="form-label">Product Name</label>
                <input type="text" class="form-control" id="name" name="name" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" name="description" rows="3" required></textarea>
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" step="0.01" class="form-control" id="price" name="price" required>
            </div>
            <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" id="stock" name="stock" required>
            </div>
            <div class="mb-3">
                <label for="image_url" class="form-label">Image URL</label>
                <input type="text" class="form-control" id="image_url" name="image_url">
            </div>
            <button type="submit" class="btn btn-primary">Add Product</button>
        </form>
    n iiyum

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
</body>
</html>




















































































































.

















.





.



.git




