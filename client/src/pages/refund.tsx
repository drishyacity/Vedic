import Navbar from "@/components/navbar";

export default function Refund() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="refund-title">
            Refund Policy
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="refund-updated">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-foreground">
          <section className="mb-8" data-testid="refund-overview">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p className="text-muted-foreground mb-4">
              We want you to be completely satisfied with your learning experience on our Vedic Learning Platform. This Refund Policy outlines the conditions under which refunds may be requested and processed.
            </p>
          </section>

          <section className="mb-8" data-testid="refund-guarantee">
            <h2 className="text-2xl font-semibold mb-4">2. 7-Day Money-Back Guarantee</h2>
            <p className="text-muted-foreground mb-4">
              We offer a 7-day money-back guarantee for all our courses. If you are not satisfied with your purchase, you may request a full refund within 7 days of enrollment.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Eligibility Criteria:</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Refund request must be made within 7 days of course enrollment</li>
              <li>You have completed less than 20% of the course content</li>
              <li>You have not downloaded course certificates</li>
              <li>No violation of our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-process">
            <h2 className="text-2xl font-semibold mb-4">3. Refund Request Process</h2>
            <p className="text-muted-foreground mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
              <li>Contact our support team via email at refunds@vediclearning.com</li>
              <li>Include your order number and reason for the refund request</li>
              <li>Our team will review your request within 2 business days</li>
              <li>If approved, the refund will be processed within 5-7 business days</li>
              <li>Refunds will be credited to your original payment method</li>
            </ol>
          </section>

          <section className="mb-8" data-testid="refund-exclusions">
            <h2 className="text-2xl font-semibold mb-4">4. Refund Exclusions</h2>
            <p className="text-muted-foreground mb-4">
              The following circumstances are not eligible for refunds:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Requests made after the 7-day guarantee period</li>
              <li>Courses where you have completed more than 20% of the content</li>
              <li>Downloaded certificates or course materials</li>
              <li>Technical issues on your end (device compatibility, internet connectivity)</li>
              <li>Change of mind after the guarantee period</li>
              <li>Violation of our Terms of Service or Code of Conduct</li>
              <li>Promotional or discounted courses (unless specified otherwise)</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-batch-changes">
            <h2 className="text-2xl font-semibold mb-4">5. Batch Changes and Transfers</h2>
            <p className="text-muted-foreground mb-4">
              If you need to change your batch enrollment:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Batch transfers are allowed up to 48 hours before the batch start date</li>
              <li>One free batch transfer is permitted per enrollment</li>
              <li>Additional transfers may incur a nominal processing fee</li>
              <li>Subject to availability in the requested batch</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-partial">
            <h2 className="text-2xl font-semibold mb-4">6. Partial Refunds</h2>
            <p className="text-muted-foreground mb-4">
              In exceptional circumstances, we may offer partial refunds:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Course cancellation by our platform</li>
              <li>Significant changes to course content or schedule</li>
              <li>Technical issues preventing course access for extended periods</li>
              <li>Each case will be reviewed individually</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-processing">
            <h2 className="text-2xl font-semibold mb-4">7. Processing Time and Method</h2>
            <p className="text-muted-foreground mb-4">
              Approved refunds will be processed as follows:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Credit/Debit Cards: 5-7 business days</li>
              <li>UPI/Digital Wallets: 2-3 business days</li>
              <li>Net Banking: 3-5 business days</li>
              <li>Bank transfers may take additional time depending on your bank</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-disputes">
            <h2 className="text-2xl font-semibold mb-4">8. Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              If you disagree with our refund decision:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You may escalate the matter to our senior support team</li>
              <li>Provide additional documentation or reasoning</li>
              <li>We will conduct a thorough review within 5 business days</li>
              <li>Our decision after escalation will be final</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-alternative">
            <h2 className="text-2xl font-semibold mb-4">9. Alternative Solutions</h2>
            <p className="text-muted-foreground mb-4">
              Before requesting a refund, consider these alternatives:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Contact your mentor for additional support</li>
              <li>Access our help center for technical assistance</li>
              <li>Join community discussions for learning support</li>
              <li>Request a batch transfer to better suit your schedule</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-contact">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For refund requests or questions about this policy, contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-1">
              <li>Email: refunds@vediclearning.com</li>
              <li>Support Email: support@vediclearning.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Business Hours: Monday to Friday, 9:00 AM to 6:00 PM IST</li>
            </ul>
          </section>

          <section className="mb-8" data-testid="refund-changes">
            <h2 className="text-2xl font-semibold mb-4">11. Policy Updates</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our platform. Continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}