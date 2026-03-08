import { useState, useEffect } from 'react';
import { Award, Gift, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfettiEffect } from '@/components/ui/confetti';
import { ProgressRing } from '@/components/ui/progress-ring';
import { PageTransition, FadeIn } from '@/components/ui/page-transition';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useHaptics } from '@/hooks/useHaptics';
import { getLoyaltyRewards, getLoyaltyPoints, getLoyaltyTransactions, redeemReward } from '@/lib/api';
import type { LoyaltyReward, LoyaltyTransaction } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

// Tier levels
const tiers = [
  { name: 'Bronze', minPoints: 0, color: '#CD7F32', emoji: '🥉' },
  { name: 'Silver', minPoints: 500, color: '#C0C0C0', emoji: '🥈' },
  { name: 'Gold', minPoints: 1500, color: '#FFD700', emoji: '🥇' },
  { name: 'Platinum', minPoints: 5000, color: '#E5E4E2', emoji: '💎' },
];

function getCurrentTier(points: number) {
  return [...tiers].reverse().find(t => points >= t.minPoints) || tiers[0];
}

function getNextTier(points: number) {
  return tiers.find(t => points < t.minPoints);
}

export default function LoyaltyPage() {
  const { user } = useAuth();
  const toast = useToast();
  const haptics = useHaptics();
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const [pts, rwds, txns] = await Promise.all([
          getLoyaltyPoints(user!.id),
          getLoyaltyRewards(''),
          getLoyaltyTransactions(user!.id, ''),
        ]);
        setPoints(pts);
        setRewards(rwds);
        setTransactions(txns);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (points < reward.points_required) return;
    try {
      await redeemReward(user!.id, reward.id);
      setPoints(p => p - reward.points_required);
      setShowConfetti(true);
      haptics.notification('success');
      toast.success(`Redeemed: ${reward.name_en || reward.name}!`);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to redeem reward');
    }
  };

  const currentTier = getCurrentTier(points);
  const nextTier = getNextTier(points);
  const tierProgress = nextTier
    ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface-secondary dark:bg-gray-950">
        <BackHeader title="Loyalty Rewards" />
        <ConfettiEffect active={showConfetti} />

        {/* Points banner with tier */}
        <FadeIn>
          <div className="bg-gradient-to-br from-primary to-primary-600 mx-4 mt-4 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="flex items-center gap-4">
              <ProgressRing progress={tierProgress} size={72} strokeWidth={4} color="rgba(255,255,255,0.7)">
                <div className="text-center">
                  <span className="text-2xl">{currentTier.emoji}</span>
                </div>
              </ProgressRing>
              <div>
                <p className="text-sm text-white/70 font-medium">{currentTier.name} member</p>
                <motion.p
                  key={points}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-black"
                >
                  {points}
                </motion.p>
                <p className="text-xs text-white/50">points</p>
              </div>
            </div>
            {nextTier && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tierProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <span className="text-[10px] text-white/60">
                  {nextTier.minPoints - points} to {nextTier.name} {nextTier.emoji}
                </span>
              </div>
            )}
            <p className="text-[10px] text-white/40 mt-2">Earn 10 points per euro spent</p>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.1}>
          <div className="flex bg-white dark:bg-gray-900 mt-4 border-b border-border dark:border-gray-800">
            {(['rewards', 'history'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 capitalize transition-colors ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </FadeIn>

        {activeTab === 'rewards' ? (
          <div className="p-4 space-y-3 pb-20">
            {rewards.length === 0 ? (
              <EmptyState icon={<Gift className="w-10 h-10" />} title="No rewards available" description="Check back later for rewards" />
            ) : (
              rewards.map((reward, i) => {
                const canRedeem = points >= reward.points_required;
                return (
                  <FadeIn key={reward.id} delay={i * 0.05}>
                    <motion.div
                      whileTap={canRedeem ? { scale: 0.98 } : {}}
                      className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center gap-3 shadow-card"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-text-primary dark:text-white">{reward.name_en || reward.name}</h3>
                        <p className="text-xs text-text-secondary dark:text-gray-400">
                          {reward.discount_type === 'percentage' ? `${reward.discount_value}% off` : `${formatPrice(reward.discount_value)} off`}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <p className="text-xs font-semibold text-primary">{reward.points_required} points</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                      >
                        Redeem
                      </Button>
                    </motion.div>
                  </FadeIn>
                );
              })
            )}
          </div>
        ) : (
          <div className="p-4 space-y-2 pb-20">
            {transactions.length === 0 ? (
              <EmptyState icon={<Award className="w-10 h-10" />} title="No transactions" description="Your loyalty history will appear here" />
            ) : (
              transactions.map((tx, i) => (
                <FadeIn key={tx.id} delay={i * 0.03}>
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'earned' ? 'bg-success/10' : 'bg-error/10'
                    }`}>
                      {tx.type === 'earned' ? (
                        <ArrowUpRight className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-error" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary dark:text-white">{tx.description}</p>
                      <p className="text-xs text-text-tertiary dark:text-gray-500">{format(new Date(tx.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-success' : 'text-error'}`}>
                      {tx.type === 'earned' ? '+' : ''}{tx.points}
                    </span>
                  </div>
                </FadeIn>
              ))
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
