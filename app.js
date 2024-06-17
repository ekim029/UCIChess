const express = require('express');
require('dotenv').config();
const {createNewGame, makeMove} = require('./controllers/gameController');
const app = express();

app.use(express.json());

app.post('/game/new', async (req, res) => {
    try {
        const newGame = await createNewGame();
        res.json(newGame.instanceId);
    } catch (err) {
        res.status(404).send(err);
    }
})

app.post('/game/:id', async (req, res) => {
    const { id } = req.params;
    const { move, depth } = req.body;

    try {
        const result = makeMove(id, move, depth);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).send(err);
    }
})


app.listen(process.env.PORT, () => {
    console.log(`Connected to port ${process.env.PORT}`);
})