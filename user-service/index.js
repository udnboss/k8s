const express = require('express');
const app = express();
const router = require('./router'); // Assuming the router is in a file named router.js

app.use(express.json()); // for parsing application/json
app.use('/', router);

// Add the logging middleware
app.use((req, res, next) => {
    res.on('finish', () => {
      console.log(`${req.method} ${res.statusCode} ${req.path}`);
    });
    next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = 3000;
const host = '0.0.0.0'; // Listen on all IP addresses

app.listen(port, host, () => console.log(`
Server Listening on ${host}:${port}... 
NODE_ENV: ${process.env.NODE_ENV} 
DB_HOST: ${process.env.DB_HOST}
DB_PORT: ${process.env.DB_PORT}
DB_NAME: ${process.env.DB_NAME}
`));
