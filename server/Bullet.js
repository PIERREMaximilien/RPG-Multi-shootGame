

/*
class Bullet extends Entity {
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
    
    const bullet = new Bullet(id, playerOne.x, playerOne.y, 10, 10, velocity, playerOne.weapon.damage, Img.bullet)
    Bullet.list[id] = bullet
}
*/

