import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-lg">🕉</span>
              </div>
              <span className="text-xl font-bold">Vedic</span>
            </div>
            <p className="text-gray-300">
              Learn ancient Indian wisdom through modern, interactive online courses with expert mentors and authentic teachings.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Courses</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/courses" className="hover:text-white transition-colors">Sanskrit Language</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Bhagavad Gita</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Vedic Studies</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Ancient Mathematics</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">Yoga & Meditation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/help-center" className="hover:text-white transition-colors" data-testid="footer-help-center">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors" data-testid="footer-contact">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors" data-testid="footer-faq">FAQ</Link></li>
              <li><Link href="/admin-login" className="hover:text-white transition-colors" data-testid="footer-student-portal">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors" data-testid="footer-privacy">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors" data-testid="footer-terms">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors" data-testid="footer-refund">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vedic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}