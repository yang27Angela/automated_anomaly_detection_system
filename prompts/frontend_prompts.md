# Vibe Coding Prompts

This file documents all major prompts used to generate code during the development of the anomaly detection system. Each section includes the original prompt, the result, and a short reflection or adjustment if needed.

---

## 🟦 1. Backend Setup

**Prompt:**
> Create a Node.js Express backend with TypeScript that exposes a `/upload` endpoint for video file upload, saves frames every second, runs YOLO object detection on each frame, and responds with an array of anomaly candidates.

**Result:**
- Created a modular backend structure with:
  - `server.ts` for app startup
  - `app.ts` for middleware and route setup
  - `uploadRoute.ts` for API routing
  - `uploadController.ts` to handle video processing
  - `frameExtractor.ts` for frame extraction using ffmpeg
  - `detectionService.ts` for mock object detection
- Result included mock detection (no actual YOLO yet).

---

## 🧠 2. Frame Extraction

**Prompt:**
> Write a Node.js function using `fluent-ffmpeg` to extract one frame per second from a video file and save them to a directory, returning the list of frame paths.

**Result:**
- Used `@ffmpeg-installer/ffmpeg` to ensure portable FFmpeg usage.
- Frames saved to `/frames` directory and returned as relative URLs.
- Integrated with `multer` for upload + extraction on video submit.

---

## 🤖 3. Mock Object Detection

**Prompt:**
> Implement a placeholder `detectObjects()` function in TypeScript that takes in a list of frame image paths and returns mock detection results with bounding box data and timestamps.

**Result:**
- Returns 2 mock objects (e.g., person, car) per frame.
- Used for downstream testing of anomaly alert generation and frontend rendering.

---

## 🔔 4. Generate Anomaly Alerts Based on Detection

**Prompt:**
> For each detection result, generate an alert object including timestamp, alert_type, message, frame URL, and object details. Return an array of alerts from the `/upload` controller.

**Result:**
- Implemented in `uploadController.ts`.
- Alert list returned to frontend with sample values like:

```json
{
  "timestamp": 1714335000000,
  "alert_type": "anomaly",
  "message": "Detected person, car",
  "frame": "/frames/frame-001.png",
  "details": [
    { "class": "person", "confidence": 0.89 },
    { "class": "car", "confidence": 0.91 }
  ]
}
```

- The `alert_type` field is set to `"anomaly"` only if the mock detection satisfies user-defined rules (`requirePerson`, `requireCar`).
- Otherwise, the frame is skipped (no alert is returned).

**Reflection:**
- The alert schema design enables flexible frontend rendering and type-based filtering.
- Potential improvements include:
  - Adding `"normal"` / `"empty"` alert types for full-frame traceability.
  - Including bounding box coordinates for frontend visual overlays.
  - Persisting alert logs to a database for history & search.

---

## 📦 5. Frontend Integration & Filtering

**Prompt:**
> Implement a frontend page that supports video upload, displays alert results in a table, and allows searching and filtering based on detection type or message content.

**Result:**
- Implemented in `MainPage.tsx` using React + Vite + TypeScript + MUI.
- Users can:
  - Upload a video via file input.
  - Define detection rules using checkboxes.
  - Search alerts using a live search bar.
  - View alert thumbnails and detailed dialogs per frame.

**Reflection:**
- The search feature improves usability for reviewing large video segments.
- Detection rules are sent as form data (`requirePerson`, `requireCar`) and parsed in the backend.

