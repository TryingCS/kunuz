const i18n = {
  ar: {
    sahih: "صحيح",
    hasan: "حسن",
    daif: "ضعيف",
    dorar: "الشرح على الدرر السنية ↗",
    hadith: "حديث",
    quran: "قرآن",
    athar: "أثر"
  },
  en: {
    sahih: "Authentic",
    hasan: "Good",
    daif: "Weak",
    dorar: "Explanation on Dorar.net ↗",
    hadith: "Hadith",
    quran: "Quran",
    athar: "Athar"
  },
  fr: {
    sahih: "Authentique",
    hasan: "Bon",
    daif: "Faible",
    dorar: "Explication sur Dorar.net ↗",
    hadith: "Hadith",
    quran: "Coran",
    athar: "Athar"
  }
};

const currentLang = 'ar'; // Default language
const params = new URLSearchParams(location.search);
const roomId = params.get('room');
const editMode = params.has('edit');

if (!roomId) {
  location.href = 'index.html';
}

// Load room manifest and data
fetch('data/rooms.json')
  .then(r => r.json())
  .then(rooms => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
      location.href = 'index.html';
      return;
    }
    
    // Set background image
    document.getElementById('map').style.backgroundImage = `url(${room.image})`;
    
    // Load room data
    fetch(room.dataFile)
      .then(r => r.json())
      .then(initRoom);
  });

const map = document.getElementById('map');
const panel = document.getElementById('panel');
let currentEntryIndex = 0;
let currentHotspot = null;

function initRoom(hotspots) {
  hotspots.forEach(hs => {
    const b = document.createElement('button');
    b.className = 'marker';
    b.style.left = hs.x + '%';
    b.style.top = hs.y + '%';
    b.setAttribute('aria-label', hs.place[currentLang]);
    b.innerHTML = `<span class="tip">${hs.place[currentLang]}</span>`;
    
    b.addEventListener('click', () => {
      currentHotspot = hs;
      currentEntryIndex = 0;
      showEntry();
    });
    
    map.appendChild(b);
  });
}

function showEntry() {
  const hs = currentHotspot;
  const entry = hs.entries[currentEntryIndex];
  const totalEntries = hs.entries.length;
  
  let html = `<button class="close">✕</button>
    <h2>${hs.place[currentLang]}</h2>
    <p class="ar">${entry.text_ar}</p>
    <p dir="ltr">${entry.tr[currentLang] || entry.tr.en}</p>
    <p class="meta">${i18n[currentLang][entry.type]} · ${entry.source} — ${i18n[currentLang][entry.grade]}</p>`;
  
  if (entry.note) {
    html += `<p class="note">${entry.note[currentLang]}</p>`;
  }
  
  if (entry.dorar) {
    html += `<a class="dorar" href="${entry.dorar}" target="_blank" rel="noopener">${i18n[currentLang].dorar}</a>`;
  }
  
  if (totalEntries > 1) {
    html += `<div class="dots">`;
    for (let i = 0; i < totalEntries; i++) {
      html += `<span class="dot ${i === currentEntryIndex ? 'active' : ''}"></span>`;
    }
    html += `</div>`;
  }
  
  panel.innerHTML = html;
  panel.hidden = false;
  
  // Close button
  panel.querySelector('.close').onclick = () => panel.hidden = true;
  
  // Click dots to navigate
  if (totalEntries > 1) {
    panel.querySelectorAll('.dot').forEach((dot, i) => {
      dot.style.cursor = 'pointer';
      dot.onclick = () => {
        currentEntryIndex = i;
        showEntry();
      };
    });
  }
}

// Dismiss panel by clicking map or ESC
map.addEventListener('click', e => {
  if (!e.target.closest('.marker')) panel.hidden = true;
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') panel.hidden = true;
});

// Edit mode for coordinates
if (editMode) {
  map.addEventListener('click', e => {
    e.stopPropagation();
    const r = map.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    navigator.clipboard.writeText(`"x": ${x}, "y": ${y}`);
  }, true);
}
