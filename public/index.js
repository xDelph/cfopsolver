(function () {
  let initialized = function () {
    document.querySelector('.loader').style.display = 'none'
    document.querySelector('#content').style.display = 'block'

    document.querySelector('#generate').addEventListener('click', generateAlg)
    document.querySelector('#generateCustom').addEventListener('click', () => {
      let alg = document.querySelector('#customInput').value
      if (alg) {
        document.querySelector('#content').style.display = 'none'
        document.querySelector('.loader').style.display = 'block'
        generateSolution(alg)
      }
    })
  }

  let generateAlg = function () {
    document.querySelector('#content').style.display = 'none'
    document.querySelector('.loader').style.display = 'block'
    // var xhr = new window.XMLHttpRequest()

    // xhr.open('GET', `${window.location.origin}/alg`)

    // xhr.addEventListener('readystatechange', function () {
    //   if (xhr.readyState === window.XMLHttpRequest.DONE && xhr.status === 200) {
    //     generateSolution(xhr.responseText)
    //   } else if (xhr.readyState === window.XMLHttpRequest.DONE) {
    //     document.querySelector('.result').innerHTML = 'error in the api, please retry'

    //     document.querySelector('.loader').style.display = 'none'
    //     document.querySelector('#content').style.display = 'block'
    //   }
    // })

    // xhr.send(null)

    setTimeout(() => {
      getAlg(generateSolution)
    }, 250)
  }

  let generateSolution = function (alg) {
    let start = new Date()

    // var xhr = new window.XMLHttpRequest()
    // xhr.open('GET', `${window.location.origin}/wc/` + alg)

    // xhr.addEventListener('readystatechange', function () {
    //   if (xhr.readyState === window.XMLHttpRequest.DONE && xhr.status === 200) {

    let moves = getWhiteCrossSolutions(alg)
    let end = new Date()
    let duration = (end - start) / 1000

    // let moves = xhr.responseText ? JSON.parse(xhr.responseText) : []

    let baseWidgetConfig = 'flags=showalg|colors=U:y%20D:w%20F:b%20B:g%20L:o%20R:r|pov=Ulf|'

    let text = `<div>Duration : ${duration}s<br />
    <div id="baseAlg"></div>`
    let cs = moves.length > 0 ? '<div>Solutions : </div> ' : '<div>no solutions under 7 moves or already cross solved</div>'
    moves.forEach((element, i) => {
      cs += moves ? `<div id="solution${i}" class='solution'></div>` : ''
    })

    document.querySelector('.result').innerHTML = text + '<br />' + cs

    document.querySelector('.loader').style.display = 'none'
    document.querySelector('#content').style.display = 'block'

    CubeAnimation.create_in_dom('#baseAlg', baseWidgetConfig + `alg=${alg}|setupmoves=${alg}`, 'class="roofpig"')
    moves.forEach((element, i) => {
      CubeAnimation.create_in_dom(`#solution${i}`, baseWidgetConfig + `alg=${element}|setupmoves=${alg + ' ' + element}`, 'class="roofpig"')
    })

    //   } else if (xhr.readyState === window.XMLHttpRequest.DONE) {
    //     document.querySelector('.result').innerHTML = 'error in the api, please retry'

    //     document.querySelector('.loader').style.display = 'none'
    //     document.querySelector('#content').style.display = 'block'
    //   }
    // })

    // xhr.send(null)
  }

  ;(function () {
    Cube.asyncInit('/cubejs/worker.js', initialized)
  })()
})()
