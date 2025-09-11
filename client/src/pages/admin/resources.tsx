import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import AdminLayout from "@/components/admin/layout";
import { 
  FileText, 
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Video,
  Image,
  File,
  Calendar
} from "lucide-react";

interface Resource {
  id: number;
  title: string;
  type: 'pdf' | 'video' | 'image' | 'document';
  courseId?: number;
  courseName?: string;
  size: string;
  downloads: number;
  uploadedAt: Date;
  status: 'active' | 'archived';
}

export default function AdminResources() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Mock resources data
  const resources: Resource[] = [
    {
      id: 1,
      title: "Sanskrit Grammar Basics - Chapter 1",
      type: "pdf",
      courseId: 1,
      courseName: "Sanskrit Fundamentals",
      size: "2.4 MB",
      downloads: 234,
      uploadedAt: new Date("2024-11-20"),
      status: "active"
    },
    {
      id: 2,
      title: "Meditation Techniques Video Guide",
      type: "video",
      courseId: 2,
      courseName: "Yoga & Meditation",
      size: "125 MB",
      downloads: 156,
      uploadedAt: new Date("2024-11-18"),
      status: "active"
    },
    {
      id: 3,
      title: "Vedic Mathematics Formulae",
      type: "pdf",
      courseId: 3,
      courseName: "Ancient Mathematics",
      size: "1.8 MB",
      downloads: 89,
      uploadedAt: new Date("2024-11-15"),
      status: "active"
    },
    {
      id: 4,
      title: "Sanskrit Pronunciation Guide",
      type: "video",
      courseId: 1,
      courseName: "Sanskrit Fundamentals",
      size: "45 MB",
      downloads: 178,
      uploadedAt: new Date("2024-11-12"),
      status: "active"
    },
    {
      id: 5,
      title: "Ancient Texts Reference Sheet",
      type: "image",
      courseId: 4,
      courseName: "Vedic Literature",
      size: "3.2 MB",
      downloads: 67,
      uploadedAt: new Date("2024-11-10"),
      status: "archived"
    }
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.courseName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || resource.type === typeFilter;
    const matchesStatus = statusFilter === "all" || resource.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <Image className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      pdf: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      video: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      image: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      document: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.document}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const totalResources = resources.length;
  const activeResources = resources.filter(r => r.status === 'active').length;
  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);
  const totalSize = resources.reduce((sum, r) => {
    const size = parseFloat(r.size);
    const unit = r.size.includes('MB') ? 1 : 0.001;
    return sum + (size * unit);
  }, 0);

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
      title="Resource Management" 
      description="Manage course materials and downloadable content"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card data-testid="stat-total-resources">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalResources}</p>
                <p className="text-sm text-muted-foreground">Total Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-active-resources">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{activeResources}</p>
                <p className="text-sm text-muted-foreground">Active Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-total-downloads">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Download className="h-8 w-8 text-accent-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalDownloads}</p>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-storage-used">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSize.toFixed(1)} MB</p>
                <p className="text-sm text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-resources"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger data-testid="select-type-filter">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button data-testid="button-add-resource" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Resource</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-4">
            <Filter className="h-4 w-4" />
            <span>Showing {filteredResources.length} of {totalResources} resources</span>
          </div>
        </CardContent>
      </Card>

      {/* Resources Table */}
      <Card data-testid="resources-table">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Resources ({filteredResources.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="text-center py-8" data-testid="no-resources">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                  ? "No resources match your search criteria." 
                  : "No resources have been uploaded yet."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id} data-testid={`resource-row-${resource.id}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(resource.type)}
                        <div>
                          <p className="font-medium text-foreground" data-testid={`resource-title-${resource.id}`}>
                            {resource.title}
                          </p>
                          <p className="text-sm text-muted-foreground">ID: {resource.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell data-testid={`resource-type-${resource.id}`}>
                      {getTypeBadge(resource.type)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground" data-testid={`resource-course-${resource.id}`}>
                        {resource.courseName}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium" data-testid={`resource-size-${resource.id}`}>
                        {resource.size}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium" data-testid={`resource-downloads-${resource.id}`}>
                          {resource.downloads}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm" data-testid={`resource-date-${resource.id}`}>
                          {resource.uploadedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          resource.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }
                        data-testid={`resource-status-${resource.id}`}
                      >
                        {resource.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" data-testid={`button-view-${resource.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-edit-${resource.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-delete-${resource.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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