import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PostDetail from "@/pages/PostDetail";
import MapPage from "@/pages/MapPage";
import DraftPage from "@/pages/DraftPage";
import AdminPage from "@/pages/AdminPage";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: "easeIn" } },
};

function AnimatedRoutes() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/post/:id" component={PostDetail} />
          <Route path="/map" component={MapPage} />
          <Route path="/draft" component={DraftPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AnimatedRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
