const http = require('http');

const products = {
  1: { id: 1, name: 'Kopi Arabica', price: 45000, stock: 100 },
  2: { id: 2, name: 'Kopi Robusta', price: 35000, stock: 50 },
  3: { id: 3, name: 'Espresso Shot', price: 25000, stock: 0 },
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const match = req.url.match(/^\/products\/(\d+)$/);
  if (match && req.method === 'GET') {
    const product = products[match[1]];
    if (product) {
      res.writeHead(200);
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'Product not found' }));
    }
    return;
  }

  const reduceMatch = req.url.match(/^\/admin\/products\/(\d+)\/reduce$/);
  if (reduceMatch && req.method === 'POST') {
    const product = products[reduceMatch[1]];
    if (product) {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const { quantity } = JSON.parse(body || '{}');
        product.stock -= quantity;
        console.log(`Stock product ${reduceMatch[1]} dikurangi ${quantity}, sisa: ${product.stock}`);
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Stock reduced', remaining: product.stock }));
      });
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'Product not found' }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Route not found' }));
});

server.listen(3002, () => {
  console.log('Mock Product Service jalan di http://localhost:3002');
  console.log('Products tersedia: id 1, 2, 3 (id 3 stok = 0)');
});