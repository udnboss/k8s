CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id) NOT NULL,
  text TEXT NOT NULL,
  posted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert Posts (assuming user IDs exist)
INSERT INTO posts (author_id, text) VALUES
  (1, 'This is the first post from user1'),
  (2, 'Just created my account, excited to share!'),
  (3, 'Here are some interesting thoughts...');