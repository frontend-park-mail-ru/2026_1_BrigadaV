class GuidelyServiceWorker {
    staticCacheName = 'guidely-static';
    apiCacheName = 'guidely-api';
    precacheUrls = new Set(['/', '/index.html']);

    constructor() {
        this.initListeners();
    }

    initListeners() {
        self.addEventListener('install', (event) => event.waitUntil(this.handleInstall()));
        self.addEventListener('activate', (event) => event.waitUntil(this.handleActivate()));
        self.addEventListener('fetch', (event) => this.handleRequest(event));
    }

    async handleInstall() {
        try {
            const response = await fetch('/assets-manifest.json');
            const assets = await response.json();

            if (Array.isArray(assets)) {
                assets.forEach(asset => this.precacheUrls.add(asset));
            }

        } catch { }

        const cache = await caches.open(this.staticCacheName);
        await cache.addAll([...this.precacheUrls]);

        self.skipWaiting();
    }

    async handleActivate() {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map((cache) => {
                if (cache !== this.staticCacheName && cache !== this.apiCacheName) {
                    return caches.delete(cache);
                }
            })
        );
        await self.clients.claim();
    }

    handleRequest(event) {
        const { request } = event;
        const url = new URL(request.url);

        if (request.method !== 'GET') return;

        if (url.pathname.startsWith('/api') || url.pathname.startsWith('/uploads')) {
            event.respondWith(this.apiFetch(request));
        } else {
            event.respondWith(this.staticFetch(request));
        }
    }

    async apiFetch(request) {
        try {
            const response = await fetch(request);

            if (!response || response.status !== 200) {
                return response;
            }

            const responseClone = response.clone();
            const cache = await caches.open(this.apiCacheName);
            await cache.put(request, responseClone);

            return response;
        } catch {
            const cachedRequest = await caches.match(request);

            if (cachedRequest) {
                return cachedRequest;
            }

            return new Response(
                JSON.stringify({ error: 'Отсутствует подключение к интернету' }),
                {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    }

    async staticFetch(request) {
        const cachedRequest = await caches.match(request);

        if (cachedRequest) {
            return cachedRequest;
        }

        try {
            const response = await fetch(request);

            if (!response || response.status !== 200) {
                return response;
            }

            const responseClone = response.clone();
            const cache = await caches.open(this.staticCacheName);
            await cache.put(request, responseClone);

            return response;
        } catch (error) {
            if (request.mode === 'navigate') {
                return caches.match('/index.html');
            }

            throw error;
        }
    }
}

new GuidelyServiceWorker();
