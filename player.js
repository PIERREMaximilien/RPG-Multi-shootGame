let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup' , keyUpHandler);

function keyDownHandler(e){
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        rightPressed = true
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true
    } else if (e.key == 'up' || e.key == 'ArrowUp') {
        upPressed = true
    } else if (e.key == 'down' || e.key =='ArrowDown') {
        downPressed = true
    }
};

function keyUpHandler(e){
    if(e.key == 'Right' || e.key == 'ArrowRight'){
        rightPressed = false
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false
    } else if (e.key == 'up' || e.key == 'ArrowUp') {
        upPressed = false
    } else if (e.key == 'down' || e.key =='ArrowDown') {
        downPressed = false
    }
};

function movePlayer() {
    if(rightPressed) {
        this.x += 7
        if(this.x + this.radius >= canvas.width) {
            this.x = canvas.width - this.radius
        }
    } else if(leftPressed) {
        this.x -= 7
        if(this.x < 0) {
            this.x = 0
        }
    } else if(upPressed) {
        this.y -= 7
        if(this.y < 0) {
            this.y = 0
        }
    } else if(downPressed) {
        this.y = 7
        if(this.y + this.radius >= canvas.height) {
            this.y = canvas.width - this.radius
        }
    }
}