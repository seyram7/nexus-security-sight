import { useState } from "react";
import { Shield, Plus, Trash2, Edit, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FirewallRule {
  id: string;
  name: string;
  action: 'allow' | 'deny' | 'log';
  protocol: 'tcp' | 'udp' | 'icmp' | 'any';
  sourceIP: string;
  destIP: string;
  port: string;
  priority: number;
  enabled: boolean;
}

const initialRules: FirewallRule[] = [
  { id: '1', name: 'Allow HTTP', action: 'allow', protocol: 'tcp', sourceIP: 'any', destIP: 'any', port: '80', priority: 100, enabled: true },
  { id: '2', name: 'Allow HTTPS', action: 'allow', protocol: 'tcp', sourceIP: 'any', destIP: 'any', port: '443', priority: 100, enabled: true },
  { id: '3', name: 'Block Malicious IPs', action: 'deny', protocol: 'any', sourceIP: '192.168.100.0/24', destIP: 'any', port: 'any', priority: 1000, enabled: true },
  { id: '4', name: 'Allow SSH Admin', action: 'allow', protocol: 'tcp', sourceIP: '10.0.0.0/8', destIP: 'any', port: '22', priority: 200, enabled: true },
];

export function FirewallConfig() {
  const [rules, setRules] = useState<FirewallRule[]>(initialRules);
  const [editingRule, setEditingRule] = useState<FirewallRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<FirewallRule>>({
    name: '',
    action: 'allow',
    protocol: 'tcp',
    sourceIP: '',
    destIP: '',
    port: '',
    priority: 100,
    enabled: true
  });
  const [commands, setCommands] = useState<string[]>([]);

  const addRule = () => {
    if (!newRule.name || !newRule.sourceIP || !newRule.destIP || !newRule.port) return;
    
    const rule: FirewallRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      action: newRule.action!,
      protocol: newRule.protocol!,
      sourceIP: newRule.sourceIP!,
      destIP: newRule.destIP!,
      port: newRule.port!,
      priority: newRule.priority!,
      enabled: newRule.enabled!
    };
    
    setRules([...rules, rule]);
    setNewRule({
      name: '',
      action: 'allow',
      protocol: 'tcp',
      sourceIP: '',
      destIP: '',
      port: '',
      priority: 100,
      enabled: true
    });
    
    // Generate iptables command
    const command = generateIptablesCommand(rule);
    setCommands(prev => [...prev, command]);
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const generateIptablesCommand = (rule: FirewallRule): string => {
    const action = rule.action === 'allow' ? 'ACCEPT' : rule.action === 'deny' ? 'DROP' : 'LOG';
    const protocol = rule.protocol !== 'any' ? `-p ${rule.protocol}` : '';
    const sourceIP = rule.sourceIP !== 'any' ? `-s ${rule.sourceIP}` : '';
    const destIP = rule.destIP !== 'any' ? `-d ${rule.destIP}` : '';
    const port = rule.port !== 'any' ? `--dport ${rule.port}` : '';
    
    return `iptables -A INPUT ${protocol} ${sourceIP} ${destIP} ${port} -j ${action}`;
  };

  const getActionBadge = (action: FirewallRule['action']) => {
    const variants = {
      allow: 'border-security-success text-security-success',
      deny: 'border-security-critical text-security-critical',
      log: 'border-security-info text-security-info'
    };
    return <Badge variant="outline" className={variants[action]}>{action.toUpperCase()}</Badge>;
  };

  return (
    <Tabs defaultValue="rules" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="rules">Rules Management</TabsTrigger>
        <TabsTrigger value="commands">Generated Commands</TabsTrigger>
        <TabsTrigger value="templates">Rule Templates</TabsTrigger>
      </TabsList>

      <TabsContent value="rules" className="space-y-6">
        {/* Add New Rule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>Add Firewall Rule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  placeholder="Enter rule name"
                />
              </div>
              <div>
                <Label htmlFor="action">Action</Label>
                <Select value={newRule.action} onValueChange={(value: any) => setNewRule({...newRule, action: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="log">Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="protocol">Protocol</Label>
                <Select value={newRule.protocol} onValueChange={(value: any) => setNewRule({...newRule, protocol: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="udp">UDP</SelectItem>
                    <SelectItem value="icmp">ICMP</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sourceIP">Source IP</Label>
                <Input
                  id="sourceIP"
                  value={newRule.sourceIP}
                  onChange={(e) => setNewRule({...newRule, sourceIP: e.target.value})}
                  placeholder="192.168.1.0/24 or any"
                />
              </div>
              <div>
                <Label htmlFor="destIP">Destination IP</Label>
                <Input
                  id="destIP"
                  value={newRule.destIP}
                  onChange={(e) => setNewRule({...newRule, destIP: e.target.value})}
                  placeholder="192.168.1.100 or any"
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  value={newRule.port}
                  onChange={(e) => setNewRule({...newRule, port: e.target.value})}
                  placeholder="80, 443, 1-1024, any"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={addRule} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Rule</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rules List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Active Firewall Rules ({rules.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${rule.enabled ? 'bg-card' : 'bg-muted/50'}`}>
                  <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-xs text-muted-foreground">Priority: {rule.priority}</p>
                    </div>
                    <div>{getActionBadge(rule.action)}</div>
                    <div className="text-sm">
                      <div className="font-medium">{rule.protocol.toUpperCase()}</div>
                    </div>
                    <div className="text-sm">
                      <div>From: {rule.sourceIP}</div>
                      <div>To: {rule.destIP}</div>
                    </div>
                    <div className="text-sm">
                      <div>Port: {rule.port}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRule(rule.id)}
                        className={rule.enabled ? '' : 'opacity-50'}
                      >
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="commands" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-primary" />
              <span>Generated iptables Commands</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 w-full rounded-md border bg-black/50 p-4">
              <div className="space-y-2 font-mono text-sm">
                {commands.map((command, index) => (
                  <div key={index} className="text-security-success">
                    {command}
                  </div>
                ))}
                {commands.length === 0 && (
                  <div className="text-muted-foreground">No commands generated yet. Add some firewall rules to see the corresponding iptables commands.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Common Firewall Rule Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Web Server Rules", desc: "Allow HTTP/HTTPS traffic", rules: "80, 443" },
                { name: "SSH Access", desc: "Secure shell access", rules: "22" },
                { name: "Database Access", desc: "MySQL/PostgreSQL access", rules: "3306, 5432" },
                { name: "DNS Services", desc: "Domain name resolution", rules: "53" },
                { name: "Mail Server", desc: "SMTP, POP3, IMAP", rules: "25, 110, 143, 993, 995" },
                { name: "FTP Services", desc: "File transfer protocol", rules: "21, 20" },
              ].map((template, index) => (
                <div key={index} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{template.desc}</p>
                  <p className="text-xs text-primary mt-2">Ports: {template.rules}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}