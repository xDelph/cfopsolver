const possibleMoves = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"]
const invert = { U: "U'", "U'": 'U', D: "D'", "D'": 'D', R: "R'", "R'": 'R', L: "L'", "L'": 'L', B: "B'", "B'": 'B', F: "F'", "F'": 'F' }

let twoMoves = []
let threeMoves = []
let fourMoves = []
let fiveMoves = []
let sixMoves = []
// let sevenMoves = []

for (let i of possibleMoves) {
  for (let j of possibleMoves) {
    if (invert[i] !== j) twoMoves.push(`${i} ${j}`)

    for (let k of possibleMoves) {
      if (`${i}${i}${i}` === `${i}${j}${k}`) continue
      if (invert[i] !== j && invert[j] !== k) threeMoves.push(`${i} ${j} ${k}`)

      for (let l of possibleMoves) {
        if (`${j}${j}${j}` === `${j}${k}${l}`) continue
        if (invert[i] !== j && invert[j] !== k && invert[k] !== l) fourMoves.push(`${i} ${j} ${k} ${l}`)

        for (let m of possibleMoves) {
          if (`${k}${k}${k}` === `${k}${l}${m}`) continue
          if (invert[i] !== j && invert[j] !== k && invert[k] !== l && invert[l] !== m) fiveMoves.push(`${i} ${j} ${k} ${l} ${m}`)

          for (let n of possibleMoves) {
            if (invert[i] !== j && invert[j] !== k && invert[k] !== l && invert[l] !== m && invert[m] !== n) {
              sixMoves.push(`${i} ${j} ${k} ${l} ${m} ${n}`)
            }

            // for (let o of possibleMoves) {
            //   sevenMoves.push(`${i} ${j} ${k} ${l} ${m} ${n} ${o}`)
            // }
          }
        }
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

console.log('writing ' + './moves/fiveMoves.json with ' + fiveMoves.length + ' possibilities')
require('fs').writeFileSync('./moves/fiveMoves.json', JSON.stringify(fiveMoves), 'utf8')

console.log('writing ' + './moves/sixMoves.json with ' + sixMoves.length + ' possibilities')
require('fs').writeFileSync('./moves/sixMoves.json', JSON.stringify(sixMoves), 'utf8')

// console.log('writing ' + './moves/sevenMoves.json with ' + sevenMoves.length + ' possibilities')
// require('fs').writeFileSync('./moves/sevenMoves.json', JSON.stringify(sevenMoves), 'utf8')
