import { SecurityHeader } from "@/components/SecurityHeader";
import { SecurityMetrics } from "@/components/SecurityMetrics";
import { ThreatAlert } from "@/components/ThreatAlert";
import { NetworkChart } from "@/components/NetworkChart";
import { mockNetworkData, mockThreats, mockMetrics } from "@/data/mockData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SecurityHeader />
      
      <main className="p-6 space-y-6">
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
      </main>
    </div>
  );
};

export default Index;
