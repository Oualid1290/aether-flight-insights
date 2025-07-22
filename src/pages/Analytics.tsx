import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieIcon, Activity, Clock, Zap, Target } from "lucide-react";
import { systemAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  flightHours: number;
  avgRiskScore: number;
  successRate: number;
  maintenanceAlerts: number;
}

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("flights");

  const { data: systemStatus } = useQuery({
    queryKey: ['system-status'],
    queryFn: systemAPI.getStatus,
    refetchInterval: 30000,
  });

  // Mock analytics data
  const mockFlightData = [
    { date: '2024-01-01', flights: 12, risk: 45, duration: 120, battery: 85 },
    { date: '2024-01-02', flights: 8, risk: 52, duration: 95, battery: 78 },
    { date: '2024-01-03', flights: 15, risk: 38, duration: 145, battery: 92 },
    { date: '2024-01-04', flights: 10, risk: 61, duration: 110, battery: 76 },
    { date: '2024-01-05', flights: 18, risk: 42, duration: 180, battery: 88 },
    { date: '2024-01-06', flights: 14, risk: 35, duration: 130, battery: 91 },
    { date: '2024-01-07', flights: 9, risk: 58, duration: 85, battery: 73 },
  ];

  const aircraftTypeData = [
    { name: 'Multirotor', value: 45, color: '#3b82f6' },
    { name: 'Fixed Wing', value: 30, color: '#10b981' },
    { name: 'VTOL', value: 15, color: '#f59e0b' },
    { name: 'Helicopter', value: 10, color: '#ef4444' },
  ];

  const riskDistribution = [
    { risk: 'Low', count: 85, color: '#10b981' },
    { risk: 'Medium', count: 45, color: '#f59e0b' },
    { risk: 'High', count: 12, color: '#ef4444' },
    { risk: 'Critical', count: 3, color: '#dc2626' },
  ];

  const flightPerformanceData = [
    { month: 'Jan', efficiency: 92, safety: 95, reliability: 88 },
    { month: 'Feb', efficiency: 88, safety: 92, reliability: 91 },
    { month: 'Mar', efficiency: 94, safety: 96, reliability: 89 },
    { month: 'Apr', efficiency: 91, safety: 94, reliability: 93 },
    { month: 'May', efficiency: 96, safety: 98, reliability: 95 },
    { month: 'Jun', efficiency: 93, safety: 97, reliability: 92 },
  ];

  return (
    <div className="flex-1 space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-aviation-blue">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive flight data analysis and insights
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flights">Flight Count</SelectItem>
              <SelectItem value="risk">Risk Score</SelectItem>
              <SelectItem value="duration">Flight Duration</SelectItem>
              <SelectItem value="battery">Battery Usage</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flight Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-aviation-blue">1,247</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">47.2</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingDown className="h-3 w-3" />
              -5% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mission Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.8%</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +2.1% this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">7</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TrendingUp className="h-3 w-3" />
              +3 since yesterday
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Flight Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flight Activity Trends</CardTitle>
              <CardDescription>Flight metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockFlightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="flights" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Flights"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flight Duration Analysis</CardTitle>
              <CardDescription>Daily flight duration and battery consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockFlightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="duration" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Duration (min)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="battery" 
                    stackId="2"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Battery %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Aircraft Type Distribution</CardTitle>
                <CardDescription>Fleet composition by aircraft type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={aircraftTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {aircraftTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Level Distribution</CardTitle>
                <CardDescription>Flight risk assessment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="risk" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6">
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Monthly performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={flightPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Efficiency %"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="safety" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Safety %"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="reliability" 
                    stackId="3"
                    stroke="#f59e0b" 
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Reliability %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Comparison</CardTitle>
              <CardDescription>Compare performance across different aircraft</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Advanced comparison charts will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;