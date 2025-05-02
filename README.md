# Automated Anomaly Detection System

An automated anomaly detection system designed for processing and analyzing video data to identify and alert users to potential anomalies. The system integrates frontend and backend components to extract frames from uploaded videos, run object detection, and store and display anomaly alerts with full search and filter capabilities.



## Features

- **Video Upload & Processing**: Upload videos, extract frames at 1-second intervals, and perform object detection on each frame.
- **Anomaly Detection**: Detect objects in each frame (e.g., "person", "car") and flag anomalies based on user-defined rules.
- **Alert System**: Generate alerts with timestamps, object details, and frame URLs.
- **Frontend Interface**: Interactive UI to upload videos, define detection rules, and view generated alerts with search, filter, and pagination features.
- **Backend Storage**: Store alerts in a MySQL database for persistence and easy retrieval.
