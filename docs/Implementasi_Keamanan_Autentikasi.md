# Implementasi Keamanan Autentikasi RecyNect

Dokumen ini merangkum perubahan autentikasi pada frontend Next.js dan backend Express, cara menyiapkannya, serta batasan yang masih berlaku.

## Arsitektur

- Frontend berada di `frontend/` dan memakai Next.js App Router.
- Backend autentikasi berada di `backend/` sebagai Express API dengan Prisma dan MySQL.
- Browser memanggil API dengan `credentials: 'include'`. Token tidak disimpan di `localStorage` atau state JavaScript.
- API mengirim cookie `recynect_session` dengan atribut `HttpOnly`, `SameSite=Lax`, `Path=/`, serta `Secure` saat `NODE_ENV=production`.
- Token memakai HMAC-SHA-256 dan berlaku 8 jam. Claims mencakup ID akun, role, issuer, audience, masa berlaku, ID token acak, dan versi autentikasi akun.
- Layout privat Next.js memeriksa sesi lewat `GET /api/auth/me`. API tetap memeriksa hak akses untuk setiap endpoint privat.

Akun warga dan mitra berada di tabel `users`; akun internal berada di tabel `admins`. Pendaftaran publik selalu membuat role `user` dan menolak field tambahan seperti `role`.

## Alur autentikasi

### Warga

`/register` mengirim nama, email, nomor telepon, dan kata sandi ke `POST /api/auth/register`. Backend memvalidasi payload, menormalisasi email, membuat hash kata sandi, menetapkan role `user`, lalu mengirim cookie sesi. Login warga memanggil `POST /api/auth/login` dan berpindah ke `/match` setelah sukses.

### Mitra

`/recycler/login` memakai endpoint login yang sama, lalu frontend memeriksa role `recycler`. Akun dengan role lain tidak dapat membuka dashboard mitra. Pendaftaran mandiri mitra dinonaktifkan sementara karena API penyimpanan aplikasi mitra dan verifikasinya belum tersedia.

### Admin

`/admin/login` memanggil `POST /api/admin/login`, yang hanya mencari akun pada tabel `admins`. `/admin/register` mengembalikan 404. Admin dibuat lewat provisioning lokal atau seed development, bukan form publik.

### Logout dan ganti kata sandi

- Tombol keluar admin/mitra memanggil `POST /api/auth/logout` untuk menghapus cookie.
- Form perubahan kata sandi memanggil `PATCH /api/auth/password`, meminta kata sandi saat ini, menyimpan hash baru, menaikkan `auth_version`, lalu menghapus sesi browser.
- Token dengan versi lama ditolak oleh middleware. Masa berlaku maksimum token adalah 8 jam.
- Halaman pemulihan kata sandi menjelaskan bahwa reset email belum tersedia, tanpa mengaku berhasil mengubah akun.

## Endpoint dan akses

| Endpoint | Akses | Kegunaan |
|---|---|---|
| `POST /api/auth/register` | Publik, origin tepercaya, rate limit, Zod | Membuat akun warga dan sesi |
| `POST /api/auth/login` | Publik, origin tepercaya, rate limit, Zod | Login warga atau mitra |
| `GET /api/auth/me` | Cookie valid dan akun masih aktif | Membaca identitas dan role sesi |
| `POST /api/auth/logout` | Origin tepercaya | Menghapus cookie sesi |
| `PATCH /api/auth/password` | Role `user`/`recycler`, cookie valid, origin tepercaya | Mengubah kata sandi dan membatalkan token lama |
| `POST /api/admin/login` | Publik, origin tepercaya, rate limit, Zod | Login melalui tabel admin |
| `GET /api/admin/recyclers/pending` | Admin terautentikasi | Mengambil antrean verifikasi |
| `POST /api/admin/recyclers/:id/verify` | Admin terautentikasi, origin tepercaya, status tervalidasi | Menyetujui atau menolak pengelola |

`authMiddleware` memeriksa signature dan masa berlaku token. `roleMiddleware` memeriksa role, keberadaan akun, dan `auth_version` di database. Endpoint perubahan status pengelola tidak dapat dipanggil tanpa sesi admin.

## Kontrol keamanan

- Password di-hash dengan scrypt (`N=32768`, `r=8`, `p=1`), salt acak 16 byte, dan hasil 64 byte. Hash tidak pernah dikirim ke klien.
- Zod menolak field tak dikenal. Password baru harus 12 sampai 128 karakter. Role tidak dapat dipilih saat daftar.
- Login untuk email yang tidak ditemukan juga menjalankan verifikasi hash dummy dan memakai pesan kegagalan yang sama.
- Rate limiter membatasi lima request per IP dan route selama 15 menit. Penyimpanan limiter masih di memori proses.
- CORS hanya mengizinkan origin dari `FRONTEND_ORIGINS`. Request yang mengubah data harus menyertakan origin tepercaya dan tidak boleh bertanda `Sec-Fetch-Site: cross-site`.
- Body JSON dibatasi 10 KB. API menonaktifkan `X-Powered-By`, menambahkan header keamanan dasar, dan tidak membocorkan pesan internal server/database.
- Prisma tidak lagi mencatat semua query saat development agar parameter query tidak masuk ke log.

## Konfigurasi environment

Salin [backend/.env.example](../backend/.env.example) ke `backend/.env`, lalu isi:

- `DATABASE_URL`: URL koneksi database.
- `JWT_SECRET`: secret acak minimal 32 karakter; gunakan nilai berbeda untuk tiap environment.
- `FRONTEND_ORIGINS`: origin frontend lengkap. Production wajib memakai HTTPS.
- `NODE_ENV=production` saat deployment agar cookie `Secure` aktif.
- `COOKIE_DOMAIN` hanya bila frontend dan API berada pada subdomain dari site yang sama, misalnya `.example.com`.

Salin [frontend/.env.example](../frontend/.env.example) ke `frontend/.env`. `NEXT_PUBLIC_API_URL` dipakai browser; `API_URL` dipakai server Next.js untuk pemeriksaan sesi. Frontend dan API harus berbagi host cookie atau memakai `COOKIE_DOMAIN` pada subdomain satu site.

File [backend/.env](../backend/.env) dikeluarkan dari tracking Git, file lokal tetap ada, dan pola environment ditambahkan ke `.gitignore`. Karena file itu pernah tercatat di Git, rotasi kredensial yang pernah ada di dalamnya dan penanganan riwayat repo tetap diperlukan sebelum repo dibagikan.

## Database dan provisioning admin

Model `User` dan `Admin` kini memiliki kolom `auth_version` dengan nilai awal `0`. Perubahannya ada di [schema.prisma](../backend/prisma/schema.prisma), [schema.sql](../backend/prisma/schema.sql), dan [migration.sql](../backend/prisma/migrations/202611100001_auth_version/migration.sql).

Database belum diubah oleh tugas ini. Dari folder `backend/`, jalankan `npx prisma db push` pada database yang benar, lalu `npx prisma generate` sebelum menyalakan API.

Untuk membuat admin tanpa route publik:

1. Isi `ADMIN_NAME`, `ADMIN_EMAIL`, dan `ADMIN_PASSWORD` pada environment lokal yang tidak dikomit. Password harus 12 sampai 128 karakter.
2. Jalankan `npm run admin:create` dari folder `backend/`.
3. Perintah membuat akun di tabel `admins`, menyimpan hash scrypt, dan hanya mencetak email akun.

Seed demo di [seed.ts](../backend/prisma/seed.ts) menghapus data sebelum mengisi ulang. Seed hanya berjalan dengan `NODE_ENV=development`, `DATABASE_URL` lokal, `RESET_DATABASE=true`, serta kata sandi seed yang terisi. Jangan gunakan seed pada database production.

## File yang berubah

### Backend

- [backend/.env.example](../backend/.env.example), [backend/package.json](../backend/package.json), dan [backend/src/app.ts](../backend/src/app.ts).
- Konfigurasi: [env.ts](../backend/src/config/env.ts) dan [database.ts](../backend/src/config/database.ts).
- Middleware: `backend/src/middlewares/auth.middleware.ts`, `error.middleware.ts`, `role.middleware.ts`, `validate.middleware.ts`, serta middleware baru `origin.middleware.ts` dan `rate-limit.middleware.ts`.
- Modul auth: `backend/src/modules/auth/auth.controller.ts`, `auth.repository.ts`, `auth.routes.ts`, `auth.service.ts`, serta file baru `auth.schemas.ts` dan `auth.types.ts`.
- Modul admin: `backend/src/modules/admin/admin.controller.ts`, `admin.repository.ts`, `admin.routes.ts`, dan `admin.service.ts`.
- File baru: `backend/src/security/password.ts`, `backend/src/security/session.ts`, `backend/src/types/express.d.ts`, dan `backend/src/utils/http-error.ts`.
- Database dan provisioning: `backend/prisma/schema.prisma`, `schema.sql`, `seed.ts`, file baru `create-admin.ts`, dan migration `backend/prisma/migrations/202611100001_auth_version/migration.sql`.
- Prisma Client di `backend/node_modules/.prisma/client/` digenerasi ulang agar tipenya memuat `auth_version`.
- Root `.gitignore` ditambahkan dan `backend/.env` dikeluarkan dari Git tracking; salinan lokal tetap ada.

### Frontend

- [frontend/.env.example](../frontend/.env.example), [api-client.ts](../frontend/lib/api-client.ts), dan file baru [server-auth.ts](../frontend/lib/server-auth.ts).
- Halaman auth: `frontend/app/(auth)/login/page.tsx`, `register/page.tsx`, `admin/login/page.tsx`, `admin/register/page.tsx`, `admin/forgot-password/page.tsx`, `recycler/login/page.tsx`, `recycler/register/page.tsx`, `recycler/forgot-password/page.tsx`, dan `forgot-password/page.tsx`.
- Proteksi dan shell dashboard: `frontend/app/(dashboard)/admin/layout.tsx`, file baru `admin-dashboard-shell.tsx`, `frontend/app/(dashboard)/recycler/layout.tsx`, dan file baru `recycler-dashboard-shell.tsx`.
- Profil: `frontend/app/(public)/profile/layout.tsx` ditambahkan dan `profile/page.tsx` mengubah kata sandi lewat API.
- Sidebar: `frontend/components/admin/AdminSidebar.tsx` dan `frontend/components/recycler/RecyclerSidebar.tsx` sekarang memanggil endpoint logout.
- Komponen baru `frontend/components/auth/RecoveryUnavailable.tsx` menjelaskan bahwa reset email belum tersedia.

Perubahan pada `frontend/package-lock.json` sudah ada sebelum pekerjaan ini dan dibiarkan seperti semula.

## Pemeriksaan dan batasan

Build backend, build Next.js, dan typecheck untuk script seed/provisioning admin berhasil. Tes otomatis dan click-through browser tidak dijalankan.

Reset kata sandi melalui email, verifikasi email, dan MFA admin belum tersedia. Rate limiter perlu dipindahkan ke penyimpanan bersama seperti Redis bila API dijalankan di lebih dari satu instance. Logout menghapus cookie browser; token yang sudah dicuri masih berlaku sampai kedaluwarsa, kecuali versi akunnya dibatalkan melalui perubahan kata sandi.
