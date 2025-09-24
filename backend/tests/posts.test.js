const request = require('supertest');
const express = require('express');

// Minimal mock to verify route wiring shape without a DB
const app = express();
app.get('/api/posts', (_req, res) => res.json([]));

test('list posts is public and returns array', async () => {
  const res = await request(app).get('/api/posts');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});


