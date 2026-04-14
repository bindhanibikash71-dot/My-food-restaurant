import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create user document if it doesn't exist
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
      }, { merge: true });
      
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-8">Login</h1>
      <button 
        onClick={handleGoogleLogin} 
        className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Sign in with Google
      </button>
    </div>
  );
}
