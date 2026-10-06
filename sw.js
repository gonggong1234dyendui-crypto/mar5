'use strict';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// No chat, token, message, attachment or API response is cached by this worker.
self.addEventListener('push',event=>{let data={};try{data=event.data.json();}catch{}event.waitUntil(self.registration.showNotification(data.title||'去火星了也能聊',{body:data.body||'你有新消息',icon:new URL('icon.png',self.registration.scope).href,badge:new URL('icon.png',self.registration.scope).href,tag:data.room?'mars-room-'+data.room:'mars-chat',data:{room:data.room},renotify:true}));});
self.addEventListener('notificationclick',event=>{event.notification.close();const url=new URL('./',self.registration.scope);if(event.notification.data?.room)url.searchParams.set('room',event.notification.data.room);event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{const client=clients.find(c=>c.url.startsWith(self.registration.scope));if(client){await client.focus();client.postMessage({type:'notification',room:event.notification.data?.room});}else await self.clients.openWindow(url.href);}));});
