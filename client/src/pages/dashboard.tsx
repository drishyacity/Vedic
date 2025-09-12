import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
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
  Home,
  PlayCircle,
  FileVideo,
  NotebookPen,
  CheckCircle2,
  CircleDot,
  Zap,
  BookmarkCheck,
  AlertCircle
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

interface LectureWithBatch extends Lecture {
  batch?: Batch & { course?: Course };
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<SidebarSection>("my-classes");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

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

  // Today's and Live Lectures
  const { data: todaysLectures = [], isLoading: todaysLecturesLoading } = useQuery<LectureWithBatch[]>({
    queryKey: ["/api/lectures/today"],
    enabled: isAuthenticated,
  });

  const { data: liveLectures = [], isLoading: liveLecturesLoading } = useQuery<LectureWithBatch[]>({
    queryKey: ["/api/lectures/live"],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds for live lectures
  });

  // Chapters for selected course with error handling
  const { data: chapters = [], isLoading: chaptersLoading, error: chaptersError } = useQuery<Chapter[]>({
    queryKey: ["/api/courses", selectedCourse, "chapters"],
    enabled: isAuthenticated && !!selectedCourse,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false; // Don't retry on 404
      return failureCount < 2; // Retry up to 2 times for other errors
    },
  });

  // Chapter items with improved caching and error handling (FIXES STALE DATA BUG)
  const { data: chapterItems = [], isLoading: chapterItemsLoading, error: chapterItemsError } = useQuery<ChapterItem[]>({
    queryKey: ["chapter-items", selectedChapter, selectedCourse], // Better query key to prevent stale data
    enabled: isAuthenticated && !!selectedChapter && !!selectedCourse,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });

  // Reset selected chapter when course changes to prevent stale data
  useEffect(() => {
    if (selectedCourse) {
      setSelectedChapter(null);
    }
  }, [selectedCourse]);

  // Handle chapters error
  useEffect(() => {
    if (chaptersError) {
      console.error("Error fetching chapters:", chaptersError);
      toast({
        title: "Error loading chapters",
        description: "Failed to load course chapters. Please try again.",
        variant: "destructive",
      });
    }
  }, [chaptersError, toast]);

  // Handle chapter items error
  useEffect(() => {
    if (chapterItemsError) {
      console.error("Error fetching chapter items:", chapterItemsError);
      toast({
        title: "Error loading chapter content",
        description: "Failed to load chapter items. Please try again.",
        variant: "destructive",
      });
    }
  }, [chapterItemsError, toast]);

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
  
  // Filter enrollments to only include those with valid course data (CRITICAL FIX)
  const validActiveEnrollments = activeEnrollments.filter(
    (enrollment: EnrollmentWithBatch) => 
      enrollment.batch?.course?.id && 
      enrollment.batch?.course?.title
  );
  
  const totalProgress = validActiveEnrollments.length > 0 
    ? Math.round(validActiveEnrollments.reduce((sum: number, e: Enrollment) => sum + (e.progress || 0), 0) / validActiveEnrollments.length)
    : 0;

  // Auto-select course if user has exactly one valid enrollment (UX ENHANCEMENT)
  useEffect(() => {
    if (validActiveEnrollments.length === 1 && !selectedCourse) {
      const courseId = validActiveEnrollments[0].batch?.course?.id;
      if (courseId) {
        setSelectedCourse(courseId);
      }
    }
  }, [validActiveEnrollments, selectedCourse]);

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
                  <p className="text-2xl font-bold text-foreground">{validActiveEnrollments.length}</p>
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
              <div className="space-y-6">
                {/* Course Selection Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground" data-testid="my-classes-title">My Classes</h3>
                    <p className="text-muted-foreground text-sm">Manage your learning journey</p>
                  </div>
                  {validActiveEnrollments.length > 0 && (
                    <div className="w-full sm:w-64">
                      <Select 
                        value={selectedCourse?.toString() || ""} 
                        onValueChange={(value) => {
                          const courseId = value ? parseInt(value) : null;
                          setSelectedCourse(courseId);
                          setSelectedChapter(null);
                        }}
                      >
                        <SelectTrigger data-testid="course-selector">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {validActiveEnrollments.map((enrollment) => {
                            const courseId = enrollment.batch!.course!.id!; // Safe to use ! since we filtered
                            const courseTitle = enrollment.batch!.course!.title!;
                            return (
                              <SelectItem 
                                key={enrollment.id} 
                                value={courseId.toString()}
                                data-testid={`course-option-${courseId}`}
                              >
                                {courseTitle}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {validActiveEnrollments.length === 0 ? (
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Today's Classes Section */}
                      <Card data-testid="todays-classes">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5" />
                            <span>Today's Classes</span>
                            {(todaysLecturesLoading || liveLecturesLoading) && (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Live Classes */}
                          {liveLectures.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                                <Zap className="h-4 w-4 text-red-500" />
                                <span>Live Now</span>
                              </h5>
                              <div className="space-y-2">
                                {liveLectures.map((lecture) => (
                                  <div 
                                    key={lecture.id} 
                                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                                    data-testid={`live-lecture-${lecture.id}`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="relative">
                                        <PlayCircle className="h-8 w-8 text-red-500" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-foreground text-sm">{lecture.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {lecture.batch?.course?.title || 'Course'}
                                        </p>
                                      </div>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      className="bg-red-500 hover:bg-red-600"
                                      onClick={() => lecture.liveLink && window.open(lecture.liveLink, '_blank')}
                                      data-testid={`join-live-${lecture.id}`}
                                    >
                                      Join Now
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Scheduled Classes */}
                          {todaysLecturesLoading ? (
                            <div className="space-y-3">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-3">
                                  <Skeleton className="h-8 w-8 rounded-lg" />
                                  <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : todaysLectures.length === 0 && liveLectures.length === 0 ? (
                            <div className="text-center py-6">
                              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {todaysLectures.filter(lecture => !liveLectures.find(live => live.id === lecture.id)).map((lecture) => (
                                <div 
                                  key={lecture.id} 
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                  data-testid={`scheduled-lecture-${lecture.id}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                      <Video className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground text-sm">{lecture.title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {lecture.dateTime && new Date(lecture.dateTime).toLocaleTimeString([], { 
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                        })} • {lecture.batch?.course?.title || 'Course'}
                                      </p>
                                    </div>
                                  </div>
                                  {lecture.liveLink && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => window.open(lecture.liveLink!, '_blank')}
                                      data-testid={`join-scheduled-${lecture.id}`}
                                    >
                                      Join Class
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Chapter Content for Selected Course */}
                      {selectedCourse && (
                        <Card data-testid="course-chapters">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <BookOpen className="h-5 w-5" />
                              <span>Course Content</span>
                              {chaptersLoading && (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {chaptersLoading ? (
                              <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                  <Skeleton key={i} className="h-12 w-full" />
                                ))}
                              </div>
                            ) : (chapters as Chapter[]).length === 0 ? (
                              <div className="text-center py-6">
                                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">No chapters available yet</p>
                              </div>
                            ) : (
                              <Accordion type="single" collapsible className="w-full">
                                {(chapters as Chapter[]).map((chapter: Chapter) => (
                                  <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                                    <AccordionTrigger 
                                      className="hover:no-underline"
                                      onClick={() => setSelectedChapter(chapter.id)}
                                      data-testid={`chapter-trigger-${chapter.id}`}
                                    >
                                      <div className="flex items-center space-x-3 text-left">
                                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                                          <span className="text-xs font-medium">{chapter.position || 1}</span>
                                        </div>
                                        <div>
                                          <h4 className="font-medium">{chapter.title}</h4>
                                          {chapter.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                              {chapter.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      {selectedChapter === chapter.id && (
                                        <div className="pt-4">
                                          {chapterItemsError ? (
                                            <div className="text-center py-4">
                                              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                                              <p className="text-sm text-destructive mb-2">Failed to load chapter content</p>
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => window.location.reload()}
                                                data-testid="button-retry-chapter-items"
                                              >
                                                Try Again
                                              </Button>
                                            </div>
                                          ) : chapterItemsLoading ? (
                                            <div className="space-y-2">
                                              {[1, 2].map((i) => (
                                                <Skeleton key={i} className="h-8 w-full" />
                                              ))}
                                            </div>
                                          ) : (chapterItems as ChapterItem[]).length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No content available</p>
                                          ) : (
                                            <div className="space-y-2">
                                              {(chapterItems as ChapterItem[]).map((item: ChapterItem) => (
                                                <div 
                                                  key={item.id} 
                                                  className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                                                  data-testid={`chapter-item-${item.id}`}
                                                >
                                                  {item.type === 'video' && <FileVideo className="h-4 w-4 text-blue-500" />}
                                                  {item.type === 'note' && <NotebookPen className="h-4 w-4 text-green-500" />}
                                                  {item.type === 'work' && <FileText className="h-4 w-4 text-orange-500" />}
                                                  <div className="flex-1">
                                                    <p className="text-sm font-medium">{item.title}</p>
                                                    {item.description && (
                                                      <p className="text-xs text-muted-foreground line-clamp-1">
                                                        {item.description}
                                                      </p>
                                                    )}
                                                  </div>
                                                  {item.url && (
                                                    <Button 
                                                      variant="ghost" 
                                                      size="sm"
                                                      onClick={() => window.open(item.url!, '_blank')}
                                                      data-testid={`open-item-${item.id}`}
                                                    >
                                                      <ExternalLink className="h-3 w-3" />
                                                    </Button>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Quick Access to All Enrollments */}
                      {!selectedCourse && (
                        <Card data-testid="all-enrollments">
                          <CardHeader>
                            <CardTitle>Your Active Courses</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {activeEnrollments.map((enrollment: EnrollmentWithBatch) => (
                                <div 
                                  key={enrollment.id} 
                                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                  data-testid={`enrollment-${enrollment.id}`}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                      <BookOpen className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-foreground">
                                        {enrollment.batch?.course?.title || enrollment.batch?.title || 'Course'}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Progress: {enrollment.progress || 0}%
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedCourse(enrollment.batch?.course?.id || null)}
                                      data-testid={`select-course-${enrollment.id}`}
                                    >
                                      View Content
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={() => window.location.href = `/batch/${enrollment.batchId}`}
                                      data-testid={`enter-batch-${enrollment.id}`}
                                    >
                                      Enter Batch
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                      {/* Quick Stats */}
                      <Card data-testid="quick-stats">
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Active Courses</span>
                            <Badge variant="secondary">{activeEnrollments.length}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Today's Classes</span>
                            <Badge variant="secondary">{todaysLectures.length}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Live Now</span>
                            <Badge variant={liveLectures.length > 0 ? "destructive" : "secondary"}>
                              {liveLectures.length}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Activity */}
                      <Card data-testid="recent-activity">
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <div>
                                <p className="text-sm font-medium">Completed Chapter 1</p>
                                <p className="text-xs text-muted-foreground">2 hours ago</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <div>
                                <p className="text-sm font-medium">Joined Sanskrit class</p>
                                <p className="text-xs text-muted-foreground">1 day ago</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              <div>
                                <p className="text-sm font-medium">Assignment submitted</p>
                                <p className="text-xs text-muted-foreground">3 days ago</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Actions */}
                      <Card data-testid="quick-actions">
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => setActiveSection('announcements')}
                            data-testid="view-announcements"
                          >
                            <Bell className="h-4 w-4 mr-2" />
                            View Announcements
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => setActiveSection('library')}
                            data-testid="access-library"
                          >
                            <Library className="h-4 w-4 mr-2" />
                            Access Library
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => setActiveSection('help')}
                            data-testid="get-help"
                          >
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Get Help
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
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