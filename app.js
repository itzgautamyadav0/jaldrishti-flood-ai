/**
 * AquaSentinel NE - AI Satellite Flood Intelligence Platform
 * Logic Engine: Leaflet Map, Image Comparison Slider, AI Inference Sim, Audio FX, State Telemetry
 */

// ==========================================
// 1. Audio Sound Effects (Web Audio API)
// ==========================================
let audioContext = null;
let soundEnabled = true;

function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'scan') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'alert') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.setValueAtTime(450, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    console.warn('Audio FX error:', e);
  }
}

// ==========================================
// 2. Geospatial Hotspot Data (North East India)
// ==========================================
const floodHotspots = [
  {
    id: 'kaziranga',
    name: 'Kaziranga National Park',
    state: 'Assam',
    coords: [26.5775, 93.1711],
    risk: 'critical',
    inundation: '84.1%',
    areaSubmerged: '362 sq km',
    waterLevel: '56.82 m (1.82m above danger)',
    river: 'Brahmaputra & Diphlu',
    population: 'Wildlife & 48,000 fringe residents',
    camps: 14,
    status: 'Highlands corridor evacuation in progress',
    summary: '90% of forest beats submerged. Rhino and elephant migratory pathways across NH-715 activated toward Karbi Anglong.'
  },
  {
    id: 'majuli',
    name: 'Majuli River Island',
    state: 'Assam',
    coords: [26.9634, 94.2181],
    risk: 'critical',
    inundation: '68.4%',
    areaSubmerged: '240 sq km',
    waterLevel: '86.40 m (2.1m above danger)',
    river: 'Brahmaputra & Subansiri',
    population: '168,000 affected',
    camps: 28,
    status: 'Ferry services suspended, embankment cut at Salmora',
    summary: 'Massive erosion along southern bank. Deep learning SAR shows complete cutoff of Kamalabari and Garmur road networks.'
  },
  {
    id: 'silchar',
    name: 'Silchar (Barak Valley)',
    state: 'Assam',
    coords: [24.8170, 92.7993],
    risk: 'severe',
    inundation: '54.3%',
    areaSubmerged: '185 sq km',
    waterLevel: '20.65 m (0.82m above danger)',
    river: 'Barak & Madhura',
    population: '210,000 affected',
    camps: 35,
    status: 'Urban pumping underway, Bethukandi dyke breach alert',
    summary: 'Flash inundation throughout Rongpur, Bilpar and Public School Road. Sentinel-1 SAR confirms 45% urban area waterlogging.'
  },
  {
    id: 'barpeta',
    name: 'Barpeta District',
    state: 'Assam',
    coords: [26.3216, 91.0063],
    risk: 'critical',
    inundation: '71.2%',
    areaSubmerged: '410 sq km',
    waterLevel: '44.15 m (1.4m above danger)',
    river: 'Brahmaputra, Beki, Manas',
    population: '345,000 affected',
    camps: 52,
    status: 'Critical crop submersion, 3 bridges damaged',
    summary: 'Beki and Manas tributaries overflowing severely. Paddy crops across Sarthebari and Chenga under 5ft of floodwaters.'
  },
  {
    id: 'dhemaji',
    name: 'Dhemaji District',
    state: 'Assam',
    coords: [27.4728, 94.5772],
    risk: 'severe',
    inundation: '62.0%',
    areaSubmerged: '315 sq km',
    waterLevel: '106.30 m (0.95m above danger)',
    river: 'Jiabhoroli & Gai',
    population: '125,000 affected',
    camps: 21,
    status: 'Silt deposition and flash river course alteration',
    summary: 'Fast-moving Himalayan runoff from Arunachal hills carrying excessive sand and gravel, swamping farmland.'
  },
  {
    id: 'garo-hills',
    name: 'West Garo Hills',
    state: 'Meghalaya',
    coords: [25.5141, 90.2032],
    risk: 'severe',
    inundation: '48.5%',
    areaSubmerged: '110 sq km',
    waterLevel: 'Flash surge recorded',
    river: 'Jiniram & Ganol',
    population: '62,000 affected',
    camps: 18,
    status: 'Mudslide alerts on Phulbari-Tikrikilla stretch',
    summary: 'Cloudburst precipitation triggered flash torrents in plains belt. Plain areas adjoining Assam border submerged.'
  },
  {
    id: 'agartala',
    name: 'Agartala / West Tripura',
    state: 'Tripura',
    coords: [23.8315, 91.2868],
    risk: 'moderate',
    inundation: '38.0%',
    areaSubmerged: '75 sq km',
    waterLevel: '10.50 m (Near danger mark)',
    river: 'Howrah River',
    population: '45,000 affected',
    camps: 12,
    status: 'Howrah sluice gates opened, relief distributed',
    summary: 'Flash floodwaters receded from high ground, low-lying wards in Pratapgarh and Baldakhal remain waterlogged.'
  },
  {
    id: 'imphal',
    name: 'Imphal Valley',
    state: 'Manipur',
    coords: [24.8170, 93.9368],
    risk: 'warning',
    inundation: '32.1%',
    areaSubmerged: '64 sq km',
    waterLevel: 'Critical threshold in Loktak Lake',
    river: 'Imphal, Nambul & Iril',
    population: '58,000 affected',
    camps: 16,
    status: 'Nambul river bank reinforcement deployed',
    summary: 'Continuous downpour in Senapati hills causing river swell in Imphal West and Thoubal districts.'
  },
  {
    id: 'teesta',
    name: 'Teesta Basin',
    state: 'Sikkim',
    coords: [27.3389, 88.6065],
    risk: 'severe',
    inundation: '42.7%',
    areaSubmerged: '52 sq km (gorge basin)',
    waterLevel: 'High velocity flash torrent',
    river: 'Teesta River',
    population: '22,000 affected',
    camps: 9,
    status: 'Chungthang & Singtam highway patrol active',
    summary: 'High-altitude glacial melt coupled with localized cloudburst creates rapid surge along NH-10.'
  }
];

// ==========================================
// 3. State-wise Comprehensive Telemetry
// ==========================================
const stateData = {
  assam: {
    name: 'Assam',
    displaced: '1,842,500',
    districtsAffected: '27 of 35',
    activeCamps: '412',
    ndrfTeams: '26 Teams',
    rainfall24h: '142.5 mm',
    riverDischarge: '48,500 m³/s (Guwahati)',
    districts: [
      { name: 'Barpeta', submerged: '71.2%', risk: 'Critical', people: '345k' },
      { name: 'Dhemaji', submerged: '62.0%', risk: 'Severe', people: '125k' },
      { name: 'Morigaon', submerged: '66.8%', risk: 'Critical', people: '198k' },
      { name: 'Cachar', submerged: '54.3%', risk: 'Severe', people: '210k' },
      { name: 'Golaghat (Kaziranga)', submerged: '84.1%', risk: 'Critical', people: '48k' }
    ]
  },
  meghalaya: {
    name: 'Meghalaya',
    displaced: '185,000',
    districtsAffected: '5 of 12',
    activeCamps: '44',
    ndrfTeams: '6 Teams',
    rainfall24h: '318.0 mm (Mawsynram)',
    riverDischarge: 'Flash Torrential Runoff',
    districts: [
      { name: 'West Garo Hills', submerged: '48.5%', risk: 'Severe', people: '62k' },
      { name: 'South Garo Hills', submerged: '41.2%', risk: 'Severe', people: '38k' },
      { name: 'East Khasi Hills', submerged: '22.0%', risk: 'Warning', people: '19k' },
      { name: 'Ri Bhoi', submerged: '28.4%', risk: 'Warning', people: '24k' }
    ]
  },
  arunachal: {
    name: 'Arunachal Pradesh',
    displaced: '74,000',
    districtsAffected: '6 of 26',
    activeCamps: '18',
    ndrfTeams: '5 Teams',
    rainfall24h: '188.4 mm (Pasighat)',
    riverDischarge: 'Siang River High Surge',
    districts: [
      { name: 'East Siang', submerged: '39.4%', risk: 'Severe', people: '28k' },
      { name: 'Lower Dibang Valley', submerged: '34.1%', risk: 'Severe', people: '18k' },
      { name: 'Lohit', submerged: '26.8%', risk: 'Warning', people: '14k' }
    ]
  },
  manipur: {
    name: 'Manipur',
    displaced: '98,000',
    districtsAffected: '4 of 16',
    activeCamps: '31',
    ndrfTeams: '4 Teams',
    rainfall24h: '112.0 mm',
    riverDischarge: 'Loktak Basin Overflow',
    districts: [
      { name: 'Imphal West', submerged: '32.1%', risk: 'Warning', people: '35k' },
      { name: 'Imphal East', submerged: '29.5%', risk: 'Warning', people: '23k' },
      { name: 'Thoubal', submerged: '27.4%', risk: 'Warning', people: '21k' }
    ]
  },
  tripura: {
    name: 'Tripura',
    displaced: '82,000',
    districtsAffected: '3 of 8',
    activeCamps: '24',
    ndrfTeams: '4 Teams',
    rainfall24h: '94.2 mm',
    riverDischarge: 'Howrah / Gomati Alert',
    districts: [
      { name: 'West Tripura', submerged: '38.0%', risk: 'Moderate', people: '45k' },
      { name: 'Khowai', submerged: '31.4%', risk: 'Warning', people: '22k' },
      { name: 'Gomati', submerged: '24.1%', risk: 'Warning', people: '15k' }
    ]
  },
  nagaland: {
    name: 'Nagaland',
    displaced: '32,000',
    districtsAffected: '3 of 16',
    activeCamps: '9',
    ndrfTeams: '3 Teams',
    rainfall24h: '82.0 mm',
    riverDischarge: 'Dhansiri River Surge',
    districts: [
      { name: 'Dimapur', submerged: '31.0%', risk: 'Warning', people: '18k' },
      { name: 'Peren', submerged: '18.2%', risk: 'Normal', people: '8k' }
    ]
  },
  mizoram: {
    name: 'Mizoram',
    displaced: '21,000',
    districtsAffected: '2 of 11',
    activeCamps: '7',
    ndrfTeams: '2 Teams',
    rainfall24h: '98.5 mm',
    riverDischarge: 'Tlawng River Swell',
    districts: [
      { name: 'Aizawl (Riverine)', submerged: '22.0%', risk: 'Warning', people: '12k' },
      { name: 'Mamit', submerged: '19.4%', risk: 'Normal', people: '9k' }
    ]
  },
  sikkim: {
    name: 'Sikkim',
    displaced: '29,000',
    districtsAffected: '3 of 6',
    activeCamps: '12',
    ndrfTeams: '5 Teams',
    rainfall24h: '165.0 mm',
    riverDischarge: 'Teesta Surge Alert',
    districts: [
      { name: 'Mangan (North Sikkim)', submerged: '42.7%', risk: 'Severe', people: '14k' },
      { name: 'Pakyong', submerged: '28.1%', risk: 'Warning', people: '9k' }
    ]
  }
};

// ==========================================
// 4. Initializing Leaflet Map
// ==========================================
let mapInstance = null;
let currentMarkers = [];
let floodPolyline = null;

function initLeafletMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return;

  // North East India view
  mapInstance = L.map('leaflet-map', {
    center: [26.2006, 92.9376],
    zoom: 7,
    zoomControl: false
  });

  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  // High contrast Dark CartoDB Tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Sentinel-1 SAR ISRO/ESA',
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(mapInstance);

  // Render Brahmaputra Main River Stem Polyline
  const riverCoords = [
    [28.1500, 95.8000],
    [27.8000, 95.3000],
    [27.4800, 94.9000], // Dibrugarh
    [26.9600, 94.2200], // Majuli
    [26.6500, 92.8000], // Tezpur
    [26.1800, 91.7500], // Guwahati
    [26.1500, 90.6200], // Goalpara
    [25.8000, 89.9800]  // Dhubri border
  ];

  floodPolyline = L.polyline(riverCoords, {
    color: '#00f2fe',
    weight: 4,
    opacity: 0.85,
    dashArray: '8, 8',
    className: 'brahmaputra-path'
  }).addTo(mapInstance);

  floodPolyline.bindTooltip("Brahmaputra River - Main Inundation Channel", { sticky: true });

  // Add Hotspot Markers
  renderHotspotMarkers();
  renderHotspotList();
  selectHotspot('kaziranga');
}

function renderHotspotMarkers() {
  currentMarkers.forEach(m => mapInstance.removeLayer(m));
  currentMarkers = [];

  floodHotspots.forEach(spot => {
    let color = '#facc15';
    if (spot.risk === 'critical') color = '#ff385c';
    if (spot.risk === 'severe') color = '#ff7e36';

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="position:relative; width: 28px; height: 28px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:${color}; opacity:0.3; animation: pulse-ring 2s infinite;"></div>
          <div style="width: 14px; height: 14px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color};"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker(spot.coords, { icon: customIcon }).addTo(mapInstance);
    
    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; color:#0f172a; padding:6px 2px;">
        <h4 style="margin:0 0 4px; font-size:14px; color:#0f172a;">${spot.name}</h4>
        <div style="font-size:11px; margin-bottom:4px; font-weight:700; color:${color}; text-transform:uppercase;">
          RISK: ${spot.risk} (${spot.inundation} Submerged)
        </div>
        <p style="margin:0; font-size:12px; line-height:1.4;">${spot.summary}</p>
        <div style="margin-top:6px; font-size:11px; color:#64748b;">
          Central Water Commission Level: <strong>${spot.waterLevel}</strong>
        </div>
      </div>
    `);

    marker.on('click', () => {
      playSound('click');
      selectHotspot(spot.id);
    });

    currentMarkers.push(marker);
  });
}

function renderHotspotList() {
  const container = document.getElementById('hotspots-list-container');
  if (!container) return;

  container.innerHTML = floodHotspots.map(spot => `
    <div class="hotspot-item" id="hotspot-item-${spot.id}" onclick="selectHotspot('${spot.id}')">
      <div class="hotspot-info">
        <h4>${spot.name}</h4>
        <span>${spot.state} &bull; ${spot.river}</span>
      </div>
      <div style="text-align: right;">
        <span class="status-pill ${spot.risk}">${spot.risk}</span>
        <div style="font-size:0.75rem; font-family:'JetBrains Mono'; color:#38e1ff; margin-top:3px;">
          ${spot.inundation}
        </div>
      </div>
    </div>
  `).join('');
}

function selectHotspot(id) {
  const spot = floodHotspots.find(s => s.id === id);
  if (!spot) return;

  // Active state
  document.querySelectorAll('.hotspot-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.getElementById(`hotspot-item-${id}`);
  if (activeEl) activeEl.classList.add('active');

  // Fly map to hotspot
  if (mapInstance) {
    mapInstance.flyTo(spot.coords, 9, { duration: 1.2 });
  }

  // Update Detail Card
  const detailContainer = document.getElementById('station-detail-container');
  if (detailContainer) {
    detailContainer.innerHTML = `
      <div class="station-detail-view">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <h3 style="font-size:1.15rem; color:#fff;">${spot.name}</h3>
          <span class="status-pill ${spot.risk}">${spot.risk}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">
          Basin: ${spot.river} &bull; State: ${spot.state}
        </div>

        <div class="detail-row">
          <span>AI Inundation Ratio</span>
          <span style="color:#00f2fe; font-family:'JetBrains Mono';">${spot.inundation}</span>
        </div>
        <div class="detail-row">
          <span>Submerged Area</span>
          <span>${spot.areaSubmerged}</span>
        </div>
        <div class="detail-row">
          <span>CWC River Gauge</span>
          <span style="color:#ff6b81;">${spot.waterLevel}</span>
        </div>
        <div class="detail-row">
          <span>Population Affected</span>
          <span>${spot.population}</span>
        </div>
        <div class="detail-row">
          <span>Active Relief Camps</span>
          <span style="color:#10b981;">${spot.camps} Shelters</span>
        </div>
        <div class="detail-row">
          <span>Operational SITREP</span>
          <span style="text-align:right; max-width:60%; font-size:0.78rem;">${spot.status}</span>
        </div>

        <div style="margin-top:14px; display:flex; gap:8px;">
          <button class="btn-primary" style="flex:1; padding:8px; font-size:0.8rem;" onclick="openSitrepModal('${spot.id}')">
            Download SITREP
          </button>
          <button class="btn-outline" style="padding:8px; font-size:0.8rem;" onclick="triggerEmergencySOS('${spot.name}')">
            SOS Dispatch
          </button>
        </div>
      </div>
    `;
  }
}

// ==========================================
// 5. Image Comparison Slider Studio
// ==========================================
function initComparisonSlider() {
  const container = document.querySelector('.comparison-viewport');
  const postContainer = document.querySelector('.comparison-image.post');
  const postImg = postContainer ? postContainer.querySelector('img') : null;
  const handle = document.querySelector('.slider-handle');

  if (!container || !postContainer || !handle) return;

  let isDragging = false;

  function updateSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    if (pos < 0.03) pos = 0.03;
    if (pos > 0.97) pos = 0.97;

    const percentage = pos * 100;
    postContainer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;

    // Dynamic metrics reaction
    const exposedPercentEl = document.getElementById('metric-inundated-pct');
    const floodedAreaEl = document.getElementById('metric-flooded-km2');
    if (exposedPercentEl && floodedAreaEl) {
      const calcPct = (pos * 68.4).toFixed(1);
      const calcKm2 = Math.round(pos * 4811);
      exposedPercentEl.textContent = `${calcPct}%`;
      floodedAreaEl.textContent = `${calcKm2.toLocaleString()} km²`;
    }
  }

  // Mouse Events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  // Touch Events for Mobile
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updateSliderPosition(e.touches[0].clientX);
  });

  // Click on container to jump
  container.addEventListener('click', (e) => {
    updateSliderPosition(e.clientX);
    playSound('click');
  });
}

function setComparisonMode(mode, btnElement) {
  playSound('click');
  document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const postImg = document.getElementById('post-flood-img');
  const modeTag = document.getElementById('overlay-mode-tag');

  if (!postImg) return;

  if (mode === 'rgb') {
    postImg.src = 'assets/post_flood.jpg';
    if (modeTag) modeTag.textContent = 'Sentinel-2 RGB Flood Inundation';
  } else if (mode === 'mask') {
    postImg.src = 'assets/ai_mask.jpg';
    if (modeTag) modeTag.textContent = 'U-Net++ Deep Learning Semantic Mask';
  } else if (mode === 'sar') {
    postImg.src = 'assets/sar_map.jpg';
    if (modeTag) modeTag.textContent = 'NISAR / Sentinel-1 SAR Radar Composite';
  }
}

// ==========================================
// 6. AI Inference Simulator Studio
// ==========================================
const testScenes = {
  kaziranga: {
    img: 'assets/post_flood.jpg',
    maskImg: 'assets/ai_mask.jpg',
    name: 'Kaziranga National Park - Brahmaputra Spillage',
    area: '48,110 ha',
    accuracy: '98.2%',
    crops: '21,780 ha',
    safe: '55,542 ha',
    f1: '97.8%',
    iou: '96.4%'
  },
  majuli: {
    img: 'assets/sar_map.jpg',
    maskImg: 'assets/ai_mask.jpg',
    name: 'Majuli Island - SAR High Backscatter Analysis',
    area: '34,800 ha',
    accuracy: '97.6%',
    crops: '18,400 ha',
    safe: '42,100 ha',
    f1: '96.9%',
    iou: '95.1%'
  },
  silchar: {
    img: 'assets/pre_flood.jpg',
    maskImg: 'assets/post_flood.jpg',
    name: 'Silchar Urban & Barak Basin Overflow',
    area: '26,450 ha',
    accuracy: '98.5%',
    crops: '12,900 ha',
    safe: '38,200 ha',
    f1: '98.1%',
    iou: '97.0%'
  }
};

let currentSelectedScene = 'kaziranga';

function handleSceneSelect(val) {
  playSound('click');
  currentSelectedScene = val;
  const sceneData = testScenes[val];
  if (!sceneData) return;

  const preview = document.getElementById('inference-preview-img');
  if (preview) {
    preview.src = sceneData.img;
  }
  // Reset boxes & status
  const bbox = document.querySelector('.bounding-box-demo');
  if (bbox) bbox.classList.remove('active');
}

function handleCustomUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  playSound('click');
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('inference-preview-img');
    if (preview) {
      preview.src = e.target.result;
    }
    const dropzoneText = document.getElementById('dropzone-text');
    if (dropzoneText) {
      dropzoneText.innerHTML = `<strong>${file.name}</strong> (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
    }
  };
  reader.readAsDataURL(file);
}

function runAiInference() {
  playSound('scan');

  const btn = document.getElementById('run-inference-btn');
  const scanLine = document.querySelector('.neural-scan-line');
  const progressContainer = document.getElementById('inference-progress-container');
  const progressBar = document.getElementById('inference-progress-bar');
  const progressText = document.getElementById('inference-status-text');
  const bbox = document.querySelector('.bounding-box-demo');
  const previewImg = document.getElementById('inference-preview-img');

  if (btn) btn.disabled = true;
  if (scanLine) scanLine.classList.add('scanning');
  if (progressContainer) progressContainer.style.display = 'flex';

  const steps = [
    { pct: 20, text: 'Calibrating Sentinel SAR C-Band backscatter...' },
    { pct: 45, text: 'Applying Lee speckle filter & MNDWI normalization...' },
    { pct: 70, text: 'Attention U-Net++ ResNet-50 feature extraction...' },
    { pct: 90, text: 'Conditional Random Field (CRF) boundary sharpening...' },
    { pct: 100, text: 'Inference complete! Vector flood mask generated.' }
  ];

  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      if (progressBar) progressBar.style.width = `${step.pct}%`;
      if (progressText) progressText.textContent = step.text;
      currentStep++;
    } else {
      clearInterval(interval);
      playSound('success');

      if (scanLine) scanLine.classList.remove('scanning');
      if (btn) btn.disabled = false;
      if (bbox) bbox.classList.add('active');

      // Swap to segmentation mask
      const sceneData = testScenes[currentSelectedScene] || testScenes.kaziranga;
      if (previewImg) {
        previewImg.src = sceneData.maskImg;
      }

      // Update metrics
      const areaEl = document.getElementById('res-area');
      const accEl = document.getElementById('res-acc');
      const iouEl = document.getElementById('res-iou');
      if (areaEl) areaEl.textContent = sceneData.area;
      if (accEl) accEl.textContent = sceneData.accuracy;
      if (iouEl) iouEl.textContent = sceneData.iou;
    }
  }, 450);
}

// ==========================================
// 7. State-Wise Telemetry Switcher
// ==========================================
function switchStateTab(stateKey, tabElement) {
  playSound('click');
  document.querySelectorAll('.state-tab').forEach(t => t.classList.remove('active'));
  if (tabElement) tabElement.classList.add('active');

  const data = stateData[stateKey];
  if (!data) return;

  const nameEl = document.getElementById('state-name-display');
  const displacedEl = document.getElementById('state-displaced');
  const districtsEl = document.getElementById('state-districts');
  const rainfallEl = document.getElementById('state-rainfall');
  const ndrfEl = document.getElementById('state-ndrf');
  const dischargeEl = document.getElementById('state-discharge');
  const tableBody = document.getElementById('district-table-body');

  if (nameEl) nameEl.textContent = data.name;
  if (displacedEl) displacedEl.textContent = data.displaced;
  if (districtsEl) districtsEl.textContent = data.districtsAffected;
  if (rainfallEl) rainfallEl.textContent = data.rainfall24h;
  if (ndrfEl) ndrfEl.textContent = data.ndrfTeams;
  if (dischargeEl) dischargeEl.textContent = data.riverDischarge;

  if (tableBody) {
    tableBody.innerHTML = data.districts.map(d => {
      let pillClass = 'moderate';
      if (d.risk === 'Critical') pillClass = 'critical';
      if (d.risk === 'Severe') pillClass = 'severe';

      return `
        <tr>
          <td><strong>${d.name}</strong></td>
          <td style="color:#00f2fe; font-family:'JetBrains Mono';">${d.submerged}</td>
          <td><span class="status-pill ${pillClass}">${d.risk}</span></td>
          <td>${d.people}</td>
        </tr>
      `;
    }).join('');
  }
}

// ==========================================
// 8. Situation Report (SITREP) Modal & SOS
// ==========================================
function openSitrepModal(hotspotId) {
  playSound('click');
  const spot = floodHotspots.find(s => s.id === hotspotId) || floodHotspots[0];
  const modal = document.getElementById('sitrep-modal');
  const content = document.getElementById('sitrep-content');

  if (!modal || !content) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  content.innerHTML = `
    <div class="sitrep-paper">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
        <div>
          <h2 style="margin:0; font-size:1.4rem;">DISASTER SITUATION REPORT (SITREP)</h2>
          <div style="font-size:0.85rem; color:#64748b; font-weight:600;">
            JALDRISHTI / ISRO-NESAC GEOSPATIAL INTELLIGENCE DIVISION
          </div>
        </div>
        <div style="text-align:right; font-family:'JetBrains Mono'; font-size:0.8rem; color:#475569;">
          <div>REF: JD-NE-${spot.id.toUpperCase()}-2026</div>
          <div>TIMESTAMP: ${dateStr} IST</div>
        </div>
      </div>

      <div style="background:#f1f5f9; padding:12px; border-radius:6px; margin-bottom:16px; font-size:0.88rem;">
        <strong>OPERATIONAL THEATER:</strong> ${spot.name}, ${spot.state} &bull; 
        <strong>RIVER BASIN:</strong> ${spot.river} &bull;
        <strong>ALERT LEVEL:</strong> <span style="color:#dc2626; font-weight:700;">${spot.risk.toUpperCase()}</span>
      </div>

      <h4 style="color:#0f172a; margin-bottom:8px;">1. Remote Sensing Telemetry (Sentinel-1 SAR / Sentinel-2)</h4>
      <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:0.85rem;">
        <tr style="border-bottom:1px solid #e2e880;">
          <td style="padding:6px 0;"><strong>Inundated Area Extent:</strong></td>
          <td style="padding:6px 0; color:#0284c7;">${spot.areaSubmerged} (${spot.inundation} of survey bounding box)</td>
        </tr>
        <tr style="border-bottom:1px solid #e2e880;">
          <td style="padding:6px 0;"><strong>CWC River Stage:</strong></td>
          <td style="padding:6px 0; color:#dc2626;">${spot.waterLevel}</td>
        </tr>
        <tr style="border-bottom:1px solid #e2e880;">
          <td style="padding:6px 0;"><strong>Estimated Population In Hazard Zone:</strong></td>
          <td style="padding:6px 0;">${spot.population}</td>
        </tr>
        <tr style="border-bottom:1px solid #e2e880;">
          <td style="padding:6px 0;"><strong>Active Relief Camp Shelters:</strong></td>
          <td style="padding:6px 0; color:#16a34a;">${spot.camps} Shelters Operational</td>
        </tr>
      </table>

      <h4 style="color:#0f172a; margin-bottom:8px;">2. AI Geospatial Assessment & Synthesis</h4>
      <p style="margin-bottom:14px; line-height:1.6;">${spot.summary}</p>
      <p style="margin-bottom:18px; line-height:1.6;">
        ${spot.status}. Immediate priority: Embankment armoring using geo-bags and satellite-guided relief drop cordons.
      </p>

      <div style="border-top:1px dashed #cbd5e1; padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.75rem; color:#94a3b8;">Digitally Certified via JalDrishti AI Neural Pipeline v3.4</span>
        <button class="btn-primary" style="padding:8px 18px; font-size:0.85rem;" onclick="window.print()">
          Print Official SITREP
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeModal() {
  playSound('click');
  const modal = document.getElementById('sitrep-modal');
  if (modal) modal.classList.remove('active');
}

function openRequestAccessModal() {
  playSound('click');
  const modal = document.getElementById('request-access-modal');
  if (modal) {
    modal.classList.add('active');
    // Reset form state
    const form = document.getElementById('request-access-form');
    const successBox = document.getElementById('access-success-box');
    if (form) form.style.display = 'flex';
    if (successBox) successBox.style.display = 'none';
  }
}

function closeRequestAccessModal() {
  playSound('click');
  const modal = document.getElementById('request-access-modal');
  if (modal) modal.classList.remove('active');
}

// ==========================================
// 8B. Platform Pillars Backend Interactive Diagnostics
// ==========================================
function openPlatformBackendModal(pillarType = 'satellite') {
  playSound('scan');
  const modal = document.getElementById('platform-backend-modal');
  if (modal) {
    modal.classList.add('active');
    switchPlatformBackendTab(pillarType);
  }
}

function closePlatformBackendModal() {
  playSound('click');
  const modal = document.getElementById('platform-backend-modal');
  if (modal) modal.classList.remove('active');
}

function switchPlatformBackendTab(tabKey) {
  playSound('click');
  document.querySelectorAll('.backend-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
  });
  document.querySelectorAll('.backend-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `backend-panel-${tabKey}`);
  });
}

function simulateSatellitePassQuery() {
  playSound('scan');
  const terminal = document.getElementById('sat-terminal-body');
  if (!terminal) return;
  
  terminal.innerHTML = `
    <div class="terminal-line cmd">$ curl -X GET "https://api.copernicus.eu/v1/sentinel-1/ne-india-latest" -H "Auth: Bearer JD-SAR-TOKEN"</div>
    <div class="terminal-line">[18:58:12] Establishing SSL handshake with Sentinel-1 Ground Segment (ESRIN Frascati)...</div>
    <div class="terminal-line success">[18:58:13] 200 OK &bull; Response Payload Received (4.2 MB GeoTIFF Header)</div>
    <div class="terminal-line">{</div>
    <div class="terminal-line">&nbsp;&nbsp;"granuleId": "S1A_IW_GRDH_1SDV_20261006T120531_050412_0607AA",</div>
    <div class="terminal-line">&nbsp;&nbsp;"platform": "Sentinel-1A C-Band SAR (5.405 GHz)",</div>
    <div class="terminal-line">&nbsp;&nbsp;"orbitMode": "Descending Orbit Pass #142",</div>
    <div class="terminal-line">&nbsp;&nbsp;"polarization": ["VV", "VH Dual-Polarized"],</div>
    <div class="terminal-line">&nbsp;&nbsp;"swathWidthKm": 250,</div>
    <div class="terminal-line">&nbsp;&nbsp;"spatialResolution": "10m Pixel Multi-Look",</div>
    <div class="terminal-line">&nbsp;&nbsp;"cloudPenetration": "100% (Zero Cloud Attenuation)",</div>
    <div class="terminal-line">&nbsp;&nbsp;"bbox": [25.80, 89.98, 28.15, 95.80],</div>
    <div class="terminal-line">&nbsp;&nbsp;"status": "Radiometrically Calibrated Sigma-0 dB"</div>
    <div class="terminal-line">}</div>
    <div class="terminal-line success">[18:58:14] Raw SAR backscatter successfully routed to JalDrishti AI inference pipeline.</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

function simulateModelBenchmark() {
  playSound('scan');
  const terminal = document.getElementById('ai-terminal-body');
  const btn = document.getElementById('btn-run-benchmark');
  if (btn) btn.disabled = true;

  if (terminal) {
    terminal.innerHTML = `
      <div class="terminal-line cmd">$ python3 -m jaldrishti.engine.inference --model attention_unet_plus --tensor [1,4,1024,1024] --device cuda:0</div>
      <div class="terminal-line">[18:58:20] Loading PyTorch TensorRT Engine: jal_drishti_brahmaputra_v3.4.pt...</div>
      <div class="terminal-line">[18:58:20] Memory allocated on GPU 0 (NVIDIA A100-SXM4-80GB): 2.41 GB / 80 GB</div>
      <div class="terminal-line warn">[18:58:21] Running 7x7 Refined Lee Speckle Filter & MNDWI Normalization...</div>
      <div class="terminal-line">[18:58:21] Executing ResNet-50 Encoder Feature Pyramids (FPN)...</div>
      <div class="terminal-line">[18:58:22] Attention Gates evaluating dense water vs. paddy backscatter threshold...</div>
      <div class="terminal-line success">[18:58:22] Inference Succeeded! Forward Pass Latency: 114.8 ms</div>
      <div class="terminal-line success">&bull; Mean IoU Score: 98.42% &bull; Dice Coefficient: 0.9881 &bull; Pixel Accuracy: 98.2%</div>
      <div class="terminal-line">&bull; Extracted Inundated Surface: 48,110 hectares across Kaziranga & Barpeta</div>
    `;
    terminal.scrollTop = terminal.scrollHeight;
  }

  setTimeout(() => {
    playSound('success');
    if (btn) btn.disabled = false;
  }, 900);
}

function simulateGeoJsonFetch() {
  playSound('scan');
  const terminal = document.getElementById('loc-terminal-body');
  if (!terminal) return;

  terminal.innerHTML = `
    <div class="terminal-line cmd">$ psql -d jaldrishti_spatial -c "SELECT ST_AsGeoJSON(flood_polygons) FROM cwc_inundation WHERE state='Assam';"</div>
    <div class="terminal-line success">[18:58:30] Query Executed on PostGIS Spatial Engine &bull; Return Code 0 (24ms)</div>
    <div class="terminal-line">{</div>
    <div class="terminal-line">&nbsp;&nbsp;"type": "FeatureCollection",</div>
    <div class="terminal-line">&nbsp;&nbsp;"features": [</div>
    <div class="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;{ "type": "Feature", "properties": { "district": "Barpeta", "river": "Beki/Brahmaputra", "dangerLevelDiff": "+1.40m", "risk": "CRITICAL" }, "geometry": { "type": "Polygon", "coordinates": [[[91.00, 26.32], [91.05, 26.35], [91.02, 26.38], [91.00, 26.32]]] } },</div>
    <div class="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;{ "type": "Feature", "properties": { "hotspot": "Kaziranga", "nh715Status": "SUBMERGED_KM_142_TO_148", "animalsEvacuated": 128 }, "geometry": { "type": "MultiPolygon" } }</div>
    <div class="terminal-line">&nbsp;&nbsp;]</div>
    <div class="terminal-line">}</div>
    <div class="terminal-line success">[18:58:31] Live CWC Sensor Status: Guwahati Pandu Gauge: 49.85m (Danger 49.68m) - RED ALERT</div>
  `;
  terminal.scrollTop = terminal.scrollHeight;
}

function handleRequestAccessSubmit(event) {
  event.preventDefault();
  playSound('success');
  const form = document.getElementById('request-access-form');
  const successBox = document.getElementById('access-success-box');
  const tokenEl = document.getElementById('generated-token');
  
  const token = 'JD-NE-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-SAR';
  if (tokenEl) tokenEl.textContent = token;
  if (form) form.style.display = 'none';
  if (successBox) successBox.style.display = 'block';
}

function triggerEmergencySOS(locationName) {
  playSound('alert');
  alert(`[EMERGENCY SOS DISPATCH TRIGGERED]\n\nJalDrishti Critical Alert dispatched to:\n- NDRF 1st Bn (Patgaon, Guwahati)\n- Assam State Disaster Management Authority (ASDMA)\n- State Emergency Operation Centre (SEOC)\n\nPriority Rescue Mission Alert logged for: ${locationName}`);
}

function toggleSound(btn) {
  soundEnabled = !soundEnabled;
  if (btn) {
    btn.innerHTML = soundEnabled ? `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
    ` : `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>
    `;
    btn.title = soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX';
  }
}

// ==========================================
// 9. Document Ready Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initLeafletMap();
  initComparisonSlider();
  switchStateTab('assam');

  // Wire up Confidence Slider value text
  const confSlider = document.getElementById('confidence-slider');
  const confDisplay = document.getElementById('confidence-display');
  if (confSlider && confDisplay) {
    confSlider.addEventListener('input', (e) => {
      confDisplay.textContent = `${e.target.value}%`;
    });
  }

  // Automatic asset path resolver (works whether files are in root or assets/)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      if (!this.dataset.fallbackTried) {
        this.dataset.fallbackTried = 'true';
        if (this.src.includes('assets/')) {
          this.src = this.src.replace('assets/', '');
        } else {
          const parts = this.src.split('/');
          const filename = parts.pop();
          this.src = parts.join('/') + '/assets/' + filename;
        }
      }
    });
  });

  // Smooth click sound on any primary button
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-danger').forEach(b => {
    b.addEventListener('click', () => playSound('click'));
  });
});
