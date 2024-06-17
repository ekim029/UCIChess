const redisClient = require('../services/redisClient');


const updateGameState = async (id, fen, newMove, isComputerMove = false) => {
    try {
        const jsonMoves = await redisClient.get(`${id}:moves`);
        const moves = jsonMoves ? JSON.parse(jsonMoves) : [];

        moves.push({
            move: newMove,
            by: isComputerMove ? "computer" : "user"
        })

        await redisClient.set(`${id}:moves`, JSON.stringify(moves));
        await redisClient.set(`${id}:fen`, fen);

    } catch (err) {
        console.log(err);
    }
}


const getGameState = async (id) => {
    try {
        const fen = await redisClient.get(`${id}:fen`);
        const jsonMoves = await redisClient.get(`${id}:moves`);
        const moves = jsonMoves ? JSON.parse(jsonMoves) : [];

        return {fen, moves};

    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    updateGameState,
    getGameState
}