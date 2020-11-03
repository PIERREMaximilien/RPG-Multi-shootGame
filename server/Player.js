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
        const bullet = new Bullet(this.x,this.y,angle,this.id)
        Bullet.list[bullet.id] = bullet
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
}

Player.onConnect = (socket) => {
    let player = new Player(socket.id)
    Player.list[socket.id] = player

    socket.on('keyPress',(data)=> {
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
}
Player.onDisconnect = (socket) => {
    delete Player.list[socket.id]
}
Player.update = () => {
    const pack = []
    for(let i in Player.list) {
        let player = Player.list[i]
        player.update()
        pack.push({
            x:player.x,
            y:player.y,
            width:player.width,
            height:player.width
        })
    }
    return pack
}
Player.list = {}


class Bullet extends Entity {
    constructor(x,y,angle,parent,dmg,img) {
        super()
        this.x = x
        this.y = y
        this.width = 10
        this.height = 10
        this.id = Math.random()
        this.spdX = Math.cos(angle/180*Math.PI) * 10;
        this.spdY = Math.sin(angle/180*Math.PI) * 10;
        this.dmg = dmg
        this.img = img
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
}

Bullet.update = () => {
    const pack = []
    for(let i in Bullet.list) {
        let bullet = Bullet.list[i]
        bullet.update()
        if(bullet.toRemove)
            delete Bullet.list[i]
        else {
            pack.push({
                x:bullet.x,
                y:bullet.y,
            }) 
        }
    }
    return pack
}
Bullet.list = {}


exports.Player = Player
exports.Bullet = Bullet

/*
class Player {
    constructor(x, y, width, height, speed, hp, hpMax, img, weapon) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.hp = hp
        this.hpMax = hpMax
        this.img = img
        this.weapon = weapon
        this.atkCounter = 0
        this.aimAngle = 0
        this.mouseLeft = false
        this.rightPressed = false
        this.leftPressed = false
        this.upPressed = false
        this.downPressed = false
    }

    draw() {
        c.save()
        let x = this.x - playerOne.x
		let y = this.y - playerOne.y
		
		x += WIDTH/2
		y += HEIGHT/2
		
		x -= this.width/2
        y -= this.height/2
         
        c.translate(WIDTH/2,HEIGHT/2)
        c.rotate((this.aimAngle)*Math.PI/180)
        c.translate(-WIDTH/2,-HEIGHT/2)  

		c.drawImage(this.img,
            0,0,this.img.width,this.img.height,
			x,y,this.width,this.height
		)
		c.restore()
    }
    
    drawHp() {
        c.save()

        let x1 = WIDTH/2
		let y1 = HEIGHT/2 - 60
        c.fillStyle = 'orange'
		let width = 100*this.hp/this.hpMax
		if(width < 0)
			width = 0
		c.fillRect(x1-50,y1,width,10)
		
		c.strokeStyle = 'black'
        c.strokeRect(x1-50,y1,100,10)
        c.restore()
    }

    hypotenuse() {	//return distance (number)
		var vx = this.speed
		var vy = this.speed
		return Math.sqrt(vx*vx+vy*vy);
    }
    
    updatePosition() {
        if(this.rightPressed && this.upPressed) {
            this.x += this.speed*0.7
            this.y -= this.speed*0.7
        } else if(this.rightPressed && this.downPressed) {
            this.x += this.speed*0.7
            this.y += this.speed*0.7
        } else if(this.leftPressed && this.upPressed) {
            this.x -= this.speed*0.7
            this.y -= this.speed*0.7
        } else if(this.leftPressed && this.downPressed) {
            this.x -= this.speed*0.7
            this.y += this.speed*0.7
        } else if(this.rightPressed)
            this.x += this.speed   
        else if(this.leftPressed)
            this.x -= this.speed
        else if(this.upPressed)
            this.y -= this.speed
        else if(this.downPressed)
            this.y += this.speed


        if(this.x < this.width/2)
			this.x = this.width/2
		if(this.x > currentMap.width*2 - this.width/2)
			this.x = currentMap.width*2 - this.width/2;
		if(this.y < this.height/2)
			this.y = this.height/2;
		if(this.y > currentMap.height*2 - this.height/2)
            this.y = currentMap.height*2 - this.height/2;
    }

    testCollision(entity2) {	//return if colliding (true/false)
		let rect1 = {
			x:this.x-this.width/2,
			y:this.y-this.height/2,
			width:this.width,
			height:this.height,
		}
		let rect2 = {
			x:entity2.x-entity2.width/2,
			y:entity2.y-entity2.height/2,
			width:entity2.width,
			height:entity2.height,
		}
		return testCollisionRectRect(rect1,rect2);
    }

    attack() {
        if(this.mouseLeft) {
            if(this.atkCounter > 30) {
                if(this.weapon.special === 0)
                    Bullet.generate()
                else if(this.weapon.special === 1) {
                    Bullet.generate(playerOne.aimAngle)
                    Bullet.generate(playerOne.aimAngle + 5)
                    Bullet.generate(playerOne.aimAngle - 5)
                    Bullet.generate(playerOne.aimAngle + 10)
                    Bullet.generate(playerOne.aimAngle - 10)
                } else if(this.weapon.special === 2) {
                    if(Math.random()< 0.5)
                        Bullet.generate(playerOne.aimAngle + Math.floor(Math.random()*20))
                    else
                        Bullet.generate(playerOne.aimAngle + Math.floor(Math.random()*(-20)))
                }
                playerOne.atkCounter = 0
            }
        }
    }
    
    update(){
        this.updatePosition()
        this.attack()
        this.atkCounter += this.weapon.atkspeed
        this.draw()
        this.drawHp()
    }
}
*/