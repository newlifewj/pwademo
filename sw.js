self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/pwademo/',
        '/pwademo/index.html',
        '/pwademo/style.css',
        '/pwademo/app.js',
        '/pwademo/image-list.js',
        '/pwademo/star-wars-logo.jpg',
        '/pwademo/gallery/bountyHunters.jpg',
        '/pwademo/gallery/myLittleVader.jpg',
        '/pwademo/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/pwademo/gallery/myLittleVader.jpg');
      });
    }
  }));
});
