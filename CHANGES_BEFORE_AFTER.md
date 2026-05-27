# Jomoro Koffee - Changes Before and After

Tanggal: 2026-05-25

Dokumen ini menjelaskan perubahan minimum yang dilakukan agar project lebih sesuai dengan requirement, tanpa mengubah arsitektur besar atau melakukan refactor berlebihan.

## Audit Tambahan 2026-05-27

- Menambahkan `sql/db_auth.sql` agar SQL import mencakup tabel Auth Service (`users`), bukan hanya Product dan Transaction.
- Menyesuaikan validasi `price` Product menjadi `@IsInt()` + `@Min(1)` karena requirement Product Management menyebut price harus positive integer, sementara kolom database tetap `DOUBLE`.
- Menambahkan JWT guard pada endpoint internal reduce stock dan meneruskan token dari checkout Transaction Service.
- Menambahkan `ParseIntPipe` untuk route param `product_id` dan `id` pada Transaction Service.
- Verifikasi ulang: `npm.cmd run build` dan `npx.cmd prisma validate` berhasil untuk tiga service.

## Ringkasan

Tujuan perubahan:

- Membuat Product Service lebih sesuai requirement JWT, Swagger, validasi, dan Prisma schema.
- Membuat Transaction Service lebih sesuai requirement database schema dan inter-service checkout.
- Menambahkan file SQL siap paste/import untuk `db_auth`, `db_product`, dan `db_transaction`.
- Menambahkan `.env` lokal untuk Product Service dan Transaction Service.
- Menjalankan `npm install`, `npx prisma generate`, dan `npm run build` untuk verifikasi.

Catatan:

- Auth Service tidak diubah secara logic karena sudah paling sesuai requirement.
- File `.env` dibuat lokal, tetapi tidak akan ikut Git jika `.gitignore` tetap mengabaikan `.env`.
- File `package-lock.json` berubah karena `npm install` dijalankan setelah dependency ditambahkan.

## File Yang Ditambahkan

```text
product-service/src/auth/guards/roles.guard.ts
product-service/.env
transaction-service/.env
sql/db_auth.sql
sql/db_product.sql
sql/db_transaction.sql
CHANGES_BEFORE_AFTER.md
```

## File Yang Diubah

```text
product-service/package.json
product-service/package-lock.json
product-service/prisma/schema.prisma
product-service/src/main.ts
product-service/src/product/dto/createProduct.dto.ts
product-service/src/product/product.controller.ts
product-service/src/product/product.module.ts
product-service/src/product/product.service.ts

transaction-service/package.json
transaction-service/package-lock.json
transaction-service/prisma/schema.prisma
transaction-service/src/cart/cart.service.ts
transaction-service/src/orders/orders.service.ts
transaction-service/src/profiles/profiles.service.ts
```

## Product Service

### 1. Dependency Product Service

Sebelum:

```json
"dependencies": {
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/swagger": "^11.4.4",
  "@prisma/client": "^5.22.0",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.15.1",
  "passport-jwt": "^4.0.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

Sesudah:

```json
"dependencies": {
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/jwt": "^11.0.0",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/swagger": "^11.4.4",
  "@prisma/client": "^5.22.0",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.15.1",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1",
  "swagger-ui-express": "^5.0.1"
}
```

Alasan:

- Requirement meminta `@nestjs/jwt`, `passport`, dan `swagger-ui-express`.
- Product Service perlu verify JWT untuk endpoint admin.

### 2. Product Module

Sebelum:

```ts
@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, JwtStrategy],
})
export class ProductModule { }
```

Sesudah:

```ts
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({ secret: 'jomoro_secret_key' }),
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtStrategy],
})
export class ProductModule { }
```

Alasan:

- JWT strategy butuh Passport/JWT module agar guard admin berjalan konsisten.
- Secret dibuat sama dengan Auth Service: `jomoro_secret_key`.

### 3. Roles Guard

Sebelum:

```ts
if (req.user.role !== 'ADMIN') {
  throw new UnauthorizedException('Access denied. Admin only.');
}
```

Validasi role ditulis berulang di controller.

Sesudah:

```ts
@UseGuards(JwtAuthGuard, new RolesGuard('ADMIN'))
```

File baru:

```ts
export class RolesGuard implements CanActivate {
  constructor(private readonly requiredRole: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== this.requiredRole) {
      throw new ForbiddenException('Access denied: insufficient role');
    }

    return true;
  }
}
```

Alasan:

- Admin-only endpoint lebih jelas.
- Mengurangi pengulangan tanpa refactor besar.

### 4. Product Controller Swagger dan Validasi

Sebelum:

```ts
@Get('products')
getAllProducts() {
  return this.productService.findAllProducts();
}
```

Sesudah:

```ts
@Get('products')
@ApiOperation({ summary: 'Get all products' })
getAllProducts() {
  return this.productService.findAllProducts();
}
```

Perubahan serupa ditambahkan ke:

```text
GET /products
GET /products/:id
GET /categories
GET /categories/:categoryId/products
POST /admin/products
POST /admin/products/:id/update
POST /admin/products/:id/reduce
POST /admin/products/:id/delete
POST /internal/products/:id/reduce
```

Alasan:

- Requirement meminta endpoint terdokumentasi dengan Swagger `@ApiOperation`.

### 5. Regex Pada Nama Product

Sebelum:

```ts
if (data.name.trim().split(/\s+/).length < 3) {
  throw new BadRequestException('Product name must contain at least 3 words.');
}
```

Masalah:

- Menggunakan RegEx `\s+`.
- Requirement melarang RegEx untuk validasi.
- Logic validasi berada di controller.

Sesudah:

```ts
private countWords(value: string) {
    let count = 0;
    let insideWord = false;

    for (const character of value.trim()) {
        const isSeparator =
            character === ' ' ||
            character === '\t' ||
            character === '\n' ||
            character === '\r';

        if (isSeparator) {
            insideWord = false;
        } else if (!insideWord) {
            count += 1;
            insideWord = true;
        }
    }

    return count;
}
```

Alasan:

- Tidak menggunakan RegEx.
- Validasi dipindahkan ke service.

### 6. Validasi Category Product

Sebelum:

```ts
async createProduct(data: CreateProductDto) {
    await this.prisma.product.create({ data });
    return { message: 'Product created successfully' };
}
```

Masalah:

- `category_id` langsung dipakai.
- Tidak dicek apakah category ada.

Sesudah:

```ts
private async validateProductData(data: CreateProductDto) {
    if (this.countWords(data.name) < 3) {
        throw new BadRequestException('Product name must contain at least 3 words.');
    }

    const category = await this.prisma.category.findUnique({
        where: { id: data.category_id },
    });
    if (!category) {
        throw new BadRequestException('Category not found');
    }
}
```

Alasan:

- Requirement meminta `category_id` mereferensikan category yang ada di database.

### 7. Product DTO

Sebelum:

```ts
@ApiProperty()
@IsInt()
@Min(1)
price!: number;

@ApiProperty()
@IsInt()
category_id!: number;
```

Sesudah:

```ts
@ApiProperty()
@IsNumber()
@Min(1)
price!: number;

@ApiProperty()
@IsInt()
@Min(1)
category_id!: number;
```

Ditambahkan:

```ts
export class ReduceStockDto {
    @ApiProperty({ example: 3 })
    @IsInt()
    @Min(1)
    quantity!: number;
}
```

Alasan:

- Requirement menyebut `price` adalah `DOUBLE`, jadi lebih tepat `@IsNumber()`.
- `category_id` minimal 1.
- `quantity` reduce stock sekarang divalidasi lewat DTO.

### 8. Product Prisma Schema

Sebelum:

```prisma
price Float
```

Sesudah:

```prisma
price Float @db.Double
```

Alasan:

- Match SQL requirement `price DOUBLE`.

### 9. Product Validation Pipe

Sebelum:

```ts
app.useGlobalPipes(new ValidationPipe({ transform: true }));
```

Sesudah:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Alasan:

- Menolak property request body yang tidak ada di DTO.
- Lebih sesuai template requirement.

### 10. Internal Reduce Stock Endpoint

Ditambahkan:

```ts
@Post('internal/products/:id/reduce')
reduceStockInternal(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ReduceStockDto
) {
    return this.productService.reduceStock(id, data.quantity);
}
```

Alasan:

- Transaction Service checkout boleh dilakukan CUSTOMER.
- Endpoint admin reduce stock hanya boleh ADMIN.
- Jika Transaction Service meneruskan token CUSTOMER ke endpoint admin, checkout akan gagal.
- Endpoint internal menjaga perubahan tetap kecil tanpa mengubah role rule admin endpoint.

## Transaction Service

### 1. Dependency Transaction Service

Sebelum:

```json
"devDependencies": {
  "@prisma/client": "^6.19.3"
}
```

Sesudah:

```json
"dependencies": {
  "@prisma/client": "^6.19.3"
},
"devDependencies": {
  "@types/passport-jwt": "^4.0.1"
}
```

Alasan:

- Prisma Client dipakai runtime, jadi harus berada di `dependencies`.
- Type definition `passport-jwt` dibutuhkan untuk TypeScript.

### 2. Transaction Prisma Schema

Sebelum:

```prisma
model Cart {
  id         Int        @id @default(autoincrement())
  user_id    Int        @unique
  cart_items CartItem[]
  @@map("carts")
}

model OrderDetail {
  price Float
}
```

Sesudah:

```prisma
model Cart {
  id         Int        @id @default(autoincrement())
  user_id    Int
  cart_items CartItem[]
  @@map("carts")
}

model OrderDetail {
  price Float @db.Double
}
```

Alasan:

- Requirement table `carts` hanya menyebut `user_id INT`, bukan unique.
- Requirement table `order_details.price` adalah `DOUBLE`.

### 3. Cart Query

Sebelum:

```ts
const cart = await this.prisma.cart.findUnique({
  where: { user_id: userId },
  include: { cart_items: true },
});
```

Sesudah:

```ts
const cart = await this.prisma.cart.findFirst({
  where: { user_id: userId },
  include: { cart_items: true },
});
```

Alasan:

- Setelah `user_id` tidak unique, Prisma tidak boleh memakai `findUnique` berdasarkan `user_id`.

### 4. Product Service URL

Sebelum:

```ts
private productServiceUrl = process.env.PRODUCT_SERVICE_URL;
```

Sesudah:

```ts
private productServiceUrl =
  process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
```

Alasan:

- Jika `.env` belum terbaca, service tetap punya default URL.

### 5. Auth Service URL

Sebelum:

```ts
private authServiceUrl = process.env.AUTH_SERVICE_URL;
```

Sesudah:

```ts
private authServiceUrl =
  process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
```

Alasan:

- Fallback lokal untuk profile proxy.

### 6. Checkout Stock Validation

Sebelum:

```ts
const itemsWithPrice = await Promise.all(
  cart.cart_items.map(async (item) => {
    const product = await this.getProduct(item.product_id, token);
    return { product_id: item.product_id, quantity: item.quantity, price: product.price };
  }),
);
```

Sesudah:

```ts
const itemsWithPrice = await Promise.all(
  cart.cart_items.map(async (item) => {
    const product = await this.getProduct(item.product_id, token);
    if (item.quantity > product.stock) {
      throw new BadRequestException(
        `Quantity (${item.quantity}) exceeds stock (${product.stock})`,
      );
    }
    return { product_id: item.product_id, quantity: item.quantity, price: product.price };
  }),
);
```

Alasan:

- Checkout sekarang memastikan quantity cart tidak melebihi stok terbaru.

### 7. Checkout Reduce Stock

Sebelum:

```ts
for (const item of cart.cart_items) {
  await fetch(
    `${this.productServiceUrl}/admin/products/${item.product_id}/reduce`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ quantity: item.quantity }),
    },
  );
}
```

Masalah:

- Endpoint admin butuh role ADMIN.
- CUSTOMER checkout akan gagal jika token CUSTOMER dipakai.
- Response `fetch` tidak dicek, jadi cart bisa tetap dikosongkan walaupun reduce stock gagal.

Sesudah:

```ts
private async reduceProductStock(productId: number, quantity: number) {
  const res = await fetch(
    `${this.productServiceUrl}/internal/products/${productId}/reduce`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    },
  );

  if (!res.ok) {
    throw new BadRequestException(`Failed to reduce stock for product ${productId}`);
  }
}
```

Lalu dipakai:

```ts
for (const item of cart.cart_items) {
  await this.reduceProductStock(item.product_id, item.quantity);
}
```

Alasan:

- Checkout CUSTOMER tetap bisa reduce stock via Product Service.
- Response gagal sekarang dihentikan dengan exception.
- Cart hanya dibersihkan setelah loop reduce stock selesai.

## Environment File

### Product Service

Sebelum:

```text
Tidak ada product-service/.env
```

Sesudah:

```env
DATABASE_URL="mysql://root:@localhost:3306/db_product"
```

### Transaction Service

Sebelum:

```text
Tidak ada transaction-service/.env
```

Sesudah:

```env
DATABASE_URL="mysql://root:@localhost:3306/db_transaction"
PRODUCT_SERVICE_URL="http://localhost:3002"
AUTH_SERVICE_URL="http://localhost:3001"
```

Catatan:

- File `.env` diabaikan oleh `.gitignore`.
- Jika perlu disubmit, include manual atau buat `.env.example`.

## SQL File

### Auth Database

File:

```text
sql/db_auth.sql
```

Isi utama:

```sql
CREATE DATABASE IF NOT EXISTS db_auth;
USE db_auth;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(25) NOT NULL DEFAULT 'CUSTOMER'
);
```

### Product Database

File:

```text
sql/db_product.sql
```

Isi utama:

```sql
CREATE DATABASE IF NOT EXISTS db_product;
USE db_product;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price DOUBLE NOT NULL,
  stock INT NOT NULL,
  image_url VARCHAR(255) NULL,
  category_id INT NOT NULL,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Transaction Database

File:

```text
sql/db_transaction.sql
```

Isi utama:

```sql
CREATE DATABASE IF NOT EXISTS db_transaction;
USE db_transaction;

CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES carts(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  price DOUBLE NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_order_details_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## Verifikasi Yang Sudah Dilakukan

### Install Dependency

```bash
npm install
```

Dijalankan pada:

```text
auth-service
product-service
transaction-service
```

Hasil:

```text
Berhasil untuk ketiga service.
```

### Prisma Generate

```bash
npx prisma generate
```

Dijalankan pada:

```text
auth-service
product-service
transaction-service
```

Hasil:

```text
Berhasil untuk ketiga service.
```

### Build

```bash
npm run build
```

Dijalankan pada:

```text
auth-service
product-service
transaction-service
```

Hasil:

```text
Berhasil untuk ketiga service.
```

### Startup Check

Command:

```bash
npm run start
```

Dijalankan pada:

```text
auth-service
product-service
transaction-service
```

Hasil:

```text
Ketiga service berhasil sampai log "Nest application successfully started".
```

Catatan:

- Background start dari tool tidak dipakai karena port tidak terbuka stabil saat dijalankan tersembunyi.
- Untuk penggunaan normal, jalankan manual dari tiga terminal.

## Cara Menjalankan Setelah Perubahan

Terminal 1:

```bash
cd auth-service
npx prisma generate
npm run start:dev
```

Terminal 2:

```bash
cd product-service
npx prisma generate
npm run start:dev
```

Terminal 3:

```bash
cd transaction-service
npx prisma generate
npm run start:dev
```

Swagger:

```text
Auth:        http://localhost:3001/api
Product:     http://localhost:3002/api
Transaction: http://localhost:3003/api
```

## Catatan Testing Swagger

1. Register user di Auth Service.
2. Login dan copy `access_token`.
3. Klik `Authorize` di Swagger dan isi:

```text
Bearer <access_token>
```

4. Untuk admin endpoint Product Service, user perlu role `ADMIN`.
5. Karena register default membuat role `CUSTOMER`, ubah role manual di `db_auth.users` jika ingin test admin:

```sql
UPDATE db_auth.users
SET role = 'ADMIN'
WHERE email = 'john@example.com';
```

6. Login ulang setelah role diubah agar token baru berisi role `ADMIN`.

## Catatan Penting

- Category belum punya endpoint create. Category dibuat manual via MySQL/phpMyAdmin.
- Product create/update akan gagal jika `category_id` tidak ada.
- Checkout Transaction Service butuh Product Service aktif karena mengambil detail product dan reduce stock via HTTP.
- Auth Service harus aktif jika menggunakan endpoint profile dari Transaction Service.
