const E = require('./Entity')
const Entity = E.Entity

class Enemy extends Entity {

}

exports.Enemy = Enemy

/*
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
        this.loot(desertEagle,Img.desertEagle,0.05,Img.player.gun)
        this.loot(shootgun,Img.shootgun,0.035,Img.player.shootgun)
        this.loot(ak47,Img.ak47,0.025,Img.player.rifle)
        this.loot(usi,Img.usi,0.04,Img.player.shootgun)
        this.loot(machinegun,Img.machinegun,0.01,Img.player.rifle)
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
*/