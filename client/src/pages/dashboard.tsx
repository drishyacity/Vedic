import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  BookOpen, 
  Video, 
  Calendar, 
  Clock, 
  FileText, 
  Award,
  TrendingUp,
  Users,
  Bell
} from "lucide-react";
import type { Enrollment, Batch, Course, Lecture, Announcement } from "@shared/schema";

interface EnrollmentWithBatch extends Enrollment {
  batch?: Batch & { course?: Course };
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("my-classes");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<EnrollmentWithBatch[]>({
    queryKey: ["/api/enrollments/my"],
    enabled: isAuthenticated,
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  const { data: allCourses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg mb-8" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  const activeEnrollments = enrollments.filter(e => e.status === 'active');
  const completedEnrollments = enrollments.filter(e => e.status === 'completed');
  const totalProgress = activeEnrollments.length > 0 
    ? Math.round(activeEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / activeEnrollments.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-primary text-primary-foreground rounded-xl p-6 mb-8" data-testid="dashboard-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2" data-testid="welcome-message">
                Welcome back, {user?.firstName || user?.email || 'Student'}!
              </h1>
              <p className="text-primary-foreground/80">
                Continue your journey of ancient wisdom
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Overall Progress</p>
              <p className="text-3xl font-bold" data-testid="overall-progress">{totalProgress}%</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-enrolled-courses">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{activeEnrollments.length}</p>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-completed-courses">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedEnrollments.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-progress">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalProgress}%</p>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-announcements">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{announcements.length}</p>
                  <p className="text-sm text-muted-foreground">New Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="dashboard-tabs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-classes" data-testid="tab-my-classes">My Classes</TabsTrigger>
            <TabsTrigger value="explore" data-testid="tab-explore">Explore</TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">Announcements</TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="my-classes" className="mt-6" data-testid="content-my-classes">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-foreground mb-4">Your Active Courses</h3>
                {enrollmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-8 bg-muted rounded mb-4" />
                          <div className="h-2 bg-muted rounded" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : activeEnrollments.length === 0 ? (
                  <Card data-testid="no-active-courses">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-foreground mb-2">No Active Courses</h4>
                      <p className="text-muted-foreground mb-4">
                        You haven't enrolled in any courses yet. Explore our course catalog to get started!
                      </p>
                      <Button onClick={() => setActiveTab("explore")} data-testid="button-explore-courses">
                        Explore Courses
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeEnrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="hover-lift" data-testid={`enrollment-${enrollment.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-foreground" data-testid={`enrollment-title-${enrollment.id}`}>
                              {enrollment.batch?.title || 'Course Batch'}
                            </h4>
                            <Badge 
                              className="bg-primary/10 text-primary"
                              data-testid={`enrollment-status-${enrollment.id}`}
                            >
                              In Progress
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>Dr. Raghavan</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{enrollment.batch?.schedule || 'Mon, Wed, Fri'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{enrollment.batch?.time || '7:00 PM'}</span>
                            </span>
                          </div>
                          <Progress value={enrollment.progress || 0} className="mb-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Progress: {enrollment.progress || 0}%
                            </span>
                            <Button 
                              onClick={() => window.location.href = `/batch/${enrollment.batchId}`}
                              data-testid={`button-enter-batch-${enrollment.id}`}
                            >
                              Enter Batch Room
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Classes */}
                <Card data-testid="upcoming-classes">
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">Sanskrit Grammar</p>
                          <p className="text-xs text-muted-foreground">Today, 7:00 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">Gita Chapter 4</p>
                          <p className="text-xs text-muted-foreground">Tomorrow, 6:30 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Assignments */}
                <Card data-testid="recent-assignments">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Sanskrit Translation</span>
                        <Badge className="bg-accent/20 text-accent-foreground text-xs">Graded</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Gita Verse Analysis</span>
                        <Badge className="bg-primary/10 text-primary text-xs">Submitted</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Pronunciation Practice</span>
                        <Badge className="bg-destructive/10 text-destructive text-xs">Due Soon</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="explore" className="mt-6" data-testid="content-explore">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCourses.map((course) => (
                <Card key={course.id} className="hover-lift" data-testid={`explore-course-${course.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-primary/10 text-primary">Course</Badge>
                      <span className="text-accent font-bold">₹{parseFloat(course.price).toLocaleString()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = `/course/${course.slug}`}
                      data-testid={`button-view-course-${course.id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="mt-6" data-testid="content-announcements">
            {announcements.length === 0 ? (
              <Card data-testid="no-announcements">
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-foreground mb-2">No Announcements</h4>
                  <p className="text-muted-foreground">
                    You'll see important updates and announcements from your courses here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} data-testid={`announcement-${announcement.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{announcement.title}</h4>
                        {announcement.isPinned && (
                          <Badge className="bg-accent/20 text-accent-foreground">Pinned</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{announcement.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt!).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6" data-testid="content-profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="profile-info">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground">
                      {user?.firstName || user?.lastName 
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : 'Not provided'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="text-foreground capitalize">{user?.role || 'Student'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-foreground">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="learning-stats">
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Courses Enrolled</span>
                    <span className="font-semibold">{enrollments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Courses Completed</span>
                    <span className="font-semibold">{completedEnrollments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Progress</span>
                    <span className="font-semibold">{totalProgress}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Certificates Earned</span>
                    <span className="font-semibold">{completedEnrollments.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
