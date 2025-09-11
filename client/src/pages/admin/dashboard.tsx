import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
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
import { useEffect } from "react";
import type { Course, Batch, Enrollment, Order } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const { data: batches = [] } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Loading..." description="Please wait...">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 sm:h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            <div className="h-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-32 bg-muted rounded lg:col-span-2" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const activeCourses = courses.filter((course: any) => course.isActive);
  const activeBatches = batches.filter((batch: any) => batch.isActive);
  const totalStudents = 1247; // This would come from a proper API endpoint
  const monthlyRevenue = 420000; // This would come from orders aggregation

  const recentActivity = [
    { type: 'enrollment', message: 'New student enrolled in Sanskrit Mastery', time: '2 hours ago' },
    { type: 'course', message: 'Ancient Mathematics course updated', time: '4 hours ago' },
    { type: 'payment', message: 'Payment received for Gita Philosophy', time: '6 hours ago' },
    { type: 'batch', message: 'New batch created for Vedic Studies', time: '1 day ago' },
  ];

  return (
    <AdminLayout 
      title="Admin Dashboard" 
      description="Manage your Vedic learning platform"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card data-testid="stat-total-students">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold text-foreground">{totalStudents.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-active-batches">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold text-foreground">{activeBatches.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Batches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-monthly-revenue">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold text-foreground">₹{(monthlyRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Monthly Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-courses">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-2xl font-bold text-foreground">{activeCourses.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Recent Courses */}
              <Card data-testid="recent-courses">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Recent Courses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeCourses.slice(0, 5).map((course: any) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border border-border rounded-lg" data-testid={`recent-course-${course.id}`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{course.title}</p>
                            <p className="text-sm text-muted-foreground">₹{parseFloat(course.price).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-primary hover:text-secondary"
                            onClick={() => window.location.href = '/admin/courses'}
                            data-testid={`button-view-course-${course.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card data-testid="recent-activity">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3" data-testid={`activity-${index}`}>
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'enrollment' ? 'bg-primary' :
                          activity.type === 'course' ? 'bg-secondary' :
                          activity.type === 'payment' ? 'bg-accent-foreground' : 'bg-muted-foreground'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card data-testid="quick-actions" className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                      className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                      onClick={() => window.location.href = '/admin/courses'}
                      data-testid="action-add-course"
                    >
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <p className="font-medium text-foreground">Add Course</p>
                      <p className="text-sm text-muted-foreground">Create new course</p>
                    </button>
                    
                    <button 
                      className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                      onClick={() => window.location.href = '/admin/students'}
                      data-testid="action-manage-students"
                    >
                      <Users className="h-8 w-8 text-secondary mb-2" />
                      <p className="font-medium text-foreground">Manage Students</p>
                      <p className="text-sm text-muted-foreground">View and edit students</p>
                    </button>
                    
                    <button 
                      className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                      onClick={() => window.location.href = '/admin/payments'}
                      data-testid="action-view-payments"
                    >
                      <DollarSign className="h-8 w-8 text-accent-foreground mb-2" />
                      <p className="font-medium text-foreground">View Payments</p>
                      <p className="text-sm text-muted-foreground">Payment history</p>
                    </button>
                    
                    <button 
                      className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                      data-testid="action-create-batch"
                    >
                      <Calendar className="h-8 w-8 text-primary mb-2" />
                      <p className="font-medium text-foreground">Create Batch</p>
                      <p className="text-sm text-muted-foreground">Schedule new batch</p>
                    </button>
                  </div>
                </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
