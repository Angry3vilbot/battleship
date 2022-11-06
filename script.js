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
                                this.HitArray.push(coords)
                                ship.isSunk()
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
            cpuBoard.receiveAttack(parseInt(this.classList[0]))
            cpuTurn()
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

function gameController(){
    function generateCpuShips(){
        let takenPosArray = []
        for(let i = 0; i < 4; i++){
            let position = Math.floor(Math.random()*100 + 1)
                if(takenPosArray.includes(position)){
                    i--
                }
                else{
                    cpuBoard.placeShip([position], 1)
                    takenPosArray.push(position, position+1, position+10, position+11, position+9, position-1, position-11, position-10, position-9)
                }
        }
        for(let i = 0; i < 3; i++){
            let position = Math.floor(Math.random()*100 + 1)
            let secondPosArray = [position+1, position+10]
            let secondPos = secondPosArray[Math.floor(Math.random()*secondPosArray.length)]
                if(takenPosArray.includes(position) || takenPosArray.includes(secondPos)){
                    i--
                }
                else if(position%10 == 0 || secondPos > 100){
                    i--
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
        for(let i = 0; i < 2; i++){
            let position = Math.floor(Math.random()*100 + 1)
            let secondPosArray = [position+1, position+10]
            let secondPos = secondPosArray[Math.floor(Math.random()*secondPosArray.length)]
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
                        takenPosArray.push(position, secondPos, thirdPos, position-10, thirdPos+10, position-1, position+1, secondPos-1, secondPos+1, thirdPos-1, thirdPos+1, thirdPos+9, thirdPos+11, position-9, position-11)
                    }
                    else{
                        takenPosArray.push(position, secondPos, thirdPos, position-1, thirdPos+1, position+9, position+10, position+11, thirdPos+10, thirdPos+11, position-11, position-10, position-9, thirdPos-10, thirdPos-9)
                    }
                }
        }
        for(let i = 0; i < 1; i++){
            let position = Math.floor(Math.random()*100 + 1)
            let secondPosArray = [position+1, position+10]
            let secondPos = secondPosArray[Math.floor(Math.random()*secondPosArray.length)]
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
                        takenPosArray.push(position, secondPos, thirdPos, fourthPos, position-11, position-10, position-9, position-1, position+1, secondPos-1, secondPos+1, thirdPos-1, thirdPos+1, fourthPos+1, fourthPos-1, fourthPos+9, fourthPos+10, fourthPos+11)
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
    let move = Math.floor(Math.random()*100 + 1)
    if(playerBoard.MissArray.includes(move) == false){
        playerBoard.receiveAttack(move)
    }
    else{
        cpuTurn()
    }
}
window.onload = gameController