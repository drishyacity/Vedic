import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Calendar,
  FileText,
  Bell,
  Settings,
  BarChart3,
  GraduationCap
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and analytics"
  },
  {
    title: "Courses",
    href: "/admin/courses", 
    icon: BookOpen,
    description: "Manage courses and content"
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
    description: "View and manage students"
  },
  {
    title: "Batches",
    href: "/admin/batches",
    icon: GraduationCap,
    description: "Schedule and manage batches"
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
    description: "Payment history and refunds"
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Performance metrics"
  },
  {
    title: "Lectures",
    href: "/admin/lectures",
    icon: Calendar,
    description: "Schedule and manage lectures"
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: FileText,
    description: "Notes and assignments"
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Bell,
    description: "Send updates to students"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Platform configuration"
  }
];

export default function AdminSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 min-h-screen bg-card border-r border-border" data-testid="admin-sidebar">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-lg">🕉</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Vedic Admin</h2>
            <p className="text-sm text-muted-foreground">Management Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`sidebar-link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} 
                  />
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium text-sm",
                      isActive ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {item.title}
                    </p>
                    <p className={cn(
                      "text-xs",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-semibold text-foreground text-sm mb-2">Quick Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Students</span>
              <span className="font-medium text-foreground">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Live Batches</span>
              <span className="font-medium text-foreground">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Revenue</span>
              <span className="font-medium text-foreground">₹4.2L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
