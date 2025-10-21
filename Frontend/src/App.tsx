import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AppSidebar } from "./components/AppSidebar";


// Import your pages
import LiveFeed from "./pages/LiveFeed";
import MapView from "./pages/MapView";
import Analytics from "./pages/Analytics";
import SystemInfo from "./pages/SystemInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Notification systems */}
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-950">
              {/* Sidebar */}
              <AppSidebar />

              {/* Main content */}
              <main className="flex-1 p-4 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<LiveFeed />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/system" element={<SystemInfo />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
