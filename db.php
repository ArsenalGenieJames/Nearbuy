<?php  
// require 'vendor/autoload.php';  

use Supabase\SupabaseClient;  

// Replace with your Supabase URL and anon key  
$supabaseUrl = 'https://itblqpanmcemcezhpgdm.supabase.co';  
$supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0YmxxcGFubWNlbWNlemhwZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDc2MDQsImV4cCI6MjA1ODQ4MzYwNH0.o_AKDrSn6SR2PEaN_o-ZF5M-22185rof6CtiJRjbJWA';  

// Initialize Supabase client  
$supabase = new SupabaseClient($supabaseUrl, $supabaseKey);  

// Example: Fetch data from a table called 'your_table'  
$response = $supabase->from('your_table')->select('*')->execute();  

// Check the response  
if ($response['status'] === 200) {  
    $data = $response['data'];  
    print_r($data);  
} else {  
    echo 'Error: ' . $response['error'];  
}  