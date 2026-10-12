# Mau Gak? 💖

Website kecil untuk mengirim pertanyaan yang jawabannya cuma bisa “Mau”. Setiap kali tombol **Gak** mau dipencet, tombolnya kabur ke tempat lain, ganti tulisan, dan tombol **Mau** makin besar.

- Tanpa akun, tanpa server — pertanyaan dan pesan disimpan di bagian `#` pada link.
- Setelah dijawab “Mau”, muncul pesanmu + hujan hati.
- Opsional: isi nomor WhatsApp-mu supaya dia bisa langsung balas jawabannya.
- Mobile-first, HTML/CSS/JS murni (tanpa build step).

## Cara pakai

1. Buka website-nya → isi **Untuk**, **Pertanyaan**, **Pesan setelah “Mau”**, **Dari**, dan (opsional) **No. WhatsApp**.
2. Klik **Buat link** → salin / kirim lewat WhatsApp.
3. Penerima buka link → coba pencet “Gak” (gagal 😜) → pencet “Mau”.

## Deploy

**Vercel**: import repo ini di vercel.com → Framework: *Other* → Deploy.

**GitHub Pages**: Settings → Pages → Source: *Deploy from a branch* → `main` / root.

**Lokal**: buka `index.html` di browser, atau `npx serve .`

## Struktur

```
index.html   # markup + karakter hati (SVG)
style.css    # tampilan & animasi
app.js       # logika: buat link, tombol kabur, layar "Mau"
```
