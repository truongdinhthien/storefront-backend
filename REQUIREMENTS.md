# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

Prefix endpoints `/api`
#### Products
- Index `GET /products`
- Show `GET /products/:productId`
- Create [token required] `POST /products/:productId`
- [NEW] Delete [token required] `DELETE /products/:productId`
- [NEW] Update [token required] `PUT /products/:productId`

#### Users
- Index [token required] `GET /users`
- Show [token required] `GET /users/:userId`
- Create `POST /users` (the create endpoint can be treated as register, so don't need token)
- [NEW] Delete [token required] `DELETE /users/:userId`
- [NEW] Update [token required] `PUT /users/:userId` (only author)

#### Orders
- Current Order by user (args: user id)[token required] `GET /orders?userId=`
- [OPTIONAL] Completed Orders by user (args: completed status)[token required] `PUT /orders/:orderId/status` (the user id will be extracted from token)
- [NEW] Create `POST /orders`

#### [NEW] Auth
- Get token (args: email and password) `POST /auth/login`

## Data Shapes
#### Product
- id
- name
- price
- popularity

**Table**
```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    popularity INTEGER DEFAULT 0.00
);
```

#### User
- id
- email
- firstName
- lastName
- ~~hashedPassword~~ (ignore sensitive API response)

**Table**
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  hashed_password VARCHAR(255) NOT NULL
);
```

#### Orders
- id
- status (active or completed or canceled)
- products (join from product table and quantity)
- user (join from user table)

**Table**
```
CREATE TYPE order_status AS ENUM ('active', 'completed', 'canceled');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status order_status
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL
);
```

