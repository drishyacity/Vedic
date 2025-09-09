import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import { Star, Users, TrendingUp, Award } from "lucide-react";
import type { Course, Category } from "@shared/schema";

interface CourseWithCategory extends Course {
  category?: Category;
}

export default function Landing() {
  const { data: courses = [] } = useQuery<CourseWithCategory[]>({
    queryKey: ["/api/courses"],
  });

  const featuredCourses = courses.slice(0, 6);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-bg hero-pattern text-primary-foreground py-20" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight" data-testid="hero-title">
              Learn Ancient Indian Wisdom<br />
              <span className="text-accent">the Modern Way</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto" data-testid="hero-description">
              Master the Vedas, Gita, Sanskrit, Ancient Mathematics, and Yoga through interactive online courses with expert mentors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                onClick={() => window.location.href = '/courses'}
                data-testid="button-explore-courses"
              >
                Explore Courses
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
                onClick={handleLogin}
                data-testid="button-watch-demo"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center" data-testid="stat-students">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">1,247</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center" data-testid="stat-courses">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-foreground">24</div>
              <div className="text-muted-foreground">Expert Courses</div>
            </div>
            <div className="text-center" data-testid="stat-completion">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground">94%</div>
              <div className="text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center" data-testid="stat-satisfaction">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">4.8</div>
              <div className="text-muted-foreground">Student Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-muted" data-testid="featured-courses-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="featured-courses-title">
              Featured Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="featured-courses-description">
              Embark on a journey of ancient wisdom with our carefully curated courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={() => window.location.href = `/course/${course.slug}`}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => window.location.href = '/courses'}
              data-testid="button-view-all-courses"
            >
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-background" data-testid="dashboard-preview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="dashboard-preview-title">
              Your Learning Dashboard
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="dashboard-preview-description">
              Track your progress, access live classes, and manage your ancient wisdom journey
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
            <div className="bg-primary text-primary-foreground p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold" data-testid="dashboard-welcome">Welcome back, Student!</h3>
                  <p className="text-primary-foreground/80">Continue your journey of ancient wisdom</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary-foreground/80">Progress</p>
                  <p className="text-2xl font-bold" data-testid="dashboard-progress">68%</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Sample Course Progress</h4>
                  <div className="bg-muted rounded-lg p-4 border border-border">
                    <h5 className="font-semibold text-foreground mb-2">Sanskrit Mastery</h5>
                    <div className="w-full bg-background rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Progress: 75%</span>
                      <Button size="sm" onClick={handleLogin} data-testid="button-join-demo">
                        Join Demo Class
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Upcoming Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground text-sm">📹</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">Live Interactive Classes</p>
                        <p className="text-xs text-muted-foreground">Join scheduled live sessions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-secondary-foreground text-sm">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">Assignments & Progress</p>
                        <p className="text-xs text-muted-foreground">Track your learning journey</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="testimonials-title">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="testimonials-description">
              Hear from learners who have transformed their understanding of ancient wisdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card data-testid="testimonial-1">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300"
                    alt="Student testimonial"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">Priya Sharma</h4>
                    <p className="text-sm text-muted-foreground">Sanskrit Student</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "The Sanskrit course completely transformed my understanding of our ancient texts. The teaching method makes complex concepts so accessible."
                </p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="testimonial-2">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300"
                    alt="Student testimonial"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">Rajesh Kumar</h4>
                    <p className="text-sm text-muted-foreground">Gita Philosophy Student</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "The Bhagavad Gita course has been life-changing. The insights into each verse have given me practical wisdom for daily life."
                </p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="testimonial-3">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Meera Nair</h4>
                    <p className="text-sm text-muted-foreground">Yoga & Meditation Student</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "The authentic yoga practices taught here are so different from what I learned elsewhere. The connection to Patanjali's sutras is profound."
                </p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg hero-pattern text-primary-foreground" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6" data-testid="cta-title">
            Begin Your Journey of
            <span className="text-accent"> Ancient Wisdom</span>
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto" data-testid="cta-description">
            Join thousands of students who are rediscovering the timeless teachings of our ancestors through modern, interactive learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
              onClick={handleLogin}
              data-testid="button-start-learning"
            >
              Start Learning Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
              onClick={handleLogin}
              data-testid="button-schedule-demo"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-lg">🕉</span>
                </div>
                <span className="text-xl font-bold">Vedic</span>
              </div>
              <p className="text-background/80">
                Learn ancient Indian wisdom through modern, interactive online courses with expert mentors and authentic teachings.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-background mb-4">Courses</h4>
              <ul className="space-y-2 text-background/80">
                <li><a href="/courses" className="hover:text-background transition-colors">Sanskrit Language</a></li>
                <li><a href="/courses" className="hover:text-background transition-colors">Bhagavad Gita</a></li>
                <li><a href="/courses" className="hover:text-background transition-colors">Vedic Studies</a></li>
                <li><a href="/courses" className="hover:text-background transition-colors">Ancient Mathematics</a></li>
                <li><a href="/courses" className="hover:text-background transition-colors">Yoga & Meditation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-background mb-4">Support</h4>
              <ul className="space-y-2 text-background/80">
                <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Student Portal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-background mb-4">Legal</h4>
              <ul className="space-y-2 text-background/80">
                <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-background/60 text-sm">
                © 2024 Vedic Learning Platform. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <span className="text-background/60 text-sm">Made with ❤️ for preserving ancient wisdom</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
