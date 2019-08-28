const express = require('express')
const app = express()

const oneMove = ['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"]
const invert = { U: "U'", "U'": 'U', D: "D'", "D'": 'D', R: "R'", "R'": 'R', L: "L'", "L'": 'L', B: "B'", "B'": 'B', F: "F'", "F'": 'F' }

const Cube = require('cubejs')
Cube.initSolver()

app.use(express.static('public'))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/alg', (req, res) => {
  // res.send(
  //   Cube.random()
  //     .solve()
  //     .split(' ')
  //     .reverse()
  //     .join(' ')
  // )
  res.send("L2 U B2 D' L2 B2 U' L2 R2 D2 F2 D2 L F' R' B' F L B' L B U2")
})

let baseEdgePos = {}
let solutions = []
let movesToTryFirst = []
let startMovesRemoved = []

function checkWhiteEdge (cube) {
  let edgeOk = 0

  if (cube === '') return edgeOk

  if (cube[28] === 'D' && cube[16] === 'R') edgeOk++
  if (cube[30] === 'D' && cube[25] === 'F') edgeOk++
  if (cube[32] === 'D' && cube[43] === 'L') edgeOk++
  if (cube[34] === 'D' && cube[52] === 'B') edgeOk++

  return edgeOk
}

function checkWhiteEdgeGoodOrder (cube) {
  if (
    (cube[30] === 'D' &&
      cube[16] === 'R' &&
      cube[32] === 'D' &&
      cube[25] === 'F' &&
      cube[34] === 'D' &&
      cube[43] === 'L' &&
      cube[28] === 'D' &&
      cube[52] === 'B') ||
    (cube[32] === 'D' &&
      cube[25] === 'R' &&
      cube[34] === 'D' &&
      cube[43] === 'F' &&
      cube[28] === 'D' &&
      cube[52] === 'L' &&
      cube[30] === 'D' &&
      cube[16] === 'B') ||
    (cube[34] === 'D' &&
      cube[43] === 'R' &&
      cube[28] === 'D' &&
      cube[52] === 'F' &&
      cube[30] === 'D' &&
      cube[16] === 'L' &&
      cube[32] === 'D' &&
      cube[25] === 'B')
  ) {
    return 4
  } else if (
    // R B L
    (cube[28] === 'D' && cube[25] === 'B' && cube[30] === 'D' && cube[43] === 'R' && cube[32] === 'D' && cube[16] === 'L') ||
    (cube[30] === 'D' && cube[43] === 'B' && cube[32] === 'D' && cube[52] === 'R' && cube[34] === 'D' && cube[25] === 'L') ||
    (cube[32] === 'D' && cube[52] === 'B' && cube[34] === 'D' && cube[16] === 'R' && cube[28] === 'D' && cube[43] === 'L') ||
    (cube[34] === 'D' && cube[16] === 'B' && cube[28] === 'D' && cube[25] === 'R' && cube[30] === 'D' && cube[52] === 'L') ||
    // B L F
    (cube[30] === 'D' && cube[16] === 'L' && cube[32] === 'D' && cube[25] === 'B' && cube[34] === 'D' && cube[43] === 'F') ||
    (cube[32] === 'D' && cube[25] === 'L' && cube[34] === 'D' && cube[43] === 'B' && cube[28] === 'D' && cube[52] === 'F') ||
    (cube[34] === 'D' && cube[43] === 'L' && cube[28] === 'D' && cube[52] === 'B' && cube[30] === 'D' && cube[16] === 'F') ||
    (cube[28] === 'D' && cube[43] === 'L' && cube[30] === 'D' && cube[52] === 'B' && cube[32] === 'D' && cube[16] === 'F') ||
    // F R B
    (cube[28] === 'D' && cube[25] === 'R' && cube[32] === 'D' && cube[25] === 'F' && cube[34] === 'D' && cube[43] === 'B') ||
    (cube[32] === 'D' && cube[25] === 'R' && cube[34] === 'D' && cube[43] === 'F' && cube[28] === 'D' && cube[52] === 'B') ||
    (cube[34] === 'D' && cube[43] === 'R' && cube[28] === 'D' && cube[52] === 'F' && cube[30] === 'D' && cube[16] === 'B') ||
    (cube[28] === 'D' && cube[43] === 'R' && cube[30] === 'D' && cube[52] === 'F' && cube[32] === 'D' && cube[16] === 'B') ||
    // L F R
    (cube[30] === 'D' && cube[16] === 'F' && cube[32] === 'D' && cube[25] === 'L' && cube[34] === 'D' && cube[43] === 'R') ||
    (cube[32] === 'D' && cube[25] === 'F' && cube[34] === 'D' && cube[43] === 'L' && cube[28] === 'D' && cube[52] === 'R') ||
    (cube[32] === 'D' && cube[25] === 'F' && cube[28] === 'D' && cube[43] === 'L' && cube[30] === 'D' && cube[52] === 'R') ||
    (cube[28] === 'D' && cube[43] === 'F' && cube[30] === 'D' && cube[52] === 'L' && cube[32] === 'D' && cube[16] === 'R')
  ) {
    return 3
  } else if (
    // R L
    (cube[30] === 'D' && cube[25] === 'R' && cube[32] === 'D' && cube[43] === 'L') ||
    (cube[28] === 'D' && cube[16] === 'R' && cube[34] === 'D' && cube[52] === 'L') ||
    (cube[30] === 'D' && cube[25] === 'L' && cube[32] === 'D' && cube[43] === 'R') ||
    (cube[28] === 'D' && cube[16] === 'L' && cube[34] === 'D' && cube[52] === 'R') ||
    // F B
    (cube[30] === 'D' && cube[25] === 'F' && cube[32] === 'D' && cube[43] === 'F') ||
    (cube[28] === 'D' && cube[16] === 'F' && cube[34] === 'D' && cube[52] === 'F') ||
    (cube[30] === 'D' && cube[25] === 'B' && cube[32] === 'D' && cube[43] === 'B') ||
    (cube[28] === 'D' && cube[16] === 'B' && cube[34] === 'D' && cube[52] === 'B') ||
    // R F
    (cube[30] === 'D' && cube[16] === 'R' && cube[32] === 'D' && cube[25] === 'F') ||
    (cube[32] === 'D' && cube[16] === 'R' && cube[34] === 'D' && cube[25] === 'F') ||
    (cube[34] === 'D' && cube[16] === 'R' && cube[28] === 'D' && cube[25] === 'F') ||
    (cube[28] === 'D' && cube[16] === 'R' && cube[30] === 'D' && cube[25] === 'F') ||
    // F L
    (cube[30] === 'D' && cube[16] === 'F' && cube[32] === 'D' && cube[25] === 'L') ||
    (cube[32] === 'D' && cube[16] === 'F' && cube[34] === 'D' && cube[25] === 'L') ||
    (cube[34] === 'D' && cube[16] === 'F' && cube[28] === 'D' && cube[25] === 'L') ||
    (cube[28] === 'D' && cube[16] === 'F' && cube[30] === 'D' && cube[25] === 'L') ||
    // L B
    (cube[30] === 'D' && cube[16] === 'L' && cube[32] === 'D' && cube[25] === 'B') ||
    (cube[32] === 'D' && cube[16] === 'L' && cube[34] === 'D' && cube[25] === 'B') ||
    (cube[34] === 'D' && cube[16] === 'L' && cube[28] === 'D' && cube[25] === 'B') ||
    (cube[28] === 'D' && cube[16] === 'L' && cube[30] === 'D' && cube[25] === 'B') ||
    // B R
    (cube[30] === 'D' && cube[16] === 'B' && cube[32] === 'D' && cube[25] === 'R') ||
    (cube[32] === 'D' && cube[16] === 'B' && cube[34] === 'D' && cube[25] === 'R') ||
    (cube[34] === 'D' && cube[16] === 'B' && cube[28] === 'D' && cube[25] === 'R') ||
    (cube[28] === 'D' && cube[16] === 'B' && cube[30] === 'D' && cube[25] === 'R')
  ) {
    return 2
  }

  return 0
}

function checkWhiteEdgeOnBottom (cube) {
  let edgeOk = 0

  if (cube[28] === 'D') edgeOk++
  if (cube[30] === 'D') edgeOk++
  if (cube[32] === 'D') edgeOk++
  if (cube[34] === 'D') edgeOk++

  return edgeOk
}

function getWhiteEdgePosition (cube) {
  let pos = []
  for (let i = 0; i < 6; i++) {
    let face = cube.slice(i * 9, i * 9 + 9)

    if (face['1'] === 'D') pos.push(i * 9 + 1 + ' ')
    if (face['3'] === 'D') pos.push(i * 9 + 3 + ' ')
    if (face['5'] === 'D') pos.push(i * 9 + 5 + ' ')
    if (face['7'] === 'D') pos.push(i * 9 + 7 + ' ')
  }

  return pos
}

function isMovesOk (moves) {
  let ok = true
  let arr = moves.split(' ')

  if (arr.length > 2) {
    for (let i = 0; i < arr.length - 2; i++) {
      let tmp = arr.slice(i, i + 3)
      if (tmp[0] === tmp[1] && tmp[1] === tmp[2]) {
        ok = false
        break
      }
    }
  }

  if (arr.length > 1) {
    for (let i = 0; i < arr.length - 1; i++) {
      let tmp = arr.slice(i, i + 2)
      if (tmp[0] === invert[tmp[1]]) {
        ok = false
        break
      }
    }
  }

  return ok
}

function getLessMoveSolution (solutions) {
  let min = 10

  for (let s of solutions) {
    if (s.split(' ').length < min) min = s.split(' ').length
  }

  return min
}

function getCubeStr (alg) {
  let cube = new Cube()
  cube.move(alg)

  return cube.asString()
}

function checkIfLastMoveUsefull (alg, moves) {
  let split = moves.split(' ')
  let a = split.slice(0, split.length - 1).join(' ') || ''
  let aEdge
  if (baseEdgePos[a]) aEdge = baseEdgePos[a]
  else {
    let aCubeStr = getCubeStr(alg + ' ' + a)
    aEdge = getWhiteEdgePosition(aCubeStr).join('')
  }

  let bEdge
  let bCubeStr
  if (baseEdgePos[moves]) bEdge = baseEdgePos[moves]
  else {
    bCubeStr = getCubeStr(alg + ' ' + moves)
    bEdge = getWhiteEdgePosition(bCubeStr).join('')
  }

  if ((baseEdgePos[a] || aEdge) === bEdge) {
    return ''
  } else if (!baseEdgePos[a]) {
    baseEdgePos[a] = aEdge
  }

  return bCubeStr || getCubeStr(alg + ' ' + moves)
}

function oneWhiteEdge (alg, moves, twoMoves) {
  for (let l = 0; l < oneMove.length; l++) {
    if (!isMovesOk(moves + ' ' + oneMove[l])) continue
    let cubeStr = checkIfLastMoveUsefull(alg, moves + ' ' + oneMove[l])
    let edgeOnBottom = checkWhiteEdgeOnBottom(cubeStr)

    if (cubeStr) {
      if (edgeOnBottom >= 2) {
        let res = threeWhiteEdge(alg, moves + ' ' + oneMove[l], twoMoves)
        if (res) return res
      }
    }
  }
}

function twoWhiteEdge (alg, moves, twoMoves) {
  for (let l = 0; l < oneMove.length; l++) {
    if (!isMovesOk(moves + ' ' + oneMove[l])) continue
    let cubeStr = checkIfLastMoveUsefull(alg, moves + ' ' + oneMove[l])
    let edgeOnBottom = checkWhiteEdgeOnBottom(cubeStr)

    if (cubeStr) {
      if (edgeOnBottom >= 3) {
        let res = threeWhiteEdge(alg, moves + ' ' + oneMove[l], twoMoves)
        if (res) return res
      }
    }
  }
}

function threeWhiteEdge (alg, moves, twoMoves) {
  if (getLessMoveSolution(solutions) < moves.split(' ').length + 1) return

  for (let j = 0; j < oneMove.length; j++) {
    if (!isMovesOk(moves + ' ' + oneMove[j])) continue
    let cubeStr = checkIfLastMoveUsefull(alg, moves + ' ' + oneMove[j])

    if (cubeStr) {
      if (checkWhiteEdge(cubeStr) === 4) {
        return moves + ' ' + oneMove[j]
      }
    }
  }

  if (getLessMoveSolution(solutions) < moves.split(' ').length + 2) return
  let intermediateCubeStr = getCubeStr(alg + ' ' + moves)
  if (moves.length > 5 && checkWhiteEdgeGoodOrder(intermediateCubeStr) === 0 && checkWhiteEdgeOnBottom(intermediateCubeStr) < 2) return

  for (let j = 0; j < twoMoves.length; j++) {
    if (!isMovesOk(moves + ' ' + twoMoves[j])) continue
    let cubeStr = checkIfLastMoveUsefull(alg, moves + ' ' + twoMoves[j])
    let edgeOnBottom = checkWhiteEdgeOnBottom(cubeStr)

    if (cubeStr) {
      if (checkWhiteEdge(cubeStr) === 4) {
        return moves + ' ' + twoMoves[j]
      } else if ((moves + ' ' + twoMoves[j]).split(' ').length < 7 && edgeOnBottom >= 3 && checkWhiteEdgeGoodOrder(cubeStr) >= 2) {
        for (let k = 0; k < oneMove.length; k++) {
          if (!isMovesOk(moves + ' ' + twoMoves[j] + ' ' + oneMove[k])) continue
          let cubeStr = checkIfLastMoveUsefull(alg, moves + ' ' + twoMoves[j] + ' ' + oneMove[k])

          if (cubeStr) {
            if (checkWhiteEdge(cubeStr) === 4) {
              return moves + ' ' + twoMoves[j] + ' ' + oneMove[k]
            }
          }
        }
      }
    }
  }
}

app.get('/wc/:alg', (req, res) => {
  let twoMoves = require('./moves/twoMoves.json')
  let threeMoves = require('./moves/threeMoves.json')
  let fourMoves = require('./moves/fourMoves.json')

  const alg = req.params.alg

  console.log('')
  console.log('start...')
  console.log('alg :', alg)

  let finded

  movesToTryFirst = []
  startMovesRemoved = []
  solutions = []
  baseEdgePos = {}

  let baseCubeStr = checkIfLastMoveUsefull(alg, '')

  if (checkWhiteEdge(baseCubeStr) === 4) {
    res.send('')
    return
  }

  for (let i = 0; i < oneMove.length; i++) {
    let cubeStr = checkIfLastMoveUsefull(alg, oneMove[i])
    if (checkWhiteEdge(cubeStr) === 4) solutions.push(oneMove[i])

    if (!cubeStr) {
      startMovesRemoved.push(oneMove[i])
      twoMoves = twoMoves.filter(m => m.indexOf(oneMove[i]) !== 0)
      threeMoves = threeMoves.filter(m => m.indexOf(oneMove[i]) !== 0)
      fourMoves = fourMoves.filter(m => m.indexOf(oneMove[i]) !== 0)
    } else {
      if (checkWhiteEdgeOnBottom(cubeStr) > 0) movesToTryFirst.push(oneMove[i])
    }
  }

  for (let i = 0; i < twoMoves.length; i++) {
    let cubeStr = checkIfLastMoveUsefull(alg, twoMoves[i])
    if (checkWhiteEdge(cubeStr) === 4) solutions.push(twoMoves[i])

    if (!cubeStr) {
      startMovesRemoved.push(twoMoves[i])
      threeMoves = threeMoves.filter(m => m.indexOf(twoMoves[i]) !== 0)
      fourMoves = fourMoves.filter(m => m.indexOf(twoMoves[i]) !== 0)
    } else if (checkWhiteEdgeOnBottom(cubeStr) > 0) movesToTryFirst.push(twoMoves[i])
  }

  for (let i = 0; i < threeMoves.length; i++) {
    let cubeStr = checkIfLastMoveUsefull(alg, threeMoves[i])
    if (checkWhiteEdge(cubeStr) === 4) solutions.push(threeMoves[i])

    if (!cubeStr) {
      startMovesRemoved.push(threeMoves[i])
      fourMoves = fourMoves.filter(m => m.indexOf(threeMoves[i]) !== 0)
    } else if (checkWhiteEdgeOnBottom(cubeStr) > 0) movesToTryFirst.push(threeMoves[i])
  }

  console.log('one/two/three startMoves removed : ', startMovesRemoved.length)
  console.log('nb fourMoves to try : ', fourMoves.length)

  twoMoves = require('./moves/twoMoves.json')
  twoMoves.sort(() => Math.random() - 0.5)

  threeMoves = require('./moves/threeMoves.json')
  threeMoves.sort(() => Math.random() - 0.5)

  fourMoves.sort(() => Math.random() - 0.5)
  let moves = [...movesToTryFirst, ...fourMoves]

  if (solutions.length === 0) {
    for (let i = 0; i < moves.length; i++) {
      let cubeStr = checkIfLastMoveUsefull(alg, moves[i])
      let edgeOnBottom = checkWhiteEdgeOnBottom(cubeStr)

      if (checkWhiteEdge(cubeStr) === 4) solutions.push(moves[i])

      if (cubeStr) {
        if (checkWhiteEdge(cubeStr) === 4) {
          finded = moves[i]
          if (finded) solutions.push(finded)
        } else if (edgeOnBottom >= 3 && checkWhiteEdge(cubeStr >= 2)) {
          if (getLessMoveSolution(solutions) < moves[i].split(' ').length + 1) continue
          finded = threeWhiteEdge(alg, moves[i], twoMoves)
          if (finded) solutions.push(finded)
        } else if (edgeOnBottom === 2) {
          finded = twoWhiteEdge(alg, moves[i], twoMoves)
          if (finded) solutions.push(finded)
        } else if (edgeOnBottom === 1) {
          finded = oneWhiteEdge(alg, moves[i], twoMoves)
          if (finded) solutions.push(finded)
        }
      }
    }
  }

  function arrDiff (a1, a2) {
    let a = []
    let diff = []

    for (let i = 0; i < a1.length; i++) {
      a[a1[i]] = true
    }

    for (let i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]]
      } else {
        a[a2[i]] = true
      }
    }

    for (let k in a) {
      diff.push(k)
    }

    return diff
  }

  const minMovesToSolve = getLessMoveSolution(solutions)

  solutions = solutions
    .sort(function (a, b) {
      return a.length - b.length
    })
    .map(s => {
      let tmp = s.split(' ')
      let end = tmp.slice(tmp.length - 2, tmp.length).join(' ')
      if (end === "U D'" || end === 'U D' || end === "U' D" || end === "U' D'") {
        return tmp.slice(0, tmp.length - 2).join(' ') + ' ' + tmp.pop()
      } else return s
    })
    .filter(r => r.split(' ').length <= minMovesToSolve + 1)

  let result = []
  for (let s of solutions) {
    let res = true

    let cubeStr = getCubeStr(s)

    for (let ss of result) {
      if (
        arrDiff(ss.replace(/\s+/g, ''), s.replace(/\s+/g, '')).length === 1 ||
        ss.replace(/\s+/g, '') === s.replace(/\s+/g, '') ||
        cubeStr === getCubeStr(ss)
      ) {
        res = false
        break
      }

      let ssSplit = ss.split(' ')

      for (let i = 0; i < ssSplit.length - 2; i++) {
        let sSplit = s.split(' ')
        ssSplit = ss.split(' ')

        let sCheck = sSplit.slice(i, i + 2)
        let ssCheck = ssSplit.slice(i, i + 2)

        sSplit.splice(i, 2)
        ssSplit.splice(i, 2)

        if (sSplit.join(' ') === ssSplit.join(' ') && sCheck.sort().join(' ') === ssCheck.sort().join(' ')) {
          res = false
          break
        }
      }
    }

    if (res) result.push(s)
  }

  console.log('find :', result.length, 'solutions')
  console.log(result)
  res.send(JSON.stringify(result))

  console.log('...end')

  movesToTryFirst = []
  startMovesRemoved = []
  solutions = []
  baseEdgePos = {}

  twoMoves = undefined
  threeMoves = undefined
  fourMoves = undefined
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`App listening on port ${port}!`))
