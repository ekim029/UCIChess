// const {handleUserMove, handleComputerMove} = require('../../controllers/moveController');
const {createNewGame, makeMove} = require('../../controllers/gameController');
const chess = require('chess.js');
const {server} = require('../../app');

jest.mock('../../controllers/moveController');
jest.mock('../../utils/gameState');

describe("Testing GameController", () => {
    beforeAll(done => {
        if (!server.listening) {
            server.listen(process.env.PORT, done);
        } else {
            done();
        }
    });

    afterAll(done => {
        if (server.listening) {
            server.close(done);
        } else {
            done();
        }
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("createNewGame", async () => {
        const mockChessInstance = new chess.Chess();
        const mockInitialFen = mockChessInstance.fen();
        const mockInstanceId = Date.now();

        const newGame = await createNewGame();

        expect(newGame).toHaveProperty('initialFen', mockInitialFen);
        expect(newGame).toHaveProperty('instanceId', mockInstanceId);
        expect(newGame.chessInstance).toBeInstanceOf(chess.Chess)
    })

    test("makeMove", () => {
        const mockId = Date.now();
        const mockFen = 'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2';

        handleUserMove.mockResolvedValue({ status: 'user_move_done', fen: mockFen });
        handleComputerMove.mockResolvedValue({ status: 'computer_move_done', fen: mockFen });

        const result = makeMove(mockId, 'e2e4', 10);

        expect(result).toHaveProperty('status', 'computer_move_done');
        expect(result).toHaveProperty('fen', mockFen);
    })
})

