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

## Services

| Service | Port | Description |
| --- | ---: | --- |
| Auth Service | 3001 | Register, login, JWT, dan profile user |
| Product Service | 3002 | Catalog, category, product CRUD, dan stock |
| Transaction Service | 3003 | Cart, orders, checkout, dan profile proxy |

## Requirements

- Node.js 22.x
- XAMPP MySQL 8.x
- npm

## Setup

Install dependency di tiap service:

```powershell
cd auth-service
npm install

cd ../product-service
npm install

cd ../transaction-service
npm install
```

Buat environment


Import SQL ke MySQL


Generate Prisma Client:

```powershell
cd auth-service
npx.cmd prisma generate

cd ../product-service
npx.cmd prisma generate

cd ../transaction-service
npx.cmd prisma generate
```

## Run

Buka tiga terminal terpisah:

```powershell
cd auth-service
npm.cmd run start:dev
```

```powershell
cd product-service
npm.cmd run start:dev
```

```powershell
cd transaction-service
npm.cmd run start:dev
```

Swagger:

```text
Auth:        http://localhost:3001/api
Product:     http://localhost:3002/api
Transaction: http://localhost:3003/api
```
