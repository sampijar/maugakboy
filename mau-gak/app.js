// Mau Gak? — tanpa server: isi pertanyaan disimpan di bagian # pada link.
(() => {
  const $ = (s) => document.querySelector(s);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // ---------- encode / decode (UTF-8 aman, base64url) ----------
  const enc = (obj) => {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = '';
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const dec = (str) => {
    try {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      while (str.length % 4) str += '=';
      const bytes = Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch { return null; }
  };
  const baseUrl = () => location.origin + location.pathname;
  const normWa = (n) => {
    let d = (n || '').replace(/\D/g, '');
    if (d.startsWith('0')) d = '62' + d.slice(1);
    return d.length >= 9 ? d : '';
  };

  const show = (id) => ['maker', 'ask', 'done'].forEach((s) => ($('#' + s).hidden = s !== id));

  // ---------- MODE PEMBUAT ----------
  $('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#q').value.trim();
    const err = $('#err');
    if (!q) { err.textContent = 'Pertanyaannya diisi dulu ya.'; err.hidden = false; return; }
    err.hidden = true;
    const data = {
      to: $('#to').value.trim(),
      q,
      yes: $('#yes').value.trim(),
      from: $('#from').value.trim(),
      wa: normWa($('#wa').value),
    };
    const url = baseUrl() + '#' + enc(data);
    $('#link').value = url;
    $('#preview').href = url;
    const text = `${data.to ? data.to + ', aku' : 'Aku'} mau nanya sesuatu, jawab jujur ya 👀 ${url}`;
    $('#share-wa').href = 'https://wa.me/?text=' + encodeURIComponent(text);
    if (navigator.share) {
      $('#share').hidden = false;
      $('#share').onclick = () => navigator.share({ title: 'Mau Gak?', text, url }).catch(() => {});
    }
    $('#result').hidden = false;
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('#copy').addEventListener('click', async () => {
    const input = $('#link');
    try { await navigator.clipboard.writeText(input.value); }
    catch { input.select(); document.execCommand('copy'); }
    $('#copy').textContent = 'Tersalin ✓';
    setTimeout(() => ($('#copy').textContent = 'Salin'), 1600);
  });

  // ---------- MODE PENERIMA ----------
  const NO_LABELS = ['Gak', 'Yakin?', 'Serius??', 'Pikir lagi deh', 'Ayolah 🥺', 'Salah pencet ya?', 'Gak bisa 😜', 'Coba yang pink', 'Hehe', 'Nope'];
  const TEASES = ['Eits, kabur 🏃', 'Tombolnya malu', 'Ga kena wle 😝', 'Yang satunya aja', 'Hampir…', 'Kok tega 🥲', 'Tombol “Mau” makin gede lho'];
  let data, tries = 0, sadTimer;

  function startAsk(d) {
    data = d;
    tries = 0;
    show('ask');
    $('#askTo').textContent = d.to ? `Hai ${d.to}` : 'Hai kamu';
    $('#question').textContent = d.q;
    document.title = d.to ? `${d.to}, mau gak? 👀` : 'Mau gak? 👀';
    const no = $('#noBtn');
    no.classList.remove('flee');
    no.style.cssText = '';
    no.textContent = 'Gak';
    $('#yesBtn').style.transform = '';
    $('#tease').textContent = '';
  }

  function flee(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const no = $('#noBtn');
    const yes = $('#yesBtn').getBoundingClientRect();
    const r = no.getBoundingClientRect();

    if (!no.classList.contains('flee')) {
      no.style.left = r.left + 'px';
      no.style.top = r.top + 'px';
      no.classList.add('flee');
      void no.offsetWidth;
    }

    tries++;
    no.textContent = NO_LABELS[tries % NO_LABELS.length];
    const w = no.offsetWidth, h = no.offsetHeight, pad = 12;
    const vw = window.innerWidth, vh = window.innerHeight;
    let x, y, n = 0;
    do {
      x = pad + Math.random() * (vw - w - pad * 2);
      y = pad + Math.random() * (vh - h - pad * 2);
      n++;
    } while (n < 30 && (
      (x < yes.right + 16 && x + w > yes.left - 16 && y < yes.bottom + 16 && y + h > yes.top - 16) ||
      (Math.abs(x - r.left) < 80 && Math.abs(y - r.top) < 60)
    ));
    no.style.left = x + 'px';
    no.style.top = y + 'px';

    $('#yesBtn').style.transform = `scale(${Math.min(1 + tries * 0.12, 2.2)})`;
    $('#tease').textContent = pick(TEASES);
    const buddy = $('#buddy');
    buddy.classList.add('sad');
    $('#mouth').setAttribute('d', 'M86 100 Q100 88 114 100');
    clearTimeout(sadTimer);
    sadTimer = setTimeout(() => {
      buddy.classList.remove('sad');
      $('#mouth').setAttribute('d', 'M86 92 Q100 106 114 92');
    }, 1400);
  }

  const noBtn = $('#noBtn');
  noBtn.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') flee(e); });
  noBtn.addEventListener('pointerdown', flee);
  noBtn.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  noBtn.addEventListener('click', (e) => { e.preventDefault(); if (e.detail === 0) flee(); }); // keyboard

  $('#yesBtn').addEventListener('click', () => {
    $('#noBtn').classList.remove('flee');
    show('done');
    $('#yesMsg').textContent = data.yes || 'Aku tahu kamu pasti mau 💖';
    $('#yesFrom').textContent = data.from ? `— ${data.from}` : '';
    $('#makeOwn').href = baseUrl();
    const reply = $('#replyWa');
    if (data.wa) {
      reply.hidden = false;
      reply.textContent = data.from ? `Kabarin ${data.from} lewat WhatsApp` : 'Kabarin dia lewat WhatsApp';
      reply.href = `https://wa.me/${data.wa}?text=` + encodeURIComponent(`MAU! 💖\n(jawaban buat: “${data.q}”)`);
    } else reply.hidden = true;
    confetti();
  });

  function confetti() {
    const set = ['💖', '💕', '✨', '🎉', '🌸', '💗'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.textContent = pick(set);
      c.style.left = Math.random() * 100 + 'vw';
      c.style.fontSize = 16 + Math.random() * 22 + 'px';
      c.style.animationDuration = 2.2 + Math.random() * 2 + 's';
      c.style.animationDelay = Math.random() * 1.2 + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }

  // ---------- router ----------
  function route() {
    const d = location.hash.length > 1 ? dec(location.hash.slice(1)) : null;
    if (d && typeof d.q === 'string' && d.q) startAsk(d);
    else { show('maker'); document.title = 'Mau Gak? — bikin punyamu'; }
  }
  window.addEventListener('hashchange', route);
  route();
})();
