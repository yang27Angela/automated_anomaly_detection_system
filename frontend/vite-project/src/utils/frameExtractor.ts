// src/utils/frameExtractor.ts

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export async function extractFramesFromVideo(file: File | null): Promise<ImageBitmap[]> {
  if (!file) return [];

  if (!ffmpeg._loaded) {
    await ffmpeg.load();
    ffmpeg._loaded = true;
  }

  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
  await ffmpeg.run('-i', 'input.mp4', '-vf', 'fps=1', 'frame-%03d.png');

  const bitmaps: ImageBitmap[] = [];
  let i = 1;

  while (true) {
    const name = `frame-${String(i).padStart(3, '0')}.png`;
    try {
      const data = ffmpeg.FS('readFile', name);
      const blob = new Blob([data.buffer], { type: 'image/png' });
      const bitmap = await createImageBitmap(blob);
      bitmaps.push(bitmap);
      i++;
    } catch {
      break;
    }
  }

  return bitmaps;
}
