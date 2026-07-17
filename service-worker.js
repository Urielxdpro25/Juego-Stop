// ==========================================
// Service Worker - juego Basta o Stop
// Versión del caché
// ==========================================

const CACHE = "gestionador-v9";

// Archivos que se guardarán para usar sin Internet
const ARCHIVOS = [
    "./Index.html",
    "./manifest.json",
    "./LogoUriel.png",
    "./Contacto.html",
    "./Juego.html",
];

// ==========================================
// Instalación
// ==========================================

self.addEventListener("install", event => {

    console.log("Service Worker instalado.");

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE)

        .then(cache => {

            return cache.addAll(ARCHIVOS);

        })

    );

});

// ==========================================
// Activación
// Elimina cachés antiguas
// ==========================================

self.addEventListener("activate", event => {

    console.log("Service Worker activado.");

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE) {
                        console.log("Eliminando caché:", key);
                        return caches.delete(key);
                    }

                })

            );

        })

    );

    self.clients.claim();

});

// ==========================================
// Peticiones
// Busca primero en caché.
// Si no existe, va a Internet.
// ==========================================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if (response) {
                return response;
            }

            return fetch(event.request);

        })

    );

});