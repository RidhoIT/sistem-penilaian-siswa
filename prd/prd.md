PRODUCT REQUIREMENTS DOCUMENT
Platform Ujian CBT (Computer-Based Testing)
Version 1.4.0  |  Status: Finalized  |  Last Updated: April 2026

1. OVERVIEW & EXECUTIVE SUMMARY
1.1 Deskripsi Produk
Platform Ujian CBT adalah sistem manajemen ujian berbasis web yang memungkinkan guru untuk membuat, mengelola, dan mendistribusikan ujian secara digital kepada siswa. Siswa (user guest) dapat mengakses ujian melalui link khusus tanpa perlu membuat akun, cukup memasukkan identitas dan token akses.
Platform ini juga mendukung tiga mode pembelajaran tambahan selain ujian formal: Latihan (soal bebas tanpa batas waktu), Kuis (ujian singkat informal), dan Ulangan (ujian periodik terstruktur).
1.2 Tujuan Produk
Digitalisasi proses ujian dari paper-based menjadi computer-based
Mencegah kecurangan dengan sistem anti-cheating yang ketat
Memudahkan guru dalam mengelola soal, ujian, kisi-kisi, dan penilaian
Menyediakan berbagai mode assessment: Ujian, Latihan, Kuis, dan Ulangan
Memberikan hasil nilai secara instan kepada siswa setelah selesai
1.3 Target Pengguna
Peran
Deskripsi
Admin
Superuser yang mengelola seluruh sistem, data, dan pengguna
Guru
Pembuat dan pengelola konten assessment; memiliki akses ke fitur manajemen
Siswa (Guest)
Peserta ujian/latihan tanpa akun; akses via link + token + identitas diri


2. USER ROLES & PERMISSIONS
2.1 Admin
Full access ke seluruh fitur sistem
Mengelola akun guru (create, read, update, deactivate)
Melihat dan mengelola semua soal, ujian, latihan, kuis, ulangan, nilai, kisi-kisi, kartu soal
Mengelola master data mata pelajaran (subjects)
Akses laporan dan analitik global
2.2 Guru
Mengelola ujian, latihan, kuis, dan ulangan milik sendiri (CRUD)
Mengelola bank soal milik sendiri
Mengelola kisi-kisi dan kartu soal
Melihat dan mengekspor nilai siswa
Mengaktifkan / menonaktifkan semua jenis assessment
2.3 Siswa (Guest)
Akses ujian/latihan/kuis/ulangan via link unik
Input identitas (NISN, Nama, Kelas) + token
Mengerjakan soal CBT
Melihat hasil nilai setelah submit
3. FITUR UTAMA (FEATURE REQUIREMENTS)
3.1 MODUL AUTENTIKASI
FR-AUTH-01: Login
Aktor: Admin, Guru
Deskripsi: User memasukkan email dan password untuk masuk ke sistem.
Flow:
User mengakses halaman /login
Input email + password
Sistem memvalidasi kredensial
Jika berhasil: redirect berdasarkan role (Admin → /admin/dashboard, Guru → /guru/dashboard)
Jika gagal: tampilkan pesan error
Validasi:
Email wajib valid format
Password minimal 8 karakter
Rate limiting: maks 5 percobaan gagal → lockout 15 menit
Output: JWT Token (Access Token + Refresh Token)
FR-AUTH-02: Register
Aktor: Admin (mendaftarkan akun Guru) atau Guru (self-register)
Data yang diperlukan: Nama Lengkap, Email (unik), Password + Konfirmasi, Mata Pelajaran yang Diampu (multi-select), NIP (opsional)
FR-AUTH-03: Logout
Invalidasi token sesi
Redirect ke halaman /login
FR-AUTH-04: Lupa Password
User input email terdaftar
Sistem kirim link reset password ke email
Link berlaku 1 jam
3.2 MODUL GURU
FR-GURU-01: Manajemen Ujian (Formal)
Ujian formal dengan durasi, waktu mulai-selesai, token akses, dan anti-cheat penuh.
Field
Keterangan
Judul Ujian
Nama ujian yang ditampilkan ke siswa
Mata Pelajaran
FK → subjects (dari teacher_subjects guru)
Kelas / Tingkat
Kelas target peserta ujian
Tanggal & Waktu Mulai/Selesai
Window waktu akses ujian
Durasi Pengerjaan
Dalam menit
Token Akses
Auto-generate atau manual, min 6 karakter
Status
Aktif / Nonaktif
Jumlah Soal Ditampilkan
Bisa subset dari bank soal
Acak Soal / Pilihan
Toggle randomisasi
Instruksi Ujian
Rich text


FR-GURU-02: Manajemen Latihan
Latihan adalah mode belajar mandiri siswa tanpa batasan waktu ketat. Cocok untuk persiapan sebelum ujian.
Field
Keterangan
Judul Latihan
Nama latihan
Mata Pelajaran
FK → subjects
Kelas
Kelas target
Deskripsi / Instruksi
Panduan pengerjaan
Token Akses
Opsional — bisa publik tanpa token
Status
Aktif / Nonaktif
Tampilkan Pembahasan
Toggle — tampilkan kunci jawaban setelah jawab
Acak Soal / Pilihan
Toggle randomisasi
Mode Pengerjaan
Semua soal sekaligus / satu per satu

Catatan: Latihan tidak memiliki durasi countdown. Siswa dapat mengerjakan kapan saja selama latihan aktif. Pembahasan dapat langsung ditampilkan setelah menjawab tiap soal jika diaktifkan guru.

FR-GURU-03: Manajemen Kuis
Kuis adalah ujian singkat informal, biasanya untuk mengecek pemahaman materi yang baru diajarkan.
Field
Keterangan
Judul Kuis
Nama kuis
Mata Pelajaran
FK → subjects
Kelas
Kelas target
Durasi Pengerjaan
Dalam menit (lebih pendek dari ujian formal)
Token Akses
Wajib
Status
Aktif / Nonaktif
Tampilkan Hasil Langsung
Toggle — nilai & pembahasan setelah submit
Jumlah Soal
Biasanya 5–15 soal
Acak Soal / Pilihan
Toggle
Anti-Cheat Level
Ringan: hanya deteksi tab switching

Catatan: Kuis memiliki anti-cheat yang lebih ringan dibanding ujian formal. Cocok untuk formatif harian atau exit ticket.

FR-GURU-04: Manajemen Ulangan
Ulangan adalah ujian periodik terstruktur (Ulangan Harian, UTS, UAS) dengan pengaturan serupa ujian formal namun dengan kategori dan metadata khusus.
Field
Keterangan
Judul Ulangan
Nama ulangan
Kategori Ulangan
Ulangan Harian / UTS / UAS / Sumatif / Formatif
Mata Pelajaran
FK → subjects
Kelas
Kelas target
Semester
1 atau 2
Tahun Ajaran
Contoh: 2025/2026
Tanggal & Waktu Mulai/Selesai
Window waktu akses
Durasi Pengerjaan
Dalam menit
Token Akses
Wajib
Status
Aktif / Nonaktif
KKM (Nilai Minimum)
Untuk menentukan lulus/tidak
Acak Soal / Pilihan
Toggle

Catatan: Ulangan memiliki metadata semester dan tahun ajaran untuk pelaporan. Nilai KKM ditampilkan di halaman hasil siswa sebagai indikator ketuntasan.

FR-GURU-05: Manajemen Soal (Bank Soal)
Tipe soal: Pilihan Ganda (A–E), Benar/Salah, Essay/Uraian (penilaian manual guru).
Semua jenis assessment (Ujian, Latihan, Kuis, Ulangan) menggunakan bank soal yang sama. Soal dapat di-assign ke lebih dari satu jenis assessment.
FR-GURU-06: Manajemen Nilai
Nilai tersedia untuk semua jenis assessment (Ujian, Latihan, Kuis, Ulangan). Fitur:
Daftar nilai per assessment (NISN, Nama, Kelas, Nilai, Status)
Detail jawaban per siswa
Penilaian essay manual
Izinkan pengulangan (retake) per siswa
Ekspor ke Excel atau PDF
FR-GURU-07: Manajemen Kisi-Kisi
Kisi-kisi dapat dikaitkan dengan ujian atau ulangan tertentu. Format sesuai standar Kemendikbud.
FR-GURU-08: Manajemen Kartu Soal
Kartu digital dua sisi: depan (pertanyaan + KD + indikator), belakang (kunci + pembahasan + level Bloom).
3.3 MODUL ADMIN
Admin memiliki semua akses Guru ditambah:
Manajemen User (Guru): CRUD, aktifkan/nonaktifkan, reset password
Manajemen Data Global: soal, ujian, latihan, kuis, ulangan, nilai, kisi-kisi, kartu soal
Manajemen Master Mata Pelajaran (subjects): tambah, edit, nonaktifkan
Dashboard & Analitik: statistik global, grafik tren, log aktivitas
3.4 MODUL SISWA (GUEST / CBT)
FR-CBT-01: Halaman Akses Assessment
Flow akses berlaku untuk semua jenis assessment. URL format: domain.com/{type}/{code}
Siswa buka link → sistem cek status (aktif/nonaktif/waktu)
Form identitas: NISN, Nama Lengkap, Kelas, Token (jika diperlukan)
Validasi → halaman instruksi → mulai
Satu NISN hanya bisa ikut sekali (kecuali guru reset sesi)
FR-CBT-02: Interface Pengerjaan
Navigasi soal dengan panel grid (abu-abu/hijau/kuning)
Timer countdown (khusus Ujian, Kuis, Ulangan)
Auto-submit saat waktu habis
Auto-save jawaban setiap 10 detik
FR-CBT-03: Anti-Cheat
Level anti-cheat per jenis assessment:
Fitur Anti-Cheat
Ujian
Kuis
Ulangan
Latihan
Deteksi Tab Switching
✓ (3x → auto-submit)
✓ (peringatan saja)
✓ (3x → auto-submit)
✗
Fullscreen Mode
✓
✗
✓
✗
Disable Right-Click
✓
✓
✓
✗
Disable Copy-Paste
✓
✓
✓
✗
Disable Text Selection
✓
✓
✓
✗
Deteksi DevTools
✓
✗
✓
✗
Watermark Nama Siswa
✓
✗
✓
✗
Log Pelanggaran
✓
✓
✓
✗


4. USER INTERFACE & ROUTES
Route
Akses
Deskripsi
/login
Public
Login Admin & Guru
/register
Public
Register Guru (self-register)
/forgot-password
Public
Reset password
/admin/dashboard
Admin
Dashboard admin
/admin/users
Admin
Manajemen user guru
/admin/soal
Admin
Manajemen soal global
/admin/ujian
Admin
Manajemen ujian global
/admin/latihan
Admin
Manajemen latihan global
/admin/kuis
Admin
Manajemen kuis global
/admin/ulangan
Admin
Manajemen ulangan global
/admin/nilai
Admin
Manajemen nilai global
/admin/kisi-kisi
Admin
Manajemen kisi-kisi global
/admin/kartu-soal
Admin
Manajemen kartu soal global
/admin/mata-pelajaran
Admin
Manajemen master mata pelajaran
/guru/dashboard
Guru
Dashboard guru
/guru/ujian
Guru
Daftar ujian saya
/guru/latihan
Guru
Daftar latihan saya
/guru/kuis
Guru
Daftar kuis saya
/guru/ulangan
Guru
Daftar ulangan saya
/guru/soal
Guru
Bank soal saya
/guru/nilai
Guru
Nilai semua assessment saya
/guru/kisi-kisi
Guru
Kisi-kisi saya
/guru/kartu-soal
Guru
Kartu soal saya
/guru/profil
Guru
Profil & kelola mata pelajaran
/ujian/:exam_code
Guest
Akses ujian formal
/latihan/:code
Guest
Akses latihan
/kuis/:code
Guest
Akses kuis
/ulangan/:code
Guest
Akses ulangan
/:type/:code/berlangsung
Guest Session
Halaman CBT (semua tipe)
/:type/:code/hasil
Guest Session
Hasil assessment


5. DATABASE SCHEMA
5.1 Diagram Relasi (ERD Summary)
Tabel subjects adalah pusat relasi master mata pelajaran yang berelasi dengan semua tabel assessment:
subjects (master mata pelajaran)   │   ├──< teacher_subjects >── users       (many-to-many: guru ↔ mapel)   │users ──< exams         (ujian formal)users ──< practice_sets  (latihan)users ──< quizzes        (kuis)users ──< daily_tests    (ulangan)   │exams/practice_sets/quizzes/daily_tests ──< *_questions >── questionsexams/practice_sets/quizzes/daily_tests ──< *_sessions   └──< student_answers   └──< violations (khusus ujian, ulangan, kuis)questions >── subjects   (FK: setiap soal merujuk ke 1 mapel)exams     >── subjects   (FK)practice_sets >── subjects (FK)quizzes   >── subjects   (FK)daily_tests >── subjects  (FK)kisi_kisi >── subjects   (FK)
5.2 TABLE: subjects (Master Mata Pelajaran)
Catatan: Dikelola oleh Admin. Guru hanya memilih dari daftar yang tersedia.
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK
Primary key
name
VARCHAR(100)
UNIQUE, NOT NULL
Nama mata pelajaran
code
VARCHAR(20)
UNIQUE, NULLABLE
Kode singkat (MTK, BIO, dsb)
jenjang
ENUM
DEFAULT 'Umum'
SD/SMP/SMA/SMK/Umum
description
TEXT
NULLABLE
Deskripsi singkat
is_active
BOOLEAN
DEFAULT true
Jika false, tidak muncul di dropdown
created_by
UUID
FK → users.id
Admin yang menambahkan
created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL




5.3 TABLE: teacher_subjects (Pivot: Guru ↔ Mata Pelajaran)
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


user_id
UUID
FK → users.id, CASCADE
Guru
subject_id
UUID
FK → subjects.id, CASCADE
Mata pelajaran yang diampu
created_at
TIMESTAMP
NOT NULL



Catatan: UNIQUE CONSTRAINT: (user_id, subject_id) — satu guru tidak bisa terdaftar di mapel yang sama dua kali.

5.4 TABLE: users
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


name
VARCHAR(255)
NOT NULL
Nama lengkap
email
VARCHAR(255)
UNIQUE, NOT NULL
Email login
password_hash
VARCHAR(255)
NOT NULL
Bcrypt hash
role
ENUM
NOT NULL
'admin' atau 'guru'
nip
VARCHAR(50)
NULLABLE
Nomor Induk Pegawai
is_active
BOOLEAN
DEFAULT true
Status akun
avatar_url
TEXT
NULLABLE
Foto profil
last_login_at
TIMESTAMP
NULLABLE
Login terakhir
created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL




5.5 TABLE: questions (Bank Soal)
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


created_by
UUID
FK → users.id
Guru pembuat
question_type
ENUM
NOT NULL
multiple_choice / true_false / essay
content
TEXT
NOT NULL
Isi pertanyaan (HTML/rich text)
explanation
TEXT
NULLABLE
Pembahasan jawaban
correct_answer
TEXT
NULLABLE
Untuk essay: null; MC: option id
subject_id
UUID
FK → subjects.id, NOT NULL
Mata pelajaran soal ini
kelas
VARCHAR(20)
NOT NULL
Contoh: X, XI IPA
kompetensi_dasar
TEXT
NULLABLE
KD terkait
indikator
TEXT
NULLABLE
Indikator soal
cognitive_level
ENUM
NOT NULL
C1–C6 (Bloom's Taxonomy)
difficulty
ENUM
NOT NULL
mudah / sedang / sulit
tags
JSON
NULLABLE
Array string tags
image_url
TEXT
NULLABLE
Gambar soal (opsional)
is_active
BOOLEAN
DEFAULT true


created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL




5.6 TABLE: exams (Ujian Formal)
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


exam_code
VARCHAR(20)
UNIQUE, NOT NULL
Kode URL: /ujian/{exam_code}
created_by
UUID
FK → users.id
Guru pembuat
title
VARCHAR(255)
NOT NULL
Judul ujian
subject_id
UUID
FK → subjects.id, NOT NULL
Mata pelajaran ujian
kelas
VARCHAR(50)
NOT NULL


instructions
TEXT
NULLABLE
Instruksi ujian
duration_minutes
INTEGER
NOT NULL
Durasi (menit)
start_time
TIMESTAMP
NULLABLE
Waktu mulai
end_time
TIMESTAMP
NULLABLE
Waktu tutup
access_token
VARCHAR(50)
NOT NULL
Token akses siswa
is_active
BOOLEAN
DEFAULT true


randomize_questions
BOOLEAN
DEFAULT false


randomize_options
BOOLEAN
DEFAULT false


show_result
BOOLEAN
DEFAULT true


max_violations
INTEGER
DEFAULT 3
Maks pelanggaran → auto-submit
created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL




5.7 TABLE: practice_sets (Latihan)
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


practice_code
VARCHAR(20)
UNIQUE, NOT NULL
Kode URL: /latihan/{practice_code}
created_by
UUID
FK → users.id
Guru pembuat
title
VARCHAR(255)
NOT NULL
Judul latihan
subject_id
UUID
FK → subjects.id, NOT NULL
Mata pelajaran latihan
kelas
VARCHAR(50)
NOT NULL


description
TEXT
NULLABLE
Deskripsi / instruksi latihan
access_token
VARCHAR(50)
NULLABLE
Token akses (null = publik)
is_active
BOOLEAN
DEFAULT true


show_explanation
BOOLEAN
DEFAULT true
Tampilkan pembahasan setelah jawab
show_result
BOOLEAN
DEFAULT true
Tampilkan nilai akhir
randomize_questions
BOOLEAN
DEFAULT false


randomize_options
BOOLEAN
DEFAULT false


display_mode
ENUM
DEFAULT 'all'
'all' (semua) atau 'one_by_one' (per soal)
created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL



Catatan: Latihan tidak memiliki durasi atau waktu mulai/selesai. Tidak ada anti-cheat. Siswa bisa mengerjakan berulang kali tanpa batas (kecuali jika guru menonaktifkan ulang).

5.8 TABLE: quizzes (Kuis)
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


quiz_code
VARCHAR(20)
UNIQUE, NOT NULL
Kode URL: /kuis/{quiz_code}
created_by
UUID
FK → users.id
Guru pembuat
title
VARCHAR(255)
NOT NULL
Judul kuis
subject_id
UUID
FK → subjects.id, NOT NULL
Mata pelajaran kuis
kelas
VARCHAR(50)
NOT NULL


instructions
TEXT
NULLABLE
Instruksi kuis
duration_minutes
INTEGER
NULLABLE
Durasi (menit); null = tanpa batas
access_token
VARCHAR(50)
NOT NULL
Token akses siswa
is_active
BOOLEAN
DEFAULT true


show_result_immediately
BOOLEAN
DEFAULT true
Tampilkan nilai & pembahasan setelah submit
randomize_questions
BOOLEAN
DEFAULT false


randomize_options
BOOLEAN
DEFAULT false


anti_cheat_level
ENUM
DEFAULT 'light'
'none' / 'light' / 'strict'
created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL




5.9 TABLE: daily_tests (Ulangan)
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


test_code
VARCHAR(20)
UNIQUE, NOT NULL
Kode URL: /ulangan/{test_code}
created_by
UUID
FK → users.id
Guru pembuat
title
VARCHAR(255)
NOT NULL
Judul ulangan
category
ENUM
NOT NULL
ulangan_harian / uts / uas / sumatif / formatif
subject_id
UUID
FK → subjects.id, NOT NULL
Mata pelajaran ulangan
kelas
VARCHAR(50)
NOT NULL


semester
ENUM
NOT NULL
'1' atau '2'
tahun_ajaran
VARCHAR(20)
NOT NULL
Contoh: 2025/2026
instructions
TEXT
NULLABLE
Instruksi ulangan
duration_minutes
INTEGER
NOT NULL
Durasi (menit)
start_time
TIMESTAMP
NULLABLE
Waktu mulai
end_time
TIMESTAMP
NULLABLE
Waktu tutup
access_token
VARCHAR(50)
NOT NULL
Token akses siswa
kkm
INTEGER
DEFAULT 75
Nilai Kriteria Ketuntasan Minimal
is_active
BOOLEAN
DEFAULT true


randomize_questions
BOOLEAN
DEFAULT false


randomize_options
BOOLEAN
DEFAULT false


max_violations
INTEGER
DEFAULT 3
Maks pelanggaran → auto-submit
show_result
BOOLEAN
DEFAULT true


created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL




5.10 Tabel Pivot: Soal per Assessment
Setiap jenis assessment memiliki tabel pivot untuk menyimpan soal yang digunakan:
Tabel
FK Assessment
FK Soal
Kolom Tambahan
exam_questions
exam_id → exams.id
question_id → questions.id
order_index, points DECIMAL(5,2)
practice_questions
practice_id → practice_sets.id
question_id → questions.id
order_index
quiz_questions
quiz_id → quizzes.id
question_id → questions.id
order_index, points DECIMAL(5,2)
daily_test_questions
test_id → daily_tests.id
question_id → questions.id
order_index, points DECIMAL(5,2)


5.11 Tabel Sesi & Jawaban
Setiap jenis assessment memiliki tabel sesi tersendiri dengan struktur serupa:
Tabel Sesi
Assessment
Field Khusus
exam_sessions
Ujian Formal
violation_count, status (in_progress/submitted/auto_submitted/violation_ended)
practice_sessions
Latihan
Bisa diakses berulang (tidak ada UNIQUE pada nisn+practice_id)
quiz_sessions
Kuis
violation_count (light anti-cheat)
daily_test_sessions
Ulangan
violation_count, is_passed (score >= kkm)

Catatan: Semua tabel sesi memiliki field: id, nisn, student_name, student_class, session_token, started_at, submitted_at, score, total_correct, total_wrong, total_unanswered, ip_address, user_agent, created_at, updated_at.

Tabel student_answers digunakan bersama untuk semua jenis assessment, dengan kolom session_type untuk membedakan:
Kolom
Tipe
Keterangan
id
UUID
PK
session_type
ENUM
'exam' / 'practice' / 'quiz' / 'daily_test'
session_id
UUID
FK ke tabel sesi yang sesuai (polymorphic)
question_id
UUID
FK → questions.id
selected_option_id
UUID
FK → question_options.id, NULLABLE
essay_answer
TEXT
Untuk soal essay
is_correct
BOOLEAN
null jika essay belum dinilai
manual_score
DECIMAL(5,2)
Nilai manual untuk essay
teacher_comment
TEXT
Komentar guru untuk essay
answered_at
TIMESTAMP
Waktu menjawab
time_spent_seconds
INTEGER
Durasi mengerjakan soal ini
is_flagged
BOOLEAN
Siswa menandai soal ragu-ragu


5.12 TABLE: violations (Log Pelanggaran)
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


session_type
ENUM
NOT NULL
'exam' / 'quiz' / 'daily_test'
session_id
UUID
NOT NULL
ID sesi yang melanggar
violation_type
ENUM
NOT NULL
tab_switch / window_blur / fullscreen_exit / devtools_open / print_screen / copy_attempt / context_menu
violation_number
INTEGER
NOT NULL
Urutan pelanggaran ke-berapa
current_question
INTEGER
NULLABLE
Nomor soal saat pelanggaran
description
TEXT
NULLABLE
Detail tambahan
occurred_at
TIMESTAMP
NOT NULL



Catatan: Tabel violations tidak berlaku untuk Latihan (practice_sessions) karena tidak ada anti-cheat.

5.13 TABLE: kisi_kisi & kisi_kisi_items
Kolom
Tipe
Constraint
Keterangan
id
UUID
PK


created_by
UUID
FK → users.id


title
VARCHAR(255)
NOT NULL
Nama kisi-kisi
subject_id
UUID
FK → subjects.id, NOT NULL
Mata pelajaran
kelas
VARCHAR(50)
NOT NULL


semester
ENUM
NOT NULL
'1' atau '2'
tahun_ajaran
VARCHAR(20)
NOT NULL


kompetensi_inti
TEXT
NULLABLE


created_at
TIMESTAMP
NOT NULL


updated_at
TIMESTAMP
NOT NULL




5.14 TABLE: question_cards & card_sets
Catatan: Sama dengan versi 1.3.0. subject_id FK → subjects.id (NOT NULL untuk question_cards, NULLABLE untuk card_sets).
6. API ENDPOINTS (REST)
6.1 Auth & Profile
Method
Endpoint
Deskripsi
POST
/api/auth/login
Login Admin/Guru
POST
/api/auth/register
Register Guru
POST
/api/auth/logout
Logout
POST
/api/auth/refresh-token
Refresh JWT
POST
/api/auth/forgot-password
Kirim link reset
POST
/api/auth/reset-password
Reset password
GET
/api/auth/me
Data user saat ini
PUT
/api/profile
Update profil guru
GET
/api/profile/subjects
Daftar mapel guru ini
POST
/api/profile/subjects
Tambah mapel ke daftar ampu
DELETE
/api/profile/subjects/:id
Hapus mapel dari ampu


6.2 Admin — Master Mata Pelajaran
Method
Endpoint
Deskripsi
GET
/api/admin/subjects
List semua mata pelajaran
POST
/api/admin/subjects
Tambah mata pelajaran baru
GET
/api/admin/subjects/:id
Detail satu mapel
PUT
/api/admin/subjects/:id
Edit mapel
PATCH
/api/admin/subjects/:id/toggle-active
Aktifkan/nonaktifkan
GET
/api/subjects
Public: list mapel aktif (untuk dropdown guru)


6.3 Ujian, Latihan, Kuis, Ulangan
Method
Endpoint
Deskripsi
GET/POST
/api/exams
List/buat ujian
GET/PUT/DELETE
/api/exams/:id
Detail/edit/hapus ujian
PATCH
/api/exams/:id/toggle-active
Toggle aktif
GET/POST
/api/practice-sets
List/buat latihan
GET/PUT/DELETE
/api/practice-sets/:id
Detail/edit/hapus latihan
GET/POST
/api/quizzes
List/buat kuis
GET/PUT/DELETE
/api/quizzes/:id
Detail/edit/hapus kuis
GET/POST
/api/daily-tests
List/buat ulangan
GET/PUT/DELETE
/api/daily-tests/:id
Detail/edit/hapus ulangan


6.4 CBT Guest Endpoints
Method
Endpoint
Deskripsi
GET
/api/cbt/exam/:code/info
Cek status ujian
POST
/api/cbt/exam/:code/join
Daftar + validasi → create session ujian
GET
/api/cbt/practice/:code/info
Cek status latihan
POST
/api/cbt/practice/:code/join
Buat session latihan
GET
/api/cbt/quiz/:code/info
Cek status kuis
POST
/api/cbt/quiz/:code/join
Buat session kuis
GET
/api/cbt/daily-test/:code/info
Cek status ulangan
POST
/api/cbt/daily-test/:code/join
Buat session ulangan
GET
/api/cbt/session/:token
Ambil soal sesi
POST
/api/cbt/session/:token/answer
Simpan jawaban (auto-save)
POST
/api/cbt/session/:token/submit
Submit assessment
POST
/api/cbt/session/:token/violation
Lapor pelanggaran
GET
/api/cbt/session/:token/result
Hasil nilai


7. NON-FUNCTIONAL REQUIREMENTS
Kategori
Requirement
Performa
Halaman load < 2 detik; Auto-save jawaban setiap 10 detik; API response < 500ms
Keamanan
Semua endpoint terproteksi JWT (kecuali guest CBT); Rate limiting login & join; Sanitasi input (XSS/SQL Injection); HTTPS wajib di production
Keandalan
Auto-save server-side (tidak hilang jika browser crash); Graceful degradation jika koneksi terputus sesaat
Skalabilitas
DB indexing pada: exam_code/practice_code/quiz_code/test_code, nisn+session_id, created_by, session_token


8. TECH STACK
Layer
Teknologi
Frontend
Next.js 14+ (App Router) + TypeScript
Styling
Tailwind CSS + shadcn/ui
State Management
Zustand / React Query
Backend
Node.js + Express atau Next.js API Routes
Database
PostgreSQL / Supabase
ORM
Prisma
Auth
JWT (Access + Refresh Token) + bcrypt
File Storage
AWS S3 / Cloudflare R2 (gambar soal)
PDF Export
Puppeteer / @react-pdf/renderer
Deployment
Vercel (Frontend) + Railway/Supabase (DB)


9. MILESTONES & PRIORITAS
Phase 1 — MVP
Auth (Login/Logout Admin & Guru)
Manajemen User (Admin)
Bank Soal (CRUD)
Manajemen Ujian (CRUD + toggle aktif + link)
CBT Interface untuk Siswa (akses via link + token)
Anti-cheat dasar (tab switching detection)
Hasil nilai otomatis (pilihan ganda)
Phase 2 — Core Complete
Manajemen Latihan (tanpa anti-cheat, dengan pembahasan langsung)
Manajemen Kuis (anti-cheat ringan, hasil langsung)
Manajemen Ulangan (dengan kategori & KKM)
Manajemen Nilai (tampilan detail + export Excel)
Soal Essay + Penilaian Manual Guru
Anti-cheat lanjutan (fullscreen, disable copy, watermark)
Kisi-Kisi (CRUD + export PDF)
Kartu Soal (CRUD + export PDF)
Dashboard & Statistik
Phase 3 — Enhancement
Import soal dari Excel / Word
Notifikasi email (hasil ujian, reset password)
QR Code untuk semua jenis link assessment
Laporan analitik lanjutan (per tipe assessment)
Dark mode
10. KEPUTUSAN DESAIN
#
Pertanyaan
Keputusan Final
1
Apakah siswa boleh mengerjakan ulang?
Tidak secara default untuk Ujian/Ulangan/Kuis. Guru dapat me-reset sesi. Latihan bisa dikerjakan berulang tanpa batas.
2
Nilai auto-submit karena pelanggaran?
Ya — dihitung dari jawaban yang sudah terjawab saat pelanggaran ke-3 (Ujian & Ulangan). Kuis: hanya peringatan, tidak auto-submit.
3
Apakah Guru bisa melihat soal milik Guru lain?
Tidak. Hanya Admin yang bisa melihat semua soal global.
4
Format nilai?
DECIMAL(5,2), contoh: 87.50
5
Notifikasi real-time pelanggaran?
Tidak. Guru melihat log pelanggaran di halaman detail nilai setelah ujian.
6
Register Guru oleh Admin saja atau self-register?
Keduanya — Admin via panel manajemen, Guru mandiri via /register
7
Apakah Latihan memiliki anti-cheat?
Tidak. Latihan adalah mode belajar mandiri tanpa tekanan. Anti-cheat diaktifkan hanya untuk Ujian, Ulangan, dan Kuis (level ringan).
8
Apakah Kuis bisa tanpa token?
Tidak — token tetap diperlukan untuk semua assessment kecuali Latihan yang diset publik oleh guru.
9
Bagaimana relasi bank soal dengan 4 tipe assessment?
Satu soal bisa digunakan di banyak assessment via tabel pivot masing-masing (exam_questions, practice_questions, quiz_questions, daily_test_questions).




PRD v1.4.0 — Finalized | April 2026
Perubahan v1.4.0: Penambahan tabel practice_sets (Latihan), quizzes (Kuis), dan daily_tests (Ulangan) beserta tabel pivot soal dan sesi masing-masing. Semua tabel baru berelasi dengan subjects via subject_id FK. Anti-cheat level disesuaikan per tipe assessment.
