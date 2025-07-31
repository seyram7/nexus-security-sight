import { Monitor, Smartphone, Laptop, Server, Shield, AlertTriangle, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProtectedDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockDevices = [
  {
    id: "DEV-001",
    name: "Main Server",
    type: "server",
    ip: "192.168.1.10",
    status: "secure",
    lastScan: "2 minutes ago",
    threats: 0,
    os: "Ubuntu 22.04"
  },
  {
    id: "DEV-002",
    name: "Workstation-042",
    type: "laptop",
    ip: "192.168.1.45",
    status: "warning",
    lastScan: "15 minutes ago",
    threats: 2,
    os: "Windows 11"
  },
  {
    id: "DEV-003",
    name: "Database Server",
    type: "server",
    ip: "192.168.1.20",
    status: "secure",
    lastScan: "5 minutes ago",
    threats: 0,
    os: "CentOS 8"
  },
  {
    id: "DEV-004",
    name: "Mobile Device",
    type: "smartphone",
    ip: "192.168.1.78",
    status: "secure",
    lastScan: "1 hour ago",
    threats: 0,
    os: "iOS 17"
  },
  {
    id: "DEV-005",
    name: "Reception Kiosk",
    type: "monitor",
    ip: "192.168.1.95",
    status: "critical",
    lastScan: "3 hours ago",
    threats: 5,
    os: "Windows 10"
  }
];

export function ProtectedDevicesModal({ isOpen, onClose }: ProtectedDevicesModalProps) {
  const { toast } = useToast();
  const [scanning, setScanning] = useState<string | null>(null);
  const [scanningAll, setScanningAll] = useState(false);
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'laptop': return Laptop;
      case 'smartphone': return Smartphone;
      case 'monitor': return Monitor;
      default: return Monitor;
    }
  };

  const getStatusBadge = (status: string, threats: number) => {
    if (status === 'critical' || threats > 3) {
      return <Badge className="bg-security-critical text-white">Critical</Badge>;
    }
    if (status === 'warning' || threats > 0) {
      return <Badge className="bg-security-warning text-black">Warning</Badge>;
    }
    return <Badge className="bg-security-success text-white">Secure</Badge>;
  };

  const handleQuickScan = (deviceId: string, deviceName: string) => {
    setScanning(deviceId);
    toast({
      title: "Quick Scan Started",
      description: `Initiating quick scan for ${deviceName}...`,
    });
    
    // Simulate scan duration
    setTimeout(() => {
      setScanning(null);
      toast({
        title: "Quick Scan Complete",
        description: `${deviceName} scan completed successfully.`,
      });
    }, 2000);
  };

  const handleForceQuickScanAll = () => {
    setScanningAll(true);
    toast({
      title: "Force Quick Scan Initiated",
      description: "Starting quick scan on all devices...",
    });
    
    // Simulate scan duration for all devices
    setTimeout(() => {
      setScanningAll(false);
      toast({
        title: "Force Quick Scan Complete",
        description: `All ${mockDevices.length} devices scanned successfully.`,
      });
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span>Protected Devices ({mockDevices.length})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search devices..."
              className="flex-1"
            />
            <Button variant="outline">Add Device</Button>
            <Button 
              onClick={handleForceQuickScanAll}
              disabled={scanningAll}
              className="flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>{scanningAll ? "Scanning..." : "Force Quick Scan All"}</span>
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Operating System</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Threats</TableHead>
                  <TableHead>Last Scan</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DeviceIcon className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-muted-foreground">{device.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{device.type}</TableCell>
                      <TableCell className="font-mono text-sm">{device.ip}</TableCell>
                      <TableCell>{device.os}</TableCell>
                      <TableCell>
                        {getStatusBadge(device.status, device.threats)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {device.threats > 0 && (
                            <AlertTriangle className="h-4 w-4 text-security-warning" />
                          )}
                          <span>{device.threats}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {device.lastScan}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuickScan(device.id, device.name)}
                            disabled={scanning === device.id || scanningAll}
                            className="flex items-center space-x-1"
                          >
                            <Zap className="h-3 w-3" />
                            <span>{scanning === device.id ? "Scanning..." : "Quick Scan"}</span>
                          </Button>
                          <Button variant="ghost" size="sm">Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Showing {mockDevices.length} of {mockDevices.length} devices
            </div>
            <div className="flex space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-security-success rounded-full" />
                <span>Secure: {mockDevices.filter(d => d.status === 'secure').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-security-warning rounded-full" />
                <span>Warning: {mockDevices.filter(d => d.status === 'warning').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-security-critical rounded-full" />
                <span>Critical: {mockDevices.filter(d => d.status === 'critical').length}</span>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}