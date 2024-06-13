const {updateGameState} = require('../utils/gameState');
const {handleUserMove, handleComputerMove} = require('./moveController');
const chess = require('chess.js');

const createNewGame = async () => {
     const chessInstance = chess.Chess();
     const initialFen = chessInstance.fen();
     const instanceId = Date.now();

     await updateGameState(instanceId, initialFen, null);
     console.log("New game created");
     return {initialFen, instanceId, chessInstance};
}

const makeMove = async (id, userMove, depth, instance) => {
     const userMove = await handleUserMove(id, userMove, instance);
     if (userMove.status === 'game_over') {
          return userMove;
     }

     const computerMove = await handleComputerMove(id, depth, instance);
     if (computerMove.status === 'game_over') {
          return computerMove;
     }

     return computerMove;
}

module.exports = {
     createNewGame,
     makeMove
}