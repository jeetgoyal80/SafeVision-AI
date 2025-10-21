import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Download, PlusCircle } from "lucide-react";
import {
  mockDetections,
  generateRandomDetection,
} from "../lib/mockData";
import type { HazardDetection } from "../lib/mockData";
import HazardMap from "../components/HazardMap";

export default function MapView() {
  const [detections, setDetections] = useState<HazardDetection[]>(mockDetections);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [severityThreshold, setSeverityThreshold] = useState(0.2);

  // --- Hazard Types ---
  const hazardTypes = [
    "all",
    "Pothole",
    "Speed Breaker",
    "Debris",
    "Stalled Vehicle",
    "Crack",
    "Animal",
  ];

  // --- Real-time simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      const newDetection = generateRandomDetection();
      setDetections((prev) => [...prev, newDetection]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Filtered detections ---
  const now = Date.now();
  const filteredDetections = detections.filter((d) => {
    const matchesType =
      selectedType === "all" || d.type.toLowerCase() === selectedType.toLowerCase();
    const matchesSeverity = d.severity >= severityThreshold;

    let matchesTime = true;
    const age = now - d.timestamp;
    switch (timeFilter) {
      case "10min":
        matchesTime = age <= 10 * 60 * 1000;
        break;
      case "hour":
        matchesTime = age <= 60 * 60 * 1000;
        break;
      case "day":
        matchesTime = age <= 24 * 60 * 60 * 1000;
        break;
      default:
        matchesTime = true;
    }

    return matchesType && matchesSeverity && matchesTime;
  });

  // --- Export JSON ---
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(filteredDetections, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "road_hazard_data.json";
    a.click();
  };

  // --- Report Hazard Function ---
  const reportHazard = () => {
    const newDetection: HazardDetection = {
      ...generateRandomDetection(),
      // Override type to selectedType if not "all"
      type: selectedType !== "all" ? selectedType : "Pothole",
    };
    setDetections((prev) => [...prev, newDetection]);
  };

  return (
    <div className="min-h-screen p-6 bg-background">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Smart Road Hazard Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time detection and visualization of road hazards with severity & landmark overlays
        </p>
      </motion.div>

      {/* --- Hazard Type Filter Cards --- */}
      <div className="grid lg:grid-cols-6 gap-4 mb-6">
        {hazardTypes.map((type) => {
          const count =
            type === "all"
              ? detections.length
              : detections.filter(
                  (d) => d.type.toLowerCase() === type.toLowerCase()
                ).length;

          return (
            <Card
              key={type}
              className={`glass border-border cursor-pointer transition-all ${
                selectedType === type ? "border-primary neon-glow" : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedType(type)}
            >
              <CardContent className="p-3 text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  {type === "all" ? "All Hazards" : type}
                </div>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- Controls --- */}
      <div className="flex flex-wrap items-center gap-5 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm">Show Landmarks</span>
          <Switch checked={showLandmarks} onCheckedChange={setShowLandmarks} />
        </div>

        <div className="flex items-center gap-3 w-60">
          <span className="text-sm">Severity ≥</span>
          <Slider
            value={[severityThreshold]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={(v) => setSeverityThreshold(v[0])}
          />
          <span className="text-sm">{severityThreshold.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm">Time Range</span>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="10min">Last 10 Minutes</SelectItem>
              <SelectItem value="hour">Last Hour</SelectItem>
              <SelectItem value="day">Today</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={downloadJSON}>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>

        <Button variant="default" onClick={reportHazard}>
          <PlusCircle className="mr-2 h-4 w-4" /> Report Hazard
        </Button>
      </div>

      {/* --- Map Section --- */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle>Hazard Map View with Landmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <HazardMap detections={filteredDetections} showLandmarks={showLandmarks} />

          {/* --- Legend --- */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <Legend icon="🕳️" label="Pothole" />
            <Legend icon="⛰️" label="Speed Breaker" />
            <Legend icon="🪨" label="Debris" />
            <Legend icon="🚗" label="Stalled Vehicle" />
            <Legend icon="🐕" label="Animal" />
            <Legend icon="🏥" label="Hospital" />
            <Legend icon="⛽" label="Petrol Pump" />
            <Legend icon="🚓" label="Police Station" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Legend({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
