const {updateGameState, getGameState} = require('../utils/gameState');
const {handleUserMove, handleComputerMove} = require('./moveController');
const chess = require('chess.js');

const createNewGame = async () => {
     try {
          const chessInstance = new chess.Chess();
          const initialFen = chessInstance.fen();
          const instanceId = Date.now();
     
          await updateGameState(instanceId, initialFen, null);
          console.log("New game created");
          return {initialFen, instanceId, chessInstance};
     } catch (err) {
          console.log(err);
     }
     
}

const makeMove = async (id, move, depth) => {
     try {
          const gameState = await getGameState(id);
          const instance = new chess.Chess(gameState.fen);

          const userMove = await handleUserMove(id, move, instance);
          if (userMove.status === 'game_over') {
               await redisClient.del(`${id}:fen`);
               await redisClient.del(`${id}:moves`);
               return userMove;
          }
     
          const computerMove = await handleComputerMove(id, depth, instance);
          if (computerMove.status === 'game_over') {
               await redisClient.del(`${id}:fen`);
               await redisClient.del(`${id}:moves`);
               return computerMove;
          }
          return computerMove;

     } catch (err) {
          console.log(err);
     }
}

module.exports = {
     createNewGame,
     makeMove
}