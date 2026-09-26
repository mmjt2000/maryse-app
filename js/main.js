import { initClient } from './api/client.js';
import * as photosApi from './api/photos.js';
import * as diaryApi from './api/diary.js';
import * as progressApi from './api/progress.js';

window.mostrarGaleria = function() {
    const container = document.getElementById("galeriaFotos");
    if (!container) return;
    const fotos = photosApi.getPhotos();
    if (fotos.length === 0) {
        container.innerHTML = '<p style="text-align:center;width:100%;">No hay fotos aún</p>';
        return;
    }
    container.innerHTML = fotos.map(f => `
        <div style="width:150px; border-radius:16px; overflow:hidden; border:1px solid var(--border); background:var(--card); position:relative;">
            <img src="${f.data}" style="width:100%; height:120px; object-fit:cover;">
            <div style="padding:8px; font-size:0.7rem; display:flex; justify-content:space-between; align-items:center;">
                <span>📅 ${f.fecha}</span>
                <button onclick="borrarFoto('${f.id}')" style="background:#dc2626; color:white; border:none; border-radius:20px; padding:4px 12px; cursor:pointer; font-size:0.7rem;">🗑️</button>
            </div>
        </div>
    `).join("");
};

window.guardarNuevaFoto = async function() {
    const input = document.getElementById("cargarFoto");
    const file = input.files[0];
    if (!file) { alert("Selecciona una foto"); return; }
    const btn = document.querySelector('#viewFotos .btn-primary');
    if (!btn) return;
    const txt = btn.innerText;
    btn.innerText = "Subiendo...";
    btn.disabled = true;
    try {
        await photosApi.uploadPhoto(file);
        window.mostrarGaleria();
        input.value = "";
        alert("Foto guardada");
    } catch (e) {
        console.error(e);
        alert("Error: " + e.message);
    } finally {
        btn.innerText = txt;
        btn.disabled = false;
    }
};

window.borrarFoto = async function(id) {
    if (!confirm("Eliminar esta foto?")) return;
    try {
        await photosApi.deletePhoto(id);
        window.mostrarGaleria();
        alert("Foto eliminada");
    } catch (e) {
        console.error(e);
        alert("Error: " + e.message);
    }
};

window.renderDiary = async function() {
    const container = document.getElementById("diaryEntries");
    if (!container) return;
    const entries = await diaryApi.loadDiary();
    if (entries.length === 0) {
        container.innerHTML = "<p>No hay recuerdos aún</p>";
        return;
    }
    container.innerHTML = entries.map(e => {
        const photoHtml = e.photo ? '<img src="' + e.photo + '" style="max-width:100%; border-radius:12px; margin-top:8px;">' : '';
        return '<div class="diary-entry">' +
            '<strong>' + e.title + '</strong><br>' +
            '<small>' + e.date + '</small>' +
            (e.text ? '<p>' + e.text + '</p>' : '') +
            photoHtml +
            '<button onclick="borrarDiaryEntry(\'' + e.id + '\')" style="background:#dc2626; color:white; border:none; border-radius:20px; padding:4px 12px; cursor:pointer; font-size:0.7rem; margin-top:8px;">Eliminar</button>' +
            '</div>';
    }).join('');
};

window.borrarDiaryEntry = async function(id) {
    if (!confirm("Eliminar este recuerdo?")) return;
    try {
        await diaryApi.deleteDiaryEntry(id);
        await window.renderDiary();
    } catch (e) {
        console.error(e);
        alert("Error: " + e.message);
    }
};

window.saveDiaryEntry = async function() {
    if (!window.diaryPhotoData && window.originalPhotoData) {
        const c = document.getElementById("photoCanvas");
        if (c && c.width > 0) {
            window.diaryPhotoData = c.toDataURL("image/jpeg", 0.7);
        }
    }
    const title = document.getElementById("diaryTitle").value || "Sin título";
    const text = document.getElementById("diaryText").value;
    if (!text && !window.diaryPhotoData) { alert("Escribe algo o sube una foto"); return; }
    let blob = null;
    if (window.diaryPhotoData && typeof window.dataURLtoBlob === 'function') {
        blob = window.dataURLtoBlob(window.diaryPhotoData);
    }
    try {
        await diaryApi.saveDiaryEntry(title, text, blob);
        document.getElementById("diaryTitle").value = "";
        document.getElementById("diaryText").value = "";
        document.getElementById("diaryPhoto").value = "";
        document.getElementById("diaryPreview").style.display = "none";
        document.getElementById("photoEditor").style.display = "none";
        window.diaryPhotoData = null;
        window.originalPhotoData = null;
        await window.renderDiary();
        alert("Recuerdo guardado");
    } catch (e) {
        console.error(e);
        alert("Error: " + e.message);
    }
};

(async () => {
    await initClient();
    await photosApi.loadPhotos();
    window.mostrarGaleria();
    await window.renderDiary();
    
    // Charger la progression depuis PocketBase
    const remoteProgress = await progressApi.loadProgress();
    if (remoteProgress) {
        if (remoteProgress.xp) localStorage.setItem('maryse_xp', remoteProgress.xp);
        if (remoteProgress.level) localStorage.setItem('maryse_level', remoteProgress.level);
        if (remoteProgress.academy_level !== undefined) localStorage.setItem('academy_level', remoteProgress.academy_level);
        if (remoteProgress.completed_lessons) localStorage.setItem('maryse_completed', JSON.stringify(remoteProgress.completed_lessons));
        if (remoteProgress.grammar_completed) localStorage.setItem('maryse_grammar', JSON.stringify(remoteProgress.grammar_completed));
        if (remoteProgress.exam_completed) localStorage.setItem('maryse_exam_completed', JSON.stringify(remoteProgress.exam_completed));
        if (remoteProgress.dad_progress) localStorage.setItem('maryse_dad_progress', JSON.stringify(remoteProgress.dad_progress));
        console.log("[progress] Cargado desde PocketBase:", remoteProgress);
    } else {
        console.log("[progress] Primer uso - sincronizando localStorage...");
        await progressApi.syncFromLocalStorage();
    }
    
    // Auto-sync : sauvegarder après chaque modification
    window.syncProgress = async function() {
        const data = {
            xp: parseInt(localStorage.getItem('maryse_xp') || '0'),
            level: parseInt(localStorage.getItem('maryse_level') || '1'),
            academy_level: parseInt(localStorage.getItem('academy_level') || '0'),
            completed_lessons: JSON.parse(localStorage.getItem('maryse_completed') || '[]'),
            grammar_completed: JSON.parse(localStorage.getItem('maryse_grammar') || '[]'),
            exam_completed: JSON.parse(localStorage.getItem('maryse_exam_completed') || '[]'),
            dad_progress: JSON.parse(localStorage.getItem('maryse_dad_progress') || '{}')
        };
        await progressApi.saveProgress(data);
        console.log("[progress] Guardado en PocketBase");
    };
    
    console.log("[main.js] Modulos cargados");
})();