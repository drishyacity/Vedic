import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        });
        // Redirect to admin dashboard
        window.location.href = "/admin";
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md" data-testid="admin-login-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-muted-foreground">
            Access the Vedic Learning Admin Panel
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter admin username"
                          className="pl-10"
                          data-testid="input-username"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter admin password"
                          className="pl-10"
                          data-testid="input-password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              For regular access, please{" "}
              <a href="/api/login" className="text-primary hover:underline">
                login with your Replit account
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}