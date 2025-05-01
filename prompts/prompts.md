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
  - `alertRoutes.ts` for `/api/upload` routing
  - `alertController.ts` to handle alert persistence
  - `insertAlerts.ts` to store alerts in MySQL
- Removed FFmpeg and YOLO logic from backend.

**Reflection:**
- Moved video processing fully to frontend.
- Backend is now cleanly separated: only handles data validation and DB writes.

---

## 🤖 2. Frontend Frame Extraction & Detection (WASM)

**Prompt:**
> Move frame extraction and YOLO object detection to frontend using ffmpeg.wasm and client-side detection. Backend should only store results.

**Result:**
- `extractFramesFromVideo()` implemented in `frameExtractor.ts` using `@ffmpeg/ffmpeg` WebAssembly
- `generateAlertsFromFrames()` generates mock alerts from frames
- On upload:
  - User selects video file
  - Frontend extracts frames, runs mock detection, sends alert array to backend

**Reflection:**
- Eliminates server-side video file handling and dependencies
- Greatly simplifies backend deployment and improves performance/scalability

---

## 🔔 3. Generate Anomaly Alerts Based on Detection

**Prompt:**
> For each detection result, generate an alert object including timestamp, alert_type, message, frame URL, and object details. Return an array of alerts from the `/upload` controller.

**Result:**
- Implemented on frontend via `mockAlertGenerator.ts`
- Alerts sent as JSON array to `/api/upload`

```json
{
  "timestamp": "00:00:03",
  "alertType": "anomaly",
  "message": "Detected person, car",
  "frame": "blob:http://localhost/...",
  "details": [
    { "class": "person", "confidence": 0.89 },
    { "class": "car", "confidence": 0.91 }
  ]
}
```

**Reflection:**
- Modular structure supports easy transition to real YOLO WASM
- Frontend mock detection is sufficient for UI testing and flow validation

---

## 💾 4. Backend Alert Storage (Database)

**Prompt:**
> Update `/api/upload` route to validate and store alerts in MySQL database via AWS RDS. Implement with `insertAlerts()` helper and modular controller.

**Result:**
- Connected backend to MySQL (via `mysql2`)
- Created:
  - `db.ts`: DB connection pool
  - `insertAlerts.ts`: inserts all alerts in batch
  - `alertController.ts`: validates and stores alerts
  - `alertRoutes.ts`: defines `/api/upload` POST route
  - `app.ts` & `server.ts`: route registration and server startup
- Sample table schema:

```sql
CREATE TABLE alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp VARCHAR(20),
  alert_type VARCHAR(50),
  message TEXT,
  frame_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Reflection:**
- Database insert separated into reusable logic
- Easy to extend with pagination, filtering, or analytics

---

## 📦 5. Frontend Integration & Filtering

**Prompt:**
> Implement a frontend page that supports video upload, displays alert results in a table, and allows searching and filtering based on detection type or message content.

**Result:**
- Implemented in `MainPage.tsx` using React + Vite + TypeScript + MUI
- Users can:
  - Upload video
  - Extract frames client-side
  - Generate alerts
  - Send to backend for storage
  - Filter/search by `alertType`, `message`, `requirePerson`, `requireCar`

**Reflection:**
- Decoupled architecture makes each part testable
- System now fully supports end-to-end anomaly review

---

## 🔄 6. Backend Alerts Handling (Update/Delete)

**Prompt:**
> Implement alert update and delete functionality in the backend. The system should allow modification and removal of stored alerts from the database.

**Result:**
- Modified `alertController.ts` to handle:
  - `PUT /api/alerts/:id` for alert update
  - `DELETE /api/alerts/:id` for alert removal
- Database queries for:
  - `UPDATE` operation to modify alert details
  - `DELETE` operation to remove an alert by ID
- Adjusted `alertRoutes.ts` to map to corresponding routes

**Reflection:**
- CRUD operations are straightforward to implement
- Can be expanded to include additional fields for updates, like adding comments or classifications

---

## 🖥️ 7. Display Alert Details in Frontend (History Page)

**Prompt:**
> Implement a frontend page (`HistoryPage`) to display alerts from the database, allowing users to search, filter, and view alert details. Include timestamps and `created_at` fields for better context.

**Result:**
- `HistoryPage.tsx` created to:
  - Fetch alerts from `/api/alerts`
  - Display alerts in a table
  - Allow searching by `timestamp`, `alertType`, and `message`
  - Show alert details in a dialog upon selection
  - Add filtering options (e.g., "Require Person", "Require Car")
- Pagination and sorting functionality added

**Reflection:**
- Provides a useful UI for viewing historical data
- Helps monitor system performance and anomaly trends

---

## 🔧 8. Adjust Frontend Alert Table Columns

**Prompt:**
> Update `AlertTable` to show `timestamp` and `created_at` columns. Ensure that both the `timestamp` (video timestamp) and `created_at` (DB insert timestamp) are displayed in the table.

**Result:**
- Modified `AlertTable.tsx` to display both `timestamp` and `created_at` fields.
- Adjusted data rendering logic to show both time fields correctly formatted

## 🔄 9. Frontend Search and Filter Improvements

**Prompt:**  
Add support for filtering by both `alertType` and objects detected in the alerts (e.g., "person", "car"). Enhance the search functionality to support these features.

**Result:**  
- Modified `HistoryPage.tsx` and `AlertTable.tsx` to include:
  - Search bar for free text
  - Two checkboxes: “Require Person” and “Require Car”
- Updated filter logic to:
  - Filter by `alertType`
  - Match keywords in `details` (e.g., `"person"` or `"car"`)

**Reflection:**  
This improves user experience by supporting fine-grained control over alert review. Efficient for datasets with high volume of diverse detections.

---

## 🔧 10. Backend Validation for Alerts

**Prompt:**  
Add data validation to the backend to ensure that alerts are in the correct format before storing them in the database. This includes validating `timestamp`, `alertType`, and `details`.

**Result:**  
- Used `Joi` schema in `alertController.ts`:
  - Ensures `timestamp` is an ISO string
  - `alertType` matches enum (`"object"`, `"anomaly"`, etc.)
  - `details` is an array of `{ class: string, confidence: number }`

**Reflection:**  
Prevents storage of malformed alerts. Enhances system robustness and data consistency.

---

## ⚙️ 11. Adjust Object Detection Logic

**Prompt:**  
Modify the frontend's `runYOLOOnFrames` function to return only `object` and `confidence` fields for each detection, excluding the bounding box information.

**Result:**  
- Updated `runYOLOOnFrames` to return:  
  ```ts
  { class: string, confidence: number }[]
  ```
- Removed unused bounding box data.

**Reflection:**  
Streamlined detection result to suit alert schema. Reduced frontend memory usage and network load.

---

## 🎛️ 12. Data Pagination and Sorting

**Prompt:**  
Implement pagination for the alerts table on `HistoryPage` to manage large datasets. Add sorting functionality for `timestamp` and `alertType`.

**Result:**  
- Integrated MUI’s `TablePagination` and `TableSortLabel`
- Enabled:
  - Pagination (page size: 5/10/25)
  - Sorting by `timestamp` (descending default)
  - Sorting by `alertType`

**Reflection:**  
Scales well with large RDS datasets. Improves navigation and debugging efficiency.

---

## 📝 13. User Interface Enhancements

**Prompt:**  
Enhance the user interface by adding better styling, notifications, and clearer visual feedback for actions like uploading, filtering, and deleting alerts.

**Result:**  
- Added:
  - `Snackbar` for success/error feedback
  - `CircularProgress` on loading
  - Better layout with MUI Grid and Typography
- Refined alert modal design

**Reflection:**  
Improves UX and feedback loop. Clarifies app state during long-running operations.

---
