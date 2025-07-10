import { Settings, Shield, Bell, Monitor, Users, Database, Wifi } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-primary" />
            <span>Security Settings</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security Policies</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Real-time Threat Detection</Label>
                    <p className="text-sm text-muted-foreground">Enable continuous threat monitoring</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Quarantine</Label>
                    <p className="text-sm text-muted-foreground">Automatically isolate critical threats</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Scan Schedule</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-scan">Full System Scan</Label>
                  <Input id="full-scan" defaultValue="Daily at 2:00 AM" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quick-scan">Quick Scan</Label>
                  <Input id="quick-scan" defaultValue="Every 4 hours" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-primary" />
                <span>System Monitoring</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Network Traffic Analysis</Label>
                    <p className="text-sm text-muted-foreground">Monitor all network communications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>File System Monitoring</Label>
                    <p className="text-sm text-muted-foreground">Track file system changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Performance Metrics</Label>
                    <p className="text-sm text-muted-foreground">Collect system performance data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Data Retention</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logs-retention">Security Logs</Label>
                  <Input id="logs-retention" defaultValue="90 days" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metrics-retention">Metrics Data</Label>
                  <Input id="metrics-retention" defaultValue="30 days" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-primary" />
                <span>Network Configuration</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Firewall Protection</Label>
                    <p className="text-sm text-muted-foreground">Enable advanced firewall rules</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Intrusion Prevention</Label>
                    <p className="text-sm text-muted-foreground">Block suspicious network activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>VPN Access</Label>
                    <p className="text-sm text-muted-foreground">Allow secure remote access</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Network Zones</h4>
              <div className="space-y-2">
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">DMZ Network</div>
                      <div className="text-sm text-muted-foreground">192.168.1.0/24</div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Internal Network</div>
                      <div className="text-sm text-muted-foreground">10.0.0.0/16</div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Alert Preferences</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical threats only</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Real-time browser notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Notification Thresholds</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="threat-threshold">Threat Score Threshold</Label>
                  <Input id="threat-threshold" type="number" defaultValue="75" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attack-threshold">Attack Rate Threshold</Label>
                  <Input id="attack-threshold" defaultValue="50 per minute" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}