
const { gameBroadcast } = require("../utils/utils")

const createGame = ({Game, Player, games, players, ws, connections, payload}) => {
    const newGame = new Game()
    console.log(newGame)
    const { playerID, playerName, avatar } = payload
    const creatorPlayer = new Player({ playerID, playerName })
    newGame.addPlayer({playerID: creatorPlayer.playerID, isCreator: true})
    games[newGame.gameID] = newGame

    players[playerID] = creatorPlayer
    connections[creatorPlayer.playerID] = ws
    ws.send(JSON.stringify({ method: "create", payload: { playerID: creatorPlayer.playerID, gameID: newGame.gameID, players: newGame.players.map(playerID => players[playerID])} }))    
}

const joinGame = ({ games, Player, players, ws, connections, payload}) => {
    const { gameID, playerID , playerName, mode, avatar} = payload
    let gameToJoin;
    if (mode === "random") {
        const gamePool = Object.values(games)
        if (gamePool?.length) {gameToJoin = gamePool[0]}
        else return ws.send(JSON.stringify({ method: "join", payload: {status: 404}}))
    }
    else {
        gameToJoin = games[gameID]
    }
    if (!gameToJoin) return ws.send(JSON.stringify({method:"join", payload: { status: 404, message: 'Game not found' }}))
    const newPlayer = new Player({playerID, playerName})
    gameToJoin.addPlayer({playerID : newPlayer.playerID, isCreator: false } )
    const connectionID = newPlayer.playerID
    players[playerID] = newPlayer
    
    connections[connectionID] = ws
    ws.send(JSON.stringify({ method: "join", payload: { playerID: newPlayer.playerID, gameID: gameToJoin.gameID, players: gameToJoin.players} }))
    gameBroadcast(gameToJoin, "waiting-room-update", connections, {players: gameToJoin.players.map(playerID => players[playerID]), gameID: gameToJoin.gameID, playerID})
        
}


const commandReaction = ({ games, ws, connections, payload}) => {
    if (payload?.command === "start") {
        const { gameID } = payload
        const gameToJoin = games[gameID]
        if (!gameToJoin) return ws.send(JSON.stringify({method:"start", payload: { status: 404, message: 'Game not found' }}))
        gameToJoin.state.status = "on"
        gameBroadcast(gameToJoin, "command", connections, {command: "start"})
    }
    else if (payload?.command === "waiting-room-update") {
        const { gameID, playerID } = payload
        const gameToJoin = games[gameID]
        if (!gameToJoin) return ws.send(JSON.stringify({method:"waiting-room-update", payload: { status: 404, message: 'Game not found' }}))
        
        const playerConnection = connections[playerID]
        playerConnection.send(JSON.stringify({ method: "waiting-room-update", payload: {players: gameToJoin.players}}))
    }
}

const playingUpdate = ({ games, ws, payload, players, connections}) => {
    const { gameID } = payload
    const gameToJoin = games[gameID]
    if (!gameToJoin) return ws.send(JSON.stringify({method:"playing-update", payload: { status: 404, message: 'Game not found' }}))
    
    const playersUpdate = gameToJoin.players.map( playerID => players[playerID] )
    gameBroadcast(gameToJoin, "playing-update", connections, {players: playersUpdate})
}

const playing = ({ games, players, ws, connections, payload}) => {
    const { gameID, playerID, isCorrect } = payload
    const gameToJoin = games[gameID]
    if (!gameToJoin) return ws.emit(JSON.stringify({method:"play", payload: { status: 404, message: 'Game not found' }}))
    
    const player = players[playerID]
    player.playerScore += isCorrect
    player.played = true

    const connection = connections[playerID]
    // connection.send(JSON.stringify({ method: "play", payload: {}}))

    const playersUpdate = gameToJoin.players.map( playerID => players[playerID] )
    const allPlayed = playersUpdate.every(player => player.played === true)
    allPlayed && console.log('all played')
    if (!allPlayed) return
    
    playersUpdate.sort((playerA, playerB) => playerA.playerScore - playerB.playerScore).reverse()
    playersUpdate.forEach((player, index) => {player.playerRank = index + 1})
    console.log("---------- all players played", playersUpdate)
    
    gameBroadcast(gameToJoin, "playing-update", connections, {players: playersUpdate})

    Object.values(players).forEach(player => { player.played = false })
}

module.exports = {
    createGame,
    joinGame,
    commandReaction,
    playingUpdate,
    playing
}