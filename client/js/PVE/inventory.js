class Inventory {
    constructor() {
        this.items = []
    }
    
    addItem(id,amount) {
        for(let i = 0 ; i < this.items.length; i++){
			if(this.items[i].id === id){
				this.items[i].amount += amount
				this.refreshRender()
				return
			}
		}
        this.items.push({id:id,amount:amount})
        this.refreshRender()
    }

    removeItem(id,amount) {
		for(let i = 0 ; i < this.items.length; i++){
			if(this.items[i].id === id){
				this.items[i].amount -= amount
            }
        }
    }

    refreshRender() {
        let str = ""
        for(let i = 0; i < this.items.length; i++) {
            let item = Item.list[this.items[i].id]
            let onclick = "Item.list['" + item.id + "'].event()"
            str += '<button onclick="' + onclick + '">' + item.name + ' x ' + this.items[i].amount +'</button>'
        }
        document.getElementById("inventory").innerHTML = str
    }
}

const playerInventory = new Inventory()

class Item {
    constructor(id, name, event) {
        this.id = id
        this.name = name
        this.event = event
        Item.list[this.id] = this
    }
}
Item.list = {}

new Item("pot","Pot",function(){
    for(let i = 0; i < playerInventory.items.length; i++) {
        if(playerInventory.items[i].id === "pot") {
            if ( 0 < playerInventory.items[i].amount) {
                playerOne.hp += 100
                if(playerOne.hp > 100)
                    playerOne.hp = 100
                playerInventory.removeItem("pot",1)
            }
        }
    }
})

new Item("gun","Gun",function(){
    playerOne.weapon = gun
    playerOne.img = Img.player.gun
})
new Item("desertEagle","Deagle",function(){
    playerOne.weapon = desertEagle
    playerOne.img = Img.player.gun
})
new Item("shootgun","Shootgun",function(){
    playerOne.weapon = shootgun
    playerOne.img = Img.player.shootgun
})
new Item("usi","Usi",function(){
    playerOne.weapon = usi
    playerOne.img = Img.player.rifle
})
new Item("ak47","AK-47",function(){
    playerOne.weapon = ak47
    playerOne.img = Img.player.rifle
})
new Item("machinegun","Machinegun",function(){
    playerOne.weapon = machinegun
    playerOne.img = Img.player.shootgun
})

playerInventory.addItem("pot",2)
playerInventory.addItem("gun",100)