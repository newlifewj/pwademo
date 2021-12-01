self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v11').then(function(cache) {
      return cache.adderAll([
        
        '/pwademo/gallery/myLittleVader.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log(`---------001-----${event.request.url}`)
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      console.log(`---------111-----${event.request.url}`)
      return response;
    } else {
    console.log(`---------222-----${event.request.url}`)
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open('v11').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/pwademo/gallery/myLittleVader.jpg');
      });
    }
  }));
});
