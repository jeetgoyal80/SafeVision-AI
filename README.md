# 🚗 SafeVision AI — Real-Time Road Hazard Detection & Driver Alert System  
*Built for i.Mobilothon 5.0 | Team DevSphere*

> **Transforming every dashcam or smartphone into an intelligent road-safety sensor.**  
> Using AI, geospatial analytics, and privacy-preserving design, SafeVision AI detects road hazards in real time, anonymizes video, and creates a self-healing live hazard map for safer mobility.

---

## 🧠 Problem Statement  

| Issue | Description |
|--------|-------------|
| **Unsafe Roads** | Indian roads expose drivers to unmarked speed breakers, potholes, debris, and stalled vehicles. |
| **Data Waste** | Although dashcams capture valuable data, it rarely becomes actionable intelligence. |
| **Objective** | Transform camera feeds into **actionable, verified hazard data** to prevent accidents. |

---

## 💡 Our Solution — *RoadSentry Engine*  

| Component | Description |
|------------|-------------|
| **AI Detection** | Detects potholes, speed breakers, and obstacles using YOLOv8. |
| **Privacy Layer** | Automatically blurs faces & license plates using OpenCV + MediaPipe. |
| **GeoTagging** | Adds latitude-longitude metadata for every hazard detected. |
| **Consensus Engine** | Filters false positives using DBSCAN clustering and cross-verification. |
| **Driver Alerts** | Sends instant hazard notifications to nearby users. |

---

## 🧩 Core Features

| Feature | Description |
|----------|-------------|
| 🚧 **Hazard Detection** | Real-time detection of potholes, bumps, debris. |
| 🔒 **Privacy Preservation** | On-device anonymization via face and plate blurring. |
| 🌍 **Geospatial Intelligence** | Automatic location tagging via GPS metadata. |
| ⚡ **Low Latency** | Optimized YOLOv8 models ensure <100ms per frame. |
| 🧭 **Crowdsourced Validation** | Duplicates filtered using DBSCAN clustering. |
| 🛰️ **Cloud Sync** | Centralized live hazard map for city-wide visibility. |

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **AI Models** | YOLOv8 (Hazard Detection), YOLOv8 (License Plate), MediaPipe (Face Detection) |
| **Backend** | FastAPI, Python, OpenCV, PostGIS, WebSockets |
| **Frontend** | React + Vite + TailwindCSS |
| **Deployment** | Docker, GitHub Actions (CI/CD), Google Colab for model training |
| **Data Pipeline** | Roboflow (dataset prep), DBSCAN (clustering), JSON REST API |

---

## 🏗️ System Architecture

| Step | Process |
|------|----------|
| 1️⃣ | Camera captures road footage. |
| 2️⃣ | YOLOv8 detects potholes, speed breakers, debris. |
| 3️⃣ | Faces & plates blurred locally (MediaPipe + OpenCV). |
| 4️⃣ | Data packaged with GPS + timestamp into JSON. |
| 5️⃣ | FastAPI backend validates & stores in PostGIS. |
| 6️⃣ | Live map shows verified hazards for nearby drivers. |

---

## 📂 Folder Structure

| Folder | Description |
|---------|-------------|
| `Backend/` | FastAPI backend, ML inference, database integration |
| `Frontend/` | React-based dashboard and driver alert interface |
| `models/` | YOLOv8-trained models (`road_hazard.pt`, `plate.pt`) |
| `Demo/` | Demo script and sample input/output visuals |
| `assets/` | Architecture diagram, screenshots, and videos |

---

## 🚀 Quick Start

| Step | Command |
|------|----------|
| **1️⃣ Clone Repository** | `git clone https://github.com/jeetgoyal80/SafeVision-AI.git` |
| **2️⃣ Install Backend Deps** | `pip install -r requirements.txt` |
| **3️⃣ Run Backend** | `uvicorn app.main:app --reload` |
| **4️⃣ Launch Frontend** | `cd Frontend && npm install && npm run dev` |
| **5️⃣ Test Demo** | `python Demo/demo.py` |

---

## 🧠 Model Training Reference

| Model | Dataset | Framework |
|--------|----------|-----------|
| **road_hazard.pt** | [Pothole & Speed Breaker Dataset (Roboflow)](https://universe.roboflow.com/cse400b/cse400_pothole-and-speed-breaker-dataset) | YOLOv8 |
| **plate_detection.pt** | [Indian License Plate Detection Dataset (Roboflow)](https://universe.roboflow.com/ml-sdznj/yolov8-number-plate-detection) | YOLOv8 |
| **face detection** | Google MediaPipe | Built-in |

**Training Platform:** Google Colab (Free GPU)  
**Optimization:** Trained models exported to `.pt` format for lightweight, real-time inference.

---

## 🔒 Privacy by Design

| Step | Security Measure |
|------|------------------|
| 1️⃣ | Detect faces & plates locally. |
| 2️⃣ | Apply Gaussian blur before upload. |
| 3️⃣ | Only anonymized frames transmitted. |
| 4️⃣ | No raw video or PII stored on server. |

---

## 📊 Key Innovations

| Innovation | Impact |
|-------------|--------|
| **Consensus-based Verification** | Ensures accuracy by cross-matching multiple reports. |
| **Self-Healing Maps** | Automatically removes outdated hazards. |
| **Zero-Tap Operation** | Fully automated — no manual input needed. |
| **Edge-first Design** | Reduces backend costs and latency. |

---

## 🖼️ Media Showcase

| Type | Description |
|------|--------------|
| 🧩 **Architecture Image** | *(Insert image path here → `./assets/architecture.png`)* |
| 🎥 **Demo Video** | *(Add your demo video link here → `https://youtu.be/<your_demo_video_id>`)* |

**Recommended Video Content:**
- 30–60 sec live demo with road hazard detection  
- Split-screen showing raw vs blurred video  
- Real-time alert display on frontend map  

---

## 💰 Implementation Cost Overview

| Stage | Cost | Description |
|--------|------|-------------|
| **Prototype** | ₹0 | Built using open-source tools |
| **Pilot (10k users)** | < ₹15,000/month | Free-tier cloud + microservices |
| **Scaling** | Cost-per-user ↓ | Efficient edge inference model |

---

## 🧾 References

| Paper / Source | Link |
|----------------|------|
| Enhanced YOLOv8 for Real-Time Pothole Detection | [arXiv](https://arxiv.org/abs/2505.04207) |
| Vision-Based Pothole Detection Review | [MDPI](https://www.mdpi.com/1424-8220/24/17/5652) |
| YOLO-Based License Plate Recognition | [MDPI](https://www.mdpi.com/1424-8220/22/23/9477) |
| MediaPipe Face Detection Docs | [Google Docs](https://mediapipe.readthedocs.io/en/latest/solutions/face_detection.html) |

---

## 👥 Team DevSphere

| Member | Role | Contribution |
|---------|------|--------------|
| **Jeet Goyal (Team Lead)** | ML & Backend Engineer | Developed core AI pipeline, handled training, backend, and integration |
| **Neelam Patidar** | Research & Presentation Lead | Prepared project documentation, research synthesis, and designed the final presentation for submission |


---

## 🏁 Status

| Milestone | Status |
|------------|--------|
| MVP Completed | ✅ |
| Backend + ML Integrated | ✅ |
| Frontend Dashboard | ✅ |
| Privacy Pipeline | ✅ |
| Deployment Ready | 🚀 |

---

## 🏷️ Badges
| Tech | Badge |
|------|--------|
| Python | ![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python) |
| FastAPI | ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-success?logo=fastapi) |
| YOLOv8 | ![YOLOv8](https://img.shields.io/badge/YOLOv8-Model-red?logo=github) |
| React | ![React](https://img.shields.io/badge/React-Frontend-blue?logo=react) |
| TailwindCSS | ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Design-06B6D4?logo=tailwindcss) |
| Google Colab | ![Colab](https://img.shields.io/badge/Colab-Training-orange?logo=googlecolab) |

---

## 🧭 Future Scope

| Feature | Description |
|----------|-------------|
| 🎧 Audio Alerts | Bluetooth or CarPlay integration for live hazard warnings |
| 🌧️ Weather Adaptive Models | Adjust detection under rain/fog conditions |
| 🏙️ Government API Integration | Sync with municipal dashboards for road repairs |
| 📱 Mobile Companion App | Allow user-side feedback & road status updates |

---

© 2025 **Team DevSphere** | Built for Volkswagen **i.Mobilothon 5.0**
