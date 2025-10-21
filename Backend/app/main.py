from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.websocket import router as ws_router

app = FastAPI(title="Real-Time Video Hazard Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws_router)
