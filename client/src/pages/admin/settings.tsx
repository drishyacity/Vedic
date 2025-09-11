import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout";
import { 
  Settings as SettingsIcon, 
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Palette,
  Save,
  RefreshCw,
  Lock,
  Users,
  DollarSign
} from "lucide-react";

export default function AdminSettings() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: "Vedic Learning Platform",
      siteDescription: "Learn ancient Indian wisdom through modern online courses",
      contactEmail: "support@vediclearning.com",
      timezone: "Asia/Kolkata",
      language: "en",
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      enrollmentAlerts: true,
      paymentAlerts: true,
      systemAlerts: true
    },
    security: {
      requireEmailVerification: true,
      allowGuestCheckout: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPasswords: true
    },
    payment: {
      currency: "INR",
      taxRate: 18,
      allowRefunds: true,
      refundPeriod: 7,
      razorpayEnabled: true,
      stripeEnabled: false
    },
    appearance: {
      primaryColor: "#8B5A3C",
      theme: "light",
      logoUrl: "",
      favicon: "",
      customCSS: ""
    }
  });

  const handleSave = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

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
      title="Platform Settings" 
      description="Configure system preferences and platform behavior"
    >
      <Tabs defaultValue="general" className="space-y-6" data-testid="settings-tabs">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">Security</TabsTrigger>
          <TabsTrigger value="payment" data-testid="tab-payment">Payment</TabsTrigger>
          <TabsTrigger value="appearance" data-testid="tab-appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" data-testid="general-settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                    data-testid="input-site-name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactEmail: e.target.value }
                    })}
                    data-testid="input-contact-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea 
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                  data-testid="textarea-site-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => 
                    setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: value }
                    })
                  }>
                    <SelectTrigger data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={settings.general.language} onValueChange={(value) => 
                    setSettings({
                      ...settings,
                      general: { ...settings.general, language: value }
                    })
                  }>
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="sa">Sanskrit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    general: { ...settings.general, maintenanceMode: checked }
                  })}
                  data-testid="switch-maintenance-mode"
                />
                <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
              </div>

              <Button onClick={() => handleSave("General")} data-testid="button-save-general">
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" data-testid="notification-settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Communication Channels</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: checked }
                      })}
                      data-testid="switch-email-notifications"
                    />
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pushNotifications"
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, pushNotifications: checked }
                      })}
                      data-testid="switch-push-notifications"
                    />
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, smsNotifications: checked }
                      })}
                      data-testid="switch-sms-notifications"
                    />
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Alert Types</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enrollmentAlerts"
                      checked={settings.notifications.enrollmentAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, enrollmentAlerts: checked }
                      })}
                      data-testid="switch-enrollment-alerts"
                    />
                    <Label htmlFor="enrollmentAlerts">Enrollment Alerts</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="paymentAlerts"
                      checked={settings.notifications.paymentAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, paymentAlerts: checked }
                      })}
                      data-testid="switch-payment-alerts"
                    />
                    <Label htmlFor="paymentAlerts">Payment Alerts</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="systemAlerts"
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, systemAlerts: checked }
                      })}
                      data-testid="switch-system-alerts"
                    />
                    <Label htmlFor="systemAlerts">System Alerts</Label>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Notification")} data-testid="button-save-notifications">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" data-testid="security-settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Authentication</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireEmailVerification"
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, requireEmailVerification: checked }
                      })}
                      data-testid="switch-email-verification"
                    />
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowGuestCheckout"
                      checked={settings.security.allowGuestCheckout}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, allowGuestCheckout: checked }
                      })}
                      data-testid="switch-guest-checkout"
                    />
                    <Label htmlFor="allowGuestCheckout">Allow Guest Checkout</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireStrongPasswords"
                      checked={settings.security.requireStrongPasswords}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        security: { ...settings.security, requireStrongPasswords: checked }
                      })}
                      data-testid="switch-strong-passwords"
                    />
                    <Label htmlFor="requireStrongPasswords">Require Strong Passwords</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Session & Access Control</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                      })}
                      data-testid="input-session-timeout"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input 
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                      })}
                      data-testid="input-max-login-attempts"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input 
                      id="passwordMinLength"
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
                      })}
                      data-testid="input-password-min-length"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Security")} data-testid="button-save-security">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" data-testid="payment-settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Payment Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Currency & Tax</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={settings.payment.currency} onValueChange={(value) => 
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, currency: value }
                      })
                    }>
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input 
                      id="taxRate"
                      type="number"
                      value={settings.payment.taxRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, taxRate: parseFloat(e.target.value) }
                      })}
                      data-testid="input-tax-rate"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Refund Policy</h4>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowRefunds"
                      checked={settings.payment.allowRefunds}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, allowRefunds: checked }
                      })}
                      data-testid="switch-allow-refunds"
                    />
                    <Label htmlFor="allowRefunds">Allow Refunds</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refundPeriod">Refund Period (days)</Label>
                    <Input 
                      id="refundPeriod"
                      type="number"
                      value={settings.payment.refundPeriod}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, refundPeriod: parseInt(e.target.value) }
                      })}
                      data-testid="input-refund-period"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Payment Gateways</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="razorpayEnabled"
                      checked={settings.payment.razorpayEnabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, razorpayEnabled: checked }
                      })}
                      data-testid="switch-razorpay"
                    />
                    <Label htmlFor="razorpayEnabled">Enable Razorpay</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stripeEnabled"
                      checked={settings.payment.stripeEnabled}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, stripeEnabled: checked }
                      })}
                      data-testid="switch-stripe"
                    />
                    <Label htmlFor="stripeEnabled">Enable Stripe</Label>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Payment")} data-testid="button-save-payment">
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" data-testid="appearance-settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Theme & Colors</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Default Theme</Label>
                    <Select value={settings.appearance.theme} onValueChange={(value) => 
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: value }
                      })
                    }>
                      <SelectTrigger data-testid="select-theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input 
                      id="primaryColor"
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, primaryColor: e.target.value }
                      })}
                      data-testid="input-primary-color"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Branding</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input 
                      id="logoUrl"
                      type="url"
                      value={settings.appearance.logoUrl}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, logoUrl: e.target.value }
                      })}
                      placeholder="https://example.com/logo.png"
                      data-testid="input-logo-url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input 
                      id="favicon"
                      type="url"
                      value={settings.appearance.favicon}
                      onChange={(e) => setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, favicon: e.target.value }
                      })}
                      placeholder="https://example.com/favicon.ico"
                      data-testid="input-favicon"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea 
                  id="customCSS"
                  value={settings.appearance.customCSS}
                  onChange={(e) => setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, customCSS: e.target.value }
                  })}
                  placeholder="/* Add your custom CSS here */"
                  rows={6}
                  data-testid="textarea-custom-css"
                />
              </div>

              <Button onClick={() => handleSave("Appearance")} data-testid="button-save-appearance">
                <Save className="h-4 w-4 mr-2" />
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}