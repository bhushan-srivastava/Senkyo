import dotenv from "dotenv"
import express from "express"

import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config()

const server = express();

// middleware
server.use(express.json());



/* production client build folder */
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

server.use(express.static(path.join(__dirname, './client/build')))

server.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

const port = process.env.PORT || 8080

server.listen(port, () => { console.info(`listening on port ${port}`) })