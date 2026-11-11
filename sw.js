/* Офлайн-режим: приложение целиком кэшируется при первом открытии */
const CACHE='psp-v3';
const FILES=['./','index.html','manifest.json','icons/favicon.ico','icons/icon_32.png','icons/icon_48.png','icons/icon_180.png','icons/icon_192.png','icons/icon_512.png','icons/icon_maskable_512.png','icons/logo_dark.webp','icons/logo_light.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  const res=await net;if(res)return res;
  return r.mode==='navigate'?(await c.match('index.html'))||Response.error():Response.error()}))});
