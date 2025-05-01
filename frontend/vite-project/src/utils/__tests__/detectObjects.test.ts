import { detectObjects } from '../detectObjects';

describe('detectObjects', () => {
  it('returns mock object for valid input', async () => {
    const result = await detectObjects('data:image/png;base64,...');
    expect(Array.isArray(result)).toBe(true);
  });
});
