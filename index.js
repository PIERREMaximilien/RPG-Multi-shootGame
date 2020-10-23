const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // c = context 

canvas.width = innerWidth
canvas.height = innerHeight

let Img = {};
Img.player = new Image();
Img.player.src = "img/player.png";
Img.enemy = new Image();
Img.enemy.src = 'img/enemy.png';
Img.bullet = new Image();
Img.bullet.src = 'img/bullet.png';

class Player {
    constructor(x, y, width, height, hp, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.hp = hp
        this.img = img
        this.rightPressed = false;
        this.leftPressed = false;
        this.upPressed = false;
        this.downPressed = false;
    }

    draw() {
        c.save()
		c.drawImage(this.img,
			0,0,this.img.width,this.img.height,
			this.x,this.y,this.width,this.height
		)
		c.restore()
	}

    movePlayer() {
        this.draw()
        if(this.rightPressed) {
            this.x += 2
            if(this.x + this.width >= canvas.width) {
                this.x = canvas.width - this.width
            }
        } else if(this.leftPressed) {
            this.x -= 2
            if(this.x <= 0) {
                this.x = 0
            }
        } else if(this.upPressed) {
            this.y -= 2
            if(this.y <= 0) {
                this.y = 0
            }
        } else if(this.downPressed) {
            this.y += 2
            if(this.y + this.height >= canvas.height) {
                this.y = canvas.height - this.height
            }
        }
    }
}

class Projectile {
    constructor(x, y, width, height, velocity, img) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.velocity = velocity
        this.img = img

    }

    draw() {
        c.save()
		c.drawImage(this.img,
			0,0,this.img.width,this.img.height,
			this.x,this.y,this.width,this.height
		)
		c.restore()
	}

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, velocity, img) {
        this.x = x
        this.y = y 
        this.velocity = velocity
        this.img = img
    }

    draw() {
        c.save()
		c.drawImage(this.img,
			0,0,this.img.width,this.img.height,
			this.x,this.y,this.width,this.height
		)
		c.restore()
	}

    moveEnemies() {
        this.draw()
        this.x = this.x + this.velocity.x 
        this.y = this.y + this.velocity.y
    }
}

class BigZombie extends Enemy {
    constructor(x, y, velocity, img) {
        super(x, y, velocity,img)
        this.width = 100
        this.height = 100
        this.hp = 300
    }
}

class Zombie extends Enemy {
    constructor(x, y, velocity, img) {
        super(x, y, velocity, img)
        this.width = 50
        this.height = 50
        this.hp = 100
    }
}

class FastZombie extends Enemy {
    constructor(x, y, velocity, img) {
        super(x, y, velocity, img)
        this.width = 30
        this.height = 30
        this.hp= 50
    }
}

const playerOne = new Player(canvas.width / 2, canvas.height / 2, 40, 40, 100, Img.player)

const projectiles = []
const enemies = []

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    playerOne.movePlayer()
    projectiles.forEach((projectile) => {
        projectile.update()
    })
    enemies.forEach((enemy) => {
        enemy.moveEnemies()
    })
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

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - playerOne.y,
        event.clientX - playerOne.x
    )

    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6
    }

    projectiles.push(
        new Projectile(
            playerOne.x, 
            playerOne.y, 
            5, 
            5, 
            velocity,
            Img.bullet
        )
    )
})

setInterval(() => {

    //const angle = Math.atan2(
    //    playerOne.y - zombie,
    //    playerOne.x - zombie
    //)

    //const velocity = {
    //    x: Math.cos(angle),
    //    y: Math.sin(angle)
    //}

    //const zombie = new Zombie(10, 10, {x: 1,y: 2})
    
    enemies.push(
        new Zombie(10, 10, {x: 1,y: 2}, Img.enemy)
    )
}, 1000);

setInterval(() => {
    enemies.push(
        new FastZombie(40, 40, {x:3,y:3}, Img.enemy)
    )
}, 5000);

setInterval(() => {
    enemies.push(
        new BigZombie(300, 300, {x:0.3,y:0.3}, Img.enemy)
    )
}, 15000);

animate()