// src/utils/preprocess.ts

/**
 * 将任意尺寸的 ImageBitmap 图像预处理为模型所需的 Float32Array。
 * 模型要求尺寸为 [1, 3, 512, 800]，即宽 800，高 512，通道 3。
 */

export function preprocessImageBitmap(bitmap: ImageBitmap): Float32Array {
    const TARGET_WIDTH = 800;
    const TARGET_HEIGHT = 512;
  
    // 创建 canvas 并强制 resize 图像到 800x512
    const canvas = document.createElement('canvas');
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context is null');
  
    // 拉伸图像至模型要求尺寸
    ctx.drawImage(bitmap, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
  
    // 获取图像数据（RGBA）
    const imageData = ctx.getImageData(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    const { data } = imageData;
  
    // 转为 Float32Array，忽略 alpha 通道，顺序为 RGBRGB...
    const floatArray = new Float32Array(TARGET_WIDTH * TARGET_HEIGHT * 3);
    for (let i = 0; i < TARGET_WIDTH * TARGET_HEIGHT; i++) {
      const offset = i * 4;
      floatArray[i * 3 + 0] = data[offset] / 255;     // R
      floatArray[i * 3 + 1] = data[offset + 1] / 255; // G
      floatArray[i * 3 + 2] = data[offset + 2] / 255; // B
    }
  
    return floatArray;
  }
  