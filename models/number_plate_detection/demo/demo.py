# ---- Setup ----
from ultralytics import YOLO
import cv2, os, time
import numpy as np

# -------- CONFIG --------
MODEL_PATH = "best.pt"  # your trained YOLO model
VIDEO_IN = "demo_video.mp4"
OUTPUT_VIDEO = "outputs/annotated_local.mp4"
STEP = 1  # process every frame (can skip for speed)

os.makedirs("outputs", exist_ok=True)

# -------- LOAD MODELS --------
print("🔹 Loading YOLO model...")
model = YOLO(MODEL_PATH)

print("🔹 Loading face cascade...")
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# -------- VIDEO SETUP --------
cap = cv2.VideoCapture(VIDEO_IN)
fps = int(cap.get(cv2.CAP_PROP_FPS))
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
out = cv2.VideoWriter(OUTPUT_VIDEO, cv2.VideoWriter_fourcc(*'mp4v'), fps, (w, h))

frame_idx = 0

# -------- MAIN LOOP --------
while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # --- Face blur ---
    for (x, y, w2, h2) in face_cascade.detectMultiScale(gray, 1.1, 4):
        frame[y:y+h2, x:x+w2] = cv2.GaussianBlur(frame[y:y+h2, x:x+w2], (51, 51), 30)

    # --- Run YOLO detection on every Nth frame ---
    if frame_idx % STEP == 0:
        results = model.predict(source=frame, conf=0.4, verbose=False)

        for r in results:
            boxes = r.boxes.xyxy.cpu().numpy()
            confs = r.boxes.conf.cpu().numpy()
            classes = r.boxes.cls.cpu().numpy()
            names = r.names

            for box, conf, cls in zip(boxes, confs, classes):
                x1, y1, x2, y2 = map(int, box)
                label = names[int(cls)]

                # ---- Blur instantly if number plate ----
                if "plate" in label.lower():
                    frame[y1:y2, x1:x2] = cv2.GaussianBlur(frame[y1:y2, x1:x2], (51, 51), 30)
                    color = (255, 0, 0)
                else:
                    color = (0, 255, 0)
                    # Draw box for other detected hazards
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    out.write(frame)
    frame_idx += 1
    print(f"✅ Processed frame {frame_idx}")

cap.release()
out.release()
cv2.destroyAllWindows()

print("🎥 Finished! Video saved:", OUTPUT_VIDEO)
