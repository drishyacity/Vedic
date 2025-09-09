import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, Loader2 } from "lucide-react";

interface PaymentButtonProps {
  batchId: number;
  amount: number;
  courseName: string;
  className?: string;
  children?: React.ReactNode;
}

export default function PaymentButton({ 
  batchId, 
  amount, 
  courseName, 
  className,
  children 
}: PaymentButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: async ({ batchId, amount }: { batchId: number; amount: number }) => {
      const response = await apiRequest("POST", "/api/orders", { batchId, amount: amount.toString() });
      return await response.json();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, paymentId }: { orderId: number; status: string; paymentId?: string }) => {
      await apiRequest("PUT", `/api/orders/${orderId}/status`, { status, paymentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments/my"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/my"] });
      toast({
        title: "Payment Successful!",
        description: "You have been enrolled in the course. Welcome aboard!",
      });
      setIsProcessing(false);
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Payment verification failed. Please contact support.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const handlePayment = async () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in our database
      const order = await createOrderMutation.mutateAsync({ batchId, amount });

      // For this demo, we'll simulate a successful payment
      // In a real implementation, you would integrate with Razorpay:
      /*
      const options = {
        key: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_key",
        amount: amount * 100, // amount in paise
        currency: "INR",
        name: "Vedic Learning Platform",
        description: `Payment for ${courseName}`,
        order_id: order.razorpayOrderId,
        handler: function (response: any) {
          // Verify payment on backend
          updateOrderMutation.mutate({
            orderId: order.id,
            status: "completed",
            paymentId: response.razorpay_payment_id,
          });
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email,
          email: user?.email,
        },
        theme: {
          color: "#ea580c", // primary color
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      */

      // Simulate successful payment for demo
      setTimeout(() => {
        updateOrderMutation.mutate({
          orderId: order.id,
          status: "completed",
          paymentId: `pay_demo_${Date.now()}`,
        });
      }, 2000);

      toast({
        title: "Processing Payment...",
        description: "Please wait while we process your payment.",
      });

    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      className={className}
      data-testid="button-payment"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          {children || `Pay ₹${amount.toLocaleString()}`}
        </>
      )}
    </Button>
  );
}
