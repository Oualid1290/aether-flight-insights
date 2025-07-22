import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Plane,
  Activity
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  file: File;
  progress: number;
  status: "uploading" | "analyzing" | "reporting" | "completed" | "error";
  flightId?: string;
  confidence?: number;
  aircraftType?: string;
}

export default function UploadPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process
    newFiles.forEach((fileObj, index) => {
      const fileIndex = uploadedFiles.length + index;
      
      // Upload phase
      const uploadInterval = setInterval(() => {
        setUploadedFiles(prev => {
          const updated = [...prev];
          if (updated[fileIndex] && updated[fileIndex].progress < 30) {
            updated[fileIndex].progress += Math.random() * 10;
          }
          return updated;
        });
      }, 200);

      setTimeout(() => {
        clearInterval(uploadInterval);
        setUploadedFiles(prev => {
          const updated = [...prev];
          if (updated[fileIndex]) {
            updated[fileIndex].progress = 30;
            updated[fileIndex].status = "analyzing";
          }
          return updated;
        });

        // Analysis phase
        const analysisInterval = setInterval(() => {
          setUploadedFiles(prev => {
            const updated = [...prev];
            if (updated[fileIndex] && updated[fileIndex].progress < 70) {
              updated[fileIndex].progress += Math.random() * 15;
            }
            return updated;
          });
        }, 300);

        setTimeout(() => {
          clearInterval(analysisInterval);
          setUploadedFiles(prev => {
            const updated = [...prev];
            if (updated[fileIndex]) {
              updated[fileIndex].progress = 70;
              updated[fileIndex].status = "reporting";
            }
            return updated;
          });

          // Reporting phase
          setTimeout(() => {
            const flightId = `FL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
            setUploadedFiles(prev => {
              const updated = [...prev];
              if (updated[fileIndex]) {
                updated[fileIndex].progress = 100;
                updated[fileIndex].status = "completed";
                updated[fileIndex].flightId = flightId;
                updated[fileIndex].aircraftType = "Multirotor";
                updated[fileIndex].confidence = 94;
              }
              return updated;
            });

            toast({
              title: "Analysis Complete",
              description: `Flight data processed successfully. Redirecting to detailed analysis...`,
            });

            // Redirect after a short delay
            setTimeout(() => {
              navigate(`/flights/${flightId}`);
            }, 1500);
          }, 2000);
        }, 3000);
      }, 2000);
    });
  }, [uploadedFiles.length, toast, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/octet-stream': ['.ulog', '.bin'],
      'text/plain': ['.log'],
    },
    maxFiles: 5,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading": return <Upload className="h-4 w-4 animate-pulse" />;
      case "analyzing": return <Activity className="h-4 w-4 animate-pulse" />;
      case "reporting": return <FileText className="h-4 w-4 animate-pulse" />;
      case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploading": return "Uploading";
      case "analyzing": return "Analyzing";
      case "reporting": return "AI Reporting";
      case "completed": return "Completed";
      case "error": return "Error";
      default: return "Pending";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aviation-blue">Upload Flight Data</h1>
          <p className="text-muted-foreground">Upload your flight logs for AI-powered analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <Card className="aviation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-aviation-blue" />
              Flight Log Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${isDragActive 
                  ? "border-aviation-blue bg-aviation-blue/5 scale-105" 
                  : "border-border hover:border-aviation-blue hover:bg-muted/50"
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-16 w-16 mx-auto mb-4 text-aviation-blue" />
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive ? "Drop files here" : "Drag & drop flight logs"}
              </h3>
              <p className="text-muted-foreground mb-4">
                Supports CSV, ULOG, BIN files up to 50MB each
              </p>
              <Button variant="outline">Browse Files</Button>
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="font-medium text-sm">Supported Formats:</h4>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">.csv</Badge>
                <Badge variant="secondary">.ulog</Badge>
                <Badge variant="secondary">.bin</Badge>
                <Badge variant="secondary">.log</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Panel */}
        <Card className="aviation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-aviation-blue" />
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No files uploaded yet</p>
                <p className="text-sm">Files will appear here when uploaded</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {uploadedFiles.map((fileObj, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3 p-4 border rounded-lg aviation-card-variant"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          {getStatusIcon(fileObj.status)}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{fileObj.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={fileObj.status === "completed" ? "default" : "secondary"}
                          className="flex-shrink-0"
                        >
                          {getStatusText(fileObj.status)}
                        </Badge>
                      </div>
                      
                      <Progress value={fileObj.progress} className="h-2" />
                      
                      {fileObj.status === "completed" && fileObj.aircraftType && (
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-aviation-blue" />
                          <Badge variant="outline" className="text-aviation-blue border-aviation-blue">
                            {fileObj.aircraftType} — {fileObj.confidence}% Confidence
                          </Badge>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}