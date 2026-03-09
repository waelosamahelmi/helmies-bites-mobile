import { useState } from 'react';
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/page-transition';

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Go to Orders tab and tap on your active order. You can see real-time updates on the preparation and delivery status.',
  },
  {
    q: 'How can I cancel my order?',
    a: 'You can cancel your order within 2 minutes of placing it. Go to Orders > tap your order > Cancel Order. After 2 minutes, please contact support.',
  },
  {
    q: 'How does the loyalty program work?',
    a: 'You earn 10 points for every 1 EUR spent. Collect points and redeem them for discounts, free items, and exclusive perks in the Loyalty section.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept credit/debit cards (Visa, Mastercard) via Stripe, and cash on delivery. Online payment is processed securely.',
  },
  {
    q: 'How do I use a promo code?',
    a: 'At checkout, tap "Add promo code" and enter your code. The discount will be applied to your order automatically.',
  },
  {
    q: 'Can I change my delivery address?',
    a: 'You can change your delivery address before placing the order. After the order is confirmed, contact support for address changes.',
  },
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <BackHeader title="Help & Support" />

      <FadeIn delay={0.1}>
        {/* Contact options */}
        <div className="glass-card mt-2 p-4">
          <h3 className="text-sm font-bold text-white mb-3">Contact Us</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-3 rounded-xl bg-background">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-white">Chat</span>
            </button>
            <a href="tel:+358401234567" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-background">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs font-semibold text-white">Call</span>
            </a>
            <a href="mailto:support@helmiesbites.com" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-background">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs font-semibold text-white">Email</span>
            </a>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        {/* FAQs */}
        <div className="mt-2">
          <div className="glass-card px-4 pt-4 pb-1">
            <h3 className="text-sm font-bold text-white">Frequently Asked Questions</h3>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card border-b border-white/10 last:border-none">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <span className="text-sm font-semibold text-white flex-1 pr-4">{faq.q}</span>
                {expandedFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-white/60 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </FadeIn>

      <div className="h-20" />
    </div>
  );
}
