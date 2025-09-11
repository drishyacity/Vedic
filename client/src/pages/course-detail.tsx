import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Users, Award, Calendar, Star } from "lucide-react";
import type { Course, Batch } from "@shared/schema";

export default function CourseDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["/api/courses", slug],
  });

  const { data: batches = [] } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
    enabled: !!course,
  });

  const courseBatches = batches.filter(batch => batch.courseId === course?.id);

  const handleEnroll = (batchId: number) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    // For now, redirect to dashboard - payment integration would go here
    window.location.href = "/dashboard";
  };

  const getDefaultThumbnail = () => {
    return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600';
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-8" />
            <div className="h-8 bg-muted rounded mb-4" />
            <div className="h-20 bg-muted rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-muted rounded" />
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16" data-testid="course-not-found">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
            <Button onClick={() => window.location.href = '/courses'} data-testid="button-back-to-courses">
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        <img
          src={course.thumbnail || getDefaultThumbnail()}
          alt={course.title}
          className="w-full h-64 md:h-96 object-cover"
          data-testid="course-hero-image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <Badge className="mb-4" data-testid="course-category">
              Sanskrit
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" data-testid="course-title">
              {course.title}
            </h1>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span data-testid="course-duration">{course.duration || '6 months'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span data-testid="course-enrolled">324 enrolled</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span data-testid="course-rating">4.8 (156 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle data-testid="description-title">Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid="course-description">
                  {course.description || 
                    "Learn to read, write, and understand Sanskrit from the basics to advanced levels with expert guidance. This comprehensive course covers grammar, vocabulary, pronunciation, and practical applications in understanding ancient texts."
                  }
                </p>
              </CardContent>
            </Card>

            {/* Course Syllabus */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle data-testid="syllabus-title">Course Syllabus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Module 1: Sanskrit Basics</h4>
                    <p className="text-sm text-muted-foreground">
                      Introduction to Devanagari script, basic pronunciation, and fundamental grammar
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Module 2: Grammar Foundation</h4>
                    <p className="text-sm text-muted-foreground">
                      Noun declensions, verb conjugations, and sentence structure
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Module 3: Classical Texts</h4>
                    <p className="text-sm text-muted-foreground">
                      Reading and understanding classical Sanskrit literature
                    </p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Module 4: Advanced Composition</h4>
                    <p className="text-sm text-muted-foreground">
                      Writing original Sanskrit compositions and poetry
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle data-testid="instructor-title">Meet Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2" data-testid="instructor-name">
                      Dr. Raghavan Sharma
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3" data-testid="instructor-credentials">
                      PhD in Sanskrit Literature, 15+ years of teaching experience
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid="instructor-bio">
                      Dr. Sharma is a renowned Sanskrit scholar with extensive experience in teaching 
                      both traditional and modern approaches to Sanskrit learning. He has authored 
                      several books and research papers on ancient Indian literature.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold text-foreground" data-testid="course-price">
                    ₹{parseFloat(course.price).toLocaleString()}
                  </span>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {course.duration || '6 months'} duration
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Certificate of completion
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Live interactive classes
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full mb-4" 
                  size="lg"
                  onClick={() => handleEnroll(courseBatches[0]?.id || 1)}
                  data-testid="button-enroll-course"
                >
                  {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>

            {/* Available Batches */}
            {courseBatches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" data-testid="batches-title">Available Batches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courseBatches.map((batch) => (
                      <div key={batch.id} className="border border-border rounded-lg p-4" data-testid={`batch-${batch.id}`}>
                        <h4 className="font-semibold text-foreground mb-2">{batch.title}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span data-testid={`batch-schedule-${batch.id}`}>{batch.schedule || 'Mon, Wed, Fri'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span data-testid={`batch-time-${batch.id}`}>{batch.time || '7:00 PM'}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 w-full"
                          onClick={() => handleEnroll(batch.id)}
                          data-testid={`button-enroll-batch-${batch.id}`}
                        >
                          Join This Batch
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg" data-testid="features-title">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2" data-testid="feature-live-classes">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Live interactive classes</span>
                  </li>
                  <li className="flex items-center space-x-2" data-testid="feature-recordings">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Recorded class access</span>
                  </li>
                  <li className="flex items-center space-x-2" data-testid="feature-materials">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Study materials & notes</span>
                  </li>
                  <li className="flex items-center space-x-2" data-testid="feature-assignments">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Practice assignments</span>
                  </li>
                  <li className="flex items-center space-x-2" data-testid="feature-certificate">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center space-x-2" data-testid="feature-support">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>1-on-1 mentor support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
