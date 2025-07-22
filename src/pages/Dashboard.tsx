import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  TrendingUp, 
  AlertTriangle, 
  Battery, 
  Clock,
  MapPin,
  Activity,
  Shield,
  Upload,
  Calendar,
  BarChart3,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with real API calls
const mockFlightData = [
  { time: "00:00", altitude: 0, speed: 0, battery: 100 },
  { time: "00:30", altitude: 45, speed: 12, battery: 95 },
  { time: "01:00", altitude: 120, speed: 18, battery: 88 },
  { time: "01:30", altitude: 180, speed: 22, battery: 80 },
  { time: "02:00", altitude: 200, speed: 25, battery: 75 },
  { time: "02:30", altitude: 190, speed: 20, battery: 68 },
  { time: "03:00", altitude: 150, speed: 15, battery: 62 },
  { time: "03:30", altitude: 80, speed: 10, battery: 58 },
  { time: "04:00", altitude: 0, speed: 0, battery: 55 },
];

const mockRiskData = [
  { name: "Low Risk", value: 65, color: "hsl(var(--risk-low))" },
  { name: "Medium Risk", value: 25, color: "hsl(var(--risk-medium))" },
  { name: "High Risk", value: 10, color: "hsl(var(--risk-high))" },
];

const mockRecentFlights = [
  {
    id: "FL-2024-001",
    aircraft: "DJI Mavic 3",
    type: "Multirotor",
    duration: "24 min",
    status: "completed",
    riskScore: 85,
    timestamp: "2 hours ago",
  },
  {
    id: "FL-2024-002", 
    aircraft: "Fixed Wing Alpha",
    type: "Fixed Wing",
    duration: "1h 15m",
    status: "analyzing",
    riskScore: 92,
    timestamp: "4 hours ago",
  },
  {
    id: "FL-2024-003",
    aircraft: "VTOL Prototype",
    type: "VTOL",
    duration: "45 min",
    status: "warning",
    riskScore: 68,
    timestamp: "6 hours ago",
  },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [systemStatus, setSystemStatus] = useState<"online" | "offline" | "maintenance">("online");

  useEffect(() => {
    // Simulate checking system status
    const checkStatus = () => {
      const statuses = ["online", "offline", "maintenance"] as const;
      setSystemStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    };

    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "analyzing": return "bg-warning/10 text-warning border-warning/20";
      case "warning": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-risk-low";
    if (score >= 60) return "text-risk-medium";
    return "text-risk-high";
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-background via-background to-aviation-blue/5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-aviation-blue">Flight Operations Dashboard</h1>
          <p className="text-muted-foreground">Real-time aircraft monitoring and analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge 
            variant="secondary" 
            className={systemStatus === "online" 
              ? "bg-success/10 text-success hover:bg-success/20" 
              : "bg-destructive/10 text-destructive hover:bg-destructive/20"
            }
          >
            <Activity className="mr-1 h-3 w-3" />
            AI System {systemStatus === "online" ? "Online" : "Offline"}
          </Badge>
          
          <Button className="bg-aviation-blue hover:bg-aviation-blue/90">
            <Upload className="mr-2 h-4 w-4" />
            Upload Flight Data
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="aviation-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Aircraft</CardTitle>
            <Plane className="h-4 w-4 text-aviation-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-aviation-blue">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flights Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-telemetry" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-telemetry">47</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-risk-medium" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-medium">3</div>
            <p className="text-xs text-muted-foreground">
              2 medium, 1 high priority
            </p>
          </CardContent>
        </Card>

        <Card className="aviation-card hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">94%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flight Telemetry */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="aviation-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-aviation-blue" />
                Real-time Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockFlightData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="altitude" stroke="hsl(var(--aviation-blue))" fill="hsl(var(--aviation-blue))" fillOpacity={0.2} />
                  <Line type="monotone" dataKey="speed" stroke="hsl(var(--telemetry))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="aviation-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-aviation-blue" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockRiskData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Flights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="aviation-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-aviation-blue" />
                Recent Flight Activity
              </span>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentFlights.map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aviation-blue/10">
                      <Plane className="h-5 w-5 text-aviation-blue" />
                    </div>
                    <div>
                      <div className="font-semibold">{flight.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {flight.aircraft} • {flight.type} • {flight.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getRiskColor(flight.riskScore)}`}>
                        Risk: {flight.riskScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {flight.timestamp}
                      </div>
                    </div>
                    
                    <Badge
                      variant="secondary"
                      className={getStatusColor(flight.status)}
                    >
                      {flight.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}