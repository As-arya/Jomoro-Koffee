# Jomoro Koffee Backend

Backend API untuk Jomoro Koffee menggunakan arsitektur microservice dengan
NestJS, TypeScript, MySQL, Prisma, JWT Passport, Swagger, dan class-validator.

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

Copy contoh environment:

```powershell
copy auth-service\.env.example auth-service\.env
copy product-service\.env.example product-service\.env
copy transaction-service\.env.example transaction-service\.env
```

Import SQL ke MySQL:

```text
sql/db_auth.sql
sql/db_product.sql
sql/db_transaction.sql
```

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

## Test

Build:

```powershell
cd auth-service
npm.cmd run build

cd ../product-service
npm.cmd run build

cd ../transaction-service
npm.cmd run build
```

E2E smoke test:

```powershell
cd product-service
npm.cmd run test:e2e

cd ../transaction-service
npm.cmd run test:e2e
```

## Notes

- File `.env` tidak untuk di-commit. Gunakan `.env.example` sebagai template.
- Password disimpan plain text karena mengikuti requirement project.
- Category dibuat lewat SQL atau phpMyAdmin sebelum membuat product.
- Checkout Transaction Service membutuhkan Product Service aktif.
