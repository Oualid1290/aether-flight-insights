import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Activity, Battery, Thermometer, Gauge, Navigation, Zap, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { systemAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TelemetryPoint {
  timestamp: number;
  altitude: number;
  speed: number;
  battery: number;
  temperature: number;
  vibration: number;
  rpm_motor1: number;
  rpm_motor2: number;
  rpm_motor3: number;
  rpm_motor4: number;
  gps_lat: number;
  gps_lng: number;
  roll: number;
  pitch: number;
  yaw: number;
}

const Telemetry = () => {
  const [selectedFlight, setSelectedFlight] = useState("FLT-001");
  const [selectedMetrics, setSelectedMetrics] = useState(["altitude", "speed", "battery"]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const { data: systemStatus } = useQuery({
    queryKey: ['system-status'],
    queryFn: systemAPI.getStatus,
    refetchInterval: 30000,
  });

  // Mock telemetry data - replace with real API call
  const mockTelemetryData: TelemetryPoint[] = Array.from({ length: 300 }, (_, i) => ({
    timestamp: i,
    altitude: 50 + Math.sin(i * 0.1) * 30 + Math.random() * 10,
    speed: 15 + Math.sin(i * 0.05) * 5 + Math.random() * 3,
    battery: 100 - (i * 0.2) + Math.random() * 2,
    temperature: 25 + Math.sin(i * 0.03) * 10 + Math.random() * 2,
    vibration: Math.random() * 5 + Math.sin(i * 0.2) * 2,
    rpm_motor1: 3000 + Math.sin(i * 0.1) * 500 + Math.random() * 100,
    rpm_motor2: 3100 + Math.sin(i * 0.1) * 450 + Math.random() * 100,
    rpm_motor3: 2950 + Math.sin(i * 0.1) * 480 + Math.random() * 100,
    rpm_motor4: 3050 + Math.sin(i * 0.1) * 520 + Math.random() * 100,
    gps_lat: 40.7128 + (Math.random() - 0.5) * 0.01,
    gps_lng: -74.0060 + (Math.random() - 0.5) * 0.01,
    roll: Math.sin(i * 0.2) * 15 + Math.random() * 3,
    pitch: Math.sin(i * 0.15) * 12 + Math.random() * 2,
    yaw: (i * 0.5) % 360,
  }));

  const currentData = mockTelemetryData.slice(Math.max(0, currentTime - 50), currentTime + 50);

  const metricConfig = {
    altitude: { color: '#3b82f6', unit: 'm', icon: Navigation },
    speed: { color: '#10b981', unit: 'm/s', icon: Gauge },
    battery: { color: '#f59e0b', unit: '%', icon: Battery },
    temperature: { color: '#ef4444', unit: '°C', icon: Thermometer },
    vibration: { color: '#8b5cf6', unit: 'g', icon: Activity },
    rpm_motor1: { color: '#06b6d4', unit: 'RPM', icon: Zap },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < mockTelemetryData.length - 1) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + playbackSpeed, mockTelemetryData.length - 1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, playbackSpeed, mockTelemetryData.length]);

  const getCurrentValue = (metric: string) => {
    const currentPoint = mockTelemetryData[currentTime];
    return currentPoint?.[metric as keyof TelemetryPoint] || 0;
  };

  const getMetricStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'battery':
        if (value < 20) return 'critical';
        if (value < 40) return 'warning';
        return 'normal';
      case 'temperature':
        if (value > 45) return 'critical';
        if (value > 35) return 'warning';
        return 'normal';
      case 'vibration':
        if (value > 4) return 'critical';
        if (value > 2) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-aviation-blue">Real-time Telemetry</h2>
          <p className="text-muted-foreground">
            Live flight data monitoring and analysis
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedFlight} onValueChange={setSelectedFlight}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FLT-001">Flight FLT-001</SelectItem>
              <SelectItem value="FLT-002">Flight FLT-002</SelectItem>
              <SelectItem value="FLT-003">Flight FLT-003</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Playback Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTime(0)}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTime(mockTelemetryData.length - 1)}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Speed:</span>
                  <Select value={playbackSpeed.toString()} onValueChange={(v) => setPlaybackSpeed(Number(v))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                      <SelectItem value="4">4x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Time: {Math.floor(currentTime / 10)}s / {Math.floor(mockTelemetryData.length / 10)}s
              </div>
            </div>
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                onValueChange={([value]) => setCurrentTime(value)}
                max={mockTelemetryData.length - 1}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(metricConfig).map(([metric, config]) => {
          const value = getCurrentValue(metric);
          const status = getMetricStatus(metric, value);
          const Icon = config.icon;
          
          return (
            <Card key={metric}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {metric.replace('_', ' ')}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: config.color }}>
                  {typeof value === 'number' ? value.toFixed(1) : '0.0'}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {config.unit}
                  </span>
                </div>
                <Badge variant="outline" className={cn("mt-2", getStatusColor(status))}>
                  {status}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="charts">Telemetry Charts</TabsTrigger>
          <TabsTrigger value="motors">Motor Analysis</TabsTrigger>
          <TabsTrigger value="attitude">Attitude & Navigation</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Primary Flight Metrics</CardTitle>
              <CardDescription>Altitude, speed, and battery levels over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine x={currentTime} stroke="#ef4444" strokeDasharray="2 2" />
                  <Line 
                    type="monotone" 
                    dataKey="altitude" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Altitude (m)"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Speed (m/s)"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="battery" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Battery (%)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health Metrics</CardTitle>
              <CardDescription>Temperature and vibration monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine x={currentTime} stroke="#ef4444" strokeDasharray="2 2" />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Temperature (°C)"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vibration" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Vibration (g)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Motor RPM Analysis</CardTitle>
              <CardDescription>Individual motor performance and synchronization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine x={currentTime} stroke="#ef4444" strokeDasharray="2 2" />
                  <Line 
                    type="monotone" 
                    dataKey="rpm_motor1" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Motor 1 RPM"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rpm_motor2" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Motor 2 RPM"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rpm_motor3" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Motor 3 RPM"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rpm_motor4" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Motor 4 RPM"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attitude" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attitude and Orientation</CardTitle>
              <CardDescription>Roll, pitch, and yaw measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine x={currentTime} stroke="#ef4444" strokeDasharray="2 2" />
                  <Line 
                    type="monotone" 
                    dataKey="roll" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Roll (°)"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pitch" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Pitch (°)"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="yaw" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Yaw (°)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Raw Telemetry Data</CardTitle>
              <CardDescription>Current data point values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTelemetryData[currentTime] && Object.entries(mockTelemetryData[currentTime]).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                    <span className="text-aviation-blue">
                      {typeof value === 'number' ? value.toFixed(3) : value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Telemetry;