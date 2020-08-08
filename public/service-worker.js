const FILES_TO_CACHE = [
    '/',
    'index.html',
    'manifest.webmanifest',
    '/assets/css/styles.css',
    '/assets/js/index.js',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'

];

const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
 
// install
self.addEventListener("install", function(evt) {
  console.log(`[Service Worker] Install`);
    evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });
  
  // self.addEventListener("activate", function(evt) {
  //   evt.waitUntil(
  //     caches.keys().then(keyList => {
  //       return Promise.all(
  //         keyList.map(key => {
  //           if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
  //             console.log("Removing old cache data", key);
  //             return caches.delete(key);
  //           }
  //         })
  //       );
  //     })
  //   );
  
  //   self.clients.claim();
  // });
  
  // fetch
  self.addEventListener("fetch", function(evt) {
    // console.log(`[Service Worker] fetched resource` + evt.request.url)
    // cache successful requests to the API
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
                console.log(response + "was good")
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    // if the request is not for the API, serve static assets using "offline-first" approach.
    // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
    evt.respondWith(
      caches.match(evt.request).then(function(response) {
        console.log(response) //gets undefined on refresh
        console.log(evt.request)//request method get for bootstrap 
        return response || fetch(evt.request);
      })
    );
  });
  
  
  