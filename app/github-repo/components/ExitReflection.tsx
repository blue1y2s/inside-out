import React, { useState, useEffect } from 'react';

interface ExitReflectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExitReflection: React.FC<ExitReflectionProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleRelease = () => {
    console.log("Reflection released:", text);
    // Here you would typically send this to an analytics endpoint or save it
    onClose();
    setTimeout(() => setText(''), 300); // Clear after animation
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#FDFCF5]/60 transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`glass-panel w-[90%] max-w-lg p-10 rounded-3xl shadow-2xl bg-white/60 relative transform transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gallery-charcoal/30 hover:text-gallery-charcoal transition-colors p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h3 className="text-3xl md:text-4xl font-serif text-gallery-charcoal mb-8 leading-tight">
          Before you return to the world, how did this reflection sit with you?
        </h3>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I felt..."
          className="w-full h-40 bg-white/50 rounded-2xl p-6 text-gallery-charcoal font-sans text-lg placeholder-gallery-charcoal/30 resize-none focus:outline-none focus:ring-1 focus:ring-gallery-lime/50 transition-all mb-8 shadow-inner"
        />

        <div className="flex justify-end">
          <button
            onClick={handleRelease}
            className="px-8 py-4 bg-gallery-lime rounded-full text-gallery-charcoal font-serif font-bold text-lg hover:bg-gallery-yellow hover:scale-105 transition-all shadow-xl shadow-gallery-lime/20 tracking-wide"
          >
            Release
          </button>
        </div>
      </div>
    </div>
  );
};