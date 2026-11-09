# DOKUMENTASI PROYEK RECYNECT

## Platform Pencocokan Multi-Material dengan Pengelola Sampah Daur Ulang

**Nama proyek:** RecyNect\
**Jenis produk:** Website / Web Application\
**Fokus:** Pencocokan sampah daur ulang rumah tangga dengan bank sampah,
pengepul, TPS3R, dan industri daur ulang\
**Status dokumen:** Konsep produk dan rancangan MVP\
**Target pengembangan MVP:** 7 hari

------------------------------------------------------------------------

## 1. Ringkasan Eksekutif

RecyNect adalah platform berbasis web yang membantu masyarakat
menemukan pengelola yang sesuai untuk menjual atau menyetorkan beberapa
jenis sampah daur ulang sekaligus.

Masalah yang ingin diselesaikan bukan sekadar kurangnya tempat membuang
sampah, melainkan informasi penerimaan sampah yang tersebar dan
berbeda-beda. Setiap pengelola dapat memiliki jenis material yang
diterima, harga beli, minimum kuantitas, persyaratan kualitas, lokasi,
dan jam operasional yang berbeda. Masyarakat sering kali harus mencari
informasi tersebut secara terpisah dan belum tentu mengetahui tempat
yang paling sesuai.

RecyNect memungkinkan pengguna memasukkan beberapa jenis sampah beserta
jumlahnya, kemudian sistem menyaring dan membandingkan pengelola
berdasarkan kecocokan material, minimum setoran, harga indikatif,
lokasi, dan jumlah titik yang perlu dikunjungi.

RecyNect **bukan** bank sampah, pengepul, perusahaan pengangkut, atau
fasilitas daur ulang. RecyNect adalah platform informasi dan pencocokan
yang menghubungkan masyarakat dengan pihak-pihak tersebut.

Untuk MVP, sistem menggunakan data pengelola demonstrasi yang diberi
label dengan jelas. Tidak ada klaim kemitraan, transaksi uang, atau
pembayaran nyata sebelum kerja sama dan mekanisme operasional
benar-benar tersedia.

## 2. Latar Belakang Masalah

Sampah rumah tangga yang masih memiliki nilai ekonomi, seperti botol
plastik PET, kardus, kertas, logam, dan minyak jelantah, sering kali
belum dimanfaatkan secara optimal.

Beberapa kendala yang berpotensi dialami masyarakat:

1.  Tidak mengetahui pengelola mana yang menerima jenis sampah tertentu.
2.  Informasi harga beli berbeda antara satu pengelola dan pengelola
    lain.
3.  Setiap pengelola dapat menetapkan minimum kuantitas.
4.  Sampah harus memenuhi kondisi atau kualitas tertentu.
5.  Informasi lokasi, jam layanan, dan metode setoran tidak selalu
    tersedia dalam satu tempat.
6.  Jika memiliki beberapa jenis sampah, masyarakat mungkin harus
    mencari beberapa pengelola secara manual.
7.  Pengguna sulit membandingkan apakah lebih baik memilih nilai jual
    lebih tinggi, lokasi lebih dekat, atau jumlah titik kunjungan lebih
    sedikit.

RecyNect berupaya menyatukan informasi tersebut dalam satu alur
pencarian dan pencocokan.

### 2.1 Rumusan Masalah

Bagaimana membantu masyarakat mencocokkan beberapa jenis sampah daur
ulang yang dimiliki dengan pengelola yang sesuai berdasarkan material
yang diterima, jumlah minimum, harga, kualitas, lokasi, dan efisiensi
kunjungan?

### 2.2 Pengguna yang Mengalami Masalah

**Pengguna utama --- Masyarakat/rumah tangga**

Orang yang memiliki sampah daur ulang dan ingin mengetahui tempat
penyetoran atau penjualan yang sesuai.

**Pengguna sekunder --- Pengelola sampah**

Bank sampah, pengepul, TPS3R, dan industri daur ulang yang ingin
mempublikasikan informasi material yang diterima dan ketentuan
pembeliannya.

**Pengelola platform --- Admin RecyNect**

Pihak yang mengelola kategori material, memeriksa kelengkapan data
pengelola, dan mengawasi kualitas informasi platform.

## 3. Tujuan Produk

1.  Memudahkan masyarakat menemukan pengelola yang menerima sampah
    miliknya.
2.  Menyediakan informasi jenis material, harga indikatif, minimum
    kuantitas, dan persyaratan kualitas.
3.  Memungkinkan input beberapa jenis sampah dalam satu sesi.
4.  Membandingkan beberapa alternatif pengelola berdasarkan prioritas
    pengguna.
5.  Mengurangi pencarian manual dan kunjungan yang tidak perlu.
6.  Membantu pengelola memperbarui informasi penerimaan sampah secara
    mandiri.
7.  Mendorong pemanfaatan sampah daur ulang melalui akses informasi yang
    lebih baik.

## 4. Ruang Lingkup dan Batasan

### 4.1 Ruang Lingkup MVP

-   Registrasi dan login pengguna.
-   Peran pengguna: masyarakat, pengelola, dan admin.
-   Profil pengelola dan lokasi.
-   Pengelolaan kategori material.
-   Pengaturan material yang diterima oleh pengelola.
-   Pengaturan harga indikatif dan satuan.
-   Pengaturan minimum kuantitas.
-   Pengaturan persyaratan kualitas/kondisi material.
-   Input beberapa jenis sampah oleh masyarakat.
-   Pencocokan berdasarkan kelayakan material dan minimum kuantitas.
-   Perhitungan estimasi nilai ekonomi.
-   Estimasi jarak berbasis koordinat.
-   Pemeringkatan alternatif berdasarkan prioritas.
-   Tampilan detail pengelola dan ringkasan rencana setoran.
-   Data demonstrasi yang diberi label DEMO.

### 4.2 Di Luar Ruang Lingkup MVP

-   Pembayaran digital atau pencairan saldo.
-   Penjemputan sampah oleh armada RecyNect.
-   Jaminan bahwa pengelola membeli sampah dengan harga yang
    ditampilkan.
-   Integrasi langsung dengan sistem internal bank sampah atau industri.
-   Verifikasi otomatis kualitas sampah melalui AI.
-   Klasifikasi gambar menggunakan AI.
-   Chat real-time.
-   Sistem rating dan ulasan.
-   Optimasi rute jalan raya yang akurat.
-   QR transaksi atau QR pembayaran yang dianggap sebagai bukti
    transaksi nyata.

Fitur-fitur tersebut dapat dipertimbangkan setelah validasi dan kerja
sama mitra tersedia.

## 5. Jenis Pengelola yang Dapat Bergabung

RecyNect tidak membatasi pengelola hanya pada bank sampah. Beberapa
jenis pihak yang berpotensi bergabung adalah:

### 5.1 Bank Sampah

Unit atau kelompok pengelolaan berbasis masyarakat yang menerima,
memilah, menimbang, dan mencatat sampah dari nasabah. Bank sampah dapat
memiliki daftar material, harga, dan mekanisme setoran sendiri.

**Peran dalam RecyNect:** mitra utama untuk menerima sampah dari rumah
tangga.

### 5.2 Pengepul

Pelaku usaha yang membeli dan mengumpulkan material bekas dari
masyarakat atau sumber lain, kemudian menjualnya kembali dalam jumlah
lebih besar kepada pengepul lanjutan atau industri.

**Peran dalam RecyNect:** alternatif penerima material yang mungkin
memiliki jenis, volume, dan harga pembelian berbeda.

### 5.3 TPS3R atau Unit Pengelolaan Sampah

Fasilitas berbasis masyarakat yang melakukan kegiatan pengumpulan,
pemilahan, penggunaan kembali, dan/atau daur ulang sesuai kapasitas
operasionalnya.

**Peran dalam RecyNect:** titik pengelolaan yang dapat menerima jenis
material tertentu. Tidak semua TPS3R otomatis membeli sampah; status
penerimaan dan ketentuannya harus dikonfirmasi.

### 5.4 Industri Daur Ulang

Perusahaan atau fasilitas yang memanfaatkan material bekas sebagai bahan
baku proses daur ulang. Persyaratan kualitas dan kuantitasnya dapat
lebih spesifik.

**Peran dalam RecyNect:** mitra lanjutan untuk material dan volume yang
sesuai dengan kebutuhan industri.

### 5.5 Prinsip Penting

Bank sampah adalah salah satu jenis pengelola, bukan satu-satunya. Semua
jenis pengelola menggunakan dashboard pengelola yang sama, tetapi
memiliki atribut jenis pengelola (`management_type`).

RecyNect tidak menganggap seluruh pihak di atas pasti menerima semua
jenis material atau pasti membeli sampah. Informasi penerimaan harus
dimasukkan dan dikonfirmasi oleh masing-masing pengelola.

## 6. Target Pengguna dan Kebutuhannya

### 6.1 Masyarakat

Kebutuhan: - Mengetahui pengelola yang menerima material tertentu. -
Mengetahui minimum kuantitas. - Membandingkan harga indikatif. -
Mengetahui lokasi pengelola. - Memasukkan beberapa jenis sampah
sekaligus. - Memilih alternatif berdasarkan nilai, jarak, atau jumlah
titik.

### 6.2 Pengelola

Kebutuhan: - Memiliki profil dan informasi lokasi. - Mencantumkan jenis
material yang diterima. - Mengatur harga dan satuan. - Menentukan
minimum kuantitas. - Menjelaskan standar kualitas. - Mengubah status
penerimaan material. - Memperbarui informasi harga dan tanggal
pembaruan.

### 6.3 Admin

Kebutuhan: - Memeriksa pendaftaran pengelola. - Memastikan informasi
dasar lengkap. - Mengelola kategori material dan satuan. - Menonaktifkan
data yang tidak valid atau sudah tidak aktif. - Memantau tanggal
pembaruan harga. - Membedakan data demonstrasi dan data mitra
terverifikasi.

## 7. Proposisi Nilai dan Pembeda Produk

Fitur seperti direktori bank sampah, daftar harga, pencatatan setoran,
dan pencarian lokasi telah muncul pada berbagai platform pengelolaan
sampah. Karena itu, RecyNect tidak mengklaim sebagai platform pertama
yang menyediakan fitur-fitur tersebut.

Fokus pembeda RecyNect adalah **alur pencocokan beberapa jenis sampah
terhadap beberapa pengelola, kemudian membandingkan alternatif
berdasarkan kelayakan, estimasi nilai ekonomi, jarak, dan jumlah titik
kunjungan.**

Contoh: pengguna memiliki PET, kardus, dan minyak jelantah. Sistem tidak
hanya menampilkan daftar pengelola, tetapi menyusun alternatif
penempatan material ke satu atau beberapa pengelola yang memenuhi
ketentuan.

Klaim kebaruan harus disampaikan secara hati-hati. Jika suatu fitur
tidak ditemukan dalam dokumentasi publik pesaing yang ditinjau, hal
tersebut berarti belum ditemukan bukti publik, bukan bukti pasti bahwa
pesaing tidak memilikinya.

### 7.1 Matriks Perbandingan Fitur

Keterangan: - **Ada:** terlihat pada informasi atau dokumentasi publik
yang ditinjau. - **Sebagian/tidak pasti:** terdapat fungsi yang
berdekatan, tetapi detail implementasi belum dapat dipastikan. - **Belum
ditemukan:** tidak ditemukan bukti publik yang cukup dalam peninjauan;
bukan berarti dipastikan tidak tersedia. - **Direncanakan:** fitur yang
akan dibangun di RecyNect.

  --------------------------------------------------------------------------------------------------------------
  Fitur                 Reresik          mySmash/BankSampah.id   Bank Sampah     BinBuddy         RecyNect
                                                                 Digital                          
  --------------------- ---------------- ----------------------- --------------- ---------------- --------------
  Direktori/pencarian   Ada              Ada                     Sebagian        Ada              Direncanakan
  pengelola                                                                                       

  Informasi kategori    Ada              Ada                     Ada             Ada              Direncanakan
  material                                                                                        

  Informasi harga       Ada/bervariasi   Ada/bervariasi          Ada             Sebagian         Direncanakan
  material                                                                                        

  Pencatatan            Ada              Ada                     Ada             Ada              Di luar MVP
  setoran/saldo                                                                                   

  Pencarian lokasi      Ada              Ada                     Sebagian        Ada              Direncanakan

  Pengelolaan data      Ada              Ada                     Ada             Ada              Direncanakan
  pengelola                                                                                       

  Input beberapa        Sebagian/tidak   Sebagian/tidak pasti    Ada pada proses Sebagian/tidak   Direncanakan
  material              pasti                                    setoran         pasti            

  Minimum kuantitas per Belum            Belum terkonfirmasi     Belum           Belum            Direncanakan
  material              terkonfirmasi                            terkonfirmasi   terkonfirmasi    

  Perbandingan harga    Belum            Belum terkonfirmasi     Belum ditemukan Belum ditemukan  Direncanakan
  antar-pengelola       terkonfirmasi                                                             

  Pencocokan            Belum ditemukan  Belum ditemukan secara  Belum ditemukan Belum ditemukan  Direncanakan
  berdasarkan material  secara jelas     jelas                   secara jelas    secara jelas     
  dan kelayakan                                                                                   

  Penyusunan kombinasi  Belum ditemukan  Belum ditemukan         Belum ditemukan Belum ditemukan  Direncanakan
  beberapa pengelola                                                                              

  Pemeringkatan         Belum ditemukan  Belum ditemukan         Belum ditemukan Belum ditemukan  Direncanakan
  berdasarkan nilai,                                                                              
  jarak, dan jumlah                                                                               
  titik                                                                                           
  --------------------------------------------------------------------------------------------------------------

### 7.2 Penilaian Tingkat Diferensiasi

  Fitur/kemampuan                                      Tingkat diferensiasi awal
  ---------------------------------------------------- ---------------------------
  Katalog kategori sampah                              Rendah
  Direktori pengelola                                  Rendah
  Peta lokasi pengelola                                Rendah
  Informasi harga sampah                               Rendah
  Kalkulator nilai sampah sederhana                    Rendah
  Filter minimum kuantitas                             Menengah
  Perbandingan harga antar-pengelola                   Menengah
  Input beberapa material sekaligus                    Rendah
  Pencocokan material, kuantitas, dan kualitas         Menengah
  Pencocokan beberapa material ke beberapa pengelola   Menengah
  Pemeringkatan nilai, jarak, dan jumlah titik         Menengah
  Prioritas pilihan pengguna                           Menengah

Penilaian ini merupakan penilaian awal berdasarkan dokumentasi publik
yang ditinjau, bukan audit menyeluruh seluruh aplikasi pesaing.
Diferensiasi akan lebih kuat jika alur pencocokan benar-benar berjalan
dan diuji, bukan hanya ditampilkan sebagai daftar atau filter.

## 8. Alur Kerja Utama RecyNect

### 8.1 Alur Masyarakat

1.  Pengguna membuka website RecyNect.
2.  Pengguna memasukkan lokasi atau mengizinkan penggunaan lokasi.
3.  Pengguna menambahkan satu atau beberapa kategori sampah.
4.  Pengguna mengisi jumlah dan satuan yang sesuai.
5.  Pengguna memilih kondisi material jika diperlukan.
6.  Pengguna memilih prioritas pencarian:
    -   Balanced (default).
    -   Highest Value.
    -   Nearest Location.
    -   Fewest Stops.
7.  Sistem memeriksa pengelola yang aktif dan material yang diterima.
8.  Sistem memeriksa minimum kuantitas dan persyaratan kualitas.
9.  Sistem membentuk alternatif kombinasi pengelola.
10. Sistem menghitung estimasi nilai, jarak, jumlah titik, dan skor.
11. Sistem menampilkan alternatif yang diurutkan sesuai prioritas.
12. Pengguna membuka detail pengelola dan melihat rencana setoran.
13. Pengguna menghubungi atau mengonfirmasi langsung kepada pengelola
    sebelum berangkat.

### 8.2 Alur Pengelola

1.  Pengelola mendaftar akun.
2.  Pengelola memilih jenis pengelola: bank sampah, pengepul, TPS3R,
    atau industri daur ulang.
3.  Pengelola mengisi nama, alamat, kontak, dan koordinat lokasi.
4.  Pengelola menambahkan material yang diterima.
5.  Pengelola mengisi harga, satuan, minimum kuantitas, dan persyaratan
    kualitas.
6.  Pengelola menentukan status penerimaan material.
7.  Admin memeriksa kelengkapan dan kewajaran data.
8.  Setelah disetujui, profil dapat ditampilkan sebagai pengelola
    terverifikasi.
9.  Pengelola memperbarui harga dan ketersediaan secara berkala.

### 8.3 Alur Admin

1.  Admin masuk ke dashboard.
2.  Admin melihat pendaftaran pengelola baru.
3.  Admin memeriksa profil, lokasi, kontak, dan data material.
4.  Admin menyetujui, meminta perbaikan, atau menolak data.
5.  Admin dapat menonaktifkan profil yang tidak lagi valid.
6.  Admin memantau harga yang sudah lama tidak diperbarui.
7.  Admin mengelola kategori material dan satuannya.

## 9. Logika Pencocokan (Matching Engine)

### 9.1 Data Masukan Pengguna

Setiap sesi pencocokan memiliki: - Lokasi pengguna. - Satu atau beberapa
kategori sampah. - Kuantitas tiap kategori. - Satuan tiap kategori. -
Kondisi/kualitas material jika relevan. - Prioritas pencarian. - Radius
pencarian.

Untuk MVP, batasi input maksimal lima kategori material agar pengujian
dan perhitungan tetap sederhana.

### 9.2 Data Pengelola

Setiap pengelola memiliki: - Nama dan jenis pengelola. - Alamat dan
koordinat. - Status aktif/nonaktif. - Daftar material yang diterima. -
Harga per satuan. - Minimum kuantitas. - Persyaratan kualitas. - Status
penerimaan material. - Tanggal pembaruan harga.

### 9.3 Penyaringan Kelayakan

Satu pasangan material-pengelola hanya dinyatakan layak jika: 1.
Pengelola berstatus aktif dan datanya boleh ditampilkan. 2. Pengelola
menerima kategori material tersebut. 3. Kuantitas pengguna memenuhi
minimum setoran. 4. Kondisi material memenuhi persyaratan yang
dinyatakan pengelola. 5. Harga dan satuannya valid.

Jika tidak ada pengelola yang memenuhi syarat, material ditandai **belum
memiliki kecocokan**. Sistem tidak boleh mengarang pengelola atau
memaksa material masuk ke alternatif yang tidak layak.

### 9.4 Perhitungan Nilai Ekonomi

Rumus dasar:

`Estimasi Nilai = Kuantitas × Harga per Satuan`

Contoh: - PET: 2 kg × Rp3.000/kg = Rp6.000. - Kardus: 3 kg × Rp2.000/kg
= Rp6.000. - Jelantah: 2 liter × Rp5.000/liter = Rp10.000.

Nilai tersebut adalah estimasi berdasarkan data yang dimasukkan
pengelola. Nilai final dapat berubah setelah penimbangan, pemeriksaan
kualitas, dan konfirmasi langsung.

Jangan mencampur satuan yang berbeda. Kilogram, liter, dan satuan buah
harus dibandingkan dengan harga per satuan yang sama.

### 9.5 Pembentukan Alternatif

Sistem mencoba menyusun penempatan setiap material ke satu atau beberapa
pengelola yang memenuhi syarat. Material yang ditangani pengelola sama
dikelompokkan menjadi satu titik kunjungan.

Alternatif dapat berupa: - Satu pengelola menerima semua material. - Dua
pengelola berbagi penerimaan material. - Lebih dari dua pengelola jika
memang diperlukan dan masih dalam batas pencarian.

Untuk MVP, batasi jumlah pengelola demonstrasi sekitar 10--20 dan
kategori material maksimal lima. Sistem dapat menggunakan enumerasi
kombinasi sederhana dengan pembatasan jumlah alternatif.

Setiap alternatif harus menampilkan: - Material yang dialokasikan ke
tiap pengelola. - Estimasi nilai per material. - Total estimasi nilai. -
Jumlah pengelola/titik kunjungan. - Estimasi jarak. - Material yang
belum memiliki kecocokan.

### 9.6 Perhitungan Jarak

Untuk MVP, jarak dapat dihitung menggunakan koordinat latitude dan
longitude dengan rumus Haversine. Hasilnya adalah estimasi jarak garis
lurus, bukan jarak perjalanan kendaraan.

Jika beberapa titik dikunjungi, sistem dapat menjumlahkan estimasi jarak
antar-titik berdasarkan urutan sederhana. Label harus menyatakan bahwa
jarak tersebut estimasi. Jangan menyebutnya jarak jalan atau waktu
tempuh aktual tanpa layanan routing.

Peta dapat ditampilkan menggunakan Leaflet dan OpenStreetMap.

### 9.7 Skor Prioritas

Setiap komponen dinormalisasi ke rentang 0--100.

-   `E` = skor nilai ekonomi.
-   `D` = skor kedekatan.
-   `S` = skor efisiensi jumlah titik.

Contoh normalisasi awal: -
`E = 100 × nilai alternatif / nilai maksimum alternatif` -
`D = 100 × max(0, 1 - jarak / radius referensi)` -
`S = 100 / jumlah titik pengelola`

Jika tidak ada alternatif atau jumlah titik nol, sistem harus menangani
kasus khusus agar tidak terjadi pembagian dengan nol.

**Balanced (default):**

`Score = 0.50E + 0.30D + 0.20S`

Bobot prioritas lain: - Highest Value: 70% nilai, 20% jarak, 10% jumlah
titik. - Nearest Location: 20% nilai, 60% jarak, 20% jumlah titik. -
Fewest Stops: 20% nilai, 20% jarak, 60% jumlah titik.

Skor adalah alat bantu pemeringkatan, bukan jaminan bahwa alternatif
dengan skor tertinggi selalu paling baik untuk semua orang. Tampilkan
juga komponen nilai, jarak, dan jumlah titik agar pengguna dapat
memahami alasan rekomendasi.

### 9.8 Contoh Simulasi

Pengguna memiliki: - PET 2 kg. - Kardus 3 kg. - Jelantah 2 liter.

Data simulasi pengelola:

  Pengelola                    PET           Kardus         Jelantah
  --------------- ---------------- ---------------- ----------------
  Bank Sampah A         Rp3.000/kg       Rp2.000/kg   Tidak menerima
  Pengepul B            Rp4.000/kg   Tidak menerima    Rp5.000/liter
  Bank Sampah C     Tidak menerima       Rp2.500/kg    Rp4.500/liter

Dengan asumsi minimum kuantitas dan kualitas terpenuhi: - Alternatif A +
C: PET ke A, kardus dan jelantah ke C. Total = Rp6.000 + Rp7.500 +
Rp9.000 = **Rp22.500**, dua titik. - Alternatif B + C: PET dan jelantah
ke B, kardus ke C. Total = Rp8.000 + Rp10.000 + Rp7.500 = **Rp25.500**,
dua titik.

Angka tersebut hanya contoh simulasi. Dalam aplikasi, kombinasi hanya
boleh dibuat jika seluruh minimum kuantitas dan persyaratan material
terpenuhi.

## 10. Rancangan Modul Website

### 10.1 Modul Masyarakat

-   Beranda.
-   Daftar kategori sampah.
-   Form input beberapa material.
-   Input lokasi.
-   Pilihan prioritas.
-   Halaman hasil pencocokan.
-   Perbandingan alternatif.
-   Peta pengelola.
-   Detail pengelola.
-   Ringkasan rencana setoran.
-   Riwayat pencarian (opsional jika waktu cukup).

### 10.2 Modul Pengelola

-   Dashboard ringkas.
-   Profil dan lokasi.
-   Daftar material yang diterima.
-   Form harga dan minimum kuantitas.
-   Persyaratan kualitas.
-   Status penerimaan.
-   Riwayat pembaruan data.

### 10.3 Modul Admin

-   Dashboard admin.
-   Daftar pendaftaran pengelola.
-   Verifikasi pengelola.
-   Manajemen kategori material.
-   Pemantauan data harga.
-   Status data demonstrasi/terverifikasi.
-   Aktivasi dan penonaktifan pengelola.

## 11. Rancangan Struktur Database

Berikut rancangan tabel inti untuk MVP.

### 11.1 `users`

Menyimpan akun masyarakat, pengelola, dan admin.

Kolom: - `id` - `name` - `email` - `password` - `role` (`user`,
`recycler`, `admin`) - `created_at` - `updated_at`

### 11.2 `recyclers`

Menyimpan profil pengelola.

Kolom: - `id` - `user_id` (nullable untuk data demo) - `name` -
`management_type` (`bank_sampah`, `pengepul`, `tps3r`,
`recycler_industry`) - `address` - `latitude` - `longitude` -
`contact` - `verification_status` (`pending`, `verified`, `rejected`) -
`is_demo` - `is_active` - `created_at` - `updated_at`

### 11.3 `waste_categories`

Menyimpan kategori material.

Kolom: - `id` - `name` - `unit` (`kg`, `liter`, `pcs`, atau satuan lain
yang didefinisikan) - `description` - `is_active` - `created_at` -
`updated_at`

### 11.4 `recycler_materials`

Menyimpan ketentuan penerimaan material oleh pengelola.

Kolom: - `id` - `recycler_id` - `category_id` - `price` - `unit` -
`min_quantity` - `quality_requirements` - `is_available` -
`price_updated_at` - `created_at` - `updated_at`

Buat unique constraint pada pasangan `recycler_id` dan `category_id`
jika satu pengelola hanya memiliki satu ketentuan aktif per kategori.

### 11.5 `matching_sessions`

Menyimpan sesi pencarian pengguna.

Kolom: - `id` - `user_id` (nullable jika pencarian tamu diizinkan) -
`latitude` - `longitude` - `priority` (`balanced`, `highest_value`,
`nearest`, `fewest_stops`) - `search_radius` - `status` - `created_at` -
`updated_at`

### 11.6 `matching_items`

Menyimpan material yang dimasukkan pengguna.

Kolom: - `id` - `session_id` - `category_id` - `quantity` - `unit` -
`condition` - `created_at` - `updated_at`

Untuk MVP, batasi satu baris per kategori dalam satu sesi atau tentukan
aturan penggabungan kuantitas.

### 11.7 `matching_results`

Menyimpan alternatif hasil pencocokan.

Kolom: - `id` - `session_id` - `rank` - `total_value` -
`total_distance` - `total_stops` - `economy_score` - `distance_score` -
`stops_score` - `final_score` - `unmatched_summary` - `created_at`

### 11.8 `matching_assignments`

Menyimpan penempatan material ke pengelola pada suatu alternatif.

Kolom: - `id` - `result_id` - `matching_item_id` -
`recycler_material_id` - `quantity_snapshot` - `price_snapshot` -
`estimated_value` - `created_at`

Snapshot kuantitas dan harga penting agar hasil pencarian lama tidak
berubah ketika pengelola memperbarui harga.

### 11.9 Tabel Opsional `price_histories`

Kolom: - `id` - `recycler_material_id` - `old_price` - `new_price` -
`changed_at`

### 11.10 Prinsip Database

-   Gunakan `DECIMAL`, bukan `FLOAT`, untuk harga dan kuantitas.
-   Tambahkan validasi nilai positif untuk harga, minimum, dan
    kuantitas.
-   Gunakan foreign key.
-   Simpan koordinat dengan tipe numerik yang sesuai.
-   Simpan status verifikasi dan status aktif secara terpisah.
-   Bedakan data demo dan mitra terverifikasi.
-   Simpan snapshot harga pada hasil pencocokan.
-   Catat tanggal pembaruan harga.
-   Jangan menganggap `is_active` berarti sudah terverifikasi.

## 12. Teknologi yang Digunakan

Rekomendasi stack: - Backend: Laravel 12. - Bahasa backend: PHP 8.3. -
Database: PostgreSQL 17. - Frontend: Blade dan Tailwind CSS. - Peta:
Leaflet. - Basemap: OpenStreetMap. - Perhitungan jarak: Haversine untuk
estimasi MVP. - Autentikasi: Laravel authentication. - Version control:
Git.

Stack ini sesuai untuk MVP karena tidak membutuhkan layanan AI, sistem
pembayaran, atau infrastruktur kompleks.

## 13. Rancangan Struktur Kode Laravel

Contoh pemisahan service agar logika pencocokan tidak menumpuk di
controller:

``` text
app/
├── Http/
│   └── Controllers/
│       ├── WasteController.php
│       ├── MatchingController.php
│       ├── RecyclerController.php
│       └── AdminController.php
├── Models/
│   ├── User.php
│   ├── Recycler.php
│   ├── WasteCategory.php
│   ├── RecyclerMaterial.php
│   ├── MatchingSession.php
│   ├── MatchingItem.php
│   ├── MatchingResult.php
│   └── MatchingAssignment.php
└── Services/
    └── Matching/
        ├── EligibilityService.php
        ├── CombinationService.php
        ├── DistanceService.php
        ├── ScoringService.php
        └── MatchingService.php
```

Tanggung jawab service: - `EligibilityService`: memeriksa material,
minimum kuantitas, status, dan kualitas. - `CombinationService`:
membentuk alternatif penempatan material. - `DistanceService`:
menghitung estimasi jarak. - `ScoringService`: menghitung skor sesuai
prioritas. - `MatchingService`: mengorkestrasi proses pencocokan.

Contoh endpoint: - `GET /waste/categories` - `POST /matching` -
`GET /matching/{id}` - `GET /recyclers` - `GET /recyclers/{id}` -
`POST /recycler/materials` - `PUT /recycler/materials/{id}` -
`POST /admin/recyclers/{id}/verify`

Endpoint harus dilindungi middleware dan otorisasi sesuai role.

## 14. Strategi Mendapatkan Data Pengelola

Salah satu risiko terbesar RecyNect adalah ketersediaan data pengelola
yang benar dan mutakhir. Karena itu, strategi pengumpulan data harus
dibuat bertahap.

### 14.1 Tahap MVP / Demonstrasi

-   Gunakan data simulasi yang dibuat untuk menguji sistem.
-   Beri label **DEMO --- bukan mitra nyata** pada profil dan hasil.
-   Jangan menggunakan nama, alamat, nomor telepon, atau logo pihak
    nyata tanpa dasar dan izin yang sesuai.
-   Gunakan harga contoh dan jelaskan bahwa harga bukan penawaran
    aktual.

### 14.2 Tahap Pengumpulan Data Awal

Sumber yang dapat ditelusuri: - Direktori bank sampah dari instansi
pemerintah atau pemerintah daerah. - Informasi publik dari DLH
setempat. - Situs atau media sosial resmi bank sampah. - Direktori
fasilitas TPS3R. - Informasi publik dari pengepul atau industri daur
ulang.

Data publik hanya menjadi petunjuk awal. Sebelum ditampilkan sebagai
mitra aktif, RecyNect perlu menghubungi pihak terkait dan
mengonfirmasi: - Apakah masih beroperasi? - Apakah menerima setoran dari
masyarakat umum? - Material apa saja yang diterima? - Apakah membeli
atau hanya menerima/mengelola? - Harga dan satuan yang berlaku. -
Minimum kuantitas. - Standar kualitas. - Alamat dan jam layanan. -
Apakah informasi boleh dipublikasikan?

### 14.3 Tahap Kemitraan

-   Menghubungi calon pengelola.
-   Menjelaskan fungsi platform.
-   Meminta persetujuan pencantuman profil.
-   Membuat akun pengelola.
-   Membantu pengelola memasukkan data awal.
-   Menetapkan mekanisme pembaruan informasi.
-   Menampilkan status verifikasi yang transparan.

### 14.4 Status Informasi Pengelola

Disarankan memiliki label: - **Demo:** data simulasi untuk pengujian. -
**Menunggu verifikasi:** pengelola sudah mendaftar, tetapi belum
diperiksa. - **Terverifikasi:** identitas dan informasi dasar telah
diperiksa. - **Perlu pembaruan:** harga atau informasi sudah melewati
batas waktu pembaruan. - **Tidak aktif:** tidak ditampilkan sebagai
pilihan pencocokan.

Verifikasi identitas tidak otomatis menjamin harga, kualitas, atau
pembelian. Pengguna tetap harus mengonfirmasi ketentuan akhir kepada
pengelola.

## 15. Tata Kelola Harga dan Kepercayaan

Harga sampah dapat berubah mengikuti kondisi pasar, kualitas, volume,
dan kebijakan pengelola.

Oleh karena itu: 1. Harga dimasukkan atau diperbarui oleh pengelola. 2.
Setiap harga memiliki satuan yang jelas. 3. Setiap harga menyimpan
tanggal pembaruan. 4. Harga lama dapat diberi peringatan jika belum
diperbarui dalam periode tertentu. 5. Hasil pencocokan menampilkan harga
sebagai estimasi. 6. Pengguna diminta mengonfirmasi harga dan penerimaan
sebelum berangkat. 7. Admin dapat menonaktifkan informasi yang tidak
valid. 8. Platform tidak menjamin nilai pembayaran final.

Contoh label di antarmuka:

> Estimasi nilai berdasarkan harga yang dimasukkan pengelola pada
> tanggal pembaruan yang tertera. Nilai akhir mengikuti hasil
> penimbangan, kondisi material, dan konfirmasi pengelola.

## 16. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Mitigasi
  ----------------------- ----------------------- -----------------------
  Belum ada pengelola     Hasil pencocokan nyata  Gunakan data demo
  bergabung               terbatas                secara transparan untuk
                                                  MVP; lakukan pendekatan
                                                  mitra setelah demo

  Harga tidak diperbarui  Estimasi tidak akurat   Tampilkan tanggal
                                                  pembaruan dan status
                                                  perlu pembaruan

  Pengelola tidak         Pengalaman buruk        Tampilkan kontak dan
  menerima material saat                          anjurkan konfirmasi
  pengguna datang                                 sebelum kunjungan

  Satuan tidak konsisten  Perhitungan salah       Validasi satuan per
                                                  kategori

  Material tidak memenuhi Setoran ditolak         Tampilkan persyaratan
  kualitas                                        kualitas secara jelas

  Tidak ada pengelola     Pengguna tidak mendapat Tampilkan material yang
  yang cocok              rekomendasi             belum cocok dan alasan
                                                  kegagalannya

  Jarak garis lurus       Estimasi perjalanan     Beri label estimasi
  berbeda dari jalan      tidak akurat            garis lurus; jangan
                                                  klaim sebagai jarak
                                                  jalan

  Data palsu atau tidak   Kepercayaan menurun     Verifikasi, moderasi,
  sah                                             dan status data

  Kombinasi terlalu       Proses lambat           Batasi jumlah kategori,
  banyak                                          pengelola, dan
                                                  alternatif pada MVP
  -----------------------------------------------------------------------

## 17. Rencana Pengembangan 7 Hari

### Hari 1 --- Fondasi

-   Membuat project Laravel.
-   Menghubungkan PostgreSQL.
-   Membuat migration dan model.
-   Membuat seeder kategori dan data pengelola demo.

### Hari 2 --- Modul Pengelola

-   CRUD profil pengelola.
-   CRUD material yang diterima.
-   Harga, satuan, minimum kuantitas, kualitas, dan status.
-   Role dan middleware dasar.

### Hari 3 --- Input Masyarakat

-   Form input beberapa kategori sampah.
-   Kuantitas dan satuan.
-   Lokasi pengguna.
-   Pilihan prioritas.

### Hari 4 --- Matching Engine

-   Eligibility filter.
-   Pembentukan kombinasi.
-   Perhitungan estimasi nilai.
-   Perhitungan jarak.
-   Scoring dan ranking.

### Hari 5 --- Hasil dan Peta

-   Halaman alternatif hasil.
-   Perbandingan nilai, jarak, dan jumlah titik.
-   Detail pengelola.
-   Peta Leaflet.
-   Ringkasan rencana setoran.

### Hari 6 --- Integrasi dan Pengujian

-   Integrasi seluruh modul.
-   Pengujian kasus normal dan edge case.
-   Perbaikan bug.
-   Pemeriksaan akses role.

### Hari 7 --- Finalisasi

-   Polishing UI.
-   Data demo yang konsisten.
-   Akun demo masyarakat, pengelola, dan admin.
-   Dokumentasi.
-   Skenario presentasi dan video demo.

## 18. Skenario Pengujian

1.  Semua material diterima oleh satu pengelola.
2.  Material harus dibagi ke dua pengelola.
3.  Kuantitas pengguna di bawah minimum.
4.  Pengelola tidak menerima kategori material.
5.  Pengelola berstatus nonaktif.
6.  Tidak ada pengelola yang cocok.
7.  Harga pengelola berbeda untuk material yang sama.
8.  Lokasi pengelola berbeda.
9.  Perubahan prioritas mengubah urutan hasil.
10. Harga yang diperbarui berlaku untuk sesi baru.
11. Sebagian material cocok dan sebagian tidak.
12. Pengelola belum terverifikasi tidak muncul sebagai mitra aktif.
13. Data demo selalu diberi label demo.
14. Satuan yang berbeda tidak dihitung menggunakan rumus yang salah.
15. Jumlah titik pada hasil sama dengan jumlah pengelola unik yang
    digunakan.

## 19. Indikator Keberhasilan MVP

Keberhasilan MVP dinilai dari fungsi sistem, bukan dari klaim jumlah
transaksi nyata.

Indikator teknis: - Pengguna dapat memasukkan beberapa material. -
Sistem dapat menyaring pengelola berdasarkan kelayakan. - Sistem dapat
menghasilkan beberapa alternatif. - Sistem menghitung nilai indikatif
dengan satuan benar. - Sistem menampilkan estimasi jarak dan jumlah
titik. - Prioritas pengguna memengaruhi pemeringkatan. - Material yang
tidak cocok ditampilkan secara transparan. - Pengelola dapat memperbarui
data melalui dashboard. - Admin dapat memverifikasi atau menonaktifkan
data.

Indikator validasi setelah MVP: - Jumlah pengelola yang bersedia
mengonfirmasi data. - Persentase informasi harga yang masih mutakhir. -
Jumlah material yang memiliki setidaknya satu pengelola cocok. -
Seberapa mudah masyarakat memahami hasil pencocokan. - Apakah
rekomendasi mengurangi pencarian manual menurut pengguna uji.

## 20. Strategi Presentasi dan Jawaban untuk Juri

### Pertanyaan: Siapa pengelola sampah di RecyNect?

Jawaban: \> Pengelola di RecyNect tidak terbatas pada bank sampah.
Pihak yang dapat bergabung mencakup bank sampah, pengepul, TPS3R, dan
industri daur ulang, selama mereka memang menerima material yang
dicantumkan. RecyNect berperan sebagai platform penghubung dan
pencocokan, bukan sebagai pengolah sampah.

### Pertanyaan: Apakah pengelola harus berasal dari bank sampah?

Jawaban: \> Tidak. Bank sampah merupakan salah satu calon mitra utama,
tetapi pengepul dan fasilitas atau industri daur ulang juga dapat
bergabung. Jenis pengelola dicatat dalam profil agar masyarakat memahami
pihak yang akan menerima materialnya.

### Pertanyaan: Bagaimana RecyNect mendapatkan data pengelola?

Jawaban: \> Pada tahap demonstrasi, kami menggunakan data simulasi yang
diberi label demo. Pada tahap implementasi, data awal dapat ditelusuri
dari direktori publik dan informasi instansi terkait, kemudian
dikonfirmasi langsung kepada calon pengelola sebelum ditampilkan sebagai
mitra terverifikasi.

### Pertanyaan: Bagaimana pengelola memasukkan harga dan jenis sampah?

Jawaban: \> Pengelola memiliki dashboard untuk mengatur profil, lokasi,
material yang diterima, harga per satuan, minimum kuantitas, dan
persyaratan kualitas. Admin memeriksa kelengkapan data sebelum profil
ditampilkan sebagai pengelola terverifikasi.

### Pertanyaan: Apakah harga yang muncul dijamin?

Jawaban: \> Tidak. Harga merupakan estimasi berdasarkan informasi yang
dimasukkan pengelola dan memiliki tanggal pembaruan. Nilai akhir tetap
bergantung pada penimbangan, kondisi material, dan konfirmasi pengelola.

### Pertanyaan: Apa pembeda RecyNect dari platform bank sampah yang sudah ada?

Jawaban: \> RecyNect berfokus pada pencocokan beberapa jenis sampah
sekaligus ke beberapa pengelola, lalu menyusun alternatif berdasarkan
kecocokan material, minimum kuantitas, estimasi nilai ekonomi, jarak,
dan jumlah titik kunjungan. Kami tidak mengklaim fitur dasarnya belum
pernah ada; pembeda yang kami kembangkan adalah integrasi alur
pencocokan dan perbandingan alternatif tersebut.

### Pertanyaan: Bagaimana jika belum ada mitra yang bergabung?

Jawaban: \> MVP dapat mendemonstrasikan alur menggunakan data simulasi
yang diberi label secara transparan. Untuk implementasi nyata, kami
perlu melakukan validasi dan kerja sama dengan pengelola sebelum
menampilkan mereka sebagai mitra aktif. Kami tidak akan mengklaim adanya
kemitraan yang belum disepakati.

### Pertanyaan: Apakah RecyNect mengambil atau mengangkut sampah?

Jawaban: \> Tidak pada MVP. RecyNect memberikan rekomendasi tempat
penyetoran dan informasi persyaratannya. Pengguna mengonfirmasi langsung
kepada pengelola dan melakukan setoran sesuai mekanisme pengelola
tersebut.

## 21. Kesimpulan

RecyNect dirancang sebagai platform pencocokan multi-material yang
menghubungkan masyarakat dengan berbagai jenis pengelola sampah daur
ulang. Fokus utama bukan sekadar menampilkan daftar bank sampah atau
harga material, melainkan membantu pengguna menyusun alternatif
penyetoran yang memenuhi ketentuan penerimaan dan dapat dibandingkan
berdasarkan estimasi nilai ekonomi, lokasi, serta jumlah titik
kunjungan.

Pengelola dapat berasal dari bank sampah, pengepul, TPS3R, maupun
industri daur ulang. Mereka mengelola informasi penerimaan material
melalui dashboard, sementara admin RecyNect bertugas memeriksa
kelengkapan dan status informasi.

Keberhasilan konsep ini bergantung pada kualitas data pengelola,
transparansi harga, dan ketepatan logika pencocokan. Oleh sebab itu, MVP
harus membedakan data simulasi dari mitra terverifikasi dan tidak
menjanjikan transaksi atau pembayaran nyata yang belum didukung kerja
sama operasional.

------------------------------------------------------------------------

## 22. Referensi Awal untuk Studi Kompetitor

Referensi berikut merupakan sumber resmi produk yang dapat digunakan
untuk meninjau fitur pesaing. Informasi fitur dapat berubah, sehingga
perlu diperiksa kembali sebelum dokumen dipublikasikan atau
dipresentasikan.

1.  Reresik --- Cara Kerja: https://app.reresik.com/cara-kerja
2.  Reresik --- Marketplace: https://app.reresik.com/
3.  Reresik --- Tentang: https://app.reresik.com/about
4.  BankSampah.id --- Produk: https://banksampah.id/smash/product
5.  BankSampah.id --- Harga: https://banksampah.id/smash/pricing
6.  mySmash --- FAQ: https://www.smash.id/faq
7.  Bank Sampah Digital: https://setorsampah.id/
8.  Bank Sampah Digital: https://banksampahdigital.id/
9.  BinBuddy / Uwuh: https://uwuh.org/
10. e-Smash: https://e.smash.id/

**Catatan metodologi:** matriks kompetitor dalam dokumen ini merupakan
tinjauan awal atas informasi publik. Status "belum ditemukan" berarti
fitur tidak berhasil dikonfirmasi dari sumber publik yang ditinjau,
bukan bukti bahwa fitur tersebut tidak tersedia di dalam aplikasi atau
operasional internal pesaing.

