import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/navbar";
import CourseCard from "@/components/course-card";
import { Search, Filter } from "lucide-react";
import type { Course, Category } from "@shared/schema";

interface CourseWithCategory extends Course {
  category?: Category;
}

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");

  const { data: courses = [], isLoading } = useQuery<CourseWithCategory[]>({
    queryKey: ["/api/courses"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "all" || course.category?.name === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange && priceRange !== "all") {
      const price = parseFloat(course.price);
      switch (priceRange) {
        case "low":
          matchesPrice = price < 3000;
          break;
        case "medium":
          matchesPrice = price >= 3000 && price < 5000;
          break;
        case "high":
          matchesPrice = price >= 5000;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleEnroll = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      window.location.href = `/course/${course.slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="page-title">
            Explore Our Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="page-description">
            Discover comprehensive courses on ancient Indian wisdom, taught by expert mentors
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.name}
                      data-testid={`option-category-${category.slug}`}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger data-testid="select-price">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-all-prices">All Prices</SelectItem>
                  <SelectItem value="low" data-testid="option-price-low">Under ₹3,000</SelectItem>
                  <SelectItem value="medium" data-testid="option-price-medium">₹3,000 - ₹5,000</SelectItem>
                  <SelectItem value="high" data-testid="option-price-high">Above ₹5,000</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
                data-testid="button-clear-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden" data-testid={`skeleton-${i}`}>
                <div className="w-full h-48 bg-muted animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-6 bg-muted animate-pulse rounded mb-4" />
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16" data-testid="no-courses">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all courses
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setPriceRange("all");
              }}
              className="mt-4"
              data-testid="button-show-all"
            >
              Show All Courses
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground" data-testid="results-count">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
              {(searchTerm || selectedCategory || priceRange) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" data-testid="filter-search">
                      Search: {searchTerm}
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" data-testid="filter-category">
                      {selectedCategory}
                    </Badge>
                  )}
                  {priceRange && (
                    <Badge variant="secondary" data-testid="filter-price">
                      {priceRange === "low" && "Under ₹3,000"}
                      {priceRange === "medium" && "₹3,000 - ₹5,000"}
                      {priceRange === "high" && "Above ₹5,000"}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
