import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity } from "lucide-react";

interface NetworkData {
  time: string;
  traffic: number;
  threats: number;
  blocked: number;
}

interface NetworkChartProps {
  data: NetworkData[];
  title: string;
  type?: 'line' | 'area';
}

export function NetworkChart({ data, title, type = 'area' }: NetworkChartProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--security-critical))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--security-critical))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--security-success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--security-success))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="traffic"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#trafficGradient)"
                  name="Network Traffic"
                />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="hsl(var(--security-critical))"
                  strokeWidth={2}
                  fill="url(#threatsGradient)"
                  name="Threats Detected"
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke="hsl(var(--security-success))"
                  strokeWidth={2}
                  fill="url(#blockedGradient)"
                  name="Threats Blocked"
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="traffic"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  name="Network Traffic"
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="hsl(var(--security-critical))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--security-critical))', strokeWidth: 2, r: 4 }}
                  name="Threats Detected"
                />
                <Line
                  type="monotone"
                  dataKey="blocked"
                  stroke="hsl(var(--security-success))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--security-success))', strokeWidth: 2, r: 4 }}
                  name="Threats Blocked"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}