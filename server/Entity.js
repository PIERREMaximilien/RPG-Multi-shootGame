function testCollisionRectRect(rect1,rect2) {
	return rect1.x <= rect2.x + rect2.width 
		&& rect2.x <= rect1.x + rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height
}

class Entity {
    constructor(param) {
        this.id = ""
        this.x = 250
        this.y = 250
        this.spdX = 0
        this.spdY = 0
        if(param){
            if(param.x)
                this.x = param.x;
            if(param.y)
                this.y = param.y;
            if(param.map)
                this.map = param.map;
            if(param.id)
                this.id = param.id;		
        }
    }
    update() {
        this.updatePosition()
    }
    updatePosition() {
        this.x += this.spdX
        this.y += this.spdY
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
}

exports.Entity = Entity