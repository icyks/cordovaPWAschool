const dbsessions = "sessions";
const dbsepakers = "speakers";
const dbschedules = "schedules";
const dbfavorite = "favorite";
const oneDay = 86400000;
const dayMaj = 2;

(function () {
    'use strict';
    if (!('serviceWorker' in navigator)) {
        console.log('Service worker non supporté');
        return;
    }
    navigator.serviceWorker.register('sw.js')
    .then(() => {
        console.log('Enregistrement OK');
    })
    .catch(error => {
        console.log('Enregistrement KO :', error);
    });

    // envoyer un message au service worker
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
        "command": "MISE_A_JOUR",
        "message": "Hello je suis un client"
        });
    }
})();

function checkUpdateData(){
    var d = new Date();
    var t = d.getTime();
    var lastUpdate = localStorage.getItem("lastUpdate");
    if (lastUpdate) {
        if (t-lastUpdate >= oneDay*dayMaj) {
            localStorage.setItem("lastUpdate",t);
            return updateData();
        }
    } else {
        localStorage.setItem("lastUpdate",t);
        return updateData();
    }

    return new Promise((resolve, reject) => {
        resolve("not updated");
    });
}

function updateData(){
    return Promise.all([
    fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/speakers.json')
        .then(resp => resp.json())
            .then(speakers => {
                var store = localforage.createInstance({storeName: dbsepakers});
                for (var key in speakers) {
                    store.setItem(key, speakers[key]);
                }
                console.log("*****************MISE A JOUR DATA SPEAKERS*********************");
            }),
    fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/sessions.json')
        .then(resp => resp.json())
            .then(sessions => {
                var store2 = localforage.createInstance({storeName: dbsessions});
                for (var key in sessions) {
                    store2.setItem(key, sessions[key]);
                }
                console.log("*****************MISE A JOUR DATA SESSIONS*********************");
            }),
    fetch('https://raw.githubusercontent.com/DevInstitut/conference-data/master/schedule.json')
        .then(resp => resp.json())
            .then(schedules => {
                var store3 = localforage.createInstance({storeName: dbschedules});
                for (var key in schedules) {
                    store3.setItem(key,schedules[key]);
                }
                console.log("*****************MISE A JOUR DATA SCHEDULES*********************");
            }),
        function() {
            var store4 = localforage.createInstance({storeName: dbfavorite});
            console.log("*****************MISE A JOUR DATA FAVORITES*********************");            
        }
    ]);
}