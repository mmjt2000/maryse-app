import { getClient } from './client.js';
import { DIARY_COLLECTION } from '../config.js';
import { parseDatePB } from '../utils/date.js';

export async function loadDiary() {
    const pb = getClient();
    if (!pb) return [];
    try {
        const records = await pb.collection(DIARY_COLLECTION).getFullList({ requestKey: null });
        return records.map(e => ({
            id: e.id,
            title: e.title || 'Sin título',
            text: e.text || '',
            photo: e.photo ? pb.files.getUrl(e, e.photo) : null,
            date: parseDatePB(e.created)
        }));
    } catch (error) {
        console.error("[diary] Error:", error);
        return [];
    }
}

export async function saveDiaryEntry(title, text, photoBlob) {
    const pb = getClient();
    if (!pb) throw new Error('PocketBase no listo');
    const formData = new FormData();
    formData.append('title', title || 'Sin título');
    formData.append('text', text || '');
    if (photoBlob) {
        formData.append('photo', photoBlob, 'diary_' + Date.now() + '.jpg');
    }
    await pb.collection(DIARY_COLLECTION).create(formData);
}

export async function deleteDiaryEntry(id) {
    const pb = getClient();
    if (!pb) throw new Error('PocketBase no listo');
    await pb.collection(DIARY_COLLECTION).delete(id);
}