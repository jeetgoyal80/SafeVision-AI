from ultralytics import YOLO
import cv2
import time

# -------- CONFIG --------
ROAD_MODEL_PATH = r"C:\Users\jeetg\OneDrive\Documents\TestModel\road_hazard.pt"   # Road hazard model
PLATE_MODEL_PATH = r"C:\Users\jeetg\OneDrive\Documents\TestModel\best.pt"         # Plate detection model
SOURCE_PATH = r"C:\Users\jeetg\OneDrive\Documents\TestModel\image copy 4.png"  # Image or video
OUTPUT_PATH_IMAGE = r"C:\Users\jeetg\OneDrive\Documents\TestModel\output_detected.png"
OUTPUT_PATH_VIDEO = r"C:\Users\jeetg\OneDrive\Documents\TestModel\output_detected_video.mp4"

CONF_THRESHOLD = 0.4
FACE_BLUR = True
PLATE_BLUR = True
PLATE_CLASS_INDEX = 0  # Plate class index in best.pt

# -------- LOAD MODELS --------
print("🔄 Loading YOLO models...")
road_model = YOLO(ROAD_MODEL_PATH)
plate_model = YOLO(PLATE_MODEL_PATH)
print("✅ Models loaded successfully!")

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# -------- HELPER FUNCTIONS --------
def blur_area(frame, x1, y1, x2, y2, ksize=(45, 45)):
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(frame.shape[1]-1, x2), min(frame.shape[0]-1, y2)
    roi = frame[y1:y2, x1:x2]
    if roi.size > 0:
        frame[y1:y2, x1:x2] = cv2.GaussianBlur(roi, ksize, 0)

def blur_faces_and_plates(frame):
    # --- Blur faces ---
    if FACE_BLUR:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        for (x, y, w, h) in faces:
            blur_area(frame, x, y, x+w, y+h)

    # --- Blur plates ---
    if PLATE_BLUR:
        results = plate_model.predict(frame, conf=0.4, verbose=False)[0]
        boxes = results.boxes.xyxy.cpu().numpy()
        classes = results.boxes.cls.cpu().numpy()
        for box, cls in zip(boxes, classes):
            if int(cls) == PLATE_CLASS_INDEX:
                x1, y1, x2, y2 = map(int, box)
                blur_area(frame, x1, y1, x2, y2)

    return frame

# -------- DETECT IMAGE OR VIDEO --------
is_video = SOURCE_PATH.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))

if not is_video:
    frame = cv2.imread(SOURCE_PATH)
    if frame is None:
        raise RuntimeError(f"❌ Could not read image: {SOURCE_PATH}")

    print("🚗 Running detection on image...")
    start_time = time.time()

    # Blur faces and plates
    frame = blur_faces_and_plates(frame)

    # Detect road hazards
    results = road_model.predict(frame, conf=CONF_THRESHOLD, verbose=False)[0]
    boxes = results.boxes.xyxy.cpu().numpy()
    classes = results.boxes.cls.cpu().numpy()
    names = results.names

    counts = {}
    for cls in classes:
        label = names[int(cls)]
        counts[label] = counts.get(label, 0) + 1

    # Draw hazard boxes
    for box, cls in zip(boxes, classes):
        x1, y1, x2, y2 = map(int, box)
        label = names[int(cls)]
        color = (0, 255, 0)
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        cv2.putText(frame, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    # Display counts
    y_offset = 30
    for label, count in counts.items():
        cv2.putText(frame, f"{label}: {count}", (20, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        y_offset += 30

    cv2.imwrite(OUTPUT_PATH_IMAGE, frame)
    cv2.namedWindow("🚧 Road Hazard Detection", cv2.WINDOW_NORMAL)
    cv2.imshow("🚧 Road Hazard Detection", frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    print(f"📊 Counts: {counts}")
    print(f"✅ Completed in {time.time() - start_time:.2f} seconds.")

else:
    cap = cv2.VideoCapture(SOURCE_PATH)
    if not cap.isOpened():
        raise RuntimeError(f"❌ Could not open video: {SOURCE_PATH}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(OUTPUT_PATH_VIDEO, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

    print("🎥 Running detection on video...")
    total_counts = {}

    cv2.namedWindow("🚧 Road Hazard Detection", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("🚧 Road Hazard Detection", width, height)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("✅ Video processing completed.")
            break

        start = time.time()

        # Blur faces and plates
        frame = blur_faces_and_plates(frame)

        # Detect road hazards
        results = road_model.predict(frame, conf=CONF_THRESHOLD, verbose=False)[0]
        boxes = results.boxes.xyxy.cpu().numpy()
        classes = results.boxes.cls.cpu().numpy()
        names = results.names

        frame_counts = {}
        for cls in classes:
            label = names[int(cls)]
            frame_counts[label] = frame_counts.get(label, 0) + 1
            total_counts[label] = total_counts.get(label, 0) + 1

        # Draw hazard boxes
        for box, cls in zip(boxes, classes):
            x1, y1, x2, y2 = map(int, box)
            label = names[int(cls)]
            color = (0, 255, 0)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        # Display hazard counts
        y_offset = 30
        for label, count in frame_counts.items():
            cv2.putText(frame, f"{label}: {count}", (20, y_offset),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            y_offset += 25

        out.write(frame)
        cv2.imshow("🚧 Road Hazard Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("🛑 Stopped by user.")
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()
    print("📊 Total hazards detected:", total_counts)
