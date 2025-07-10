export const mockNetworkData = [
  { time: '00:00', traffic: 45, threats: 2, blocked: 8 },
  { time: '02:00', traffic: 38, threats: 1, blocked: 5 },
  { time: '04:00', traffic: 32, threats: 0, blocked: 3 },
  { time: '06:00', traffic: 48, threats: 3, blocked: 12 },
  { time: '08:00', traffic: 72, threats: 5, blocked: 18 },
  { time: '10:00', traffic: 85, threats: 4, blocked: 22 },
  { time: '12:00', traffic: 92, threats: 6, blocked: 28 },
  { time: '14:00', traffic: 88, threats: 3, blocked: 15 },
  { time: '16:00', traffic: 78, threats: 2, blocked: 11 },
  { time: '18:00', traffic: 65, threats: 4, blocked: 19 },
  { time: '20:00', traffic: 58, threats: 1, blocked: 7 },
  { time: '22:00', traffic: 52, threats: 2, blocked: 9 },
];

export const mockThreats = [
  {
    id: '1',
    type: 'malware' as const,
    severity: 'critical' as const,
    source: '192.168.1.45',
    target: 'WebServer-01',
    timestamp: '2 minutes ago',
    description: 'Suspicious file execution detected'
  },
  {
    id: '2',
    type: 'intrusion' as const,
    severity: 'high' as const,
    source: '10.0.0.23',
    target: 'Database-Server',
    timestamp: '8 minutes ago',
    description: 'Unauthorized access attempt'
  },
  {
    id: '3',
    type: 'vulnerability' as const,
    severity: 'medium' as const,
    source: 'External',
    target: 'Mail-Server',
    timestamp: '15 minutes ago',
    description: 'Outdated SSL certificate detected'
  }
];

export const mockMetrics = [
  {
    title: "Protected Devices",
    value: 247,
    change: "+12 from last week",
    type: "devices" as const
  },
  {
    title: "Active Threats",
    value: 3,
    change: "2 resolved today",
    type: "threats" as const
  },
  {
    title: "Blocked Attacks",
    value: "1,847",
    change: "+89 in last 24h",
    type: "attacks" as const
  },
  {
    title: "Network Uptime",
    value: "99.8%",
    change: "99.5% last month",
    type: "uptime" as const
  },
  {
    title: "Connected Users",
    value: 156,
    change: "+23 since morning",
    type: "users" as const
  }
];