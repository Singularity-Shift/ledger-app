import { useState } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionConfig } from "./components/CollectionConfig";
import { MonitoringActivity } from "./components/MonitoringActivity";

export function Admin() {
  const [activeTab, setActiveTab] = useState("collection-config");

  return (
    <div className="min-h-screen">
      <Header />
      <div className="overflow-hidden">
        <main className="flex flex-col gap-10 md:gap-16 mt-6">
          <div className="container mx-auto px-4">
            <h1 className="title-md mb-8">Admin Dashboard</h1>
            
            <Tabs defaultValue="collection-config" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="collection-config">Collection Config</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="collection-config" className="mt-6">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border-2 border-black shadow-lg">
                  <CollectionConfig />
                </div>
              </TabsContent>
              
              <TabsContent value="monitoring" className="mt-6">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border-2 border-black shadow-lg">
                  <MonitoringActivity />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
} 