const CACHE_NAME = 'hsk-pwa-v4';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const DB_NAME = 'hsk_pwa_settings';
const DB_STORE = 'kv';

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains(DB_STORE)) req.result.createObjectStore(DB_STORE); };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function dbSet(key,value){
  const db=await openDB();
  return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
}
async function dbGet(key){
  const db=await openDB();
  return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readonly');const r=tx.objectStore(DB_STORE).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
}

self.addEventListener('install',(event)=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',(event)=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',(event)=>{
  const req=event.request;
  if(req.method!=='GET') return;
  // Không can thiệp vào API Gemini / request động không phải tài nguyên tĩnh.
  if(req.url.includes('generativelanguage.googleapis.com')) return;
  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy)).catch(()=>{});
        return res;
      }).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./')))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(cached=>cached||fetch(req).then(res=>{
      if(res && (res.ok || res.type==='opaque')) caches.open(CACHE_NAME).then(c=>c.put(req,res.clone())).catch(()=>{});
      return res;
    }).catch(()=>new Response('',{status:504,statusText:'Offline'})))
  );
});

self.addEventListener('message',(event)=>{
  const data=event.data||{};
  if(data.type==='SKIP_WAITING') self.skipWaiting();
  if(data.type==='SET_REMINDER_SETTINGS'){
    event.waitUntil(dbSet('reminder',{enabled:!!data.enabled,time:data.time||'20:00'}));
  }
});

async function maybeSendReminder(){
  const settings=await dbGet('reminder').catch(()=>null);
  if(!settings?.enabled) return;
  const now=new Date();
  const [hh,mm]=(settings.time||'20:00').split(':').map(Number);
  const current=now.getHours()*60+now.getMinutes();
  const target=hh*60+mm;
  // Background Sync có thể chạy trễ; cho phép cửa sổ 30 phút quanh giờ đã đặt.
  if(Math.abs(current-target)>30) return;
  const dateKey=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
  const last=await dbGet('lastReminderDate').catch(()=>null);
  if(last===dateKey) return;
  await self.registration.showNotification('📚 Đến giờ học HSK',{
    body:'Đã đến giờ học tiếng Trung. Mở app và hoàn thành bài học hôm nay nhé!',
    tag:'hsk-daily-study-reminder',renotify:true,lang:'vi-VN',
    data:{url:'./'}
  });
  await dbSet('lastReminderDate',dateKey);
}

self.addEventListener('periodicsync',(event)=>{
  if(event.tag==='hsk-daily-study-reminder') event.waitUntil(maybeSendReminder());
});
self.addEventListener('notificationclick',(event)=>{
  event.notification.close();
  const target=event.notification?.data?.url||'./';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list){ if('focus' in client) return client.focus(); }
    return clients.openWindow(target);
  }));
});
