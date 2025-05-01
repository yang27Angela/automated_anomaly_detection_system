import { preprocessImageBitmap } from '../preprocess';
import { describe, it, expect, vi, beforeAll } from 'vitest';

describe('preprocessImageBitmap', () => {
  beforeAll(() => {
    const mockCtx = {
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray([255, 0, 0, 255]),
        width: 1,
        height: 1,
      })),
    };
    const mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      width: 0,
      height: 0,
    };
    vi.stubGlobal('document', {
      createElement: vi.fn(() => mockCanvas),
    } as unknown as Document); // ✅ 替换 any
  });

  it('returns ImageData for mock input', () => {
    const mockBitmap = { width: 1, height: 1 } as ImageBitmap;
    const result = preprocessImageBitmap(mockBitmap);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('width');
    expect(result).toHaveProperty('height');
  });
});
