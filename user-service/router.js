const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const router = express.Router();

// GET /greeting (Simple API for testing)
router.get('/greeting', (req, res) => {
  res.status(200).json('Hello, k8s!');
});

// Helper function to execute a query
const executeQuery = async (query, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
};

// POST /users (Upload a new user)
router.post('/users', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const newUser = await executeQuery(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    );
    res.status(200).json(newUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// GET /users/:id (Get user's data)
router.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await executeQuery('SELECT * FROM users WHERE id = $1', [id]);
    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// DELETE /users/:id (Delete a user)
router.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await executeQuery('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// PUT /users/:id (Update user's username)
router.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const updatedUser = await executeQuery(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING *',
      [username, id]
    );
    if (!updatedUser.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// PATCH /users/:id (Update user's amountOfPosts)
router.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { amountOfPosts } = req.body;
    if (!amountOfPosts) {
      return res.status(400).json({ message: 'amountOfPosts is required' });
    }
  
    try {
      const updatedUser = await executeQuery(
        'UPDATE users SET amountOfPosts = $1 WHERE id = $2 RETURNING *',
        [amountOfPosts, id]
      );
      if (!updatedUser.length) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating user' });
    }
  });

module.exports = router;
