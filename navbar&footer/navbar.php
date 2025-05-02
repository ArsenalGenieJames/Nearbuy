<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include 'db.php';

// Get search term if provided
$searchTerm = isset($_GET['search']) ? trim($_GET['search']) : '';

// Fetch product data
try {
    if ($searchTerm !== '') {
        $sql = "SELECT id, product_name, price, image_url 
                FROM product_list 
                WHERE LOWER(product_name) LIKE LOWER(?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute(['%' . $searchTerm . '%']);
    } else {
        $sql = "SELECT id, product_name, price, image_url FROM product_list";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    }
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>

    <div class="custom-ads" >
        <marquee >
           Get <span class="inline-block mx-1 custom-per">30% OFF</span><img class="inline-block mx-1" src="./assets/img/cartss.svg" alt="cart"> Order now and get it delivered within <span class="inline-block mx-1 custom-per">20 minutes</span>
        </marquee>
    </div>

<nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <img class="h-8 w-auto" src="./assets/img/nearbuy_primary_logo.png" alt="Your Company">
                <img class="h-8 m-3 mb-1 w-auto hidden sm:block" src="./assets/img/NearBuy.svg" alt="Your Company">
            </div>

            <div class="flex justify-center w-1/2">
                <form class="w-full flex items-center relative">   
                <div class="relative w-full">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i class="fas fa-search text-gray-500"></i>
                    </div>
                    <input type="text" id="default-search" 
                    class="block p-2 pl-10 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 text-black" 
                    placeholder="Search..." required>
                </div>
                <button type="submit" 
                    class="inline-flex items-center p-2 ml-2 text-sm font-medium text-white bg-yellow-400 rounded-lg hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300">
                    Search
                </button>
                </form>
         </div>

         <!-- fullname of user using if else will display its if log in or not -->
         <div class="flex items-center">
            <button type="button" class="relative p-2 rounded-full text-black hover:text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <img class="h-6 w-6" src="./assets/img/cartss.svg" alt="Cart">
                <span id="cart-count" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">0</span>
            </button>

            <?php if (isset($_SESSION['fullname'])): ?>
                <div class="ml-4 relative" id="user-menu-container">

                    <button type="button" id="user-button" class="text-black font-bold flex items-center cursor-pointer">
                        <?= htmlspecialchars($_SESSION['fullname']) ?>
                    </button>
                    
                    <div id="dropdown-menu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 hidden">
                        <a href="profile.php" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                        <a href="chat.php" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Chat</a>
                        <a href="logout.php" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                    </div>


                </div>
            <?php endif; ?>

        </div>

        </div>
    </div>
</nav>
    
    <!-- navbar2 butang and pagkaon -->
    <nav class="bg-gray-50 text-black border-gray-200 dark:border-gray-700">
        <div class="max-w-screen-xl px-4 py-3 mx-auto">
            <div class="flex items-center">
                <ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                <li>
                <div onclick="handleClick('Butang')" class="cursor-pointer hover:underline">Butang</div>
                </li>
                <li>
                <div onclick="handleClick('Pagkaon')" class="cursor-pointer hover:underline">Pagkaon</div>
                </li>
                </ul>
            </div>
        </div>
    </nav>

    <script>
            document.addEventListener('DOMContentLoaded', function() {
                const userButton = document.getElementById('user-button');
                const dropdownMenu = document.getElementById('dropdown-menu');
                
                if (userButton && dropdownMenu) {
                    userButton.addEventListener('click', function(e) {
                        e.stopPropagation(); // prevent closing immediately
                        dropdownMenu.classList.toggle('hidden');
                    });

                    document.addEventListener('click', function() {
                        if (!dropdownMenu.classList.contains('hidden')) {
                            dropdownMenu.classList.add('hidden');
                        }
                    });
                }
            });
    </script>
 
</body>
</html>