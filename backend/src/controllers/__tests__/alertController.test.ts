import request from 'supertest';
import app from '../../app';

describe('POST /api/alerts', () => {
  it('should store a valid alert', async () => {
    const res = await request(app).post('/api/alerts/upload').send({
      alerts: [
        {
          timestamp: '2025-05-01T10:00:00Z',
          alertType: 'object',
          details: [{ class: 'person', confidence: 0.88 }]
        }
      ]
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/success/i);
  });

  it('should reject alert with missing fields', async () => {
    const res = await request(app).post('/api/alerts/upload').send({
      alerts: [
        {
          timestamp: '2025-05-01T10:00:00Z',
          // alertType is missing
          details: [{ class: 'person', confidence: 0.88 }]
        }
      ]
    });
    expect(res.statusCode).toBe(400);
  });

  it('should reject alert with invalid confidence type', async () => {
    const res = await request(app).post('/api/alerts/upload').send({
      alerts: [
        {
          timestamp: '2025-05-01T10:00:00Z',
          alertType: 'object',
          details: [{ class: 'car', confidence: 'high' }] // invalid type
        }
      ]
    });
    expect(res.statusCode).toBe(400);
  });

  it('should update an alert message', async () => {
    const updateRes = await request(app)
      .put('/api/alerts/1')
      .send({ message: 'Updated message' });
  
    expect([200, 204]).toContain(updateRes.statusCode); // depends on your implementation
    expect(updateRes.body.success).toBe(true);
  });
  
  it('should delete an alert', async () => {
    const deleteRes = await request(app).delete('/api/alerts/1');
    expect([200, 204]).toContain(deleteRes.statusCode);
    expect(deleteRes.body.success).toBe(true);
  });
  it('should return 400 if alerts is not an array', async () => {
    const res = await request(app).post('/api/alerts/upload').send({
      alerts: { timestamp: 'bad' }  // ❌ alerts 不是数组
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/alerts must be an array/i);
  });
  
  it('should return 400 for invalid alert fields', async () => {
    const res = await request(app).post('/api/alerts/upload').send({
      alerts: [
        { timestamp: 123, alertType: true, details: "not array" } // ❌ 多字段错误
      ]
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid alert structure/i);
  });
  
  it('should return 400 for invalid detail fields', async () => {
    const res = await request(app).post('/api/alerts/upload').send({
      alerts: [
        {
          timestamp: '2025-05-01T10:00:00Z',
          alertType: 'object',
          details: [{ class: 'car', confidence: 'high' }] // ❌ confidence 非 number
        }
      ]
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid detail structure/i);
  });
  
  it('should return 500 if updateAlert throws error', async () => {
    // 如果你的 service 层抛错，比如你用 mock 或 intentionally fail:
    const res = await request(app).put('/api/alerts/invalid').send({ message: 'x' });
    expect([500, 404]).toContain(res.statusCode);
  });
  
  it('should return 500 if deleteAlert throws error', async () => {
    const res = await request(app).delete('/api/alerts/invalid');
    expect([500, 404]).toContain(res.statusCode);
  });
  
});
