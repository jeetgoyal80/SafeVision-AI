import { motion } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";
import {  getHazardColor } from "../lib/mockData";
import type { HazardDetection } from "../lib/mockData";
import { Card, CardContent } from "./ui/card";

interface DetectionCardProps {
  detection: HazardDetection;
  index: number;
}

export function DetectionCard({ detection, index }: DetectionCardProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass border-border hover:border-primary/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg" 
              style={{ backgroundColor: `${getHazardColor(detection.type)}20` }}
            >
              <AlertCircle 
                className="h-5 w-5" 
                style={{ color: getHazardColor(detection.type) }}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 
                  className="font-semibold"
                  style={{ color: getHazardColor(detection.type) }}
                >
                  {detection.type}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {(detection.confidence * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTime(detection.timestamp)}
              </div>

              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${detection.confidence * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getHazardColor(detection.type) }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
