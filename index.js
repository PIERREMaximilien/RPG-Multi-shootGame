const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // c = context 

canvas.width = innerWidth
canvas.height = innerHeight

//addEventListener('keydown', keyDownHandler)
//addEventListener('keyup' , keyUpHandler)

class Player {
    constructor(x, y, radius, color, rightPressed, leftPressed , upPressed, downPressed) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.rightPressed = rightPressed
        this.leftPressed = leftPressed
        this.upPressed = upPressed
        this.downPressed = downPressed
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }

    
    keyDownHandler(e){
        if(e.key == 'Right' || e.key == 'ArrowRight'){
            this.rightPressed = true
        } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
            this.leftPressed = true
        } else if (e.key == 'up' || e.key == 'ArrowUp') {
            this.upPressed = true
        } else if (e.key == 'down' || e.key =='ArrowDown') {
            this.downPressed = true
        }
    }

    keyUpHandler(e){
        if(e.key == 'Right' || e.key == 'ArrowRight'){
            this.rightPressed = false
        } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
            this.leftPressed = false
        } else if (e.key == 'up' || e.key == 'ArrowUp') {
            this.upPressed = false
        } else if (e.key == 'down' || e.key =='ArrowDown') {
            this.downPressed = false
        }
    }

    movePlayer() {
        this.draw()
        if(this.rightPressed) {
            this.x += 7
            if(this.x + this.radius >= canvas.width) {
                this.x = canvas.width - this.radius
            }
        } else if(this.leftPressed) {
            this.x -= 7
            if(this.x < 0) {
                this.x = 0
            }
        } else if(this.upPressed) {
            this.y -= 7
            if(this.y < 0) {
                this.y = 0
            }
        } else if(this.downPressed) {
            this.y = 7
            if(this.y + this.radius >= canvas.height) {
                this.y = canvas.width - this.radius
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

const x = canvas.width / 2
const y = canvas.height / 2

const playerOne = new Player(x, y, 30, 'blue', false, false, false, false)
playerOne.draw()

const projectiles = []

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    playerOne.draw()
    playerOne.movePlayer()
    projectiles.forEach((projectile) => {
        projectile.update()
    })
}

addEventListener('click', (event) => {

    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(
        new Projectile(
            canvas.width / 2, 
            canvas.height / 2, 
            5, 
            'red', 
            velocity
        )
    )
})
animate()