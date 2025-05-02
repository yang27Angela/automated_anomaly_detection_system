# Vibe Coding Prompts

This file documents all major prompts used to generate code during the development of the anomaly detection system. Each section includes the original prompt, the result, and a short reflection or adjustment if needed.

*Many minor adjustments were not included for brevity due to their complexity.*
---

## 🟦 1. Backend Setup

**Prompt:**
Create a Node.js Express backend with TypeScript that exposes a /upload endpoint for video file upload, saves frames every second, runs YOLO object detection on each frame, and responds with an array of anomaly candidates.

**Result:**
- Created a modular backend structure including server.ts, app.ts, uploadRoute.ts, uploadController.ts, frameExtractor.ts, and detectionService.ts.
- Implemented mock detection (no actual YOLO yet).

---

## 🧠 2. Frame Extraction

**Prompt:**
Write a Node.js function using fluent-ffmpeg to extract one frame per second from a video file and save them to a directory, returning the list of frame paths.

**Result:**
- Used @ffmpeg-installer/ffmpeg for portable FFmpeg usage.
- Frames saved to /frames directory and returned as relative URLs.
- Integrated with multer for upload + extraction on video submit.

---

## 🤖 3. Mock Object Detection

**Prompt:**
Implement a placeholder detectObjects() function in TypeScript that takes in a list of frame image paths and returns mock detection results with bounding box data and timestamps.

**Result:**
- Returns 2 mock objects (e.g., person, car) per frame.
- Used for downstream testing of anomaly alert generation and frontend rendering.

---

## 🔔 4. Generate Anomaly Alerts Based on Detection

**Prompt:**
For each detection result, generate an alert object including timestamp, alert_type, message, frame URL, and object details. Return an array of alerts from the /upload controller.

**Result:**
- Implemented in uploadController.ts.
- Alert list returned to frontend with sample values.

**Reflection:**
- Designed alert schema for flexible frontend rendering and filtering.
- Potential improvements outlined for enhancing alert data completeness.

---

## 📦 5. Frontend Setup & Integration

**Prompt:**
Implement a frontend page that supports video upload, displays alert results in a table, and allows searching and filtering based on detection type or message content.

**Result:**
- Implemented in MainPage.tsx using React + Vite + TypeScript + MUI.
- Features include video upload, alert table display, and search/filter functionality.

**Reflection:**
- Enhanced usability with search and filtering capabilities.
- Backend integration supports dynamic detection rule handling.

---

## 🤖 2. Frontend Frame Extraction & Detection (WASM)

**Prompt:**
Move frame extraction and YOLO object detection to frontend using ffmpeg.wasm and client-side detection. Backend should only store results.

**Result:**
- extractFramesFromVideo() implemented using @ffmpeg/ffmpeg WebAssembly.
- Frontend handles frame extraction, mock detection, and sends alerts to backend.

**Reflection:**
- Streamlined backend dependencies and improved scalability.
- Simplified deployment with client-side processing.

---

## 💾 4. Backend Alert Storage (Database)

**Prompt:**
Update /api/upload route to validate and store alerts in MySQL database. Implement with insertAlerts() helper and modular controller.

**Result:**
- Connected backend to MySQL (via mysql2).
- Implemented alert storage with schema and CRUD operations.

**Reflection:**
- Modular database handling enhances scalability and data integrity.
- Prepared for future enhancements like analytics and advanced querying.

---

## 🔄 6. Backend Alerts Handling (Update/Delete)

**Prompt:**
Implement alert update and delete functionality in the backend. The system should allow modification and removal of stored alerts from the database.

**Result:**
- Modified alertController.ts for PUT and DELETE operations.
- Implemented backend logic for alert updates and deletions.

**Reflection:**
- CRUD operations streamlined for alert management.
- Potential expansions for metadata and user interactions.

---

## 🖥️ 7. Display Alert Details in Frontend (History Page)

**Prompt:**
Implement a frontend page (HistoryPage) to display alerts from the database, allowing users to search, filter, and view alert details. Include timestamps and created_at fields for better context.

**Result:**
- Created HistoryPage.tsx for alerts display and management.
- Implemented search, filtering, and detailed alert view functionalities.

**Reflection:**
- Improved user experience with historical data visualization.
- Supports analytics and trend monitoring.

---

## 🔧 8. Adjust Frontend Alert Table Columns

**Prompt:**
Update AlertTable to show timestamp and created_at columns. Ensure that both the timestamp (video timestamp) and created_at (DB insert timestamp) are displayed in the table.

**Result:**
- Modified AlertTable.tsx to include timestamp and created_at fields.
- Enhanced data presentation and clarity in alert tables.

---

## 🔄 9. Frontend Search and Filter Improvements

**Prompt:**
Add support for filtering by both alertType and objects detected in the alerts (e.g., "person", "car"). Enhance the search functionality to support these features.

**Result:**
- Enhanced HistoryPage.tsx and AlertTable.tsx with object detection filters.
- Improved search functionality for detailed alert filtering.

**Reflection:**
- Improved granularity in alert review and management.
- Optimized for diverse and large datasets.

---

## 🔧 10. Backend Validation for Alerts

**Prompt:**
Add data validation to the backend to ensure that alerts are in the correct format before storing them in the database. This includes validating timestamp, alertType, and details.

**Result:**
- Implemented Joi schema validation in alertController.ts.
- Ensured data integrity and consistency in alert storage.

**Reflection:**
- Enhanced system robustness and reliability.
- Mitigates risks of storing malformed alert data.

---

## ⚙️ 11. Adjust Object Detection Logic

**Prompt:**
Modify the frontend's runYOLOOnFrames function to return only object and confidence fields for each detection, excluding the bounding box information.

**Result:**
- Updated runYOLOOnFrames for streamlined detection results.
- Improved frontend performance and data handling.

**Reflection:**
- Aligned detection results with alert schema requirements.
- Optimized network and memory usage.

---

## 🎛️ 12. Data Pagination and Sorting

**Prompt:**
Implement pagination for the alerts table on HistoryPage to manage large datasets. Add sorting functionality for timestamp and alertType.

**Result:**
- Added MUI’s TablePagination and TableSortLabel for HistoryPage.
- Implemented pagination and sorting for alert management.

**Reflection:**
- Enhanced scalability and usability with large datasets.
- Improved navigation and data exploration.

---

## 📝 13. User Interface Enhancements

**Prompt:**
Enhance the user interface by adding better styling, notifications, and clearer visual feedback for actions like uploading, filtering, and deleting alerts.

**Result:**
- Added Snackbar notifications, CircularProgress, and refined layout with MUI.
- Improved UX and feedback loop for user interactions.

**Reflection:**
- Enhanced user experience and interaction clarity.
- Streamlined user workflow and operation visibility.

---

