# NearBuy - Local Marketplace Platform

NearBuy is a web-based marketplace platform that connects local sellers with customers, facilitating the buying and selling of products in a community-focused environment.

## Features

### For Sellers
- **Product Management**
  - Add, edit, and delete products
  - Upload product images
  - Set product details (name, price, size, quantity, weight)
  - Categorize products (Pagkaon/Butang)
  - Search and filter products
  - Pagination for product listing

- **Order Management**
  - View and track customer orders
  - Update order status (pending/processing/completed/cancelled)
  - View order details including customer information
  - Pagination for order listing

- **Customer Management**
  - View customer profiles
  - Track customer purchase history
  - Monitor customer spending
  - View active vouchers per customer

- **Feedback System**
  - View store feedback
  - View product-specific feedback
  - Track customer ratings and comments
  - Separate tables for store and product feedback
  - Pagination for feedback listing

- **Voucher Management**
  - Create discount vouchers
  - Set voucher validity periods
  - Track voucher usage
  - Monitor voucher status

### For Customers
- Browse products by category
- Search for specific products
- View product details and images
- Place orders
- Provide feedback for products and stores
- Use discount vouchers
- Track order status

### For Riders
- **Delivery Management**
  - View and accept delivery requests
  - Real-time order tracking
  - Update delivery status (picked up/in transit/delivered)
  - Route optimization suggestions
  - Track delivery history

- **Earnings Management**
  - View earnings per delivery
  - Track daily/weekly/monthly earnings
  - View payment history
  - Monitor performance metrics

- **Profile Management**
  - Update availability status (online/offline)
  - Manage delivery zones
  - Update vehicle information
  - View customer ratings and feedback

- **Communication Features**
  - In-app messaging with customers
  - Contact support system
  - Real-time notifications for new orders
  - Communication with sellers for order pickup

## Technical Stack

### Frontend
- HTML5
- CSS3 with Tailwind CSS
- JavaScript (ES6+)
- Font Awesome for icons
- Flowbite for UI components

### Backend
- PHP for file handling
- Supabase for database and authentication
- RESTful API architecture

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NearBuy.git
cd NearBuy
```

2. Set up your local environment:
   - Install XAMPP or similar local server
   - Place the project in the htdocs directory
   - Start Apache server

3. Configure Supabase:
   - Create a new Supabase project
   - Set up the following tables:
     - users (for authentication)
     - products (for product management)
     - orders (for order tracking)
     - feedback (for customer feedback)
     - vouchers (for discount management)

4. Update configuration:
   - Add your Supabase credentials in `js/supabase.js`
   - Ensure proper file permissions for image uploads

5. Start the application:
   - Open your browser
   - Navigate to `http://localhost/NearBuy`

## Project Structure

```
NearBuy/
├── assets/
│   ├── img/
│   └── items/
│       ├── butang/
│       └── pagkaon/
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── seller.js
│   ├── supabase.js
│   └── logout.js
├── php/
│   └── upload.php
├── index.html
├── login.html
├── seller.html
└── README.md
```

## Database Structure

### Cardinality and Relationships

| Entity        | Related Entity | Relationship Type                     | Cardinality                                     | Notes                                                                 |
|---------------|----------------|---------------------------------------|-------------------------------------------------|-----------------------------------------------------------------------|
| **users**     | **orders**     | One-to-Many                           | 1 user (customer) to many orders                | A customer (usertype) can place many orders.                          |
| **users**     | **products**   | One-to-Many (via seller_id)           | 1 seller to many products                       | A seller (usertype) can create many products.                         |
| **users**     | **feedback**   | One-to-Many                           | 1 user (customer or seller) to many feedback    | Users can leave multiple feedback entries.                            |
| **users**     | **deliveries** | One-to-Many (rider role)              | 1 rider to many deliveries                      | A rider (usertype) can deliver multiple orders.                       |
| **orders**    | **deliveries** | One-to-One / One-to-Many              | Typically one delivery per order                | Each order is linked to a delivery, most likely one-to-one.           |
| **products**  | **ordered**    | One-to-Many                           | 1 product to many ordered entries               | An individual product can be ordered multiple times.                  |
| **users**     | **vouchers**   | One-to-Many                           | 1 customer to many vouchers                     | Customers can have multiple vouchers.                                 |

#### Notes:
- One-to-Many: Typically, one user can have many orders, feedback, or vouchers.
- Many-to-One: Many records in child tables point to a single parent (e.g., many products for one seller).
- One-to-One / Many: Stores linked to products may suggest multiple stores for one product or vice versa depending on additional data constraints.

## Usage Guide

### Seller Dashboard
1. **Adding Products**
   - Navigate to "Add Products" section
   - Fill in product details
   - Upload product image
   - Submit form

2. **Managing Products**
   - View all products in "View Products" section
   - Use search bar to find specific products
   - Edit or delete products as needed
   - Monitor product inventory

3. **Handling Orders**
   - View orders in "View Orders" section
   - Update order status
   - Track customer information

4. **Managing Feedback**
   - View store and product feedback
   - Monitor customer ratings
   - Track customer comments

5. **Voucher Management**
   - Create new vouchers
   - Set discount percentages
   - Monitor voucher usage


## Query & Logic Developer (Dev Team)


Project utilizes Supabase as the backend, which provides a PostgreSQL database, authentication, and storage. The JavaScript files interact with Supabase to manage data for sellers, riders, and users.

Here's a breakdown based on the CRUD operations and dynamic queries observed in the code:

### 1. Create – Inserting New Records

The primary example of creating new records is found in `js/seller.js` when a seller adds a new product.

*   **File:** `js/seller.js`
*   **Functionality:** Adding a new product.
*   **Supabase Code:**

```javascript
// ... existing code ...
const { error: dbError } = await supabase.from('products').insert([
    {
        product_name: productName,
        product_type: productType,
        description,
        price,
        size,
        quantity,
        weight,
        image_url: imageUrl,
        seller_id: user.id
    }
]);

if (dbError) throw dbError;
// ... existing code ...
```

*   **Explanation:**
    *   `supabase.from('products')`: This specifies the target table (`products`) in your Supabase database.
    *   `.insert([...])`: This is the Supabase method used to insert one or more rows into the table.
    *   `[{ ... }]`: An array of objects, where each object represents a row to be inserted. The keys of the object correspond to the column names in the `products` table, and the values are the data to be inserted.
    *   `await`: The `insert` operation is asynchronous, so `await` is used to wait for the operation to complete.
    *   `{ error: dbError }`: This is a common pattern with the Supabase client to capture any errors that occur during the operation.
    *   **Real-world Use Case:** This is used on the seller's dashboard (`seller.html`) to allow sellers to add new products to their inventory.

### 2. Read – Fetching Data with Filters

Reading data from the database is the most frequent operation across the different JavaScript files. The code demonstrates fetching data for products, deliveries, orders, feedback, and users, often with filters based on the logged-in user.

*   **File:** `js/seller.js`
*   **Functionality:** Loading products for the logged-in seller.
*   **Supabase Code:**

```javascript
// ... existing code ...
const { data: products, error } = await supabase
    .from('products')
    .select('*') // Select all columns
    .eq('seller_id', user.id) // Filter by the logged-in seller's ID
    .range(from, to); // Pagination
// ... existing code ...
```

*   **Explanation:**
    *   `supabase.from('products')`: Selects the `products` table.
    *   `.select('*')`: Specifies that all columns should be retrieved. You can also specify specific columns (e.g., `.select('product_name, price')`).
    *   `.eq('seller_id', user.id)`: This is a filter clause (`eq` stands for "equals"). It filters the results to only include rows where the `seller_id` column matches the ID of the currently logged-in user (`user.id`).
    *   `.range(from, to)`: This is used for pagination, fetching a specific range of rows.
    *   **Real-world Use Case:** This is used on the seller's "View Products" section to display only the products owned by the logged-in seller.

*   **File:** `js/rider.js`
*   **Functionality:** Loading deliveries assigned to the logged-in rider.
*   **Supabase Code:**

```javascript
// ... existing code ...
const { data: deliveries, error } = await supabase
    .from('deliveries')
    .select(`
        *,
        orders (
            id,
            total_amount,
            status
        ),
        users!seller_id (
            firstname,
            lastname
        )
    `)
    .eq('rider_id', user.id) // Filter by the logged-in rider's ID
    .order('assigned_at', { ascending: false }); // Order by assignment time
// ... existing code ...
```

*   **Explanation:**
    *   `supabase.from('deliveries')`: Selects the `deliveries` table.
    *   `.select(...)`: This is a more complex select statement that includes nested data fetching, effectively performing a "join" operation. It fetches all columns from `deliveries` (`*`), and also fetches related `id`, `total_amount`, and `status` from the `orders` table, and `firstname` and `lastname` from the `users` table where the `seller_id` foreign key in `deliveries` matches the `id` in `users`.
    *   `.eq('rider_id', user.id)`: Filters deliveries to show only those assigned to the logged-in rider.
    *   `.order('assigned_at', { ascending: false })`: Sorts the results by the `assigned_at` column in descending order.
    *   **Real-world Use Case:** This is used on the rider's dashboard (`rider.html`) to display a list of deliveries currently assigned to them.

*   **File:** `js/auth.js`
*   **Functionality:** Checking user authentication and getting the current user.
*   **Supabase Code:**

```javascript
// ... existing code ...
const { data: { session }, error } = await supabase.auth.getSession();
// ... existing code ...
const { data: { user }, error } = await supabase.auth.getUser();
// ... existing code ...
```

*   **Explanation:**
    *   `supabase.auth.getSession()`: Fetches the current user session information.
    *   `supabase.auth.getUser()`: Fetches the details of the currently authenticated user.
    *   **Real-world Use Case:** These are crucial for protecting routes and personalizing the user experience by ensuring a user is logged in and retrieving their information.

### 3. Update – Editing Data

Updating existing records is necessary for modifying information like product details or the status of an order or delivery.

*   **File:** `js/seller.js`
*   **Functionality:** Updating product details.
*   **Supabase Code:**

```javascript
// ... existing code ...
const { error } = await supabase
    .from('products')
    .update({
        product_name: productName,
        description: description,
        price: price,
        size: size,
        quantity: quantity,
        weight: weight,
        product_type: productType,
        image_url: imageUrl // Update image URL if changed
    })
    .eq('id', productId); // Specify which product to update

if (error) throw error;
// ... existing code ...
```

*   **Explanation:**
    *   `supabase.from('products')`: Selects the `products` table.
    *   `.update({ ... })`: This method takes an object containing the columns and their new values to be updated.
    *   `.eq('id', productId)`: This filter is essential for specifying which row(s) to update. In this case, it updates the product where the `id` matches the `productId` being edited.
    *   **Real-world Use Case:** Used in the seller's dashboard to allow sellers to modify the details of their existing products.

*   **File:** `js/rider.js`
*   **Functionality:** Updating the status of a delivery.
*   **Supabase Code:**

```javascript
// ... existing code ...
const { error } = await supabase
    .from('deliveries')
    .update({ status: newStatus }) // Update only the status column
    .eq('id', deliveryId); // Specify which delivery to update

if (error) throw error;
// ... existing code ...
```

*   **Explanation:**
    *   `supabase.from('deliveries')`: Selects the `deliveries` table.
    *   `.update({ status: newStatus })`: Updates the `status` column with the `newStatus` value.
    *   `.eq('id', deliveryId)`: Filters to update only the delivery with the specified `deliveryId`.
    *   **Real-world Use Case:** Used by riders to update the status of a delivery (e.g., to 'picked up', 'in transit', 'delivered').

### 4. Delete – Removing Records

Deleting records is necessary for removing items like products that are no longer available.

*   **File:** `js/seller.js`
*   **Functionality:** Deleting a product.
*   **Supabase Code:**

```javascript
// ... existing code ...
const { error } = await supabase
    .from('products')
    .delete() // Specify the delete operation
    .eq('id', productId); // Specify which product to delete

if (error) throw error;
// ... existing code ...
```

*   **Explanation:**
    *   `supabase.from('products')`: Selects the `products` table.
    *   `.delete()`: This method indicates that rows should be deleted.
    *   `.eq('id', productId)`: Essential filter to specify which row(s) to delete. It deletes the product matching the given `productId`.
    *   **Real-world Use Case:** Used in the seller's dashboard to allow sellers to remove products from their inventory.

### 5. Dynamic Queries and Filtering

The code utilizes dynamic queries by constructing queries based on user input or the application state.

*   **Filtering:** Examples include filtering products by `seller_id`, deliveries by `rider_id`, and potentially searching products based on a search term in `js/seller.js`. The `searchProducts` function in `seller.js` first fetches all products for the seller and then filters them using JavaScript, which could be less efficient for very large datasets. A more efficient approach for searching large datasets would be to use Supabase's built-in filtering capabilities (e.g., `ilike` or full-text search if configured).
*   **Sorting:** The `loadDeliveries` function in `js/rider.js` uses `.order('assigned_at', { ascending: false })` to sort deliveries.
*   **Joining (Implicit):** The `.select()` syntax with nested objects (e.g., `orders ( id, ... )`) in `js/rider.js` implicitly performs a join operation in Supabase, fetching related data from other tables.

### 6. Query Performance Considerations

The code demonstrates some awareness of performance, particularly through:

*   **Pagination:** The `loadProducts` function in `js/seller.js` uses `.range(from, to)` to fetch only a subset of products at a time, improving loading speed and reducing the amount of data transferred. Pagination is also implemented for orders, feedback, and vouchers in `seller.js`.
*   **Filtering:** Using `.eq()` clauses filters results on the database server side, which is more efficient than fetching all data and filtering in the client-side JavaScript.

**Further Performance Considerations (not explicitly in the code, but important for a production app):**

*   **Indexing:** While not visible in the client-side JS, ensuring that database columns used for filtering (`seller_id`, `rider_id`, `id`) and sorting (`assigned_at`) are indexed in your Supabase database is crucial for query performance, especially as the amount of data grows. Supabase often automatically creates indexes for primary and foreign keys, but custom indexes might be needed for other frequently queried columns.
*   **Selecting Specific Columns:** Instead of always using `.select('*')`, selecting only the necessary columns can reduce the amount of data fetched and improve performance.
*   **Server-Side Filtering/Searching:** For complex searches or filtering on multiple fields, using Supabase's full-text search features or creating database functions might be more performant than client-side filtering.

### Summary of Supabase Queries (JS Syntax Examples):

*   **Create:** `supabase.from('table_name').insert([...])`
*   **Read:** `supabase.from('table_name').select('column1, column2, ...').eq('filter_column', value).order('sort_column', { ascending: true/false }).range(from, to)`
*   **Update:** `supabase.from('table_name').update({ column_to_update: new_value }).eq('filter_column', value)`
*   **Delete:** `supabase.from('table_name').delete().eq('filter_column', value)`
*   **Authentication:** `supabase.auth.getSession()`, `supabase.auth.getUser()`, `supabase.auth.signOut()`

JavaScript files effectively utilize the Supabase client library to perform essential CRUD operations and dynamic data fetching, which are fundamental to the functionality of your NearBuy platform for sellers and riders. The code also incorporates basic pagination for performance. For a production environment with potentially large datasets, further optimization through database indexing and considering more advanced server-side querying techniques would be beneficial.




## php | AJAX explaination 

 PHP code related to the "create" operation in your NearBuy project. Based on the `README.md` and the analysis of `js/seller.js`, the primary use of PHP in your project is for handling file uploads, specifically the product images when a seller adds a new product.

the `php/upload.php` file to understand its implementation for this task.

# php/upload.php
the `php/upload.php` file. This PHP script is responsible for handling the server-side part of uploading product images when a seller adds a new product. It works in conjunction with the JavaScript code in `js/seller.js` that sends the image data to this script.

### breakdown of how the PHP code handles the "create" aspect of file uploading:

*   **Purpose:** The `upload.php` script receives an image file sent via a POST request from the frontend (specifically, the "Add Product" form in `seller.html` handled by `js/seller.js`). Its main task is to save this image file to a designated directory on the server.

*   **Receiving the File:**
    *   The script first checks if the incoming request method is POST.
    *   It then checks if the `$_FILES['image']` superglobal variable is set. This variable is populated by PHP when a file is uploaded via a form with `enctype="multipart/form-data"` and an input of `type="file"` named "image".
    *   It retrieves the uploaded file information (name, type, size, temporary name, error code) from `$_FILES['image']`.

*   **Validation:**
    *   The script checks the `$file['error']` value to ensure that the file upload was successful and there were no errors during the process (e.g., file size exceeding limits, partial upload). `UPLOAD_ERR_OK` indicates a successful upload.

*   **Determining Destination Path:**
    *   The script expects the target path for saving the file to be sent in the POST request body as a parameter named `path`. This path is constructed in `js/seller.js` based on the product type and a timestamp to ensure unique filenames.
    *   `$path = $_POST['path'] ?? '';`: This line retrieves the `path` from the POST data. The `?? ''` is the null coalescing operator in PHP 7+, providing a default empty string if `$_POST['path']` is not set.

*   **Creating Target Directory (if needed):**
    *   `$directory = dirname($path);`: Extracts the directory path from the full target path.
    *   `if (!file_exists($directory)) { ... }`: Checks if the target directory already exists.
    *   `if (!mkdir($directory, 0777, true)) { ... }`: If the directory doesn't exist, it attempts to create it using `mkdir()`. The `0777` grants full permissions (read, write, execute) to the owner, group, and others (though stricter permissions might be advisable in a production environment). The `true` argument allows for recursive directory creation if necessary.

*   **Saving the File:**
    *   `if (!move_uploaded_file($file['tmp_name'], $path)) { ... }`: This is the core function for saving the uploaded file. `move_uploaded_file()` securely moves the temporarily stored uploaded file from the server's temporary directory (`$file['tmp_name']`) to the final destination specified by `$path`. This function is important for security as it ensures that the file being moved was indeed an uploaded file and not a malicious file from elsewhere on the system.

*   **Response:**
    *   The script uses a helper function `sendJsonResponse()` to return a JSON response to the frontend, indicating whether the upload was successful or not, along with a message and the saved file path on success.

**In the context of "create" operations:**

While the main "create" of a *product record* happens in `js/seller.js` by inserting data into the Supabase database, the `php/upload.php` script is responsible for the "create" of the *product image file* on the server's filesystem. The URL of this created file is then stored in the Supabase database as part of the product record.

**Real-world Use Case:**

This PHP script is a typical example of how backend code is used to handle file uploads in a web application. It provides a secure way to receive files from clients, validate them, and save them to a designated location on the server, making them accessible via a URL (which is then stored in the database).

**Example of the "Create" flow involving PHP:**

1.  **Frontend (`js/seller.js`):** The seller fills out the product form, including selecting an image file.
2.  **Frontend (`js/seller.js`):** A `FormData` object is created containing the image file and the desired server path.
3.  **Frontend (`js/seller.js`):** An asynchronous POST request is sent to `php/upload.php` with the `FormData`.
4.  **Backend (`php/upload.php`):** The script receives the request, validates the uploaded file, creates the necessary directories, and moves the temporary file to the final path on the server.
5.  **Backend (`php/upload.php`):** A JSON response is sent back to the frontend indicating the success or failure of the upload.
6.  **Frontend (`js/seller.js`):** If the upload is successful, the script proceeds to insert the product details, including the `image_url` (the path where the PHP script saved the image), into the Supabase `products` table.

This demonstrates a common pattern where different technologies (JavaScript for frontend logic and Supabase interaction, PHP for server-side file handling) collaborate to achieve a complete "create" operation that involves both database records and related files.




## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## Project Developer

Genie James Arsenal - geniejamesarsenal.202300349@gmail.com
Project Link: https://nearbuys.netlify.app/
              https://nearbuys.ct.ws/

## Acknowledgments

- Tailwind CSS for styling
- Supabase for backend services
- Font Awesome for icons
- Flowbite for UI components

## Project Members

- Genie James Arsenal | Web Developer
- Grace Getungo  | Dev Team
- Joanna Talitod | Dev Team
- Harlyn Mae Tanate Yañez | Scrum Master
- Angeel | Product Owner
