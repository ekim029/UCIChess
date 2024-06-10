
const getEngineMove = async (fen, depth) => {
    const api = `https://stockfish.online/api/s/v2.php?fen=${fen}&depth=${depth}`;
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = getEngineMove;