# KULIKIN v1.1 — Studio Musik Interaktif

KULIKIN merupakan nama baru CHORD ATLAS, dengan tampilan lebih tenang, rapi, profesional, dan menyenangkan. Paket ini berbasis CHORD ATLAS v12 (fitur lama dipertahankan), ditambah **transpose langsung pada piano roll**.

## Pembaruan

- Nama aplikasi, identitas sidebar, judul browser, favicon, dan footer: **KULIKIN**.
- Gaya tampilan dirapikan tanpa mengubah alur fitur.
- **Transpose Piano Roll −12 s.d. +12 semitone:** tombol `−`, `+`, dan `Nada asli` tersedia di atas piano roll jatuh.
- Balok nada, tuts aktif, editor nada, suara playback, serta **MIDI yang diekspor** ikut bergeser sesuai transpose.
- Transpose piano roll terpisah dari **Transpose Suara** di Piano Studio agar tidak dihitung dua kali. Nada asli MIDI/hasil transkripsi tidak ditimpa; tombol Nada asli mengembalikan tampilannya.
- Posisi transpose disimpan di browser. Bila nada bergeser melewati batas tampilan piano 88 tuts A0–C8, informasi peringatan tampil; data MIDI tidak hilang.

## Fitur lama tetap ada

Piano 88 tuts, Panduan Musik, Circle of Fifths, Jalur Chord, Belajar Notasi, Transkripsi Lagu, Stem Splitter, Studio Piano AI, impor MIDI, piano roll Synthesia, dan unduh stem. Mesin AI Windows dari v12 tetap digunakan tanpa instal ulang.

## Update GitHub Pages

1. Ekstrak ZIP KULIKIN Full GitHub dan unggah berkas ke **root** repositori GitHub Pages.
2. Untuk update dari v12, cukup timpa `index.html`, `app.js`, `styles.css`, dan `favicon.svg` dari ZIP Perbaikan Saja.
3. Jangan hapus `audio-bank.js`, karena itu bank suara piano. Pastikan file tersebut tersedia di repository.
4. Setelah publikasi berhasil, tekan **Ctrl+F5** di browser agar JavaScript dan CSS lama tidak tersimpan di cache.
5. Untuk mencoba transpose: **Transkripsi Lagu → Piano Roll Jatuh → Contoh/Impor MIDI → + atau − → Putar → ↓ MIDI**.

## Catatan teknis

Website statis dapat di-host di GitHub Pages. Pemisahan audio dan transkripsi AI sungguhan dari rekaman tetap memerlukan mesin pemrosesan lokal atau server. Pembaruan desain dan transpose tidak mengubah akurasi model transkripsi audio yang sudah ada.
