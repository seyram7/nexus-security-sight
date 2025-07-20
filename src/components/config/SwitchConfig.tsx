import { useState } from "react";
import { Network, Settings, Activity, Terminal, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

interface SwitchDevice {
  id: string;
  name: string;
  ip: string;
  model: string;
  status: 'online' | 'offline' | 'warning';
  ports: number;
  activePorts: number;
  uptime: string;
  firmware: string;
}

interface VLANConfig {
  id: number;
  name: string;
  ports: number[];
  description: string;
  status: 'active' | 'inactive';
}

interface PortConfig {
  port: number;
  status: 'up' | 'down' | 'disabled';
  speed: string;
  duplex: 'full' | 'half';
  vlan: number;
  description: string;
}

const switches: SwitchDevice[] = [
  { id: '1', name: 'Core-SW-01', ip: '192.168.1.10', model: 'Cisco Catalyst 2960', status: 'online', ports: 48, activePorts: 32, uptime: '45 days', firmware: '15.2.4' },
  { id: '2', name: 'Access-SW-02', ip: '192.168.1.11', model: 'HP ProCurve 2510', status: 'online', ports: 24, activePorts: 18, uptime: '23 days', firmware: '11.15' },
  { id: '3', name: 'DMZ-SW-03', ip: '192.168.1.12', model: 'Netgear M4100', status: 'warning', ports: 12, activePorts: 8, uptime: '12 days', firmware: '10.0.1' },
];

const vlans: VLANConfig[] = [
  { id: 10, name: 'Management', ports: [1, 2, 3], description: 'Network management VLAN', status: 'active' },
  { id: 20, name: 'Users', ports: [4, 5, 6, 7, 8, 9, 10, 11, 12], description: 'User workstations', status: 'active' },
  { id: 30, name: 'Servers', ports: [13, 14, 15, 16], description: 'Server network', status: 'active' },
  { id: 40, name: 'DMZ', ports: [17, 18], description: 'Demilitarized zone', status: 'active' },
  { id: 50, name: 'Guest', ports: [19, 20], description: 'Guest network access', status: 'inactive' },
];

const portConfigs: PortConfig[] = Array.from({ length: 24 }, (_, i) => ({
  port: i + 1,
  status: i < 18 ? 'up' : i < 22 ? 'down' : 'disabled',
  speed: i < 16 ? '1000 Mbps' : '100 Mbps',
  duplex: 'full',
  vlan: i < 3 ? 10 : i < 12 ? 20 : i < 16 ? 30 : i < 18 ? 40 : 50,
  description: i < 3 ? 'Management' : i < 12 ? `User-${i - 2}` : i < 16 ? `Server-${i - 11}` : i < 18 ? `DMZ-${i - 15}` : `Guest-${i - 17}`
}));

export function SwitchConfig() {
  const [selectedSwitch, setSelectedSwitch] = useState<SwitchDevice>(switches[0]);
  const [commands, setCommands] = useState<string[]>([
    'show version',
    'show interface status',
    'show vlan brief'
  ]);
  const [currentCommand, setCurrentCommand] = useState('');

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    let output = '';
    switch (command.toLowerCase()) {
      case 'show version':
        output = `Cisco IOS Software Version: ${selectedSwitch.firmware}\nUptime: ${selectedSwitch.uptime}\nModel: ${selectedSwitch.model}`;
        break;
      case 'show interface status':
        output = 'Port  Status     Vlan       Duplex  Speed\nGi0/1 connected   10         full    1000\nGi0/2 connected   20         full    1000';
        break;
      case 'show vlan brief':
        output = 'VLAN Name                  Status    Ports\n10   Management            active    Gi0/1-3\n20   Users                 active    Gi0/4-12';
        break;
      case 'show spanning-tree':
        output = 'Spanning tree enabled protocol ieee\nRoot ID    Priority    32768\nBridge ID  Priority    32768';
        break;
      default:
        output = `% Invalid command: ${command}`;
    }

    setCommands(prev => [...prev, `${selectedSwitch.name}# ${command}`, output, '']);
  };

  const getStatusBadge = (status: SwitchDevice['status']) => {
    const variants = {
      online: 'border-security-success text-security-success',
      offline: 'border-security-critical text-security-critical',
      warning: 'border-security-warning text-security-warning'
    };
    return <Badge variant="outline" className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getPortStatusColor = (status: PortConfig['status']) => {
    switch (status) {
      case 'up': return 'text-security-success';
      case 'down': return 'text-security-critical';
      case 'disabled': return 'text-muted-foreground';
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Switch Overview</TabsTrigger>
        <TabsTrigger value="ports">Port Configuration</TabsTrigger>
        <TabsTrigger value="vlans">VLAN Management</TabsTrigger>
        <TabsTrigger value="cli">Switch CLI</TabsTrigger>
        <TabsTrigger value="monitoring">Port Monitoring</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-primary" />
              <span>Network Switches ({switches.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {switches.map((sw) => (
                <div key={sw.id} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                     onClick={() => setSelectedSwitch(sw)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                      <div>
                        <h4 className="font-medium">{sw.name}</h4>
                        <p className="text-sm text-muted-foreground">{sw.ip}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sw.model}</p>
                        <p className="text-xs text-muted-foreground">Firmware: {sw.firmware}</p>
                      </div>
                      <div>{getStatusBadge(sw.status)}</div>
                      <div className="text-sm">
                        <div>{sw.activePorts}/{sw.ports} ports active</div>
                        <Progress value={(sw.activePorts / sw.ports) * 100} className="h-1 mt-1" />
                      </div>
                      <div className="text-sm">
                        <div>Uptime: {sw.uptime}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Switch: {selectedSwitch.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Management IP</Label>
                <Input value={selectedSwitch.ip} />
              </div>
              <div className="space-y-2">
                <Label>SNMP Community</Label>
                <Input value="public" />
              </div>
              <div className="space-y-2">
                <Label>SSH Access</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Enabled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ports" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Port Configuration - {selectedSwitch.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                {portConfigs.map((port) => (
                  <div key={port.port} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <span className="w-12 font-mono">{port.port}</span>
                      <span className={`w-16 ${getPortStatusColor(port.status)}`}>{port.status}</span>
                      <span className="w-24">{port.speed}</span>
                      <span className="w-16">{port.duplex}</span>
                      <span className="w-16">VLAN {port.vlan}</span>
                      <span className="flex-1">{port.description}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Configure</Button>
                      <Switch checked={port.status !== 'disabled'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vlans" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-primary" />
              <span>VLAN Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vlans.map((vlan) => (
                <div key={vlan.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">VLAN {vlan.id} - {vlan.name}</h4>
                      <Badge variant={vlan.status === 'active' ? 'default' : 'secondary'}>
                        {vlan.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Switch checked={vlan.status === 'active'} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{vlan.description}</p>
                  <p className="text-sm">
                    <span className="font-medium">Ports:</span> {vlan.ports.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cli" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span>Switch Command Line - {selectedSwitch.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 w-full rounded-md border bg-black/50 p-4 mb-4">
              <div className="space-y-1 font-mono text-sm">
                {commands.map((line, index) => (
                  <div key={index} className={line.startsWith(selectedSwitch.name) ? 'text-primary' : 'text-security-success'}>
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-primary">{selectedSwitch.name}#</span>
              <Input
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand(currentCommand);
                    setCurrentCommand('');
                  }
                }}
                placeholder="Enter switch command..."
                className="font-mono"
              />
              <Button onClick={() => { executeCommand(currentCommand); setCurrentCommand(''); }}>
                Execute
              </Button>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Common Commands:</p>
              <div className="flex flex-wrap gap-2">
                {['show version', 'show interface status', 'show vlan brief', 'show spanning-tree', 'show mac address-table'].map((cmd) => (
                  <Badge key={cmd} variant="outline" className="cursor-pointer" onClick={() => setCurrentCommand(cmd)}>
                    {cmd}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Real-time Port Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">Port Utilization</h4>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((port) => (
                    <div key={port} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Port {port}</span>
                        <span>{Math.floor(Math.random() * 80 + 10)}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 80 + 10)} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Traffic Statistics</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Total Packets', value: '1,234,567' },
                    { label: 'Errors', value: '12' },
                    { label: 'Dropped', value: '5' },
                    { label: 'Collisions', value: '0' },
                  ].map((stat, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{stat.label}</span>
                      <span className="font-mono">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}