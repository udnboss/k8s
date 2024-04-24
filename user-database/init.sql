CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  amountOfPosts INTEGER NOT NULL DEFAULT 0
);

-- Insert Users
INSERT INTO users (username) VALUES
  ('user1'),
  ('user2'),
  ('user3');