import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Settings as SettingsIcon,
  User,
  Building,
  Key,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Eye,
  Copy,
  RefreshCw,
  Trash2
} from "lucide-react";
import { useTheme } from "next-themes";

// Mock data
const apiKeys = [
  {
    id: "key_1",
    name: "Production API Key",
    key: "sk_prod_123...xyz789",
    created: "2024-01-15",
    lastUsed: "2024-01-22",
    requests: 1247,
    status: "active"
  },
  {
    id: "key_2", 
    name: "Development Key",
    key: "sk_dev_456...abc123",
    created: "2024-01-10",
    lastUsed: "2024-01-21",
    requests: 342,
    status: "active"
  }
];

const auditLogs = [
  {
    id: "1",
    action: "API Key Generated",
    user: "admin@company.com",
    timestamp: "2024-01-22 14:30:15",
    details: "Production API Key created"
  },
  {
    id: "2",
    action: "Settings Updated",
    user: "admin@company.com", 
    timestamp: "2024-01-22 10:15:22",
    details: "Updated notification preferences"
  },
  {
    id: "3",
    action: "User Invited",
    user: "admin@company.com",
    timestamp: "2024-01-21 16:45:10",
    details: "Invited user@company.com as Operator"
  }
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    uploadComplete: true,
    riskAlert: true,
    maintenanceDue: true,
    systemUpdates: false
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-aviation-blue">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and system configuration</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* User Preferences */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="aviation-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-aviation-blue" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Upload Photo</Button>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@company.com" />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value="Administrator" disabled className="bg-muted" />
              </div>

              <div>
                <Label htmlFor="units">Preferred Units</Label>
                <Select defaultValue="metric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (m/s, meters, °C)</SelectItem>
                    <SelectItem value="imperial">Imperial (ft/s, feet, °F)</SelectItem>
                    <SelectItem value="mixed">Mixed (knots, feet, °C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Theme Preference</Label>
                <div className="flex gap-2">
                  <Button 
                    variant={theme === "light" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button 
                    variant={theme === "system" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Info */}
        <TabsContent value="organization" className="space-y-6">
          <Card className="aviation-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-aviation-blue" />
                Organization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" defaultValue="Skyward Aerospace Solutions" />
              </div>
              
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input id="domain" defaultValue="skyward-aero.com" />
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select defaultValue="aerospace">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aerospace">Aerospace & Defense</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="energy">Energy & Utilities</SelectItem>
                    <SelectItem value="emergency">Emergency Services</SelectItem>
                    <SelectItem value="mapping">Mapping & Surveying</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="research">Research & Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select defaultValue="10-50">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 people</SelectItem>
                    <SelectItem value="10-50">10-50 people</SelectItem>
                    <SelectItem value="50-200">50-200 people</SelectItem>
                    <SelectItem value="200+">200+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of your organization..."
                  defaultValue="Leading provider of autonomous aerial vehicle solutions for commercial and industrial applications."
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <Button>Update Organization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Key Management */}
        <TabsContent value="api" className="space-y-6">
          <Card className="aviation-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-aviation-blue" />
                  API Key Management
                </CardTitle>
                <Button>
                  <Key className="mr-2 h-4 w-4" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Requests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">{apiKey.key}</code>
                            <Button variant="ghost" size="sm">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{apiKey.created}</TableCell>
                        <TableCell>{apiKey.lastUsed}</TableCell>
                        <TableCell>{apiKey.requests.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                            {apiKey.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Usage Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Requests</p>
                    <p className="font-semibold">1,589</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">This Month</p>
                    <p className="font-semibold">342</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rate Limit</p>
                    <p className="font-semibold">1,000/hour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="aviation-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-aviation-blue" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="uploadComplete">Upload Complete</Label>
                    <p className="text-sm text-muted-foreground">Notify when flight data upload is complete</p>
                  </div>
                  <Switch 
                    id="uploadComplete"
                    checked={notifications.uploadComplete}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, uploadComplete: checked}))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="riskAlert">Risk Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify when high-risk flights are detected</p>
                  </div>
                  <Switch 
                    id="riskAlert"
                    checked={notifications.riskAlert}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, riskAlert: checked}))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceDue">Maintenance Due</Label>
                    <p className="text-sm text-muted-foreground">Notify when maintenance is due or overdue</p>
                  </div>
                  <Switch 
                    id="maintenanceDue"
                    checked={notifications.maintenanceDue}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, maintenanceDue: checked}))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify about system updates and new features</p>
                  </div>
                  <Switch 
                    id="systemUpdates"
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => setNotifications(prev => ({...prev, systemUpdates: checked}))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Notification Methods</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="email" defaultChecked className="rounded" />
                    <Label htmlFor="email">Email notifications</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="inapp" defaultChecked className="rounded" />
                    <Label htmlFor="inapp">In-app notifications</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="sms" className="rounded" />
                    <Label htmlFor="sms">SMS notifications (critical alerts only)</Label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Access */}
        <TabsContent value="security" className="space-y-6">
          <Card className="aviation-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-aviation-blue" />
                Security & Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Role-based Access</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Administrator</p>
                      <p className="text-sm text-muted-foreground">Full system access and user management</p>
                    </div>
                    <Badge>Current Role</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                    <div>
                      <p className="font-medium">Operator</p>
                      <p className="text-sm text-muted-foreground">Flight data upload and analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                    <div>
                      <p className="font-medium">Viewer</p>
                      <p className="text-sm text-muted-foreground">Read-only access to reports and data</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Audit Logs</h4>
                <div className="border rounded-lg max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell className="text-sm">{log.timestamp}</TableCell>
                          <TableCell className="text-sm">{log.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Security Settings</h4>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="2fa" className="rounded" />
                  <Label htmlFor="2fa">Enable two-factor authentication</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sessionTimeout" defaultChecked className="rounded" />
                  <Label htmlFor="sessionTimeout">Auto-logout after 8 hours of inactivity</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="auditLog" defaultChecked className="rounded" />
                  <Label htmlFor="auditLog">Log all user actions</Label>
                </div>
              </div>

              <div className="pt-4">
                <Button>Update Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}