importScripts('/cache-polyfill.js')

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('cfopsolver').then(function (cache) {
      return cache.addAll(['/index.html', '/index.js', '/moves.js', '/cubsjs/cube.js', '/cubsjs/async.js', '/cubsjs/solve.js', '/cubsjs/worker.js'])
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
