import { Activity, Wifi, Server, Globe, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface NetworkUptimeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockUptimeData = {
  overall: {
    uptime: 99.97,
    totalDowntime: "2h 15m",
    lastIncident: "3 days ago",
    status: "operational"
  },
  services: [
    {
      name: "Web Server",
      uptime: 99.99,
      status: "operational",
      responseTime: "45ms",
      lastCheck: "30 seconds ago"
    },
    {
      name: "Database",
      uptime: 99.95,
      status: "operational",
      responseTime: "12ms",
      lastCheck: "30 seconds ago"
    },
    {
      name: "API Gateway",
      uptime: 99.98,
      status: "operational",
      responseTime: "78ms",
      lastCheck: "30 seconds ago"
    },
    {
      name: "Authentication Service",
      uptime: 99.90,
      status: "degraded",
      responseTime: "156ms",
      lastCheck: "30 seconds ago"
    },
    {
      name: "File Storage",
      uptime: 100.0,
      status: "operational",
      responseTime: "23ms",
      lastCheck: "30 seconds ago"
    }
  ]
};

export function NetworkUptimeModal({ isOpen, onClose }: NetworkUptimeModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-security-success text-white">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-security-warning text-black">Degraded</Badge>;
      case 'down':
        return <Badge className="bg-security-critical text-white">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return "text-security-success";
    if (uptime >= 99.0) return "text-security-warning";
    return "text-security-critical";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span>Network Uptime Status</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Overall Network Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getUptimeColor(mockUptimeData.overall.uptime)}`}>
                    {mockUptimeData.overall.uptime}%
                  </div>
                  <div className="text-sm text-muted-foreground">Uptime (30 days)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-security-warning">
                    {mockUptimeData.overall.totalDowntime}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Downtime</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium">
                    {mockUptimeData.overall.lastIncident}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Incident</div>
                </div>
                <div className="text-center">
                  {getStatusBadge(mockUptimeData.overall.status)}
                  <div className="text-sm text-muted-foreground mt-1">Current Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-primary" />
                <span>Service Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUptimeData.services.map((service, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span className="font-medium">{service.name}</span>
                        {getStatusBadge(service.status)}
                      </div>
                      <div className={`text-lg font-semibold ${getUptimeColor(service.uptime)}`}>
                        {service.uptime}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Response Time</div>
                        <div className="font-medium">{service.responseTime}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Check</div>
                        <div className="font-medium flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{service.lastCheck}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Uptime Progress</div>
                        <Progress value={service.uptime} className="mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Uptime History */}
          <Card>
            <CardHeader>
              <CardTitle>30-Day Uptime History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 28 }, (_, i) => {
                    const uptime = Math.random() > 0.1 ? 100 : Math.random() * 20 + 80;
                    const color = uptime >= 99.9 ? 'bg-security-success' : 
                                 uptime >= 99.0 ? 'bg-security-warning' : 'bg-security-critical';
                    return (
                      <div
                        key={i}
                        className={`h-8 rounded ${color} opacity-80 hover:opacity-100 cursor-pointer`}
                        title={`Day ${i + 1}: ${uptime.toFixed(1)}% uptime`}
                      />
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>30 days ago</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-security-success rounded" />
                      <span>99.9%+</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-security-warning rounded" />
                      <span>99.0%+</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-security-critical rounded" />
                      <span>&lt;99.0%</span>
                    </div>
                  </div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}