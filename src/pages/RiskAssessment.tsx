import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, Zap, Battery, Thermometer } from "lucide-react";
import { systemAPI, flightAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface RiskFactor {
  name: string;
  score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendations: string[];
}

interface FlightRisk {
  flight_id: string;
  aircraft_name: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  timestamp: string;
}

const RiskAssessment = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedAircraft, setSelectedAircraft] = useState("all");

  const { data: systemStatus, isLoading: systemLoading } = useQuery({
    queryKey: ['system-status'],
    queryFn: systemAPI.getStatus,
    refetchInterval: 30000,
  });

  // Mock data - replace with actual API calls
  const mockRiskData: FlightRisk[] = [
    {
      flight_id: "FLT-001",
      aircraft_name: "Drone Alpha",
      risk_score: 85,
      risk_level: "high",
      factors: [
        {
          name: "Battery Degradation",
          score: 75,
          severity: "high",
          description: "Battery voltage dropped below optimal threshold",
          recommendations: ["Replace battery", "Check charging cycles"]
        },
        {
          name: "Motor Vibration",
          score: 60,
          severity: "medium",
          description: "Elevated vibration detected in motor 2",
          recommendations: ["Inspect propeller balance", "Check motor mounts"]
        }
      ],
      timestamp: "2024-01-15T10:30:00Z"
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <Zap className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex-1 space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-aviation-blue">Risk Assessment</h2>
          <p className="text-muted-foreground">
            AI-powered flight risk analysis and safety insights
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select aircraft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Aircraft</SelectItem>
              <SelectItem value="drone-alpha">Drone Alpha</SelectItem>
              <SelectItem value="drone-beta">Drone Beta</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* System Status Alert */}
      {systemStatus && (
        <Alert className={cn(
          systemStatus.status === 'operational' 
            ? 'border-green-200 bg-green-50' 
            : 'border-yellow-200 bg-yellow-50'
        )}>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            AI Risk Assessment System: <strong>{systemStatus.status}</strong> - 
            {systemStatus.ai_model_status === 'active' 
              ? ' Advanced risk analysis available' 
              : ' Limited analysis mode'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Risk Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-aviation-blue">72</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={72} className="flex-1" />
              <Badge variant="outline" className="text-yellow-600">Medium</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">-15%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Improvement over last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flights Analyzed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-aviation-blue">127</div>
            <p className="text-xs text-muted-foreground mt-1">
              In selected timeframe
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Risks</TabsTrigger>
          <TabsTrigger value="trends">Risk Trends</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Risk Analysis Cards */}
          <div className="grid gap-6">
            {mockRiskData.map((risk) => (
              <Card key={risk.flight_id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{risk.aircraft_name}</CardTitle>
                      <CardDescription>Flight ID: {risk.flight_id}</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={cn("px-3 py-1", getRiskColor(risk.risk_level))}
                      >
                        {getRiskIcon(risk.risk_level)}
                        <span className="ml-1 capitalize">{risk.risk_level} Risk</span>
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-aviation-blue">{risk.risk_score}</div>
                        <div className="text-sm text-muted-foreground">Risk Score</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {risk.factors.map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{factor.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getRiskColor(factor.severity))}
                          >
                            {factor.severity}
                          </Badge>
                        </div>
                        <Progress value={factor.score} className="h-2" />
                        <p className="text-sm text-muted-foreground">{factor.description}</p>
                        <div className="space-y-1">
                          {factor.recommendations.map((rec, idx) => (
                            <div key={idx} className="text-xs text-blue-600 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend Analysis</CardTitle>
              <CardDescription>Risk score evolution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Risk trend chart will be implemented with Recharts
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Risk Analysis</CardTitle>
              <CardDescription>AI-powered predictions based on flight patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Predictive Alert:</strong> Drone Alpha shows 78% probability of battery degradation within next 5 flights based on current usage patterns.
                  </AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center space-y-2">
                        <Battery className="h-8 w-8 mx-auto text-yellow-500" />
                        <div className="text-sm font-medium">Battery Health</div>
                        <div className="text-2xl font-bold text-yellow-600">78%</div>
                        <div className="text-xs text-muted-foreground">Degradation risk in 5 flights</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center space-y-2">
                        <Thermometer className="h-8 w-8 mx-auto text-red-500" />
                        <div className="text-sm font-medium">Motor Temperature</div>
                        <div className="text-2xl font-bold text-red-600">85%</div>
                        <div className="text-xs text-muted-foreground">Overheating risk detected</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center space-y-2">
                        <Shield className="h-8 w-8 mx-auto text-green-500" />
                        <div className="text-sm font-medium">Overall Health</div>
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <div className="text-xs text-muted-foreground">Good condition</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskAssessment;