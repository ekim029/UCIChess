const {updateGameState} = require('../utils/gameState');
const getEngineMove = require('../services/chessApi');
const convert = require('../utils/convertUCISAN');

const handleUserMove = async (id, userMove, instance) => {
    try {
        const convertMove = convert(userMove);
        const validMove = instance.move(convertMove);
        if (!validMove) {
            throw new Error("Invalid move");
        }
        const newFen = instance.fen();
        await updateGameState(id, newFen, convertMove, false);

        if (instance.isGameOver() || instance.isStalemate() || instance.isThreefoldRepetition()) {
            return { status: 'game_over', result: instance.result() };
        }
        return { status: 'user_move_done', fen: newFen };
    } catch (err) {
        console.log(err);
    }
}


const handleComputerMove = async (id, depth, instance) => {
    try {
        const fen = instance.fen();
        const data = await getEngineMove(fen, depth);

        const computerMove = data.bestmove.split(' ')[1];
        instance.move(computerMove);

        const newFen = instance.fen();
        updateGameState(id, newFen, computerMove, true);

        if (instance.isGameOver() || instance.isStalemate() || instance.isThreefoldRepetition()) {
            return { status: 'game_over', result: instance.result() };
        }
        return { status: 'computer_move_done', fen: newFen, move: computerMove };
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    handleUserMove,
    handleComputerMove
}