import { Request, Response } from "express";
import { joinGame, makeMove, startGame } from "../models/session";


function startGameController(req: Request, res: Response) {
    const response = startGame()

    res.send(response)
}

function gameStateController(req: Request, res: Response) {
    const { sessionId } = req.body
    try {
        const game = joinGame(sessionId)

        res.send(game)
    } catch (e) {
        res.status(400).send({ error: "Invalid Session" })
    }
}

function moveController(req: Request, res: Response) {
    const { sessionId, move } = req.body
    try {
        makeMove(sessionId, move)

        res.status(200).send()
    } catch (e) {
        res.status(400).send({ error: "Error submitting move" })
    }
}

export {
    startGameController,
    gameStateController,
    moveController
}
