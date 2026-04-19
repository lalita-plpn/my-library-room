let links = JSON.parse(localStorage.getItem('lp_links') || '[]');

// Default Data
if (!links.length) {
  links = [
    {id: 1, title: 'สรุป ACS 2025', url: 'https://www.facebook.com/share/p/1AqjD', time: 10, type: 'read', cat: 'doctor', done: false},
    {id: 2, title: 'สรุป CPR 2025', url: 'https://www.facebook.com/share/p/15rNc', time: 15, type: 'read', cat: 'doctor', done: false},
    {id: 3, title: 'Review Thyroid cancer', url: 'https://www.facebook.com/share/p/1F7T6', time: 10, type: 'read', cat: 'doctor', done: false},
    {id: 4, title: 'video HT control (2-2026)', url: 'https://facebook.com', time: 20, type: 'watch', cat: 'doctor', done: false},
    {id: 5, title: 'Video approach insomnia - Thai 2025', url: 'https://facebook.com', time: 30, type: 'watch', cat: 'doctor', done: false},
    {id: 6, title: 'MDD เรียน psychi', url: 'https://facebook.com', time: 15, type: 'watch', cat: 'doctor', done: false},
    {id: 7, title: 'ESRD - HBV vaccine 2022', url: 'https://facebook.com', time: 10, type: 'read', cat: 'doctor', done: true},
    {id: 8, title: 'DCA Strategy 101', url: 'https://investopedia.com', time: 10, type: 'read', cat: 'money', done: false},
    {id: 9, title: 'ออมทองคำ ทำอย่างไร', url: 'https://facebook.com', time: 5, type: 'read', cat: 'selfdev', done: false},
  ];
  save();
}

let tab = 'doctor', filter = 'all', sortAZ = false, searchOpen = false;
const TITLES = {doctor: 'Doctor Practice', money: 'Money Game', selfdev: 'Self Development'};

function save() {
  localStorage.setItem('lp_links', JSON.stringify(links));
}

function render() {
  const q = (document.getElementById('search-input').value || '').trim().toLowerCase();
  let items = links.filter(l => l.cat === tab);
  
  if (filter === 'unread') items = items.filter(l => !l.done);
  if (filter === 'read') items = items.filter(l => l.done);
  if (q) items = items.filter(l => l.title.toLowerCase().includes(q) || (l.url || '').toLowerCase().includes(q));
  if (sortAZ) items.sort((a, b) => a.title.localeCompare(b.title, 'th'));

  const all = links.filter(l => l.cat === tab);
  document.getElementById('stat-u').textContent = all.filter(l => !l.done).length;
  document.getElementById('stat-r').textContent = all.filter(l => l.done).length;
  document.getElementById('badge-num').textContent = links.filter(l => !l.done).length + ' unread';
  document.getElementById('section-title').textContent = TITLES[tab];

  const list = document.getElementById('link-list');
  if (!items.length) {
    list.innerHTML = `<div class="empty">📭 ไม่พบลิงก์<br>${q ? 'ลองคำอื่น' : 'กด + เพื่อเพิ่ม'}</div>`;
    return;
  }

  list.innerHTML = items.map(l => {
    const pc = l.done ? 'pill-done' : (l.type === 'watch' ? 'pill-watch' : 'pill-read');
    const pl = l.done ? '✅ DONE' : (l.type === 'watch' ? '▶ WATCH' : '📖 READ');
    const cc = l.done ? 'done' : (l.type === 'watch' ? 'watched' : 'unread');
    return `<div class="link-card ${cc}">
      <div class="card-head">
        <div class="card-title-txt"><a href="${esc(l.url)}" target="_blank">${esc(l.title)}</a></div>
        <div class="card-actions">
          <button class="act-btn" onclick="openEdit(${l.id})">✏️</button>
          <button class="act-btn del" onclick="openDel(${l.id})">🗑</button>
        </div>
      </div>
      <div class="card-url">${host(l.url)}</div>
      <div class="card-foot">
        <span class="pill ${pc}" onclick="toggleDone(${l.id})">${pl}</span>
        <span class="pill pill-time">⏱ ${l.time}m</span>
      </div>
    </div>`;
  }).join('');
}

function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function host(u) { try { return new URL(u).hostname; } catch { return (u || '').slice(0, 40); } }
function toggleDone(id) { const l = links.find(x => x.id === id); if (l) { l.done = !l.done; save(); render(); } }

function switchTab(t, btn) {
  tab = t; filter = 'all';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.filter-tab')[0].classList.add('active');
  if (searchOpen) { document.getElementById('search-input').value = ''; }
  render();
}

function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function toggleSort() {
  sortAZ = !sortAZ;
  const b = document.getElementById('sort-btn');
  b.textContent = sortAZ ? 'AZ' : '↕';
  b.classList.toggle('on', sortAZ);
  render();
}

function toggleSearch() {
  searchOpen = !searchOpen;
  document.getElementById('search-wrap').classList.toggle('open', searchOpen);
  document.getElementById('search-btn').classList.toggle('on', searchOpen);
  if (searchOpen) setTimeout(() => document.getElementById('search-input').focus(), 200);
  else { document.getElementById('search-input').value = ''; render(); }
}

/* ── DELETE ── */
let pendingDel = null;
function openDel(id) { pendingDel = id; document.getElementById('del-ov').classList.add('open'); }
document.getElementById('del-yes').onclick = () => {
  links = links.filter(x => x.id !== pendingDel);
  pendingDel = null; save(); render();
  document.getElementById('del-ov').classList.remove('open');
};
document.getElementById('del-no').onclick = () => { pendingDel = null; document.getElementById('del-ov').classList.remove('open'); };

/* ── EDIT ── */
let pendingEdit = null;
function openEdit(id) {
  const l = links.find(x => x.id === id); if (!l) return;
  pendingEdit = id;
  document.getElementById('edit-title').value = l.title;
  document.getElementById('edit-url').value = l.url || '';
  document.getElementById('edit-time').value = l.time || 10;
  document.querySelector(`input[name="etp"][value="${l.type}"]`).checked = true;
  document.getElementById('edit-ov').classList.add('open');
}
function closeEdit() { pendingEdit = null; document.getElementById('edit-ov').classList.remove('open'); }
function saveEdit() {
  const title = document.getElementById('edit-title').value.trim();
  const url = document.getElementById('edit-url').value.trim();
  const time = parseInt(document.getElementById('edit-time').value) || 10;
  const type = document.querySelector('input[name="etp"]:checked').value;
  if (!title || !url) return;
  const l = links.find(x => x.id === pendingEdit);
  if (l) { Object.assign(l, {title, url, time, type}); save(); render(); }
  closeEdit();
}

/* ── ADD ── */
function addUrlRow() {
  const row = document.createElement('div'); row.className = 'url-row';
  row.innerHTML = `<input class="f-input" placeholder="https://..." /><button class="url-remove" onclick="this.parentElement.remove()">×</button>`;
  document.getElementById('url-list').appendChild(row);
}
function openModal() {
  document.getElementById('url-list').innerHTML = `<div class="url-row"><input class="f-input" placeholder="https://..." /></div>`;
  document.getElementById('add-ov').classList.add('open');
}
function closeModal() { document.getElementById('add-ov').classList.remove('open'); }
function saveLinks() {
  const urls = [...document.querySelectorAll('#url-list .url-row input')].map(i => i.value.trim()).filter(Boolean);
  if (!urls.length) return;
  const time = parseInt(document.getElementById('inp-time').value) || 10;
  const type = document.querySelector('input[name="tp"]:checked').value;
  urls.forEach(url => {
    let title = url; try { title = new URL(url).hostname; } catch {}
    links.push({id: Date.now() + Math.random(), title, url, time, type, cat: tab, done: false});
  });
  save(); render(); closeModal();
}

// Initial Render
render();
