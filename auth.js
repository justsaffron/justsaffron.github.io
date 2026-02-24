/* auth.js — shared password protection for Just Saffron edit features */

const PASS_HASH = 'bismillah'; // stored as lowercase for comparison

function checkEditAuth() {
  return sessionStorage.getItem('js_auth') === '1';
}

function showGate(onSuccess) {
  // create gate overlay
  const gate = document.createElement('div');
  gate.className = 'gate-overlay';
  gate.id = 'gate-overlay';
  gate.innerHTML = `
    <div class="gate-box">
      <div class="gate-logo">Just Saffron</div>
      <div class="gate-title">Editor Access</div>
      <div class="gate-sub">Enter your password to add or edit content.</div>
      <input class="gate-input" id="gate-pw" type="password" placeholder="••••••••••" autocomplete="current-password">
      <div class="gate-error" id="gate-err">Incorrect password. Try again.</div>
      <button class="btn btn-primary" id="gate-submit" style="width:100%;justify-content:center">Unlock →</button>
      <div style="margin-top:1rem"><a href="index.html" style="font-size:0.55rem;letter-spacing:0.2em;color:var(--text-dim);text-decoration:none">← Back to site</a></div>
    </div>`;
  document.body.appendChild(gate);

  const input = document.getElementById('gate-pw');
  const errEl = document.getElementById('gate-err');
  const btn   = document.getElementById('gate-submit');

  function attempt() {
    if (input.value.toLowerCase() === PASS_HASH) {
      sessionStorage.setItem('js_auth', '1');
      gate.classList.add('hidden');
      gate.remove();
      if (onSuccess) onSuccess();
    } else {
      errEl.style.display = 'block';
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
  input.focus();
}

/* requireAuth — call on any edit page or before opening edit modals.
   If not authed, shows gate. If already authed, calls cb immediately. */
function requireAuth(cb) {
  if (checkEditAuth()) { if (cb) cb(); }
  else showGate(cb);
}

/* protectEditButtons — wraps all elements with data-auth="true" to require auth on click */
function protectEditButtons() {
  document.querySelectorAll('[data-auth]').forEach(el => {
    el.addEventListener('click', function(e) {
      if (!checkEditAuth()) {
        e.preventDefault(); e.stopImmediatePropagation();
        showGate(() => el.click());
      }
    }, true);
  });
}

document.addEventListener('DOMContentLoaded', protectEditButtons);
