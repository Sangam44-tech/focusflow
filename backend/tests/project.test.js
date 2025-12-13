// backend/tests/project.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Project API', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Register and login
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

    authToken = registerRes.body.data.accessToken;
    userId = registerRes.body.data.user.id;
  });

  describe('POST /api/projects', () => {
    it('should create a project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'My Project',
          description: 'Project description',
          priority: 'HIGH',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('My Project');
    });

    it('should not create project without auth', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          name: 'My Project',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/projects', () => {
    it('should get user projects', async () => {
      // Create a project
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'My Project' });

      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('My Project');
    });
  });
});