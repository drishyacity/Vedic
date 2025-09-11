import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout";
import { 
  BarChart3, 
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Calendar,
  Eye,
  Target,
  Award,
  Activity
} from "lucide-react";

export default function AdminAnalytics() {
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
        window.location.href = "/admin";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Analytics data
  const analyticsData = {
    totalRevenue: 156000,
    totalStudents: 245,
    activeCourses: 12,
    completionRate: 78,
    monthlyGrowth: 12,
    avgSessionTime: "24 minutes",
    topCourses: [
      { name: "Sanskrit Fundamentals", enrollments: 89, revenue: 89000 },
      { name: "Vedic Philosophy", enrollments: 67, revenue: 67000 },
      { name: "Yoga & Meditation", enrollments: 45, revenue: 45000 },
    ],
    recentMetrics: {
      pageViews: 12450,
      newSignups: 34,
      courseCompletions: 23,
      feedbackScore: 4.8
    }
  };

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Loading..." description="Please wait...">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-6 sm:mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 sm:h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Analytics Dashboard" 
      description="Monitor platform performance and key metrics"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card data-testid="metric-revenue">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">₹{(analyticsData.totalRevenue / 1000).toFixed(0)}k</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-students">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{analyticsData.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-courses">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-accent-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{analyticsData.activeCourses}</p>
                <p className="text-sm text-muted-foreground">Active Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="metric-completion">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{analyticsData.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card data-testid="top-courses">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top Performing Courses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg" data-testid={`top-course-${index}`}>
                  <div>
                    <p className="font-medium text-foreground">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.enrollments} enrollments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{(course.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="recent-metrics">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Eye className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{analyticsData.recentMetrics.pageViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Users className="h-6 w-6 text-secondary" />
                <div>
                  <p className="font-semibold text-foreground">{analyticsData.recentMetrics.newSignups}</p>
                  <p className="text-sm text-muted-foreground">New Signups</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Target className="h-6 w-6 text-accent-foreground" />
                <div>
                  <p className="font-semibold text-foreground">{analyticsData.recentMetrics.courseCompletions}</p>
                  <p className="text-sm text-muted-foreground">Completions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Award className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{analyticsData.recentMetrics.feedbackScore}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart Placeholder */}
      <Card data-testid="growth-chart">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Monthly Growth Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chart visualization will be implemented here</p>
              <p className="text-sm text-muted-foreground mt-2">
                Growth: +{analyticsData.monthlyGrowth}% this month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}