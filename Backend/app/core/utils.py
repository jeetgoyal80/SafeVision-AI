import cv2
import random

def blur_area(frame, x1, y1, x2, y2, ksize=(51, 51)):
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(frame.shape[1]-1, x2), min(frame.shape[0]-1, y2)
    roi = frame[y1:y2, x1:x2]
    if roi.size > 0:
        frame[y1:y2, x1:x2] = cv2.GaussianBlur(roi, ksize, 0)

def random_location():
    base_lat, base_lon = 12.9716, 77.5946  # Bengaluru
    return (
        base_lat + random.uniform(-0.0005, 0.0005),
        base_lon + random.uniform(-0.0005, 0.0005)
    )
