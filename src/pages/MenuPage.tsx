import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Star, Zap } from 'lucide-react';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
}

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDishes = async () => {
      const querySnapshot = await getDocs(collection(db, 'menu'));
      const dishesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dish));
      setDishes(dishesData);
    };
    fetchDishes();
  }, []);

  const categories = [
    { name: 'Biryani', img: 'https://picsum.photos/seed/biryani/100/100' },
    { name: 'Tiffin', img: 'https://picsum.photos/seed/tiffin/100/100' },
    { name: 'Idli', img: 'https://picsum.photos/seed/idli/100/100' },
    { name: 'Veg', img: 'https://picsum.photos/seed/veg/100/100' },
    { name: 'Drinks', img: 'https://picsum.photos/seed/drinks/100/100' },
  ];

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input 
          type="text" 
          placeholder="Search for dishes..." 
          className="w-full bg-stone-100 text-stone-900 pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-6 mb-6">
        {categories.map(cat => (
          <div key={cat.name} className="flex flex-col items-center gap-2 min-w-[80px]">
            <img src={cat.img} alt={cat.name} className="w-16 h-16 rounded-full object-cover border-2 border-stone-200" />
            <span className="text-xs text-stone-600">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Recommended */}
      <h2 className="text-lg font-semibold text-stone-900 mb-4">Recommended for you</h2>
      <div className="grid grid-cols-1 gap-4">
        {dishes.map(dish => (
          <div key={dish.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 flex gap-4 shadow-sm">
            <img src={dish.imageUrl} alt={dish.name} className="w-32 h-32 object-cover" referrerPolicy="no-referrer" />
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-stone-900">{dish.name}</h3>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium mb-1">
                <Star size={14} fill="currentColor" />
                {dish.rating}
              </div>
              <p className="text-stone-500 text-xs mb-2">{dish.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-900">${dish.price.toFixed(2)}</span>
                <button className="text-red-600 border border-red-600 px-3 py-1 rounded-lg text-xs font-semibold">ADD</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
