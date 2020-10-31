const c = document.querySelector('canvas').getContext('2d')

const WIDTH = 650
const HEIGHT = 650
c.font = '30px Arial'
c.mozImageSmoothingEnabled = false
c.msImageSmoothingEnabled = false
c.imageSmoothingEnabled = false

let time = 0
let atkTime = 0

const Img = {}
Img.set = function() {
    Img.player = {}
    Img.player.gun = new Image()
    Img.player.gun.src = "public/img/player/gun.png"
    Img.player.rifle = new Image()
    Img.player.rifle.src = "public/img/player/rifle.png"
    Img.player.shootgun = new Image()
    Img.player.shootgun.src = "public/img/player/shootgun.png"
    Img.enemy = new Image()
    Img.enemy.src = 'public/img/enemy.png'
    Img.bullet = new Image()
    Img.bullet.src = 'public/img/bullet.png'
    Img.desertEagle = new Image()
    Img.desertEagle.src = 'public/img/weapon/desertEagle.png'
    Img.shootgun = new Image()
    Img.shootgun.src = 'public/img/weapon/shootgun.png'
    Img.ak47 = new Image()
    Img.ak47.src = 'public/img/weapon/ak47.png'
    Img.machinegun = new Image()
    Img.machinegun.src = 'public/img/weapon/machinegun.png'
    Img.usi = new Image()
    Img.usi.src = 'public/img/weapon/usi.png'
}
Img.set()

function testCollisionRectRect(rect1,rect2) {
	return rect1.x <= rect2.x + rect2.width 
		&& rect2.x <= rect1.x + rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height
}

class Weapon {
    constructor(id,atkspeed,damage,special,range,munitions) {
        this.id = id
        this.atkspeed = atkspeed
        this.damage = damage
        this.special = special
        this.range = range
        this.munitions = munitions
    }
}

const gun = new Weapon("gun",1,25,0,35,50)
const desertEagle = new Weapon("desertEagle",1,50,0,35,50)
const shootgun = new Weapon("shootgun",0.5,20,1,25,250)
const usi = new Weapon("usi",4,15,0,35,100)
const ak47 = new Weapon("ak47",3,30,0,35,100)
const machinegun = new Weapon("machinegun",6,15,2,150)

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
        c.rotate((this.aimAngle/* -20*/)*Math.PI/180)
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
                        Bullet.generate(playerOne.aimAngle + Math.floor(Math.random()*15))
                    else
                        Bullet.generate(playerOne.aimAngle + Math.floor(Math.random()*(-15)))
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

class Enemy {
    constructor(id, x, y, width, height, speed, hp, hpMax, damage, img, point) {
        this.id = id
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.hp = hp
        this.hpMax = hpMax
        this.damage = damage
        this.img = img
        this.point = point
    }

    draw() {
        c.save()
        let x = this.x - playerOne.x
		let y = this.y - playerOne.y
		
		x += WIDTH/2
		y += HEIGHT/2
		
		x -= this.width/2
        y -= this.height/2

        let x1 = this.x - playerOne.x + WIDTH/2
		let y1 = this.y - playerOne.y + HEIGHT/2 - this.height/2 - 20
		
		c.fillStyle = 'red'
		let width = 100*this.hp/this.hpMax
		if(width < 0)
			width = 0
		c.fillRect(x1-50,y1,width,10)
		
		c.strokeStyle = 'black'
		c.strokeRect(x1-50,y1,100,10)
		
		c.drawImage(this.img,
			0,0,this.img.width,this.img.height,
			x,y,this.width,this.height
		)
		c.restore()
    }
    
    hypotenuse() {
		var vx = this.speed
		var vy = this.speed
		return Math.sqrt(vx*vx+vy*vy);
	}

    aimAngle() {
        let diffX = this.x - playerOne.x
        let diffY = this.y - playerOne.y 
        return Math.atan2(diffY,diffX) / Math.PI * 180
    }

    updatePosition() {
        let angle = this.aimAngle()
        let hypotenuse = this.hypotenuse()

        if(-90 < angle <= 0) {
            this.x -= Math.cos(angle * Math.PI/180) * hypotenuse
            this.y -= Math.sin(angle * Math.PI/180) * hypotenuse
        } else if(-180 < angle <= -90) {
            this.x -= Math.cos(angle * Math.PI/180) * hypotenuse
            this.y -= Math.sin(angle * Math.PI/180) * hypotenuse
        } else if(0 < angle <= 90) {
            this.x -= Math.cos(angle * Math.PI/180) * hypotenuse
            this.y -= Math.sin(angle * Math.PI/180) * hypotenuse
        } else if(90 < angle <= 180) {
            this.x -= Math.cos(angle * Math.PI/180) * hypotenuse
            this.y -= Math.sin(angle * Math.PI/180) * hypotenuse
        }
    }

    update() {
        this.updatePosition()
        this.draw()
    }

    loot(wp,img,lootchance,playerImg) {
        
        let x = this.x
        let y = this.y
        let height = 50
        let width = 50
        let id = Math.random() 

        if(Math.random()<lootchance){
            let weapon = new Bonus(id,x,y,width,height,wp,img,playerImg)
            Bonus.list[id] = weapon
        }
    }

    generateLoot() {
        this.loot(desertEagle,Img.desertEagle,0.025,Img.player.gun)
        this.loot(shootgun,Img.shootgun,0.02,Img.player.shootgun)
        this.loot(ak47,Img.ak47,0.015,Img.player.rifle)
        this.loot(usi,Img.usi,0.02,Img.player.shootgun)
        this.loot(machinegun,Img.machinegun,0.001,Img.player.rifle)
    }
}

Enemy.list = {}

Enemy.randomlyGenerate = function(width, height, speed, hp, hpMax, damage, image, point){
	//Math.random() returns a number between 0 and 1
	let x = Math.random()*currentMap.width*2
	let y = Math.random()*currentMap.height*2
    let id = Math.random()
    
    let enemy = new Enemy(id, x, y, width, height, speed, hp, hpMax, damage, image, point)
    Enemy.list[id] = enemy
}

class Bullet {
    constructor(id, x, y, width, height, velocity, dmg, img) {
        this.id = id
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocity = velocity
        this.dmg = dmg
        this.img = img
        this.timer = 0
    }

    draw() {
        c.save()
        let x = this.x - playerOne.x
		let y = this.y - playerOne.y
		
		x += WIDTH/2
		y += HEIGHT/2
		
		x -= this.width/2
        y -= this.height/2
        
		c.drawImage(this.img,
			0,0,this.img.width,this.img.height,
			x,y,this.width,this.height
		)
		c.restore()
	}

    updatePosition() {
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
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

    update() {
        this.updatePosition()
        this.draw()
    }
}

Bullet.list = {}

Bullet.generate = function(aimOverwrite) {
    let angle
	if(aimOverwrite !== undefined)
		angle = aimOverwrite;
	else angle = playerOne.aimAngle;

    const velocity = {
        x: Math.cos(angle/180*Math.PI)*10,
        y: Math.sin(angle/180*Math.PI)*10
    }

    const id = Math.random()
    
    for(let i = 0; i < playerInventory.items.length; i++) {
        if(playerInventory.items[i].id === playerOne.weapon.id) {
            if ( 0 < playerInventory.items[i].amount) {
                playerInventory.items[i].amount -= 1 
                const bullet = new Bullet(id, playerOne.x, playerOne.y, 10, 10, velocity, playerOne.weapon.damage, Img.bullet)
                Bullet.list[id] = bullet
                playerInventory.refreshRender()
            }
        }
    }

}

const playerOne = new Player(WIDTH/2, HEIGHT/2, 85, 50, 3, 100, 100, Img.player.gun, gun)

class Maps {
    constructor(id,imgSrc,width,height){
		this.id = id,
		this.image = new Image(),
		this.width = width,
        this.height	= height
        this.image.src = imgSrc
	}
	
	draw() {
		let x = WIDTH/2 - playerOne.x
		let y = HEIGHT/2 - playerOne.y
        c.drawImage(this.image,0,0,this.image.width,this.image.height,x,y,this.image.width*2,this.image.height*2)
	}
}

class Bonus {
    constructor(id,x,y,width,height,category,img,playerImg) {
        this.id = id
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.category = category
        this.img = img
        this.playerImg = playerImg
    }

    draw() {
        c.save()
        let x = this.x - playerOne.x
		let y = this.y - playerOne.y
		
		x += WIDTH/2
		y += HEIGHT/2
		
		x -= this.width/2
        y -= this.height/2
        
        c.drawImage(this.img,
            0,0,this.img.width,this.img.height,
            x,y,this.width,this.height
        )
        c.restore()
    }
}

Bonus.list = {}

currentMap = new Maps('field','public/img/map.png',1204,1204)

let score = 0

function animate() {
    c.clearRect(0, 0, WIDTH, HEIGHT)
    currentMap.draw()
    playerOne.update()
    time++
    atkTime++
    c.fillText(playerOne.hp + " Hp",0,30)
    c.fillText('Score: ' + score,200,30)
	for(let key in Bullet.list){
        let b  = Bullet.list[key]
        let remove = false

        b.update()
        b.timer++

        if(b.timer > playerOne.weapon.range)
            remove = true

        for(let key2 in Enemy.list) {
            if(b.testCollision(Enemy.list[key2])){
                remove = true
                Enemy.list[key2].hp -= b.dmg
            }				
        }

        if(remove)
            delete Bullet.list[key]
    }

	for(let key in Enemy.list){
        Enemy.list[key].update()
        if(playerOne.testCollision(Enemy.list[key])) {
            if(atkTime>50) {
                playerOne.hp -= Enemy.list[key].damage
                atkTime = 0
            }
        }
        if(Enemy.list[key].hp <= 0) {
            score += Enemy.list[key].point
            Enemy.list[key].generateLoot()
            delete Enemy.list[key]
        }
    }
	for(let key in Bonus.list){
        Bonus.list[key].draw()
        if(playerOne.testCollision(Bonus.list[key])) {
            const weaponM = Bonus.list[key].category
            playerInventory.addItem(weaponM.id,weaponM.munitions)
            delete Bonus.list[key]
        }
    }
    if(time % 200 === 0) 
        Enemy.randomlyGenerate(30,35,2,50,50,2,Img.enemy,20)

    if(time % 500 === 0)
        Enemy.randomlyGenerate(60,70,1,100,100,4,Img.enemy,50)

    if(time % 1000 === 0)
        Enemy.randomlyGenerate(150,176,0.5,500,500,10,Img.enemy,100)
    requestAnimationFrame(animate)
}
 
newGame = function() {
    console.log('game is on try to survive!')
}

addEventListener('keydown', (event) => {
    if(event.key === 'd')
        playerOne.rightPressed = true
    else if (event.key === 'q')
        playerOne.leftPressed = true
    else if (event.key === 'z')
        playerOne.upPressed = true
    else if (event.key=== 's')
        playerOne.downPressed = true
})

addEventListener('keyup', (event) => {
    if(event.key === 'd')
        playerOne.rightPressed = false;
    else if (event.key === 'q')
        playerOne.leftPressed = false;
    else if (event.key === 'z')
        playerOne.upPressed = false;
    else if (event.key === 's')
        playerOne.downPressed = false;
})

addEventListener('mousemove', (event) => {
    let mouseX = event.clientX - document.querySelector('canvas').getBoundingClientRect().left
	let mouseY = event.clientY - document.querySelector('canvas').getBoundingClientRect().top
	
	mouseX -= WIDTH/2
    mouseY -= HEIGHT/2
    
    playerOne.aimAngle = Math.atan2(mouseY,mouseX) / Math.PI * 180
})

addEventListener('mousedown', (event) => {
    if(event.button === 0)
        playerOne.mouseLeft = true
})

addEventListener('mouseup', (event) => {
    if(event.button === 0)
        playerOne.mouseLeft = false
})

newGame()

animate()

setInterval(() => {
    if(playerOne.hp <= 0)
        location.href = 'index.html'
}, 50);