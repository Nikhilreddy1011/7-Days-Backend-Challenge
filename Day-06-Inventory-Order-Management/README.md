# Day 06 — Inventory & Order Management API

## A Real-World Backend Project with MongoDB, Transactions, Atomic Operations and Inventory Management

------------------------------------------------------------------------

# 1. Project Overview

Day 06 is an **Inventory & Order Management REST API**.

The purpose of this project is not just to create CRUD APIs. The goal is
to understand how backend systems handle **real-world business
problems** such as:

- A customer buying a product
- Checking whether the product actually exists
- Checking whether the product is active
- Checking whether enough stock is available
- Deducting inventory safely
- Preventing two customers from buying the last item at the same time
- Creating an order
- Moving an order through different statuses
- Cancelling an order
- Returning stock after cancellation
- Calculating statistics
- Searching and filtering products
- Using database indexes
- Using MongoDB aggregation
- Keeping related database operations consistent with transactions

This is the difference between a simple CRUD backend and a backend that
represents **real business logic**.

------------------------------------------------------------------------

# 2. Real-World Scenario

Imagine an online shopping application such as:

``` text
Amazon
Flipkart
Myntra
Walmart
Shopify Store
```

A customer opens the application and sees:

``` text
Wireless Mouse
Price: ₹799
Stock: 10
Category: Accessories
```

The customer decides to purchase:

``` text
Quantity: 2
```

The backend must perform several operations:

``` text
Customer
   |
   | "I want 2 mice"
   v
Backend
   |
   +-- Does the product exist?
   |
   +-- Is the product active?
   |
   +-- Is stock >= 2?
   |
   +-- Deduct stock
   |
   +-- Create order
   |
   +-- Calculate total
   |
   v
Order Created
```

This is what we implemented during Day 06.

------------------------------------------------------------------------

# 3. Why Day 06 Is Important

In earlier backend projects, we mainly learned:

``` text
Request
   ↓
Route
   ↓
Controller
   ↓
Database
   ↓
Response
```

That works for simple applications.

But real applications have business rules.

For example:

``` text
"Don't allow customers to order more than available stock."
```

or:

``` text
"If an order is cancelled, restore the inventory."
```

or:

``` text
"Two customers cannot successfully purchase the same last item."
```

These are not simple CRUD operations.

They require:

``` text
Database consistency
+
Business logic
+
Concurrency control
+
Transactions
+
Atomic operations
```

That is the main purpose of Day 06.

------------------------------------------------------------------------

# 4. Technology Stack

## Backend

- Node.js
- Express.js
- JavaScript

## Database

- MongoDB
- MongoDB Atlas
- Mongoose

## API Testing

- Postman

## Development

- VS Code
- Git
- GitHub

------------------------------------------------------------------------

# 5. High-Level Architecture

``` text
                       CLIENT
                  Postman / Frontend
                         |
                         v
                  Express Server
                         |
              +----------+----------+
              |                     |
              v                     v
       Product Routes         Order Routes
              |                     |
              v                     v
       Product Controller     Order Controller
              |                     |
              v                     v
        Product Model          Order Model
              |                     |
              +----------+----------+
                         |
                         v
                      MongoDB
```

The two major resources are:

``` text
Product
Order
```

The relationship is:

``` text
Product
   ^
   |
   | referenced by
   |
Order
```

------------------------------------------------------------------------

# 6. Project Structure

``` text
Day-06-Inventory-Order-Management/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── productController.js
│   └── orderController.js
│
├── middleware/
│   └── errorMiddleware.js
│
├── models/
│   ├── Product.js
│   └── Order.js
│
├── routes/
│   ├── productRoutes.js
│   └── orderRoutes.js
│
├── app.js
├── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── test-concurrency.js
└── README.md
```

------------------------------------------------------------------------

# 7. Installation

Open PowerShell:

``` powershell
cd "C:\Users\nikhi\OneDrive\Desktop\7-Days-Backend-Challenge\Day-06-Inventory-Order-Management"
```

Install dependencies:

``` powershell
npm install
```

------------------------------------------------------------------------

# 8. Environment Variables

Create:

``` text
.env
```

Example:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Create:

``` text
.env.example
```

Example:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Never commit the real `.env`.

------------------------------------------------------------------------

# 9. Start the Server

Development:

``` powershell
npm run dev
```

Normal:

``` powershell
npm start
```

Expected:

``` text
MongoDB Connected
Server running on port 5000
```

Base URL:

``` text
http://localhost:5000
```

------------------------------------------------------------------------

# 10. Product Management

A product represents something that can be sold.

Example:

``` json
{
    "name": "Wireless Mouse",
    "sku": "WM-001",
    "description": "Wireless optical mouse",
    "price": 799,
    "stock": 50,
    "category": "Accessories",
    "isActive": true
}
```

------------------------------------------------------------------------

# 11. Product Fields Explained with Real-World Examples

## `name`

Example:

``` text
Wireless Mouse
```

Real-world meaning:

This is the name customers see on an e-commerce website.

------------------------------------------------------------------------

## `sku`

Example:

``` text
WM-001
```

SKU means **Stock Keeping Unit**.

A warehouse may have:

``` text
WM-001 → Wireless Mouse
KB-001 → Keyboard
HD-001 → Hard Disk
```

The SKU helps the business identify inventory.

------------------------------------------------------------------------

## `price`

Example:

``` text
799
```

This represents the selling price of one unit.

------------------------------------------------------------------------

## `stock`

Example:

``` text
50
```

This means the warehouse currently has:

``` text
50 units
```

available.

------------------------------------------------------------------------

## `category`

Example:

``` text
Accessories
```

Products could be categorized as:

``` text
Accessories
Electronics
Laptops
Mobiles
Clothing
Books
```

Categories become useful for:

``` text
Filtering
Searching
Statistics
Reports
```

------------------------------------------------------------------------

## `isActive`

Example:

``` text
true
```

Suppose a product is discontinued.

Instead of deleting it immediately:

``` text
isActive = false
```

The product remains in the database for historical records but cannot be
ordered.

This is a common real-world business requirement.

------------------------------------------------------------------------

# 12. Product CRUD

CRUD means:

``` text
Create
Read
Update
Delete
```

------------------------------------------------------------------------

# 13. Create Product

Endpoint:

``` http
POST /api/products
```

Full URL:

``` text
http://localhost:5000/api/products
```

Body:

``` json
{
    "name": "Wireless Mouse",
    "sku": "WM-001",
    "description": "Wireless optical mouse",
    "price": 799,
    "stock": 50,
    "category": "Accessories"
}
```

------------------------------------------------------------------------

# 14. Real-World Example — Adding a New Product

Imagine a store receives:

``` text
50 Wireless Mouse units
```

The admin opens the inventory dashboard and creates:

``` text
Name: Wireless Mouse
SKU: WM-001
Price: ₹799
Stock: 50
Category: Accessories
```

The frontend sends:

``` text
POST /api/products
```

The backend stores it in MongoDB.

Now the inventory system knows:

``` text
Wireless Mouse
Stock = 50
```

------------------------------------------------------------------------

# 15. How to Test Create Product

In Postman:

``` text
POST
http://localhost:5000/api/products
```

Select:

``` text
Body
 → raw
 → JSON
```

Paste:

``` json
{
    "name": "Wireless Mouse",
    "sku": "WM-001",
    "description": "Wireless optical mouse",
    "price": 799,
    "stock": 50,
    "category": "Accessories"
}
```

Click:

``` text
Send
```

Copy the returned:

``` text
_id
```

You will need it later.

------------------------------------------------------------------------

# 16. Get All Products

Endpoint:

``` http
GET /api/products
```

Test:

``` text
GET http://localhost:5000/api/products
```

Real-world use:

An e-commerce website opens its product page and requests:

``` text
"Give me the available products."
```

The backend returns the product list.

------------------------------------------------------------------------

# 17. Get One Product

Endpoint:

``` http
GET /api/products/:id
```

Example:

``` text
GET http://localhost:5000/api/products/PRODUCT_ID
```

Real-world use:

A customer opens:

``` text
Wireless Mouse
```

The frontend requests the specific product ID.

------------------------------------------------------------------------

# 18. Update Product

Endpoint:

``` http
PUT /api/products/:id
```

Example:

``` json
{
    "price": 699,
    "stock": 75
}
```

Real-world scenario:

The warehouse receives:

``` text
25 additional mice
```

Existing:

``` text
50
```

New:

``` text
75
```

The admin updates the inventory.

------------------------------------------------------------------------

# 19. Delete Product

Endpoint:

``` http
DELETE /api/products/:id
```

Real-world scenario:

An administrator wants to remove an obsolete product.

Depending on the business requirement, many real systems prefer
deactivation:

``` text
isActive = false
```

rather than physically deleting records that may be referenced by
historical orders.

------------------------------------------------------------------------

# 20. Search

Search lets customers find products.

Example:

``` http
GET /api/products?search=mouse
```

Real-world example:

Customer types:

``` text
mouse
```

into the search bar.

Frontend sends:

``` text
GET /api/products?search=mouse
```

Backend searches the supported fields and returns matching products.

------------------------------------------------------------------------

# 21. Category Filtering

Example:

``` http
GET /api/products?category=Accessories
```

Real-world example:

Customer clicks:

``` text
Accessories
```

The application requests only products in that category.

------------------------------------------------------------------------

# 22. Price Filtering

Example:

``` http
GET /api/products?minPrice=500&maxPrice=1000
```

Real-world example:

Customer selects:

``` text
₹500 - ₹1000
```

The backend returns products inside the requested range.

------------------------------------------------------------------------

# 23. Sorting

Sorting lets users choose how results should be ordered.

For example:

``` text
Price: Low → High
Price: High → Low
Newest
Oldest
```

The exact query parameter depends on the implemented controller.

Real-world example:

A shopping website allows:

``` text
Sort by:
- Price Low to High
- Price High to Low
```

Instead of retrieving every product and sorting them in Node.js, the
database can perform the sorting.

------------------------------------------------------------------------

# 24. Pagination

Imagine the store has:

``` text
100,000 products
```

It would be inefficient to return all 100,000 products in one response.

Instead:

``` text
Page 1 → 20 products
Page 2 → 20 products
Page 3 → 20 products
```

Example:

``` http
GET /api/products?page=1&limit=10
```

Second page:

``` http
GET /api/products?page=2&limit=10
```

------------------------------------------------------------------------

# 25. Real-World Pagination Example

Suppose:

``` text
Total products = 1000
Limit = 10
```

Then:

``` text
Page 1 → products 1-10
Page 2 → products 11-20
Page 3 → products 21-30
```

This reduces:

``` text
Response size
Database work
Network usage
Frontend rendering
```

------------------------------------------------------------------------

# 26. MongoDB Indexes

Indexes make database queries faster for supported query patterns.

Imagine a library.

Without an index:

``` text
Find "Harry Potter"

Check book 1
Check book 2
Check book 3
Check book 4
...
```

With an index:

``` text
Search index
      |
      v
Location found
      |
      v
Book
```

MongoDB indexes work using the same basic idea.

------------------------------------------------------------------------

# 27. Compound Index

The Product schema contains:

``` javascript
productSchema.index({
    category: 1,
    price: 1
});
```

This is a compound index.

It indexes:

``` text
category
+
price
```

------------------------------------------------------------------------

# 28. Real-World Compound Index Example

Suppose the application frequently asks:

``` text
Show Accessories
between ₹500 and ₹1000
```

The query involves:

``` text
category
price
```

The compound index can help MongoDB efficiently handle supported query
patterns.

------------------------------------------------------------------------

# 29. How to Check the Index

MongoDB shell:

``` javascript
db.products.getIndexes()
```

Or use MongoDB Compass and inspect the collection’s indexes.

Look for an index containing:

``` text
category
price
```

------------------------------------------------------------------------

# 30. Aggregation

Aggregation is one of the major Day 06 concepts.

Aggregation allows MongoDB to process data and produce calculated
results.

Real-world examples:

``` text
Total products
Average price
Total inventory
Products grouped by category
Statistics by category
```

------------------------------------------------------------------------

# 31. Real-World Aggregation Example

Imagine the database contains:

``` text
Mouse       Accessories   ₹799
Keyboard    Accessories   ₹999
Laptop      Electronics   ₹60,000
Phone       Electronics   ₹30,000
```

A business owner asks:

``` text
"How many products are in each category?"
```

Aggregation can produce:

``` text
Accessories → 2
Electronics → 2
```

------------------------------------------------------------------------

# 32. Product Statistics

Endpoint:

``` http
GET /api/products/stats
```

This endpoint uses the implemented aggregation logic to calculate
product statistics.

------------------------------------------------------------------------

# 33. Category Statistics

Endpoint:

``` http
GET /api/products/stats/categories
```

Conceptual pipeline:

``` text
Products
   |
   v
$match
   |
   v
$group by category
   |
   v
Calculate statistics
   |
   v
$sort
   |
   v
Return response
```

------------------------------------------------------------------------

# 34. Why Aggregation Instead of JavaScript?

Bad approach for large datasets:

``` text
MongoDB
   ↓
Download 100,000 products
   ↓
Node.js
   ↓
Calculate statistics
```

Better:

``` text
MongoDB
   ↓
Aggregation Pipeline
   ↓
Statistics
   ↓
Node.js
```

The database processes the data where it is stored.

------------------------------------------------------------------------

# 35. Order Management

Now we move from:

``` text
Product Management
```

to:

``` text
Order Management
```

This is where Day 06 becomes more realistic.

------------------------------------------------------------------------

# 36. Real-World Order Example

Customer:

``` text
Nikhil
```

Email:

``` text
nikhil@example.com
```

Wants:

``` text
Wireless Mouse × 2
```

Price:

``` text
₹799
```

Total:

``` text
799 × 2 = ₹1598
```

The customer clicks:

``` text
Place Order
```

The backend receives:

``` text
POST /api/orders
```

------------------------------------------------------------------------

# 37. Create Order API

Endpoint:

``` http
POST /api/orders
```

Body:

``` json
{
    "customerName": "Nikhil",
    "customerEmail": "nikhil@example.com",
    "items": [
        {
            "product": "ACTUAL_PRODUCT_ID",
            "quantity": 2
        }
    ]
}
```

------------------------------------------------------------------------

# 38. IMPORTANT — Product ID

Never manually invent the Product ID.

First:

``` http
GET /api/products
```

Find:

``` json
{
    "_id": "6a7eebe9737a2c709031c391"
}
```

Then use:

``` json
{
    "product": "6a7eebe9737a2c709031c391"
}
```

If you use a nonexistent ID, the API can return:

``` text
Product not found, inactive, or insufficient stock
```

------------------------------------------------------------------------

# 39. Order Creation Flow

The backend performs:

``` text
Request
  |
  v
Validate Product ID
  |
  v
Find Product
  |
  v
Check Product Exists
  |
  v
Check isActive
  |
  v
Check Stock
  |
  v
Calculate Order Information
  |
  v
Deduct Stock
  |
  v
Create Order
  |
  v
Return Response
```

------------------------------------------------------------------------

# 40. Inventory Deduction

Suppose:

``` text
Stock = 87
```

Customer orders:

``` text
5
```

After successful order:

``` text
87 - 5 = 82
```

This is one of the most important business rules.

------------------------------------------------------------------------

# 41. How to Test Inventory Deduction

### Step 1

Check stock:

``` http
GET /api/products/PRODUCT_ID
```

Suppose:

``` text
stock = 87
```

### Step 2

Create order:

``` json
{
    "customerName": "Nikhil",
    "customerEmail": "nikhil@example.com",
    "items": [
        {
            "product": "PRODUCT_ID",
            "quantity": 5
        }
    ]
}
```

### Step 3

Check product again:

``` http
GET /api/products/PRODUCT_ID
```

Expected:

``` text
stock = 82
```

------------------------------------------------------------------------

# 42. Insufficient Stock

Suppose:

``` text
Available = 5
```

Customer requests:

``` text
10
```

The backend must reject the order.

``` text
Stock 5
   |
   v
Request 10
   |
   v
10 > 5
   |
   v
Reject
```

Stock must remain:

``` text
5
```

------------------------------------------------------------------------

# 43. Why This Matters in Real Life

Imagine an e-commerce store has:

``` text
1 iPhone
```

Two customers click:

``` text
Buy
```

at nearly the same time.

The backend cannot simply trust:

``` text
stock >= quantity
```

from a separate earlier read.

Otherwise both customers might get the impression they purchased the
same last phone.

This is why Day 06 introduces:

``` text
Atomic Operations
+
Race Conditions
+
Transactions
```

------------------------------------------------------------------------

# 44. Mongoose Populate

The Order model references Product.

Example:

``` text
Order
   |
   +-- product: ObjectId
```

The ObjectId points to:

``` text
Product
```

Mongoose `populate()` can replace the reference with the related
document.

------------------------------------------------------------------------

# 45. Real-World Populate Example

Without populate:

``` json
{
    "items": [
        {
            "product": "6a7eebe...",
            "quantity": 2
        }
    ]
}
```

With populate:

``` json
{
    "items": [
        {
            "product": {
                "_id": "6a7eebe...",
                "name": "Wireless Mouse",
                "price": 799,
                "category": "Accessories"
            },
            "quantity": 2
        }
    ]
}
```

This is useful when displaying order details.

------------------------------------------------------------------------

# 46. Transactions

Imagine an order contains:

``` text
Product A × 2
Product B × 1
```

The backend may need to:

``` text
1. Check Product A
2. Check Product B
3. Deduct Product A stock
4. Deduct Product B stock
5. Create Order
```

What if Product B fails?

We don’t want:

``` text
Product A stock changed
Product B failed
Order failed
```

while leaving Product A modified.

A transaction gives us:

``` text
START
  |
  +-- Product A
  |
  +-- Product B
  |
  +-- Inventory updates
  |
  +-- Create order
  |
 COMMIT
```

If something fails:

``` text
ABORT
  |
  v
ROLLBACK
```

------------------------------------------------------------------------

# 47. Real-World Bank Example for Transactions

Think about a bank transfer:

``` text
Account A: -₹1000
Account B: +₹1000
```

If the first operation succeeds but the second fails, the money
disappears.

A transaction ensures:

``` text
Both succeed
OR
Neither succeeds
```

Order + inventory consistency follows the same principle.

------------------------------------------------------------------------

# 48. Atomic Operations

Atomic means an operation is treated as one indivisible database
operation.

For inventory, the important pattern is:

``` javascript
stock: {
    $gte: quantity
}
```

together with:

``` javascript
$inc: {
    stock: -quantity
}
```

------------------------------------------------------------------------

# 49. Real-World Atomic Inventory Example

Stock:

``` text
1
```

Two customers:

``` text
Customer A → 1
Customer B → 1
```

MongoDB effectively competes to perform:

``` text
stock >= 1
```

and:

``` text
stock = stock - 1
```

The successful operation changes:

``` text
1 → 0
```

The second operation no longer satisfies:

``` text
stock >= 1
```

so it fails.

Expected:

``` text
One SUCCESS
One FAILURE
Final stock = 0
```

------------------------------------------------------------------------

# 50. Race Conditions

A race condition happens when multiple requests operate on the same data
at approximately the same time.

Example:

``` text
Stock = 1

Request A ─────┐
               |
               +----> Product
               |
Request B ─────┘
```

Both requests want:

``` text
quantity = 1
```

The backend must ensure:

``` text
Only one can consume the final unit.
```

------------------------------------------------------------------------

# 51. Concurrency Test

The project can use:

``` text
test-concurrency.js
```

to send simultaneous order requests.

Start the server:

``` powershell
npm start
```

Then in another terminal:

``` powershell
node test-concurrency.js
```

Expected concept:

``` text
Request A → SUCCESS
Request B → FAILURE
```

The order of A/B is not important.

The important thing is:

``` text
Only one succeeds.
```

------------------------------------------------------------------------

# 52. Why Race-Condition Testing Is Important

A normal test:

``` text
Request 1
wait
Request 2
```

does not reproduce concurrency.

A concurrency test:

``` text
Request 1 ──┐
            ├── simultaneously
Request 2 ──┘
```

is much closer to real traffic.

This is especially important for:

``` text
Tickets
Hotel rooms
Concert seats
Limited stock
Flash sales
Coupons
Bank balances
```

------------------------------------------------------------------------

# 53. Order Status State Machine

An order is not simply:

``` text
created
```

and finished.

It moves through states.

Our normal lifecycle is:

``` text
pending
   |
   v
confirmed
   |
   v
shipped
   |
   v
delivered
```

------------------------------------------------------------------------

# 54. Real-World Order Example

Customer places an order:

``` text
pending
```

Store confirms it:

``` text
confirmed
```

Warehouse sends it:

``` text
shipped
```

Customer receives it:

``` text
delivered
```

This is called a **state machine**.

------------------------------------------------------------------------

# 55. Why State Validation Matters

Imagine an order is:

``` text
pending
```

and someone tries to directly change it to:

``` text
delivered
```

That doesn’t represent a realistic order lifecycle.

The backend should enforce valid transitions.

For example:

``` text
pending → confirmed
confirmed → shipped
shipped → delivered
```

------------------------------------------------------------------------

# 56. Testing Order Status

Create an order.

Then:

``` http
PATCH /api/orders/ORDER_ID/status
```

Body:

``` json
{
    "status": "confirmed"
}
```

Then:

``` json
{
    "status": "shipped"
}
```

Then:

``` json
{
    "status": "delivered"
}
```

Verify the response after each operation.

------------------------------------------------------------------------

# 57. Invalid Status Test

Try:

``` json
{
    "status": "abc"
}
```

Expected:

``` text
400 Bad Request
```

Also test an invalid transition such as:

``` text
pending → delivered
```

The API should reject it according to the implemented state rules.

------------------------------------------------------------------------

# 58. Order Cancellation

Real-world scenario:

Customer places:

``` text
Wireless Mouse × 2
```

Stock:

``` text
10
```

After order:

``` text
8
```

Customer cancels.

The system should:

``` text
Cancel Order
+
Restore 2 units
```

Stock becomes:

``` text
10
```

------------------------------------------------------------------------

# 59. Cancellation Endpoint

``` http
PATCH /api/orders/:id/cancel
```

Example:

``` text
PATCH http://localhost:5000/api/orders/ORDER_ID/cancel
```

No body is required for the implemented endpoint.

------------------------------------------------------------------------

# 60. Inventory Restoration

Flow:

``` text
Stock = 10
     |
     v
Order 2
     |
     v
Stock = 8
     |
     v
Cancel Order
     |
     v
Stock = 10
```

This is important because otherwise the business would permanently lose
inventory whenever an order is cancelled.

------------------------------------------------------------------------

# 61. Double Cancellation

Suppose:

``` text
Stock = 8
```

Order quantity:

``` text
2
```

Cancellation:

``` text
8 + 2 = 10
```

If the customer tries to cancel again:

``` text
10 + 2 = 12
```

would be incorrect.

Therefore:

``` text
Already cancelled
      |
      v
Reject second cancellation
```

Stock remains:

``` text
10
```

------------------------------------------------------------------------

# 62. Testing Double Cancellation

First:

``` http
PATCH /api/orders/ORDER_ID/cancel
```

Expected:

``` text
200 OK
```

Again:

``` http
PATCH /api/orders/ORDER_ID/cancel
```

Expected:

``` text
400 Bad Request
```

or the implemented equivalent error response.

Then verify inventory.

It must not increase again.

------------------------------------------------------------------------

# 63. Complete Product API

``` text
POST   /api/products
GET    /api/products
GET    /api/products/stats
GET    /api/products/stats/categories
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

------------------------------------------------------------------------

# 64. Complete Order API

``` text
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status
PATCH  /api/orders/:id/cancel
```

------------------------------------------------------------------------

# 65. Complete Postman Testing Sequence

Someone reviewing this project can test it in this exact order.

## Test 1 — Start Server

``` powershell
npm start
```

Check:

``` text
MongoDB Connected
Server running on port 5000
```

------------------------------------------------------------------------

## Test 2 — Create Product

``` http
POST http://localhost:5000/api/products
```

``` json
{
    "name": "Day 6 Test Mouse",
    "sku": "DAY6-MOUSE-001",
    "description": "Testing product",
    "price": 500,
    "stock": 10,
    "category": "Testing",
    "isActive": true
}
```

Copy `_id`.

------------------------------------------------------------------------

## Test 3 — Get All Products

``` http
GET http://localhost:5000/api/products
```

Verify the product exists.

------------------------------------------------------------------------

## Test 4 — Get Product

``` http
GET http://localhost:5000/api/products/PRODUCT_ID
```

Verify:

``` text
stock = 10
isActive = true
price = 500
```

------------------------------------------------------------------------

## Test 5 — Search

``` http
GET http://localhost:5000/api/products?search=Mouse
```

------------------------------------------------------------------------

## Test 6 — Category

``` http
GET http://localhost:5000/api/products?category=Testing
```

------------------------------------------------------------------------

## Test 7 — Price

``` http
GET http://localhost:5000/api/products?minPrice=400&maxPrice=600
```

------------------------------------------------------------------------

## Test 8 — Pagination

``` http
GET http://localhost:5000/api/products?page=1&limit=5
```

------------------------------------------------------------------------

## Test 9 — Statistics

``` http
GET http://localhost:5000/api/products/stats
```

------------------------------------------------------------------------

## Test 10 — Category Statistics

``` http
GET http://localhost:5000/api/products/stats/categories
```

------------------------------------------------------------------------

## Test 11 — Create Order

Before:

``` text
stock = 10
```

Send:

``` http
POST http://localhost:5000/api/orders
```

``` json
{
    "customerName": "Nikhil",
    "customerEmail": "nikhil@example.com",
    "items": [
        {
            "product": "PRODUCT_ID",
            "quantity": 2
        }
    ]
}
```

Copy the Order ID.

------------------------------------------------------------------------

## Test 12 — Verify Stock

``` http
GET http://localhost:5000/api/products/PRODUCT_ID
```

Expected:

``` text
stock = 8
```

------------------------------------------------------------------------

## Test 13 — Get Orders

``` http
GET http://localhost:5000/api/orders
```

Verify the order exists.

------------------------------------------------------------------------

## Test 14 — Get One Order

``` http
GET http://localhost:5000/api/orders/ORDER_ID
```

Verify:

``` text
customer
items
product
quantity
total
status
```

------------------------------------------------------------------------

## Test 15 — Confirm

``` http
PATCH http://localhost:5000/api/orders/ORDER_ID/status
```

``` json
{
    "status": "confirmed"
}
```

------------------------------------------------------------------------

## Test 16 — Ship

``` json
{
    "status": "shipped"
}
```

------------------------------------------------------------------------

## Test 17 — Deliver

``` json
{
    "status": "delivered"
}
```

------------------------------------------------------------------------

## Test 18 — Invalid Status

Try:

``` json
{
    "status": "random"
}
```

Verify rejection.

------------------------------------------------------------------------

## Test 19 — Create Another Order

Create a new order specifically for cancellation testing.

------------------------------------------------------------------------

## Test 20 — Cancel

``` http
PATCH http://localhost:5000/api/orders/ORDER_ID/cancel
```

Verify:

``` text
status = cancelled
```

------------------------------------------------------------------------

## Test 21 — Check Inventory Restoration

If:

``` text
Before order = 10
Quantity = 2
After order = 8
```

then after cancellation:

``` text
8 + 2 = 10
```

Verify with:

``` http
GET /api/products/PRODUCT_ID
```

------------------------------------------------------------------------

## Test 22 — Double Cancellation

Send cancellation again.

Verify:

``` text
Request rejected
Stock unchanged
```

------------------------------------------------------------------------

## Test 23 — Insufficient Stock

Try quantity:

``` text
9999
```

when stock is:

``` text
10
```

Expected:

``` text
Order rejected
Stock remains 10
```

------------------------------------------------------------------------

## Test 24 — Inactive Product

Set:

``` text
isActive = false
```

Try to create an order.

Expected:

``` text
Order rejected
```

------------------------------------------------------------------------

# 66. MongoDB Verification

Open:

``` text
MongoDB Atlas
```

or:

``` text
MongoDB Compass
```

Check the database.

------------------------------------------------------------------------

# 67. Check Products Collection

Verify documents contain:

``` text
name
sku
price
stock
category
isActive
createdAt
updatedAt
```

------------------------------------------------------------------------

# 68. Check Orders Collection

Verify:

``` text
customerName
customerEmail
items
totalAmount
status
createdAt
updatedAt
```

------------------------------------------------------------------------

# 69. Verify Inventory Manually

This is one of the best ways to demonstrate the project.

Example:

Before:

``` text
stock = 10
```

Create order:

``` text
quantity = 2
```

MongoDB:

``` text
stock = 8
```

Cancel order:

``` text
stock = 10
```

This proves the inventory business logic is functioning.

------------------------------------------------------------------------

# 70. Verify Aggregation

Create products in different categories:

``` text
Mouse       Accessories
Keyboard    Accessories
Laptop      Electronics
Phone       Electronics
```

Call:

``` http
GET /api/products/stats/categories
```

Verify that categories are grouped in the returned statistics.

------------------------------------------------------------------------

# 71. Verify Index

MongoDB shell:

``` javascript
db.products.getIndexes()
```

Check for the compound index:

``` text
category
price
```

------------------------------------------------------------------------

# 72. Verify Concurrency

Prepare a product with:

``` text
stock = 1
```

Run:

``` powershell
node test-concurrency.js
```

Expected:

``` text
One order succeeds
One order fails
```

Final stock:

``` text
0
```

This is a strong demonstration of inventory protection.

------------------------------------------------------------------------

# 73. Common Error

If you receive:

``` json
{
    "message": "Product not found, inactive, or insufficient stock: 68a123..."
}
```

Do not immediately assume the controller is broken.

Check:

``` text
1. Is this the actual Product _id?
2. Does the product exist?
3. Is isActive true?
4. Is stock sufficient?
```

The safest method is:

``` http
GET /api/products
```

Copy the actual `_id`.

------------------------------------------------------------------------

# 74. GitHub Preparation

Before pushing:

``` powershell
git status
```

Check that:

``` text
.env
node_modules/
```

are not staged.

Then:

``` powershell
git add .
```

Check:

``` powershell
git status
```

Commit:

``` powershell
git commit -m "Complete Day 6 inventory and order management API"
```

Push:

``` powershell
git push
```

------------------------------------------------------------------------

# 75. What Should NOT Be on GitHub?

Do not commit:

``` text
node_modules/
.env
logs/
uploads/
redis-data/
dump.rdb
```

The `.gitignore` handles these.

You should commit:

``` text
package.json
package-lock.json
.env.example
.gitignore
README.md
source code
test-concurrency.js
```

------------------------------------------------------------------------

# 76. Real-World Mapping of Day 06 Concepts

| Day 06 Concept  | Real-World Example                     |
|-----------------|----------------------------------------|
| Product CRUD    | Admin adds products to an online store |
| Search          | Customer searches “mouse”              |
| Filtering       | Customer selects Accessories           |
| Price filtering | Customer selects ₹500–₹1000            |
| Pagination      | Store has 100,000 products             |
| Index           | Fast product lookup                    |
| Compound index  | Category + price search                |
| Aggregation     | Sales/inventory reports                |
| Populate        | Show product details inside an order   |
| Transaction     | Keep order + inventory consistent      |
| Atomic update   | Safely deduct stock                    |
| Race condition  | Two customers buy the last item        |
| Inventory       | Warehouse stock                        |
| Order           | Customer purchase                      |
| State machine   | Pending → Shipped → Delivered          |
| Cancellation    | Customer cancels purchase              |
| Restoration     | Returned stock goes back to inventory  |

------------------------------------------------------------------------

# 77. Most Important Real-World Scenario

Consider:

``` text
Only 1 iPhone is available.
```

Two customers click Buy at nearly the same time.

``` text
Customer A ─────────┐
                    |
                    v
                 Backend
                    ^
                    |
Customer B ─────────┘
```

Both request:

``` text
quantity = 1
```

The correct result is:

``` text
Customer A → SUCCESS
Customer B → FAILED
```

or:

``` text
Customer A → FAILED
Customer B → SUCCESS
```

But never:

``` text
Both → SUCCESS
```

because:

``` text
1 item ≠ 2 orders
```

This single scenario explains why we learned:

``` text
Atomic Operations
       +
Transactions
       +
Race Conditions
       +
Inventory Validation
```

------------------------------------------------------------------------

# 78. Another Real-World Scenario — Cancellation

Suppose:

``` text
Warehouse stock = 100
```

Customer orders:

``` text
10 units
```

After order:

``` text
100 - 10 = 90
```

Customer cancels:

``` text
90 + 10 = 100
```

If the backend forgot to restore inventory:

``` text
Stock remains 90
```

The database would now incorrectly believe that 10 products are still
unavailable.

This is why cancellation is part of inventory management.

------------------------------------------------------------------------

# 79. Another Real-World Scenario — Flash Sale

Suppose a flash sale has:

``` text
Stock = 3
```

At 10:00 AM:

``` text
100 customers
```

send orders.

The backend must make sure:

``` text
Maximum successful quantity = 3
```

not:

``` text
100 successful orders
```

Atomic stock updates and proper transaction design are essential for
this kind of system.

------------------------------------------------------------------------

# 80. Another Real-World Scenario — Category Dashboard

A business owner wants:

``` text
How many products are in each category?
```

The database might contain:

``` text
Accessories    250
Mobiles        120
Laptops         80
Books          500
```

This is a perfect use case for aggregation.

Instead of processing all documents manually in Node.js:

``` text
MongoDB Aggregation
        |
        v
Category Statistics
```

------------------------------------------------------------------------

# 81. Another Real-World Scenario — Product Search

A customer searches:

``` text
wireless
```

The API can return:

``` text
Wireless Mouse
Wireless Keyboard
Wireless Headphones
Wireless Charger
```

This demonstrates why query parameters and search logic are important in
REST APIs.

------------------------------------------------------------------------

# 82. Another Real-World Scenario — Pagination

Imagine Amazon has millions of products.

It cannot reasonably send millions of documents to a browser.

Instead:

``` text
GET /products?page=1&limit=20
```

returns only:

``` text
20 products
```

The customer scrolls or changes page.

The backend retrieves another page.

------------------------------------------------------------------------

# 83. Day 06 Mental Model

Remember Day 06 using this model:

``` text
PRODUCT
   |
   | search
   | filter
   | sort
   | paginate
   | aggregate
   |
   v
INVENTORY
   |
   | stock check
   | atomic update
   |
   v
ORDER
   |
   | pending
   | confirmed
   | shipped
   | delivered
   |
   +---- cancel
           |
           v
    RESTORE INVENTORY
```

------------------------------------------------------------------------

# 84. Day 06 Checklist

## Product

- [x] Product schema
- [x] Create product
- [x] Read products
- [x] Read single product
- [x] Update product
- [x] Delete product

## Query Features

- [x] Search
- [x] Category filtering
- [x] Price filtering
- [x] Sorting
- [x] Pagination

## MongoDB

- [x] Indexes
- [x] Compound index
- [x] Aggregation
- [x] Transactions
- [x] Atomic updates

## Orders

- [x] Order schema
- [x] Create order
- [x] Get orders
- [x] Get order by ID
- [x] Product references
- [x] Populate

## Inventory

- [x] Stock validation
- [x] Stock deduction
- [x] Insufficient-stock protection
- [x] Atomic stock update
- [x] Race-condition protection
- [x] Stock restoration
- [x] Double-cancellation protection

## Order Lifecycle

- [x] Pending
- [x] Confirmed
- [x] Shipped
- [x] Delivered
- [x] Cancelled
- [x] Transition validation

## Testing

- [x] Postman
- [x] CRUD testing
- [x] Search testing
- [x] Filter testing
- [x] Pagination testing
- [x] Aggregation testing
- [x] Order testing
- [x] Inventory testing
- [x] Error testing
- [x] Cancellation testing
- [x] Concurrency testing

## GitHub

- [x] `.gitignore`
- [x] `.env.example`
- [x] README
- [x] Git commit
- [x] Git push

------------------------------------------------------------------------

# 85. Final Day 06 Architecture

``` text
                         ONLINE STORE
                              |
                              v
                         REST API
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
         PRODUCTS                           ORDERS
             |                                 |
     +-------+-------+                 +-------+-------+
     |       |       |                 |       |       |
  Search  Filter  Pagination       Validate  Stock  Status
     |       |       |                 |       |       |
     +-------+-------+                 +-------+-------+
             |                                 |
             v                                 v
        Aggregation                      Atomic Update
             |                                 |
             v                                 v
          MongoDB <-------- Transaction -------+
             |
             v
          Inventory
             |
             v
       Cancellation
             |
             v
     Restore Inventory
```

------------------------------------------------------------------------

# 86. Final Summary

Day 06 is not simply a CRUD project.

It demonstrates how a backend handles **business-critical data**.

The central problem is:

``` text
How do we safely sell limited inventory?
```

The answer involves:

``` text
Product Management
       +
Stock Validation
       +
Atomic Operations
       +
Transactions
       +
Concurrency Protection
       +
Order Management
       +
State Validation
       +
Cancellation
       +
Inventory Restoration
```

These are concepts that appear in real:

``` text
E-commerce systems
Inventory systems
Ticket booking systems
Hotel booking systems
Food delivery systems
Warehouse systems
Flash-sale platforms
Payment-related workflows
```

------------------------------------------------------------------------

# 87. Day 06 Completed

``` text
╔══════════════════════════════════════════════════╗
║                                                  ║
║             DAY 06 — COMPLETED ✅                ║
║                                                  ║
║       INVENTORY & ORDER MANAGEMENT API            ║
║                                                  ║
║  MongoDB • Aggregation • Transactions            ║
║  Atomic Operations • Race Conditions             ║
║  Inventory • Orders • Status Management          ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

------------------------------------------------------------------------

## Author

**Nikhil**

7-Days Backend Challenge — Day 06
