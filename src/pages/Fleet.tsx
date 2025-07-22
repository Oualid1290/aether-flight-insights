import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plane,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock data
const aircraftData = [
  {
    id: "1",
    name: "Hawk-1",
    type: "Fixed Wing",
    manufacturer: "SkyTech",
    model: "ST-200",
    registration: "N123AB",
    status: "Active",
    totalFlights: 47,
    avgRisk: 15,
    lastFlight: "2024-01-22",
    batteryHealth: 92,
    nextMaintenance: "2024-02-15",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2", 
    name: "Quad-Alpha",
    type: "Multirotor",
    manufacturer: "DJI",
    model: "Mavic 3",
    registration: "N456CD",
    status: "Needs Maintenance",
    totalFlights: 89,
    avgRisk: 32,
    lastFlight: "2024-01-20",
    batteryHealth: 78,
    nextMaintenance: "2024-01-25",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    name: "VTOL-Beta",
    type: "VTOL",
    manufacturer: "Autel",
    model: "EVO Max 4T",
    registration: "N789EF",
    status: "Active", 
    totalFlights: 23,
    avgRisk: 8,
    lastFlight: "2024-01-21",
    batteryHealth: 95,
    nextMaintenance: "2024-03-10",
    imageUrl: "/placeholder.svg"
  }
];

const riskTrendData = [
  { name: "Jan", "Hawk-1": 12, "Quad-Alpha": 35, "VTOL-Beta": 8 },
  { name: "Feb", "Hawk-1": 15, "Quad-Alpha": 32, "VTOL-Beta": 6 },
  { name: "Mar", "Hawk-1": 18, "Quad-Alpha": 28, "VTOL-Beta": 9 },
  { name: "Apr", "Hawk-1": 14, "Quad-Alpha": 30, "VTOL-Beta": 7 },
];

const fleetStatusData = [
  { name: "Active", value: 2, fill: "hsl(var(--success))" },
  { name: "Maintenance", value: 1, fill: "hsl(var(--warning))" },
];

export default function Fleet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAircraft = aircraftData.filter(aircraft => {
    const matchesSearch = aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || aircraft.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-success/10 text-success";
      case "needs maintenance": return "bg-warning/10 text-warning";
      case "inactive": return "bg-muted/10 text-muted-foreground";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 20) return "text-success";
    if (risk <= 50) return "text-warning";
    return "text-destructive";
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "needs maintenance": return <AlertTriangle className="h-4 w-4" />;
      case "inactive": return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aviation-blue">Fleet Management</h1>
          <p className="text-muted-foreground">Manage your aircraft fleet and monitor performance</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Aircraft
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Aircraft</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Aircraft Name</Label>
                <Input id="name" placeholder="e.g., Hawk-2" />
              </div>
              <div>
                <Label htmlFor="type">Aircraft Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed-wing">Fixed Wing</SelectItem>
                    <SelectItem value="multirotor">Multirotor</SelectItem>
                    <SelectItem value="vtol">VTOL</SelectItem>
                    <SelectItem value="helicopter">Helicopter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="registration">Registration ID</Label>
                <Input id="registration" placeholder="e.g., N123AB" />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" placeholder="e.g., DJI" />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="e.g., Mavic 3" />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional notes..." rows={3} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => setIsAddModalOpen(false)} className="flex-1">
                  Add Aircraft
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fleet Status Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="aviation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-aviation-blue" />
              Risk Trend by Aircraft
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="Hawk-1" stroke="hsl(var(--aviation-blue))" strokeWidth={2} />
                <Line type="monotone" dataKey="Quad-Alpha" stroke="hsl(var(--warning))" strokeWidth={2} />
                <Line type="monotone" dataKey="VTOL-Beta" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="aviation-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-aviation-blue" />
              Fleet Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fleetStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {fleetStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-sm">Active: {fleetStatusData[0].value} aircraft</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-sm">Needs Maintenance: {fleetStatusData[1].value} aircraft</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="aviation-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-aviation-blue" />
              Aircraft Fleet
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search aircraft..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="needs maintenance">Needs Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {filteredAircraft.map((aircraft) => (
              <Card key={aircraft.id} className="aviation-card-variant">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Plane className="h-6 w-6 text-aviation-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{aircraft.name}</h3>
                        <p className="text-sm text-muted-foreground">{aircraft.registration}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(aircraft.status)}>
                      {getStatusIcon(aircraft.status)}
                      <span className="ml-1">{aircraft.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{aircraft.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Flights:</span>
                      <span>{aircraft.totalFlights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Risk:</span>
                      <span className={getRiskColor(aircraft.avgRisk)}>{aircraft.avgRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Flight:</span>
                      <span>{aircraft.lastFlight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery Health:</span>
                      <span>{aircraft.batteryHealth}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table View */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flights</TableHead>
                  <TableHead>Avg Risk</TableHead>
                  <TableHead>Last Flight</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAircraft.map((aircraft) => (
                  <TableRow key={aircraft.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <Plane className="h-4 w-4 text-aviation-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{aircraft.name}</p>
                          <p className="text-sm text-muted-foreground">{aircraft.registration}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{aircraft.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(aircraft.status)} variant="secondary">
                        {aircraft.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{aircraft.totalFlights}</TableCell>
                    <TableCell>
                      <span className={getRiskColor(aircraft.avgRisk)}>{aircraft.avgRisk}%</span>
                    </TableCell>
                    <TableCell>{aircraft.lastFlight}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {aircraft.nextMaintenance}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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