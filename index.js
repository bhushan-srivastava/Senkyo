import dotenv from "dotenv"
import express from "express"

import path from 'path'
import { fileURLToPath } from 'url';

import mongoose from "mongoose"


import authRouter from "./routes/auth/auth.router.js"

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

//handling routes
server.use('/auth', authRouter);

const port = process.env.PORT || 8090


mongoose.set('strictQuery', true);
// mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connect(process.env.CONNECTION_STRING)

    .then(() => {
        console.log('Database is connected')
        server.listen(port, () => { console.info(`listening on port ${port}`) })

    })
    .catch((err) => console.log("ERROR in Database connection: ", err))

