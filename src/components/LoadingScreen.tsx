import { useState, useEffect } from 'react';

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000); // 3 seconds loading
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <img 
        src="https://storage.googleapis.com/ai-studio-assets/user-uploads/178227588581/1744678854409.png" 
        alt="Logo" 
        className="w-48 h-48 rounded-full mb-6 animate-pulse bg-stone-100"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).parentElement?.insertAdjacentHTML('afterbegin', '<div class="w-48 h-48 rounded-full mb-6 bg-red-600 flex items-center justify-center text-white text-6xl font-bold">R</div>');
        }}
      />
      <h1 className="text-2xl font-bold text-red-600 tracking-tight text-center px-4">
        WELCOME TO RAMYASRI FOOD & BEVERAGE LTD
      </h1>
    </div>
  );
}
