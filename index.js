

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // c = context 

canvas.width = innerWidth
canvas.height = innerHeight

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup' , keyUpHandler);

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

function keyDownHandler(e){
    e.preventDefault()
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        rightPressed = true
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true
    } else if (e.key == 'up' || e.key == 'ArrowUp') {
        upPressed = true
    } else if (e.key == 'down' || e.key =='ArrowDown') {
        downPressed = true
    }
}

function keyUpHandler(e){
    e.preventDefault()
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        rightPressed = false
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false
    } else if (e.key == 'up' || e.key == 'ArrowUp') {
        upPressed = false
    } else if (e.key == 'down' || e.key =='ArrowDown') {
        downPressed = false
    }
}

function movePlayer(element) {
    element.draw()
    if(rightPressed) {
        element.x += 2
        if(element.x + element.radius >= canvas.width) {
            element.x = canvas.width - element.radius
        }
    } else if(leftPressed) {
        element.x -= 2
        if(element.x - element.radius <= 0) {
            element.x = 0 + element.radius
        }
    } else if(upPressed) {
        element.y -= 2
        if(element.y - element.radius <= 0) {
            element.y = 0 + element.radius
        }
    } else if(downPressed) {
        element.y += 2
        if(element.y + element.radius >= canvas.height) {
            element.y = canvas.height - element.radius
        }
    }
}

class Player {
    constructor(x, y, radius, color, health) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.health = health
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
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
    playerOne.draw()
    movePlayer(playerOne)
    projectiles.forEach((projectile) => {
        projectile.update()
    })
    enemies.forEach((enemy) => {
        enemy.moveEnemies()
    })
}


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

    const angle = Math.atan2(
        playerOne.y - zombie,
        playerOne.x - zombie
    )

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    const zombie = new Zombie(10, 10, velocity)
    
    enemies.push(
        zombie
    )
}, 1000);

setInterval(() => {
        const fastzombie = new FastZombie(40, 40, {x:3,y:3})
}, 5000);

setInterval(() => {
    enemies.push(
        new BigZombie(300, 300, {x:0.3,y:0.3})
    )
}, 15000);

animate()