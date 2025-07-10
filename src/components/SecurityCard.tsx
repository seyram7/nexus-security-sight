import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SecurityCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  status?: 'critical' | 'warning' | 'success' | 'info' | 'neutral';
  className?: string;
}

export function SecurityCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  status = 'neutral',
  className 
}: SecurityCardProps) {
  const statusColors = {
    critical: 'text-security-critical border-security-critical/20 bg-gradient-alert',
    warning: 'text-security-warning border-security-warning/20',
    success: 'text-security-success border-security-success/20 bg-gradient-success',
    info: 'text-security-info border-security-info/20 bg-gradient-cyber',
    neutral: 'text-muted-foreground border-border'
  };

  const getTrendBadge = () => {
    if (!trend) return null;
    
    const trendConfig = {
      up: { color: 'bg-security-success', symbol: '↗' },
      down: { color: 'bg-security-critical', symbol: '↘' },
      stable: { color: 'bg-muted', symbol: '→' }
    };
    
    const config = trendConfig[trend];
    
    return (
      <Badge className={cn("px-1 py-0 text-xs", config.color)}>
        {config.symbol}
      </Badge>
    );
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-card hover:scale-105",
      "border animate-fade-in",
      statusColors[status],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {getTrendBadge()}
          <Icon className={cn("h-4 w-4", statusColors[status].split(' ')[0])} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground mb-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}