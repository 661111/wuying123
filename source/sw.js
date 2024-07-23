const VERSION = "v1";

// 添加缓存
self.addEventListener("install", event => {
  // 跳过 waiting 状态，然后会直接进入 activate 阶段
  event.waitUntil(self.skipWaiting());
});

// 缓存更新
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all([
        // 更新所有客户端 Service Worker
        self.clients.claim(),

        // 清理旧版本
        cacheNames.map(cacheName => {
          // 如果当前版本和缓存版本不一样
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      ]);
    })
  );
});
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 如果 Service Workder 有自己的返回
      if (response) {
        return response;
      }

      let request = event.request.clone();
      return fetch(request).then(httpRes => {
        // http请求的返回已被抓到，可以处置了。

        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        let responseClone = httpRes.clone();
        caches.open(VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });

        return httpRes;
      });
    })
  );
});
