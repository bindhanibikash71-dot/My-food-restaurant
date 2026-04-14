import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, Home, Tag, Utensils } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      const docRef = doc(db, 'settings', 'logo');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLogoUrl(docSnap.data().url);
      }
    };
    fetchLogo();
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Offers', path: '/offers', icon: Tag },
    { name: 'Dining', path: '/dining', icon: Utensils },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900">
      <header className="p-4 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">B</div>
          )}
          <span className="text-sm text-stone-500">Work</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-stone-900">
            <ShoppingBag size={24} />
          </Link>
        </div>
      </header>

      <main className="flex-grow pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-red-600' : 'text-stone-400'}`}>
              <Icon size={24} />
              <span className="text-[10px] uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
