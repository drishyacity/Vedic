import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Megaphone, 
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  Clock,
  AlertCircle,
  Info,
  CheckCircle
} from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetAudience: 'all' | 'students' | 'mentors' | 'specific';
  courseId?: number;
  courseName?: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export default function AdminAnnouncements() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewDialog, setShowNewDialog] = useState(false);

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

  // Mock announcements data
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "Platform Maintenance Notice",
      content: "Our platform will undergo scheduled maintenance on Sunday, December 15th from 2:00 AM to 6:00 AM IST. Some features may be temporarily unavailable during this time.",
      type: "warning",
      targetAudience: "all",
      isActive: true,
      createdAt: new Date("2024-11-25"),
      expiresAt: new Date("2024-12-16")
    },
    {
      id: 2,
      title: "New Sanskrit Course Available",
      content: "We're excited to announce the launch of our Advanced Sanskrit Grammar course. Early bird pricing available until December 31st!",
      type: "success",
      targetAudience: "students",
      isActive: true,
      createdAt: new Date("2024-11-24")
    },
    {
      id: 3,
      title: "Holiday Schedule Update",
      content: "Please note our modified schedule during the holiday season. Live sessions will be adjusted from December 20th to January 5th.",
      type: "info",
      targetAudience: "all",
      isActive: true,
      createdAt: new Date("2024-11-20"),
      expiresAt: new Date("2025-01-06")
    },
    {
      id: 4,
      title: "Urgent: Payment Gateway Issue",
      content: "We're experiencing technical difficulties with our payment system. Please contact support if you encounter any issues with enrollment.",
      type: "urgent",
      targetAudience: "all",
      isActive: false,
      createdAt: new Date("2024-11-15")
    },
    {
      id: 5,
      title: "Meditation Workshop Series",
      content: "Join our special meditation workshop series starting next week. Registration is now open for all enrolled students.",
      type: "info",
      targetAudience: "students",
      courseId: 3,
      courseName: "Yoga & Meditation",
      isActive: true,
      createdAt: new Date("2024-11-18")
    }
  ];

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || announcement.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && announcement.isActive) ||
      (statusFilter === "inactive" && !announcement.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.info}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const totalAnnouncements = announcements.length;
  const activeAnnouncements = announcements.filter(a => a.isActive).length;
  const urgentAnnouncements = announcements.filter(a => a.type === 'urgent' && a.isActive).length;
  const scheduledAnnouncements = announcements.filter(a => a.expiresAt && a.expiresAt > new Date()).length;

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
      title="Announcements Management" 
      description="Create and manage platform announcements"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card data-testid="stat-total-announcements">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Megaphone className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalAnnouncements}</p>
                <p className="text-sm text-muted-foreground">Total Announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-active-announcements">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{activeAnnouncements}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-urgent-announcements">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{urgentAnnouncements}</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-scheduled-announcements">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{scheduledAnnouncements}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
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
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-announcements"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger data-testid="select-type-filter">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-new-announcement" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Announcement</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Create a new announcement to share with your users.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right">Title</label>
                    <Input id="title" className="col-span-3" placeholder="Announcement title" />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label htmlFor="content" className="text-right pt-2">Content</label>
                    <Textarea id="content" className="col-span-3" placeholder="Announcement content" rows={4} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right">Type</label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select announcement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="audience" className="text-right">Audience</label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="students">Students Only</SelectItem>
                        <SelectItem value="mentors">Mentors Only</SelectItem>
                        <SelectItem value="specific">Specific Course</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" data-testid="button-create-announcement">Create Announcement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-4">
            <Megaphone className="h-4 w-4" />
            <span>Showing {filteredAnnouncements.length} of {totalAnnouncements} announcements</span>
          </div>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4" data-testid="announcements-list">
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center" data-testid="no-announcements">
                <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No announcements found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                    ? "No announcements match your search criteria." 
                    : "No announcements have been created yet."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} data-testid={`announcement-${announcement.id}`} 
                  className={announcement.type === 'urgent' ? 'border-red-200 dark:border-red-800' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(announcement.type)}
                    <div>
                      <CardTitle className="text-lg" data-testid={`announcement-title-${announcement.id}`}>
                        {announcement.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        {getTypeBadge(announcement.type)}
                        <Badge variant={announcement.isActive ? "default" : "secondary"}>
                          {announcement.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{announcement.targetAudience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" data-testid={`button-edit-${announcement.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" data-testid={`button-delete-${announcement.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4" data-testid={`announcement-content-${announcement.id}`}>
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {announcement.createdAt.toLocaleDateString()}</span>
                    </div>
                    {announcement.expiresAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Expires: {announcement.expiresAt.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {announcement.courseName && (
                    <div className="text-sm">
                      <Badge variant="outline">{announcement.courseName}</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}