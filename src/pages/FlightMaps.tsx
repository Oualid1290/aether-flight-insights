import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Map, Navigation, Satellite, Layers, Play, Pause, SkipForward, SkipBack, MapPin, Route, Compass } from "lucide-react";
import { systemAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FlightPath {
  lat: number;
  lng: number;
  altitude: number;
  timestamp: number;
  speed: number;
  heading: number;
}

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  altitude: number;
  name: string;
  type: 'takeoff' | 'waypoint' | 'landing' | 'poi';
}

const FlightMaps = () => {
  const [selectedFlight, setSelectedFlight] = useState("FLT-001");
  const [mapStyle, setMapStyle] = useState("streets");
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const [mapboxToken, setMapboxToken] = useState("");
  const mapContainer = useRef<HTMLDivElement>(null);

  const { data: systemStatus } = useQuery({
    queryKey: ['system-status'],
    queryFn: systemAPI.getStatus,
    refetchInterval: 30000,
  });

  // Mock flight path data
  const mockFlightPath: FlightPath[] = Array.from({ length: 200 }, (_, i) => {
    const angle = (i / 200) * Math.PI * 4;
    const radius = 0.002 + (i / 200) * 0.001;
    return {
      lat: 40.7128 + Math.sin(angle) * radius,
      lng: -74.0060 + Math.cos(angle) * radius,
      altitude: 50 + Math.sin(i * 0.1) * 30,
      timestamp: i,
      speed: 15 + Math.sin(i * 0.1) * 5,
      heading: (angle * 180 / Math.PI) % 360,
    };
  });

  const mockWaypoints: Waypoint[] = [
    { id: "1", lat: 40.7128, lng: -74.0060, altitude: 0, name: "Takeoff Point", type: "takeoff" },
    { id: "2", lat: 40.7140, lng: -74.0050, altitude: 80, name: "Waypoint 1", type: "waypoint" },
    { id: "3", lat: 40.7120, lng: -74.0040, altitude: 60, name: "Point of Interest", type: "poi" },
    { id: "4", lat: 40.7135, lng: -74.0070, altitude: 40, name: "Waypoint 2", type: "waypoint" },
    { id: "5", lat: 40.7128, lng: -74.0060, altitude: 0, name: "Landing Point", type: "landing" },
  ];

  const currentPosition = mockFlightPath[currentTime];
  const flightStats = {
    totalDistance: 2.4,
    maxAltitude: 85,
    avgSpeed: 16.2,
    duration: "12:45",
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < mockFlightPath.length - 1) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, mockFlightPath.length - 1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, mockFlightPath.length]);

  const getWaypointIcon = (type: string) => {
    switch (type) {
      case 'takeoff': return '🛫';
      case 'landing': return '🛬';
      case 'poi': return '📍';
      default: return '📌';
    }
  };

  const getWaypointColor = (type: string) => {
    switch (type) {
      case 'takeoff': return 'text-green-600 bg-green-50 border-green-200';
      case 'landing': return 'text-red-600 bg-red-50 border-red-200';
      case 'poi': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-aviation-blue">Flight Maps</h2>
          <p className="text-muted-foreground">
            Interactive flight path visualization and mapping
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
          <Select value={mapStyle} onValueChange={setMapStyle}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="streets">Streets</SelectItem>
              <SelectItem value="satellite">Satellite</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mapbox Token Input */}
      {!mapboxToken && (
        <Card>
          <CardHeader>
            <CardTitle>Mapbox Configuration</CardTitle>
            <CardDescription>Enter your Mapbox public token to enable interactive maps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJ5b3VyLXRva2VuIn0..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => mapboxToken && alert("Token saved!")}>
                Save Token
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Get your free token at <a href="https://mapbox.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">mapbox.com</a>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Flight Controls */}
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
                  onClick={() => setCurrentTime(mockFlightPath.length - 1)}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-4">
                  <Button
                    variant={showWaypoints ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowWaypoints(!showWaypoints)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Waypoints
                  </Button>
                  <Button
                    variant={show3D ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShow3D(!show3D)}
                  >
                    <Layers className="h-4 w-4 mr-1" />
                    3D View
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Time: {Math.floor(currentTime / 10)}s / {Math.floor(mockFlightPath.length / 10)}s
              </div>
            </div>
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => setCurrentTime(value)}
              max={mockFlightPath.length - 1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full">
              <div ref={mapContainer} className="w-full h-full bg-slate-100 rounded-lg relative">
                {mapboxToken ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Map className="h-16 w-16 mx-auto text-aviation-blue" />
                      <div>
                        <h3 className="text-lg font-semibold">Interactive Map</h3>
                        <p className="text-muted-foreground">Mapbox integration will be implemented here</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Satellite className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-semibold">Map View</h3>
                        <p className="text-muted-foreground">Enter Mapbox token to enable interactive maps</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Current Position Indicator */}
                {currentPosition && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-aviation-blue" />
                      <div>
                        <div className="font-medium">Current Position</div>
                        <div className="text-muted-foreground">
                          {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
                        </div>
                        <div className="text-muted-foreground">
                          Alt: {currentPosition.altitude.toFixed(1)}m | Speed: {currentPosition.speed.toFixed(1)}m/s
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Flight Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flight Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Distance:</span>
                <span className="font-medium">{flightStats.totalDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Altitude:</span>
                <span className="font-medium">{flightStats.maxAltitude} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Speed:</span>
                <span className="font-medium">{flightStats.avgSpeed} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{flightStats.duration}</span>
              </div>
            </CardContent>
          </Card>

          {/* Current Position */}
          {currentPosition && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Current Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Coordinates</div>
                  <div className="font-mono text-sm">
                    {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Altitude</div>
                  <div className="font-medium">{currentPosition.altitude.toFixed(1)} m</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Speed</div>
                  <div className="font-medium">{currentPosition.speed.toFixed(1)} m/s</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Heading</div>
                  <div className="font-medium">{currentPosition.heading.toFixed(0)}°</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Waypoints */}
          {showWaypoints && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Waypoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockWaypoints.map((waypoint) => (
                    <div key={waypoint.id} className="flex items-center gap-3">
                      <div className="text-lg">{getWaypointIcon(waypoint.type)}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{waypoint.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Alt: {waypoint.altitude}m
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-xs", getWaypointColor(waypoint.type))}>
                        {waypoint.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightMaps;