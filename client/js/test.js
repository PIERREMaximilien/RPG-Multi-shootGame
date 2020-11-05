const WIDTH = 500
const HEIGHT = 500
const socket = io()


//Sign
const signDiv = document.getElementById('signDiv');
const signDivUsername = document.getElementById('signDiv-username');
const signDivSignIn = document.getElementById('signDiv-signIn');
const signDivSignUp = document.getElementById('signDiv-signUp');
const signDivPassword = document.getElementById('signDiv-password');

socket.on('signInResponse', (data) => {
    if(data.success){
        signDiv.style.display = 'none'
        gameDiv.style.display = 'inline-block'
    } else
        alert("Sign in unsuccessul.")
})
socket.on('signUpResponse', (data) => {
    if(data.success){
        alert("Sign up successul.")
    } else
        alert("Sign up unsuccessul.")
})

signDivSignIn.addEventListener('click', () => { 
    socket.emit('signIn',{username:signDivUsername.value,password:signDivPassword.value});
})
signDivSignUp.addEventListener('click', () => {
    socket.emit('signUp',{username:signDivUsername.value,password:signDivPassword.value});
})

//Chat
const chatText = document.getElementById('chat-text')
const chatInput = document.getElementById('chat-input')
const chatForm = document.getElementById('chat-form')

socket.on('addToChat', (data) => {
    chatText.innerHTML += "<div>" + data + "</div>"   
})
socket.on('evalAnswer', (data) => {
   console.log(data)
})

chatForm.addEventListener('submit', (event) => {
    event.preventDefault()
    if(chatInput.value[0] === '/')
        socket.emit('evalServer',chatInput.value.slice(1))
    else
        socket.emit('sendMsgToServer',chatInput.value)
    chatInput.value = ''
})

//Game
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.font = '30px Arial'

const Img = {}
Img.set = () => {
    Img.player = {}
    Img.player.gun = new Image()
    Img.player.gun.src = "client/img/player/gun.png"
    Img.player.rifle = new Image()
    Img.player.rifle.src = "client/img/player/rifle.png"
    Img.player.shootgun = new Image()
    Img.player.shootgun.src = "client/img/player/shootgun.png"
    Img.enemy = new Image()
    Img.enemy.src = 'client/img/enemy.png'
    Img.bullet = new Image()
    Img.bullet.src = 'client/img/bullet.png'
    Img.desertEagle = new Image()
    Img.desertEagle.src = 'client/img/weapon/desertEagle.png'
    Img.shootgun = new Image()
    Img.shootgun.src = 'client/img/weapon/shootgun.png'
    Img.ak47 = new Image()
    Img.ak47.src = 'client/img/weapon/ak47.png'
    Img.machinegun = new Image()
    Img.machinegun.src = 'client/img/weapon/machinegun.png'
    Img.usi = new Image()
    Img.usi.src = 'client/img/weapon/usi.png'
}
Img.set()

class Player {
    constructor(initPack) {
    this.id = initPack.id;
    this.number = initPack.number;
    this.x = initPack.x;
    this.y = initPack.y;
    this.hp = initPack.hp;
    this.hpMax = initPack.hpMax;
    this.score = initPack.score;
    }
    
    draw() {	
        let x = this.x - Player.list[selfId].x + WIDTH/2
        let y = this.y - Player.list[selfId].y + HEIGHT/2
        
        let hpWidth = 30 * this.hp / this.hpMax
        ctx.fillStyle = 'red'
        ctx.fillRect(x - hpWidth/2,y - 40,hpWidth,4)
        
        let width = 85
        let height = 50
        
        
        ctx.drawImage(Img.player.gun,
            0,0,Img.player.gun.width,Img.player.gun.height,
            x-width/2,y-height/2,85,50)
        
        //ctx.fillText(this.score,this.x,this.y-60);
    }
}
Player.list = {}

class Bullet {
    constructor(initPack) {
        this.id = initPack.id;
        this.x = initPack.x;
        this.y = initPack.y; 
    }
    
    draw() {			
        let width = 10
        let height = 10
        
        let x = this.x - Player.list[selfId].x + WIDTH/2;
        let y = this.y - Player.list[selfId].y + HEIGHT/2;
        
        ctx.drawImage(Img.bullet,
            0,0,Img.bullet.width,Img.bullet.height,
            x-width/2,y-height/2,10,10);
    }
}
Bullet.list = {};

let selfId = null

socket.on('init',(data) => {
    if(data.selfId)
        selfId = data.selfId;
    //{ player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], bullet: []}
    for(let i = 0 ; i < data.player.length; i++){
        let player = new Player(data.player[i])
        Player.list[data.player[i].id] = player
    }
    for(let i = 0 ; i < data.bullet.length; i++){
        let bullet = new Bullet(data.bullet[i])
        Bullet.list[data.bullet[i].id] = bullet
    }
})
socket.on('update',(data) => {
    //{ player : [{id:123,x:0,y:0},{id:1,x:0,y:0}], bullet: []}

    for(let i = 0 ; i < data.player.length; i++){
        let pack = data.player[i]
        let p = Player.list[pack.id]
        if(p){
            if(pack.x !== undefined)
                p.x = pack.x
            if(pack.y !== undefined)
                p.y = pack.y
            if(pack.hp !== undefined)
                p.hp = pack.hp
            if(pack.score !== undefined)
                p.score = pack.score
        }
    }
    for(let i = 0 ; i < data.bullet.length; i++){
        let pack = data.bullet[i]
        let b = Bullet.list[pack.id];
        if(b){
            if(pack.x !== undefined)
                b.x = pack.x
            if(pack.y !== undefined)
                b.y = pack.y
        }
    }
});
socket.on('remove',(data) => {
    //{player:[12323],bullet:[12323,123123]}
    for(let i = 0 ; i < data.player.length; i++){
        delete Player.list[data.player[i]]
    }
    for(let i = 0 ; i < data.bullet.length; i++){
        delete Bullet.list[data.bullet[i]]
    }
})

setInterval(() => {
    if(!selfId)
        return
    ctx.clearRect(0,0,500,500)
    //drawMap()
    //drawScore()
    for(let i in Player.list)
        Player.list[i].draw()
    for(let i in Bullet.list)
        Bullet.list[i].draw()
},40)

addEventListener('keydown', (event) => {
    if(event.key === 'd')
        socket.emit('keyPress',{inputID:'right',state:true})
    else if (event.key === 'q')
        socket.emit('keyPress',{inputID:'left',state:true})
    else if (event.key === 'z')
        socket.emit('keyPress',{inputID:'up',state:true})
    else if (event.key=== 's')
        socket.emit('keyPress',{inputID:'down',state:true})
})
addEventListener('keyup', (event) => {
    if(event.key === 'd')
        socket.emit('keyPress',{inputID:'right',state:false})
    else if (event.key === 'q')
        socket.emit('keyPress',{inputID:'left',state:false})
    else if (event.key === 'z')
        socket.emit('keyPress',{inputID:'up',state:false})
    else if (event.key === 's')
        socket.emit('keyPress',{inputID:'down',state:false})
})

addEventListener('mousedown', (event) => {
    if(event.button === 0)
        socket.emit('keyPress',{inputID:'attack',state:true})
})
addEventListener('mouseup', (event) => {
    if(event.button === 0)
        socket.emit('keyPress',{inputID:'attack',state:false})
})
addEventListener('mousemove', (event) => {
    let mouseX = event.clientX - document.querySelector('canvas').getBoundingClientRect().left
	let mouseY = event.clientY - document.querySelector('canvas').getBoundingClientRect().top
	
	mouseX -= WIDTH/2
    mouseY -= HEIGHT/2
    
    let angle = Math.atan2(mouseY,mouseX) / Math.PI * 180
    socket.emit('keyPress',{inputID:'mouseAngle',state:angle}) 
})