import http from 'http';

async function testUnauth() {
  const routes = [
    '/print-contract/1234',
    '/print-invoice/1234',
    '/api/contracts/1234/export-docx',
    '/api/invoices/1234/export-docx',
    '/api/contracts/1234/export',
    '/api/invoices/1234/export',
    '/api/proposals/1234/export',
    '/api/storage/avatars/test.jpg'
  ];

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, { redirect: 'manual' });
      console.log(`Route: ${route}`);
      console.log(`Status: ${res.status}`);
      if (res.status === 307 || res.status === 308) {
        console.log(`Redirects to: ${res.headers.get('location')}`);
      }
      console.log('---');
    } catch (e) {
      console.log(`Route: ${route} - Error: ${e.message}`);
    }
  }
}

testUnauth();
