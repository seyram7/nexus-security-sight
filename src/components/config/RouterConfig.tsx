import { useState } from "react";
import { Router, Globe, Route, Terminal, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RouterDevice {
  id: string;
  name: string;
  ip: string;
  model: string;
  status: 'online' | 'offline' | 'warning';
  interfaces: number;
  uptime: string;
  firmware: string;
  memory: number;
  cpu: number;
}

interface RoutingEntry {
  destination: string;
  gateway: string;
  interface: string;
  metric: number;
  protocol: 'static' | 'ospf' | 'bgp' | 'rip';
  status: 'active' | 'inactive';
}

interface InterfaceConfig {
  name: string;
  ip: string;
  subnet: string;
  status: 'up' | 'down' | 'administratively down';
  speed: string;
  description: string;
}

const routers: RouterDevice[] = [
  { id: '1', name: 'Gateway-RT-01', ip: '192.168.1.1', model: 'Cisco ISR 4331', status: 'online', interfaces: 4, uptime: '67 days', firmware: '16.09.03', memory: 85, cpu: 12 },
  { id: '2', name: 'Branch-RT-02', ip: '10.0.1.1', model: 'Juniper SRX300', status: 'online', interfaces: 8, uptime: '34 days', firmware: '18.4R2', memory: 67, cpu: 8 },
  { id: '3', name: 'DMZ-RT-03', ip: '172.16.1.1', model: 'pfSense SG-3100', status: 'warning', interfaces: 4, uptime: '12 days', firmware: '2.6.0', memory: 92, cpu: 25 },
];

const routingTable: RoutingEntry[] = [
  { destination: '0.0.0.0/0', gateway: '203.0.113.1', interface: 'GigE0/0', metric: 1, protocol: 'static', status: 'active' },
  { destination: '10.0.0.0/8', gateway: '192.168.1.2', interface: 'GigE0/1', metric: 10, protocol: 'ospf', status: 'active' },
  { destination: '172.16.0.0/12', gateway: '192.168.1.3', interface: 'GigE0/2', metric: 20, protocol: 'static', status: 'active' },
  { destination: '192.168.0.0/16', gateway: '0.0.0.0', interface: 'GigE0/1', metric: 0, protocol: 'static', status: 'active' },
];

const interfaces: InterfaceConfig[] = [
  { name: 'GigE0/0', ip: '203.0.113.10', subnet: '255.255.255.252', status: 'up', speed: '1000 Mbps', description: 'WAN Interface' },
  { name: 'GigE0/1', ip: '192.168.1.1', subnet: '255.255.255.0', status: 'up', speed: '1000 Mbps', description: 'LAN Interface' },
  { name: 'GigE0/2', ip: '172.16.1.1', subnet: '255.255.255.0', status: 'up', speed: '1000 Mbps', description: 'DMZ Interface' },
  { name: 'GigE0/3', ip: '10.0.1.1', subnet: '255.255.255.0', status: 'administratively down', speed: '1000 Mbps', description: 'Unused' },
];

export function RouterConfig() {
  const [selectedRouter, setSelectedRouter] = useState<RouterDevice>(routers[0]);
  const [commands, setCommands] = useState<string[]>([
    'Router> enable',
    'Router# show version',
    'Router# show ip route'
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [newRoute, setNewRoute] = useState({
    destination: '',
    gateway: '',
    interface: 'GigE0/0'
  });

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    let output = '';
    switch (command.toLowerCase()) {
      case 'show version':
        output = `Router Model: ${selectedRouter.model}\nFirmware: ${selectedRouter.firmware}\nUptime: ${selectedRouter.uptime}\nMemory: ${selectedRouter.memory}% used`;
        break;
      case 'show ip route':
        output = 'Codes: C - connected, S - static, O - OSPF\nGateway of last resort is 203.0.113.1 to network 0.0.0.0\nS    0.0.0.0/0 [1/0] via 203.0.113.1\nC    192.168.1.0/24 is directly connected, GigabitEthernet0/1';
        break;
      case 'show interfaces':
        output = 'GigabitEthernet0/0 is up, line protocol is up\n  Hardware is Gigabit Ethernet, address is 1234.5678.9abc\n  Internet address is 203.0.113.10/30';
        break;
      case 'show running-config':
        output = 'Building configuration...\nCurrent configuration : 2048 bytes\nhostname Gateway-RT-01\ninterface GigabitEthernet0/0\n ip address 203.0.113.10 255.255.255.252';
        break;
      default:
        output = `% Invalid command: ${command}`;
    }

    setCommands(prev => [...prev, `${selectedRouter.name}# ${command}`, output, '']);
  };

  const addRoute = () => {
    if (!newRoute.destination || !newRoute.gateway) return;
    
    const route: RoutingEntry = {
      destination: newRoute.destination,
      gateway: newRoute.gateway,
      interface: newRoute.interface,
      metric: 1,
      protocol: 'static',
      status: 'active'
    };
    
    // In real implementation, this would update the routing table
    setNewRoute({ destination: '', gateway: '', interface: 'GigE0/0' });
  };

  const getStatusBadge = (status: RouterDevice['status']) => {
    const variants = {
      online: 'border-security-success text-security-success',
      offline: 'border-security-critical text-security-critical',
      warning: 'border-security-warning text-security-warning'
    };
    return <Badge variant="outline" className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getInterfaceStatusColor = (status: InterfaceConfig['status']) => {
    switch (status) {
      case 'up': return 'text-security-success';
      case 'down': return 'text-security-critical';
      case 'administratively down': return 'text-muted-foreground';
    }
  };

  const getProtocolBadge = (protocol: RoutingEntry['protocol']) => {
    const colors = {
      static: 'border-blue-500 text-blue-500',
      ospf: 'border-green-500 text-green-500',
      bgp: 'border-purple-500 text-purple-500',
      rip: 'border-orange-500 text-orange-500'
    };
    return <Badge variant="outline" className={colors[protocol]}>{protocol.toUpperCase()}</Badge>;
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Router Overview</TabsTrigger>
        <TabsTrigger value="interfaces">Interfaces</TabsTrigger>
        <TabsTrigger value="routing">Routing Table</TabsTrigger>
        <TabsTrigger value="cli">Router CLI</TabsTrigger>
        <TabsTrigger value="monitoring">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Router className="h-5 w-5 text-primary" />
              <span>Network Routers ({routers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routers.map((router) => (
                <div key={router.id} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                     onClick={() => setSelectedRouter(router)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                      <div>
                        <h4 className="font-medium">{router.name}</h4>
                        <p className="text-sm text-muted-foreground">{router.ip}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{router.model}</p>
                        <p className="text-xs text-muted-foreground">FW: {router.firmware}</p>
                      </div>
                      <div>{getStatusBadge(router.status)}</div>
                      <div className="text-sm">
                        <div>{router.interfaces} interfaces</div>
                        <div>Uptime: {router.uptime}</div>
                      </div>
                      <div className="text-sm">
                        <div>CPU: {router.cpu}%</div>
                        <div>Memory: {router.memory}%</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Configure</Button>
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
            <CardTitle>Router Configuration: {selectedRouter.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Hostname</Label>
                <Input value={selectedRouter.name} />
              </div>
              <div className="space-y-2">
                <Label>Domain Name</Label>
                <Input value="company.local" />
              </div>
              <div className="space-y-2">
                <Label>Enable Secret</Label>
                <Input type="password" value="••••••••" />
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
              <div className="space-y-2">
                <Label>HTTP Server</Label>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm">Disabled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="interfaces" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Interface Configuration - {selectedRouter.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interfaces.map((iface) => (
                <div key={iface.name} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{iface.name}</h4>
                      <span className={`text-sm ${getInterfaceStatusColor(iface.status)}`}>
                        {iface.status}
                      </span>
                      <Badge variant="outline">{iface.speed}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Configure</Button>
                      <Switch checked={iface.status === 'up'} />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <Label>IP Address</Label>
                      <Input value={iface.ip} />
                    </div>
                    <div>
                      <Label>Subnet Mask</Label>
                      <Input value={iface.subnet} />
                    </div>
                    <div>
                      <Label>Speed</Label>
                      <Select value={iface.speed}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="1000 Mbps">1000 Mbps</SelectItem>
                          <SelectItem value="100 Mbps">100 Mbps</SelectItem>
                          <SelectItem value="10 Mbps">10 Mbps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={iface.description} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="routing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Route className="h-5 w-5 text-primary" />
              <span>Routing Table</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-accent/20">
                <h4 className="font-medium mb-3">Add Static Route</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <Label>Destination Network</Label>
                    <Input 
                      value={newRoute.destination}
                      onChange={(e) => setNewRoute({...newRoute, destination: e.target.value})}
                      placeholder="192.168.2.0/24"
                    />
                  </div>
                  <div>
                    <Label>Gateway</Label>
                    <Input 
                      value={newRoute.gateway}
                      onChange={(e) => setNewRoute({...newRoute, gateway: e.target.value})}
                      placeholder="192.168.1.254"
                    />
                  </div>
                  <div>
                    <Label>Interface</Label>
                    <Select value={newRoute.interface} onValueChange={(value) => setNewRoute({...newRoute, interface: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {interfaces.map((iface) => (
                          <SelectItem key={iface.name} value={iface.name}>{iface.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addRoute} className="w-full">Add Route</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {routingTable.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                      <div className="font-mono text-sm">{route.destination}</div>
                      <div className="font-mono text-sm">{route.gateway}</div>
                      <div>{route.interface}</div>
                      <div>Metric: {route.metric}</div>
                      <div>{getProtocolBadge(route.protocol)}</div>
                      <div className="flex space-x-2">
                        <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                          {route.status}
                        </Badge>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="cli" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span>Router Command Line - {selectedRouter.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 w-full rounded-md border bg-black/50 p-4 mb-4">
              <div className="space-y-1 font-mono text-sm">
                {commands.map((line, index) => (
                  <div key={index} className={line.includes('#') ? 'text-primary' : 'text-security-success'}>
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm text-primary">{selectedRouter.name}#</span>
              <Input
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand(currentCommand);
                    setCurrentCommand('');
                  }
                }}
                placeholder="Enter router command..."
                className="font-mono"
              />
              <Button onClick={() => { executeCommand(currentCommand); setCurrentCommand(''); }}>
                Execute
              </Button>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Common Commands:</p>
              <div className="flex flex-wrap gap-2">
                {['show version', 'show ip route', 'show interfaces', 'show running-config', 'show ip ospf neighbors'].map((cmd) => (
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
              <Settings className="h-5 w-5 text-primary" />
              <span>Performance Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">System Resources</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{selectedRouter.cpu}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{width: `${selectedRouter.cpu}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{selectedRouter.memory}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-security-warning h-2 rounded-full" style={{width: `${selectedRouter.memory}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Interface Statistics</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Packets In', value: '2,456,789' },
                    { label: 'Packets Out', value: '1,987,654' },
                    { label: 'Bytes In', value: '1.2 GB' },
                    { label: 'Bytes Out', value: '987 MB' },
                    { label: 'Errors', value: '0' },
                    { label: 'Drops', value: '12' },
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