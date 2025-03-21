const mongoose = require('mongoose');
const redisClient = require('../services/redisClient');
const User = require('../model/user');

const handleGameOver = async (userId, id, instance) => {
    const result = instance.result();

    let winner = null;
    if (result == '1-0') {
        winner = 'player';
    } else if (result == '0-1') {
        winner = 'computer';
    } else {
        winner = 'draw';
    }

    const finalFen = instance.fen();
    const moves = await redisClient.lRange(`${id}:moves`, 0, -1);
    await saveGameToDatabase(userId, id, finalFen, moves, winner);

    await redisClient.del(`${id}:fen`);
    await redisClient.del(`${id}:moves`);
}

const saveGameToDatabase = async (userId, id, finalFen, moves, winner) => {
    try {
        const user = await User.findById(userId);
        const game = {
            id: id,
            finalFen: finalFen,
            result: winner,
            moves: moves,
            createdAt: new Date()
        }
        user.game.push(game);
        await user.save();
    } catch (err) {
        console.log(err);
    }
}

module.exports = handleGameOver;