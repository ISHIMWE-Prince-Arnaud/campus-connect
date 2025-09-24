const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const authRoutes = require('../routes/auth');
const healthRoutes = require('../routes/health');
const { jwtSecret } = require('../utils/config');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);

test('health endpoint works', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
});

test('login rejects without body', async () => {
  const res = await request(app).post('/api/auth/login').send({});
  expect(res.status).toBe(400);
});

test('token sign/verify works', () => {
  const token = jwt.sign({ id: 'abc' }, jwtSecret, { expiresIn: '1h' });
  const decoded = jwt.verify(token, jwtSecret);
  expect(decoded.id).toBe('abc');
});


