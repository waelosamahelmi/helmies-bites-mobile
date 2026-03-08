import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { DEFAULT_LOCATION } from '@/lib/constants';

interface LocationState {
  latitude: number;
  longitude: number;
  city: string;
  address: string;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  setManualLocation: (lat: number, lng: number, city: string, address: string) => void;
}

const LocationContext = createContext<LocationState | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [latitude, setLatitude] = useState(DEFAULT_LOCATION.lat);
  const [longitude, setLongitude] = useState(DEFAULT_LOCATION.lng);
  const [city, setCity] = useState(DEFAULT_LOCATION.city);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        const result = await Geolocation.requestPermissions();
        if (result.location !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setAddress('Current location');
      setCity('');
    } catch (err: any) {
      // Fallback to browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setAddress('Current location');
          },
          () => {
            setError('Could not get location');
          }
        );
      } else {
        setError('Geolocation not supported');
      }
    } finally {
      setLoading(false);
    }
  };

  const setManualLocation = (lat: number, lng: number, cityName: string, addr: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setCity(cityName);
    setAddress(addr);
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ latitude, longitude, city, address, loading, error, requestLocation, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
}
