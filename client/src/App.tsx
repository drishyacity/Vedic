import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/courses" component={Courses} />
          <Route path="/course/:slug" component={CourseDetail} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/courses" component={Courses} />
          <Route path="/course/:slug" component={CourseDetail} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/batch/:id" component={BatchRoom} />
          
          {/* Admin routes */}
          {user?.role === 'admin' && (
            <>
              <Route path="/admin" component={AdminDashboard} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
