const invert = { U: "U'", "U'": 'U', D: "D'", "D'": 'D', R: "R'", "R'": 'R', L: "L'", "L'": 'L', B: "B'", "B'": 'B', F: "F'", "F'": 'F' }

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
