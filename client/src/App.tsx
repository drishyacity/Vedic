import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import Dashboard from "@/pages/dashboard";
import BatchRoom from "@/pages/batch-room";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCourses from "@/pages/admin/courses";
import AdminStudents from "@/pages/admin/students";
import AdminPayments from "@/pages/admin/payments";
import AdminLogin from "@/pages/admin-login";
import Admin from "@/pages/admin";
import FAQ from "@/pages/faq";
import HelpCenter from "@/pages/help-center";
import Contact from "@/pages/contact";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Refund from "@/pages/refund";

// Redirect component for /admin-login
function AdminLoginRedirect() {
  window.location.href = "/admin";
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full mb-4"></div>
        <p className="text-muted-foreground">Redirecting to admin...</p>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/courses" component={Courses} />
          <Route path="/course/:slug" component={CourseDetail} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin-login" component={() => <AdminLoginRedirect />} />
          <Route path="/faq" component={FAQ} />
          <Route path="/help-center" component={HelpCenter} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/refund" component={Refund} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/courses" component={Courses} />
          <Route path="/course/:slug" component={CourseDetail} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/batch/:id" component={BatchRoom} />
          <Route path="/faq" component={FAQ} />
          <Route path="/help-center" component={HelpCenter} />
          <Route path="/contact" component={Contact} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/refund" component={Refund} />
          
          {/* Unified Admin Route - accessible to everyone, handles auth internally */}
          <Route path="/admin" component={Admin} />
          <Route path="/admin-login" component={() => <AdminLoginRedirect />} />
          
          {/* Admin sub-routes - only accessible to authenticated admins */}
          {user?.role === 'admin' && (
            <>
              <Route path="/admin/courses" component={AdminCourses} />
              <Route path="/admin/students" component={AdminStudents} />
              <Route path="/admin/payments" component={AdminPayments} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
