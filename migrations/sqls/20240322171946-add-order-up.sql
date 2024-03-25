CREATE TYPE order_status AS ENUM ('active', 'completed', 'canceled');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status order_status
);