const Chess = require('chess.js').Chess;

const uciToSan = (uci) => {
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.length === 5 ? uci[4] : undefined;

    const move = {
        from: from,
        to: to,
    };

    if (promotion) {
        move.promotion = promotion;
    }
    return move;
};

module.exports = uciToSan