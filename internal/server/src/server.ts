import express, { Request } from "express"
import { gameStateController, moveController, startGameController } from "./controllers/gameController"
import cors from 'cors'

const server = express()

server.use(cors({ origin: 'http://localhost:5173' }))

server.use(express.json({ limit: '4 mb' }))

server.get('/start', startGameController)

server.post('/game-state', gameStateController)

server.post('/move', moveController)

export {
    server
}