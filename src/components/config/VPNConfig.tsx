import { useState } from "react";
import { Lock, Plus, Trash2, Key, Users, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface VPNConnection {
  id: string;
  name: string;
  type: 'OpenVPN' | 'IPSec' | 'WireGuard' | 'L2TP';
  serverIP: string;
  port: number;
  status: 'connected' | 'disconnected' | 'connecting';
  users: number;
  encryption: string;
  enabled: boolean;
}

interface VPNUser {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'disabled';
  lastConnection: string;
  dataTransferred: string;
}

const initialConnections: VPNConnection[] = [
  { id: '1', name: 'Main Office VPN', type: 'OpenVPN', serverIP: '10.0.1.1', port: 1194, status: 'connected', users: 15, encryption: 'AES-256', enabled: true },
  { id: '2', name: 'Remote Branch', type: 'IPSec', serverIP: '192.168.100.1', port: 500, status: 'connected', users: 8, encryption: 'AES-128', enabled: true },
  { id: '3', name: 'Mobile Workers', type: 'WireGuard', serverIP: '10.0.2.1', port: 51820, status: 'disconnected', users: 0, encryption: 'ChaCha20', enabled: false },
];

const vpnUsers: VPNUser[] = [
  { id: '1', username: 'john.doe', email: 'john@company.com', status: 'active', lastConnection: '2 min ago', dataTransferred: '145 MB' },
  { id: '2', username: 'jane.smith', email: 'jane@company.com', status: 'active', lastConnection: '15 min ago', dataTransferred: '67 MB' },
  { id: '3', username: 'bob.wilson', email: 'bob@company.com', status: 'disabled', lastConnection: '2 days ago', dataTransferred: '23 MB' },
];

export function VPNConfig() {
  const [connections, setConnections] = useState<VPNConnection[]>(initialConnections);
  const [users, setUsers] = useState<VPNUser[]>(vpnUsers);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'OpenVPN' as VPNConnection['type'],
    serverIP: '',
    port: 1194,
    encryption: 'AES-256'
  });

  const addConnection = () => {
    if (!newConnection.name || !newConnection.serverIP) return;
    
    const connection: VPNConnection = {
      id: Date.now().toString(),
      name: newConnection.name,
      type: newConnection.type,
      serverIP: newConnection.serverIP,
      port: newConnection.port,
      status: 'disconnected',
      users: 0,
      encryption: newConnection.encryption,
      enabled: false
    };
    
    setConnections([...connections, connection]);
    setNewConnection({
      name: '',
      type: 'OpenVPN',
      serverIP: '',
      port: 1194,
      encryption: 'AES-256'
    });
  };

  const toggleConnection = (id: string) => {
    setConnections(connections.map(conn => 
      conn.id === id ? { 
        ...conn, 
        enabled: !conn.enabled,
        status: !conn.enabled ? 'connecting' : 'disconnected'
      } : conn
    ));
  };

  const deleteConnection = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id));
  };

  const getStatusBadge = (status: VPNConnection['status']) => {
    const variants = {
      connected: 'border-security-success text-security-success',
      disconnected: 'border-security-critical text-security-critical',
      connecting: 'border-security-warning text-security-warning'
    };
    return <Badge variant="outline" className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getUserStatusBadge = (status: VPNUser['status']) => {
    const variants = {
      active: 'border-security-success text-security-success',
      disabled: 'border-security-critical text-security-critical'
    };
    return <Badge variant="outline" className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <Tabs defaultValue="connections" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="connections">VPN Connections</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="certificates">Certificates</TabsTrigger>
        <TabsTrigger value="settings">VPN Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="connections" className="space-y-6">
        {/* Add New VPN Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>Add VPN Connection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="vpnName">Connection Name</Label>
                <Input
                  id="vpnName"
                  value={newConnection.name}
                  onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                  placeholder="Enter VPN name"
                />
              </div>
              <div>
                <Label htmlFor="vpnType">VPN Type</Label>
                <Select value={newConnection.type} onValueChange={(value: any) => setNewConnection({...newConnection, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OpenVPN">OpenVPN</SelectItem>
                    <SelectItem value="IPSec">IPSec</SelectItem>
                    <SelectItem value="WireGuard">WireGuard</SelectItem>
                    <SelectItem value="L2TP">L2TP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serverIP">Server IP</Label>
                <Input
                  id="serverIP"
                  value={newConnection.serverIP}
                  onChange={(e) => setNewConnection({...newConnection, serverIP: e.target.value})}
                  placeholder="192.168.1.100"
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  value={newConnection.port}
                  onChange={(e) => setNewConnection({...newConnection, port: parseInt(e.target.value)})}
                  placeholder="1194"
                />
              </div>
              <div>
                <Label htmlFor="encryption">Encryption</Label>
                <Select value={newConnection.encryption} onValueChange={(value) => setNewConnection({...newConnection, encryption: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AES-256">AES-256</SelectItem>
                    <SelectItem value="AES-128">AES-128</SelectItem>
                    <SelectItem value="ChaCha20">ChaCha20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={addConnection} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Connection</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* VPN Connections List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <span>VPN Connections ({connections.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                    <div>
                      <h4 className="font-medium">{connection.name}</h4>
                      <p className="text-sm text-muted-foreground">{connection.type}</p>
                    </div>
                    <div>{getStatusBadge(connection.status)}</div>
                    <div className="text-sm">
                      <div>IP: {connection.serverIP}</div>
                      <div>Port: {connection.port}</div>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{connection.users} users</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div>Encryption: {connection.encryption}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch
                        checked={connection.enabled}
                        onCheckedChange={() => toggleConnection(connection.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteConnection(connection.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>VPN Users ({users.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                    <div>
                      <h4 className="font-medium">{user.username}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>{getUserStatusBadge(user.status)}</div>
                    <div className="text-sm">
                      <div>Last: {user.lastConnection}</div>
                    </div>
                    <div className="text-sm">
                      <div>Data: {user.dataTransferred}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="certificates" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-primary" />
              <span>Certificate Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Manage SSL/TLS certificates for VPN connections
              </div>
              <div className="grid gap-4">
                {[
                  { name: "Root CA Certificate", expires: "2025-12-31", status: "Valid" },
                  { name: "Server Certificate", expires: "2024-06-15", status: "Valid" },
                  { name: "Client Certificate Template", expires: "2024-12-31", status: "Valid" },
                ].map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">Expires: {cert.expires}</p>
                    </div>
                    <Badge variant="outline" className="border-security-success text-security-success">
                      {cert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Global VPN Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="dnsServer">DNS Server</Label>
                  <Input id="dnsServer" value="8.8.8.8, 8.8.4.4" />
                </div>
                <div>
                  <Label htmlFor="defaultGateway">Default Gateway</Label>
                  <Input id="defaultGateway" value="10.0.0.1" />
                </div>
                <div>
                  <Label htmlFor="ipPool">IP Pool Range</Label>
                  <Input id="ipPool" value="10.0.1.100-10.0.1.200" />
                </div>
                <div>
                  <Label htmlFor="maxUsers">Max Concurrent Users</Label>
                  <Input id="maxUsers" type="number" value="100" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Security Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="forceEncryption">Force Encryption</Label>
                    <Switch id="forceEncryption" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowSplitTunnel">Allow Split Tunneling</Label>
                    <Switch id="allowSplitTunnel" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableLogging">Enable Connection Logging</Label>
                    <Switch id="enableLogging" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}