import { randomUUID, setFips } from "crypto"

type Move = 'X' | 'O' | ""

type Player = 'X' | 'O'

interface Session {
    moves: Array<Move>;
    playersTurn: Player;
    playerWon: undefined | Player
}

type Sessions = {
    [k: string]: Session
}

const nextTurnMap = {
    'X': 'O' as Player,
    'O': 'X' as Player,
}

const sessions: Sessions = {} // ex {"someid": ["", ""]}

function startGame() {
    const sessionId = randomUUID().toString()

    const gameState: Move[] = ["", "", "", "", "", "", "", "", ""]

    const playerMove: Player = 'X'

    const sessionData = {
        moves: gameState,
        playersTurn: playerMove,
        playerWon: undefined
    }

    sessions[sessionId] = sessionData

    return {
        sessionId,
        gameState: sessionData
    }
}

function joinGame(sessionId: string) {
    const currentGame = sessions[sessionId]
    if (!currentGame) {
        throw new Error("Game does not exist")
    }

    return {
        sessionId,
        gameState: currentGame
    }
}

function makeMove(sessionId: string, move: number) {
    const currentGame = sessions[sessionId]
    if (!currentGame) {
        throw new Error("Game does not exist")
    }

    if (currentGame.moves[move] !== "") {
        throw new Error("Move has already been made")
    }

    currentGame.moves[move] = currentGame.playersTurn

    const iswon = checkGameWon(currentGame.moves, currentGame.playersTurn)

    if (iswon) {
        currentGame.playerWon = currentGame.playersTurn
    }

    currentGame.playersTurn = nextTurnMap[currentGame.playersTurn]
}

// 0, 1, 2
// 3, 4, 5
// 6, 7, 8

const GAME_WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

function checkGameWon(moves: Move[], currentPlayer: Player): boolean {
    for (const combo of GAME_WINNING_COMBOS) {
        const [i1, i2, i3] = combo

        const isWin = moves[i1] === moves[i2] && moves[i2] === moves[i3] && moves[i1] === currentPlayer

        if (isWin) {
            return isWin
        }
    }

    return false
}

function calculateWinningCombos(gridWidth: number) {
    const winningCombos = []

    // deduce indices for rows/columns
    for (var startIndex = 0; startIndex < gridWidth; startIndex++) {
        const row = []
        const column = []
        for (var segmentIndex = 0; segmentIndex < gridWidth; segmentIndex++) {
            row.push(startIndex * gridWidth + segmentIndex)
            column.push(startIndex + segmentIndex * gridWidth)
        }
        winningCombos.push(row, column)
    }

    // handle the 2 diagonals
    const diag1 = []
    const diag2 = []
    for (var startIndex = 0; startIndex < gridWidth; startIndex++) {
        const d1Index = startIndex * gridWidth + startIndex
        const d2Index = gridWidth ** 2 - gridWidth - startIndex * (gridWidth - 1)

        diag1.push(d1Index)
        diag2.push(d2Index)
    }

    winningCombos.push(diag1, diag2)


    console.log(winningCombos)
}

calculateWinningCombos(5)

export {
    startGame,
    joinGame,
    makeMove
}