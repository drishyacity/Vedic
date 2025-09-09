import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Video, 
  Play, 
  FileText, 
  Download, 
  Upload, 
  Clock,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import type { Batch, Course, Lecture, Resource, Announcement } from "@shared/schema";

interface BatchWithCourse extends Batch {
  course?: Course;
}

export default function BatchRoom() {
  const { id } = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("live");

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

  const batchId = parseInt(id || "0");

  const { data: batch, isLoading: batchLoading } = useQuery<BatchWithCourse>({
    queryKey: ["/api/batches", batchId],
    enabled: isAuthenticated && !!batchId,
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

  const { data: lectures = [] } = useQuery<Lecture[]>({
    queryKey: ["/api/batches", batchId, "lectures"],
    enabled: isAuthenticated && !!batchId,
  });

  const { data: resources = [] } = useQuery<Resource[]>({
    queryKey: ["/api/batches", batchId, "resources"],
    enabled: isAuthenticated && !!batchId,
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/batches", batchId, "announcements"],
    enabled: isAuthenticated && !!batchId,
  });

  if (isLoading || batchLoading || !isAuthenticated) {
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

  if (!batch) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16" data-testid="batch-not-found">
            <h1 className="text-2xl font-bold text-foreground mb-4">Batch Not Found</h1>
            <p className="text-muted-foreground mb-8">The batch you're looking for doesn't exist or you don't have access.</p>
            <Button onClick={() => window.location.href = '/dashboard'} data-testid="button-back-to-dashboard">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const upcomingLectures = lectures.filter(lecture => 
    lecture.dateTime && new Date(lecture.dateTime) > new Date()
  );
  const nextLecture = upcomingLectures.sort((a, b) => 
    new Date(a.dateTime!).getTime() - new Date(b.dateTime!).getTime()
  )[0];

  const recordedLectures = lectures.filter(lecture => 
    lecture.recordingUrl && lecture.isCompleted
  );

  const notes = resources.filter(resource => resource.type === 'notes' || resource.type === 'pdf');
  const assignments = resources.filter(resource => resource.type === 'assignment');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-primary text-primary-foreground rounded-xl p-6 mb-8" data-testid="batch-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2" data-testid="batch-title">
                {batch.title}
              </h1>
              <p className="text-primary-foreground/80 mb-2" data-testid="batch-course">
                {batch.course?.title || 'Course'}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="batch-schedule">{batch.schedule || 'Mon, Wed, Fri'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span data-testid="batch-time">{batch.time || '7:00 PM'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Dr. Raghavan</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-primary-foreground/20 text-primary-foreground mb-2">
                Active Batch
              </Badge>
              <p className="text-sm text-primary-foreground/80">
                {batch.maxStudents || 50} students enrolled
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="batch-tabs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live" data-testid="tab-live">Live</TabsTrigger>
            <TabsTrigger value="recordings" data-testid="tab-recordings">Recordings</TabsTrigger>
            <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
            <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6" data-testid="content-live">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {nextLecture ? (
                  <Card data-testid="next-lecture">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Video className="h-5 w-5" />
                        <span>Next Live Class</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <h3 className="text-xl font-semibold text-foreground mb-2" data-testid="next-lecture-title">
                          {nextLecture.title}
                        </h3>
                        <p className="text-muted-foreground mb-4" data-testid="next-lecture-description">
                          {nextLecture.description}
                        </p>
                        <div className="bg-muted rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span data-testid="next-lecture-date">
                                {new Date(nextLecture.dateTime!).toLocaleDateString()}
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span data-testid="next-lecture-time">
                                {new Date(nextLecture.dateTime!).toLocaleTimeString()}
                              </span>
                            </span>
                          </div>
                        </div>
                        {nextLecture.liveLink ? (
                          <Button 
                            size="lg" 
                            className="w-full sm:w-auto"
                            onClick={() => window.open(nextLecture.liveLink!, '_blank')}
                            data-testid="button-join-live"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Join Live Class
                          </Button>
                        ) : (
                          <Button size="lg" disabled data-testid="button-class-not-ready">
                            Class Link Not Available
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card data-testid="no-upcoming-classes">
                    <CardContent className="p-8 text-center">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Classes</h3>
                      <p className="text-muted-foreground">
                        No live classes are scheduled at the moment. Check back later for updates.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Announcements */}
                <Card data-testid="live-announcements">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {announcements.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No announcements yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {announcements.slice(0, 3).map((announcement) => (
                          <div key={announcement.id} className="border-l-2 border-primary pl-3" data-testid={`announcement-${announcement.id}`}>
                            <h5 className="font-medium text-foreground text-sm">{announcement.title}</h5>
                            <p className="text-xs text-muted-foreground">{announcement.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card data-testid="class-schedule">
                  <CardHeader>
                    <CardTitle className="text-lg">Class Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Days</span>
                        <span className="font-medium">{batch.schedule || 'Mon, Wed, Fri'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{batch.time || '7:00 PM'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">1.5 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recordings" className="mt-6" data-testid="content-recordings">
            {recordedLectures.length === 0 ? (
              <Card data-testid="no-recordings">
                <CardContent className="p-8 text-center">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Recordings Available</h3>
                  <p className="text-muted-foreground">
                    Class recordings will appear here after live sessions are completed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recordedLectures.map((lecture) => (
                  <Card key={lecture.id} className="hover-lift" data-testid={`recording-${lecture.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1" data-testid={`recording-title-${lecture.id}`}>
                            {lecture.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2" data-testid={`recording-description-${lecture.id}`}>
                            {lecture.description}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {lecture.dateTime && new Date(lecture.dateTime).toLocaleDateString()}
                          </p>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => window.open(lecture.recordingUrl!, '_blank')}
                            data-testid={`button-watch-recording-${lecture.id}`}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Watch Recording
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-6" data-testid="content-notes">
            {notes.length === 0 ? (
              <Card data-testid="no-notes">
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Notes Available</h3>
                  <p className="text-muted-foreground">
                    Study materials and notes will be shared here by your instructor.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <Card key={note.id} className="hover-lift" data-testid={`note-${note.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1" data-testid={`note-title-${note.id}`}>
                            {note.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2" data-testid={`note-description-${note.id}`}>
                            {note.description}
                          </p>
                          <Badge className="mb-3" data-testid={`note-type-${note.id}`}>
                            {note.type === 'pdf' ? 'PDF' : 'Notes'}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(note.fileUrl!, '_blank')}
                            data-testid={`button-download-note-${note.id}`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="mt-6" data-testid="content-assignments">
            {assignments.length === 0 ? (
              <Card data-testid="no-assignments">
                <CardContent className="p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Assignments Yet</h3>
                  <p className="text-muted-foreground">
                    Assignments and practice exercises will appear here when posted by your instructor.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {assignments.map((assignment) => (
                  <Card key={assignment.id} data-testid={`assignment-${assignment.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Upload className="h-6 w-6 text-accent-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1" data-testid={`assignment-title-${assignment.id}`}>
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2" data-testid={`assignment-description-${assignment.id}`}>
                              {assignment.description}
                            </p>
                            {assignment.dueDate && (
                              <div className="flex items-center space-x-2 text-sm">
                                {new Date(assignment.dueDate) > new Date() ? (
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-muted-foreground">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge 
                          className={
                            assignment.dueDate && new Date(assignment.dueDate) < new Date()
                              ? "bg-destructive/10 text-destructive"
                              : "bg-primary/10 text-primary"
                          }
                          data-testid={`assignment-status-${assignment.id}`}
                        >
                          {assignment.dueDate && new Date(assignment.dueDate) < new Date() ? 'Overdue' : 'Active'}
                        </Badge>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {assignment.fileUrl && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(assignment.fileUrl!, '_blank')}
                              data-testid={`button-download-assignment-${assignment.id}`}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          data-testid={`button-submit-assignment-${assignment.id}`}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Work
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
