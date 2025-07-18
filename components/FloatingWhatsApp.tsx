import React from 'react';
import { useCallback } from 'react';
import { MessageCircle } from 'lucide-react';

const FloatingWhatsApp: React.FC = () => {
  const handleWhatsAppClick = useCallback(() => {
    const phone = '5511999999999'; // Substitua pelo número real
    const message = encodeURIComponent('Quer ajuda? Preciso contratar com um consultor agora mesmo! Gostaria de saber mais sobre o Plano Dez Emergências.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all animate-pulse group"
        title="Quer ajuda? Contrate com um consultor agora mesmo!"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      
      {/* Tooltip/Bubble */}
      <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none min-w-[200px]">
        <div className="text-sm font-medium text-gray-900 mb-1">Quer ajuda?</div>
        <div className="text-xs text-gray-600">Contrate com um consultor agora mesmo!</div>
        
        {/* Arrow */}
        <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
      </div>
    </div>
  );
};

export default FloatingWhatsApp;