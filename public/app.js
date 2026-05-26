(function () {
  let token = null;

  function $(id) { return document.getElementById(id); }

  function showLogin(show) {
    $("loginView").classList.toggle('hidden', !show);
    $("appView").classList.toggle('hidden', show);
  }

  async function login() {
    const username = $("username").value;
    const password = $("password").value;
    const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (!res.ok) { $("loginMsg").innerText = data.error || 'login failed'; return; }
    token = data.token;
    $("loginMsg").innerText = 'Logged in as ' + data.user.displayName;
    await loadItems();
    showLogin(false);
  }

  async function api(path, opts) {
    opts = opts || {};
    opts.headers = opts.headers || {};
    if (token) opts.headers.Authorization = 'Bearer ' + token;
    if (!opts.method) opts.method = 'GET';
    return fetch(path, opts).then(r => r.json().then(b => ({ ok: r.ok, status: r.status, body: b }))); 
  }

  function showToast(msg, time = 2500) {
    const t = document.createElement('div');
    t.className = 'card';
    t.style.position = 'fixed';
    t.style.right = '20px';
    t.style.bottom = '20px';
    t.style.minWidth = '220px';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), time);
  }

  async function loadItems() {
    const r = await api('/api/items');
    if (!r.ok) { showToast('Failed to load items'); return; }
    const list = r.body;
    const container = $("itemsList");
    container.innerHTML = '';
    if (list.length === 0) container.innerHTML = '<div class="muted">No items yet</div>';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `<div>
        <div><strong>${escapeHtml(item.title)}</strong></div>
        <div class="meta">${escapeHtml(item.content || '')}</div>
      </div>
      <div class="actions">
        <button class="btn" data-id="${item.id}" data-action="edit">Edit</button>
        <button class="btn" data-id="${item.id}" data-action="delete">Delete</button>
      </div>`;
      container.appendChild(div);
    });
    Array.from(container.querySelectorAll('button[data-action]')).forEach(b => b.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      const action = e.target.getAttribute('data-action');
      if (action === 'delete') {
        await api('/api/items/' + id, { method: 'DELETE' });
        await loadItems();
        showToast('Item deleted');
      } else if (action === 'edit') {
        const r = await api('/api/items/' + id);
        if (!r.ok) return showToast('Failed to fetch item');
        const itm = r.body;
        const newTitle = prompt('Edit title', itm.title);
        if (newTitle === null) return; // cancelled
        const newContent = prompt('Edit content', itm.content || '') || '';
        await api('/api/items/' + id, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ title: newTitle, content: newContent }) });
        await loadItems();
        showToast('Item updated');
      }
    }));
  }

  // Modal form handling for create/edit
  function openItemModal(item) {
    const modal = $("itemModal");
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (item) {
      $("modalTitle").innerText = 'Edit Item';
      $("itemId").value = item.id;
      $("modalTitleInput").value = item.title || '';
      $("modalContentInput").value = item.content || '';
    } else {
      $("modalTitle").innerText = 'New Item';
      $("itemId").value = '';
      $("modalTitleInput").value = '';
      $("modalContentInput").value = '';
    }
    $("modalTitleInput").focus();
  }

  function closeItemModal() {
    const modal = $("itemModal");
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  async function submitItemForm(e) {
    e.preventDefault();
    const id = $("itemId").value;
    const title = $("modalTitleInput").value.trim();
    const content = $("modalContentInput").value.trim();
    if (!title) return showToast('Title is required');
    if (id) {
      await api('/api/items/' + id, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ title, content }) });
      showToast('Item updated');
    } else {
      await api('/api/items', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ title, content }) });
      showToast('Item created');
    }
    closeItemModal();
    await loadItems();
  }

  async function compare() {
    const input1 = $("input1").value;
    const input2 = $("input2").value;
    const type = $("compareType").value;
    if (!input1) return showToast('Input 1 is required');
    const r = await fetch('/api/compare', { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ input1, input2, type }) });
    const d = await r.json();
    if (!r.ok) { $("compareResult").innerText = d.error || 'error'; return; }
    $("compareResult").innerHTML = `
      <div><span class="muted">Matched</span> <span class="percent">${d.percent}%</span></div>
      <div class="muted">(${d.matchCount} of ${d.total} characters)</div>
      <hr />
      <h4>Per seeded item breakdown</h4>
      <ul>${d.perItem.map(p=>`<li>${escapeHtml(p.title)}: ${p.matchedPercent}%</li>`).join('')}</ul>`;
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[s]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    $("loginBtn").addEventListener('click', login);
    $("logoutBtn").addEventListener('click', () => { token = null; showLogin(true); });
    $("createItemBtn").addEventListener('click', () => openItemModal(null));
    $("compareBtn").addEventListener('click', compare);
    $("itemForm").addEventListener('submit', submitItemForm);
    $("modalCancel").addEventListener('click', closeItemModal);
    // close modal when clicking overlay
    $("itemModal").addEventListener('click', (ev) => { if (ev.target.id === 'itemModal') closeItemModal(); });
  });
})();
