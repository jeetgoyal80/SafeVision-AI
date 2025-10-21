import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import type { HazardDetection } from "../lib/mockData";

interface HazardMapProps {
  detections: HazardDetection[];
  showLandmarks?: boolean;
  selectedType?: string; // New prop for filtering
}

export default function HazardMap({ detections, showLandmarks = true, selectedType = "all" }: HazardMapProps) {
  const [center] = useState<[number, number]>([12.9716, 77.5946]); // Bengaluru

  const iconMap: Record<string, string> = {
    "Pothole": "https://cdn-icons-png.flaticon.com/512/3176/3176299.png",
    "Speed Breaker": "https://cdn-icons-png.flaticon.com/512/252/252025.png",
    "Debris": "https://cdn-icons-png.flaticon.com/512/3125/3125713.png",
    "Stalled Vehicle": "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    "Crack": "https://cdn-icons-png.flaticon.com/512/201/201623.png",
    "Animal": "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    "default": "https://cdn-icons-png.flaticon.com/512/565/565547.png",
  };

  const makeIcon = (url: string) =>
    new L.Icon({
      iconUrl: url,
      iconSize: [32, 32],
      className: "drop-shadow-lg",
    });

  const landmarks = [
    { name: "Apollo Hospital", type: "Hospital", lat: 12.9712, lon: 77.5949 },
    { name: "Indiranagar Police", type: "Police Station", lat: 12.976, lon: 77.599 },
    { name: "HP Petrol Pump", type: "Petrol Pump", lat: 12.9685, lon: 77.591 },
  ];

  const tileStyle = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

  const getSeverityColor = (severity: number) => {
    if (severity > 0.7) return "#ff4d4f";
    if (severity > 0.4) return "#faad14";
    return "#52c41a";
  };

  // --- Filter hazards by selected type ---
  const displayedDetections = detections.filter(
    (d) => selectedType === "all" || d.type.toLowerCase() === selectedType.toLowerCase()
  );

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={14}
        style={{
          height: "75vh",
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <TileLayer attribution="Map data © OpenStreetMap" url={tileStyle} />

        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Detected Hazards">
            <LayerGroup>
              {displayedDetections.map((det) => (
                <Marker
                  key={det.id}
                  position={[det.lat, det.lon]}
                  icon={makeIcon(iconMap[det.type] || iconMap["default"])}
                >
                  <Popup className="text-sm">
                    <strong>{det.type}</strong>
                    <br />
                    Confidence: {(det.confidence * 100).toFixed(1)}%
                    <br />
                    Severity: {(det.severity * 100).toFixed(0)}%
                    <br />
                    Time: {new Date(det.timestamp).toLocaleString()}
                  </Popup>
                  <Tooltip direction="top" offset={[0, -10]}>
                    {det.type}
                  </Tooltip>
                  <CircleMarker
                    center={[det.lat, det.lon]}
                    radius={8}
                    pathOptions={{
                      color: getSeverityColor(det.severity),
                      fillOpacity: 0.5,
                      weight: 2,
                    }}
                  />
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {showLandmarks && (
            <LayersControl.Overlay checked name="Landmarks">
              <LayerGroup>
                {landmarks.map((lm, i) => (
                  <Marker
                    key={i}
                    position={[lm.lat, lm.lon]}
                    icon={new L.DivIcon({
                      className: "text-2xl drop-shadow",
                      html: `${
                        lm.type === "Hospital"
                          ? "🏥"
                          : lm.type === "Police Station"
                          ? "🚓"
                          : "⛽"
                      }`,
                    })}
                  >
                    <Tooltip direction="top">{lm.name}</Tooltip>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>

      <div className="absolute top-3 right-3 bg-black/70 text-white backdrop-blur-md rounded-xl p-3 shadow-lg z-[1000]">
        <h3 className="text-sm font-semibold mb-2">Severity Levels</h3>
        <ul className="text-xs space-y-1">
          <li>
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            Low
          </li>
          <li>
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
            Medium
          </li>
          <li>
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            High
          </li>
        </ul>
      </div>
    </div>
  );
}
