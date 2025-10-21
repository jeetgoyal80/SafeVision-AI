import cv2, time, json
from pathlib import Path
from .models import plate_model, hazard_model, face_detector
from .utils import blur_area, random_location

PROCESSED_DIR = Path("processed")
PROCESSED_DIR.mkdir(exist_ok=True)

def process_frame(frame, privacy_mode=True):
    height, width = frame.shape[:2]

    # Step 1: Privacy blur (faces + plates)
    if privacy_mode:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detector.process(rgb)
        if results.detections:
            for det in results.detections:
                box = det.location_data.relative_bounding_box
                x1 = int(box.xmin * width)
                y1 = int(box.ymin * height)
                x2 = int((box.xmin + box.width) * width)
                y2 = int((box.ymin + box.height) * height)
                blur_area(frame, x1, y1, x2, y2)

        plate_results = plate_model.predict(frame, conf=0.4, verbose=False)
        for box in plate_results[0].boxes.xyxy:
            x1, y1, x2, y2 = map(int, box)
            blur_area(frame, x1, y1, x2, y2)

    # Step 2: Road hazard detection
    detections_data = []
    results = hazard_model.predict(frame, conf=0.4, verbose=False)
    r = results[0]
    for box, cls, conf in zip(r.boxes.xyxy, r.boxes.cls, r.boxes.conf):
        x1, y1, x2, y2 = map(int, box)
        label = r.names[int(cls)]
        confidence = float(conf)

        lat, lon = random_location()
        detections_data.append({
            "frame": None,
            "class": label,
            "confidence": confidence,
            "bbox": [x1, y1, x2, y2],
            "lat": lat,
            "lon": lon,
            "timestamp": time.time()
        })

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame, f"{label} {confidence:.2f}", (x1, y1-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    return frame, detections_data
