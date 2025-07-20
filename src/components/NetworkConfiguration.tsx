import { useState } from "react";
import { Network, Shield, Lock, Settings, Router, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FirewallConfig } from "./config/FirewallConfig";
import { VPNConfig } from "./config/VPNConfig";
import { AccessPolicyConfig } from "./config/AccessPolicyConfig";
import { SwitchConfig } from "./config/SwitchConfig";
import { RouterConfig } from "./config/RouterConfig";

export function NetworkConfiguration() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Network className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-neon-blue bg-clip-text text-transparent">
          Network Configuration
        </h2>
      </div>

      <Tabs defaultValue="firewall" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="firewall" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Firewall</span>
          </TabsTrigger>
          <TabsTrigger value="vpn" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>VPN</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Access</span>
          </TabsTrigger>
          <TabsTrigger value="switch" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Switch</span>
          </TabsTrigger>
          <TabsTrigger value="router" className="flex items-center space-x-2">
            <Router className="h-4 w-4" />
            <span>Router</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="firewall" className="mt-6">
          <FirewallConfig />
        </TabsContent>

        <TabsContent value="vpn" className="mt-6">
          <VPNConfig />
        </TabsContent>

        <TabsContent value="access" className="mt-6">
          <AccessPolicyConfig />
        </TabsContent>

        <TabsContent value="switch" className="mt-6">
          <SwitchConfig />
        </TabsContent>

        <TabsContent value="router" className="mt-6">
          <RouterConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}