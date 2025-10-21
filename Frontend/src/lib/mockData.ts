export interface HazardDetection {
  id: number;
  type: "Pothole" | "Speed Breaker" | "Debris" | "Stalled Vehicle" | "Crack" | "Animal";
  lat: number;
  lon: number;
  confidence: number;
  severity: number;
  timestamp: number; // Unix timestamp in ms
  image_url?: string;
}

// --- Mock detections with varied timestamps ---
export const mockDetections: HazardDetection[] = [
  {
    id: 1,
    type: "Pothole",
    confidence: 0.93,
    severity: 0.8,
    lat: 12.9716,
    lon: 77.5946,
    timestamp: Date.now() - 5 * 60 * 1000, // 5 min ago
    image_url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400",
  },
  {
    id: 2,
    type: "Speed Breaker",
    confidence: 0.87,
    severity: 0.5,
    lat: 12.9720,
    lon: 77.5951,
    timestamp: Date.now() - 30 * 60 * 1000, // 30 min ago
    image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400",
  },
  {
    id: 3,
    type: "Debris",
    confidence: 0.91,
    severity: 0.4,
    lat: 12.9710,
    lon: 77.5940,
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
  },
  {
    id: 4,
    type: "Stalled Vehicle",
    confidence: 0.89,
    severity: 0.7,
    lat: 12.9725,
    lon: 77.5955,
    timestamp: Date.now() - 26 * 60 * 60 * 1000, // 26 hours ago
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
  },
  {
    id: 5,
    type: "Pothole",
    confidence: 0.95,
    severity: 0.9,
    lat: 12.9705,
    lon: 77.5935,
    timestamp: Date.now() - 10 * 60 * 1000, // 10 min ago
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
  },
];

export const getHazardColor = (type: HazardDetection["type"]) => {
  const colors: Record<HazardDetection["type"], string> = {
    "Pothole": "hsl(var(--hazard-pothole))",
    "Speed Breaker": "hsl(var(--hazard-speed-breaker))",
    "Debris": "hsl(var(--hazard-debris))",
    "Stalled Vehicle": "hsl(var(--hazard-vehicle))",
    "Crack": "hsl(var(--hazard-crack))",
    "Animal": "hsl(var(--hazard-animal))",
  };
  return colors[type];
};

let uniqueIdCounter = mockDetections.length + 1;

export const generateRandomDetection = (): HazardDetection => {
  const types: HazardDetection["type"][] = [
    "Pothole",
    "Speed Breaker",
    "Debris",
    "Stalled Vehicle",
    "Crack",
    "Animal",
  ];
  const type = types[Math.floor(Math.random() * types.length)];

  return {
    id: uniqueIdCounter++,
    type,
    confidence: 0.6 + Math.random() * 0.4,
    severity: Math.random(),
    lat: 12.97 + (Math.random() - 0.5) * 0.01,
    lon: 77.594 + (Math.random() - 0.5) * 0.01,
    timestamp: Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000), // random within last 24h
    image_url: mockDetections[Math.floor(Math.random() * mockDetections.length)].image_url,
  };
};
