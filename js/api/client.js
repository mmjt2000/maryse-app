import { POCKETBASE_URL } from '../config.js';

let pb = null;

export function getClient() {
    return pb;
}

export function initClient() {
    return new Promise((resolve) => {
        const tryInit = () => {
            if (window.PocketBase) {
                pb = new window.PocketBase(POCKETBASE_URL);
                console.log("[module] PocketBase conectado:", POCKETBASE_URL);
                resolve(pb);
            } else {
                setTimeout(tryInit, 100);
            }
        };
        tryInit();
    });
}