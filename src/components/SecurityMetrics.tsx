import { useState } from "react";
import { Shield, AlertTriangle, Activity, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedDevicesModal } from "./ProtectedDevicesModal";
import { NetworkUptimeModal } from "./NetworkUptimeModal";
import { ConnectedUsersModal } from "./ConnectedUsersModal";

interface SecurityMetric {
  title: string;
  value: string | number;
  change: string;
  type: 'devices' | 'threats' | 'attacks' | 'uptime' | 'users';
}

interface SecurityMetricsProps {
  data: SecurityMetric[];
}

export function SecurityMetrics({ data }: SecurityMetricsProps) {
  const [protectedDevicesOpen, setProtectedDevicesOpen] = useState(false);
  const [networkUptimeOpen, setNetworkUptimeOpen] = useState(false);
  const [connectedUsersOpen, setConnectedUsersOpen] = useState(false);

  const getIcon = (type: SecurityMetric['type']) => {
    switch (type) {
      case 'devices': return Shield;
      case 'threats': return AlertTriangle;
      case 'attacks': return Shield;
      case 'uptime': return Activity;
      case 'users': return Users;
      default: return Shield;
    }
  };

  const getColorClass = (type: SecurityMetric['type']) => {
    switch (type) {
      case 'devices': return 'border-security-success/50 hover:border-security-success';
      case 'threats': return 'border-security-critical/50 hover:border-security-critical';
      case 'attacks': return 'border-security-info/50 hover:border-security-info';
      case 'uptime': return 'border-security-success/50 hover:border-security-success';
      case 'users': return 'border-security-info/50 hover:border-security-info';
      default: return 'border-border';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((metric, index) => {
        const Icon = getIcon(metric.type);
        const colorClass = getColorClass(metric.type);
        
        const handleClick = () => {
          if (metric.type === 'devices') {
            setProtectedDevicesOpen(true);
          } else if (metric.type === 'uptime') {
            setNetworkUptimeOpen(true);
          } else if (metric.type === 'users') {
            setConnectedUsersOpen(true);
          }
        };
        
        const isClickable = metric.type === 'devices' || metric.type === 'uptime' || metric.type === 'users';
        
        return (
          <Card 
            key={index} 
            className={`transition-all duration-300 hover:scale-105 ${isClickable ? 'cursor-pointer' : ''} ${colorClass}`}
            onClick={isClickable ? handleClick : undefined}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
      
      <ProtectedDevicesModal
        isOpen={protectedDevicesOpen}
        onClose={() => setProtectedDevicesOpen(false)}
      />
      
      <NetworkUptimeModal
        isOpen={networkUptimeOpen}
        onClose={() => setNetworkUptimeOpen(false)}
      />
      
      <ConnectedUsersModal
        isOpen={connectedUsersOpen}
        onClose={() => setConnectedUsersOpen(false)}
      />
    </div>
  );
}