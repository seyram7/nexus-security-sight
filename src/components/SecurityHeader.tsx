import { Shield, Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SecurityHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-neon-blue bg-clip-text text-transparent">
                Nexus Security
              </h1>
              <p className="text-xs text-muted-foreground">Network Protection Center</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-security-success border-security-success">
            <div className="w-2 h-2 bg-security-success rounded-full mr-2 animate-pulse" />
            System Secure
          </Badge>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-security-critical">
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}