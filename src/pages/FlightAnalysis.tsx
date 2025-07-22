import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Plane,
  Activity,
  Battery,
  Thermometer,
  Gauge,
  MapPin,
  Download,
  BarChart3
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from "recharts";

interface UploadedFile {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  result?: FlightAnalysisResult;
}

interface FlightAnalysisResult {
  flightId: string;
  aircraftType: string;
  duration: string;
  distance: string;
  maxAltitude: number;
  maxSpeed: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  alerts: Array<{
    type: string;
    severity: "info" | "warning" | "critical";
    message: string;
  }>;
  telemetryData: Array<{
    time: string;
    altitude: number;
    speed: number;
    battery: number;
    temperature: number;
    vibration: number;
  }>;
}

// Mock analysis result
const mockAnalysisResult: FlightAnalysisResult = {
  flightId: "FL-2024-004",
  aircraftType: "DJI Mavic 3 (Auto-detected)",
  duration: "28 minutes",
  distance: "12.4 km",
  maxAltitude: 145,
  maxSpeed: 22.5,
  riskScore: 87,
  riskLevel: "low",
  alerts: [
    {
      type: "Battery",
      severity: "warning", 
      message: "Battery level dropped below 20% at 24:30"
    },
    {
      type: "Wind",
      severity: "info",
      message: "High wind conditions detected between 15:00-18:00"
    },
    {
      type: "Performance",
      severity: "info",
      message: "Optimal flight efficiency maintained throughout mission"
    }
  ],
  telemetryData: [
    { time: "00:00", altitude: 0, speed: 0, battery: 100, temperature: 22, vibration: 0.1 },
    { time: "02:00", altitude: 25, speed: 8, battery: 98, temperature: 24, vibration: 0.3 },
    { time: "04:00", altitude: 45, speed: 12, battery: 95, temperature: 26, vibration: 0.2 },
    { time: "06:00", altitude: 80, speed: 15, battery: 90, temperature: 28, vibration: 0.4 },
    { time: "08:00", altitude: 120, speed: 18, battery: 85, temperature: 30, vibration: 0.3 },
    { time: "10:00", altitude: 145, speed: 22, battery: 80, temperature: 32, vibration: 0.5 },
    { time: "12:00", altitude: 140, speed: 20, battery: 75, temperature: 34, vibration: 0.4 },
    { time: "14:00", altitude: 100, speed: 16, battery: 68, temperature: 35, vibration: 0.6 },
    { time: "16:00", altitude: 75, speed: 12, battery: 60, temperature: 36, vibration: 0.7 },
    { time: "18:00", altitude: 45, speed: 10, battery: 50, temperature: 34, vibration: 0.5 },
    { time: "20:00", altitude: 25, speed: 8, battery: 40, temperature: 30, vibration: 0.4 },
    { time: "22:00", altitude: 15, speed: 6, battery: 25, temperature: 26, vibration: 0.3 },
    { time: "24:00", altitude: 10, speed: 4, battery: 18, temperature: 24, vibration: 0.2 },
    { time: "26:00", altitude: 5, speed: 2, battery: 15, temperature: 22, vibration: 0.1 },
    { time: "28:00", altitude: 0, speed: 0, battery: 12, temperature: 21, vibration: 0.1 },
  ]
};

export default function FlightAnalysis() {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload and processing
    newFiles.forEach((fileObj, index) => {
      const fileIndex = uploadedFiles.length + index;
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => {
          const updated = [...prev];
          if (updated[fileIndex] && updated[fileIndex].progress < 100) {
            updated[fileIndex].progress += Math.random() * 30;
          }
          return updated;
        });
      }, 200);

      // Simulate completion
      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadedFiles(prev => {
          const updated = [...prev];
          if (updated[fileIndex]) {
            updated[fileIndex].progress = 100;
            updated[fileIndex].status = "processing";
          }
          return updated;
        });

        // Simulate analysis completion
        setTimeout(() => {
          setUploadedFiles(prev => {
            const updated = [...prev];
            if (updated[fileIndex]) {
              updated[fileIndex].status = "completed";
              updated[fileIndex].result = mockAnalysisResult;
            }
            return updated;
          });

          toast({
            title: "Analysis Complete",
            description: `Flight data for ${fileObj.file.name} has been processed successfully.`,
          });
        }, 2000);
      }, 3000);
    });
  }, [uploadedFiles.length, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.log', '.txt'],
    },
    maxFiles: 5,
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-risk-low";
      case "medium": return "text-risk-medium";
      case "high": return "text-risk-high";
      default: return "text-muted-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aviation-blue">Flight Data Analysis</h1>
          <p className="text-muted-foreground">Upload and analyze flight logs with AI-powered insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <Card className="aviation-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-aviation-blue" />
                Upload Flight Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive 
                    ? "border-aviation-blue bg-aviation-blue/5" 
                    : "border-border hover:border-aviation-blue hover:bg-muted/50"
                  }
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-aviation-blue" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? "Drop files here" : "Drag & drop flight logs"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports CSV, JSON, LOG files up to 50MB
                </p>
                <Button variant="outline">Browse Files</Button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium">Uploaded Files</h4>
                  <AnimatePresence>
                    {uploadedFiles.map((fileObj, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-colors
                          ${selectedFile === fileObj 
                            ? "border-aviation-blue bg-aviation-blue/5" 
                            : "border-border hover:border-aviation-blue/50"
                          }
                        `}
                        onClick={() => setSelectedFile(fileObj)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-aviation-blue flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="secondary"
                                className={
                                  fileObj.status === "completed" 
                                    ? "bg-success/10 text-success"
                                    : fileObj.status === "error"
                                    ? "bg-destructive/10 text-destructive" 
                                    : "bg-warning/10 text-warning"
                                }
                              >
                                {fileObj.status}
                              </Badge>
                              {fileObj.status !== "completed" && (
                                <Progress value={fileObj.progress} className="flex-1 h-2" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-2">
          {selectedFile?.result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Flight Summary */}
              <Card className="aviation-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-aviation-blue" />
                      Flight Summary
                    </span>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Aircraft</p>
                      <p className="font-medium">{selectedFile.result.aircraftType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{selectedFile.result.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{selectedFile.result.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className={`font-bold ${getRiskColor(selectedFile.result.riskLevel)}`}>
                        {selectedFile.result.riskScore}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Telemetry Charts */}
              <Card className="aviation-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-aviation-blue" />
                    Telemetry Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="altitude" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="altitude">Altitude</TabsTrigger>
                      <TabsTrigger value="speed">Speed</TabsTrigger>
                      <TabsTrigger value="battery">Battery</TabsTrigger>
                      <TabsTrigger value="vibration">Vibration</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="altitude" className="mt-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={selectedFile.result.telemetryData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="time" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="altitude" 
                            stroke="hsl(var(--aviation-blue))" 
                            fill="hsl(var(--aviation-blue))" 
                            fillOpacity={0.3} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="speed" className="mt-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={selectedFile.result.telemetryData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="time" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Line type="monotone" dataKey="speed" stroke="hsl(var(--telemetry))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="battery" className="mt-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={selectedFile.result.telemetryData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="time" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Area type="monotone" dataKey="battery" stroke="hsl(var(--risk-medium))" fill="hsl(var(--risk-medium))" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    
                    <TabsContent value="vibration" className="mt-4">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={selectedFile.result.telemetryData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="time" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip />
                          <Line type="monotone" dataKey="vibration" stroke="hsl(var(--risk-high))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Alerts */}
              <Card className="aviation-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-aviation-blue" />
                    Flight Alerts & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedFile.result.alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                      >
                        <div className="flex items-start gap-3">
                          {alert.severity === "critical" && <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                          {alert.severity === "warning" && <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                          {alert.severity === "info" && <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                          <div>
                            <p className="font-medium">{alert.type}</p>
                            <p className="text-sm mt-1">{alert.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="aviation-card">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <Activity className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Analysis Selected</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Upload flight data files and select one from the list to view detailed analysis results and AI-powered insights.
                </p>
                <Button variant="outline">
                  View Sample Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}