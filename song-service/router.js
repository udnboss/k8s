const express = require('express');
const router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// POST /songs
router.post('/songs', async (req, res) => {
    const result = await pool.query('insert into songs(name, artist) values($1, $2)', [req.body.name, req.body.artist]);
    res.status(200).send('The song metadata has been added');
});

// GET /songs
router.get('/songs', async (req, res) => {
    const result = await pool.query(`SELECT *, 'classic' as genre FROM songs`);
    res.status(200).send(result.rows);
});

// GET /songs/{id}
router.get('/songs/:id', async (req, res) => {
    const result = await pool.query(`SELECT *, 'classic' as genre FROM songs where id = $1`, [req.params.id]);
    if (result.rows.length == 0) return res.status(404).send('The song metadata with the specified id does not exist');
    res.status(200).send(result.rows[0]);
});

// DELETE /songs?id=1
router.delete('/songs', async (req, res) => {
    const result = await pool.query('DELETE FROM songs where id = $1', [req.params.id]);
    res.status(200).send('The song metadata has been deleted');
});

// GET /startup-check
router.get('/startup-check', (req, res) => {
    res.status(200).send({ status: 'Song service started successfully'});
});

// GET /health
router.get('/health', (req, res) => {
    res.status(200).send({ status: 'Song service is running'});
});

// GET /ready
router.get('/ready', (req, res) => {
    res.status(200).send({ status: 'Song service is ready'});
});

module.exports = router;
