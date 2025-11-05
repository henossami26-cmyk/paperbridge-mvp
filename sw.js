diff --git a/sw.js b/sw.js
new file mode 100644
index 0000000000000000000000000000000000000000..f9f4f1e8eb4ed4e9e54c9d11db2c3d5b56745db1
--- /dev/null
+++ b/sw.js
@@ -0,0 +1,39 @@
+const CACHE_NAME = 'paperbridge-shell-v1';
+const OFFLINE_URLS = ['/', '/index.html', '/manifest.json', '/icon.svg'];
+
+self.addEventListener('install', event => {
+  event.waitUntil(
+    caches
+      .open(CACHE_NAME)
+      .then(cache => cache.addAll(OFFLINE_URLS))
+      .then(() => self.skipWaiting())
+  );
+});
+
+self.addEventListener('activate', event => {
+  event.waitUntil(
+    caches
+      .keys()
+      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
+      .then(() => self.clients.claim())
+  );
+});
+
+self.addEventListener('fetch', event => {
+  if (event.request.method !== 'GET') {
+    return;
+  }
+
+  event.respondWith(
+    caches.match(event.request).then(cached => {
+      if (cached) return cached;
+
+      return fetch(event.request).catch(() => {
+        if (event.request.mode === 'navigate') {
+          return caches.match('/index.html');
+        }
+        return undefined;
+      });
+    })
+  );
+});
