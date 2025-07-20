import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SecurityService {
  name: string;
  status: 'active' | 'inactive' | 'warning';
  description: string;
  lastCheck: string;
}

interface SecurityMetric {
  name: string;
  value: number;
  max: number;
  status: 'good' | 'warning' | 'critical';
}

const securityServices: SecurityService[] = [
  { name: "Firewall Protection", status: "active", description: "Advanced packet filtering active", lastCheck: "2 min ago" },
  { name: "Intrusion Detection", status: "active", description: "Real-time threat monitoring", lastCheck: "1 min ago" },
  { name: "Anti-Malware", status: "active", description: "Signature database updated", lastCheck: "5 min ago" },
  { name: "VPN Gateway", status: "warning", description: "High connection load", lastCheck: "3 min ago" },
  { name: "Access Control", status: "active", description: "Multi-factor authentication", lastCheck: "1 min ago" },
  { name: "Data Encryption", status: "active", description: "AES-256 encryption active", lastCheck: "4 min ago" },
];

const securityMetrics: SecurityMetric[] = [
  { name: "CPU Usage", value: 45, max: 100, status: "good" },
  { name: "Memory Usage", value: 67, max: 100, status: "warning" },
  { name: "Network Load", value: 23, max: 100, status: "good" },
  { name: "Disk I/O", value: 89, max: 100, status: "critical" },
];

export function SystemSecurityPanel() {
  const getStatusIcon = (status: SecurityService['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-security-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-security-warning" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-security-critical" />;
    }
  };

  const getStatusBadge = (status: SecurityService['status']) => {
    switch (status) {
      case 'active': return <Badge variant="outline" className="text-security-success border-security-success">Active</Badge>;
      case 'warning': return <Badge variant="outline" className="text-security-warning border-security-warning">Warning</Badge>;
      case 'inactive': return <Badge variant="outline" className="text-security-critical border-security-critical">Inactive</Badge>;
    }
  };

  const getMetricColor = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'good': return 'text-security-success';
      case 'warning': return 'text-security-warning';
      case 'critical': return 'text-security-critical';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-neon-blue bg-clip-text text-transparent">
          System Security Status
        </h2>
      </div>

      {/* Security Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Security Services</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(service.status)}
                  <p className="text-xs text-muted-foreground mt-1">{service.lastCheck}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Performance */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {securityMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className={`text-sm font-medium ${getMetricColor(metric.status)}`}>
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}