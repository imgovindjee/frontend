export default function CheckWinner(gameState, setFinishedArrayState) {
    // row checks
    for (let row = 0; row < gameState.length; row++) {
        if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
            setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
            return gameState[row][0];
        }
    }

    // column checks
    for (let col = 0; col < gameState.length; col++) {
        if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
            setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
            return gameState[0][col];
        }
    }

    // diagonal checks
    if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
        setFinishedArrayState([0, 4, 8]);
        return gameState[0][0];
    }
    if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
        setFinishedArrayState([2, 4, 6]);
        return gameState[2][0];
    }

    // Draw game
    const isDrawMatch = gameState.flat().every((ele) => {
        if (ele === 'circle' || ele === "cross") {
            return true;
        }
    });
    if (isDrawMatch) {
        return "draw";
    }

    return null;
}