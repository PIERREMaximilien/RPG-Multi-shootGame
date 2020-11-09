const E = require('./Entity')
const Entity = E.Entity


class Player extends Entity {
    constructor(id) {
        super()
        this.id = id
        this.width = 20
        this.height = 20
        this.pressingRight = false
        this.pressingLeft = false
        this.pressingUp = false
        this.pressingDown = false
        this.pressingAttack = false
        this.mouseAngle = 0
        this.maxSpd = 10
        this.hp = 100
        this.hpMax = 100
        this.score = 0
        this.atkCounter = 0
    }
    
    update() {
        this.updateSpd()
        super.update()

        if(this.pressingAttack) {
            this.shootBullet(this.mouseAngle)
        }
    }

    shootBullet = (angle) => {
        let bullet = new Bullet(angle,this.id,10)
        bullet.x = this.x;
		bullet.y = this.y;
        Bullet.list[bullet.id] = bullet
        initPack.bullet.push(bullet.getInitPack())
    }

    updateSpd() {
        if(this.pressingRight)
            this.spdX = this.maxSpd
        else if(this.pressingLeft)
            this.spdX = -this.maxSpd
        else
            this.spdX = 0
        if(this.pressingUp)
            this.spdY = -this.maxSpd
        else if(this.pressingDown)
            this.spdY = this.maxSpd
        else 
            this.spdY = 0
    }

    getInitPack = () => {
		return {
			id:this.id,
			x:this.x,
			y:this.y,	
			number:this.number,	
			hp:this.hp,
			hpMax:this.hpMax,
			score:this.score,
		};		
	}
	getUpdatePack = () => {
		return {
			id:this.id,
			x:this.x,
			y:this.y,
			hp:this.hp,
			score:this.score,
		}	
	}
}
Player.onConnect = (socket) => {
    let player = new Player(socket.id)
    Player.list[socket.id] = player
    initPack.player.push(player.getInitPack())

    socket.on('keyPress',(data) => {
        if(data.inputID === 'right')
            player.pressingRight = data.state
        else if(data.inputID === 'left')
            player.pressingLeft = data.state
        else if(data.inputID === 'up')
            player.pressingUp = data.state
        else if(data.inputID === 'down')
            player.pressingDown = data.state
        if (data.inputID === 'attack')
            player.pressingAttack = data.state
        if (data.inputID === 'mouseAngle')
            player.mouseAngle = data.state
    })

    socket.emit('init',{
        selfId:socket.id,
        player:Player.getAllInitPack(),
        bullet:Bullet.getAllInitPack(),
    })
}
Player.getAllInitPack = () => {
	let players = [];
	for(let i in Player.list)
		players.push(Player.list[i].getInitPack());
	return players;
}
Player.onDisconnect = (socket) => {
	delete Player.list[socket.id];
	removePack.player.push(socket.id);
}
Player.update = () => {
	let pack = []
	for(let i in Player.list){
		let player = Player.list[i]
		player.update()
		pack.push(player.getUpdatePack())	
	}
	return pack
}
Player.list = {}

class Bullet extends Entity {
    constructor(angle,parent,dmg) {
        super()
        this.width = 10
        this.height = 10
        this.id = Math.random()
        this.spdX = Math.cos(angle/180*Math.PI) * 10;
        this.spdY = Math.sin(angle/180*Math.PI) * 10;
        this.dmg = dmg
        this.timer = 0
        this.parent = parent
        this.toRemove = false
    }
    update() {
		if(this.timer++ > 100)
			this.toRemove = true;
		super.update();
		
		for(let i in Player.list){
			let p = Player.list[i];
			if(this.testCollision(p) && this.parent != p.id){
				p.hp -= 1;
				this.toRemove = true;
			}
		}
    }
    getInitPack = () => {
		return {
			id:this.id,
			x:this.x,
			y:this.y,		
		};
	}
	getUpdatePack = () => {
		return {
			id:this.id,
			x:this.x,
			y:this.y,		
		};
	}
}
Bullet.update = () => {
	let pack = []
	for(let i in Bullet.list){
		let bullet = Bullet.list[i]
		bullet.update()
		if(bullet.toRemove){
			delete Bullet.list[i]
			removePack.bullet.push(bullet.id)
		} else
			pack.push(bullet.getUpdatePack())	
	}
	return pack
}
Bullet.getAllInitPack = () => {
	let bullets = [];
	for(let i in Bullet.list)
		bullets.push(Bullet.list[i].getInitPack())
}
Bullet.list = {}


exports.Player = Player
exports.Bullet = Bullet