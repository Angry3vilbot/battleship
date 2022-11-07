function Ship(length, coords){
    return{
        length: length,
        hits: 0,
        sunk: false,
        coordinates: [...coords],
        location: coords,
        hit(){
            this.hits++
        },
        isSunk(){
            if(this.hits === this.length){
                this.sunk = true
                console.log('YOU SANK MY BATTLESHIP!!!!!!!!')
                return true
            }
            else{
                return false
            }
        }
    }
}
function gameBoard(){
    return{
        MissArray: [],
        ShipArray: [],
        HitArray: [],
        damagedArray: [],
        placeShip(coords, length){
            this.ShipArray.push(Ship(length, coords))
        },
        renderPlayerShips(){
            this.ShipArray.forEach(ship => {
                ship = ship.location
                ship.forEach(loc => {
                    let image = document.createElement('img')
                    image.src = 'playerblip.svg'
                    document.querySelector(`[class="${loc}"]`).appendChild(image)
                    document.querySelector(`[class="${loc}"]`).classList.add('hasChild')
                })
            })
        },
        receiveAttack(coords){
                    if(this.MissArray.includes(coords) == false){
                        this.ShipArray.forEach(ship => {
                            if(ship.location.includes(coords)){
                                ship.hit()
                                this.damagedArray.push(coords)
                                this.HitArray.push(coords)
                                ship.isSunk()
                                if(ship.isSunk() == true){
                                    this.damagedArray.length = 0
                                }
                                ship.location.splice(ship.location.indexOf(coords), 1)
                                this.checkWinCondition()
                                return
                            }
                        }, this)
                        this.MissArray.push(coords)
                        this.updateHitDisplay()
                    }
                },
        updateHitDisplay(){
            let cpuGrid = document.getElementById('cpuGrid')
            let playerGrid = document.getElementById('playerGrid')
            cpuBoard.HitArray.forEach(hit => {
                if(cpuGrid.querySelector(`[class="${hit}"]`).hasChildNodes() == false){
                    let image = document.createElement('img')
                    image.src = 'enemyblip.svg'
                    cpuGrid.querySelector(`[class="${hit}"]`).appendChild(image)
                }
            })
            cpuBoard.ShipArray.forEach(ship => {
                if(ship.sunk){
                    ship.coordinates.forEach(loc => {
                        cpuGrid.querySelector(`[class="${loc}"]`).style.outline = "solid 2px rgb(0, 0, 0)"
                    })
                }
            })
            cpuBoard.MissArray.forEach(miss => {
                if(cpuGrid.querySelector(`[class="${miss}"]`).hasChildNodes() == false){
                    let image = document.createElement('img')
                    image.src = 'miss.svg'
                    cpuGrid.querySelector(`[class="${miss}"]`).appendChild(image)
                }
            })
            playerBoard.HitArray.forEach(hit => {
                if(playerGrid.querySelector(`[class="${hit} hasChild"]`).hasChildNodes() == true){
                    let image = playerGrid.querySelector(`[class="${hit} hasChild"]`).querySelector('img')
                    image.src = 'playerhit.svg'
                }
            })
            playerBoard.ShipArray.forEach(ship => {
                if(ship.sunk){
                    ship.coordinates.forEach(loc => {
                        playerGrid.querySelector(`[class="${loc} hasChild"]`).style.outline = "solid 2px rgb(255, 0, 0)"
                    })
                }
            })
            playerBoard.MissArray.forEach(miss => {
                if(playerBoard.HitArray.includes(miss) == false){
                    if(playerGrid.querySelector(`[class="${miss}"]`).hasChildNodes() == false){
                        let image = document.createElement('img')
                        image.src = 'enemymiss.svg'
                        playerGrid.querySelector(`[class="${miss}"]`).appendChild(image)
                    }
                }
            })
        },
        playerAttack(){
            if(cpuBoard.MissArray.includes(parseInt(this.className)) == false){
                cpuBoard.receiveAttack(parseInt(this.classList[0]))
                cpuTurn()
            }
        },
        checkWinCondition(){
            if(cpuBoard.HitArray.length === 20){
                alert('You Win')
            }
            else if(playerBoard.HitArray.length === 20){
                alert('CPU Wins')
            }
        }
    }
}

let playerBoard = new gameBoard
let cpuBoard = new gameBoard
const shipContainer = document.querySelector('#ships')
const ships = document.querySelector('#ships').querySelectorAll('div[draggable="true"]');
const placementBoard = document.querySelector('#ship-placement')
const overlay = document.querySelector('#overlay')
let takenArray = []
let singletons = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91]
let lastOnes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.getAttribute('size'));
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(ev) {
    ev.preventDefault();
    let data = parseInt(ev.dataTransfer.getData("text"));
    let startingCoord = parseInt(ev.target.className)
    if(data == 4){
        let position = startingCoord
        let secondPos = startingCoord+10
        let thirdPos = startingCoord+20
        let fourthPos = startingCoord+30
        if(takenArray.includes(position) || takenArray.includes(secondPos) || takenArray.includes(thirdPos) || takenArray.includes(fourthPos) || secondPos > 100 || thirdPos > 100 || fourthPos > 100){
            return
        }
    }
    else if(data == 3){
        let position = startingCoord
        let secondPos = startingCoord+10
        let thirdPos = startingCoord+20
        if(takenArray.includes(position) || takenArray.includes(secondPos) || takenArray.includes(thirdPos) || secondPos > 100 || thirdPos > 100){
            return
        }
    }
    else if(data == 2){
        let position = startingCoord
        let secondPos = startingCoord+10
        if(takenArray.includes(position) || takenArray.includes(secondPos) || secondPos > 100){
            return
        }
    }
    else{
        let position = startingCoord
        if(takenArray.includes(position)){
            return
        }
    }
    switch(data){
        case 4:
            var secondPos = startingCoord+10
            var thirdPos = startingCoord+20
            var fourthPos = startingCoord+30
            playerBoard.placeShip([startingCoord, startingCoord+10, startingCoord+20, startingCoord+30], data)
            placementBoard.querySelector(`[class="${startingCoord}"]`).classList.add('hasChild')
            placementBoard.querySelector(`[class="${startingCoord+10}"]`).classList.add('hasChild')
            placementBoard.querySelector(`[class="${startingCoord+20}"]`).classList.add('hasChild')
            placementBoard.querySelector(`[class="${startingCoord+30}"]`).classList.add('hasChild')
            if(singletons.includes(startingCoord)){
                takenArray.push(startingCoord, secondPos, thirdPos, fourthPos, startingCoord-10, startingCoord-9, startingCoord+1, secondPos+1, thirdPos+1, fourthPos+1, fourthPos+10, fourthPos+11)
            }
            else if(lastOnes.includes(startingCoord)){
                takenArray.push(startingCoord, secondPos, thirdPos, fourthPos, startingCoord-11, startingCoord-10, startingCoord-1, secondPos-1, thirdPos-1, fourthPos-1, fourthPos+9, fourthPos+10)
            }
            else{
                takenArray.push(startingCoord, secondPos, thirdPos, fourthPos, startingCoord-11, startingCoord-10, startingCoord-9, startingCoord-1, startingCoord+1, secondPos-1, secondPos+1, thirdPos-1, thirdPos+1, fourthPos+1, fourthPos-1, fourthPos+9, fourthPos+10, fourthPos+11)
            }
            shipContainer.querySelector('#battleship').remove()
            break;
        case 3:
            playerBoard.placeShip([startingCoord, startingCoord+10, startingCoord+20], data)
            var secondPos = startingCoord+10
            placementBoard.querySelector(`[class="${startingCoord}"]`).classList.add('hasChild')
            placementBoard.querySelector(`[class="${startingCoord+10}"]`).classList.add('hasChild')
            placementBoard.querySelector(`[class="${startingCoord+20}"]`).classList.add('hasChild')
            if(singletons.includes(startingCoord)){
                takenArray.push(startingCoord, secondPos, secondPos+10, secondPos+11, secondPos+20, secondPos+21, startingCoord+11, startingCoord-10, startingCoord+1)
            }
            else if(lastOnes.includes(startingCoord)){
                takenArray.push(startingCoord, secondPos, secondPos+9, secondPos+10, secondPos+19, secondPos+20, startingCoord+9, startingCoord-1, startingCoord-11, startingCoord-10)
            }
            else{
                takenArray.push(startingCoord, secondPos, secondPos+9, secondPos+10, secondPos+11, secondPos+19, secondPos+20, secondPos+21, startingCoord+11, startingCoord+9, startingCoord-1, startingCoord-11, startingCoord-10, startingCoord-9, startingCoord+1)
            }
            shipContainer.querySelector('#cruiser').remove()
            break;
        case 2:
            playerBoard.placeShip([startingCoord, startingCoord+10], data)
            var secondPos = startingCoord+10
            placementBoard.querySelector(`[class="${startingCoord}"]`).classList.add('hasChild')
            placementBoard.querySelector(`[class="${startingCoord+10}"]`).classList.add('hasChild')
            if(singletons.includes(startingCoord)){
                takenArray.push(startingCoord, secondPos, secondPos+10, secondPos+11, startingCoord+11, startingCoord-10, startingCoord-9, startingCoord+1)
            }
            else if(lastOnes.includes(startingCoord)){
                takenArray.push(startingCoord, secondPos, secondPos+9, secondPos+10, startingCoord+9, startingCoord-1, startingCoord-11, startingCoord-10)
            }
            else{
                takenArray.push(startingCoord, secondPos, secondPos+9, secondPos+10, secondPos+11, startingCoord+11, startingCoord+9, startingCoord-1, startingCoord-11, startingCoord-10, startingCoord-9, startingCoord+1)   
            }
            shipContainer.querySelector('#destroyer').remove()
            break;
        case 1:
            playerBoard.placeShip([startingCoord], data)
            placementBoard.querySelector(`[class="${startingCoord}"]`).classList.add('hasChild')
            if(singletons.includes(startingCoord)){
                takenArray.push(startingCoord, startingCoord+1, startingCoord+10, startingCoord+11, startingCoord-10, startingCoord-9)
            }
            else if(lastOnes.includes(startingCoord)){
                takenArray.push(startingCoord, startingCoord+10, startingCoord+9, startingCoord-1, startingCoord-11, startingCoord-10)
            }
            else{
                takenArray.push(startingCoord, startingCoord+1, startingCoord+10, startingCoord+11, startingCoord+9, startingCoord-1, startingCoord-11, startingCoord-10, startingCoord-9)
            }
            shipContainer.querySelector('#corvette').remove()
            break;
    }
    if(playerBoard.ShipArray.length == 10){
        placementBoard.classList.remove('active')
        overlay.classList.remove('active')
        playerBoard.renderPlayerShips()
    }
}
placementBoard.querySelectorAll('td').forEach(td => {td.setAttribute('ondragover', 'allowDrop(event)'); td.setAttribute('ondrop', "drop(event)")})
ships.forEach(ship => ship.addEventListener("dragenter", (event) => {
    event.preventDefault();
}))

ships.forEach(ship => ship.addEventListener("dragover", (event) => {
    event.preventDefault();
}))

function gameController(){
    function generateCpuShips(){
        let takenPosArray = []
        while(cpuBoard.ShipArray.length < 4){
            let i = 0
            let position = Math.floor(Math.random()*100 + 1)
                if(takenPosArray.includes(position)){
                    i--
                }
                else{
                    if(singletons.includes(position)){
                        takenPosArray.push(position, position+1, position+10, position+11, position-10, position-9)
                    }
                    else if(lastOnes.includes(position)){
                        takenPosArray.push(position, position+10, position+9, position-1, position-11, position-10)
                    }
                    else{
                        cpuBoard.placeShip([position], 1)
                        takenPosArray.push(position, position+1, position+10, position+11, position+9, position-1, position-11, position-10, position-9)
                    }
                }
                
        }
        while(cpuBoard.ShipArray.length < 7){
            let position = Math.floor(Math.random()*100 + 1)
            let secondPosArray = [position+1, position+10]
            let secondPos = secondPosArray[Math.floor(Math.random()*secondPosArray.length)]
            let i = 0
                if(takenPosArray.includes(position) || takenPosArray.includes(secondPos)){
                    i--
                }
                else if(position%10 == 0 || secondPos > 100){
                    i--
                }
                else{
                    if(singletons.includes(position) && (secondPos == position+10) == false){
                        takenPosArray.push(position, secondPos, secondPos+10, secondPos+11, position-10, secondPos-10, position+10, secondPos+1, secondPos-9)
                    }
                    else if(lastOnes.includes(secondPos) && (secondPos == position+10) == false){
                        takenPosArray.push(position, secondPos, secondPos+9, secondPos+10, position+9, position-1, position-11, position-10, secondPos-10)
                    }
                    else if(singletons.includes(position) && (secondPos == position+10) == true){
                        takenPosArray.push(position, secondPos, secondPos+10, secondPos+11, position+11, position-10, position-9, position+1)
                    }
                    else if(lastOnes.includes(position) && (secondPos == position+10) == true){
                        takenPosArray.push(position, secondPos, secondPos+9, secondPos+10, position+9, position-1, position-11, position-10)
                    }
                    else{
                        cpuBoard.placeShip([position, secondPos], 2)
                        if(secondPos == position+10){
                            takenPosArray.push(position, secondPos, secondPos+9, secondPos+10, secondPos+11, position+11, position+9, position-1, position-11, position-10, position-9, position+1)
                        }
                        else{
                            takenPosArray.push(position, secondPos, position+10, position+11, position+9, position-1, position-11, position-10, position-9, secondPos+1, secondPos+11, secondPos-9)
                        }
                }
                }
                
        }
        while(cpuBoard.ShipArray.length < 9){
            let position = Math.floor(Math.random()*100 + 1)
            let secondPosArray = [position+1, position+10]
            let secondPos = secondPosArray[Math.floor(Math.random()*secondPosArray.length)]
            let i = 0
                if(secondPos = position+1){
                    var thirdPos = secondPos+1
                }
                else{
                    var thirdPos = secondPos+10
                }
                if(takenPosArray.includes(position) || takenPosArray.includes(secondPos) || takenPosArray.includes(thirdPos)){
                    i--
                }
                else if((position%10 == 0 && secondPos == position+1)|| (position%10 == 9 && secondPos == position+1) || secondPos > 100 || thirdPos > 100){
                    i--
                }
                else{
                    cpuBoard.placeShip([position, secondPos, thirdPos], 3)
                    if(secondPos == position+10){
                        if(singletons.includes(position)){
                            takenPosArray.push(position, secondPos, secondPos+10, secondPos+11, secondPos+20, secondPos+21, position+11, position-10, position+1, position-9)
                        }
                        else if(lastOnes.includes(position)){
                            takenPosArray.push(position, secondPos, secondPos+9, secondPos+10, secondPos+19, secondPos+20, position+9, position-1, position-11, position-10)
                        }
                        else{
                            takenPosArray.push(position, secondPos, thirdPos, position-10, thirdPos+10, position-1, position+1, secondPos-1, secondPos+1, thirdPos-1, thirdPos+1, thirdPos+9, thirdPos+11, position-9, position-11)
                        }
                    }
                    else{
                        if(singletons.includes(position)){
                            takenPosArray.push(position, secondPos, secondPos+10, secondPos+11, position-10, position+10, secondPos-10, thirdPos, thirdPos-10, thirdPos+1, thirdPos+11, thirdPos-9)
                        }
                        else if(lastOnes.includes(thirdPos)){
                            takenPosArray.push(position, secondPos, secondPos+9, secondPos+10, position+9, position-1, position-11, position-10, secondPos-10, thirdPos, thirdPos-10, thirdPos+10)
                        }
                        else{
                            takenPosArray.push(position, secondPos, thirdPos, position-1, thirdPos+1, position+9, position+10, position+11, thirdPos+10, thirdPos+11, position-11, position-10, position-9, thirdPos-10, thirdPos-9)
                        }
                    }
                }
        }
        while(cpuBoard.ShipArray.length < 10){
            let position = Math.floor(Math.random()*100 + 1)
            let secondPosArray = [position+1, position+10]
            let secondPos = secondPosArray[Math.floor(Math.random()*secondPosArray.length)]
            let i = 0
            if(secondPos = position+1){
                var thirdPos = secondPos+1
                var fourthPos = secondPos+2
            }
            else{
                var thirdPos = secondPos+10
                var fourthPos = secondPos+20
            }
                if(takenPosArray.includes(position) || takenPosArray.includes(secondPos) || takenPosArray.includes(thirdPos) || takenPosArray.includes(fourthPos)){
                    i--
                }
                else if((position%10 == 0 && secondPos == position+1) || (position%10 == 9 && secondPos == position+1) || (position%10 == 8 && secondPos == position+1) || secondPos > 100 || thirdPos > 100 || fourthPos > 100){
                    i--
                }
                else{
                    cpuBoard.placeShip([position, secondPos, thirdPos, fourthPos], 4)
                    if(secondPos == position+10){
                        if(singletons.includes(position) && (secondPos == position+10) == true){
                            takenArray.push(position, secondPos, secondPos+10, secondPos+11, secondPos+20, secondPos+21, position+11, position-10, position+1, fourthPos+10, fourthPos+11, position-9)
                        }
                        else if(lastOnes.includes(position) && (secondPos == position+10) == true){
                            takenArray.push(position, secondPos, secondPos+9, secondPos+10, secondPos+19, secondPos+20, position+9, position-1, position-11, position-10, fourthPos+10, fourthPos+9)
                        }
                        if(singletons.includes(position) && (secondPos == position+10) == false){
                            takenArray.push(position, secondPos, secondPos+10, secondPos+11, position-10, fourthPos+10, fourthPos+11, position-9, position+10, thirdPos, fourthPos, thirdPos-10, fourthPos-10, fourthPos-9, fourthPos+1)
                        }
                        else if(lastOnes.includes(fourthPos) && (secondPos == position+10) == false){
                            takenArray.push(position, secondPos, secondPos+9, secondPos+10, position+9, position-1, position-11, position-10, fourthPos+10, fourthPos+9, fourthPos-10, thirdPos-10, secondPos-10, thirdPos, fourthPos)
                        }
                        else{
                            takenPosArray.push(position, secondPos, thirdPos, fourthPos, position-11, position-10, position-9, position-1, position+1, secondPos-1, secondPos+1, thirdPos-1, thirdPos+1, fourthPos+1, fourthPos-1, fourthPos+9, fourthPos+10, fourthPos+11)
                        }
                    }
                    else{
                        takenPosArray.push(position, secondPos, thirdPos, fourthPos, position-1, position-11, position-10, position-9, position+10, position+9, position+11, thirdPos-10, thirdPos+10, fourthPos-10, fourthPos+10, fourthPos-9, fourthPos+11, fourthPos+1)
                    }
                    i++
                }
        }
    }
    generateCpuShips()
    playerBoard.renderPlayerShips()
    let cpuGrid = document.getElementById('cpuGrid')
    cpuGrid.querySelectorAll('td').forEach(td => td.addEventListener('click', cpuBoard.playerAttack))
}

function cpuTurn(){
    console.log(playerBoard.damagedArray.length > 0)
    if(playerBoard.damagedArray.length > 0){
        let move = Math.floor(Math.random()*100 + 1)
        if(playerBoard.damagedArray.includes(move+1) || playerBoard.damagedArray.includes(move-1) || playerBoard.damagedArray.includes(move+10) || playerBoard.damagedArray.includes(move-10)){
            console.log('Move is valid')
            if(playerBoard.MissArray.includes(move) == false){
                console.log(`${move} next to damaged`)
                playerBoard.receiveAttack(move)
            }
            else{
                cpuTurn()
            }
        }
        else{
            cpuTurn()
        }
    }
    else{
        let move = Math.floor(Math.random()*100 + 1)
        if(playerBoard.MissArray.includes(move) == false){
            playerBoard.receiveAttack(move)
        }
        else{
            cpuTurn()
        }
    }
    
}
window.onload = gameController