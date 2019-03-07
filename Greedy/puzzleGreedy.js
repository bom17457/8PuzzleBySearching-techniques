/**
 * 
 * Akaporn Katip
 * Rajamangala University of Technology Tawan-Ok : CharKarBongse Bhuvanarth Campus
 * ComputerScience Student.
 * Subject: A.I.
 * 
 */

//move blank to up
function swapUp(state) {
    let blankPOS = findBlankCell(state)
    return swap(state, { y: blankPOS.y - 1, x: blankPOS.x })
}

//move blank to down
function swapDown(state) {
    let blankPOS = findBlankCell(state)
    return swap(state, { y: blankPOS.y + 1, x: blankPOS.x })
}

//move blank to left
function swapLeft(state) {
    let blankPOS = findBlankCell(state)
    return swap(state, { y: blankPOS.y, x: blankPOS.x - 1 })
}

//move blank to right
function swapRight(state) {
    let blankPOS = findBlankCell(state)
    return swap(state, { y: blankPOS.y, x: blankPOS.x + 1 })
}

//move the blank to target position
function swap(state, targetPOS = { x: 0, y: 0 }) {
    let blankPOS = findBlankCell(state)
    let newState = []
    copyArray(state, newState);
    try {
        if ((targetPOS.y > newState.length - 1) || (targetPOS.x > newState.length - 1)) throw 'out of length'
        newState[blankPOS.y][blankPOS.x] = state[targetPOS.y][targetPOS.x]
        newState[targetPOS.y][targetPOS.x] = "_"
    } catch (err) {
        return false
    }

    return newState
}

function findBlankCell(state) {
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            if (state[i][j] == "_") {
                return {
                    y: i,
                    x: j
                }
            }
        }
    }

    return { x: 0, y: 0 }
}


function findIndex(state, value) {
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            if (state[i][j] == value) {
                return {
                    y: i,
                    x: j
                }
            }
        }
    }

    return { x: 0, y: 0 }
}

//count the match value in table
function macthCount(current, goal) {
    let matchC = 0;
    for (let i = 0; i < current.length; i++) {
        for (let j = 0; j < current[i].length; j++) {
            if (current[i][j] == goal[i][j]) {
                matchC++;
            }
        }
    }
    return (matchC==9)?true:false;
}

//count a distance from initail target to goal target
function distanceCount(current, goal) {
    let distance = 0;
    let currentPOS = {}
    let targetPOS = {}    
    if (typeof (current) === "boolean") {
        return 0
    } else {
        current.map((item) => {
            item.map((item) => {
                currentPOS = findIndex(current, item)
                targetPOS = findIndex(goal, item)
                distance += (Math.abs((currentPOS.x - targetPOS.x) + (currentPOS.y - targetPOS.y)))
            })
        })
    }


    return (distance)
}

//render a 2d array
function render(state, ...str) {
    if (state == false) {
        console.log(state)
    } else {
        for (let i = 0; i < state.length; i++) {
            console.log(state[i])
        }

        str.map((command) => {
            if (command == '\n') {
                console.log('')
            } else {
                console.log(command)
            }
        })
    }

}

function copyArray(from, to) {
    for (i = 0; i < from.length; i++) {
        to.push([])
        for (j = 0; j < from[i].length; j++) {
            to[i][j] = from[i][j]
        }
    }
}

function algorithm() {

    const initialState = [
        ['1', '2', '3'],
        ['8', '5', '6'],
        ['4', '7', '_']
    ];

    const goalState = [
        ['1', '2', '3'],
        ['8', '6', '_'],
        ['4', '5', '7']
    ];

    return {
        start: () => {
            if (initialState == goalState) {
                render(initialState)
                return initialState
            } else {
                let current = initialState
                let best_node = []
                let child_layer = []
                let layer = 0

                best_node.push(initialState)

                render(initialState, 'initailStaet')
                render(goalState, 'goalState\n')
                while (!macthCount(current, goalState)) {
                    console.log('_________________________________________\nlayer:', layer, '\n=====')
                    child_layer = []
                    
                    //move step Left Up Right Down
                    if(swapLeft(current)!=false)child_layer.push({ state: swapLeft(current), score: distanceCount(swapLeft(current), goalState) })
                    if(swapUp(current)!=false)child_layer.push({ state: swapUp(current), score: distanceCount(swapUp(current), goalState) })
                    if(swapRight(current)!=false)child_layer.push({ state: swapRight(current), score: distanceCount(swapRight(current), goalState) })
                    if(swapDown(current)!=false)child_layer.push({ state: swapDown(current), score: distanceCount(swapDown(current), goalState) })                                        
                    
                    //remove item is same in best_node
                    for(let i = 0; i < child_layer.length; i++){                        
                        for(let j = 0; j < best_node.length; j++){
                            let remove = macthCount(child_layer[i].state,best_node[j])
                            if(remove){
                                child_layer.splice(i, 1)
                                break;
                            }
                        }
                    }
                    
                    //show state to display
                    child_layer.map((item, i) => {                        
                        best_node.map((best_item) => {
                            if (best_item == item.state) {
                                child_layer.splice(i, 1)
                            }
                        })
                        render(item.state, `^Score:${item.score}\n`)
                    })

                    //get the heuristic
                    let currentScore = 0;
                    for (let i = 0; i < child_layer.length; i++) {
                        if ((child_layer[i].score < currentScore)) {
                            currentScore = child_layer[i].score                            

                        } else if (i == 0) {
                            currentScore = child_layer[i].score                        
                        }
                    }
                    let best_score = currentScore
                    console.log('best score:', best_score)

                    //set new state to current state and add to best_node
                    child_layer.map((item) => {
                        if(item.score == best_score){
                            best_node.push(item.state)
                            current = []                                                    
                            copyArray(item.state, current)
                        }
                    })
                   
                    layer++;                                   
                }
            }
        }
    }
}

greedy = algorithm()
greedy.start()