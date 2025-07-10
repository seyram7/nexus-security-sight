import { Users, User, Shield, Clock, MapPin, Monitor } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ConnectedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockUsers = [
  {
    id: "USR-001",
    name: "John Mitchell",
    email: "j.mitchell@company.com",
    role: "Administrator",
    status: "active",
    location: "New York Office",
    device: "Workstation-042",
    loginTime: "09:15 AM",
    lastActivity: "2 minutes ago",
    sessionDuration: "4h 23m",
    ipAddress: "192.168.1.45"
  },
  {
    id: "USR-002",
    name: "Sarah Chen",
    email: "s.chen@company.com",
    role: "Security Analyst",
    status: "active",
    location: "San Francisco Office",
    device: "Laptop-SF-012",
    loginTime: "08:30 AM",
    lastActivity: "5 minutes ago",
    sessionDuration: "5h 8m",
    ipAddress: "192.168.2.78"
  },
  {
    id: "USR-003",
    name: "Mike Rodriguez",
    email: "m.rodriguez@company.com",
    role: "Developer",
    status: "idle",
    location: "Remote",
    device: "Home-Device-001",
    loginTime: "10:00 AM",
    lastActivity: "45 minutes ago",
    sessionDuration: "3h 38m",
    ipAddress: "203.45.67.89"
  },
  {
    id: "USR-004",
    name: "Emma Thompson",
    email: "e.thompson@company.com",
    role: "Manager",
    status: "active",
    location: "London Office",
    device: "Executive-Laptop-04",
    loginTime: "02:15 PM",
    lastActivity: "1 minute ago",
    sessionDuration: "1h 45m",
    ipAddress: "192.168.3.22"
  },
  {
    id: "USR-005",
    name: "David Kim",
    email: "d.kim@company.com",
    role: "Intern",
    status: "away",
    location: "Chicago Office",
    device: "Intern-Station-07",
    loginTime: "11:30 AM",
    lastActivity: "1 hour ago",
    sessionDuration: "2h 30m",
    ipAddress: "192.168.4.156"
  }
];

export function ConnectedUsersModal({ isOpen, onClose }: ConnectedUsersModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-security-success text-white">Active</Badge>;
      case 'idle':
        return <Badge className="bg-security-warning text-black">Idle</Badge>;
      case 'away':
        return <Badge className="bg-security-neutral text-white">Away</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const color = role === 'Administrator' ? 'bg-primary text-white' : 
                 role === 'Manager' ? 'bg-secondary text-white' : 
                 'bg-muted text-muted-foreground';
    return <Badge className={color}>{role}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-primary" />
            <span>Connected Users ({mockUsers.length})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search users..."
              className="max-w-sm"
            />
            <div className="flex space-x-2">
              <Button variant="outline">Export Report</Button>
              <Button>Refresh</Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-security-success">
                {mockUsers.filter(u => u.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="p-4 border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-security-warning">
                {mockUsers.filter(u => u.status === 'idle').length}
              </div>
              <div className="text-sm text-muted-foreground">Idle Users</div>
            </div>
            <div className="p-4 border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-security-neutral">
                {mockUsers.filter(u => u.status === 'away').length}
              </div>
              <div className="text-sm text-muted-foreground">Away Users</div>
            </div>
            <div className="p-4 border border-border rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">
                {mockUsers.filter(u => u.location.includes('Remote')).length}
              </div>
              <div className="text-sm text-muted-foreground">Remote Users</div>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Session Time</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="text-xs text-muted-foreground font-mono">{user.ipAddress}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Monitor className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.device}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{user.sessionDuration}</div>
                        <div className="text-xs text-muted-foreground">Since {user.loginTime}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.lastActivity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">Message</Button>
                        <Button variant="ghost" size="sm">Disconnect</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Showing {mockUsers.length} of {mockUsers.length} users
            </div>
            <div className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}