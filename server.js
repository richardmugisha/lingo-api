const express = require('express');
const cards = require('./routes/cards');
const connectDB = require('./db/connect');
const cors = require('cors')
require('dotenv').config()

const app = express();

// middleware 
app.use(cors())
app.use(express.json());

// routes
app.get('/cardHome/:msg', (req, res) => {
    res.send(req.params.msg)
})


app.use('/api/v1/cards', cards)

const port = 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`listening on ${port}`))
    } catch (error) {
        console.log(error);
        return
    }
}

start()