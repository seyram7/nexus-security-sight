import { SecurityCard } from "./SecurityCard";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Zap, 
  Server,
  Users,
  Database
} from "lucide-react";

interface MetricsData {
  totalDevices: number;
  activeThreats: number;
  blockedAttacks: number;
  networkUptime: string;
  bandwidth: string;
  connectedUsers: number;
  dataProtected: string;
  systemLoad: number;
}

interface SecurityMetricsProps {
  data: MetricsData;
}

export function SecurityMetrics({ data }: SecurityMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SecurityCard
        title="Protected Devices"
        value={data.totalDevices}
        description="Active network devices"
        icon={Shield}
        status="success"
        trend="stable"
      />
      
      <SecurityCard
        title="Active Threats"
        value={data.activeThreats}
        description="Requiring immediate attention"
        icon={AlertTriangle}
        status={data.activeThreats > 0 ? "critical" : "success"}
        trend={data.activeThreats > 5 ? "up" : "down"}
      />
      
      <SecurityCard
        title="Blocked Attacks"
        value={data.blockedAttacks}
        description="In the last 24 hours"
        icon={Lock}
        status="info"
        trend="up"
      />
      
      <SecurityCard
        title="Network Uptime"
        value={data.networkUptime}
        description="System availability"
        icon={Activity}
        status="success"
        trend="stable"
      />
      
      <SecurityCard
        title="Bandwidth Usage"
        value={data.bandwidth}
        description="Current network utilization"
        icon={Zap}
        status="neutral"
        trend="stable"
      />
      
      <SecurityCard
        title="Connected Users"
        value={data.connectedUsers}
        description="Active authenticated sessions"
        icon={Users}
        status="info"
        trend="up"
      />
      
      <SecurityCard
        title="Data Protected"
        value={data.dataProtected}
        description="Encrypted and secured"
        icon={Database}
        status="success"
        trend="stable"
      />
      
      <SecurityCard
        title="System Load"
        value={`${data.systemLoad}%`}
        description="Server resource utilization"
        icon={Server}
        status={data.systemLoad > 80 ? "warning" : "success"}
        trend={data.systemLoad > 85 ? "up" : "stable"}
      />
    </div>
  );
}