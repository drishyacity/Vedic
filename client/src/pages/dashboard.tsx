import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  BookOpen, 
  Video, 
  Calendar, 
  Clock, 
  FileText, 
  Award,
  TrendingUp,
  Users,
  Bell,
  Search,
  Library,
  HelpCircle,
  LogOut,
  Play,
  Download,
  ExternalLink,
  ChevronRight,
  Home
} from "lucide-react";
import type { Enrollment, Batch, Course, Lecture, Announcement, Chapter, ChapterItem } from "@shared/schema";

interface EnrollmentWithBatch extends Enrollment {
  batch?: Batch & { course?: Course };
}

interface LibraryItem {
  id: number;
  title: string;
  type: 'video' | 'document' | 'assignment' | 'note';
  url?: string;
  courseTitle: string;
  chapterTitle?: string;
  thumbnail?: string;
}

type SidebarSection = 'my-classes' | 'explore' | 'announcements' | 'library' | 'help' | 'profile';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<SidebarSection>("my-classes");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

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
        <Footer />
      </div>
    );
  }

  const activeEnrollments = enrollments.filter((e: Enrollment) => e.status === 'active');
  const completedEnrollments = enrollments.filter((e: Enrollment) => e.status === 'completed');
  const totalProgress = activeEnrollments.length > 0 
    ? Math.round(activeEnrollments.reduce((sum: number, e: Enrollment) => sum + (e.progress || 0), 0) / activeEnrollments.length)
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

        {/* Main Content - Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveSection('my-classes')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'my-classes'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    data-testid="sidebar-my-classes"
                  >
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>My Classes</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('explore')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'explore'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    data-testid="sidebar-explore"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4" />
                      <span>Explore</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('announcements')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'announcements'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    data-testid="sidebar-announcements"
                  >
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span>Announcements</span>
                      {announcements.length > 0 && (
                        <Badge className="ml-auto bg-primary text-primary-foreground text-xs">
                          {announcements.length}
                        </Badge>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('library')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'library'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    data-testid="sidebar-library"
                  >
                    <div className="flex items-center space-x-2">
                      <Library className="h-4 w-4" />
                      <span>Library</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('help')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'help'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    data-testid="sidebar-help"
                  >
                    <div className="flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('profile')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === 'profile'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    data-testid="sidebar-profile"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">
                          {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>Profile</span>
                    </div>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'my-classes' && (
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
                        <Button onClick={() => setActiveSection("explore")} data-testid="button-explore-courses">
                          Explore Courses
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {activeEnrollments.map((enrollment: EnrollmentWithBatch) => (
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

                {/* Right Sidebar for My Classes */}
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
            )}
            
            {activeSection === 'explore' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Explore Courses</h3>
                  <div className="flex items-center space-x-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="sanskrit">Sanskrit</SelectItem>
                        <SelectItem value="philosophy">Philosophy</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            )}
            
            {activeSection === 'announcements' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Announcements</h3>
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
              </div>
            )}
            
            {activeSection === 'library' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">My Library</h3>
                  <div className="flex items-center space-x-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter content" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Content</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                        <SelectItem value="assignment">Assignments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Card data-testid="library-content">
                  <CardContent className="p-8 text-center">
                    <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">Your Library is Empty</h4>
                    <p className="text-muted-foreground mb-4">
                      As you progress through your courses, your study materials, notes, and resources will appear here.
                    </p>
                    <Button onClick={() => setActiveSection('my-classes')} data-testid="button-go-to-classes">
                      Go to My Classes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection === 'help' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Help & Support</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card data-testid="help-faq">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <HelpCircle className="h-5 w-5" />
                        <span>FAQ</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Find answers to commonly asked questions about courses, payments, and platform usage.
                      </p>
                      <Button variant="outline" className="w-full" onClick={() => window.location.href = '/faq'}>
                        View FAQ
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card data-testid="help-contact">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Contact Support</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Get in touch with our support team for technical issues or course-related questions.
                      </p>
                      <Button variant="outline" className="w-full" onClick={() => window.location.href = '/contact'}>
                        Contact Us
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card data-testid="help-center">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Help Center</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Browse detailed guides and tutorials on how to make the most of your learning experience.
                      </p>
                      <Button variant="outline" className="w-full" onClick={() => window.location.href = '/help-center'}>
                        Visit Help Center
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card data-testid="help-community">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Community</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Connect with fellow students, share insights, and learn together in our community forums.
                      </p>
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Profile Settings</h3>
                
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
                
                <Card data-testid="profile-actions">
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/api/logout'}
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}