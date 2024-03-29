(function () {
  let initialized = function () {
    document.querySelector('#generate').addEventListener('click', generateAlgHandler)
    document.querySelector('#generateCustom').addEventListener('click', generateCustomHandler)
    
    document.querySelector('#generate').addEventListener('tap', generateAlgHandler, false)
    document.querySelector('#generateCustom').addEventListener('tap', generateCustomHandler, false)
  }

  let generateAlgHandler = function (e) {
    e.preventDefault();
    
    document.querySelector('#content').style.display = 'none'
    document.querySelector('.loader').style.display = 'block'

    var xhr = new window.XMLHttpRequest()
    xhr.open('GET', `${window.location.origin}/api/alg`)

    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === window.XMLHttpRequest.DONE && xhr.status === 200) {
        generateSolution(xhr.responseText)
      } else if (xhr.readyState === window.XMLHttpRequest.DONE) {
        document.querySelector('.result').innerHTML = 'error in the api, please retry'

        document.querySelector('.loader').style.display = 'none'
        document.querySelector('#content').style.display = 'block'
      }
    })

    xhr.send(null)
  }
  
  let generateCustomHandler = function(e) {
    e.preventDefault();
    
    let alg = document.querySelector('#customInput').value
    if (alg) {
      document.querySelector('#content').style.display = 'none'
      document.querySelector('.loader').style.display = 'block'
      generateSolution(alg)
    }
  }

  let generateSolution = function (alg) {
    var xhr = new window.XMLHttpRequest()

    let start = new Date()
    xhr.open('GET', `${window.location.origin}/api/wc/` + alg)

    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === window.XMLHttpRequest.DONE && xhr.status === 200) {
        let end = new Date()
        let duration = (end - start) / 1000

        let moves = xhr.responseText ? JSON.parse(xhr.responseText) : []

        let text = `<div>Duration : ${duration}s<br /><iframe 
          width="330" height="340" style="width: 330px; height: 340px; overflow: hidden;" 
          src="https://ruwix.com/widget/3d/?flags=showalg&colors=U:y%20L:r%20F:g%20R:o%20B:b%20D:w&alg=${alg}&setupmoves=${alg}"
          
          scrolling="no"></iframe></div>`
        let cs = moves.length > 0 ? '<div>Solutions : </div> ' : 'no solutions under 7 moves or already cross solved'
        moves.forEach(element => {
          let start = alg + ' ' + element
          cs += moves
            ? `<div> <iframe width="320" height="320" style="width: 320px; height: 320px; overflow: hidden;" 
              src="https://ruwix.com/widget/3d/?flags=showalg&colors=U:y%20L:r%20F:g%20R:o%20B:b%20D:w&alg=${element}&setupmoves=${start}"
              scrolling="no"></iframe></div>`
            : ''
        })

        document.querySelector('.result').innerHTML = text + '<br />' + cs

        document.querySelector('.loader').style.display = 'none'
        document.querySelector('#content').style.display = 'block'
      } else if (xhr.readyState === window.XMLHttpRequest.DONE) {
        document.querySelector('.result').innerHTML = 'error in the api, please retry'

        document.querySelector('.loader').style.display = 'none'
        document.querySelector('#content').style.display = 'block'
      }
    })

    xhr.send(null)
  }

  ;(function () {
    initialized()
  })()
})()
