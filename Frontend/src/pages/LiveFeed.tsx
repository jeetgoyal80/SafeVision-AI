import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Video, Shield, ShieldOff, Pause, Upload, Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { DetectionCard } from "../components/DetectionCard";
import { mockDetections, generateRandomDetection } from "../lib/mockData";
import type { HazardDetection } from "../lib/mockData";
import { toast } from "sonner";

export default function LiveFeed() {
  const [detections, setDetections] = useState<HazardDetection[]>(mockDetections);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [latestDetection, setLatestDetection] = useState<HazardDetection | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulate hazard detections
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newDetection = generateRandomDetection();
      setDetections(prev => [newDetection, ...prev].slice(0, 10));
      setLatestDetection(newDetection);
      toast.info(`New ${newDetection.type} detected!`, {
        description: `Confidence: ${(newDetection.confidence * 100).toFixed(0)}%`,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Ensure video plays whenever source changes
  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, [videoSrc, useCamera]);

  // Start camera feed
  const startCamera = async () => {
    try {
      stopVideo(); // Stop uploaded video first

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setUseCamera(true);
      setIsLive(true);
      toast.success("Camera started successfully");
    } catch (err) {
      toast.error("Unable to access camera");
      console.error(err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUseCamera(false);
    setIsLive(false);
    if (videoRef.current) videoRef.current.srcObject = null;
    toast("Camera stopped");
  };

  // Upload video
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera(); // Stop camera
    if (videoRef.current) videoRef.current.srcObject = null;

    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setUseCamera(false);
    setIsLive(true);
    toast.success(`Loaded demo video: ${file.name}`);
  };

  // Stop uploaded video
  const stopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoRef.current.srcObject = null;
    }
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setVideoSrc(null);
    setIsLive(false);
  };

  return (
    <div className="min-h-screen p-6 text-cyan-400">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Live Detection Feed</h1>
        <p className="text-cyan-300">AI-powered real-time hazard detection</p>
      </motion.div>

      {latestDetection && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 glass rounded-xl border border-primary/50 pulse-glow"
        >
          <div className="flex items-center gap-3 text-cyan-400">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
            <span className="font-semibold">
              New Detection: {latestDetection.type} — {(latestDetection.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Section */}
        <div className="lg:col-span-2">
          <Card className="glass border-border">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap">
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Video className="h-5 w-5 text-cyan-400" /> Video Stream
                </CardTitle>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Privacy Switch */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="privacy-mode" className="text-sm text-cyan-400">
                      {privacyMode ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                    </Label>
                    <Switch id="privacy-mode" checked={privacyMode} onCheckedChange={setPrivacyMode} />
                  </div>

                  {/* Camera Buttons */}
                  {!useCamera ? (
                    <Button size="sm" onClick={startCamera} variant="default">
                      <Camera className="h-4 w-4 mr-1" /> Open Camera
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={stopCamera}>
                      <Pause className="h-4 w-4 mr-1" /> Stop Camera
                    </Button>
                  )}

                  {/* Upload Button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Upload Video
                  </Button>
                  <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleVideoUpload}
                  />

                  {/* Stop Video Button */}
                  {videoSrc && (
                    <Button size="sm" variant="destructive" onClick={stopVideo}>
                      <Pause className="h-4 w-4 mr-1" /> Stop Video
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                {(useCamera || videoSrc) && (
                  <video
                    ref={videoRef}
                    src={videoSrc || undefined}
                    autoPlay
                    muted
                    playsInline
                    loop={!useCamera}
                    className="w-full h-full object-cover"
                    style={{
                      filter: privacyMode ? "blur(4px) brightness(0.85)" : "brightness(0.9)",
                    }}
                  />
                )}

                {!useCamera && !videoSrc && (
                  <img
                    src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800"
                    alt="Road view"
                    className="w-full h-full object-cover"
                    style={{
                      filter: privacyMode ? "blur(8px) brightness(0.7)" : "brightness(0.7)",
                    }}
                  />
                )}

                {/* Camera Overlay */}
                {isLive && (
                  <div className="absolute top-1/3 left-1/4 w-32 h-20 border-2 border-primary rounded-lg z-10">
                    <div className="absolute -top-6 left-0 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                      Pothole 0.93
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-cyan-400">
                  <span>{useCamera ? "Live Camera Active" : videoSrc ? "Video Demo" : "Idle Mode"}</span>
                  <span>Model: YOLOv11n</span>
                  <span>FPS: 30</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-cyan-400">
                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-cyan-300">Mode</div>
                  <div className="text-sm font-semibold">
                    {useCamera ? "Live Camera" : videoSrc ? "Demo Video" : "Idle"}
                  </div>
                </div>
                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-cyan-300">Privacy</div>
                  <div className="text-sm font-semibold">{privacyMode ? "Enabled" : "Disabled"}</div>
                </div>
                <div className="p-3 glass rounded-lg">
                  <div className="text-xs text-cyan-300">Status</div>
                  <div className="text-sm font-semibold">{isLive ? "Running" : "Stopped"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Detections */}
        <div className="space-y-4">
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">Recent Detections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {detections.map((d, i) => (
                <DetectionCard key={d.id} detection={d} index={i} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
