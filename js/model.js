'use strict'
const WHITEPLYER = '🥶'
const BLACKPLYER = '🥵'
const WHITEKING = '👮'
const BLACKKING = '💂'
const EMPTY = ''
const size = 8
var gGame

function initState() {
	gGame = {
		board: buildBoard(),
		isOn: true,
		isPlayerOneTurn: true,
		isFirstClick: true,
		currentSoldier: {},
		possibleWalkingCells: [],
		possibleEatingCells: []
	}
}

function buildBoard() {
	var board = []
	for (let i = 0; i < size; i++) {
		board.push([])
		for (let j = 0; j < size; j++) {
			let content
			if (i % 2 !== j % 2) {
				if (i === 0 || i === 1 || i === 2) content = WHITEPLYER 
				else if (i === 3 || i === 4) content = EMPTY
				else if (i === 5 || i === 6 || i === 7) content = BLACKPLYER
			} else content = EMPTY
			board[i][j] = {
				location: {i, j},
				cellContent: content,
				isMarked: false
			}
		}
	}
	return board
}

function getAllPossibleMoves(currCell, playerData) {
	if (currCell.cellContent === playerData.playingPlayer) {
		gGame.currentSoldier = currCell
		checkAllPlayerMoves(currCell, playerData)
		gGame.isFirstClick = false
	}
	else if (currCell.cellContent === playerData.playingKing) {
		gGame.currentSoldier = currCell
		checkAllKingMoves(currCell, playerData)
		gGame.isFirstClick = false
	}
	else if (currCell.cellContent === EMPTY
		|| currCell.cellContent === playerData.opponentPlayer
		|| currCell.cellContent === playerData.opponentKing) {
		return
	}
}

function checkAllPlayerMoves(currCell, playerData) {
	soldierMoveEat(currCell, playerData, true)
	soldierMoveEat(currCell, playerData, false)
}

function checkAllKingMoves(currCell, playerData) {
	kingMoveEat(currCell, playerData, true, true)
	kingMoveEat(currCell, playerData, false, true)
	kingMoveEat(currCell, playerData, false, false)
	kingMoveEat(currCell, playerData, true, false)
}

function soldierMoveEat(currCell, playerData, isRightMove) {
	var i = currCell.location.i
	var j = currCell.location.j
	var iMove;
	var iEat;
	var jMove;
	var jEat;

	if (gGame.isPlayerOneTurn) {
		iMove = i - 1
		iEat = i - 2
	} else {
		iMove = i + 1
		iEat = i + 2
	}
	if (isRightMove) {
		jMove = j + 1
		jEat = j + 2
	} else {
		jMove = j - 1
		jEat = j - 2
	}
	var targetCell
	var eatingCell
	
	if (jMove > -1 && jMove < size) {
		targetCell = getCell(iMove, jMove)
		if (targetCell.cellContent === EMPTY) {
			gGame.possibleWalkingCells.push(targetCell)
		} 
		else if (targetCell.cellContent === playerData.opponentPlayer
			|| targetCell.cellContent === playerData.opponentKing) {
			if (jEat > -1 && jEat < size && iEat > -1 && iEat < size) {
				eatingCell = targetCell
				targetCell = getCell(iEat, jEat)
				if (targetCell.cellContent === EMPTY) {
					gGame.possibleEatingCells.push({cellToEat: eatingCell,
					 moveTo: targetCell})
				}
			}
		} else if (targetCell.cellContent === playerData.playingPlayer
			|| targetCell.cellContent === playerData.playingKing) {
			return
		}
	}
}

function kingMoveEat(currCell, playerData, isRightMove, isUpMove) {
	var i = currCell.location.i
	var j = currCell.location.j
	var iMove = i
	var jMove = j
	var targetCell
	var eatingCell

	// const iDif = isUpMove? -1 :1;
	// const jDif = isRightMove? -1 :1;
	// nextTargetCell = gGame.board[iMove+iDif][jMove+jDif] // BETTER!;
	
	var nextTargetCell = 1

	// if ((iMove-1 > -1 && jMove+1 < size) || (iMove+1 < size && jMove+1 < size)
	// 	|| (iMove+1 < size && jMove-1 > -1) || (iMove-1 > -1 && jMove-1 > -1)) {
	// 	const iDif = isUpMove? -1 :1
	// 	const jDif = isRightMove? 1 :-1
	// 	nextTargetCell = getCell(iMove+iDif, jMove+jDif)
	// }

	if (isUpMove && isRightMove && iMove-1 > -1 && jMove+1 < size) {
		nextTargetCell = getCell(iMove-1, jMove+1)
	} else if (!isUpMove && isRightMove && iMove+1 < size && jMove+1 < size) {
		nextTargetCell = getCell(iMove+1, jMove+1)
	} else if (!isUpMove && !isRightMove && iMove+1 < size && jMove-1 > -1) {
		nextTargetCell = getCell(iMove+1, jMove-1)
	} else if (isUpMove && !isRightMove && iMove-1 > -1 && jMove-1 > -1) {
		nextTargetCell = getCell(iMove-1, jMove-1)
	}

	if (nextTargetCell === 1) return

	while (nextTargetCell.cellContent === EMPTY) {
		// iMove += iDif;
		// jMove += jDif
		if (isUpMove && isRightMove && iMove-1 > -1 && jMove+1 < size) {
			iMove -= 1
			jMove += 1
		} else if (!isUpMove && isRightMove && iMove+1 < size && jMove+1 < size) {
			iMove += 1
			jMove += 1
		} else if (!isUpMove && !isRightMove && iMove+1 < size && jMove-1 > -1) {
			iMove += 1
			jMove -= 1
		} else if (isUpMove && !isRightMove && iMove-1 > -1 && jMove-1 > -1) {
			iMove -= 1
			jMove -= 1
		}
		targetCell = gGame.board[iMove][jMove]
		gGame.possibleWalkingCells.push(targetCell)
		if (isUpMove && isRightMove && iMove-1 > -1 && jMove+1 < size) {
			nextTargetCell = gGame.board[iMove-1][jMove+1]
		} else if (!isUpMove && isRightMove && iMove+1 < size && jMove+1 < size) {
			nextTargetCell = gGame.board[iMove+1][jMove+1]
		} else if (!isUpMove && !isRightMove && iMove+1 < size && jMove-1 > -1) {
			nextTargetCell = gGame.board[iMove+1][jMove-1]
		} else if (isUpMove && !isRightMove && iMove-1 > -1 && jMove-1 > -1) {
			nextTargetCell = gGame.board[iMove-1][jMove-1]
		} else {
			break
		}
	} 
	if (nextTargetCell.cellContent === playerData.opponentPlayer
		|| nextTargetCell.cellContent === playerData.opponentKing) {
		eatingCell = nextTargetCell
		if (isUpMove && isRightMove && iMove-2 > -1 && jMove+2 < size) {
			nextTargetCell = gGame.board[iMove-2][jMove+2]
		} else if (!isUpMove && isRightMove && iMove+2 < size && jMove+2 < size) {
			nextTargetCell = gGame.board[iMove+2][jMove+2]
		} else if (!isUpMove && !isRightMove && iMove+2 < size && jMove-2 > -1) {
			nextTargetCell = gGame.board[iMove+2][jMove-2]
		} else if (isUpMove && !isRightMove && iMove-2 > -1 && jMove-2 > -1) {
			nextTargetCell = gGame.board[iMove-2][jMove-2]
		}
		if (nextTargetCell.cellContent === EMPTY) {
			gGame.possibleEatingCells.push({cellToEat: eatingCell,
					 moveTo: nextTargetCell})
		}
	} else if (nextTargetCell.cellContent === playerData.playingPlayer
		|| nextTargetCell.cellContent === playerData.playingKing) {
		return
	}
}

////////////////////////////// computer moves functions:

function executeCompMove() {
	const compPossibleMoves = getCompOptMoves()
	var randIdx = getRandomIntInclusive(0, compPossibleMoves.length-1)
	var chosenCell = compPossibleMoves[randIdx]
	var currCell
	if (chosenCell.possibleEatingCells.length > 0) {
		var randNum = getRandomIntInclusive(0, chosenCell.possibleEatingCells.length-1)
		currCell = chosenCell.possibleEatingCells[randNum].moveTo
	} else if (chosenCell.possibleWalkingCells.length > 0) {
		randNum = getRandomIntInclusive(0, chosenCell.possibleWalkingCells.length-1)
		currCell = chosenCell.possibleWalkingCells[randNum]
	}
	for (var i = 0; i < chosenCell.possibleWalkingCells.length; i++) { // try avoiding loop!
		if (currCell === chosenCell.possibleWalkingCells[i]) {
			currCell.cellContent = chosenCell.currentSoldier.cellContent
			renderCell(currCell)
			chosenCell.currentSoldier.cellContent = EMPTY
			renderCell(chosenCell.currentSoldier)
		}
	}
	for (var i = 0; i < chosenCell.possibleEatingCells.length; i++) {
		if (currCell === chosenCell.possibleEatingCells[i].moveTo) {
			currCell.cellContent = chosenCell.currentSoldier.cellContent
			renderCell(currCell)
			chosenCell.currentSoldier.cellContent = EMPTY
			renderCell(chosenCell.currentSoldier)
			var eatenCell = chosenCell.possibleEatingCells[i].cellToEat
			eatenCell.cellContent = EMPTY
			renderCell(eatenCell)
		}
	}
	tryTurnToKing(currCell)
}

function getCompOptMoves() {
	var compPossibleMoves = []
	var num = 0
	const playerData = getPlayerRenderData()
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (gGame.board[i][j].cellContent === WHITEPLYER || 
				gGame.board[i][j].cellContent === WHITEKING) {
				unmarkAllRelevantCells()
				resetMoveArrs()
				getAllPossibleMoves(gGame.board[i][j], playerData)
				markAllRelevantCells()
				if (gGame.possibleWalkingCells.length !== 0 ||
					gGame.possibleEatingCells.length !== 0) {
					compPossibleMoves[num] = {
						currentSoldier: gGame.currentSoldier,
						possibleWalkingCells: gGame.possibleWalkingCells,
						possibleEatingCells: gGame.possibleEatingCells
					}
					num += 1
				}
			}
		}
	}
	return compPossibleMoves;
}

////////////////////////////// small functions:

function getPlayerRenderData() {
	if (gGame.isPlayerOneTurn) {
		return {
			playingPlayer: BLACKPLYER,
			playingKing: BLACKKING,
			opponentPlayer: WHITEPLYER,
			opponentKing: WHITEKING
		}
	} else return {
		playingPlayer: WHITEPLYER,
		playingKing: WHITEKING,
		opponentPlayer: BLACKPLYER,
		opponentKing: BLACKKING
	}
}

function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function switchTurn() {
	gGame.isPlayerOneTurn = !gGame.isPlayerOneTurn;
}

function checkVictory() {
	var whiteWin = true
	var blackWin = true
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			if (gGame.board[i][j].cellContent === WHITEPLYER
				|| gGame.board[i][j].cellContent === WHITEKING) {
				if (blackWin) {
					blackWin = false
				}
			}
			if (gGame.board[i][j].cellContent === BLACKPLYER
				|| gGame.board[i][j].cellContent === BLACKKING) {
				if (whiteWin) {
					whiteWin = false
				}
			}
		}
	}
	if (whiteWin) {
		alertWinner('White Win!')
	} else if (blackWin) {
		alertWinner('Black Win!')
	}
}

////////////////////////////// mark functions:

function resetMoveArrs() {
	gGame.possibleWalkingCells = []
	gGame.possibleEatingCells = []
}

function markAllRelevantCells() {
	gGame.possibleWalkingCells.forEach(c => markCell(c))
	gGame.possibleEatingCells.forEach(c => markCell(c.moveTo))
}

function unmarkAllRelevantCells() {
	gGame.possibleWalkingCells.forEach(c => unmarkCell(c))
	gGame.possibleEatingCells.forEach(c => unmarkCell(c.moveTo))
}

function markCell(targetCell) {
	targetCell.isMarked = true
}

function unmarkCell(targetCell) {
	targetCell.isMarked = false
}

////////////////////////////// get functions:

// board: buildBoard(),
// 		isOn: true,
// 		isPlayerOneTurn: true,
// 		isFirstClick: true,
// 		currentSoldier: {},
// 		possibleWalkingCells: [],
// 		possibleEatingCells: []

function getCell(i, j) {
	return gGame.board[i][j]
}

function getIsFirstClick() {
	return gGame.isFirstClick
}

function getIsGameOn() {
	return gGame.isOn
}

function getPossibleWalkingCells() {
	return gGame.possibleWalkingCells
}

function getPossibleEatingCells() {
	return gGame.possibleEatingCells
}

function getIsComputerMove() {
	return gGame.isPlayerOneTurn
}

// eventEmitter.on('cellUpdasted', (cell, location) => {

// })


// if (isUpMove && isRightMove && iMove-1 > -1 && jMove+1 < size) {
// 	nextTargetCell = gGame.board[iMove-1][jMove+1]
// } else if (!isUpMove && isRightMove && iMove+1 < size && jMove+1 < size) {
// 	nextTargetCell = gGame.board[iMove+1][jMove+1]
// } else if (!isUpMove && !isRightMove && iMove+1 < size && jMove-1 > -1) {
// 	nextTargetCell = gGame.board[iMove+1][jMove-1]
// } else if (isUpMove && !isRightMove && iMove-1 > -1 && jMove-1 > -1) {
// 	nextTargetCell = gGame.board[iMove-1][jMove-1]
// }