var staticCacheName = 'static-v1';
var filesToCache = [
  'joggle.css',
  'joggle.html',
  'joggle.js',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'http://www.noiseaddicts.com/samples_1w72b820/3721.mp3'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});
