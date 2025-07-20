import { SecurityHeader } from "@/components/SecurityHeader";
import { SecurityMetrics } from "@/components/SecurityMetrics";
import { ThreatAlert } from "@/components/ThreatAlert";
import { NetworkChart } from "@/components/NetworkChart";
import { SystemSecurityPanel } from "@/components/SystemSecurityPanel";
import { SecurityCLI } from "@/components/SecurityCLI";
import { NetworkConfiguration } from "@/components/NetworkConfiguration";
import { mockNetworkData, mockThreats, mockMetrics } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SecurityHeader />
      
      <main className="p-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="system">System Security</TabsTrigger>
            <TabsTrigger value="cli">Command Interface</TabsTrigger>
            <TabsTrigger value="config">Network Config</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Security Overview Metrics */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-neon-blue bg-clip-text text-transparent">
                  Security Overview
                </h2>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
              <SecurityMetrics data={mockMetrics} />
            </section>

            {/* Charts and Alerts Grid */}
            <section className="grid gap-6 lg:grid-cols-3">
              {/* Network Activity Chart */}
              <div className="lg:col-span-2">
                <NetworkChart 
                  data={mockNetworkData} 
                  title="Network Activity & Threat Detection"
                  type="area"
                />
              </div>
              
              {/* Active Threats Panel */}
              <div>
                <ThreatAlert threats={mockThreats} />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <SystemSecurityPanel />
          </TabsContent>

          <TabsContent value="cli" className="mt-6">
            <SecurityCLI />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <NetworkConfiguration />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 mt-6">
            {/* Additional Charts Row */}
            <section className="grid gap-6 lg:grid-cols-2">
              <NetworkChart 
                data={mockNetworkData.slice(-6)} 
                title="Real-time Traffic Analysis"
                type="line"
              />
              
              <div className="space-y-4">
                <NetworkChart 
                  data={mockNetworkData.slice(-4)} 
                  title="Threat Trends (Last 4 Hours)"
                  type="area"
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
