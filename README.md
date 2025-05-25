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

| Table        | Key Columns                         | Relationships (Foreign Keys)                          | Relationship Type                       | Cardinality                              |  
|--------------|-------------------------------------|--------------------------------------------------------|------------------------------------------|------------------------------------------|  
| **users**   | id (PK)                             | -                                                      | -                                        | -                                        |  
| **orders**  | id (PK)                             | user_id → users(id)                                    | Many orders to 1 user                   | Many-to-One (many orders per user)      |  
| **products**| id (PK)                             | seller_id → users(id)                                  | Many products to 1 seller               | Many-to-One (many products per seller)|  
| **stores**  | id (PK)                             | product_id → products(id)                              | Each store linked to 1 product           | One-to-One or Many stores per product (if multiple records) |  
| **ordered** | id (PK)                             | orders_id → orders(id), product_id → products(id)    | Many ordered entries per order and product | Many-to-One (many ordered records per order/product) |  
| **deliveries** | id (PK)                          | order_id → orders(id), rider_id & seller_id → users(id) | Delivery linked to 1 order, rider, seller | Many deliveries per order/rider/seller |  
| **feedback**| id (PK)                             | user_id → users(id)                                    | Many feedback entries per user          | Many-to-One (many feedbacks per user) |  
| **vouchers**| id (PK)                             | user_id → users(id)                                    | Many vouchers per user                  | Many-to-One (many vouchers per user) |  

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

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
