import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" data-testid="link-home">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center" data-testid="logo">
                  <span className="text-primary-foreground text-lg">🕉</span>
                </div>
                <span className="text-xl font-bold text-foreground">Vedic</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" data-testid="link-nav-home">
                <span className="text-foreground hover:text-primary transition-colors">Home</span>
              </Link>
              <Link href="/courses" data-testid="link-nav-courses">
                <span className="text-muted-foreground hover:text-primary transition-colors">Courses</span>
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard" data-testid="link-nav-dashboard">
                  <span className="text-muted-foreground hover:text-primary transition-colors">Dashboard</span>
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={handleLogin} data-testid="button-login">
                  Login
                </Button>
                <Button onClick={handleLogin} data-testid="button-signup">
                  Sign Up
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild data-testid="button-user-menu">
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || ''} alt={user?.firstName || ''} />
                      <AvatarFallback data-testid="avatar-fallback">
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" data-testid="menu-item-dashboard">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" data-testid="menu-item-admin">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" data-testid="mobile-link-home">
              <div className="block px-3 py-2 text-foreground hover:text-primary">Home</div>
            </Link>
            <Link href="/courses" data-testid="mobile-link-courses">
              <div className="block px-3 py-2 text-foreground hover:text-primary">Courses</div>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" data-testid="mobile-link-dashboard">
                  <div className="block px-3 py-2 text-foreground hover:text-primary">Dashboard</div>
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" data-testid="mobile-link-admin">
                    <div className="block px-3 py-2 text-foreground hover:text-primary">Admin Panel</div>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary"
                  data-testid="mobile-button-logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-3 py-2 text-foreground hover:text-primary"
                  data-testid="mobile-button-login"
                >
                  Login
                </button>
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-3 py-2 bg-primary text-primary-foreground rounded-md mx-3"
                  data-testid="mobile-button-signup"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
