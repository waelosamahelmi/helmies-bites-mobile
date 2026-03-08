import { useState, useEffect } from 'react';
import { Award, Gift, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/contexts/AuthContext';
import { getLoyaltyRewards, getLoyaltyPoints, getLoyaltyTransactions, redeemReward } from '@/lib/api';
import type { LoyaltyReward, LoyaltyTransaction } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

export default function LoyaltyPage() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <BackHeader title="Loyalty Rewards" />

      {/* Points banner */}
      <div className="bg-gradient-to-br from-primary to-primary-600 mx-4 mt-4 rounded-2xl p-5 text-white">
        <p className="text-sm text-white/80 font-medium">Your points</p>
        <p className="text-4xl font-black mt-1">{points}</p>
        <p className="text-xs text-white/60 mt-1">Earn 10 points per euro spent</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white mt-4 border-b border-border">
        {(['rewards', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 capitalize transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'rewards' ? (
        <div className="p-4 space-y-3 pb-20">
          {rewards.length === 0 ? (
            <EmptyState icon={<Gift className="w-10 h-10" />} title="No rewards available" description="Check back later for rewards" />
          ) : (
            rewards.map(reward => (
              <div key={reward.id} className="bg-white rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text-primary">{reward.name_en || reward.name}</h3>
                  <p className="text-xs text-text-secondary">
                    {reward.discount_type === 'percentage' ? `${reward.discount_value}% off` : `${formatPrice(reward.discount_value)} off`}
                  </p>
                  <p className="text-xs font-semibold text-primary mt-0.5">{reward.points_required} points</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleRedeem(reward)}
                  disabled={points < reward.points_required}
                >
                  Redeem
                </Button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="p-4 space-y-2 pb-20">
          {transactions.length === 0 ? (
            <EmptyState icon={<Award className="w-10 h-10" />} title="No transactions" description="Your loyalty history will appear here" />
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="bg-white rounded-xl p-3 flex items-center gap-3">
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
                  <p className="text-sm font-semibold text-text-primary">{tx.description}</p>
                  <p className="text-xs text-text-tertiary">{format(new Date(tx.created_at), 'MMM d, yyyy')}</p>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'earned' ? 'text-success' : 'text-error'}`}>
                  {tx.type === 'earned' ? '+' : ''}{tx.points}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}