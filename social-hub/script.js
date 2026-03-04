// Audio Context for UI Sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function clickSound(f = 400) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = f;
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.1);
}

// Data Store
const allPlaylists = {
    bollywood: [
        { t: "Tum Se Hi", a: "Mohit Chauhan" }, { t: "Kesariya", a: "Arijit Singh" }, { t: "Kabira", a: "Rekha Bhardwaj" }, { t: "Chaiyya Chaiyya", a: "A.R. Rahman" }, { t: "Kun Faya Kun", a: "A.R. Rahman" },
        { t: "Agar Tum Saath Ho", a: "Alka Yagnik" }, { t: "Tera Ban Jaunga", a: "Akhil Sachdeva" }, { t: "Raataan Lambiyan", a: "Jubin Nautiyal" }, { t: "Tum Hi Ho", a: "Arijit Singh" }, { t: "Pee Loon", a: "Mohit Chauhan" },
        { t: "Dil Diyan Gallan", a: "Atif Aslam" }, { t: "Hawayein", a: "Arijit Singh" }, { t: "Channa Mereya", a: "Arijit Singh" }, { t: "Kal Ho Naa Ho", a: "Sonu Nigam" }
    ],
    english: [
        { t: "Starboy", a: "The Weeknd" }, { t: "Blinding Lights", a: "The Weeknd" }, { t: "Mockingbird", a: "Eminem" }, { t: "Lovely", a: "Billie Eilish" }, { t: "Night Changes", a: "One Direction" },
        { t: "Save Your Tears", a: "The Weeknd" }, { t: "Perfect", a: "Ed Sheeran" }, { t: "Shape of You", a: "Ed Sheeran" }, { t: "Believer", a: "Imagine Dragons" }, { t: "Thunder", a: "Imagine Dragons" },
        { t: "Someone Like You", a: "Adele" }, { t: "All of Me", a: "John Legend" }, { t: "God's Plan", a: "Drake" }, { t: "Bohemian Rhapsody", a: "Queen" }
    ],
    workout: [
        { t: "Till I Collapse", a: "Eminem" }, { t: "Power", a: "Kanye West" }, { t: "Eye of the Tiger", a: "Survivor" }, { t: "Lose Yourself", a: "Eminem" },
        { t: "Stronger", a: "Kanye West" }, { t: "The Search", a: "NF" }, { t: "Remember The Name", a: "Fort Minor" }, { t: "Phenomenal", a: "Eminem" }, { t: "Can't Stop", a: "Red Hot Chili Peppers" },
        { t: "Started From The Bottom", a: "Drake" }, { t: "HUMBLE.", a: "Kendrick Lamar" }, { t: "Believer", a: "Imagine Dragons" }
    ]
};

const themes = [
    { id: "monochrome", name: "Mono", c1: "#ffffff", c2: "#000000" },
    { id: "serika-dark", name: "Serika", c1: "#323437", c2: "#e2b714" },
    { id: "carbon", name: "Carbon", c1: "#111111", c2: "#f6f6f6" },
    { id: "nord", name: "Nord", c1: "#2e3440", c2: "#88c0d0" },
    { id: "olivia", name: "Olivia", c1: "#1c1b1d", c2: "#deaf9d" },
    { id: "bento", name: "Bento", c1: "#2d394d", c2: "#ff7a90" },
    { id: "lavender", name: "Lavender", c1: "#ada1ee", c2: "#f4efff" },
    { id: "cyber", name: "Cyber", c1: "#000b1e", c2: "#00e0ff" },
    { id: "rose-pine", name: "Rose Pine", c1: "#191724", c2: "#ebbcba" },
    { id: "matrix", name: "Matrix", c1: "#000000", c2: "#15ff00" }
];

let activePlaylistKey = 'bollywood';

// Playlist Logic
function openSongs(key) {
    activePlaylistKey = key;
    document.getElementById('current-playlist-name').innerText = key;
    document.getElementById('playlist-choice-modal').classList.remove('active');
    document.getElementById('song-list-modal').classList.add('active');
    renderSongs();
    clickSound(600);
}

function backToPlaylists() {
    document.getElementById('song-list-modal').classList.remove('active');
    document.getElementById('playlist-choice-modal').classList.add('active');
    clickSound(300);
}

function renderSongs(query = "") {
    const list = document.getElementById('song-list');
    list.innerHTML = "";
    const songs = allPlaylists[activePlaylistKey];
    songs.filter(s => s.t.toLowerCase().includes(query.toLowerCase()) || s.a.toLowerCase().includes(query.toLowerCase())).forEach(s => {
        const item = document.createElement('div');
        item.className = "song-item";
        item.innerHTML = `<div><div class="text-sm font-medium">${s.t}</div><div class="text-[0.65rem] opacity-40 uppercase tracking-wider">${s.a}</div></div><i class="fas fa-play text-[10px] opacity-20"></i>`;
        item.onclick = () => {
            document.getElementById('song-display').innerText = s.t;
            document.getElementById('music-status').innerText = `Playing from ${activePlaylistKey}`;
            document.getElementById('bars').classList.add('active');
            document.getElementById('song-list-modal').classList.remove('active');
            clickSound(800);
        };
        list.appendChild(item);
    });
}

// Theme Logic
function renderThemes() {
    const grid = document.getElementById('theme-grid');
    grid.innerHTML = "";
    const activePal = document.body.getAttribute('data-palette');
    themes.forEach(t => {
        const item = document.createElement('div');
        item.className = `theme-item ${activePal === t.id ? 'active' : ''}`;
        item.innerHTML = `<div class="dot-preview"><div class="w-1/2 h-full" style="background:${t.c1}"></div><div class="w-1/2 h-full" style="background:${t.c2}"></div></div><span>${t.name}</span>`;
        item.onclick = () => {
            document.body.setAttribute('data-palette', t.id);
            localStorage.setItem('savedPalette', t.id);
            renderThemes();
            clickSound(500);
        };
        grid.appendChild(item);
    });
}

// Clock Logic
function updateClock() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (3600000 * 5.5));
    const timeStr = ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    document.getElementById('clock').innerHTML = `IST • ${timeStr}`;
}

// Initialization & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial Load
    let v = parseInt(localStorage.getItem('views') || 0) + 1;
    localStorage.setItem('views', v);
    document.getElementById('view-count').innerText = v.toLocaleString();
    const saved = localStorage.getItem('savedPalette') || 'monochrome';
    document.body.setAttribute('data-palette', saved);

    setInterval(updateClock, 1000);
    updateClock();

    // Event Bindings
    document.getElementById('spotify-card').onclick = (e) => {
        if (!e.target.closest('#random-btn')) {
            document.getElementById('playlist-choice-modal').classList.add('active');
            clickSound(400);
        }
    };

    document.getElementById('random-btn').onclick = (e) => {
        e.stopPropagation();
        const keys = Object.keys(allPlaylists);
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        const s = allPlaylists[randKey][Math.floor(Math.random() * allPlaylists[randKey].length)];
        document.getElementById('song-display').innerText = s.t;
        document.getElementById('music-status').innerText = `Shuffle: ${randKey}`;
        document.getElementById('bars').classList.add('active');
        clickSound(800);
    };

    document.getElementById('palette-btn').onclick = () => { renderThemes(); document.getElementById('theme-overlay').classList.add('active'); clickSound(400); };
    document.getElementById('intro-trigger').onclick = () => { document.getElementById('intro-overlay').classList.add('active'); clickSound(400); };
    document.getElementById('flip-btn').onclick = () => { document.body.classList.toggle('is-flipped'); clickSound(300); };
    document.getElementById('song-search').oninput = (e) => renderSongs(e.target.value);

    // DOB Toggle
    const dobContainer = document.getElementById('dob-container');
    const dobVal = document.getElementById('dob-val');
    let isExpanded = false;
    dobContainer.onclick = () => {
        isExpanded = !isExpanded;
        dobVal.innerText = isExpanded ? "1/May/2007" : "2007";
        clickSound(isExpanded ? 600 : 300);
    };

    // Global Close Handlers
    document.querySelectorAll('.close-music').forEach(b => b.onclick = () => {
        document.getElementById('playlist-choice-modal').classList.remove('active');
        document.getElementById('song-list-modal').classList.remove('active');
    });
    document.querySelectorAll('.close-modal').forEach(b => b.onclick = () => b.closest('.custom-overlay').classList.remove('active'));
});