import { useState, useRef, useEffect } from "react";
import { Terminal, Send, History, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommandHistory {
  command: string;
  output: string;
  timestamp: string;
  type: 'success' | 'error' | 'info';
}

const predefinedCommands = [
  { cmd: "status", desc: "Show system status" },
  { cmd: "firewall --status", desc: "Check firewall status" },
  { cmd: "scan --network", desc: "Network vulnerability scan" },
  { cmd: "logs --tail 10", desc: "Show recent logs" },
  { cmd: "update --signatures", desc: "Update threat signatures" },
  { cmd: "config --backup", desc: "Backup configuration" },
];

export function SecurityCLI() {
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([
    {
      command: "system init",
      output: "Nexus Security CLI v2.1.0 initialized\nAll systems operational",
      timestamp: new Date().toLocaleTimeString(),
      type: 'success'
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    let output = "";
    let type: 'success' | 'error' | 'info' = 'info';

    // Simulate command execution
    switch (command.toLowerCase()) {
      case "status":
        output = "System Status: SECURE\nFirewall: ACTIVE\nIDS: MONITORING\nAnti-malware: UPDATED";
        type = 'success';
        break;
      case "firewall --status":
        output = "Firewall Status: ACTIVE\nRules loaded: 1,247\nBlocked attempts: 15,832\nLast update: 2 minutes ago";
        type = 'success';
        break;
      case "scan --network":
        output = "Network scan initiated...\nScanning 192.168.1.0/24\nDevices found: 23\nVulnerabilities: 0 critical, 2 medium\nScan complete.";
        type = 'success';
        break;
      case "logs --tail 10":
        output = `[${new Date().toISOString()}] Firewall: Blocked suspicious IP 192.168.1.100
[${new Date().toISOString()}] IDS: Detected port scan from external source
[${new Date().toISOString()}] Auth: Successful login for admin
[${new Date().toISOString()}] System: Threat signatures updated`;
        type = 'info';
        break;
      case "update --signatures":
        output = "Updating threat signatures...\nDownloaded 2,847 new signatures\nUpdate complete. System protected against latest threats.";
        type = 'success';
        break;
      case "config --backup":
        output = "Creating configuration backup...\nBackup saved to: /var/backup/config_" + new Date().toISOString().split('T')[0] + ".json\nBackup complete.";
        type = 'success';
        break;
      case "help":
        output = predefinedCommands.map(cmd => `${cmd.cmd} - ${cmd.desc}`).join('\n');
        type = 'info';
        break;
      default:
        output = `Command '${command}' not recognized. Type 'help' for available commands.`;
        type = 'error';
    }

    const newEntry: CommandHistory = {
      command,
      output,
      timestamp: new Date().toLocaleTimeString(),
      type
    };

    setCommandHistory(prev => [...prev, newEntry]);
    setCurrentCommand("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = commandHistory.map(h => h.command);
      if (historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commands[commands.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const commands = commandHistory.map(h => h.command);
        setCurrentCommand(commands[commands.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };

  const getOutputColor = (type: CommandHistory['type']) => {
    switch (type) {
      case 'success': return 'text-security-success';
      case 'error': return 'text-security-critical';
      case 'info': return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Terminal className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-neon-blue bg-clip-text text-transparent">
          Security Command Interface
        </h2>
      </div>

      <Tabs defaultValue="terminal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="terminal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5 text-primary" />
                <span>Command Terminal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Command History */}
              <ScrollArea ref={scrollAreaRef} className="h-80 w-full rounded-md border bg-black/50 p-4">
                <div className="space-y-2 font-mono text-sm">
                  {commandHistory.map((entry, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-primary">nexus@security:~$</span>
                        <span className="text-foreground">{entry.command}</span>
                        <span className="text-xs text-muted-foreground">[{entry.timestamp}]</span>
                      </div>
                      <pre className={`whitespace-pre-wrap pl-4 ${getOutputColor(entry.type)}`}>
                        {entry.output}
                      </pre>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Command Input */}
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-primary">nexus@security:~$</span>
                <Input
                  ref={inputRef}
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command..."
                  className="font-mono"
                />
                <Button 
                  onClick={() => executeCommand(currentCommand)}
                  size="icon"
                  disabled={!currentCommand.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Commands */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Quick Commands:</h4>
                <div className="flex flex-wrap gap-2">
                  {predefinedCommands.slice(0, 6).map((cmd, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setCurrentCommand(cmd.cmd)}
                    >
                      {cmd.cmd}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scripts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Security Scripts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Manage and execute security automation scripts
                </div>
                <div className="grid gap-4">
                  {[
                    { name: "Daily Security Scan", desc: "Automated vulnerability assessment", status: "Scheduled" },
                    { name: "Backup Configuration", desc: "System configuration backup", status: "Ready" },
                    { name: "Threat Response", desc: "Automated incident response", status: "Active" },
                  ].map((script, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{script.name}</h4>
                        <p className="text-sm text-muted-foreground">{script.desc}</p>
                      </div>
                      <Badge variant="outline">{script.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>System Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  View and modify system security configurations
                </div>
                <div className="grid gap-4">
                  {[
                    { config: "Firewall Rules", value: "1,247 active rules", modified: "2 hours ago" },
                    { config: "Access Policies", value: "15 policies active", modified: "1 day ago" },
                    { config: "Alert Thresholds", value: "Critical: 90%, Warning: 70%", modified: "3 days ago" },
                    { config: "Backup Schedule", value: "Daily at 02:00 UTC", modified: "1 week ago" },
                  ].map((config, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{config.config}</h4>
                        <p className="text-sm text-muted-foreground">{config.value}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Active</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Modified {config.modified}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}