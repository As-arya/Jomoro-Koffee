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

- Auth Service (port 3001) menangani registrasi, login, dan JWT
- Product Service (port 3002) menangani produk dan kategori
- Transaction Service (port 3003) menangani keranjang dan pesanan
