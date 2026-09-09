const out = document.getElementById('output');
const accountInput = document.getElementById('accountNumber');

function show(value) {
  out.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

async function api(path, options = {}) {
  show(`Requesting ${options.method || 'GET'} ${path} ...`);
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  show({ httpStatus: response.status, body });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return body;
}

document.getElementById('healthBtn').onclick = () => api('/api/v1/health').catch(() => {});
document.getElementById('getAccountBtn').onclick = () => api(`/api/v1/accounts/${encodeURIComponent(accountInput.value.trim())}`).catch(() => {});
document.getElementById('mutationsBtn').onclick = () => api(`/api/v1/accounts/${encodeURIComponent(accountInput.value.trim())}/mutations`).catch(() => {});

document.getElementById('createBtn').onclick = async () => {
  try {
    const body = await api('/api/v1/accounts', {
      method: 'POST',
      body: JSON.stringify({
        customerNik: document.getElementById('nik').value.trim(),
        customerName: document.getElementById('customerName').value.trim(),
        initialBalance: Number(document.getElementById('initialBalance').value)
      })
    });
    if (body?.accountNumber) accountInput.value = body.accountNumber;
  } catch {}
};

document.getElementById('transactBtn').onclick = () => api(`/api/v1/accounts/${encodeURIComponent(accountInput.value.trim())}/transact`, {
  method: 'POST',
  body: JSON.stringify({
    type: document.getElementById('txType').value,
    channel: document.getElementById('channel').value,
    amount: Number(document.getElementById('amount').value)
  })
}).catch(() => {});

document.getElementById('clearBtn').onclick = () => show('Ready.');
