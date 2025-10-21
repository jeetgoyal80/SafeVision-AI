import cv2, json, base64
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.processing import process_frame

router = APIRouter()

@router.websocket("/ws/video")
async def stream_video(websocket: WebSocket):
    await websocket.accept()
    print("🔗 WebSocket connection established")

    try:
        while True:
            # Receive frame from frontend (base64 encoded)
            data = await websocket.receive_text()
            msg = json.loads(data)
            frame_data = msg.get("frame")
            privacy = msg.get("privacy", True)

            # Decode image
            jpg_bytes = base64.b64decode(frame_data)
            np_arr = np.frombuffer(jpg_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            # Process frame
            processed, detections = process_frame(frame, privacy_mode=privacy)

            # Encode processed frame
            _, buffer = cv2.imencode(".jpg", processed)
            encoded_frame = base64.b64encode(buffer).decode("utf-8")

            # Send back to frontend
            await websocket.send_text(json.dumps({
                "frame": encoded_frame,
                "detections": detections
            }))

    except WebSocketDisconnect:
        print("❌ WebSocket disconnected")
