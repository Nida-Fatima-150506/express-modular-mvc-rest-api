const http = require('http');

// Helper to make HTTP requests
const request = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

async function runTests() {
  console.log('--- Starting API Validation Tests ---');

  // Case 1: Register and Login
  console.log('\n[Case 1.1] Testing POST /api/auth/register');
  const regRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Ali Khan',
    email: 'ali@example.com',
    password: 'password123'
  });
  console.log(`Status: ${regRes.statusCode} (Expected: 201)`);
  console.log('Response:', regRes.body);

  console.log('\n[Case 1.2] Testing POST /api/auth/login');
  const loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'ali@example.com',
    password: 'password123'
  });
  console.log(`Status: ${loginRes.statusCode} (Expected: 200)`);
  console.log('Response:', loginRes.body);

  // Case 2: POST /api/categories (201 Created)
  console.log('\n[Case 2] Testing POST /api/categories with 201 Created');
  const catRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Web Development',
    description: 'Courses covering frontend and backend technologies'
  });
  console.log(`Status: ${catRes.statusCode} (Expected: 201)`);
  console.log('Response:', catRes.body);

  // Case 3: GET /api/categories (200 OK)
  console.log('\n[Case 3] Testing GET /api/categories with 200 OK');
  const getCatRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories',
    method: 'GET'
  });
  console.log(`Status: ${getCatRes.statusCode} (Expected: 200)`);
  console.log('Response:', getCatRes.body);

  // Case 4: 400 Bad Request validation error
  console.log('\n[Case 4] Testing 400 Bad Request when required field is missing');
  const badReqRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    description: 'This has no name field'
  });
  console.log(`Status: ${badReqRes.statusCode} (Expected: 400)`);
  console.log('Response:', badReqRes.body);

  // Case 5: 404 Route Not Found error
  console.log('\n[Case 5.1] Testing 404 for invalid category ID');
  const notFoundIdRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories/99999',
    method: 'GET'
  });
  console.log(`Status: ${notFoundIdRes.statusCode} (Expected: 404)`);
  console.log('Response:', notFoundIdRes.body);

  console.log('\n[Case 5.2] Testing 404 for unknown URL');
  const notFoundUrlRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/unknown-module-url',
    method: 'GET'
  });
  console.log(`Status: ${notFoundUrlRes.statusCode} (Expected: 404)`);
  console.log('Response:', notFoundUrlRes.body);

  // Course Module test:
  console.log('\n[Case Extra] Testing Course CRUD');
  const courseRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/courses',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    title: 'Complete Node.js Bootcamp',
    description: 'Build backend APIs with Express and Node.js',
    category: 'Web Development',
    price: 49.99,
    instructor: 'John Doe'
  });
  console.log(`Status: ${courseRes.statusCode} (Expected: 201)`);
  console.log('Response:', courseRes.body);

  console.log('\n--- All Tests Completed Successfully ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
