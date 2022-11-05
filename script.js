function Ship(length, coords){
    return{
        length: length,
        hits: 0,
        sunk: false,
        location: coords,
        hit(){
            this.hits++
        },
        isSunk(){
            if(this.hits === this.length){
                this.sunk = true
                console.log('YOU SANK MY BATTLESHIP!!!!!!!!')
            }
        }
    }
}
function gameBoard(){
    return{
        MissArray: [],
        ShipArray: [],
        HitArray: [],
        placeShip(coords, length){
            this.ShipArray.push(Ship(length, coords))
        },
        receiveAttack(coords){
                    if(this.MissArray.includes(coords) == false){
                        this.ShipArray.forEach(ship => {
                            if(ship.location.includes(coords)){
                                ship.hit()
                                this.HitArray.push(coords)
                                ship.isSunk()
                                ship.location.splice(ship.location.indexOf(coords), 1)
                                this.checkWinCondition()
                                return
                            }
                        }, this)
                        this.MissArray.push(coords)
                    }
                },
        checkWinCondition(){
            if(this.HitArray.length === 20){
                console.log('Victoria III')
            }
        }
        }
}

let playerBoard = new gameBoard
let cpuBoard = new gameBoard

function gameController(){
    cpuBoard.placeShip([1, 2, 3, 4], 4)
    cpuBoard.placeShip([21, 22, 23], 3)
    cpuBoard.placeShip([41, 42], 2)
    cpuBoard.placeShip([61], 1)
    playerBoard.placeShip([1, 2, 3, 4], 4)
    playerBoard.placeShip([21, 22, 23], 3)
    playerBoard.placeShip([41, 42], 2)
    playerBoard.placeShip([61], 1)
}

function playerTurn(){

}
function cpuTurn(){
    let move = Math.floor(Math.random()*100)
    if(playerBoard.MissArray.includes(move) == false){
        playerBoard.receiveAttack(move)
        console.warn(`CPU Attacked ${move}`)
    }
    else{
        cpuTurn()
    }
}