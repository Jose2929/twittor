importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-cache-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const INMUTABLE_CACHE = 'inmutable-cache-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'avatars/hulk.jpg',
    'avatars/ironman.jpg',
    'avatars/spiderman.jpg',
    'avatars/thor.jpg',
    'avatars/wolverine.jpg',
    'app.js'
]; 

const APP_SHELL_INMUTABLE =[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e=>{
    const cache_static =  caches.open(STATIC_CACHE).then(cache=>{
        cache.addAll(APP_SHELL);
    }).catch(console.log);

    const cache_inmutable =  caches.open(INMUTABLE_CACHE).then(cache=>{
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil(Promise.all([cache_static,cache_inmutable]));
});

self.addEventListener('activate', e=>{
    const revCache = caches.keys().then(keys=>{
        keys.forEach(key =>{
            if(key !== STATIC_CACHE && key.includes('static-cache')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(revCache);
});

self.addEventListener('fetch', e=>{
    const res = caches.match(e.request).then(res =>{
        if(res) return res;

        return fetch(e.request).then(newRes =>{
            return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
        });
    });

    e.respondWith(res);
});
