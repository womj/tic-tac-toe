import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [playerSymbol, setPlayerSymbol] = useState('')
  const [sessionIdInput, setSessionIdInput] = useState("")
  const [gameData, setGameData] = useState<any>(null)
  const [sessionId, setSessionId] = useState("")
  const [isMyTurn, setIsMyTurn] = useState(false)

  const handleStartGame = async () => {
    const result = await axios.get('http://localhost:3000/start')
    setPlayerSymbol('O')
    setSessionId(result.data.sessionId)
    setIsMyTurn(false)
    setGameData(result.data.gameState)
  }

  const handleJoinGame = async () => {
    setSessionId(sessionIdInput)
    setSessionIdInput('')
    setPlayerSymbol('X')
    setIsMyTurn(true)
    getGameState(sessionIdInput)
  }

  const handleMove = async (index: number) => {
    if (!isMyTurn) {
      alert("not your turn")
      return
    }
    setIsMyTurn(false)
    const tempGameState = { ...gameData }

    tempGameState.moves[index] = playerSymbol

    setGameData(tempGameState)

    axios.post('http://localhost:3000/move', { sessionId, move: index })
  }

  const getGameState = async (sessionId: string) => {
    const result = await axios.post('http://localhost:3000/game-state', { sessionId })
    setGameData(result.data.gameState)

    if (result.data.gameState.playersTurn === playerSymbol) {
      setIsMyTurn(true)
    }

    if (result.data.gameState.playerWon) {
      setIsMyTurn(false)
    }
  }

  useEffect(() => {
    if (!gameData || isMyTurn) {
      return
    }

    const pollingInterval = 1000;

    const intervalId = setInterval(() => {
      getGameState(sessionId);
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [isMyTurn, gameData]);

  console.log("rendered", isMyTurn, playerSymbol, gameData)

  return (
    <>
      <h1>{sessionId}</h1>
      <button onClick={handleStartGame}>Start Game</button>

      <div>
        <input placeholder='Session Id' type='text' value={sessionIdInput} onChange={(e) => { setSessionIdInput(e.target.value) }}></input>
        <button onClick={handleJoinGame}>Join Game</button>
      </div>

      {gameData && (
        <div id='GameDiv' className='grid-container'>
          {gameData.moves.map(((move: string, idx: number) => {
            return (
              <div className='grid-item' onClick={() => {
                handleMove(idx)
              }}>{move ?? " "}</div>
            )
          }))}
        </div >)

      }
      {gameData?.playerWon && (<h1> {`${gameData?.playerWon} wins!`}</h1>)}
    </>
  )
}

export default App
