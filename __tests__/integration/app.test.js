const request = require('supertest');
const {app, server} = require('../../app');

describe("Blindfold Chess Integration Test", () => {
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

    afterEach(() => {
        jest.resetAllMocks(); // Reset mocks between tests
    });

    it('Create new game', async () => {
        const response = await request(app).post('/game/new');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('initialFen');
        expect(response.body).toHaveProperty('instanceId');
        instanceId = response.body.instanceId;
    })

    it("Make new move", async () => {
        const response = await request(app)
            .post(`/game/${instanceId}`)
            .send({move: 'e2e4', depth: 10});

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('fen');
    })
})