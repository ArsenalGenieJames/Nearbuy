<?php
define('SUPABASE_URL', 'https://your-supabase-url.supabase.co');
define('SUPABASE_KEY', 'your-supabase-anon-key');

function connectDB() {
    $pdo = new PDO("pgsql:host=db.<your-supabase-host>;port=5432;dbname=postgres", "postgres", "your-db-password", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    return $pdo;
}
?>
