import { Search, Book, Video, MessageCircle, FileText, Users, Clock, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function HelpCenter() {
  const helpCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of our platform",
      articles: [
        "How to create your first account",
        "Understanding our course structure",
        "Setting up your learning profile",
        "Choosing the right course for you"
      ]
    },
    {
      icon: Video,
      title: "Courses & Learning",
      description: "Everything about our courses",
      articles: [
        "How to enroll in a course",
        "Understanding batch schedules",
        "Accessing course materials",
        "Participating in live sessions"
      ]
    },
    {
      icon: Users,
      title: "Mentors & Community",
      description: "Connect with mentors and students",
      articles: [
        "How to contact your mentor",
        "Joining community discussions",
        "Scheduling one-on-one sessions",
        "Using the batch chat system"
      ]
    },
    {
      icon: Award,
      title: "Certificates & Progress",
      description: "Track your learning journey",
      articles: [
        "Understanding progress tracking",
        "How to earn certificates",
        "Downloading your certificates",
        "Setting learning goals"
      ]
    },
    {
      icon: Clock,
      title: "Technical Support",
      description: "Resolve technical issues",
      articles: [
        "Browser compatibility",
        "Video playback issues",
        "Login and authentication",
        "Mobile app usage"
      ]
    },
    {
      icon: FileText,
      title: "Billing & Payments",
      description: "Payment and refund information",
      articles: [
        "Payment methods accepted",
        "Understanding our pricing",
        "Refund policy and process",
        "Invoice and receipt downloads"
      ]
    }
  ];

  const quickLinks = [
    { title: "FAQ", href: "/faq", description: "Frequently asked questions" },
    { title: "Contact Support", href: "/contact", description: "Get in touch with our team" },
    { title: "Terms of Service", href: "/terms", description: "Platform usage terms" },
    { title: "Privacy Policy", href: "/privacy", description: "How we protect your data" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="help-center-title">
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="help-center-description">
            Find answers, guides, and support for your Vedic learning journey
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for help articles..." 
              className="pl-10 pr-4 py-2 w-full"
              data-testid="input-help-search"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`quick-link-${index}`}>
              <CardContent className="p-6 text-center">
                <a href={link.href} className="block">
                  <h3 className="font-semibold text-foreground mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpCategories.map((category, index) => (
            <Card key={index} className="h-full" data-testid={`help-category-${index}`}>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.articles.map((article, articleIndex) => (
                    <a 
                      key={articleIndex}
                      href="#" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      data-testid={`article-link-${index}-${articleIndex}`}
                    >
                      • {article}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="help-contact-title">
            Still need help?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto" data-testid="help-contact-description">
            Our dedicated support team is available 24/7 to assist you with any questions or concerns about your Vedic learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild data-testid="button-live-chat">
              <a href="/contact">Start Live Chat</a>
            </Button>
            <Button variant="outline" asChild data-testid="button-email-support">
              <a href="mailto:support@vediclearning.com">Email Support</a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}