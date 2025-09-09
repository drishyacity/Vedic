import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { isUnauthorizedError } from "@/lib/authUtils";
import AdminSidebar from "@/components/admin/sidebar";
import { 
  DollarSign, 
  Search,
  Filter,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { useEffect } from "react";
import type { Order } from "@shared/schema";

interface OrderWithDetails extends Order {
  userEmail?: string;
  courseName?: string;
  batchTitle?: string;
}

export default function AdminPayments() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

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
  const orders: OrderWithDetails[] = [
    {
      id: 1,
      userId: "1",
      batchId: 1,
      amount: "2999.00",
      status: "completed",
      razorpayOrderId: "order_123456789",
      razorpayPaymentId: "pay_123456789",
      createdAt: new Date("2024-11-25"),
      userEmail: "priya.sharma@example.com",
      courseName: "Complete Sanskrit Mastery",
      batchTitle: "Sanskrit Mastery - Batch A2",
    },
    {
      id: 2,
      userId: "2",
      batchId: 2,
      amount: "3999.00",
      status: "completed",
      razorpayOrderId: "order_123456790",
      razorpayPaymentId: "pay_123456790",
      createdAt: new Date("2024-11-24"),
      userEmail: "rajesh.kumar@example.com",
      courseName: "Bhagavad Gita Deep Dive",
      batchTitle: "Gita Philosophy - Batch B1",
    },
    {
      id: 3,
      userId: "3",
      batchId: 3,
      amount: "1999.00",
      status: "pending",
      razorpayOrderId: "order_123456791",
      razorpayPaymentId: null,
      createdAt: new Date("2024-11-23"),
      userEmail: "meera.nair@example.com",
      courseName: "Classical Yoga & Meditation",
      batchTitle: "Yoga & Meditation - Batch C1",
    },
    {
      id: 4,
      userId: "4",
      batchId: 1,
      amount: "2999.00",
      status: "failed",
      razorpayOrderId: "order_123456792",
      razorpayPaymentId: null,
      createdAt: new Date("2024-11-22"),
      userEmail: "arjun.patel@example.com",
      courseName: "Complete Sanskrit Mastery",
      batchTitle: "Sanskrit Mastery - Batch A2",
    },
    {
      id: 5,
      userId: "1",
      batchId: 4,
      amount: "4999.00",
      status: "completed",
      razorpayOrderId: "order_123456793",
      razorpayPaymentId: "pay_123456793",
      createdAt: new Date("2024-11-21"),
      userEmail: "priya.sharma@example.com",
      courseName: "Vedic Studies Foundation",
      batchTitle: "Vedic Studies - Batch D1",
    },
    {
      id: 6,
      userId: "5",
      batchId: 5,
      amount: "2499.00",
      status: "refunded",
      razorpayOrderId: "order_123456794",
      razorpayPaymentId: "pay_123456794",
      createdAt: new Date("2024-11-20"),
      userEmail: "kavya.reddy@example.com",
      courseName: "Ancient Indian Mathematics",
      batchTitle: "Mathematics - Batch E1",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.razorpayOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + parseFloat(o.amount), 0);
  
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const failedOrders = orders.filter(o => o.status === 'failed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Refunded</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Unknown</Badge>;
    }
  };

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          <div className="w-64 bg-muted animate-pulse" />
          <div className="flex-1 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-muted rounded" />
                ))}
              </div>
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8" data-testid="payments-header">
              <h1 className="text-3xl font-bold text-foreground mb-2">Payment Management</h1>
              <p className="text-muted-foreground">
                Monitor transactions and payment status
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card data-testid="stat-total-revenue">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-completed-orders">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{completedOrders}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-pending-orders">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="stat-failed-orders">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{failedOrders}</p>
                      <p className="text-sm text-muted-foreground">Failed</p>
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
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-orders"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="" data-testid="option-all-statuses">All Statuses</SelectItem>
                      <SelectItem value="completed" data-testid="option-completed">Completed</SelectItem>
                      <SelectItem value="pending" data-testid="option-pending">Pending</SelectItem>
                      <SelectItem value="failed" data-testid="option-failed">Failed</SelectItem>
                      <SelectItem value="refunded" data-testid="option-refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card data-testid="orders-table">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Orders ({filteredOrders.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-orders">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter ? "No orders match your search criteria." : "No orders have been placed yet."}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} data-testid={`order-row-${order.id}`}>
                          <TableCell>
                            <div className="font-mono text-sm" data-testid={`order-id-${order.id}`}>
                              #{order.id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div data-testid={`order-student-${order.id}`}>
                              <p className="font-medium text-foreground">{order.userEmail}</p>
                              <p className="text-sm text-muted-foreground">User ID: {order.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div data-testid={`order-course-${order.id}`}>
                              <p className="font-medium text-foreground">{order.courseName}</p>
                              <p className="text-sm text-muted-foreground">{order.batchTitle}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-foreground" data-testid={`order-amount-${order.id}`}>
                              ₹{parseFloat(order.amount).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2" data-testid={`order-status-${order.id}`}>
                              {getStatusIcon(order.status)}
                              {getStatusBadge(order.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm text-muted-foreground" data-testid={`order-payment-id-${order.id}`}>
                              {order.razorpayPaymentId || 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm" data-testid={`order-date-${order.id}`}>
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
