import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useLocation } from "wouter";
import type { Course, Category } from "@shared/schema";

interface CourseCardProps {
  course: Course & { category?: Category };
  onEnroll?: (courseId: number) => void;
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
  const [, setLocation] = useLocation();
  const getCategoryColor = (categoryName?: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'sanskrit':
        return 'bg-primary/10 text-primary';
      case 'philosophy':
        return 'bg-secondary/10 text-secondary';
      case 'mathematics':
        return 'bg-primary/10 text-primary';
      case 'vedas':
        return 'bg-primary/10 text-primary';
      case 'wellness':
        return 'bg-secondary/10 text-secondary';
      case 'astrology':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getDefaultThumbnail = (categoryName?: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'sanskrit':
        return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'philosophy':
        return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'mathematics':
        return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'vedas':
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'wellness':
        return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'astrology':
        return 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      default:
        return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
    }
  };

  return (
    <Card className="overflow-hidden hover-lift" data-testid={`card-course-${course.id}`}>
      <img
        src={course.thumbnail || getDefaultThumbnail(course.category?.name)}
        alt={course.title}
        className="w-full h-48 object-cover"
        data-testid={`img-course-${course.id}`}
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge
            className={getCategoryColor(course.category?.name)}
            data-testid={`badge-category-${course.id}`}
          >
            {course.category?.name || 'General'}
          </Badge>
          <span className="text-accent font-bold" data-testid={`text-price-${course.id}`}>
            ₹{parseFloat(course.price).toLocaleString()}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3" data-testid={`text-title-${course.id}`}>
          {course.title}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`text-description-${course.id}`}>
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span data-testid={`text-duration-${course.id}`}>
              {course.duration || '6 months'}
            </span>
          </div>
          <Button
            onClick={() => setLocation(`/course/${course.slug}`)}
            data-testid={`button-know-more-${course.id}`}
          >
            Know More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
