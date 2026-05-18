# Jomoro-Koffee
Jomoro Koffee_Backend API

Sistem backend untuk platform kopi Jomoro Koffee yang dibangun menggunakan
arsitektur microservice. Terdiri dari tiga service terpisah yang masing-masing
menangani autentikasi pengguna, manajemen produk, dan proses transaksi.

Tech Stack

- NestJS
- TypeScript
- MySQL (XAMPP)
- Prisma ORM
- JWT dan Passport
- Swagger API Documentation
- class-validator

Services

- Auth Service         : menangani registrasi, login, dan JWT
- Product Service      : menangani produk dan kategori
- Transaction Service  : menangani keranjang dan pesanan
