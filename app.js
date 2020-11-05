const P = require('./server/Player')
const Player = P.Player

const B = require('./server/Player')
const Bullet = B.Bullet

const express = require('express')
const app = express()
const http = require('http').createServer(app)


app.use('/client',express.static(__dirname + '/client'))
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/client/index.html')
})
app.get('/test',(req,res) => {
    res.sendFile(__dirname + '/client/test.html')
})
app.get('/game',(req,res) => {
    res.sendFile(__dirname + '/client/game.html')
})


http.listen(2000)
http.on('listening', () => {
    console.log('Server listen on port 2000')
})

const DEBUG = true

let USERS = {
	//username:password
	"bob":"asd",
	"bob2":"bob",
    "bob3":"ttt",
    "max":"max",	
}

//simulate async

isValidPassword = (data,callback) => {
	setTimeout(()=>{
		callback(USERS[data.username] === data.password)
	},10)
}
isUsernameTaken = (data,callback) => {
	setTimeout(()=>{
		callback(USERS[data.username])
	},10)
}
addUser = (data,callback) => {
	setTimeout(()=>{
		USERS[data.username] = data.password
		callback()
	},10)
}

const SOCKET_LIST = {}

const io = require('socket.io')(http)
io.on('connection', (socket) => {
    socket.id = Math.random()
    SOCKET_LIST[socket.id] = socket

	socket.on('signIn',(data) => {
		isValidPassword(data,(res)=>{
			if(res){
				Player.onConnect(socket)
				socket.emit('signInResponse',{success:true})
			} else {
				socket.emit('signInResponse',{success:false})			
			}
		})
	})
	socket.on('signUp',(data) => {
		isUsernameTaken(data,(res)=>{
			if(res){
				socket.emit('signUpResponse',{success:false});		
			} else {
				addUser(data,()=>{
					socket.emit('signUpResponse',{success:true});					
				});
			}
		});		
	});

    socket.on('disconnect',() => {
        delete SOCKET_LIST[socket.id]
        Player.onDisconnect(socket)
    })
    socket.on('sendMsgToServer',(data) => {
		let playerName = ("" + socket.id).slice(2,7)
		for(let i in SOCKET_LIST){
			SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data)
		}
    })
    
    socket.on('evalServer',(data) => {
		if(!DEBUG)
			return
		let res = eval(data)
		socket.emit('evalAnswer',res)	
	})
})

initPack = {player:[],bullet:[]}
removePack = {player:[],bullet:[]}

setInterval(() => {
	let pack = {
		player:Player.update(),
		bullet:Bullet.update(),
	}
	
	for(let i in SOCKET_LIST){
		let socket = SOCKET_LIST[i];
		socket.emit('init',initPack);
		socket.emit('update',pack);
		socket.emit('remove',removePack);
	}
	initPack.player = [];
	initPack.bullet = [];
	removePack.player = [];
	removePack.bullet = [];
}, 1000/25);