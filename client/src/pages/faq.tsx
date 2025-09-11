import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/navbar";

export default function FAQ() {
  const faqData = [
    {
      question: "What courses are available on the platform?",
      answer: "We offer comprehensive courses in Vedic studies including Sanskrit language, Vedic philosophy, ancient mathematics, yoga, meditation, and spiritual texts like Bhagavad Gita and Upanishads. Each course is designed by expert scholars and practitioners."
    },
    {
      question: "How do I enroll in a course?",
      answer: "Simply browse our course catalog, select the course you're interested in, choose a batch that fits your schedule, and complete the payment process. You'll receive immediate access to course materials and batch information."
    },
    {
      question: "What is the batch system?",
      answer: "Our batch system groups students for live sessions with mentors. Each batch has a specific start date, schedule, and limited seats to ensure personalized attention. You can join live discussions, Q&A sessions, and group activities."
    },
    {
      question: "Are the courses suitable for beginners?",
      answer: "Yes! We offer courses for all levels - from complete beginners to advanced practitioners. Each course clearly indicates its difficulty level and prerequisites. Our Sanskrit courses, for example, start from the very basics of the script."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our integrated payment gateway."
    },
    {
      question: "Can I access course materials after completion?",
      answer: "Yes, once you complete a course, you retain lifetime access to all course materials, recordings, and resources. You can revisit any content anytime through your dashboard."
    },
    {
      question: "Do you provide certificates?",
      answer: "Yes, we provide certificates of completion for all courses. These certificates are digitally signed and can be downloaded from your dashboard upon successful completion of course requirements."
    },
    {
      question: "What if I miss a live session?",
      answer: "Don't worry! All live sessions are recorded and made available to batch members within 24 hours. You can catch up on missed content and participate in discussions through our platform."
    },
    {
      question: "How can I contact my mentor?",
      answer: "You can reach your mentors through the batch chat system, schedule one-on-one sessions, or ask questions during live sessions. Each batch has dedicated discussion forums for ongoing communication."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, our platform is optimized for web browsers on both desktop and mobile devices. We're working on dedicated mobile apps which will be available soon. The web platform provides a seamless mobile experience."
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 7-day money-back guarantee for all courses. If you're not satisfied within the first week of enrollment, you can request a full refund. Please check our refund policy page for detailed terms."
    },
    {
      question: "How do I track my learning progress?",
      answer: "Your dashboard provides detailed progress tracking including completed lessons, assignments, quiz scores, and overall course completion percentage. You can also see your learning streaks and achievements."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="faq-title">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="faq-description">
            Find answers to common questions about our Vedic learning platform, courses, and services.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent data-testid={`faq-answer-${index}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-muted/30 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="faq-contact-title">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6" data-testid="faq-contact-description">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            data-testid="button-contact-support"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}