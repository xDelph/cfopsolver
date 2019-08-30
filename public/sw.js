importScripts('cache-polyfill.js')

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('cfopsolver').then(function (cache) {
      return cache.addAll([
        '/index.html',
        '/index.js',
        '/roofpig.css',
        '/assets/sprite.png',
        '/lib/jquery.min.js',
        '/lib/roofpig_and_three.min.js',
        '/cfopsolver/moves.js',
        '/cfopsolver/cfopsolver-helpers.js',
        '/cfopsolver/cfopsolver.js',
        '/cubejs/cube.js',
        '/cubejs/async.js',
        '/cubejs/solve.js',
        '/cubejs/worker.js'
      ])
    })
  )
})

self.addEventListener('fetch', function (event) {
  console.log(event.request.url)

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})
