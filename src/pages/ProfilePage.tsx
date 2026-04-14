import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { MapPin, Phone, Save } from 'lucide-react';

export default function ProfilePage() {
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPhone(data.phoneNumber || '');
        setLocation(data.location || null);
      }
    };
    fetchProfile();
  }, []);

  const handleGetLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      phoneNumber: phone,
      location: location
    }, { merge: true });
    alert('Profile updated!');
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="space-y-4">
        <div className="flex items-center gap-2 border p-3 rounded-lg">
          <Phone className="text-red-600" />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            className="flex-grow outline-none" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2 border p-3 rounded-lg">
          <MapPin className="text-red-600" />
          <span className="flex-grow text-stone-600">
            {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Location not set'}
          </span>
          <button onClick={handleGetLocation} className="text-red-600 text-sm font-semibold">
            {loading ? 'Getting...' : 'Get GPS'}
          </button>
        </div>
        <button onClick={handleSave} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save size={20} /> Save Profile
        </button>
      </div>
    </div>
  );
}
