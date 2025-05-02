import * as ort from 'onnxruntime-web';
import { preprocessImageBitmap } from './preprocess';

ort.env.wasm.wasmPaths = '/ort-web/';
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;

const labels = [
  "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck",
  "boat", "traffic light", "fire hydrant", "stop sign", "parking meter", "bench",
  "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
  "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
  "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove",
  "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
  "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange",
  "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
  "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse",
  "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink",
  "refrigerator", "book", "clock", "vase", "scissors", "teddy bear",
  "hair drier", "toothbrush"
];

export async function runYOLOOnFrames(frames: ImageBitmap[]) {
  console.log("[debug] Start YOLO inference on frames");
  const session = await ort.InferenceSession.create('/models/yolov5n.onnx');
  console.log("[debug] ONNX model loaded");

  const alerts = [];

  for (let i = 0; i < frames.length; i++) {
    console.log(`[debug] Processing frame ${i + 1}/${frames.length}`);
    const tensorData = await preprocessImageBitmap(frames[i]);
    const inputTensor = new ort.Tensor('float32', tensorData, [1, 3, 640, 640]);

    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = inputTensor;

    console.log("[debug] Running session...");
    const results = await session.run(feeds);

    const outputName = session.outputNames[0];
    const output = results[outputName].data as Float32Array;
    console.log(`[debug] Output tensor name: ${outputName}`);
    console.log("[debug] Output data length:", output.length);
    console.log("[debug] Output (first 10 floats):", output.slice(0, 10));

    let objects = parseYOLOOutput(output);
    console.log(`[debug] Detections for frame ${i}:`, objects);

    if (!Array.isArray(objects) || objects.length === 0) {
      console.warn("[warn] No detections found, using fallback");
      objects = [{ object: 'unknown', confidence: 0.0 }];
    }

    const canvas = document.createElement('canvas');
    canvas.width = frames[i].width;
    canvas.height = frames[i].height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(frames[i], 0, 0);
    const frame_url = canvas.toDataURL('image/png');

    const objectStrings = objects.map(obj => `${obj.object} (conf: ${obj.confidence})`);
    const message = `Detected: ${objectStrings.join(', ')}`;

    alerts.push({
      timestamp: `00:00:0${i}`,
      alertType: 'YOLO Detection',
      message,
      frame_url,
      details: objects.map(obj => ({
        object: obj.object,
        confidence: parseFloat(obj.confidence.toFixed(3))
      }))
    });
  }

  console.log("[debug] Finished all frames. Total alerts:", alerts.length);
  return alerts;
}

function parseYOLOOutput(output: Float32Array) {
  const detections = [];
  const numDetections = output.length / 85;

  for (let i = 0; i < numDetections; i++) {
    const offset = i * 85;
    const scores = output.slice(offset + 5, offset + 85);
    const maxScore = Math.max(...scores);
    const classId = scores.findIndex(s => s === maxScore);

    if (maxScore > 0.5) {
      const objectLabel = labels[classId] || 'Unknown Object';
      detections.push({ object: objectLabel, confidence: maxScore });
    }
  }

  console.log("[debug] Raw detections before filter:", detections);

  const filtered = detections.reduce((acc, detection) => {
    const existing = acc.find(d => d.object === detection.object);
    if (!existing || existing.confidence < detection.confidence) {
      if (existing) acc.splice(acc.indexOf(existing), 1);
      acc.push(detection);
    }
    return acc;
  }, []);

  console.log("[debug] Filtered detections:", filtered);
  return filtered;
}
