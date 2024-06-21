// const {handleUserMove, handleComputerMove} = require('../../controllers/moveController');
const {createNewGame, makeMove} = require('../../controllers/gameController');
const {handleComputerMove, handleUserMove} = require('../../controllers/moveController');
const {getGameState} = require('../../utils/gameState');
const redisClient = require('../../services/redisClient');
const chess = require('chess.js');
const {server} = require('../../app');

jest.mock('../../controllers/moveController');
jest.mock('../../utils/gameState');

describe("Testing GameController", () => {
    beforeAll(done => {
        if (!server.listening) {
            server.listen(process.env.TEST_PORT, done);
        } else {
            done();
        }
    }, 10000);

    afterAll(done => {
        if (server.listening) {
            server.close(done);
        } else {
            done();
        }
        redisClient.quit();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("createNewGame", async () => {
        const mockChessInstance = new chess.Chess();
        const mockInitialFen = mockChessInstance.fen();

        const newGame = await createNewGame();

        expect(newGame).toHaveProperty('initialFen', mockInitialFen);
        expect(newGame).toHaveProperty('instanceId', expect.any(Number));
        expect(newGame.chessInstance).toBeInstanceOf(chess.Chess)
    })

    test("makeMove", async () => {
        // const mockId = Date.now();

        const mockUserMoveFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
        const mockComputerMoveFen = 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2';

        const newGame = await createNewGame();

        getGameState.mockResolvedValue({fen: newGame.initialFen});
        handleUserMove.mockResolvedValue({ status: 'user_move_done', fen: mockUserMoveFen });
        handleComputerMove.mockResolvedValue({ status: 'computer_move_done', fen: mockComputerMoveFen });

        const result = await makeMove(newGame.instanceId, 'e2e3', 10);
        expect(result).toHaveProperty('status', 'computer_move_done');
        expect(result).toHaveProperty('fen', mockComputerMoveFen);
    })
})

