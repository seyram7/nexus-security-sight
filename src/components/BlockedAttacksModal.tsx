import { useState } from "react";
import { Shield, Search, Filter, Calendar, AlertTriangle, Ban } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BlockedAttack {
  id: string;
  source: string;
  target: string;
  type: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  blockedBy: string;
  reason: string;
}

interface BlockedAttacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockBlockedAttacks: BlockedAttack[] = [
  {
    id: "1",
    source: "192.168.1.100",
    target: "web-server-01",
    type: "SQL Injection",
    timestamp: "2024-01-15 14:23:45",
    severity: "critical",
    blockedBy: "Firewall Rule #42",
    reason: "Malicious payload detected"
  },
  {
    id: "2",
    source: "10.0.0.5",
    target: "database-cluster",
    type: "Port Scan",
    timestamp: "2024-01-15 14:20:12",
    severity: "medium",
    blockedBy: "IDS System",
    reason: "Unauthorized port scanning"
  },
  {
    id: "3",
    source: "172.16.0.200",
    target: "api-gateway",
    type: "DDoS Attack",
    timestamp: "2024-01-15 14:18:33",
    severity: "high",
    blockedBy: "Rate Limiter",
    reason: "Excessive request rate"
  },
  {
    id: "4",
    source: "203.0.113.10",
    target: "mail-server",
    type: "Brute Force",
    timestamp: "2024-01-15 14:15:07",
    severity: "high",
    blockedBy: "Authentication Module",
    reason: "Multiple failed login attempts"
  }
];

export function BlockedAttacksModal({ isOpen, onClose }: BlockedAttacksModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredAttacks = mockBlockedAttacks.filter(attack => {
    const matchesSearch = attack.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attack.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attack.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || attack.severity === severityFilter;
    const matchesType = typeFilter === "all" || attack.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const attackTypes = [...new Set(mockBlockedAttacks.map(attack => attack.type))];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Ban className="h-5 w-5 text-red-400" />
            <span>Blocked Attacks ({filteredAttacks.length})</span>
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search attacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {attackTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Attacks List */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1">
          {filteredAttacks.map((attack) => (
            <Card key={attack.id} className="transition-colors hover:bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium">{attack.type}</span>
                      <Badge className={getSeverityColor(attack.severity)}>
                        {attack.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Source:</span> {attack.source}
                      </div>
                      <div>
                        <span className="font-medium">Target:</span> {attack.target}
                      </div>
                      <div>
                        <span className="font-medium">Blocked by:</span> {attack.blockedBy}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {attack.timestamp}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Reason:</span> {attack.reason}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs">
                      Unblock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAttacks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-2" />
            <p>No blocked attacks found matching your criteria</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}