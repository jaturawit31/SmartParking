// 🔴 ใส่ Web App URL ของ Google Apps Script ที่นี่
const GAS_URL = "https://script.google.com/macros/s/AKfycbxh3yY3N64ESLAN28xIiTg7Kjr-ko-r6h0loLdqWz_f_QxJ8LAgawBys4wqNaKk3KQ/exec";
const REFRESH_MS = 3000;

function tickClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('th-TH', { hour12: false });
}
setInterval(tickClock, 1000); 
tickClock();

function updateUI(data) {
  let available = 0;
  
  const slots = [
    { distance: data.distance1, occupied: (data.status1 === 'มีรถ') },
    { distance: data.distance2, occupied: (data.status2 === 'มีรถ') }
  ];

  slots.forEach((slot, i) => {
    const n = i + 1;
    const car = document.getElementById('car' + n);
    const beam = document.getElementById('beam' + n);
    const statusText = document.getElementById('status' + n);
    const distText = document.getElementById('dist' + n);
    const tag = document.getElementById('tag' + n);
    const card = document.getElementById('card' + n);

    if (distText) {
      distText.textContent = (slot.distance !== undefined && slot.distance !== "") ? parseFloat(slot.distance).toFixed(1) : '--';
    }
    
    if (slot.occupied) {
      if (car) car.setAttribute('opacity', '1');
      if (beam) beam.classList.add('occupied');
      if (statusText) { statusText.textContent = 'มีรถ'; statusText.style.fill = '#ffb400'; }
      if (tag) { tag.textContent = 'มีรถ'; tag.className = 'readout-tag occupied'; }
      if (card) card.classList.add('occupied');
    } else {
      available++;
      if (car) car.setAttribute('opacity', '0');
      if (beam) beam.classList.remove('occupied');
      if (statusText) { statusText.textContent = 'ว่าง'; statusText.style.fill = '#35e28c'; }
      if (tag) { tag.textContent = 'ว่าง'; tag.className = 'readout-tag'; }
      if (card) card.classList.remove('occupied');
    }
  });

  const pill = document.getElementById('availablePill');
  if (pill) {
    pill.textContent = `${available} / 2 ว่าง`;
    pill.classList.toggle('full', available === 0);
  }
  
  const banner = document.getElementById('fullBanner');
  if (banner) {
    banner.setAttribute('opacity', available === 0 ? '1' : '0');
  }
}

async function fetchStatus() {
  try {
    const res = await fetch(GAS_URL);
    if (!res.ok) throw new Error('Bad Response');
    const data = await res.json();

    updateUI(data);
    
    const dot = document.getElementById('linkDot');
    const label = document.getElementById('linkLabel');
    const lastUpdate = document.getElementById('lastUpdate');

    if (dot) dot.className = 'dot online';
    if (label) label.textContent = 'เชื่อมต่อ Cloud สำเร็จ';
    if (lastUpdate && data.timestamp) {
      lastUpdate.textContent = data.timestamp;
    }
  } catch (err) {
    const dot = document.getElementById('linkDot');
    const label = document.getElementById('linkLabel');
    if (dot) dot.className = 'dot offline';
    if (label) label.textContent = 'ขาดการเชื่อมต่อกับ Cloud';
  }
}

fetchStatus();
setInterval(fetchStatus, REFRESH_MS);