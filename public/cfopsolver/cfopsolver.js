const oneMove = ['U', "U'", 'D', "D'", 'R', "R'", 'L', "L'", 'F', "F'", 'B', "B'"]

function getAlg (callback) {
  Cube.asyncSolve(Cube.random(), function (alg) {
    callback(
      alg
        .split(' ')
        .reverse()
        .join(' ')
    )
  })
}

function getWhiteCrossSolutions (alg) {
  let twoMoves = [...originalTwoMoves]
  let threeMoves = [...originalThreeMoves]
  let fourMoves = [...originalFourMoves]

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

  console.log('...end')

  return result
}
