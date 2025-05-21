
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LearningProvider } from "./contexts/LearningContext";
import { useEffect } from "react";
import { initializeNotesStorage } from "./utils/clientNotesUtils";

const queryClient = new QueryClient();

// Component to initialize notes storage
const AppInitializer = () => {
  useEffect(() => {
    // Initialize notes storage when the app loads
    initializeNotesStorage();
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LearningProvider>
          <TooltipProvider>
            <AppInitializer />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/notes" element={<Notes />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LearningProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;