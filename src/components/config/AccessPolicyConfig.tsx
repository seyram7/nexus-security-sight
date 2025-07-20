import { useState } from "react";
import { Shield, Users, Clock, Globe, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AccessPolicy {
  id: string;
  name: string;
  type: 'user' | 'group' | 'device' | 'time' | 'location';
  rules: string[];
  users: string[];
  enabled: boolean;
  priority: number;
  action: 'allow' | 'deny' | 'require_mfa';
}

interface UserGroup {
  id: string;
  name: string;
  members: number;
  permissions: string[];
  description: string;
}

const initialPolicies: AccessPolicy[] = [
  {
    id: '1',
    name: 'Admin Full Access',
    type: 'group',
    rules: ['Full system access', 'Can modify configurations', 'View all logs'],
    users: ['admin', 'system.admin'],
    enabled: true,
    priority: 1,
    action: 'allow'
  },
  {
    id: '2',
    name: 'Business Hours Only',
    type: 'time',
    rules: ['Monday-Friday 9AM-5PM', 'Block weekend access'],
    users: ['all_users'],
    enabled: true,
    priority: 10,
    action: 'allow'
  },
  {
    id: '3',
    name: 'External IP Block',
    type: 'location',
    rules: ['Block non-corporate IPs', 'Allow office networks only'],
    users: ['all_users'],
    enabled: true,
    priority: 5,
    action: 'deny'
  }
];

const userGroups: UserGroup[] = [
  {
    id: '1',
    name: 'Administrators',
    members: 3,
    permissions: ['Full Access', 'User Management', 'System Configuration'],
    description: 'System administrators with full privileges'
  },
  {
    id: '2',
    name: 'IT Support',
    members: 8,
    permissions: ['Read Logs', 'Basic Configuration', 'User Support'],
    description: 'IT support team with limited administrative access'
  },
  {
    id: '3',
    name: 'End Users',
    members: 156,
    permissions: ['Dashboard View', 'Personal Settings'],
    description: 'Regular users with basic access rights'
  }
];

export function AccessPolicyConfig() {
  const [policies, setPolicies] = useState<AccessPolicy[]>(initialPolicies);
  const [groups, setGroups] = useState<UserGroup[]>(userGroups);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    type: 'user' as AccessPolicy['type'],
    action: 'allow' as AccessPolicy['action'],
    rules: '',
    users: ''
  });

  const addPolicy = () => {
    if (!newPolicy.name || !newPolicy.rules) return;
    
    const policy: AccessPolicy = {
      id: Date.now().toString(),
      name: newPolicy.name,
      type: newPolicy.type,
      rules: newPolicy.rules.split('\n').filter(rule => rule.trim()),
      users: newPolicy.users.split(',').map(u => u.trim()).filter(u => u),
      enabled: true,
      priority: policies.length + 1,
      action: newPolicy.action
    };
    
    setPolicies([...policies, policy]);
    setNewPolicy({
      name: '',
      type: 'user',
      action: 'allow',
      rules: '',
      users: ''
    });
  };

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(policy => 
      policy.id === id ? { ...policy, enabled: !policy.enabled } : policy
    ));
  };

  const deletePolicy = (id: string) => {
    setPolicies(policies.filter(policy => policy.id !== id));
  };

  const getTypeBadge = (type: AccessPolicy['type']) => {
    const variants = {
      user: 'border-security-info text-security-info',
      group: 'border-security-success text-security-success',
      device: 'border-security-warning text-security-warning',
      time: 'border-primary text-primary',
      location: 'border-secondary text-secondary'
    };
    return <Badge variant="outline" className={variants[type]}>{type.toUpperCase()}</Badge>;
  };

  const getActionBadge = (action: AccessPolicy['action']) => {
    const variants = {
      allow: 'border-security-success text-security-success',
      deny: 'border-security-critical text-security-critical',
      require_mfa: 'border-security-warning text-security-warning'
    };
    return <Badge variant="outline" className={variants[action]}>{action.replace('_', ' ').toUpperCase()}</Badge>;
  };

  return (
    <Tabs defaultValue="policies" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="policies">Access Policies</TabsTrigger>
        <TabsTrigger value="groups">User Groups</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="audit">Audit Log</TabsTrigger>
      </TabsList>

      <TabsContent value="policies" className="space-y-6">
        {/* Add New Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>Create Access Policy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="policyName">Policy Name</Label>
                <Input
                  id="policyName"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                  placeholder="Enter policy name"
                />
              </div>
              <div>
                <Label htmlFor="policyType">Policy Type</Label>
                <Select value={newPolicy.type} onValueChange={(value: any) => setNewPolicy({...newPolicy, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User-based</SelectItem>
                    <SelectItem value="group">Group-based</SelectItem>
                    <SelectItem value="device">Device-based</SelectItem>
                    <SelectItem value="time">Time-based</SelectItem>
                    <SelectItem value="location">Location-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="action">Action</Label>
                <Select value={newPolicy.action} onValueChange={(value: any) => setNewPolicy({...newPolicy, action: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="require_mfa">Require MFA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="users">Target Users/Groups</Label>
                <Input
                  id="users"
                  value={newPolicy.users}
                  onChange={(e) => setNewPolicy({...newPolicy, users: e.target.value})}
                  placeholder="user1, group1, all_users"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="rules">Policy Rules (one per line)</Label>
              <Textarea
                id="rules"
                value={newPolicy.rules}
                onChange={(e) => setNewPolicy({...newPolicy, rules: e.target.value})}
                placeholder="Enter policy rules, one per line"
                rows={4}
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={addPolicy} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Policy</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Policies List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Active Access Policies ({policies.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className={`p-4 rounded-lg border transition-all ${policy.enabled ? 'bg-card' : 'bg-muted/50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{policy.name}</h4>
                        {getTypeBadge(policy.type)}
                        {getActionBadge(policy.action)}
                        <Badge variant="outline">Priority: {policy.priority}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Rules:</p>
                          <ul className="text-sm list-disc list-inside ml-2">
                            {policy.rules.map((rule, index) => (
                              <li key={index}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Applies to:</p>
                          <p className="text-sm">{policy.users.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch
                        checked={policy.enabled}
                        onCheckedChange={() => togglePolicy(policy.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePolicy(policy.id)}
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

      <TabsContent value="groups" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>User Groups ({groups.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{group.name}</h4>
                        <Badge variant="outline">{group.members} members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Permissions:</p>
                        <div className="flex flex-wrap gap-2">
                          {group.permissions.map((permission, index) => (
                            <Badge key={index} variant="secondary">{permission}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Members</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="permissions" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Define granular permissions for different system components
            </div>
            <div className="grid gap-4">
              {[
                { category: "System Administration", permissions: ["View System Status", "Modify Configuration", "Restart Services", "Access CLI"] },
                { category: "User Management", permissions: ["View Users", "Create Users", "Modify Users", "Delete Users"] },
                { category: "Security Management", permissions: ["View Threats", "Manage Firewall", "Configure VPN", "Access Policies"] },
                { category: "Monitoring", permissions: ["View Dashboards", "Access Logs", "Export Reports", "Configure Alerts"] },
              ].map((category, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">{category.category}</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {category.permissions.map((permission, permIndex) => (
                      <div key={permIndex} className="flex items-center justify-between">
                        <span className="text-sm">{permission}</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">Admin</Badge>
                          <Badge variant="outline" className="text-xs opacity-50">Support</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audit" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Access Audit Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "2024-01-20 14:30:15", user: "admin", action: "Policy Modified", resource: "Admin Full Access", result: "Success" },
                { time: "2024-01-20 14:25:42", user: "john.doe", action: "Login Attempt", resource: "Dashboard", result: "Success" },
                { time: "2024-01-20 14:20:13", user: "unknown", action: "Access Denied", resource: "System Config", result: "Blocked" },
                { time: "2024-01-20 14:15:28", user: "jane.smith", action: "Permission Grant", resource: "VPN Access", result: "Success" },
                { time: "2024-01-20 14:10:05", user: "support.user", action: "View Logs", resource: "Security Logs", result: "Success" },
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">{log.time}</span>
                    <span className="font-medium">{log.user}</span>
                    <span>{log.action}</span>
                    <span className="text-muted-foreground">{log.resource}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={log.result === 'Success' ? 'border-security-success text-security-success' : 
                              log.result === 'Blocked' ? 'border-security-critical text-security-critical' : ''}
                  >
                    {log.result}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}