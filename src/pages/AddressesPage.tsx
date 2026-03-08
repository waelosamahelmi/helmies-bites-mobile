import { useState } from 'react';
import { MapPin, Plus, Navigation, Trash2 } from 'lucide-react';
import { BackHeader } from '@/components/layout/BackHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/contexts/LocationContext';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
}

export default function AddressesPage() {
  const { requestLocation, setManualLocation } = useLocation();
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('helmies_addresses') || '[]');
    } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const saveAddress = () => {
    if (!newLabel || !newAddress) return;
    const addr: SavedAddress = {
      id: Date.now().toString(),
      label: newLabel,
      address: newAddress,
      lat: 60.17,
      lng: 24.94,
    };
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem('helmies_addresses', JSON.stringify(updated));
    setShowAdd(false);
    setNewLabel('');
    setNewAddress('');
  };

  const removeAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('helmies_addresses', JSON.stringify(updated));
  };

  const selectAddress = (addr: SavedAddress) => {
    setManualLocation(addr.lat, addr.lng, '', addr.address);
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <BackHeader title="Addresses" />

      {/* Current location */}
      <div className="bg-white mt-2">
        <button
          onClick={requestLocation}
          className="w-full flex items-center gap-3 px-4 py-4 hover:bg-surface-secondary transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-text-primary">Use current location</p>
            <p className="text-xs text-text-secondary">GPS-based delivery</p>
          </div>
        </button>
      </div>

      {/* Saved addresses */}
      <div className="bg-white mt-2">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold text-text-primary">Saved addresses</h3>
          <button onClick={() => setShowAdd(true)} className="text-primary">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {addresses.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-8">No saved addresses</p>
        ) : (
          addresses.map(addr => (
            <div key={addr.id} className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <button onClick={() => selectAddress(addr)} className="flex items-center gap-3 flex-1 text-left">
                <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{addr.label}</p>
                  <p className="text-xs text-text-secondary">{addr.address}</p>
                </div>
              </button>
              <button onClick={() => removeAddress(addr.id)} className="text-error">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add address modal */}
      {showAdd && (
        <div className="bg-white mt-2 p-4 space-y-3">
          <h3 className="text-sm font-bold text-text-primary">Add new address</h3>
          <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (e.g. Home, Work)" />
          <Input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="Full address" />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
            <Button onClick={saveAddress} className="flex-1">Save</Button>
          </div>
        </div>
      )}
    </div>
  );
}