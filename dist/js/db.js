"use strict";!function(){function t(t){return new Promise(function(e,n){t.onsuccess=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function e(e,n,r){var o,i=new Promise(function(i,s){t(o=e[n].apply(e,r)).then(i,s)});return i.request=o,i}function n(t,e,n){n.forEach(function(n){Object.defineProperty(t.prototype,n,{get:function(){return this[e][n]},set:function(t){this[e][n]=t}})})}function r(t,n,r,o){o.forEach(function(o){o in r.prototype&&(t.prototype[o]=function(){return e(this[n],o,arguments)})})}function o(t,e,n,r){r.forEach(function(r){r in n.prototype&&(t.prototype[r]=function(){return this[e][r].apply(this[e],arguments)})})}function i(t,n,r,o){o.forEach(function(o){o in r.prototype&&(t.prototype[o]=function(){return t=this[n],(r=e(t,o,arguments)).then(function(t){if(t)return new a(t,r.request)});var t,r})})}function s(t){this._index=t}function a(t,e){this._cursor=t,this._request=e}function u(t){this._store=t}function c(t){this._tx=t,this.complete=new Promise(function(e,n){t.oncomplete=function(){e()},t.onerror=function(){n(t.error)},t.onabort=function(){n(t.error)}})}function l(t,e,n){this._db=t,this.oldVersion=e,this.transaction=new c(n)}function p(t){this._db=t}n(s,"_index",["name","keyPath","multiEntry","unique"]),r(s,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(s,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(a,"_cursor",["direction","key","primaryKey","value"]),r(a,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(a.prototype[e]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[e].apply(n._cursor,r),t(n._request).then(function(t){if(t)return new a(t,n._request)})})})}),u.prototype.createIndex=function(){return new s(this._store.createIndex.apply(this._store,arguments))},u.prototype.index=function(){return new s(this._store.index.apply(this._store,arguments))},n(u,"_store",["name","keyPath","indexNames","autoIncrement"]),r(u,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(u,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),o(u,"_store",IDBObjectStore,["deleteIndex"]),c.prototype.objectStore=function(){return new u(this._tx.objectStore.apply(this._tx,arguments))},n(c,"_tx",["objectStoreNames","mode"]),o(c,"_tx",IDBTransaction,["abort"]),l.prototype.createObjectStore=function(){return new u(this._db.createObjectStore.apply(this._db,arguments))},n(l,"_db",["name","version","objectStoreNames"]),o(l,"_db",IDBDatabase,["deleteObjectStore","close"]),p.prototype.transaction=function(){return new c(this._db.transaction.apply(this._db,arguments))},n(p,"_db",["name","version","objectStoreNames"]),o(p,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(t){[u,s].forEach(function(e){t in e.prototype&&(e.prototype[t.replace("open","iterate")]=function(){var e,n=(e=arguments,Array.prototype.slice.call(e)),r=n[n.length-1],o=this._store||this._index,i=o[t].apply(o,n.slice(0,-1));i.onsuccess=function(){r(i.result)}})})}),[s,u].forEach(function(t){t.prototype.getAll||(t.prototype.getAll=function(t,e){var n=this,r=[];return new Promise(function(o){n.iterateCursor(t,function(t){t?(r.push(t.value),void 0===e||r.length!=e?t.continue():o(r)):o(r)})})})});var f={open:function(t,n,r){var o=e(indexedDB,"open",[t,n]),i=o.request;return i.onupgradeneeded=function(t){r&&r(new l(i.result,t.oldVersion,i.transaction))},o.then(function(t){return new p(t)})},delete:function(t){return e(indexedDB,"deleteDatabase",[t])}};"undefined"!=typeof module?(module.exports=f,module.exports.default=module.exports):self.idb=f}();class DBHelper{static get DATABASE_URL(){return"http://localhost:1337"}static fetchRestaurantsFromServer(t){fetch(`${DBHelper.DATABASE_URL}/restaurants`).then(t=>t.json()).then(e=>t(null,e))}static fetchRestaurants(t){idb.open("restaurantDB").then(function(t){return t.transaction("restaurants","readonly").objectStore("restaurants").getAll()}).then(e=>t(null,e))}static fetchRestaurantById(t,e){DBHelper.fetchRestaurants((n,r)=>{if(n)e(n,null);else{const n=r.find(e=>e.id==t);n?e(null,n):e("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(t,e){DBHelper.fetchRestaurants((n,r)=>{if(n)e(n,null);else{const n=r.filter(e=>e.cuisine_type==t);e(null,n)}})}static fetchRestaurantByNeighborhood(t,e){DBHelper.fetchRestaurants((n,r)=>{if(n)e(n,null);else{const n=r.filter(e=>e.neighborhood==t);e(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(t,e,n){DBHelper.fetchRestaurants((r,o)=>{if(r)n(r,null);else{let r=o;"all"!=t&&(r=r.filter(e=>e.cuisine_type==t)),"all"!=e&&(r=r.filter(t=>t.neighborhood==e)),n(null,r)}})}static fetchNeighborhoods(t){DBHelper.fetchRestaurants((e,n)=>{if(e)t(e,null);else{const e=n.map((t,e)=>n[e].neighborhood),r=e.filter((t,n)=>e.indexOf(t)==n);t(null,r)}})}static fetchCuisines(t){DBHelper.fetchRestaurants((e,n)=>{if(e)t(e,null);else{const e=n.map((t,e)=>n[e].cuisine_type),r=e.filter((t,n)=>e.indexOf(t)==n);t(null,r)}})}static urlForRestaurant(t){return`./restaurant.html?id=${t.id}`}static imageUrlForRestaurant(t){return t.photograph?`/img/${t.photograph}.jpg`:"/img/nia.jpg"}static mapMarkerForRestaurant(t,e){return new google.maps.Marker({position:t.latlng,title:t.name,url:DBHelper.urlForRestaurant(t),map:e,animation:google.maps.Animation.DROP})}}"indexedDB"in window||console.log("This browser doesn't support IndexedDB");var dbPromise=idb.open("restaurantDB",7,function(t){if(!t.objectStoreNames.contains("restaurants"))t.createObjectStore("restaurants",{keyPath:"id"})});dbPromise.then(t=>{DBHelper.fetchRestaurantsFromServer((e,n)=>{n.forEach(function(e){t.transaction("restaurants","readwrite").objectStore("restaurants").put(e)})})}),navigator.serviceWorker&&navigator.serviceWorker.register("sw.js").then(function(){console.log("Registration worked!")}).catch(function(){console.log("Registration failed!")});