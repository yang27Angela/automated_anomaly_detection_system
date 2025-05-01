// src/services/__tests__/alertService.test.ts
import * as alertService from '../alertService';

describe('alertService', () => {
  it('should fetch alerts', async () => {
    const alerts = await alertService.getAllAlerts();
    expect(Array.isArray(alerts)).toBe(true);
  });

  it('should update alert', async () => {
    await expect(alertService.updateAlert("1", { message: 'Updated' })).resolves.not.toThrow();
  });

  it('should delete alert', async () => {
    await expect(alertService.deleteAlert("1")).resolves.not.toThrow();
  });
});
