const express = require('express');
require('dotenv').config();
const {createNewGame, makeMove} = require('./controllers/gameController');
const {registerUser, loginUser} = require('./controllers/userController');
const app = express();
const connectDB = require('./db/db');
connectDB();

app.use(express.json());

app.post('/user/register',registerUser);

app.post('/user/login',loginUser);

app.post('/game/new', async (req, res) => {
    try {
        const newGame = await createNewGame();
        res.status(200).json(newGame);
    } catch (err) {
        res.status(404).send(err);
    }
})

app.post('/game/:id', async (req, res) => {
    const { id } = req.params;
    const { move, depth } = req.body;

    try {
        const result = await makeMove(id, move, depth);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).send(err);
    }
})


const server = app.listen(process.env.PORT || process.env.TEST_PORT, () => {
    console.log(`Connected to port ${process.env.PORT}`);
})

module.exports = {
    app, server
}