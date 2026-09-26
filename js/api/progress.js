import { getClient } from './client.js';

const COLLECTION = 'progress_maryse';

function getUserEmail() {
    return sessionStorage.getItem('maryse_user') 
        || sessionStorage.getItem('laeticia_user') 
        || sessionStorage.getItem('user_email')
        || 'guest';
}

let cachedRecord = null;

export async function loadProgress() {
    const pb = getClient();
    if (!pb) return null;
    const email = getUserEmail();
    try {
        const records = await pb.collection(COLLECTION).getFullList({
            filter: `user_email="${email}"`,
            requestKey: null
        });
        if (records.length > 0) {
            cachedRecord = records[0];
            return cachedRecord;
        }
        return null;
    } catch (error) {
        console.error("[progress] Error:", error);
        return null;
    }
}

export async function saveProgress(data) {
    const pb = getClient();
    if (!pb) return null;
    const email = getUserEmail();
    try {
        const payload = {
            user_email: email,
            xp: data.xp || 0,
            level: data.level || 1,
            academy_level: data.academy_level || 0,
            completed_lessons: data.completed_lessons || [],
            grammar_completed: data.grammar_completed || [],
            exam_completed: data.exam_completed || [],
            dad_progress: data.dad_progress || {}
        };
        if (cachedRecord && cachedRecord.id) {
            const updated = await pb.collection(COLLECTION).update(cachedRecord.id, payload);
            cachedRecord = updated;
            return updated;
        } else {
            const created = await pb.collection(COLLECTION).create(payload);
            cachedRecord = created;
            return created;
        }
    } catch (error) {
        console.error("[progress] Error saving:", error);
        return null;
    }
}

export async function syncFromLocalStorage() {
    const data = {
        xp: parseInt(localStorage.getItem('laeticia_xp') || localStorage.getItem('maryse_xp') || '0'),
        level: parseInt(localStorage.getItem('laeticia_level') || localStorage.getItem('maryse_level') || '1'),
        academy_level: parseInt(localStorage.getItem('academy_level') || '0'),
        completed_lessons: JSON.parse(localStorage.getItem('laeticia_completed') || localStorage.getItem('maryse_completed') || '[]'),
        grammar_completed: JSON.parse(localStorage.getItem('laeticia_grammar') || localStorage.getItem('maryse_grammar') || '[]'),
        exam_completed: JSON.parse(localStorage.getItem('laeticia_exam_completed') || localStorage.getItem('maryse_exam_completed') || '[]'),
        dad_progress: JSON.parse(localStorage.getItem('laeticia_dad_progress') || localStorage.getItem('maryse_dad_progress') || '{}')
    };
    return await saveProgress(data);
}