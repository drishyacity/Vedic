import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <AlertCircle className="h-24 w-24 text-muted-foreground mx-auto mb-6" data-testid="not-found-icon" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4" data-testid="not-found-title">
              404
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground mb-6" data-testid="not-found-subtitle">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-lg mx-auto" data-testid="not-found-description">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track with your learning journey.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
              data-testid="button-go-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Link href="/">
              <Button 
                size="lg"
                className="flex items-center gap-2 w-full sm:w-auto"
                data-testid="button-home"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/courses">
                <Button variant="ghost" size="sm" data-testid="link-courses">
                  Courses
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" data-testid="link-dashboard">
                  Dashboard
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost" size="sm" data-testid="link-faq">
                  FAQ
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm" data-testid="link-contact">
                  Contact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
