import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Send } from 'lucide-react';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/ui/rating-stars';
import { ConfettiEffect } from '@/components/ui/confetti';
import { useToast } from '@/contexts/ToastContext';
import { useHaptics } from '@/hooks/useHaptics';
import { FadeIn } from '@/components/ui/page-transition';

export default function WriteReviewPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const haptics = useHaptics();

  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async () => {
    if (foodRating === 0) {
      toast.warning('Please rate the food');
      return;
    }

    // Would submit to API in production
    setSubmitted(true);
    setShowConfetti(true);
    haptics.notification('success');
    toast.success('Thank you for your review!');

    setTimeout(() => {
      navigate(-1);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <BackHeader title="Write a Review" />
      <ConfettiEffect active={showConfetti} />

      {submitted ? (
        <FadeIn className="flex flex-col items-center justify-center px-8 pt-20">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <Send className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-xl font-black text-white">Thank You!</h2>
          <p className="text-sm text-white/60 text-center mt-2">
            Your review helps restaurants improve and helps other customers choose.
          </p>
          <p className="text-sm font-semibold text-primary mt-3">+50 loyalty points earned!</p>
        </FadeIn>
      ) : (
        <div className="p-4 space-y-6">
          <FadeIn delay={0.1}>
            {/* Food rating */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">How was the food?</h3>
              <div className="flex justify-center">
                <RatingStars
                  rating={foodRating}
                  size="lg"
                  interactive
                  onChange={(r) => { setFoodRating(r); haptics.selectionChanged(); }}
                />
              </div>
              <p className="text-xs text-white/40 text-center mt-2">
                {foodRating === 0 ? 'Tap to rate' :
                 foodRating <= 2 ? 'We\'re sorry to hear that' :
                 foodRating <= 3 ? 'It was okay' :
                 foodRating <= 4 ? 'Great!' : 'Amazing!'}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Delivery rating */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">How was the delivery?</h3>
              <div className="flex justify-center">
                <RatingStars
                  rating={deliveryRating}
                  size="lg"
                  interactive
                  onChange={(r) => { setDeliveryRating(r); haptics.selectionChanged(); }}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            {/* Comment */}
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-bold text-white mb-3">Tell us more (optional)</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you enjoy? What could be better?"
                className="w-full h-28 rounded-xl bg-background px-4 py-3 text-sm text-white placeholder:text-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <p className="text-xs text-white/40 mt-1 text-right">{comment.length}/500</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <Button onClick={handleSubmit} className="w-full h-14 text-base" size="lg">
              <Send className="w-4 h-4 mr-2" /> Submit Review
            </Button>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
