class Inventory {
    constructor() {
        this.items = []
    }
    
    addItem(id,amount) {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].id === id) {
                this.items[i].amount += amount
                this.refreshRender()
                return
            }
        }
        this.items.push({id:id,amount:amount})
        this.refreshRender()
    }

    removeItem(id,amount) {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].id === id) {
                this.items[i].amount -= amount
                this.refreshRender()
                return
            }
        }
    }

    hasItem(id,amount) {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i].id ===id) {
                return this.items[id].amount >= amount
            }
            return false
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

/*
new Item("potion","Potion",function(){
    for(let i = 0; i < playerInventory.items.length; i++) {
        if(playerInventory.items[i].id === "potion") {
            if ( 0 < playerInventory.items[i].amount) {
                playerOne.hp += 10
                playerInventory.removeItem("potion",1) 
            }
        }
    }
})*/
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
})
new Item("desertEagle","Desert Eagle",function(){
    playerOne.weapon = desertEagle 
})
new Item("shootgun","Shootgun",function(){
    playerOne.weapon = shootgun
})
new Item("usi","Usi",function(){
    playerOne.weapon = usi
})
new Item("ak47","AK-47",function(){
    playerOne.weapon = ak47
})
new Item("machinegun","Machinegun",function(){
    playerOne.weapon = machinegun
})

playerInventory.addItem("pot",2)
playerInventory.addItem("gun",100)
/* 
const gun = new Weapon(1,25,0,35,50)
const desertEagle = new Weapon(1,50,0,35,50)
const shootgun = new Weapon(0.5,20,1,25,50)
const usi = new Weapon(4,15,0,35,100)
const ak47 = new Weapon(3,30,0,35,100)
const machinegun = new Weapon(6,15,2,150) 

*/

