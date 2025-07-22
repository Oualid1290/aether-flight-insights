import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Eye,
  Star,
  Flag,
  BarChart3,
  TrendingUp,
  Plane
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
  Area
} from "recharts";

// Mock data
const reportsData = [
  {
    id: "RPT-001",
    flightId: "FL-2024-001",
    aircraft: "Hawk-1",
    date: "2024-01-22",
    summary: "Routine survey mission completed successfully with optimal flight parameters",
    riskLevel: "low",
    duration: "28 min",
    distance: "12.4 km",
    isFavorited: true,
    isFlagged: false
  },
  {
    id: "RPT-002", 
    flightId: "FL-2024-002",
    aircraft: "Quad-Alpha",
    date: "2024-01-21",
    summary: "High-altitude mapping mission with minor battery optimization needed",
    riskLevel: "medium",
    duration: "45 min",
    distance: "18.7 km",
    isFavorited: false,
    isFlagged: true
  },
  {
    id: "RPT-003",
    flightId: "FL-2024-003", 
    aircraft: "VTOL-Beta",
    date: "2024-01-20",
    summary: "Emergency response flight completed under challenging weather conditions",
    riskLevel: "high",
    duration: "15 min",
    distance: "5.2 km",
    isFavorited: false,
    isFlagged: true
  },
  {
    id: "RPT-004",
    flightId: "FL-2024-004",
    aircraft: "Hawk-1",
    date: "2024-01-19",
    summary: "Infrastructure inspection completed with excellent performance metrics",
    riskLevel: "low",
    duration: "32 min", 
    distance: "14.1 km",
    isFavorited: true,
    isFlagged: false
  }
];

const riskTrendData = [
  { date: "Jan 15", average: 18, flights: 12 },
  { date: "Jan 16", average: 22, flights: 8 },
  { date: "Jan 17", average: 15, flights: 15 },
  { date: "Jan 18", average: 28, flights: 6 },
  { date: "Jan 19", average: 12, flights: 18 },
  { date: "Jan 20", average: 35, flights: 4 },
  { date: "Jan 21", average: 25, flights: 9 },
  { date: "Jan 22", average: 14, flights: 16 }
];

const comparisonData = [
  { metric: "Altitude", "Flight A": 145, "Flight B": 120 },
  { metric: "Speed", "Flight A": 22.5, "Flight B": 18.3 },
  { metric: "Battery", "Flight A": 76, "Flight B": 84 },
  { metric: "Duration", "Flight A": 28, "Flight B": 32 },
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.aircraft.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.flightId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "all" || report.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "high": return "bg-destructive/10 text-destructive";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aviation-blue">Flight Reports</h1>
          <p className="text-muted-foreground">Access historical flight reports and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowComparison(!showComparison)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            {showComparison ? "Hide" : "Show"} Comparison
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Risk Trend Chart */}
      <Card className="aviation-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-aviation-blue" />
            Risk Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="average" 
                stroke="hsl(var(--aviation-blue))" 
                fill="hsl(var(--aviation-blue))" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Flight Comparison Tool */}
      {showComparison && (
        <Card className="aviation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-aviation-blue" />
              Flight Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label>Flight A</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select first flight" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportsData.map(report => (
                      <SelectItem key={report.id} value={report.flightId}>
                        {report.flightId} - {report.aircraft}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Flight B</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select second flight" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportsData.map(report => (
                      <SelectItem key={report.id} value={report.flightId}>
                        {report.flightId} - {report.aircraft}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="metric" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="Flight A" stroke="hsl(var(--aviation-blue))" strokeWidth={2} />
                <Line type="monotone" dataKey="Flight B" stroke="hsl(var(--warning))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Reports Table */}
      <Card className="aviation-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-aviation-blue" />
              Flight Reports
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reports..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flight ID</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {report.isFavorited && <Star className="h-3 w-3 text-warning fill-warning" />}
                        {report.isFlagged && <Flag className="h-3 w-3 text-destructive" />}
                        <span className="font-medium">{report.flightId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-aviation-blue" />
                        {report.aircraft}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {report.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm max-w-xs truncate">{report.summary}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(report.riskLevel)} variant="secondary">
                        {report.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.duration}</TableCell>
                    <TableCell>{report.distance}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Flight Report - {selectedReport?.flightId}</DialogTitle>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-6">
                                {/* Executive Summary */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
                                  <p className="text-muted-foreground">{selectedReport.summary}</p>
                                </div>
                                
                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="p-3 border rounded-lg">
                                    <p className="text-sm text-muted-foreground">Aircraft</p>
                                    <p className="font-medium">{selectedReport.aircraft}</p>
                                  </div>
                                  <div className="p-3 border rounded-lg">
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-medium">{selectedReport.duration}</p>
                                  </div>
                                  <div className="p-3 border rounded-lg">
                                    <p className="text-sm text-muted-foreground">Distance</p>
                                    <p className="font-medium">{selectedReport.distance}</p>
                                  </div>
                                  <div className="p-3 border rounded-lg">
                                    <p className="text-sm text-muted-foreground">Risk Level</p>
                                    <Badge className={getRiskColor(selectedReport.riskLevel)}>
                                      {selectedReport.riskLevel}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Charts Placeholder */}
                                <div className="border rounded-lg p-6 bg-muted/30">
                                  <h3 className="text-lg font-semibold mb-4">Technical Data & Charts</h3>
                                  <p className="text-muted-foreground">
                                    Interactive telemetry charts, flight path visualization, and detailed metrics would be displayed here.
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <Button>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export PDF
                                  </Button>
                                  <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Export CSV
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}