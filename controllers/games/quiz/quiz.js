
const { getWebSocketServer } = require("../../../websocket")

const avatars = [
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702185/Flashcards/avatars/brandon-zacharias-ITo4f_z3wNM-unsplash_dkbftg.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702184/Flashcards/avatars/oguz-yagiz-kara-uTlMt9o7SHE-unsplash_syoyny.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702183/Flashcards/avatars/oguz-yagiz-kara-p_cgt8XJ1W4-unsplash_m8juzj.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702183/Flashcards/avatars/fatane-rahimi-Agv-xPQBO60-unsplash_r1rjiy.jpg",
    "https://res.cloudinary.com/dtkxmg1yk/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1733702183/Flashcards/avatars/alex-suprun-ZHvM3XIOHoE-unsplash_lgxi6w.jpg"
]

class Player {
    static ID = 0;
    constructor ({playerName, playerID, avatar}) {
        this.playerID = playerID;
        this.playerScore = 0;
        this.playerRank = 0;
        this.playerName = playerName || "anonymous"
        this.playerAvatar = avatar || Player.availableAvatars.pop() || avatars[0]
    }
    static availableAvatars = [...avatars]
}

class Game {
    static ID = 0
    static MAX_PLAYER_COUNT = 5
    constructor () {
        this.gameID = generateId(Game.ID++)
        this.creator = ""
        this.players = []
        this.player_count = this.players.length
        this.state = {
            status: "waiting"
        }
    }

    addPlayer ({ playerID = "", isCreator = false }) {
        if (isCreator) this.creator = playerID
        this.players.push(playerID)
        this.player_count = this.players.length
    }

}

const games = {}

const connections = {}
const plays = {}

const players = {}

const wss = getWebSocketServer()

wss.on("connection", (ws) => {
    console.log('Client connected via web socket');

    ws.on("message", (message) => {
        const response = JSON.parse(message)
        const { method, payload } = response
        console.log("........... method: ", method)
        if (method === "create") {
            const newGame = new Game()
            const { playerID, playerName, avatar } = payload
            const creatorPlayer = new Player({ playerID, playerName })
            newGame.addPlayer({playerID: creatorPlayer.playerID, isCreator: true})
            games[newGame.gameID] = newGame

            players[playerID] = creatorPlayer
            connections[creatorPlayer.playerID] = ws
            console.log("============ new game baby")
            ws.send(JSON.stringify({ method: "create", payload: { playerID: creatorPlayer.playerID, gameID: newGame.gameID, players: newGame.players.map(playerID => players[playerID])} }))
        }
        
        else if (method === "join") {
            console.log('--------- trying to join')
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

            gameBroadcast(gameToJoin, "waiting-room-update", {players: gameToJoin.players.map(playerID => players[playerID]), gameID: gameToJoin.gameID, playerID})
        }

        else if (method === "command") {
            if (payload?.command === "start") {
                const { gameID } = payload
                const gameToJoin = games[gameID]
                console.log(gameToJoin, gameID, games)
                if (!gameToJoin) return ws.send(JSON.stringify({method:"start", payload: { status: 404, message: 'Game not found' }}))
                
                gameToJoin.state.status = "on"
                
                gameBroadcast(gameToJoin, "command", {command: "start"})
            }
            else if (payload?.command === "waiting-room-update") {
                const { gameID, playerID } = payload
                const gameToJoin = games[gameID]
                if (!gameToJoin) return ws.send(JSON.stringify({method:"waiting-room-update", payload: { status: 404, message: 'Game not found' }}))
                
                const playerConnection = connections[playerID]
                playerConnection.send(JSON.stringify({ method: "waiting-room-update", payload: {players: gameToJoin.players}}))
            }
        }

        else if (method === "playing-update") {
            console.log("...... requesting playing-update")
            const { gameID } = payload
            const gameToJoin = games[gameID]
            if (!gameToJoin) return ws.send(JSON.stringify({method:"playing-update", payload: { status: 404, message: 'Game not found' }}))
            
            const playersUpdate = gameToJoin.players.map( playerID => players[playerID] )
            gameBroadcast(gameToJoin, "playing-update", {players: playersUpdate})
        }

        else if (method === "play") {
            const { gameID, playerID, isCorrect } = payload
            plays[playerID] = (plays[playerID] || 0) + 1
            console.log(playerID, "-------played ->  total:", plays[playerID])
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
            
            gameBroadcast(gameToJoin, "playing-update", {players: playersUpdate})

            Object.values(players).forEach(player => { player.played = false })
        }
        
    })

    ws.on("close", () => {
        console.log('Client disconnected')
    })
})

function generateId(number) {
    // Ensure the number is within the valid range for 4 characters in base-36
    if (number < 0 || number > 1679615) { // 36^4 - 1 = 1679615
      throw new Error("Number out of range for 4-character ID.");
    }
    // Convert the number to base-36 and pad it to ensure 4 characters
    return number.toString(36).toUpperCase().padStart(4, '0');
  }
  
const gameBroadcast = (game, method, payload) => {
    game.players.forEach(playerID => {
        const playerConnection = connections[playerID]
        playerConnection.send(JSON.stringify({ method, payload}))
    })
}