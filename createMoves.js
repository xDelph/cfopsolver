const possibleMoves = ['U', "U'", 'D', "D'", 'R', "R'", 'L', "L'", 'F', "F'", 'B', "B'"]
const invert = { U: "U'", "U'": 'U', D: "D'", "D'": 'D', R: "R'", "R'": 'R', L: "L'", "L'": 'L', B: "B'", "B'": 'B', F: "F'", "F'": 'F' }

let twoMoves = []
let threeMoves = []
let fourMoves = []

function checkIfThreeMovesUseless (one, two, three) {
  if (one === invert[three] && (one === 'U' || one === "U'") && (two === 'D' || two === "D'")) return true
  if (one === invert[three] && (one === 'D' || one === "D'") && (two === 'U' || two === "U'")) return true

  if (one === invert[three] && (one === 'R' || one === "R'") && (two === 'L' || two === "L'")) return true
  if (one === invert[three] && (one === 'L' || one === "L'") && (two === 'R' || two === "R'")) return true

  if (one === invert[three] && (one === 'F' || one === "F'") && (two === 'B' || two === "B'")) return true
  if (one === invert[three] && (one === 'B' || one === "B'") && (two === 'F' || two === "F'")) return true

  return false
}

function checkIfTwoMoveAlreadyStored (one, two) {
  return one === two && twoMoves.indexOf(`${invert[one]} ${invert[two]}`) !== -1
}

function checkIfThreeMoveAlreadyStored (one, two, three) {
  return (
    (one === two && threeMoves.indexOf(`${invert[one]} ${invert[two]} ${three}`) !== -1) ||
    (two === three && threeMoves.indexOf(`${one} ${invert[two]} ${invert[three]}`) !== -1)
  )
}

function checkIfFourMoveAlreadyStored (one, two, three, four) {
  return (
    (one === two && fourMoves.indexOf(`${invert[one]} ${invert[two]} ${three} ${four}`) !== -1) ||
    (two === three && fourMoves.indexOf(`${one} ${invert[two]} ${invert[three]} ${four}`) !== -1) ||
    (three === four && fourMoves.indexOf(`${one} ${two} ${invert[three]} ${invert[four]}`) !== -1)
  )
}

for (let i of possibleMoves) {
  for (let j of possibleMoves) {
    if (invert[i] !== j && !checkIfTwoMoveAlreadyStored(i, j)) twoMoves.push(`${i} ${j}`)

    for (let k of possibleMoves) {
      if (`${i}${i}${i}` === `${i}${j}${k}` || checkIfThreeMovesUseless(i, j, k) || checkIfThreeMoveAlreadyStored(i, j, k)) continue
      if (invert[i] !== j && invert[j] !== k) threeMoves.push(`${i} ${j} ${k}`)

      for (let l of possibleMoves) {
        if (`${j}${j}${j}` === `${j}${k}${l}` || checkIfThreeMovesUseless(j, k, l) || checkIfFourMoveAlreadyStored(i, j, k, l)) continue
        if (invert[i] !== j && invert[j] !== k && invert[k] !== l) fourMoves.push(`${i} ${j} ${k} ${l}`)
      }
    }
  }
}

console.log('writing ' + './moves/twoMoves.json with ' + twoMoves.length + ' possibilities')
require('fs').writeFileSync('./moves/twoMoves.json', JSON.stringify(twoMoves), 'utf8')

console.log('writing ' + './moves/threeMoves.json with ' + threeMoves.length + ' possibilities')
require('fs').writeFileSync('./moves/threeMoves.json', JSON.stringify(threeMoves), 'utf8')

console.log('writing ' + './moves/fourMoves.json with ' + fourMoves.length + ' possibilities')
require('fs').writeFileSync('./moves/fourMoves.json', JSON.stringify(fourMoves), 'utf8')
