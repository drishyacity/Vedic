import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="terms-title">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="terms-updated">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-foreground">
          <section className="mb-8" data-testid="terms-acceptance">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using the Vedic Learning Platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8" data-testid="terms-platform-usage">
            <h2 className="text-2xl font-semibold mb-4">2. Platform Usage</h2>
            <p className="text-muted-foreground mb-4">
              Our platform provides online courses related to Vedic studies, Sanskrit, ancient Indian philosophy, mathematics, and wellness. You may use our services for personal, non-commercial educational purposes only.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You must be at least 13 years old to use our services</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to provide accurate and complete information</li>
              <li>You will not share your account credentials with others</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="terms-course-access">
            <h2 className="text-2xl font-semibold mb-4">3. Course Access and Content</h2>
            <p className="text-muted-foreground mb-4">
              Upon successful payment, you will receive access to the purchased course materials. Course access is granted for the duration specified in the course description.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Course content is for your personal use only</li>
              <li>You may not record, distribute, or share course materials</li>
              <li>Course content may be updated without prior notice</li>
              <li>We reserve the right to modify or discontinue courses</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="terms-payment">
            <h2 className="text-2xl font-semibold mb-4">4. Payment and Billing</h2>
            <p className="text-muted-foreground mb-4">
              All course fees must be paid in advance. We accept various payment methods as displayed during checkout.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Prices are subject to change without notice</li>
              <li>All payments are processed securely through our payment partners</li>
              <li>Refunds are subject to our refund policy</li>
              <li>Failed payments may result in loss of access</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="terms-conduct">
            <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              You agree to use our platform respectfully and in accordance with all applicable laws.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>No harassment, discrimination, or offensive behavior</li>
              <li>Respect the cultural and spiritual nature of the content</li>
              <li>No spamming or commercial solicitation</li>
              <li>Report any inappropriate behavior to our support team</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="terms-intellectual-property">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All course content, including videos, texts, images, and materials, are protected by copyright and other intellectual property laws.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>We own or have licensed all content on our platform</li>
              <li>You may not copy, distribute, or create derivative works</li>
              <li>Course certificates are for personal use only</li>
              <li>Violation may result in legal action</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="terms-liability">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              We provide our services "as is" without warranty of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages.
            </p>
          </section>

          <section className="mb-8" data-testid="terms-termination">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms of Service.
            </p>
          </section>

          <section className="mb-8" data-testid="terms-changes">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of any modifications.
            </p>
          </section>

          <section className="mb-8" data-testid="terms-contact">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-none text-muted-foreground space-y-1">
              <li>Email: legal@vediclearning.com</li>
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