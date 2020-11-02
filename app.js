const P = require('./server/Player')
const Player = P.Player

const B = require('./server/Bullet')
const Bullet = B.Bullet


const express = require('express')
const app = express()
const http = require('http').createServer(app)


app.use('/public',express.static(__dirname + '/public'))
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/index.html')
})
app.get('/test', function(req,res) {
    res.sendFile(__dirname + '/public/test.html')
})
app.get('/game',(req,res) => {
    res.sendFile(__dirname + '/public/game.html')
})


http.listen(2000)
http.on('listening', () => {
    console.log('Server listen on port 2000')
})


const SOCKET_LIST = {}

const io = require('socket.io')(http)
io.on('connection', (socket) => {
    socket.id = Math.random()
    SOCKET_LIST[socket.id] = socket

    Player.onConnect(socket)

    socket.on('disconnect',()=> {
        delete SOCKET_LIST[socket.id]
        Player.onDisconnect(socket)
    })
})

setInterval(() => {
    let pack = {
        player:Player.update(),
        bullet:Bullet.update()
    }
    for(let i in SOCKET_LIST) {
        let socket = SOCKET_LIST[i]
        socket.emit('newposition',pack)
    }

}, 1000/25);