class Entity {
    constructor(param) {
        this.id = ""
        this.x = 375
        this.y = 375
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
}

exports.Entity = Entity