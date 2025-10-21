from ultralytics import YOLO
import cv2

model = YOLO("best.pt")
img = cv2.imread(r"C:\Users\jeetg\OneDrive\Documents\TestModel\image.png")

results = model.predict(img, conf=0.4, save=False, show=False)
r = results[0]

boxes = r.boxes.xyxy.cpu().numpy()
classes = r.boxes.cls.cpu().numpy()

def blur_area(frame, x1, y1, x2, y2, ksize=(51,51)):
    roi = frame[y1:y2, x1:x2]
    if roi.size > 0:
        frame[y1:y2, x1:x2] = cv2.GaussianBlur(roi, ksize, 0)

for box, cls in zip(boxes, classes):
    x1, y1, x2, y2 = map(int, box)
    # Blur class 0 (your plate)
    if int(cls) == 0:
        blur_area(img, x1, y1, x2, y2)

cv2.imwrite(r"C:\Users\jeetg\OneDrive\Documents\TestModel\blurred_image.png", img)
print("✅ Plate blurred!")
