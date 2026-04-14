import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle, Clock, Phone, MapPin, DollarSign, Package } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  address: string;
  status: 'pending' | 'out-for-delivery' | 'delivered';
  price: number;
}

export default function DriverPanel() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const q = query(collection(db, 'orders'), where('status', 'in', ['pending', 'out-for-delivery']));
    const querySnapshot = await getDocs(q);
    setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
  };

  const updateStatus = async (id: string, status: 'out-for-delivery' | 'delivered') => {
    await updateDoc(doc(db, 'orders', id), { status });
    fetchOrders();
  };

  const totalEarnings = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + (o.price * 0.1), 0);

  return (
    <div className="p-6 text-stone-100 min-h-screen bg-[#050505]">
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 mb-1"><Package size={18}/> Active</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-stone-800">
          <div className="flex items-center gap-2 text-stone-400 mb-1"><DollarSign size={18}/> Earnings</div>
          <div className="text-2xl font-bold text-green-400">${totalEarnings.toFixed(2)}</div>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-[#1a1a1a] p-5 rounded-2xl border border-stone-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{order.customerName}</h3>
                <p className="text-stone-400 text-sm flex items-center gap-1 mt-1"><MapPin size={14}/> {order.address}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${order.status === 'pending' ? 'bg-orange-900/30 text-orange-400' : 'bg-blue-900/30 text-blue-400'}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-stone-800 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"><Phone size={16}/> Call</button>
              <button className="flex-1 bg-stone-800 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"><MapPin size={16}/> Navigate</button>
            </div>

            <div className="mt-4">
              {order.status === 'pending' && (
                <button onClick={() => updateStatus(order.id, 'out-for-delivery')} className="w-full bg-orange-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><Clock size={18}/> Accept & Pick Up</button>
              )}
              {order.status === 'out-for-delivery' && (
                <button onClick={() => updateStatus(order.id, 'delivered')} className="w-full bg-green-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><CheckCircle size={18}/> Mark Delivered</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
