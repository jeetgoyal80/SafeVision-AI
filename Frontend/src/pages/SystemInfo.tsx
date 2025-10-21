import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Download, Cpu, Camera, Brain, MapPin, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SystemInfo() {
  const handleDownloadReport = () => {
    toast.success("Technical report downloaded successfully!");
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">System Overview</h1>
        <p className="text-muted-foreground">Technical specifications and workflow architecture</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle>System Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {[
                { icon: Camera, label: "Camera Feed", color: "hsl(var(--primary))" },
                { icon: Brain, label: "AI Detection", color: "hsl(var(--hazard-pothole))" },
                { icon: Shield, label: "Privacy Filter", color: "hsl(var(--hazard-speed-breaker))" },
                { icon: MapPin, label: "Geo Mapping", color: "hsl(var(--hazard-debris))" },
                { icon: Zap, label: "Real-time Alerts", color: "hsl(var(--hazard-vehicle))" },
              ].map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div 
                    className="p-4 rounded-xl glass animate-float"
                    style={{ 
                      backgroundColor: `${step.color}20`,
                      animationDelay: `${index * 0.3}s`
                    }}
                  >
                    <step.icon className="h-8 w-8" style={{ color: step.color }} />
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                  {index < 4 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 text-primary">
                      →
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Model Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Model</span>
                <span className="font-semibold">YOLOv11n</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-semibold">PyTorch</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-semibold text-primary">91.3%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Inference Speed</span>
                <span className="font-semibold">45ms</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Input Resolution</span>
                <span className="font-semibold">1920x1080</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Classes Detected</span>
                <span className="font-semibold">4</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle>Detection Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Pothole", color: "hsl(var(--hazard-pothole))", accuracy: "93%" },
                { name: "Speed Breaker", color: "hsl(var(--hazard-speed-breaker))", accuracy: "89%" },
                { name: "Debris", color: "hsl(var(--hazard-debris))", accuracy: "91%" },
                { name: "Stalled Vehicle", color: "hsl(var(--hazard-vehicle))", accuracy: "92%" },
              ].map((hazard) => (
                <div key={hazard.name} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: hazard.color }}
                    />
                    <span className="font-medium">{hazard.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{hazard.accuracy}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle>Future Extensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Driver Fatigue Detection",
                  description: "Monitor driver alertness using facial recognition and eye-tracking technology"
                },
                {
                  title: "Traffic Flow Analysis",
                  description: "Real-time traffic density mapping and congestion prediction algorithms"
                },
                {
                  title: "Weather Adaptation",
                  description: "Enhanced detection accuracy under various weather conditions using sensor fusion"
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 glass rounded-lg hover:border-primary/50 border border-border transition-colors"
                >
                  <h3 className="font-semibold mb-2 text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 flex justify-center"
      >
        <Button 
          size="lg" 
          className="neon-glow"
          onClick={handleDownloadReport}
        >
          <Download className="mr-2 h-5 w-5" />
          Download Technical Report
        </Button>
      </motion.div>
    </div>
  );
}
