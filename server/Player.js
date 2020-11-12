const E = require('./Entity')
const Entity = E.Entity


class Player extends Entity {
    constructor(id) {
        super()
        this.id = id
        this.width = 85
        this.height = 50
        this.pressingRight = false
        this.pressingLeft = false
        this.pressingUp = false
        this.pressingDown = false
        this.pressingAttack = false
        this.mouseAngle = 0
        this.maxSpd = 4
        this.hp = 100
        this.hpMax = 100
        this.score = 0
        this.atkCounter = 0
    }
    
    update() {
        this.atkCounter++
        this.updateSpd()
        super.update()

        if(this.pressingAttack) {
            this.shootBullet(this.mouseAngle)
        }
    }

    shootBullet = (angle) => {
        if(this.atkCounter > 15) {
            let bullet = new Bullet(angle,this.id,10)
            bullet.x = this.x;
            bullet.y = this.y;
            Bullet.list[bullet.id] = bullet
            initPack.bullet.push(bullet.getInitPack())
            this.atkCounter = 0
        }
    }

    updateSpd() {

        if(this.pressingRight && this.pressingUp) {
            this.x += this.maxSpd*0.7
            this.y -= this.maxSpd*0.7
        } else if(this.pressingRight && this.pressingDown) {
            this.x += this.maxSpd*0.7
            this.y += this.maxSpd*0.7
        } else if(this.pressingLeft && this.pressingUp) {
            this.x -= this.maxSpd*0.7
            this.y -= this.maxSpd*0.7
        } else if(this.pressingLeft && this.pressingDown) {
            this.x -= this.maxSpd*0.7
            this.y += this.maxSpd*0.7
        } else if(this.pressingRight)
            this.x += this.maxSpd   
        else if(this.pressingLeft)
            this.x -= this.maxSpd
        else if(this.pressingUp)
            this.y -= this.maxSpd
        else if(this.pressingDown)
            this.y += this.maxSpd

        if(this.x < this.width/2)
			this.x = this.width/2
		if(this.x > 2408 - this.width/2)
			this.x = 2408 - this.width/2;
		if(this.y < this.height/2)
			this.y = this.height/2;
		if(this.y > 2408 - this.height/2)
            this.y = 2408 - this.height/2;
    }

    getInitPack = () => {
		return {
			id:this.id,
			x:this.x,
			y:this.y,
			hp:this.hp,
			hpMax:this.hpMax,
            score:this.score,
            mouseAngle:this.mouseAngle,
		};		
	}
	getUpdatePack = () => {
		return {
			id:this.id,
			x:this.x,
			y:this.y,
			hp:this.hp,
            score:this.score,
            mouseAngle:this.mouseAngle,
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
		if(this.timer++ > 45)
			this.toRemove = true;
		super.update();
		
		for(let i in Player.list){
			let p = Player.list[i];
			if(this.testCollision(p) && this.parent != p.id){
                p.hp -= 10;
								
				if(p.hp <= 0){
					let shooter = Player.list[this.parent];
					if(shooter)
						shooter.score += 1;
					p.hp = p.hpMax;
					p.x = Math.random() * 1155;
					p.y = Math.random() * 650;					
				}
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