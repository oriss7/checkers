'use strict'

function init() {
	initState()
	renderBoard(gGame.board)
}

function cellClicked(i, j) {
	// updateModel(i,j) // correct flow
	// updateView()
	var currCell = getCell(i, j)
	if (getIsFirstClick()) {
		FirstClick(currCell)
	} else{
		SecondClick(currCell)
	}
}

function FirstClick(currCell) {
	doUnmarkCells()
	const playerData = getPlayerRenderData()
	getAllPossibleMoves(currCell, playerData)
	doMarkCells()
}

function SecondClick(currCell) {
	var isSuccessfulMove = false
	for (var i = 0; i < gGame.possibleWalkingCells.length; i++) {
		if (currCell === gGame.possibleWalkingCells[i]) {
			executeMove(currCell)
			isSuccessfulMove = true
		}
	}
	for (var i = 0; i < gGame.possibleEatingCells.length; i++) {
		if (currCell === gGame.possibleEatingCells[i].moveTo &&
			currCell.isMarked) {
			executeMove(currCell)
			var eatenCell = gGame.possibleEatingCells[i].cellToEat
			eatenCell.cellContent = EMPTY
			renderCell(eatenCell)
			isSuccessfulMove = true
		}
	}
	doUnmarkCells()
	tryTurnToKing(currCell)
	checkVictory()
	if (isSuccessfulMove) {
		switchTurn()
	}
	if (!gGame.isPlayerOneTurn && gGame.isOn) {
		manageComputerMove()
		switchTurn()
	}
	gGame.isFirstClick = true
}

function executeMove(currCell) {
	currCell.cellContent = gGame.currentSoldier.cellContent
	renderCell(currCell)
	// eventEmitter.emit('cellUpdated', cell, location)
	gGame.currentSoldier.cellContent = EMPTY
	renderCell(gGame.currentSoldier)
}

function tryTurnToKing(currCell) {
	if (currCell.cellContent === BLACKPLYER && currCell.location.i === 0) {
		currCell.cellContent = BLACKKING
		renderCell(currCell)
	} else if (currCell.cellContent === WHITEPLYER && currCell.location.i === 7) {
		currCell.cellContent = WHITEKING
		renderCell(currCell)
	}
}

function manageComputerMove() { // perhaps this function needs to be placed in the controller
	executeCompMove()
	doUnmarkCells()
	checkVictory()
}

function doMarkCells() {
	markAllRelevantCells();
	markOrUnmarkInAllCellsDom();
}

function doUnmarkCells() {
	unmarkAllRelevantCells()
	// const isComMove = getIsComputerMove()
	// if (isComMove) markOrUnMarkInAllCellsDom()
	markOrUnmarkInAllCellsDom();
	resetMoveArrs()
}

function alertWinner(msg) {
	var alertAnswer = confirm(msg + '\nDo you want to play again?')
    gGame.isOn = false
    if (alertAnswer) {
        init()
    }
}

// const isVictory = checkVictory();
// if (isVictory) {
// 	aleryVictory();
// }