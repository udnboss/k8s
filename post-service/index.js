const express = require('express');
const app = express();
const router = require('./router'); // Assuming the router is in a file named router.js

app.use(express.json()); // for parsing application/json
app.use('/', router);

const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;
const songServiceUrl = process.env.SONG_SERVICE_URL;

app.listen(port, () => console.log(`Listening on port ${port}... mongo URI: ${mongoUri}, song service URL: ${songServiceUrl}`));
