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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Wrench,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Bell,
  FileText,
  Download,
  Filter
} from "lucide-react";
import { format } from "date-fns";

// Mock data
const maintenanceTasks = [
  {
    id: "M001",
    aircraft: "Hawk-1",
    type: "Battery Check",
    description: "Routine battery health inspection and voltage testing",
    status: "scheduled",
    priority: "high",
    scheduledDate: "2024-01-25",
    assignedTo: "John Smith",
    estimatedHours: 2,
    notes: "",
    isOverdue: false
  },
  {
    id: "M002",
    aircraft: "Quad-Alpha", 
    type: "Motor Alignment",
    description: "Check and adjust motor mounting and alignment",
    status: "in_progress",
    priority: "medium",
    scheduledDate: "2024-01-24",
    assignedTo: "Sarah Johnson",
    estimatedHours: 3,
    notes: "Motor 2 showing slight vibration",
    isOverdue: false
  },
  {
    id: "M003",
    aircraft: "VTOL-Beta",
    type: "Annual Inspection",
    description: "Comprehensive annual safety and performance inspection",
    status: "completed",
    priority: "high",
    scheduledDate: "2024-01-20",
    completedDate: "2024-01-21",
    assignedTo: "Mike Wilson",
    estimatedHours: 8,
    actualHours: 7.5,
    notes: "All systems nominal. Minor firmware update applied.",
    isOverdue: false
  },
  {
    id: "M004",
    aircraft: "Hawk-1",
    type: "Propeller Replacement",
    description: "Replace damaged propeller blade",
    status: "overdue",
    priority: "critical",
    scheduledDate: "2024-01-18",
    assignedTo: "John Smith",
    estimatedHours: 1,
    notes: "Damage detected during post-flight inspection",
    isOverdue: true
  }
];

const alertTasks = [
  {
    id: "A001",
    aircraft: "Quad-Alpha",
    trigger: "High vibration detected",
    suggestedAction: "Motor inspection and balancing",
    flightId: "FL-2024-002",
    priority: "high",
    createdDate: "2024-01-22"
  },
  {
    id: "A002", 
    aircraft: "Hawk-1",
    trigger: "Battery efficiency below 85%",
    suggestedAction: "Battery replacement or reconditioning",
    flightId: "FL-2024-001",
    priority: "medium",
    createdDate: "2024-01-21"
  }
];

const maintenanceHistory = [
  {
    id: "H001",
    aircraft: "VTOL-Beta",
    task: "Annual Inspection",
    performedBy: "Mike Wilson",
    completedDate: "2024-01-21",
    outcome: "Passed",
    cost: 450,
    notes: "All systems nominal"
  },
  {
    id: "H002",
    aircraft: "Quad-Alpha", 
    task: "Battery Replacement",
    performedBy: "Sarah Johnson",
    completedDate: "2024-01-15",
    outcome: "Completed",
    cost: 230,
    notes: "Replaced with new LiPo 6S 5000mAh"
  }
];

export default function Maintenance() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks = maintenanceTasks.filter(task => {
    if (statusFilter === "all") return true;
    return task.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-500/10 text-blue-600";
      case "in_progress": return "bg-warning/10 text-warning";
      case "completed": return "bg-success/10 text-success";
      case "overdue": return "bg-destructive/10 text-destructive";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-destructive/10 text-destructive";
      case "high": return "bg-orange-500/10 text-orange-600";
      case "medium": return "bg-warning/10 text-warning";
      case "low": return "bg-blue-500/10 text-blue-600";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled": return <Clock className="h-4 w-4" />;
      case "in_progress": return <Wrench className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "overdue": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aviation-blue">Maintenance Management</h1>
          <p className="text-muted-foreground">Manage inspection schedules and maintenance tasks</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Maintenance Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Maintenance Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aircraft">Aircraft</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aircraft" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hawk-1">Hawk-1</SelectItem>
                    <SelectItem value="quad-alpha">Quad-Alpha</SelectItem>
                    <SelectItem value="vtol-beta">VTOL-Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Task Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="battery-check">Battery Check</SelectItem>
                    <SelectItem value="motor-alignment">Motor Alignment</SelectItem>
                    <SelectItem value="propeller-replacement">Propeller Replacement</SelectItem>
                    <SelectItem value="annual-inspection">Annual Inspection</SelectItem>
                    <SelectItem value="firmware-update">Firmware Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="assignedTo">Assign to</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith</SelectItem>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Task description..." rows={3} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={() => setIsAddModalOpen(false)} className="flex-1">
                  Create Task
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert List */}
      <Card className="aviation-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-aviation-blue" />
            AI-Generated Maintenance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertTasks.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg bg-warning/5 border-warning/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="font-medium">{alert.aircraft}</span>
                      <Badge className={getPriorityColor(alert.priority)} variant="secondary">
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Trigger:</strong> {alert.trigger}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Suggested Action:</strong> {alert.suggestedAction}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From flight {alert.flightId} on {alert.createdDate}
                    </p>
                  </div>
                  <Button size="sm">Create Task</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card className="aviation-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-aviation-blue" />
              Maintenance Schedule
            </CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
                  <TableHead>Task ID</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Task Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Est. Hours</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className={task.isOverdue ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.aircraft}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)} variant="secondary">
                        {getStatusIcon(task.status)}
                        <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                        {task.scheduledDate}
                        {task.isOverdue && (
                          <AlertTriangle className="h-3 w-3 text-destructive ml-1" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {task.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>{task.estimatedHours}h</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-3 w-3" />
                        </Button>
                        {task.status === "completed" && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance History */}
      <Card className="aviation-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-aviation-blue" />
            Maintenance History Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.aircraft}</TableCell>
                    <TableCell>{record.task}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {record.performedBy}
                      </div>
                    </TableCell>
                    <TableCell>{record.completedDate}</TableCell>
                    <TableCell>
                      <Badge className={record.outcome === "Passed" ? "bg-success/10 text-success" : "bg-blue-500/10 text-blue-600"} variant="secondary">
                        {record.outcome}
                      </Badge>
                    </TableCell>
                    <TableCell>${record.cost}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.notes}</TableCell>
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