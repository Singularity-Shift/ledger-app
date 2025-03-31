import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionConfig } from "./components/CollectionConfig";
import { MonitoringActivity } from "./components/MonitoringActivity";
import { useAppManagement } from "@/contexts/AppManagement";
import { CollectionList } from "./components/CollectionList";

export function Admin() {
  const { isAdmin } = useAppManagement();

  return (
    <div className="min-h-screen">
      <Header />

      {!isAdmin ? (
        <h1 className="text-center text-xl font-bold">You are not authorized to access this page.</h1>
      ) : (
        <div className="overflow-hidden">
          <main className="flex flex-col gap-10 md:gap-16 mt-6">
            <div className="container mx-auto px-4">
              <h1 className="title-md mb-8">Admin Dashboard</h1>

              <Tabs defaultValue="collection-config" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="collection-config">Collection Config</TabsTrigger>
                  <TabsTrigger value="collection-list">Collection List</TabsTrigger>
                  <TabsTrigger value="monitoring">Monitoring Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="collection-config" className="mt-6">
                  <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border-2 border-black shadow-lg">
                    <CollectionConfig />
                  </div>
                </TabsContent>

                <TabsContent value="collection-list" className="mt-6">
                  <div className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border-2 border-black shadow-lg">
                    <CollectionList />
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
      )}
    </div>
  );
}
