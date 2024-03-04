const sslRedirect = require('heroku-ssl-redirect')
const express = require('express')
const app = express()

app.use(sslRedirect())
app.use(express.static('public'))

const path = require('path')

const oneMove = ['U', "U'", 'D', "D'", 'R', "R'", 'L', "L'", 'F', "F'", 'B', "B'"]
const invert = { U: "U'", "U'": 'U', D: "D'", "D'": 'D', R: "R'", "R'": 'R', L: "L'", "L'": 'L', B: "B'", "B'": 'B', F: "F'", "F'": 'F' }

const originalTwoMoves = require('./moves/twoMoves.json')
const originalThreeMoves = require('./moves/threeMoves.json')
const originalFourMoves = require('./moves/fourMoves.json')

const Cube = require('cubejs')
Cube.initSolver()

// console.log(new Cube().asString())

function checkWhiteEdge (cube) {
  let edgeOk = 0

  if (cube === '') return edgeOk

  if (cube[28] === 'D' && cube[25] === 'F') edgeOk++
  if (cube[30] === 'D' && cube[43] === 'L') edgeOk++
  if (cube[32] === 'D' && cube[16] === 'R') edgeOk++
  if (cube[34] === 'D' && cube[52] === 'B') edgeOk++

  return edgeOk
}

function checkLastEdgeinTwoMovesMax (cube) {
  if (cube[28] === 'D' && cube[30] === 'D' && cube[32] === 'D') {
    return cube[14] === 'D' || cube[1] === 'D' || cube[49] === 'D'
  } else if (cube[30] === 'D' && cube[32] === 'D' && cube[34] === 'D') {
    return cube[41] === 'D' || cube[7] === 'D' || cube[12] === 'D'
  } else if (cube[32] === 'D' && cube[34] === 'D' && cube[28] === 'D') {
    return cube[50] === 'D' || cube[3] === 'D' || cube[41] === 'D'
  } else if (cube[34] === 'D' && cube[28] === 'D' && cube[30] === 'D') {
    return cube[23] === 'D' || cube[5] === 'D' || cube[48] === 'D'
  }

  return false
}

function canFinishWithinSevenMoves (cube) {
  return (
    (checkWhiteEdgeOnBottom(cube) < 3 && checkWhiteEdge(cube) < 2) ||
    (checkWhiteEdgeGoodOrder(cube) < 2 && checkWhiteEdge(cube) < 2) ||
    (checkWhiteEdgeGoodOrder(cube) === 2 && checkWhiteEdge(cube) === 1) ||
    (checkWhiteEdgeGoodOrder(cube) === 2 && checkWhiteEdge(cube) < 3 && checkWhiteEdgeOnBottom(cube) === 3) ||
    (checkWhiteEdgeGoodOrder(cube) === 3 && !checkLastEdgeinTwoMovesMax(cube)) ||
    (checkWhiteEdge(cube) === 3 && !checkLastEdgeinTwoMovesMax(cube))
  )
}

function checkWhiteEdgeGoodOrder (cube) {
  if (
    (cube[28] === 'D' &&
      cube[25] === 'L' &&
      cube[30] === 'D' &&
      cube[43] === 'B' &&
      cube[32] === 'D' &&
      cube[16] === 'F' &&
      cube[34] === 'D' &&
      cube[52] === 'R') ||
    (cube[28] === 'D' &&
      cube[25] === 'B' &&
      cube[30] === 'D' &&
      cube[43] === 'R' &&
      cube[32] === 'D' &&
      cube[16] === 'L' &&
      cube[34] === 'D' &&
      cube[52] === 'F') ||
    (cube[28] === 'D' &&
      cube[25] === 'R' &&
      cube[30] === 'D' &&
      cube[43] === 'F' &&
      cube[32] === 'D' &&
      cube[16] === 'B' &&
      cube[34] === 'L' &&
      cube[52] === 'B')
  ) {
    return 4
  } else if (
    // B L F
    (cube[28] === 'D' && cube[25] === 'B' && cube[32] === 'D' && cube[16] === 'L' && cube[34] === 'D' && cube[52] === 'F') ||
    (cube[30] === 'D' && cube[43] === 'B' && cube[28] === 'D' && cube[25] === 'L' && cube[32] === 'D' && cube[16] === 'F') ||
    (cube[32] === 'D' && cube[16] === 'B' && cube[34] === 'D' && cube[52] === 'L' && cube[30] === 'D' && cube[43] === 'F') ||
    // L F R
    (cube[28] === 'D' && cube[25] === 'L' && cube[32] === 'D' && cube[16] === 'F' && cube[34] === 'D' && cube[52] === 'R') ||
    (cube[34] === 'D' && cube[52] === 'L' && cube[30] === 'D' && cube[43] === 'F' && cube[28] === 'D' && cube[25] === 'R') ||
    (cube[32] === 'D' && cube[16] === 'L' && cube[34] === 'D' && cube[52] === 'F' && cube[30] === 'D' && cube[43] === 'R') ||
    // F R B
    (cube[34] === 'D' && cube[52] === 'F' && cube[30] === 'D' && cube[43] === 'R' && cube[28] === 'D' && cube[25] === 'B') ||
    (cube[30] === 'D' && cube[43] === 'F' && cube[28] === 'D' && cube[25] === 'R' && cube[32] === 'D' && cube[16] === 'B') ||
    (cube[32] === 'D' && cube[16] === 'F' && cube[34] === 'D' && cube[52] === 'R' && cube[30] === 'D' && cube[43] === 'B') ||
    // R B L
    (cube[28] === 'D' && cube[25] === 'R' && cube[32] === 'D' && cube[16] === 'B' && cube[34] === 'D' && cube[52] === 'L') ||
    (cube[30] === 'D' && cube[43] === 'R' && cube[28] === 'D' && cube[25] === 'B' && cube[32] === 'D' && cube[16] === 'L') ||
    (cube[34] === 'D' && cube[52] === 'R' && cube[30] === 'D' && cube[43] === 'B' && cube[28] === 'D' && cube[25] === 'L')
  ) {
    return 3
  } else if (
    // L R
    (cube[28] === 'D' && cube[25] === 'L' && cube[34] === 'D' && cube[52] === 'R') ||
    // (cube[30] === 'D' && cube[43] === 'L' && cube[32] === 'D' && cube[16] === 'R') ||
    (cube[32] === 'D' && cube[16] === 'R' && cube[30] === 'D' && cube[43] === 'L') ||
    (cube[34] === 'D' && cube[52] === 'R' && cube[28] === 'D' && cube[25] === 'L') ||
    // F B
    // (cube[28] === 'D' && cube[25] === 'F' && cube[34] === 'D' && cube[52] === 'B') ||
    (cube[30] === 'D' && cube[43] === 'F' && cube[32] === 'D' && cube[16] === 'B') ||
    (cube[32] === 'D' && cube[16] === 'B' && cube[30] === 'D' && cube[43] === 'F') ||
    (cube[34] === 'D' && cube[52] === 'B' && cube[28] === 'D' && cube[25] === 'F') ||
    // F R
    // (cube[28] === 'D' && cube[25] === 'F' && cube[32] === 'D' && cube[16] === 'R') ||
    (cube[30] === 'D' && cube[43] === 'F' && cube[28] === 'D' && cube[25] === 'R') ||
    (cube[32] === 'D' && cube[16] === 'F' && cube[34] === 'D' && cube[52] === 'R') ||
    (cube[34] === 'D' && cube[52] === 'F' && cube[30] === 'D' && cube[43] === 'R') ||
    // R B
    (cube[28] === 'D' && cube[25] === 'R' && cube[32] === 'D' && cube[16] === 'B') ||
    (cube[30] === 'D' && cube[43] === 'R' && cube[28] === 'D' && cube[25] === 'B') ||
    // (cube[32] === 'D' && cube[16] === 'R' && cube[34] === 'D' && cube[52] === 'B') ||
    (cube[34] === 'D' && cube[52] === 'R' && cube[30] === 'D' && cube[43] === 'B') ||
    // B L
    (cube[28] === 'D' && cube[25] === 'B' && cube[32] === 'D' && cube[16] === 'L') ||
    (cube[30] === 'D' && cube[43] === 'B' && cube[28] === 'D' && cube[25] === 'L') ||
    (cube[32] === 'D' && cube[16] === 'B' && cube[34] === 'D' && cube[52] === 'L') ||
    // (cube[34] === 'D' && cube[52] === 'B' && cube[30] === 'D' && cube[43] === 'L') ||
    // L F
    (cube[28] === 'D' && cube[25] === 'L' && cube[32] === 'D' && cube[16] === 'F') ||
    // (cube[30] === 'D' && cube[43] === 'L' && cube[28] === 'D' && cube[25] === 'F') ||
    (cube[32] === 'D' && cube[16] === 'L' && cube[34] === 'D' && cube[52] === 'F') ||
    (cube[34] === 'D' && cube[52] === 'L' && cube[30] === 'D' && cube[43] === 'F')
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

    if (face['1'] === 'D') pos.push(i * 9 + 1)
    if (face['3'] === 'D') pos.push(i * 9 + 3)
    if (face['5'] === 'D') pos.push(i * 9 + 5)
    if (face['7'] === 'D') pos.push(i * 9 + 7)
  }

  return pos
}

function checkIfThreeMovesUseless (one, two, three) {
  if (one === invert[three] && (one === 'U' || one === "U'") && (two === 'D' || two === "D'")) return true
  if (one === invert[three] && (one === 'D' || one === "D'") && (two === 'U' || two === "U'")) return true

  if (one === invert[three] && (one === 'R' || one === "R'") && (two === 'L' || two === "L'")) return true
  if (one === invert[three] && (one === 'L' || one === "L'") && (two === 'R' || two === "R'")) return true

  if (one === invert[three] && (one === 'F' || one === "F'") && (two === 'B' || two === "B'")) return true
  if (one === invert[three] && (one === 'B' || one === "B'") && (two === 'F' || two === "F'")) return true

  return false
}

function isMovesOk (moves) {
  let ok = true
  let arr = moves.split(' ')

  if (arr.length > 2) {
    for (let i = 0; i < arr.length - 2; i++) {
      let tmp = arr.slice(i, i + 3)
      if (
        (tmp[0] === tmp[1] && tmp[1] === tmp[2]) ||
        tmp[0] === invert[tmp[1]] ||
        tmp[1] === invert[tmp[2]] ||
        checkIfThreeMovesUseless(tmp[0], tmp[1], tmp[2])
      ) {
        ok = false
        break
      }
    }
  }

  if (!ok) return ok

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

function getLessMoveSolution (arr) {
  let min = 10

  for (let s of arr) {
    if (s.split(' ').length < min) min = s.split(' ').length
  }

  return min
}

function getCubeStr (alg) {
  let cube = new Cube()
  cube.move(alg)

  return cube.asString()
}

app.get('/api/wc/:alg', (req, res) => {
  let twoMoves = [...originalTwoMoves]
  let threeMoves = [...originalThreeMoves]
  let fourMoves = [...originalFourMoves]

  const alg = req.params.alg

  let baseEdgePos = {}
  let solutions = []
  let startMovesRemoved = []

  function checkIfLastMoveUsefull (alg, moves) {
    let split = moves.split(' ')
    split.pop()
    let a = split.join(' ') || ''
    let aEdge
    if (baseEdgePos[a]) aEdge = baseEdgePos[a]
    else {
      let aCubeStr = getCubeStr(alg + ' ' + a)
      aEdge = getWhiteEdgePosition(aCubeStr).join(':')
    }

    let bEdge
    let bCubeStr
    if (baseEdgePos[moves]) bEdge = baseEdgePos[moves]
    else {
      bCubeStr = getCubeStr(alg + ' ' + moves)
      bEdge = getWhiteEdgePosition(bCubeStr).join(':')
    }

    if (aEdge === bEdge) {
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

      if (cubeStr) {
        if (checkWhiteEdgeOnBottom(cubeStr) > 1 || checkWhiteEdge(cubeStr) >= 2) {
          let res = threeWhiteEdge(alg, moves + ' ' + oneMove[l])
          if (res) return res
        }
      }
    }
  }

  function twoWhiteEdge (alg, moves) {
    for (let l = 0; l < oneMove.length; l++) {
      if (!isMovesOk(moves + ' ' + oneMove[l])) continue
      let cubeStr = checkIfLastMoveUsefull(alg, moves + ' ' + oneMove[l])

      if (cubeStr) {
        if (checkWhiteEdgeGoodOrder(cubeStr) > 2 || checkWhiteEdge(cubeStr) >= 2) {
          let res = threeWhiteEdge(alg, moves + ' ' + oneMove[l])
          if (res) return res
        }
      }
    }
  }

  function threeWhiteEdge (alg, moves) {
    if (getLessMoveSolution(solutions) < moves.split(' ').length + 1) return

    if (moves.split(' ').length > 4) {
      if (canFinishWithinSevenMoves(getCubeStr(alg + ' ' + moves))) {
        return
      }
    }

    for (let j = 0; j < oneMove.length; j++) {
      let movesPlusOne = moves + ' ' + oneMove[j]
      if (!isMovesOk(movesPlusOne)) continue
      let cubeStr = checkIfLastMoveUsefull(alg, movesPlusOne)

      if (cubeStr) {
        if (checkWhiteEdge(cubeStr) === 4) {
          return movesPlusOne
        } else {
          if (canFinishWithinSevenMoves(cubeStr)) {
            continue
          }

          // if (movesPlusOne.indexOf("R L D' F ") === 0) {
          // console.log(
          //   '    4 : ',
          //   movesPlusOne,
          //   ' - ',
          //   checkWhiteEdgeGoodOrder(cubeStr),
          //   ' - ',
          //   checkWhiteEdgeOnBottom(cubeStr),
          //   ' - ',
          //   checkWhiteEdge(cubeStr)
          // )
          // }

          for (let k = 0; k < oneMove.length; k++) {
            let movesPlusTwo = moves + ' ' + oneMove[j] + ' ' + oneMove[k]
            // if (movesPlusOne.indexOf("F' R' D B'") === 0) console.log('      5 : ', movesPlusTwo)
            if (!isMovesOk(movesPlusTwo)) continue
            let cubeStr = checkIfLastMoveUsefull(alg, movesPlusTwo)

            if (cubeStr) {
              if (checkWhiteEdge(cubeStr) === 4) {
                return movesPlusTwo
              } else if (moves.length === 4) {
                if (checkWhiteEdgeGoodOrder(cubeStr) !== 4 || checkWhiteEdge(cubeStr) !== 3) continue

                for (let l = 0; l < oneMove.length; l++) {
                  let movesPlusThree = moves + ' ' + oneMove[j] + ' ' + oneMove[k] + ' ' + oneMove[l]
                  let cubeStr = getCubeStr(alg, movesPlusThree)
                  // if (moves.indexOf('R L L') === 0) console.log('        6 : ', movesPlusThree)

                  if (checkWhiteEdge(cubeStr) === 4) {
                    return movesPlusThree
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  console.log('')
  console.log('start...')
  console.log('alg :', alg)

  let finded
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
    }
  }

  for (let i = 0; i < twoMoves.length; i++) {
    let cubeStr = checkIfLastMoveUsefull(alg, twoMoves[i])
    if (checkWhiteEdge(cubeStr) === 4) solutions.push(twoMoves[i])

    if (!cubeStr) {
      startMovesRemoved.push(twoMoves[i])
      threeMoves = threeMoves.filter(m => m.indexOf(twoMoves[i]) !== 0)
      fourMoves = fourMoves.filter(m => m.indexOf(twoMoves[i]) !== 0)
    }
  }

  for (let i = 0; i < threeMoves.length; i++) {
    let cubeStr = checkIfLastMoveUsefull(alg, threeMoves[i])
    if (checkWhiteEdge(cubeStr) === 4) solutions.push(threeMoves[i])

    if (!cubeStr) {
      startMovesRemoved.push(threeMoves[i])
      fourMoves = fourMoves.filter(m => m.indexOf(threeMoves[i]) !== 0)
    }
  }

  // console.log('0 : ', fourMoves.filter(m => m.indexOf('R L L') === 0))

  console.log('one/two/three startMoves removed :', startMovesRemoved.length)
  console.log('nb fourMoves to try :', fourMoves.length)

  // fourMoves.sort(() => Math.random() - 0.5)
  let moves = [...fourMoves]

  if (solutions.length === 0) {
    for (let i = 0; i < moves.length; i++) {
      let cubeStr = checkIfLastMoveUsefull(alg, moves[i])

      if (checkWhiteEdge(cubeStr) === 4) {
        solutions.push(moves[i])
        continue
      }

      if (cubeStr) {
        if (checkWhiteEdge(cubeStr) === 4) {
          solutions.push(moves[i])
        } else if (checkWhiteEdgeOnBottom(cubeStr) === 3 && checkWhiteEdgeGoodOrder(cubeStr) !== 0) {
          finded = threeWhiteEdge(alg, moves[i])
          if (finded) solutions.push(finded)
        } else if (checkWhiteEdgeOnBottom(cubeStr) === 2) {
          finded = twoWhiteEdge(alg, moves[i])
          if (finded) solutions.push(finded)
        } else if (checkWhiteEdgeOnBottom(cubeStr) === 1) {
          finded = oneWhiteEdge(alg, moves[i])
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
    // .map(s => {
    //   let tmp = s.split(' ')
    //   let end = tmp.slice(tmp.length - 2, tmp.length).join(' ')
    //   if (end === "U D'" || end === 'U D' || end === "U' D" || end === "U' D'") {
    //     return tmp.slice(0, tmp.length - 2).join(' ') + ' ' + tmp.pop()
    //   } else return s
    // })
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
})

app.get('/api/alg', (req, res) => {
  res.send(
    Cube.random()
      .solve()
      .split(' ')
      .reverse()
      .join(' ')
  )
  // res.send("L2 U B2 D' L2 B2 U' L2 R2 D2 F2 D2 L F' R' B' F L B' L B U2")
})


const port = process.env.PORT || 8080
app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app
