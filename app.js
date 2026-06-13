// ===== DARK MODE TOGGLE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// Load dark mode preference on startup
function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark');
    }
}

// ===== VIEW MANAGEMENT =====
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
    if (targetView) {
        targetView.classList.add('active');
    }
}

// Set up back button listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.getAttribute('data-view') || 'home';
            showView(view);
        });
    });
    
    // Set up radial menu item listeners
    document.querySelectorAll('.radial-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            if (action) {
                showView(action);
                toggleRadialMenu(); // Close menu after selection
            }
        });
    });
});

// ===== RADIAL MENU =====
function toggleRadialMenu() {
    const menu = document.getElementById('radialMenu');
    menu.classList.toggle('active');
}

document.getElementById('circleMenu').addEventListener('click', toggleRadialMenu);

// ===== SIGN OUT =====
document.getElementById('circleSignout').addEventListener('click', () => {
    if (confirm('¿Estás segura de que quieres cerrar sesión?')) {
        localStorage.clear();
        location.reload();
    }
});

// ===== LOGIN & REGISTRATION =====
document.getElementById('doLoginBtn').addEventListener('click', login);
document.getElementById('showRegisterBtn').addEventListener('click', () => {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('registerModal').classList.add('active');
});

document.getElementById('closeRegisterBtn').addEventListener('click', () => {
    document.getElementById('registerModal').classList.remove('active');
    document.getElementById('loginOverlay').style.display = 'flex';
});

document.getElementById('doRegisterBtn').addEventListener('click', registerGuest);

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMsg = document.getElementById('loginErrorMsg');
    
    if (!email || !password) {
        errorMsg.textContent = 'Por favor completa todos los campos';
        return;
    }
    
    // Simple validation (in real app, use backend)
    localStorage.setItem('userEmail', email);
    localStorage.setItem('loggedIn', 'true');
    
    document.getElementById('loginOverlay').style.display = 'none';
    initializeApp();
}

function registerGuest() {
    const email = document.getElementById('regEmail').value;
    const pass1 = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;
    const errorMsg = document.getElementById('registerErrorMsg');
    
    if (!email || !pass1 || !pass2) {
        errorMsg.textContent = 'Por favor completa todos los campos';
        return;
    }
    
    if (pass1 !== pass2) {
        errorMsg.textContent = 'Las contraseñas no coinciden';
        return;
    }
    
    if (pass1.length < 6) {
        errorMsg.textContent = 'La contraseña debe tener al menos 6 caracteres';
        return;
    }
    
    localStorage.setItem('userEmail', email);
    localStorage.setItem('loggedIn', 'true');
    document.getElementById('registerModal').classList.remove('active');
    document.getElementById('loginOverlay').style.display = 'none';
    initializeApp();
}

// ===== APP INITIALIZATION =====
function initializeApp() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) return;
    
    // Set greeting
    updateGreeting();
    
    // Update clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Update countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Update dynamic block
    updateDynamicBlock();
    
    // Initialize music player
    initMusicPlayer();
    
    // Load dark mode
    loadDarkModePreference();
}

// ===== GREETING MESSAGE =====
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    const dynamicTitle = document.getElementById('blockTitle');
    const dynamicContent = document.getElementById('blockContent');
    
    let greeting, emoji, title, content;
    
    if (hour < 6) {
        greeting = 'Buenas madrugadas, Maryse 🌙';
        title = '🌙 Hora de descansar';
        content = '<span>💤 Prepárate para dormir bien</span><span>🧘‍♀️ Meditación antes de dormir</span>';
    } else if (hour < 12) {
        greeting = 'Buenos días, Maryse ☀️';
        title = '🌅 Inicio del día';
        content = '<span>💧 Bebe un vaso de agua</span><span>🤸‍♀️ Muévete 3–5 minutos</span><span>🧠 Define una intención simple del día</span>';
    } else if (hour < 17) {
        greeting = 'Buenas tardes, Maryse 🌤️';
        title = '🌤️ Medio del día';
        content = '<span>🥗 Come algo saludable</span><span>📚 Aprovecha para aprender algo nuevo</span><span>🚶‍♀️ Camina un poco</span>';
    } else if (hour < 21) {
        greeting = 'Buenas noches, Maryse 🌆';
        title = '🌆 Atardecer';
        content = '<span>🎯 Reflexiona sobre tu día</span><span>📝 Escribe en tu diario</span><span>🎵 Disfruta de música relajante</span>';
    } else {
        greeting = 'Buenas noches, Maryse 🌙';
        title = '🌙 Noche';
        content = '<span>🎮 Juega o relájate</span><span>📞 Habla con tus seres queridos</span><span>🌟 Planifica mañana</span>';
    }
    
    greetingEl.textContent = greeting;
    dynamicTitle.textContent = title;
    dynamicContent.innerHTML = content;
}

// ===== CLOCK UPDATE =====
function updateClock() {
    const now = new Date();
    
    // Digital clock
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const horaClasica = document.getElementById('horaClasica');
    if (horaClasica) {
        horaClasica.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Date
    const fechaClasica = document.getElementById('fechaClasica');
    if (fechaClasica) {
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        fechaClasica.textContent = `${day}/${month}/${year}`;
    }
    
    // Day name
    const diaClasico = document.getElementById('diaClasico');
    if (diaClasico) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        diaClasico.textContent = days[now.getDay()];
    }
    
    // Dad's live clock
    const dadLiveClock = document.getElementById('dadLiveClock');
    const dadLiveDate = document.getElementById('dadLiveDate');
    if (dadLiveClock && dadLiveDate) {
        dadLiveClock.textContent = `${hours}:${minutes}:${seconds}`;
        dadLiveDate.textContent = `${day}/${month}/${year}`;
    }
}

// ===== BIRTHDAY COUNTDOWN =====
function updateCountdown() {
    // Assuming birthday is December 15, 2010 (14 years old turning 15)
    const birthday = new Date(new Date().getFullYear(), 11, 15); // Dec 15
    
    // If birthday has passed this year, count to next year
    if (new Date() > birthday) {
        birthday.setFullYear(birthday.getFullYear() + 1);
    }
    
    const now = new Date();
    const diff = birthday - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// ===== DYNAMIC BLOCK (time-based) =====
function updateDynamicBlock() {
    const hour = new Date().getHours();
    updateGreeting(); // This handles dynamic block updates
}

// ===== MUSIC PLAYER =====
const playlist = [
    { title: 'Aimer - La vie en rose', artist: 'French Classics', lang: '🇫🇷', youtube: 'https://www.youtube.com/results?search_query=Aimer+La+vie+en+rose' },
    { title: 'Ed Sheeran - Perfect', artist: 'English Hits', lang: '🇬🇧', youtube: 'https://www.youtube.com/results?search_query=Ed+Sheeran+Perfect' },
    { title: 'Daft Punk - Get Lucky', artist: 'Electronic', lang: '🇬🇧', youtube: 'https://www.youtube.com/results?search_query=Daft+Punk+Get+Lucky' },
    { title: 'Billie Eilish - Levitating', artist: 'Pop', lang: '🇬🇧', youtube: 'https://www.youtube.com/results?search_query=Billie+Eilish+Levitating' },
];

let currentSongIndex = 0;
let isPlaying = false;

function initMusicPlayer() {
    renderPlaylist();
    updateNowPlaying();
}

function renderPlaylist() {
    const playlistEl = document.getElementById('marysePlaylist');
    playlistEl.innerHTML = playlist.map((song, idx) => `
        <div class="song-item ${idx === currentSongIndex ? 'active' : ''}" onclick="playSong(${idx})">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-lang">${song.lang}</div>
        </div>
    `).join('');
}

function playSong(index) {
    currentSongIndex = index;
    isPlaying = true;
    updateNowPlaying();
    renderPlaylist();
    
    // Open YouTube with song lyrics
    const song = playlist[index];
    window.open(song.youtube, '_blank');
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    const btn = document.getElementById('playPauseBtn');
    btn.textContent = isPlaying ? '⏸️' : '▶️';
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playSong(currentSongIndex);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    playSong(currentSongIndex);
}

function updateNowPlaying() {
    const song = playlist[currentSongIndex];
    document.getElementById('nowPlayingTitle').textContent = song.title;
    document.getElementById('nowPlayingArtist').textContent = song.artist;
    document.getElementById('nowPlayingLang').textContent = song.lang;
}

// ===== AVATAR CHANGE =====
const avatars = ['👧', '👱‍♀️', '🧑‍🦰', '👩', '👩‍🦱'];
let currentAvatar = 0;

document.getElementById('avatarBtn').addEventListener('click', () => {
    currentAvatar = (currentAvatar + 1) % avatars.length;
    document.getElementById('avatarContent').textContent = avatars[currentAvatar];
    localStorage.setItem('avatar', avatars[currentAvatar]);
});

function loadAvatar() {
    const saved = localStorage.getItem('avatar');
    if (saved) {
        document.getElementById('avatarContent').textContent = saved;
        currentAvatar = avatars.indexOf(saved);
    }
}

// ===== MOOD TRACKING =====
document.querySelectorAll('.mood-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const mood = card.getAttribute('data-mood');
        localStorage.setItem('currentMood', mood);
        
        // Generate acrostic if Maryse selected happy mood
        if (mood === 'happy') {
            generateAcrostic();
        }
    });
});

function generateAcrostic() {
    const acrostico = document.getElementById('acrosticoMaryse');
    const acrosticText = `M - Momento de alegría
A - Aprecio mis logros
R - Reconozco mis fortalezas
Y - Yo soy suficiente
S - Soy valiente
E - Estoy en paz`;
    
    acrostico.textContent = acrosticText;
    acrostico.style.display = 'block';
}

// ===== LANGUAGE SELECTOR =====
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const lang = e.target.getAttribute('data-lang');
        localStorage.setItem('language', lang);
        // In real app, this would change all content language
    });
});

// ===== WEEK SELECTOR =====
document.getElementById('weekSelector').addEventListener('change', (e) => {
    const week = e.target.value;
    localStorage.setItem('currentWeek', week);
    updateWeekTheme(week);
});

function updateWeekTheme(week) {
    const themes = {
        'auto': { emoji: '📅', title: 'Semana Actual' },
        '0': { emoji: '💭', title: 'Emociones' },
        '1': { emoji: '📚', title: 'Escuela' },
        '2': { emoji: '✈️', title: 'Viajes' },
        '3': { emoji: '🚀', title: 'Tecnología' },
        '4': { emoji: '🎵', title: 'Música' },
        '5': { emoji: '🍽️', title: 'Comida' },
        '6': { emoji: '⚽', title: 'Deportes' },
        '7': { emoji: '🌍', title: 'Naturaleza' },
    };
    
    const theme = themes[week];
    const heroEl = document.getElementById('weekThemeHero');
    heroEl.innerHTML = `<h3>${theme.emoji} ${theme.title}</h3><p>Semana dedicada a ${theme.title.toLowerCase()}</p>`;
}

// ===== DIARY ENTRY SAVE =====
document.addEventListener('DOMContentLoaded', () => {
    const saveDiaryBtn = document.querySelector('[data-action="saveDiary"]');
    if (saveDiaryBtn) {
        saveDiaryBtn.addEventListener('click', saveDiaryEntry);
    }
});

function saveDiaryEntry() {
    const title = document.getElementById('diaryTitle').value;
    const text = document.getElementById('diaryText').value;
    
    if (!title || !text) {
        alert('Por favor completa título y contenido');
        return;
    }
    
    const entry = {
        id: Date.now(),
        title,
        text,
        date: new Date().toLocaleDateString('es-ES'),
    };
    
    let entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    entries.unshift(entry);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
    
    document.getElementById('diaryTitle').value = '';
    document.getElementById('diaryText').value = '';
    
    loadDiaryEntries();
}

function loadDiaryEntries() {
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const container = document.getElementById('diaryEntries');
    
    if (container) {
        container.innerHTML = entries.map(entry => `
            <div class="diary-entry">
                <strong>${entry.title}</strong>
                <small>${entry.date}</small>
                <p>${entry.text}</p>
            </div>
        `).join('');
    }
}

// ===== INITIALIZE ON PAGE LOAD =====
window.addEventListener('load', () => {
    loadDarkModePreference();
    loadAvatar();
    
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
        document.getElementById('loginOverlay').style.display = 'none';
        initializeApp();
        loadDiaryEntries();
    }
    
    // Set initial week theme
    updateWeekTheme(localStorage.getItem('currentWeek') || 'auto');
    
    // Initialize dark toggle button
    document.getElementById('darkToggleBtn').addEventListener('click', toggleDarkMode);
});
