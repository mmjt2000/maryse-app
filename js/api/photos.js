import { getClient } from './client.js';
import { PHOTOS_COLLECTION } from '../config.js';
import { parseDatePB } from '../utils/date.js';

const STORAGE_KEY = 'maryse_fotos_galeria';
let fotosGuardadas = [];

function saveLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fotosGuardadas)); } catch(e) {}
}

export function getPhotos() {
    return fotosGuardadas;
}

export async function loadPhotos() {
    const pb = getClient();
    if (!pb) return [];
    try {
        const records = await pb.collection(PHOTOS_COLLECTION).getFullList({ requestKey: null });
        fotosGuardadas = records.map(r => ({
            id: r.id,
            data: pb.files.getUrl(r, r.image),
            fecha: parseDatePB(r.created),
            pbPath: r.id
        }));
        saveLocal();
        return fotosGuardadas;
    } catch (error) {
        console.error("[photos] Error:", error);
        return [];
    }
}

export async function uploadPhoto(file) {
    const pb = getClient();
    if (!pb) throw new Error('PocketBase no listo');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', 'Foto ' + new Date().toLocaleDateString());
    await pb.collection(PHOTOS_COLLECTION).create(formData);
    return loadPhotos();
}

export async function deletePhoto(id) {
    const pb = getClient();
    if (!pb) throw new Error('PocketBase no listo');
    await pb.collection(PHOTOS_COLLECTION).delete(id);
    fotosGuardadas = fotosGuardadas.filter(f => f.id !== id);
    saveLocal();
}