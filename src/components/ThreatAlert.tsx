import { useState } from "react";
import { AlertTriangle, Shield, Zap, Bug, Eye, Ban, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThreatDetailModal } from "./ThreatDetailModal";
import { useToast } from "@/hooks/use-toast";

interface Threat {
  id: string;
  type: 'malware' | 'intrusion' | 'vulnerability' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  timestamp: string;
  description: string;
}

interface ThreatAlertProps {
  threats: Threat[];
  onThreatAction?: (threatId: string, action: 'block' | 'investigate' | 'dismiss') => void;
}

export function ThreatAlert({ threats, onThreatAction }: ThreatAlertProps) {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeThreatIds, setActiveThreatIds] = useState(new Set(threats.map(t => t.id)));
  const { toast } = useToast();

  const handleThreatAction = (threatId: string, action: 'block' | 'investigate' | 'dismiss', event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (action === 'dismiss') {
      setActiveThreatIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(threatId);
        return newSet;
      });
    }
    
    const actionMessages = {
      block: 'Threat source has been blocked',
      investigate: 'Investigation initiated',
      dismiss: 'Threat dismissed'
    };
    
    toast({
      title: `Threat ${action}ed`,
      description: actionMessages[action],
      variant: action === 'block' ? 'destructive' : 'default'
    });
    
    onThreatAction?.(threatId, action);
  };

  const activeThreats = threats.filter(threat => activeThreatIds.has(threat.id));
  const getIcon = (type: Threat['type']) => {
    switch (type) {
      case 'malware': return Bug;
      case 'intrusion': return Shield;
      case 'vulnerability': return AlertTriangle;
      case 'anomaly': return Eye;
      default: return Zap;
    }
  };

  const getSeverityColor = (severity: Threat['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-security-critical text-white';
      case 'high': return 'bg-security-warning text-black';
      case 'medium': return 'bg-security-info text-white';
      case 'low': return 'bg-security-neutral text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCardBorder = (severity: Threat['severity']) => {
    switch (severity) {
      case 'critical': return 'border-security-critical shadow-neon-red';
      case 'high': return 'border-security-warning';
      case 'medium': return 'border-security-info';
      case 'low': return 'border-security-neutral';
      default: return 'border-border';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-security-warning" />
          <span>Active Threats</span>
          <Badge className="bg-security-critical text-white">
            {activeThreats.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeThreats.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-2 text-security-success" />
            <p>No active threats detected</p>
          </div>
        ) : (
          activeThreats.map((threat) => {
            const Icon = getIcon(threat.type);
            return (
              <div
                key={threat.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-300 hover:scale-102 cursor-pointer",
                  getCardBorder(threat.severity)
                )}
                onClick={() => {
                  setSelectedThreat(threat);
                  setIsModalOpen(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-card-foreground">
                          {threat.description}
                        </h4>
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Source: {threat.source}</p>
                        <p>Target: {threat.target}</p>
                        <p>Time: {threat.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="h-7 px-2 text-xs"
                      onClick={(e) => handleThreatAction(threat.id, 'block', e)}
                    >
                      <Ban className="h-3 w-3 mr-1" />
                      Block
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 px-2 text-xs"
                      onClick={(e) => handleThreatAction(threat.id, 'investigate', e)}
                    >
                      <Search className="h-3 w-3 mr-1" />
                      Investigate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleThreatAction(threat.id, 'dismiss', e)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      
      <ThreatDetailModal
        threat={selectedThreat}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
}