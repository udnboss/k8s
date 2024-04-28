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
Post Server Listening on ${host}:${port}... 
NODE_ENV: ${process.env.NODE_ENV} 
USER_SERVICE_HOST: ${process.env.USER_SERVICE_HOST}
USER_SERVICE_PORT: ${process.env.USER_SERVICE_PORT}
DB_HOST: ${process.env.DB_HOST}
DB_PORT: ${process.env.DB_PORT}
DB_NAME: ${process.env.DB_NAME}
DB_USER: ${process.env.DB_USER}
DB_PASSWORD: ${process.env.DB_PASSWORD}
`));
