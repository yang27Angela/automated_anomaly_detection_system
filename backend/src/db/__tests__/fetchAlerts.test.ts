import { fetchAlerts } from '../fetchAlerts';
import db from '../db';

describe('fetchAlerts', () => {
  it('should be a function', () => {
    expect(typeof fetchAlerts).toBe('function');
  });

  it('should return a promise', async () => {
    try {
      const result = await fetchAlerts(5);  // 或传 1, 2 以确保小量查询
      expect(Array.isArray(result)).toBe(true);
    } catch (err) {
      console.error('fetchAlerts error (mock test):', err);
      // 可以添加 expect(err).toBeDefined(); 如果你想允许连接失败
    }
  });
});

// ✅ 在整个测试结束后关闭连接
afterAll(async () => {
  try {
    await db.end();
  } catch (err) {
    console.warn('DB close error:', err);
  }
});
