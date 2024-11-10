'use strict'

function renderBoard(board) {
	const selector = '.board-container'
	const elContainer = document.querySelector(selector)
	let htmlStr = '<table>'
	for (let i = 0; i < board.length; i++) {
		htmlStr += `<tr class="row-${i}">`
		const row = board[i]
		for (let j = 0; j < row.length; j++) {
			const currCell = row[j]
			const color = getCellBgColor(currCell, {i, j});
			htmlStr += `<td style="background-color:${color}
				"onclick="cellClicked(${i}, ${j})" class="col-${i}-${j}">
		    ${currCell.cellContent}</td>`
		}
		htmlStr += '</tr>'
	}
	htmlStr += '</table>'
	elContainer.innerHTML = htmlStr
}

function renderCell(cell) {
	const selector = `.col-${cell.location.i}-${cell.location.j}`
	const element = document.querySelector(selector)
	element.style.backgroundColor = getCellBgColor(cell, cell.location)
	element.innerHTML = cell.cellContent
}

function getCellBgColor(cell, {i, j}) {
	if (cell.isMarked) {
		return 'red'
	} else if (i % 2 !== j % 2) {
		return 'black'
	} else {
		return 'white'
	}
}

function markOrUnmarkInAllCellsDom() {
	const cellsToUnmark = [
		...getPossibleWalkingCells(),
		...getPossibleEatingCells().map(c => c.moveTo)
	]
	// const isComMove = getIsComputerMove();
	// // if (isComMove) return;
	cellsToUnmark.forEach(c => renderCell(c));
}