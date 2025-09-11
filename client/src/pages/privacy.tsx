import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="privacy-title">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="privacy-updated">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-foreground">
          <section className="mb-8" data-testid="privacy-overview">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p className="text-muted-foreground mb-4">
              At Vedic Learning Platform, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </p>
          </section>

          <section className="mb-8" data-testid="privacy-collection">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Profile information and learning preferences</li>
              <li>Payment and billing information</li>
              <li>Course enrollment and progress data</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Device information and IP address</li>
              <li>Browser type and operating system</li>
              <li>Usage patterns and session data</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="privacy-usage">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use your information to provide and improve our educational services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Deliver course content and track your progress</li>
              <li>Process payments and manage your account</li>
              <li>Communicate about courses, updates, and support</li>
              <li>Personalize your learning experience</li>
              <li>Analyze platform usage to improve our services</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="privacy-sharing">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share information in limited circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>With course mentors to facilitate your learning</li>
              <li>With payment processors for transaction processing</li>
              <li>With service providers who assist in platform operations</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="privacy-security">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers and regular security audits</li>
              <li>Access controls and employee training</li>
              <li>Regular data backups and monitoring</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="privacy-cookies">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Essential cookies for platform functionality</li>
              <li>Analytics cookies to understand usage patterns</li>
              <li>Preference cookies to remember your settings</li>
              <li>You can control cookie settings in your browser</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="privacy-rights">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access and review your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with data protection authorities</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="privacy-retention">
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. Course progress and certificates are maintained for your lifetime access.
            </p>
          </section>

          <section className="mb-8" data-testid="privacy-children">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our platform is designed for users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8" data-testid="privacy-international">
            <h2 className="text-2xl font-semibold mb-4">10. International Transfers</h2>
            <p className="text-muted-foreground mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data during international transfers.
            </p>
          </section>

          <section className="mb-8" data-testid="privacy-changes">
            <h2 className="text-2xl font-semibold mb-4">11. Policy Updates</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy periodically. We will notify you of significant changes through email or platform notifications. Your continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8" data-testid="privacy-contact">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-1">
              <li>Email: privacy@vediclearning.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: 123 Wisdom Street, Knowledge City, India 560001</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}