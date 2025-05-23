# Nearbuy E-commerce System

## System Overview
Nearbuy is a local e-commerce platform that connects customers with local businesses and delivery riders, focusing on traditional products and local cuisine. The system provides a seamless shopping experience for users to browse, select, and purchase local products and food items, with dedicated interfaces for customers, sellers, and riders. Built entirely with JavaScript and powered by Supabase for cloud database and authentication.

## User Roles and Features

### 1. Customer
- **Product Browsing**
  - Categorized product listings (Local Butang and Local Pagkaon)
  - Product search functionality
  - Product details with images and descriptions
  - Price display in Philippine Peso (₱)

- **Shopping Cart**
  - Add products to cart
  - Adjust product quantities
  - Remove products
  - View cart total
  - Cart count indicator

- **Checkout Process**
  - Address selection
  - Voucher application
  - Order summary
  - Total calculation including shipping
  - Order tracking
  - Delivery status updates

### 2. Seller
- **Product Management**
  - Add new products
  - Edit product details
  - Update product prices
  - Manage product inventory
  - Upload product images

- **Order Management**
  - View incoming orders
  - Accept/reject orders
  - Update order status
  - Process orders
  - View order history

- **Business Dashboard**
  - Sales analytics
  - Revenue tracking
  - Customer feedback
  - Product performance metrics
  - Inventory management

### 3. Rider
- **Delivery Management**
  - View available deliveries
  - Accept delivery requests
  - Update delivery status
  - View delivery history
  - Navigation assistance

- **Earnings Tracking**
  - View earnings
  - Track completed deliveries
  - Payment history
  - Performance metrics

## Features
1. **Product Browsing**
   - Categorized product listings (Local Butang and Local Pagkaon)
   - Product search functionality
   - Product details with images and descriptions
   - Price display in Philippine Peso (₱)

2. **Shopping Cart**
   - Add products to cart
   - Adjust product quantities
   - Remove products
   - View cart total
   - Cart count indicator

3. **Checkout Process**
   - Address selection
   - Voucher application
   - Order summary
   - Total calculation including shipping

4. **User Interface**
   - Responsive design
   - Modern UI with Tailwind CSS
   - Interactive product cards
   - Modal popups for product details
   - Shopping cart modal

## Technical Stack

### Frontend
- HTML5
- CSS3 (with Tailwind CSS framework)
- JavaScript (ES6+)
- Font Awesome icons
- Flowbite components

### Backend & Database
- Supabase (Cloud Database)
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage for product images
  - Row Level Security (RLS)
- JavaScript (Node.js)
  - Serverless functions
  - API endpoints
  - Business logic

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Setup Instructions

1. **Prerequisites**
   - Node.js installed
   - Supabase account
   - Git installed

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Navigate to project directory
   cd Nearbuy
   
   # Install dependencies
   npm install
   ```

3. **Supabase Configuration**
   - Create a new Supabase project
   - Set up database tables
   - Configure authentication
   - Set up storage buckets
   - Enable Row Level Security
   - Copy Supabase credentials to environment variables

4. **Environment Setup**
   ```javascript
   // .env file
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Running the Application**
   ```bash
   # Start development server
   npm run dev
   ```

## Project Structure
```
Nearbuy/
├── assets/
│   ├── img/
│   ├── video/
│   └── butang/
├── css/
│   └── style.css
├── js/
│   ├── index_function.js
│   ├── cart.js
│   ├── supabase.js
│   └── auth.js
├── index.html
├── cart.html
├── login.html
├── register.html
└── README.md
```

## Database Schema (Supabase)

### Tables
1. **users**
   - id (uuid)
   - email
   - role (customer/seller/rider)
   - profile_data (jsonb)
   - created_at

2. **products**
   - id (uuid)
   - seller_id (foreign key)
   - name
   - description
   - price
   - category
   - image_url
   - stock
   - created_at

3. **orders**
   - id (uuid)
   - customer_id (foreign key)
   - seller_id (foreign key)
   - rider_id (foreign key)
   - status
   - total_amount
   - delivery_address
   - created_at

4. **order_items**
   - id (uuid)
   - order_id (foreign key)
   - product_id (foreign key)
   - quantity
   - price_at_time

5. **deliveries**
   - id (uuid)
   - order_id (foreign key)
   - rider_id (foreign key)
   - status
   - pickup_location
   - delivery_location
   - created_at

### Security Rules
- Row Level Security (RLS) policies for each table
- Role-based access control
- Secure authentication using Supabase Auth

## Current Implementation Status

### Completed Features
- Product listing and categorization
- Shopping cart functionality
- Product search
- Cart management (add, remove, update quantity)
- Checkout interface
- Address selection modal
- Voucher system interface

### Pending Features
- User authentication
- Database integration
- Payment processing
- Order history
- Admin dashboard
- Product management system

## Next Steps

1. **Database Integration**
   - Create database schema
   - Implement user authentication
   - Set up product management
   - Configure order processing

2. **Backend Development**
   - Implement PHP controllers
   - Create API endpoints
   - Set up database connections
   - Handle form submissions

3. **Security Implementation**
   - User authentication
   - Input validation
   - XSS protection
   - CSRF protection

4. **Testing**
   - Unit testing
   - Integration testing
   - User acceptance testing
   - Performance testing

## Software Requirements Specification (SRS)

### Functional Requirements

1. **User Management**
   - Supabase Authentication integration
   - Role-based user registration (Customer/Seller/Rider)
   - Profile management
   - Address management

2. **Data Management**
   - Real-time data synchronization
   - Offline support
   - Data validation
   - Error handling

3. **Security**
   - Supabase Row Level Security
   - JWT authentication
   - Secure API endpoints
   - Data encryption

4. **Customer Features**
   - Product browsing and searching
   - Shopping cart management
   - Order placement and tracking
   - Payment processing
   - Delivery status monitoring

5. **Seller Features**
   - Product management
   - Order processing
   - Inventory control
   - Sales analytics
   - Customer communication

6. **Rider Features**
   - Delivery request management
   - Route optimization
   - Status updates
   - Earnings tracking
   - Performance monitoring

7. **Shopping Cart**
   - Add to cart
   - Update quantities
   - Remove items
   - View cart
   - Calculate totals

8. **Checkout Process**
   - Address selection
   - Payment processing
   - Order confirmation
   - Order tracking
   - Delivery assignment

### Non-Functional Requirements

1. **Performance**
   - Page load time < 3 seconds
   - Support for 1000+ concurrent users
   - 99.9% uptime
   - Real-time order status updates

2. **Security**
   - Role-based access control
   - Secure user authentication
   - Data encryption
   - Regular security updates
   - Backup system

3. **Usability**
   - Role-specific interfaces
   - Intuitive user interface
   - Mobile responsiveness
   - Accessibility compliance
   - Multi-language support

4. **Reliability**
   - Error handling
   - Data validation
   - System monitoring
   - Regular backups
   - Real-time notifications

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any queries or support, please contact the development team.
