const CACHE_NAME = 'typecc-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. 僅處理 GET 請求且僅限 http/https 協定
    if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // 2. 排除開發環境必要的資源
    if (
        url.pathname.includes('/@vite/client') ||
        url.pathname.includes('/@react-refresh') ||
        url.pathname.includes('node_modules')
    ) {
        return;
    }

    // 3. 快取策略：Network First (因為是打字遊戲，內容可能更新，但要支援離線)
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clonedResponse);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
