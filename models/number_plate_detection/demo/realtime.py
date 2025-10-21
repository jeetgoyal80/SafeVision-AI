from ultralytics import YOLO
import cv2
import time

# -------- CONFIG --------
MODEL_PATH = "best.pt"
VIDEO_PATH = r"C:\Users\jeetg\OneDrive\Documents\TestModel\demo_video.mp4"
PLATE_CLASS_INDEX = 0
FACE_BLUR = True

# -------- LOAD MODELS --------
model = YOLO(MODEL_PATH)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# -------- HELPER FUNCTION --------
def blur_area(frame, x1, y1, x2, y2, ksize=(51,51)):
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(frame.shape[1]-1, x2), min(frame.shape[0]-1, y2)
    roi = frame[y1:y2, x1:x2]
    if roi.size > 0:
        frame[y1:y2, x1:x2] = cv2.GaussianBlur(roi, ksize, 0)

# -------- VIDEO CAPTURE --------
cap = cv2.VideoCapture(VIDEO_PATH)
if not cap.isOpened():
    raise RuntimeError(f"❌ Could not open video: {VIDEO_PATH}")

# Read original FPS
fps = cap.get(cv2.CAP_PROP_FPS)
frame_duration = 1.0 / fps  # duration of each frame in seconds

frame_idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break

    start_time = time.time()  # start timer for this frame

    # --- Face blur ---
    if FACE_BLUR:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        for (x, y, w, h) in faces:
            blur_area(frame, x, y, x+w, y+h)

    # --- YOLO detection ---
    results = model.predict(frame, conf=0.4, verbose=False, save=False, show=False, save_txt=False)
    r = results[0]
    boxes = r.boxes.xyxy.cpu().numpy()
    classes = r.boxes.cls.cpu().numpy()
    names = r.names

    for box, cls in zip(boxes, classes):
        x1, y1, x2, y2 = map(int, box)
        if int(cls) == PLATE_CLASS_INDEX:
            blur_area(frame, x1, y1, x2, y2)
        else:
            color = (0, 255, 0)
            label = names[int(cls)]
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    # --- Display scaled video ---
    screen_width, screen_height = 1280, 720
    frame_aspect = frame.shape[1] / frame.shape[0]
    screen_aspect = screen_width / screen_height
    if frame_aspect > screen_aspect:
        new_w = screen_width
        new_h = int(screen_width / frame_aspect)
    else:
        new_h = screen_height
        new_w = int(screen_height * frame_aspect)
    resized_frame = cv2.resize(frame, (new_w, new_h))

    cv2.imshow("Real-Time Plate & Face Blur", resized_frame)

    # --- Wait to match original video FPS ---
    elapsed = time.time() - start_time
    wait_ms = max(int((frame_duration - elapsed) * 1000), 1)
    if cv2.waitKey(wait_ms) & 0xFF == ord('q'):
        break

    frame_idx += 1

cap.release()
cv2.destroyAllWindows()
