const API = (location.hostname === 'localhost') ? 'http://localhost:3000' : '';

async function fetchList() {
  const res = await fetch(API + '/entities');
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = '';

  data.forEach(t => {
    const el = document.createElement('div');
    el.className = 'case';
    el.innerHTML = `
      <strong>Case ID: ${t.id}</strong>
      <div>Date: ${t.date ? new Date(t.date).toLocaleString() : '-'}</div>
      <div>Case Overview: ${escapeHtml(t.CaseOverview)}</div>
      <div>Evidence: ${escapeHtml(t.Evidence)}</div>
      <div>Legal Process: ${escapeHtml(t.LegalProcess)}</div>
      <div>Updates: ${escapeHtml(t.Updates)}</div>
      <div class="row">
        <button data-id="${t.id}" class="edit">Edit</button>
        <button data-id="${t.id}" class="delete">Delete</button>
      </div>
    `;
    list.appendChild(el);
  });
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'`'})[c]);
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const payload = {
    date: document.getElementById('date').value || undefined,
    CaseOverview: document.getElementById('CaseOverview').value || undefined,
    Evidence: document.getElementById('Evidence').value || undefined,
    LegalProcess: document.getElementById('LegalProcess').value || undefined,
    Updates: document.getElementById('Updates').value || undefined
  };

  try {
    if (id) {
      const r = await fetch(API + '/entities/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) return alert('Error: ' + (await r.text()));
    } else {
      const r = await fetch(API + '/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) return alert('Error: ' + (await r.text()));
    }
    resetForm();
    await fetchList();
  } catch (err) {
    alert('Network error');
  }
});

document.getElementById('resetBtn').addEventListener('click', resetForm);

function resetForm() {
  document.getElementById('id').value = '';
  document.getElementById('date').value = '';
  document.getElementById('CaseOverview').value = '';
  document.getElementById('Evidence').value = '';
  document.getElementById('LegalProcess').value = '';
  document.getElementById('Updates').value = '';
}

document.getElementById('list').addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit')) {
    const id = e.target.dataset.id;
    const r = await fetch(API + '/entities/' + id);
    if (!r.ok) { alert('Failed to fetch'); return; }
    const t = await r.json();
    document.getElementById('id').value = t.id;
    document.getElementById('date').value = t.date ? new Date(t.date).toISOString().slice(0,16) : '';
    document.getElementById('CaseOverview').value = t.CaseOverview || '';
    document.getElementById('Evidence').value = t.Evidence || '';
    document.getElementById('LegalProcess').value = t.LegalProcess || '';
    document.getElementById('Updates').value = t.Updates || '';
    window.scrollTo(0,0);
  }
  if (e.target.classList.contains('delete')) {
    if (!confirm('Видалити справу?')) return;
    const id = e.target.dataset.id;
    const r = await fetch(API + '/entities/' + id, { method: 'DELETE' });
    if (r.status === 204) { await fetchList(); }
    else { alert('Failed to delete'); }
  }
});

fetchList();
