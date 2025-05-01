import { insertAlerts } from '../insertAlerts';

describe('insertAlerts', () => {
  it('should be a function', () => {
    expect(typeof insertAlerts).toBe('function');
  });

  it('should throw if input is not array', async () => {
    // @ts-expect-error
    await expect(insertAlerts({})).rejects.toThrow();
  });

  it('should accept an array of alerts', async () => {
    const alerts = [
      {
        timestamp: '2025-05-01T12:00:00Z',
        alertType: 'object',
        message: 'Detected person',
        frame_url: 'data:image/png;base64,...',
        details: [{ class: 'person', confidence: 0.95 }],
      },
    ];
    await expect(insertAlerts(alerts)).resolves.not.toThrow();
  });
});