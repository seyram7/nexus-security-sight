import { AlertTriangle, Shield, Zap, Bug, Eye, X, Clock, MapPin, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Threat {
  id: string;
  type: 'malware' | 'intrusion' | 'vulnerability' | 'anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  timestamp: string;
  description: string;
}

interface ThreatDetailModalProps {
  threat: Threat | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ThreatDetailModal({ threat, isOpen, onClose }: ThreatDetailModalProps) {
  if (!threat) return null;

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

  const Icon = getIcon(threat.type);

  const mockDetails = {
    attackVector: threat.type === 'malware' ? 'Email attachment' : 'Network scan',
    riskLevel: threat.severity === 'critical' ? 'Immediate Action Required' : 'Monitor Closely',
    affectedSystems: threat.type === 'intrusion' ? ['Web Server', 'Database'] : ['Workstation-042'],
    recommendations: [
      'Isolate affected systems',
      'Update security patches',
      'Monitor network traffic',
      'Review access logs'
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon className="h-6 w-6 text-primary" />
            <span>Threat Analysis</span>
            <Badge className={getSeverityColor(threat.severity)}>
              {threat.severity.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Info className="h-5 w-5 text-primary" />
              <span>Threat Information</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Threat ID</div>
                <div className="font-mono text-sm">{threat.id}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="capitalize">{threat.type}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Source</div>
                <div className="font-mono text-sm">{threat.source}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="font-mono text-sm">{threat.target}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Description</div>
              <div className="p-3 bg-muted/50 rounded-lg">{threat.description}</div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Timeline</span>
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">First Detected</div>
                  <div className="text-sm text-muted-foreground">{threat.timestamp}</div>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Analysis Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Analysis Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Attack Vector</div>
                <div className="p-2 bg-muted/30 rounded">{mockDetails.attackVector}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <div className="p-2 bg-muted/30 rounded">{mockDetails.riskLevel}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Affected Systems</div>
              <div className="flex flex-wrap gap-2">
                {mockDetails.affectedSystems.map((system, index) => (
                  <Badge key={index} variant="secondary">{system}</Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recommended Actions</h3>
            <div className="space-y-2">
              {mockDetails.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button className="flex-1" variant="default">
              Quarantine Threat
            </Button>
            <Button className="flex-1" variant="outline">
              Add to Whitelist
            </Button>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}