import dotenv from "dotenv"
import express from "express"

import path from 'path'
import { fileURLToPath } from 'url';

import cookieParser from "cookie-parser"

import mongoose from "mongoose"


import authRouter from "./routers/auth/auth.router.js"
import voterRouter from "./routers/voter/voter.router.js";
import electionRouter from "./routers/election/election.router.js"

import scheduleElections from './controllers/election/electionScheduler.js'

dotenv.config()

const server = express();

// middleware
server.use(express.json());
server.use(cookieParser());


/* production client build folder */
if (process.env.NODE_ENV === 'production') {
    const __filename = fileURLToPath(import.meta.url);

    const __dirname = path.dirname(__filename);

    server.use(express.static(path.join(__dirname, './client/build')))

    server.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
}

//handling routes
server.use('/api/auth', authRouter);
server.use('/api/voters', voterRouter);
server.use('/api/elections', electionRouter);

const port = process.env.PORT || 8080


mongoose.set('strictQuery', true);
// mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connect(process.env.CONNECTION_STRING)

    .then(async () => {
        console.log('Database is connected')

        await scheduleElections()

        server.listen(port, () => { console.info(`listening on port ${port}`) })
    })
    .catch((err) => console.log("ERROR in Database connection: ", err))

