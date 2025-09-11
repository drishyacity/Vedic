import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function EnrollmentSuccess() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const handleButtonClick = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center" data-testid="enrollment-success-card">
        <CardContent className="p-8">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="success-title">
            Enrolled Successfully!
          </h1>
          <p className="text-muted-foreground mb-6" data-testid="success-message">
            Congratulations! You have successfully enrolled in the course. 
            You can now access your course content and track your progress from your dashboard.
          </p>
          <Button 
            onClick={handleButtonClick}
            className="w-full"
            data-testid={isAuthenticated ? "button-go-to-dashboard" : "button-sign-in-to-dashboard"}
          >
            {isAuthenticated ? "Go to Dashboard" : "Sign in to access dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}