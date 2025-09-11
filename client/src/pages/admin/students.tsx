import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import AdminLayout from "@/components/admin/layout";
import { 
  Users, 
  Search,
  Filter,
  Mail,
  Calendar,
  Award,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { useEffect } from "react";
import type { User, Enrollment, Batch, Course } from "@shared/schema";

interface StudentWithStats extends User {
  enrollmentCount?: number;
  completedCourses?: number;
  averageProgress?: number;
}

export default function AdminStudents() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Mock data for demonstration - in a real app, this would come from an API
  const students: StudentWithStats[] = [
    {
      id: "1",
      email: "priya.sharma@example.com",
      firstName: "Priya",
      lastName: "Sharma",
      role: "student",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b75d1d6?auto=format&fit=crop&w=150&h=150",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-12-01"),
      enrollmentCount: 3,
      completedCourses: 1,
      averageProgress: 75,
    },
    {
      id: "2",
      email: "rajesh.kumar@example.com",
      firstName: "Rajesh",
      lastName: "Kumar",
      role: "student",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150",
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-12-01"),
      enrollmentCount: 2,
      completedCourses: 2,
      averageProgress: 90,
    },
    {
      id: "3",
      email: "meera.nair@example.com",
      firstName: "Meera",
      lastName: "Nair",
      role: "student",
      profileImageUrl: null,
      createdAt: new Date("2024-03-10"),
      updatedAt: new Date("2024-12-01"),
      enrollmentCount: 1,
      completedCourses: 0,
      averageProgress: 45,
    },
    {
      id: "4",
      email: "arjun.patel@example.com",
      firstName: "Arjun",
      lastName: "Patel",
      role: "student",
      profileImageUrl: null,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-12-01"),
      enrollmentCount: 4,
      completedCourses: 3,
      averageProgress: 85,
    },
    {
      id: "5",
      email: "kavya.reddy@example.com",
      firstName: "Kavya",
      lastName: "Reddy",
      role: "student",
      profileImageUrl: null,
      createdAt: new Date("2024-04-12"),
      updatedAt: new Date("2024-12-01"),
      enrollmentCount: 2,
      completedCourses: 0,
      averageProgress: 30,
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || statusFilter === "all" ||
      (statusFilter === "active" && (student.enrollmentCount || 0) > 0) ||
      (statusFilter === "completed" && (student.completedCourses || 0) > 0) ||
      (statusFilter === "new" && (student.enrollmentCount || 0) === 0);
    
    return matchesSearch && matchesStatus;
  });

  const totalStudents = students.length;
  const activeStudents = students.filter(s => (s.enrollmentCount || 0) > 0).length;
  const completedStudents = students.filter(s => (s.completedCourses || 0) > 0).length;
  const avgProgress = Math.round(students.reduce((sum, s) => sum + (s.averageProgress || 0), 0) / students.length);

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout title="Loading..." description="Please wait...">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-6 sm:mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 sm:h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Student Management" 
      description="View and manage student enrollments and progress"
    >

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card data-testid="stat-total-students">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-active-students">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{activeStudents}</p>
                      <p className="text-sm text-muted-foreground">Active Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-completed-students">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Award className="h-8 w-8 text-accent-foreground" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{completedStudents}</p>
                      <p className="text-sm text-muted-foreground">With Completions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-avg-progress">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
                      <p className="text-sm text-muted-foreground">Avg Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-students"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="option-all-statuses">All Students</SelectItem>
                      <SelectItem value="active" data-testid="option-active">Active Students</SelectItem>
                      <SelectItem value="completed" data-testid="option-completed">With Completions</SelectItem>
                      <SelectItem value="new" data-testid="option-new">New Students</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>Showing {filteredStudents.length} of {totalStudents} students</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card data-testid="students-table">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Students ({filteredStudents.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-students">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter ? "No students match your search criteria." : "No students have registered yet."}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Enrollments</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={student.profileImageUrl || ''} alt={student.firstName || ''} />
                                <AvatarFallback data-testid={`student-avatar-${student.id}`}>
                                  {student.firstName?.[0] || student.email?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground" data-testid={`student-name-${student.id}`}>
                                  {student.firstName && student.lastName 
                                    ? `${student.firstName} ${student.lastName}`
                                    : student.email
                                  }
                                </p>
                                <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" data-testid={`student-email-${student.id}`}>
                                {student.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span className="font-medium" data-testid={`student-enrollments-${student.id}`}>
                                {student.enrollmentCount || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-accent-foreground" />
                              <span className="font-medium" data-testid={`student-completed-${student.id}`}>
                                {student.completedCourses || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${student.averageProgress || 0}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium" data-testid={`student-progress-${student.id}`}>
                                {student.averageProgress || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" data-testid={`student-joined-${student.id}`}>
                                {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                (student.enrollmentCount || 0) > 0
                                  ? "bg-accent/20 text-accent-foreground"
                                  : "bg-muted text-muted-foreground"
                              }
                              data-testid={`student-status-${student.id}`}
                            >
                              {(student.enrollmentCount || 0) > 0 ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
    </AdminLayout>
  );
}
