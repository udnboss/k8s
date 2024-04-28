const express = require('express');
const { Pool } = require('pg');
const http = require('http');

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

// POST /posts (Upload a new post)
router.post('/posts', async (req, res) => {
  const { authorId, text } = req.body;
  if (!authorId || !text) {
    return res.status(400).json({ message: 'Author ID and text are required' });
  }

  const now = new Date().toISOString(); // Capture current timestamp

  try {
    const newPost = await executeQuery(
      'INSERT INTO posts (author_id, text, posted_at) VALUES ($1, $2, $3) RETURNING *',
      [authorId, text, now]
    );

    //call user service to update user post count
    // Get the total number of posts for the user
    const totalPosts = await executeQuery('SELECT COUNT(*) FROM posts WHERE author_id = $1', [authorId]);

    // Make a PATCH request to update the user's amountOfPosts
    const updateUserPosts = (authorId, totalPosts) => {

        const postData = JSON.stringify({ amountOfPosts: totalPosts });

        const options = {
            hostname: process.env.USER_SERVICE_HOST,
            port: process.env.USER_SERVICE_PORT,
            path: `/users/${authorId}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);

            res.on('data', (chunk) => {
                console.log(`Response: ${chunk}`);
            });
        });

        req.on('error', (error) => {
            console.error(`Error: ${error}`);
        });

        req.write(postData);
        req.end();
    };

    // Call the function to update the user's amountOfPosts
    updateUserPosts(authorId, totalPosts[0].count);
    
    res.status(200).json(newPost[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// GET /posts/:id (Get post's data)
router.get('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const post = await executeQuery('SELECT * FROM posts WHERE id = $1', [id]);
    if (!post.length) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// DELETE /posts/:id (Delete a post)
router.delete('/posts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await executeQuery('DELETE FROM posts WHERE id = $1', [id]);
    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// PUT /posts/:id (Update post's data)
router.put('/posts/:id', async (req, res) => {
  const id = req.params.id;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const updatedPost = await executeQuery(
      'UPDATE posts SET text = $1 WHERE id = $2 RETURNING *',
      [text, id]
    );
    if (!updatedPost.length) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating post' });
  }
});

// GET /startup-check (Check if the server is running)
router.get('/startup-check', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// GET /health (Check the health of the server)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// GET /ready (Check if the server is ready to handle requests)
router.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

module.exports = router;
