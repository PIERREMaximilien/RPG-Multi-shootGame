const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
c.font = '30px Arial'

const WIDTH = 750
const HEIGHT = 750

let socket = io();

socket.on('newposition',(data) => {
    c.clearRect(0,0,750,750)
    for(let i = 0; i < data.player.length; i++)
        c.fillText(data.player[i].number,data.player[i].x,data.player[i].y)
    for(let i = 0; i < data.bullet.length; i++)
        c.fillRect(data.bullet[i].x,data.bullet[i].y,10,10)
})

addEventListener('keydown', (event) => {
    if(event.key === 'd')
        socket.emit('keyPress',{inputID:'right',state:true})
    else if (event.key === 'q')
        socket.emit('keyPress',{inputID:'left',state:true})
    else if (event.key === 'z')
        socket.emit('keyPress',{inputID:'up',state:true})
    else if (event.key=== 's')
        socket.emit('keyPress',{inputID:'down',state:true})
})

addEventListener('keyup', (event) => {
    if(event.key === 'd')
        socket.emit('keyPress',{inputID:'right',state:false})
    else if (event.key === 'q')
        socket.emit('keyPress',{inputID:'left',state:false})
    else if (event.key === 'z')
        socket.emit('keyPress',{inputID:'up',state:false})
    else if (event.key === 's')
        socket.emit('keyPress',{inputID:'down',state:false})
})

addEventListener('mousedown', (event) => {
    if(event.button === 0)
        socket.emit('keyPress',{inputID:'attack',state:true})
})

addEventListener('mouseup', (event) => {
    if(event.button === 0)
        socket.emit('keyPress',{inputID:'attack',state:false})
})

addEventListener('mousemove', (event) => {
    let mouseX = event.clientX - document.querySelector('canvas').getBoundingClientRect().left
	let mouseY = event.clientY - document.querySelector('canvas').getBoundingClientRect().top
	
	mouseX -= WIDTH/2
    mouseY -= HEIGHT/2
    
    let angle = Math.atan2(mouseY,mouseX) / Math.PI * 180
    socket.emit('keyPress',{inputID:'mouseAngle',state:angle}) 
})