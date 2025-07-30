import { useState, useRef, useEffect } from "react";
import { Terminal, Network, Shield, Lock, Router, Settings, Copy, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommandHistory {
  command: string;
  output: string;
  timestamp: string;
  type: 'success' | 'error' | 'info' | 'warning';
  platform: 'linux' | 'windows' | 'cisco' | 'universal';
}

interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'vpn';
  ip: string;
  status: 'online' | 'offline';
  platform: 'linux' | 'windows' | 'cisco';
}

interface ConfigTemplate {
  name: string;
  category: 'firewall' | 'vpn' | 'routing' | 'switching' | 'access';
  linux: string[];
  windows: string[];
  cisco: string[];
  description: string;
}

const networkDevices: NetworkDevice[] = [
  { id: '1', name: 'Gateway-Router', type: 'router', ip: '192.168.1.1', status: 'online', platform: 'cisco' },
  { id: '2', name: 'Core-Switch', type: 'switch', ip: '192.168.1.2', status: 'online', platform: 'cisco' },
  { id: '3', name: 'Firewall-01', type: 'firewall', ip: '192.168.1.10', status: 'online', platform: 'linux' },
  { id: '4', name: 'VPN-Server', type: 'vpn', ip: '192.168.1.20', status: 'online', platform: 'linux' },
  { id: '5', name: 'DC-01', type: 'router', ip: '192.168.1.30', status: 'online', platform: 'windows' },
];

const configTemplates: ConfigTemplate[] = [
  {
    name: "Firewall Rules",
    category: 'firewall',
    linux: [
      'iptables -A INPUT -p tcp --dport 80 -j ACCEPT',
      'iptables -A INPUT -p tcp --dport 443 -j ACCEPT',
      'iptables -A INPUT -s 192.168.100.0/24 -j DROP',
      'iptables-save > /etc/iptables/rules.v4'
    ],
    windows: [
      'netsh advfirewall firewall add rule name="Allow HTTP" dir=in action=allow protocol=TCP localport=80',
      'netsh advfirewall firewall add rule name="Allow HTTPS" dir=in action=allow protocol=TCP localport=443',
      'netsh advfirewall firewall add rule name="Block Malicious" dir=in action=block remoteip=192.168.100.0/24',
      'netsh advfirewall export "C:\\firewall-backup.wfw"'
    ],
    cisco: [
      'access-list 100 permit tcp any any eq 80',
      'access-list 100 permit tcp any any eq 443',
      'access-list 100 deny ip 192.168.100.0 0.0.0.255 any',
      'interface gigabitethernet0/1',
      'ip access-group 100 in'
    ],
    description: "Basic firewall rules for web traffic and security"
  },
  {
    name: "VPN Configuration",
    category: 'vpn',
    linux: [
      'openvpn --genkey --secret /etc/openvpn/static.key',
      'echo "dev tun" > /etc/openvpn/server.conf',
      'echo "ifconfig 10.8.0.1 10.8.0.2" >> /etc/openvpn/server.conf',
      'systemctl enable openvpn@server',
      'systemctl start openvpn@server'
    ],
    windows: [
      'New-VpnServerConfiguration -TunnelType Sstp -RadiusServer "192.168.1.100"',
      'Add-VpnS2SInterface -Name "Branch-VPN" -Protocol IKEv2 -Destination "203.0.113.1"',
      'Set-VpnServerConfiguration -EncryptionType RequireEncryption',
      'Install-RemoteAccess -VpnType Vpn'
    ],
    cisco: [
      'crypto isakmp policy 10',
      'encryption aes 256',
      'hash sha256',
      'authentication pre-share',
      'group 14',
      'crypto isakmp key cisco123 address 203.0.113.1',
      'crypto ipsec transform-set MYSET esp-aes 256 esp-sha256-hmac'
    ],
    description: "VPN server setup and client configuration"
  },
  {
    name: "Static Routing",
    category: 'routing',
    linux: [
      'ip route add 192.168.2.0/24 via 192.168.1.254',
      'ip route add default via 192.168.1.1',
      'echo "192.168.2.0/24 via 192.168.1.254" >> /etc/network/interfaces',
      'systemctl restart networking'
    ],
    windows: [
      'route add 192.168.2.0 mask 255.255.255.0 192.168.1.254 metric 1',
      'route add 0.0.0.0 mask 0.0.0.0 192.168.1.1 metric 1',
      'route -p add 192.168.2.0 mask 255.255.255.0 192.168.1.254',
      'netsh interface ip show route'
    ],
    cisco: [
      'ip route 192.168.2.0 255.255.255.0 192.168.1.254',
      'ip route 0.0.0.0 0.0.0.0 203.0.113.1',
      'router ospf 1',
      'network 192.168.1.0 0.0.0.255 area 0',
      'exit'
    ],
    description: "Configure static routes and default gateways"
  },
  {
    name: "VLAN Configuration",
    category: 'switching',
    linux: [
      'vconfig add eth0 10',
      'ip addr add 192.168.10.1/24 dev eth0.10',
      'ip link set eth0.10 up',
      'echo "auto eth0.10" >> /etc/network/interfaces',
      'echo "iface eth0.10 inet static" >> /etc/network/interfaces'
    ],
    windows: [
      'New-NetAdapter -Name "VLAN10" -InterfaceDescription "Virtual LAN"',
      'Set-NetAdapter -Name "VLAN10" -VlanID 10',
      'New-NetIPAddress -InterfaceAlias "VLAN10" -IPAddress 192.168.10.1 -PrefixLength 24',
      'Enable-NetAdapter -Name "VLAN10"'
    ],
    cisco: [
      'vlan 10',
      'name SALES',
      'exit',
      'interface gigabitethernet0/1',
      'switchport mode access',
      'switchport access vlan 10',
      'interface vlan 10',
      'ip address 192.168.10.1 255.255.255.0'
    ],
    description: "Create and configure VLANs for network segmentation"
  },
  {
    name: "Access Control",
    category: 'access',
    linux: [
      'useradd -m -s /bin/bash netadmin',
      'usermod -aG sudo netadmin',
      'echo "netadmin ALL=(ALL) NOPASSWD: /sbin/iptables" >> /etc/sudoers',
      'mkdir /home/netadmin/.ssh',
      'chmod 700 /home/netadmin/.ssh'
    ],
    windows: [
      'New-LocalUser -Name "netadmin" -Password (ConvertTo-SecureString "P@ssw0rd!" -AsPlainText -Force)',
      'Add-LocalGroupMember -Group "Administrators" -Member "netadmin"',
      'Set-LocalUser -Name "netadmin" -PasswordNeverExpires $true',
      'Enable-PSRemoting -Force'
    ],
    cisco: [
      'username netadmin privilege 15 secret cisco123',
      'enable secret cisco123',
      'line vty 0 4',
      'login local',
      'transport input ssh',
      'ip ssh version 2',
      'crypto key generate rsa modulus 2048'
    ],
    description: "User management and access control configuration"
  }
];

export function UnifiedNetworkCLI() {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice>(networkDevices[0]);
  const [currentPlatform, setCurrentPlatform] = useState<'linux' | 'windows' | 'cisco'>('linux');
  const [activeTab, setActiveTab] = useState('terminal');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const getPrompt = () => {
    switch (currentPlatform) {
      case 'linux':
        return `root@${selectedDevice.name}:~# `;
      case 'windows':
        return `PS C:\\> `;
      case 'cisco':
        return `${selectedDevice.name}# `;
      default:
        return '$ ';
    }
  };

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    let output = '';
    let type: CommandHistory['type'] = 'success';
    
    // Cross-platform command translations
    const cmd = command.toLowerCase().trim();
    
    // Network diagnostics
    if (cmd.includes('ping')) {
      output = generatePingOutput(command);
    } else if (cmd.includes('tracert') || cmd.includes('traceroute')) {
      output = generateTracerouteOutput();
    } else if (cmd.includes('ipconfig') || cmd.includes('ifconfig') || cmd.includes('ip addr')) {
      output = generateNetworkConfigOutput();
    } else if (cmd.includes('netstat') || cmd.includes('ss')) {
      output = generateNetstatOutput();
    } else if (cmd.includes('route') || cmd.includes('ip route')) {
      output = generateRouteOutput();
    }
    // Firewall commands
    else if (cmd.includes('iptables')) {
      output = executeFirewallCommand(command);
    } else if (cmd.includes('netsh advfirewall')) {
      output = executeWindowsFirewall(command);
    }
    // VPN commands
    else if (cmd.includes('openvpn') || cmd.includes('strongswan')) {
      output = executeVPNCommand(command);
    }
    // Cisco specific
    else if (cmd.includes('show')) {
      output = executeCiscoShow(command);
    } else if (cmd.includes('configure') || cmd.includes('conf t')) {
      output = 'Entering global configuration mode...';
    }
    // System commands
    else if (cmd.includes('help') || cmd === '?') {
      output = generateHelpOutput();
    } else if (cmd.includes('clear') || cmd === 'cls') {
      setHistory([]);
      return;
    } else {
      output = `Command not recognized: ${command}`;
      type = 'error';
    }

    const newEntry: CommandHistory = {
      command,
      output,
      timestamp: new Date().toLocaleTimeString(),
      type,
      platform: currentPlatform
    };

    setHistory(prev => [...prev, newEntry]);
  };

  const generatePingOutput = (command: string) => {
    const target = command.split(' ')[1] || '8.8.8.8';
    return `PING ${target} (${target}): 56 data bytes
64 bytes from ${target}: icmp_seq=1 ttl=55 time=12.3 ms
64 bytes from ${target}: icmp_seq=2 ttl=55 time=11.8 ms
64 bytes from ${target}: icmp_seq=3 ttl=55 time=12.1 ms
64 bytes from ${target}: icmp_seq=4 ttl=55 time=11.9 ms

--- ${target} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
round-trip min/avg/max/stddev = 11.8/12.0/12.3/0.2 ms`;
  };

  const generateTracerouteOutput = () => {
    return `traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
1  192.168.1.1 (192.168.1.1)  1.234 ms  1.156 ms  1.089 ms
2  10.0.0.1 (10.0.0.1)  5.432 ms  5.321 ms  5.234 ms
3  203.0.113.1 (203.0.113.1)  12.345 ms  12.234 ms  12.123 ms
4  8.8.8.8 (8.8.8.8)  15.678 ms  15.567 ms  15.456 ms`;
  };

  const generateNetworkConfigOutput = () => {
    if (currentPlatform === 'windows') {
      return `Windows IP Configuration

Ethernet adapter Local Area Connection:
   Connection-specific DNS Suffix  . : company.local
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1`;
    } else {
      return `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::20c:29ff:fe8e:8c5c  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:8e:8c:5c  txqueuelen 1000  (Ethernet)`;
    }
  };

  const generateNetstatOutput = () => {
    return `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN`;
  };

  const generateRouteOutput = () => {
    if (currentPlatform === 'windows') {
      return `Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0      192.168.1.1    192.168.1.100       1
        127.0.0.0        255.0.0.0         On-link         127.0.0.1     331
      192.168.1.0    255.255.255.0         On-link     192.168.1.100     281`;
    } else {
      return `Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.1.1     0.0.0.0         UG    100    0        0 eth0
192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0`;
    }
  };

  const executeFirewallCommand = (command: string) => {
    if (command.includes('-A INPUT')) {
      return 'Firewall rule added successfully to INPUT chain';
    } else if (command.includes('-L')) {
      return `Chain INPUT (policy ACCEPT)
target     prot opt source               destination
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:http
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:https
DROP       all  --  192.168.100.0/24     anywhere`;
    } else if (command.includes('-F')) {
      return 'All firewall rules flushed';
    }
    return 'Firewall command executed';
  };

  const executeWindowsFirewall = (command: string) => {
    if (command.includes('add rule')) {
      return 'Ok.\nFirewall rule added successfully';
    } else if (command.includes('show allprofiles')) {
      return `Domain Profile Settings:
State                                 ON
Firewall Policy                       BlockInbound,AllowOutbound
LocalFirewallRules                    N/A (GPO-store only)`;
    }
    return 'Windows Firewall command executed';
  };

  const executeVPNCommand = (command: string) => {
    if (command.includes('openvpn')) {
      return 'OpenVPN server started successfully on port 1194';
    } else if (command.includes('strongswan')) {
      return 'StrongSwan IPsec service started';
    }
    return 'VPN command executed';
  };

  const executeCiscoShow = (command: string) => {
    if (command.includes('version')) {
      return `Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.1(4)M4
System uptime is 2 weeks, 3 days, 14 hours, 32 minutes
System returned to ROM by power-on
Last reload reason: power-on`;
    } else if (command.includes('ip route')) {
      return `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
C     192.168.1.0/24 is directly connected, GigabitEthernet0/1`;
    } else if (command.includes('interfaces')) {
      return `GigabitEthernet0/0 is up, line protocol is up
  Hardware is Gigabit Ethernet, address is 1234.5678.9abc (bia 1234.5678.9abc)
  Internet address is 203.0.113.10/30`;
    }
    return 'Cisco command executed';
  };

  const generateHelpOutput = () => {
    const commands = {
      linux: ['ping', 'traceroute', 'ifconfig', 'ip', 'netstat', 'iptables', 'route', 'ss', 'systemctl'],
      windows: ['ping', 'tracert', 'ipconfig', 'netstat', 'netsh', 'route', 'Get-NetAdapter', 'Test-NetConnection'],
      cisco: ['show', 'configure', 'ping', 'traceroute', 'enable', 'disable', 'copy', 'reload', 'debug']
    };
    
    return `Available commands for ${currentPlatform}:\n${commands[currentPlatform].join(', ')}

Network diagnostics: ping, traceroute/tracert, netstat
Configuration: ${currentPlatform === 'cisco' ? 'configure terminal' : currentPlatform === 'windows' ? 'netsh' : 'ip, iptables'}
Help: help, ?
Clear screen: clear${currentPlatform === 'windows' ? '/cls' : ''}`;
  };

  const executeTemplate = (template: ConfigTemplate) => {
    const commands = template[currentPlatform];
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        const entry: CommandHistory = {
          command: cmd,
          output: `Command executed successfully`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'success',
          platform: currentPlatform
        };
        setHistory(prev => [...prev, entry]);
      }, index * 500);
    });
  };

  const exportCommands = () => {
    const commands = history.map(h => `${h.timestamp} [${h.platform}] ${h.command}`).join('\n');
    const blob = new Blob([commands], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-commands-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getOutputColor = (type: CommandHistory['type']) => {
    switch (type) {
      case 'success': return 'text-security-success';
      case 'error': return 'text-security-critical';
      case 'warning': return 'text-security-warning';
      case 'info': return 'text-security-info';
      default: return 'text-muted-foreground';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linux': return '🐧';
      case 'windows': return '🪟';
      case 'cisco': return '🔧';
      default: return '💻';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-neon-blue bg-clip-text text-transparent">
            Unified Network CLI
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedDevice.id} onValueChange={(value) => setSelectedDevice(networkDevices.find(d => d.id === value)!)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {networkDevices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name} ({device.ip})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentPlatform} onValueChange={(value: any) => setCurrentPlatform(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linux">Linux</SelectItem>
              <SelectItem value="windows">Windows</SelectItem>
              <SelectItem value="cisco">Cisco</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terminal" className="flex items-center space-x-2">
            <Terminal className="h-4 w-4" />
            <span>Terminal</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Config Templates</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Device Management</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>{getPlatformIcon(currentPlatform)}</span>
                  <span>{selectedDevice.name} - {currentPlatform.toUpperCase()} Terminal</span>
                  <Badge variant={selectedDevice.status === 'online' ? 'default' : 'destructive'}>
                    {selectedDevice.status}
                  </Badge>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={exportCommands}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setHistory([])}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea 
                ref={terminalRef}
                className="h-96 w-full rounded-md border bg-black/90 p-4 font-mono text-sm"
              >
                <div className="space-y-1">
                  {history.map((entry, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-primary">{getPrompt()}</span>
                        <span className="text-white">{entry.command}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                          onClick={() => copyToClipboard(entry.command)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className={`pl-4 whitespace-pre-wrap ${getOutputColor(entry.type)}`}>
                        {entry.output}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <span className="text-primary">{getPrompt()}</span>
                    <Input
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          executeCommand(currentCommand);
                          setCurrentCommand('');
                        }
                      }}
                      className="border-0 bg-transparent text-white font-mono p-0 focus-visible:ring-0"
                      placeholder="Enter command..."
                    />
                  </div>
                </div>
              </ScrollArea>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Quick Commands:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'help', 'ping 8.8.8.8', 'netstat -an', 'show ip route',
                    currentPlatform === 'linux' ? 'iptables -L' : 
                    currentPlatform === 'windows' ? 'ipconfig /all' : 'show version'
                  ].map((cmd) => (
                    <Badge 
                      key={cmd} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent" 
                      onClick={() => setCurrentCommand(cmd)}
                    >
                      {cmd}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {configTemplates.map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {template.category === 'firewall' && <Shield className="h-5 w-5 text-red-500" />}
                      {template.category === 'vpn' && <Lock className="h-5 w-5 text-blue-500" />}
                      {template.category === 'routing' && <Router className="h-5 w-5 text-green-500" />}
                      {template.category === 'switching' && <Network className="h-5 w-5 text-purple-500" />}
                      {template.category === 'access' && <Settings className="h-5 w-5 text-orange-500" />}
                      <span>{template.name}</span>
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Commands for {currentPlatform}:</p>
                    <ScrollArea className="h-32 w-full rounded border bg-muted/20 p-2">
                      <div className="space-y-1 font-mono text-xs">
                        {template[currentPlatform].map((cmd, cmdIndex) => (
                          <div key={cmdIndex} className="flex items-center justify-between group">
                            <span className="text-muted-foreground">{cmd}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                              onClick={() => copyToClipboard(cmd)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => executeTemplate(template)}
                  >
                    Execute Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {networkDevices.map((device) => (
                  <div 
                    key={device.id} 
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedDevice.id === device.id ? 'border-primary bg-accent/20' : 'hover:bg-accent/10'
                    }`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                        <div>
                          <h4 className="font-medium">{device.name}</h4>
                          <p className="text-sm text-muted-foreground">{device.ip}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {device.type === 'router' && <Router className="h-4 w-4 text-blue-500" />}
                          {device.type === 'switch' && <Network className="h-4 w-4 text-green-500" />}
                          {device.type === 'firewall' && <Shield className="h-4 w-4 text-red-500" />}
                          {device.type === 'vpn' && <Lock className="h-4 w-4 text-purple-500" />}
                          <span className="capitalize">{device.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{getPlatformIcon(device.platform)}</span>
                          <span className="capitalize">{device.platform}</span>
                        </div>
                        <div>
                          <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                            {device.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}