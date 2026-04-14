import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const dishes = [
  { name: "Margherita Pizza", description: "Classic tomato, mozzarella, basil", price: 12.99, category: "Veg", rating: 4.5 },
  { name: "Pepperoni Pizza", description: "Tomato, mozzarella, pepperoni", price: 14.99, category: "Non-Veg", rating: 4.7 },
  { name: "Veggie Burger", description: "Plant-based patty, lettuce, tomato", price: 9.99, category: "Veg", rating: 4.2 },
  { name: "Chicken Burger", description: "Crispy chicken, spicy mayo", price: 11.99, category: "Non-Veg", rating: 4.6 },
  { name: "Caesar Salad", description: "Romaine, parmesan, croutons", price: 8.99, category: "Veg", rating: 4.3 },
  { name: "Spaghetti Carbonara", description: "Bacon, egg, parmesan", price: 13.99, category: "Non-Veg", rating: 4.8 },
  { name: "Iced Coffee", description: "Cold brew with milk", price: 4.99, category: "Drinks", rating: 4.4 },
  { name: "Mango Lassi", description: "Yogurt-based mango drink", price: 5.99, category: "Drinks", rating: 4.9 },
  { name: "French Fries", description: "Crispy salted fries", price: 3.99, category: "Fast Food", rating: 4.1 },
  { name: "Onion Rings", description: "Battered fried onion rings", price: 4.99, category: "Fast Food", rating: 4.0 },
];

export async function seedMenu() {
  for (const dish of dishes) {
    const dishRef = doc(db, 'menu', dish.name.replace(/\s+/g, '-').toLowerCase());
    await setDoc(dishRef, {
      ...dish,
      imageUrl: `https://picsum.photos/seed/${dish.name}/400/300`,
      available: true,
      totalOrders: 0
    });
  }
  console.log("Menu seeded successfully!");
}
