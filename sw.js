/* Visor AR — Vía · service worker: la app abre sin señal y guarda las teselas del mapa ya vistas */
const CORE_CACHE="visorvias-core-v9";
const TILE_CACHE="visorvias-tiles-v1";
const TILE_MAX=3000;
const CORE=["./","./index.html","./manifest.webmanifest","./lib/three/three.min.js","./lib/proj4/proj4.js","./icons/icon-192.png","./icons/icon-512.png"];
const TILE_HOSTS=["tile.openstreetmap.org","server.arcgisonline.com"];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CORE_CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CORE_CACHE&&k!==TILE_CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});

let putCount=0;
async function trimTiles(){
  const c=await caches.open(TILE_CACHE), keys=await c.keys();
  for(let i=0;i<keys.length-TILE_MAX;i++) await c.delete(keys[i]);
}
async function tileFetch(req){
  const c=await caches.open(TILE_CACHE);
  const hit=await c.match(req);
  if(hit) return hit;
  const res=await fetch(req);
  if(res.ok && res.type!=="opaque"){ c.put(req,res.clone()); if(++putCount%50===0) trimTiles(); }
  return res;
}
async function pageFetch(req){           // red primero (así se actualiza), caché si no hay señal
  const c=await caches.open(CORE_CACHE);
  try{
    const ctl=new AbortController(), t=setTimeout(()=>ctl.abort(),4000);
    const res=await fetch(req,{signal:ctl.signal}); clearTimeout(t);
    if(res.ok) c.put("./index.html",res.clone());
    return res;
  }catch(err){
    return (await c.match("./index.html")) || (await c.match("./")) || Response.error();
  }
}
async function staticFetch(req){          // librerías e íconos: caché primero
  const c=await caches.open(CORE_CACHE);
  const hit=await c.match(req,{ignoreSearch:true});
  if(hit) return hit;
  const res=await fetch(req);
  if(res.ok) c.put(req,res.clone());
  return res;
}
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(TILE_HOSTS.indexOf(url.hostname)>=0){ e.respondWith(tileFetch(req)); return; }
  if(url.origin!==self.location.origin) return;
  if(req.mode==="navigate"){ e.respondWith(pageFetch(req)); return; }
  e.respondWith(staticFetch(req));
});
