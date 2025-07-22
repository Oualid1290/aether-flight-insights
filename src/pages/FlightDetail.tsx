import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane,
  MapPin,
  Clock,
  Route,
  Battery,
  Gauge,
  Download,
  Eye,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";

// Mock data for the flight
const mockFlightData = {
  id: "FL-2024-004",
  aircraftType: "DJI Mavic 3",
  confidence: 94,
  duration: "28 min 32 sec",
  distance: "12.4 km",
  maxAltitude: 145,
  maxSpeed: 22.5,
  batteryConsumed: 76,
  riskScore: 87,
  riskLevel: "low" as const,
  location: "San Francisco, CA",
  startTime: "2024-01-22 14:30:15",
  summary: "Successful survey mission with optimal flight parameters. Aircraft maintained stable altitude throughout the mission with minor battery optimization opportunities identified.",
  alerts: [
    {
      type: "Battery",
      severity: "warning" as const,
      message: "Battery level dropped below 20% at 24:30",
      timestamp: "24:30"
    },
    {
      type: "Wind",
      severity: "info" as const,
      message: "High wind conditions detected between 15:00-18:00",
      timestamp: "15:00"
    },
    {
      type: "Performance",
      severity: "info" as const,
      message: "Optimal flight efficiency maintained throughout mission",
      timestamp: "00:00"
    }
  ],
  telemetryData: [
    { time: "0:00", altitude: 0, speed: 0, battery: 100, vibration: 0.1, rpm: 0 },
    { time: "2:00", altitude: 25, speed: 8, battery: 98, vibration: 0.3, rpm: 3200 },
    { time: "4:00", altitude: 45, speed: 12, battery: 95, vibration: 0.2, rpm: 3800 },
    { time: "8:00", altitude: 120, speed: 18, battery: 85, vibration: 0.4, rpm: 4200 },
    { time: "12:00", altitude: 140, speed: 20, battery: 75, vibration: 0.4, rpm: 4400 },
    { time: "16:00", altitude: 75, speed: 12, battery: 60, vibration: 0.7, rpm: 3600 },
    { time: "20:00", altitude: 25, speed: 8, battery: 40, vibration: 0.4, rpm: 3200 },
    { time: "24:00", altitude: 10, speed: 4, battery: 18, vibration: 0.2, rpm: 2800 },
    { time: "28:00", altitude: 0, speed: 0, battery: 24, vibration: 0.1, rpm: 0 },
  ]
};

export default function FlightDetail() {
  const { id } = useParams();
  const [activeView, setActiveView] = useState<"charts" | "3d">("charts");

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-destructive";
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

  const riskData = [
    { name: "Risk Score", value: mockFlightData.riskScore, fill: "hsl(var(--success))" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-aviation-blue">Flight {id}</h1>
            <Badge variant="outline" className="text-aviation-blue border-aviation-blue">
              <Plane className="mr-1 h-3 w-3" />
              {mockFlightData.aircraftType} — {mockFlightData.confidence}% Confidence
            </Badge>
          </div>
          <p className="text-muted-foreground">{mockFlightData.summary}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Flight Info Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="aviation-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-aviation-blue" />
              <span className="text-sm text-muted-foreground">Duration</span>
            </div>
            <p className="font-semibold">{mockFlightData.duration}</p>
          </CardContent>
        </Card>
        
        <Card className="aviation-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Route className="h-4 w-4 text-aviation-blue" />
              <span className="text-sm text-muted-foreground">Distance</span>
            </div>
            <p className="font-semibold">{mockFlightData.distance}</p>
          </CardContent>
        </Card>
        
        <Card className="aviation-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="h-4 w-4 text-aviation-blue" />
              <span className="text-sm text-muted-foreground">Max Altitude</span>
            </div>
            <p className="font-semibold">{mockFlightData.maxAltitude}m</p>
          </CardContent>
        </Card>
        
        <Card className="aviation-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="h-4 w-4 text-aviation-blue" />
              <span className="text-sm text-muted-foreground">Max Speed</span>
            </div>
            <p className="font-semibold">{mockFlightData.maxSpeed} m/s</p>
          </CardContent>
        </Card>
        
        <Card className="aviation-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="h-4 w-4 text-aviation-blue" />
              <span className="text-sm text-muted-foreground">Battery Used</span>
            </div>
            <p className="font-semibold">{mockFlightData.batteryConsumed}%</p>
          </CardContent>
        </Card>
        
        <Card className="aviation-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-aviation-blue" />
              <span className="text-sm text-muted-foreground">Location</span>
            </div>
            <p className="font-semibold">{mockFlightData.location}</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Score */}
      <Card className="aviation-card">
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart data={riskData} innerRadius="60%" outerRadius="90%">
                      <RadialBar dataKey="value" cornerRadius={10} className="fill-success" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockFlightData.riskScore}%</p>
                  <p className={`font-medium capitalize ${getRiskColor(mockFlightData.riskLevel)}`}>
                    {mockFlightData.riskLevel} Risk
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">AI Analysis Summary</h4>
              <p className="text-sm text-muted-foreground">{mockFlightData.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Flight Analysis</h2>
        <div className="flex gap-2">
          <Button
            variant={activeView === "charts" ? "default" : "outline"}
            onClick={() => setActiveView("charts")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Charts
          </Button>
          <Button
            variant={activeView === "3d" ? "default" : "outline"}
            onClick={() => setActiveView("3d")}
          >
            <Eye className="mr-2 h-4 w-4" />
            3D Path
          </Button>
        </div>
      </div>

      {/* Charts or 3D View */}
      {activeView === "charts" ? (
        <Card className="aviation-card">
          <CardHeader>
            <CardTitle>Telemetry Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="altitude" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="altitude">Altitude</TabsTrigger>
                <TabsTrigger value="speed">Speed</TabsTrigger>
                <TabsTrigger value="battery">Battery</TabsTrigger>
                <TabsTrigger value="vibration">Vibration</TabsTrigger>
                <TabsTrigger value="rpm">Motor RPM</TabsTrigger>
              </TabsList>
              
              <TabsContent value="altitude" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockFlightData.telemetryData}>
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
                  <LineChart data={mockFlightData.telemetryData}>
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
                  <AreaChart data={mockFlightData.telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area type="monotone" dataKey="battery" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="vibration" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockFlightData.telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="vibration" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="rpm" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockFlightData.telemetryData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="time" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="rpm" stroke="hsl(var(--success))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card className="aviation-card">
          <CardHeader>
            <CardTitle>3D Flight Path Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">3D Flight Path</h3>
                <p className="text-muted-foreground mb-4">
                  Interactive 3D visualization will be rendered here using Cesium or Mapbox GL
                </p>
                <p className="text-sm text-muted-foreground">
                  Features: Altitude color-coding, anomaly markers, clickable waypoints
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            {mockFlightData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                          {alert.severity === "warning" && <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                          {alert.severity === "info" && <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{alert.type}</p>
                      <Badge variant="secondary" className="text-xs">
                        {alert.timestamp}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}