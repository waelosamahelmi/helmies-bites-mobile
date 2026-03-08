import { useState } from 'react';
import { Share2, Copy, Users, Gift, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { FadeIn } from '@/components/ui/page-transition';

export default function ReferralPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  // Generate a referral code from user ID
  const referralCode = user ? `HELMIES-${user.id.slice(0, 6).toUpperCase()}` : 'HELMIES-GUEST';
  const referralLink = `https://helmiesbites.com/ref/${referralCode}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join Helmies Bites!',
          text: `Use my code ${referralCode} to get 10 EUR off your first order on Helmies Bites!`,
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        toast.success('Link copied to clipboard!');
      }
    } catch { /* user cancelled share */ }
  };

  const rewards = [
    { step: 1, title: 'Share your code', desc: 'Send your referral code to friends', done: true },
    { step: 2, title: 'Friend signs up', desc: 'They create an account using your code', done: false },
    { step: 3, title: 'Friend orders', desc: 'They place their first order', done: false },
    { step: 4, title: 'Both earn rewards', desc: 'You both get 10 EUR credit!', done: false },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
      <BackHeader title="Invite Friends" />

      <FadeIn delay={0.1}>
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary to-primary-600 mx-4 mt-4 rounded-2xl p-6 text-center">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3"
          >
            <Gift className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-xl font-black text-white">Give 10 EUR, Get 10 EUR</h1>
          <p className="text-sm text-white/70 mt-1">
            Share your code with friends. When they order, you both earn rewards!
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        {/* Referral code */}
        <div className="bg-white dark:bg-gray-900 mx-4 mt-4 rounded-2xl p-4">
          <p className="text-xs font-semibold text-text-secondary dark:text-gray-400 mb-2">Your referral code</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface-secondary dark:bg-gray-800 rounded-xl px-4 py-3 font-mono text-lg font-black text-text-primary dark:text-white tracking-wider">
              {referralCode}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={copyCode}
              className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              {copied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-primary" />
              )}
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button onClick={shareLink} className="h-11">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="outline" onClick={copyCode} className="h-11">
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        {/* How it works */}
        <div className="bg-white dark:bg-gray-900 mx-4 mt-4 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-text-primary dark:text-white mb-4">How it works</h3>
          <div className="space-y-4">
            {rewards.map((step, i) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.done ? 'bg-success text-white' : 'bg-surface-secondary dark:bg-gray-800 text-text-secondary dark:text-gray-400'
                  }`}>
                    {step.done ? <Check className="w-4 h-4" /> : step.step}
                  </div>
                  {i < rewards.length - 1 && (
                    <div className={`absolute left-1/2 top-8 w-0.5 h-8 -translate-x-1/2 ${
                      step.done ? 'bg-success' : 'bg-border dark:bg-gray-700'
                    }`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary dark:text-white">{step.title}</p>
                  <p className="text-xs text-text-secondary dark:text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.4}>
        {/* Stats */}
        <div className="bg-white dark:bg-gray-900 mx-4 mt-4 mb-8 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-text-primary dark:text-white mb-3">Your referrals</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-primary">0</p>
              <p className="text-[10px] text-text-tertiary dark:text-gray-500">Invited</p>
            </div>
            <div>
              <p className="text-2xl font-black text-success">0</p>
              <p className="text-[10px] text-text-tertiary dark:text-gray-500">Joined</p>
            </div>
            <div>
              <p className="text-2xl font-black text-info">0 EUR</p>
              <p className="text-[10px] text-text-tertiary dark:text-gray-500">Earned</p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
