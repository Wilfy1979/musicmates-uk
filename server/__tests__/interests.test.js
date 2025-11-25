const request = require('supertest');
const app = require('../app');
const db = require('../db/database');

describe('Interests API', () => {
  let testUsers = [];

  beforeAll(() => {
    // Database is already initialized in app.js
  });

  beforeEach(() => {
    const database = db.getDb();
    
    // Clear tables
    database.exec('DELETE FROM interests');
    database.exec('DELETE FROM users');
    
    // Create test users
    const insertUser = database.prepare('INSERT INTO users (email, name) VALUES (?, ?)');
    const user1 = insertUser.run('alice@test.com', 'Alice');
    const user2 = insertUser.run('bob@test.com', 'Bob');
    const user3 = insertUser.run('charlie@test.com', 'Charlie');
    
    testUsers = [
      { id: user1.lastInsertRowid, name: 'Alice' },
      { id: user2.lastInsertRowid, name: 'Bob' },
      { id: user3.lastInsertRowid, name: 'Charlie' }
    ];
  });

  afterAll(() => {
    db.close();
  });

  describe('Authentication', () => {
    test('should require authentication', async () => {
      const res = await request(app)
        .get('/api/interests/sent');
      
      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe('Authentication required');
    });

    test('should reject invalid user ID', async () => {
      const res = await request(app)
        .get('/api/interests/sent')
        .set('X-User-Id', 'invalid');
      
      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
    });
  });

  describe('POST /api/interests/:targetUserId', () => {
    test('should create a new interest', async () => {
      const res = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.interestId).toBeDefined();
    });

    test('should return existing interest on duplicate', async () => {
      // Create first interest
      const res1 = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res1.status).toBe(201);
      
      // Try to create duplicate
      const res2 = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res2.status).toBe(200);
      expect(res2.body.ok).toBe(true);
      expect(res2.body.duplicate).toBe(true);
      expect(res2.body.interestId).toBe(res1.body.interestId);
    });

    test('should prevent interest in self', async () => {
      const res = await request(app)
        .post(`/api/interests/${testUsers[0].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe('Cannot express interest in yourself');
    });

    test('should reject non-existent target user', async () => {
      const res = await request(app)
        .post('/api/interests/9999')
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe('Target user not found');
    });

    test('should reject invalid target user ID', async () => {
      const res = await request(app)
        .post('/api/interests/invalid')
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
    });
  });

  describe('GET /api/interests/sent', () => {
    test('should return interests sent by user', async () => {
      // Create interest
      await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const res = await request(app)
        .get('/api/interests/sent')
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.interests).toHaveLength(1);
      expect(res.body.interests[0].targetUserId).toBe(testUsers[1].id);
      expect(res.body.interests[0].targetUserName).toBe('Bob');
      expect(res.body.interests[0].status).toBe('pending');
    });

    test('should return empty array when no interests sent', async () => {
      const res = await request(app)
        .get('/api/interests/sent')
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.interests).toHaveLength(0);
    });
  });

  describe('GET /api/interests/received', () => {
    test('should return interests received by user', async () => {
      // Create interest from Alice to Bob
      await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const res = await request(app)
        .get('/api/interests/received')
        .set('X-User-Id', testUsers[1].id.toString());
      
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.interests).toHaveLength(1);
      expect(res.body.interests[0].senderUserId).toBe(testUsers[0].id);
      expect(res.body.interests[0].senderUserName).toBe('Alice');
      expect(res.body.interests[0].status).toBe('pending');
    });
  });

  describe('PATCH /api/interests/:interestId', () => {
    test('should allow target to accept interest', async () => {
      // Create interest
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const interestId = createRes.body.interestId;
      
      // Target accepts
      const res = await request(app)
        .patch(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[1].id.toString())
        .send({ status: 'accepted' });
      
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.status).toBe('accepted');
    });

    test('should allow target to decline interest', async () => {
      // Create interest
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const interestId = createRes.body.interestId;
      
      // Target declines
      const res = await request(app)
        .patch(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[1].id.toString())
        .send({ status: 'declined' });
      
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.status).toBe('declined');
    });

    test('should prevent sender from updating status', async () => {
      // Create interest
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const interestId = createRes.body.interestId;
      
      // Sender tries to update
      const res = await request(app)
        .patch(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[0].id.toString())
        .send({ status: 'accepted' });
      
      expect(res.status).toBe(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe('Only the target user can update the status');
    });

    test('should reject invalid status', async () => {
      // Create interest
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const interestId = createRes.body.interestId;
      
      const res = await request(app)
        .patch(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[1].id.toString())
        .send({ status: 'invalid' });
      
      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
    });

    test('should reject non-existent interest', async () => {
      const res = await request(app)
        .patch('/api/interests/9999')
        .set('X-User-Id', testUsers[0].id.toString())
        .send({ status: 'accepted' });
      
      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
    });
  });

  describe('DELETE /api/interests/:interestId', () => {
    test('should allow sender to withdraw pending interest', async () => {
      // Create interest
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const interestId = createRes.body.interestId;
      
      // Sender withdraws
      const res = await request(app)
        .delete(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.deleted).toBe(true);
      
      // Verify interest is gone
      const sentRes = await request(app)
        .get('/api/interests/sent')
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(sentRes.body.interests).toHaveLength(0);
    });

    test('should prevent target from withdrawing', async () => {
      // Create interest
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const interestId = createRes.body.interestId;
      
      // Target tries to withdraw
      const res = await request(app)
        .delete(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[1].id.toString());
      
      expect(res.status).toBe(403);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe('Only the sender can withdraw an interest');
    });

    test('should prevent withdrawing accepted interest', async () => {
      // Create interest
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      const interestId = createRes.body.interestId;
      
      // Target accepts
      await request(app)
        .patch(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[1].id.toString())
        .send({ status: 'accepted' });
      
      // Sender tries to withdraw
      const res = await request(app)
        .delete(`/api/interests/${interestId}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error).toBe('Can only withdraw pending interests');
    });

    test('should reject non-existent interest', async () => {
      const res = await request(app)
        .delete('/api/interests/9999')
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
    });
  });

  describe('Interest appears in both sent and received lists', () => {
    test('created interest should appear in sender sent and target received', async () => {
      // Create interest from Alice to Bob
      const createRes = await request(app)
        .post(`/api/interests/${testUsers[1].id}`)
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(createRes.status).toBe(201);
      const interestId = createRes.body.interestId;
      
      // Check Alice's sent interests
      const sentRes = await request(app)
        .get('/api/interests/sent')
        .set('X-User-Id', testUsers[0].id.toString());
      
      expect(sentRes.body.interests).toHaveLength(1);
      expect(sentRes.body.interests[0].id).toBe(interestId);
      
      // Check Bob's received interests
      const receivedRes = await request(app)
        .get('/api/interests/received')
        .set('X-User-Id', testUsers[1].id.toString());
      
      expect(receivedRes.body.interests).toHaveLength(1);
      expect(receivedRes.body.interests[0].id).toBe(interestId);
    });
  });
});
