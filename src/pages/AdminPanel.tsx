import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon } from 'lucide-react';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export default function AdminPanel() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [newDish, setNewDish] = useState<Partial<Dish>>({});
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetchDishes();
    fetchLogo();
  }, []);

  const fetchDishes = async () => {
    const querySnapshot = await getDocs(collection(db, 'menu'));
    setDishes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dish)));
  };

  const fetchLogo = async () => {
    const docRef = doc(db, 'settings', 'logo');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setLogoUrl(docSnap.data().url);
    }
  };

  const handleAddDish = async () => {
    if (!newDish.name || !newDish.price) return;
    await addDoc(collection(db, 'menu'), { ...newDish, imageUrl: `https://picsum.photos/seed/${newDish.name}/400/300`, available: true, totalOrders: 0 });
    setNewDish({});
    fetchDishes();
  };

  const handleUpdateDish = async (id: string, data: Partial<Dish>) => {
    await updateDoc(doc(db, 'menu', id), data);
    setEditingDish(null);
    fetchDishes();
  };

  const handleDeleteDish = async (id: string) => {
    await deleteDoc(doc(db, 'menu', id));
    fetchDishes();
  };

  const handleUpdateLogo = async () => {
    await setDoc(doc(db, 'settings', 'logo'), { url: logoUrl });
    alert('Logo updated!');
  };

  return (
    <div className="p-6 text-stone-900">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Logo Settings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><ImageIcon /> Logo Settings</h2>
        <div className="flex gap-4">
          <input placeholder="Logo URL" className="bg-stone-100 p-2 rounded flex-grow" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
          <button onClick={handleUpdateLogo} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"><Save size={20}/> Save Logo</button>
        </div>
      </div>

      {/* Add New Dish */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add New Dish</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input placeholder="Name" className="bg-stone-100 p-2 rounded" onChange={e => setNewDish({...newDish, name: e.target.value})} />
          <input placeholder="Price" type="number" className="bg-stone-100 p-2 rounded" onChange={e => setNewDish({...newDish, price: parseFloat(e.target.value)})} />
          <input placeholder="Category" className="bg-stone-100 p-2 rounded" onChange={e => setNewDish({...newDish, category: e.target.value})} />
          <button onClick={handleAddDish} className="bg-red-600 text-white p-2 rounded flex items-center justify-center gap-2"><Plus size={20}/> Add</button>
        </div>
      </div>

      {/* Dishes List */}
      <div className="space-y-4">
        {dishes.map(dish => (
          <div key={dish.id} className="bg-[#1a1a1a] p-4 rounded-xl border border-stone-800 flex items-center justify-between">
            {editingDish?.id === dish.id ? (
              <div className="flex gap-2 flex-grow">
                <input defaultValue={dish.name} className="bg-stone-900 p-1 rounded" onChange={e => setEditingDish({...editingDish, name: e.target.value})} />
                <input defaultValue={dish.price} type="number" className="bg-stone-900 p-1 rounded" onChange={e => setEditingDish({...editingDish, price: parseFloat(e.target.value)})} />
                <button onClick={() => handleUpdateDish(dish.id, editingDish)} className="text-green-500"><Save /></button>
                <button onClick={() => setEditingDish(null)} className="text-red-500"><X /></button>
              </div>
            ) : (
              <>
                <span>{dish.name} - ${dish.price}</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingDish(dish)} className="text-blue-500"><Edit2 /></button>
                  <button onClick={() => handleDeleteDish(dish.id)} className="text-red-500"><Trash2 /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
