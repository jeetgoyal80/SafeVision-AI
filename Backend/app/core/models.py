from ultralytics import YOLO
import mediapipe as mp

# Load models once at startup
plate_model = YOLO("models/plate_detection.pt")
hazard_model = YOLO("models/road_hazard.pt")

# Mediapipe face detection for privacy blur
face_detector = mp.solutions.face_detection.FaceDetection(
    model_selection=0, min_detection_confidence=0.5
)
