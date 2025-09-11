import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Lock, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/layout";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Award,
  Activity,
  Eye
} from "lucide-react";
import type { Course, Batch, Enrollment, Order } from "@shared/schema";

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // If user is authenticated but not admin, redirect to home
  if (isAuthenticated && user?.role !== 'admin') {
    window.location.href = "/";
    return null;
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full mb-4"></div>
          <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    const onSubmit = async (data: AdminLoginForm) => {
      setIsLoggingIn(true);
      try {
        const response = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          toast({
            title: "Login Successful",
            description: "Welcome back, Admin!",
          });
          // Reload page to refresh authentication state
          window.location.reload();
        } else {
          toast({
            title: "Login Failed",
            description: result.message || "Invalid credentials",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to login. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoggingIn(false);
      }
    };

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md" data-testid="admin-login-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Enter username"
                            className="pl-10"
                            data-testid="input-username"
                            disabled={isLoggingIn}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter password"
                            className="pl-10"
                            data-testid="input-password"
                            disabled={isLoggingIn}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoggingIn}
                  data-testid="button-login"
                >
                  {isLoggingIn ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="text-center mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Not an admin?{" "}
                <a href="/api/login" className="text-primary hover:underline">
                  Login with your Replit account
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated as admin, show dashboard
  return <AdminDashboard />;
}

// Admin Dashboard Component
function AdminDashboard() {
  const { user } = useAuth();
  
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: batches = [] } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
  });

  const activeCourses = courses.filter((course: any) => course.isActive);
  const activeBatches = batches.filter((batch: any) => batch.isActive);
  const totalStudents = 1247; // This would come from a proper API endpoint
  const monthlyRevenue = 420000; // This would come from orders aggregation

  const recentActivity = [
    { type: 'enrollment', message: 'New student enrolled in Sanskrit Mastery', time: '2 hours ago' },
    { type: 'course', message: 'Ancient Mathematics course updated', time: '4 hours ago' },
    { type: 'payment', message: 'Payment received for Gita Philosophy', time: '6 hours ago' },
    { type: 'batch', message: 'New batch created for Vedic Astrology', time: '1 day ago' },
    { type: 'student', message: 'Student completed Advanced Sanskrit', time: '2 days ago' },
  ];

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Active Courses",
      value: activeCourses.length,
      icon: BookOpen,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      change: "+2 this month",
      changeType: "increase" as const,
    },
    {
      title: "Running Batches",
      value: activeBatches.length,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      change: "+5 this week",
      changeType: "increase" as const,
    },
    {
      title: "Monthly Revenue",
      value: `₹${(monthlyRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+18%",
      changeType: "increase" as const,
    },
  ];

  const topCourses = activeCourses.slice(0, 5).map((course: any) => ({
    ...course,
    enrollments: Math.floor(Math.random() * 500) + 50, // Mock data
  }));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return Users;
      case 'course': return BookOpen;
      case 'payment': return DollarSign;
      case 'batch': return Calendar;
      case 'student': return Award;
      default: return Activity;
    }
  };

  return (
    <AdminLayout 
      title={`Welcome back, ${user?.firstName || 'Admin'}`}
      description="Here's what's happening in your learning platform today"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} data-testid={`card-stat-${index}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold" data-testid={`stat-value-${index}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-muted-foreground ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
        {/* Top Courses */}
        <Card data-testid="card-top-courses">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCourses.map((course: any, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`course-item-${index}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-8 rounded-full ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium text-sm sm:text-base" data-testid={`course-title-${index}`}>
                        {course.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{parseFloat(course.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      <span data-testid={`course-enrollments-${index}`}>{course.enrollments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card data-testid="card-recent-activity">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={index} className="flex items-start space-x-3" data-testid={`activity-item-${index}`}>
                    <div className="p-2 bg-muted rounded-full flex-shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" data-testid={`activity-message-${index}`}>
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`activity-time-${index}`}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Add Course", href: "/admin/courses", icon: BookOpen, color: "bg-blue-100 text-blue-700" },
              { label: "View Students", href: "/admin/students", icon: Users, color: "bg-green-100 text-green-700" },
              { label: "Manage Payments", href: "/admin/payments", icon: DollarSign, color: "bg-orange-100 text-orange-700" },
              { label: "Create Batch", href: "/admin/courses", icon: Calendar, color: "bg-purple-100 text-purple-700" },
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                data-testid={`quick-action-${index}`}
              >
                <div className={`p-3 rounded-full ${action.color} mb-2`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">{action.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}