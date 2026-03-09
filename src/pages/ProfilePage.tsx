import { useState } from 'react';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || '';
  const [fullName, setFullName] = useState(name);
  const [phone, setPhone] = useState(user?.phone || '');

  return (
    <div className="min-h-screen bg-background">
      <BackHeader title="Profile" />

      <div className="glass-card mt-2 p-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
          <span className="text-white font-black text-2xl">{getInitials(name || 'U')}</span>
        </div>
        <p className="text-base font-bold text-white mt-3">{name || 'User'}</p>
        <p className="text-sm text-white/60">{user?.email}</p>
      </div>

      <div className="glass-card mt-2 p-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-white/60 mb-1 block">Full name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
        </div>
        <div>
          <label className="text-xs font-semibold text-white/60 mb-1 block">Phone number</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+358 40 123 4567" type="tel" />
        </div>
        <div>
          <label className="text-xs font-semibold text-white/60 mb-1 block">Email</label>
          <Input value={user?.email || ''} disabled />
        </div>
        <Button className="w-full">Save changes</Button>
      </div>
    </div>
  );
}