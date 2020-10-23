

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // c = context 

canvas.width = innerWidth
canvas.height = innerHeight


class Player {
    constructor(x, y, radius, color, health) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.health = health
        this.rightPressed = false;
        this.leftPressed = false;
        this.upPressed = false;
        this.downPressed = false;
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    movePlayer() {
        this.draw()
        if(this.rightPressed) {
            this.x += 2
            if(this.x + this.radius >= canvas.width) {
                this.x = canvas.width - this.radius
            }
        } else if(this.leftPressed) {
            this.x -= 2
            if(this.x - this.radius <= 0) {
                this.x = 0 + this.radius
            }
        } else if(this.upPressed) {
            this.y -= 2
            if(this.y - this.radius <= 0) {
                this.y = 0 + this.radius
            }
        } else if(this.downPressed) {
            this.y += 2
            if(this.y + this.radius >= canvas.height) {
                this.y = canvas.height - this.radius
            }
        }
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor(x, y, velocity) {
        this.x = x
        this.y = y 
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    moveEnemies() {
        this.draw()
        this.x = this.x + this.velocity.x 
        this.y = this.y + this.velocity.y
    }
}

class BigZombie extends Enemy {
    constructor(x, y, velocity) {
        super(x, y, velocity)
        this.radius = 30
        this.color = 'purple'
        this.health = 300
    }
}

class Zombie extends Enemy {
    constructor(x, y, velocity) {
        super(x, y, velocity)
        this.radius = 15
        this.color = 'orange'
        this.health = 100
    }
}

class FastZombie extends Enemy {
    constructor(x, y, velocity) {
        super(x, y, velocity)
        this.radius = 5
        this.color = 'yellow'
        this.health = 50
    }
}

const playerOne = new Player(canvas.width / 2, canvas.height / 2, 20, 'blue', 100)

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

document.addEventListener('keydown', (event) => {
    if(event.key === 'q')
        playerOne.rightPressed = true
    else if (event.key === 'd')
        playerOne.leftPressed = true
    else if (event.key === 'z')
        playerOne.upPressed = true
    else if (event.key=== 's')
        playerOne.downPressed = true
})

document.addEventListener('keyup', (event) => {
    if(event.key === 'q')
        playerOne.rightPressed = false;
    else if (event.key === 'd')
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
            3, 
            'red', 
            velocity
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
        new Zombie(10, 10, {x: 1,y: 2})
    )
}, 1000);

setInterval(() => {
    enemies.push(
        new FastZombie(40, 40, {x:3,y:3})
    )
}, 5000);

setInterval(() => {
    enemies.push(
        new BigZombie(300, 300, {x:0.3,y:0.3})
    )
}, 15000);

animate()