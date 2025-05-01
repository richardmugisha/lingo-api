import express from "express"
import http from "http"
import topic from "./routes/personal/topic.js"
import words from "./routes/personal/words.js"
import batchRequest from "./routes/personal/batchRequest.js"
import fyp from "./routes/personal/fyp.js"
import network from "./routes/network/index.js";

import connectDB from "./db/connect.js";
import cors from "cors"
import dotenv from "dotenv"


dotenv.config()

import  { authRoutes, verifyToken} from './routes/personal/auth.js'

// import "./controllers/games/game"

import openaiTest from "./routes/personal/openaiTest.js"

import extension from "./routes/personal/extension.js"



const app = express();
const server = http.createServer(app)
network.start(server)

// middleware 
app.use(cors())
app.use(express.json());


// Protect routes that need authentication with verifyToken
app.use('/api/v1/protected-route', verifyToken, (req, res) => {
    res.json({ message: 'Access granted to protected route' });
});

app.use('/api/v1/extension', extension)

app.use('/api/v1/cards/test/openaiApi', openaiTest);
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/batch-request', batchRequest)
app.use('/api/v1/cards', topic)
app.use('/api/v1/words', words)
app.use('/api/v1/fyp', fyp)


const port = process.env.PORT || 3500;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        server.listen(port, () => console.log(`listening on ${port}`))
    } catch (error) {
        console.log(error);
        return
    }
}

start()
