importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');

importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
apiKey: "AIzaSyB3KfNcPZb42EFNANr1vu5qLaBQJBSRXnU",
authDomain: "meteo-pisticci.firebaseapp.com",
projectId: "meteo-pisticci",
storageBucket: "meteo-pisticci.firebasestorage.app",
messagingSenderId: "383061112581",
appId: "1:383061112581:web:c25eb6292342f96bcee96c",
measurementId: "G-NPS7Q9EBKG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

self.registration.showNotification(
payload.notification.title,
{
body: payload.notification.body,
icon: '/manifest-icon-192.png'
}
);

});
