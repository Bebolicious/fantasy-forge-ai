import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dndRaces = [
  "Elf", "Dwarf", "Halfling", "Human", "Dragonborn", "Gnome", 
  "Half-Elf", "Half-Orc", "Tiefling", "Aasimar", "Goliath", "Tabaxi"
];

const quoteTemplates = [
  "Turn yourself into a {race}",
  "You would look great as a {race}",
  "{race}? You sure about that?",
  "Ever wondered what you'd look like as a {race}?",
  "Embrace your inner {race}",
  "The {race} life awaits you...",
  "A {race} walks into a tavern...",
  "Your {race} destiny awaits",
  "Behold, the {race} you could become!",
];

const FloatingQuote = () => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [key, setKey] = useState(0);

  useEffect(() => {
    const generateQuote = () => {
      const template = quoteTemplates[Math.floor(Math.random() * quoteTemplates.length)];
      const race = dndRaces[Math.floor(Math.random() * dndRaces.length)];
      return template.replace('{race}', race);
    };

    setCurrentQuote(generateQuote());

    const interval = setInterval(() => {
      setCurrentQuote(generateQuote());
      setKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={key}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="floating-quote text-xl md:text-2xl font-cormorant text-center"
        >
          "{currentQuote}"
        </motion.p>
      </AnimatePresence>
      
      {/* Decorative arrow pointing down */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-primary/60"
        >
          <path 
            d="M12 4L12 20M12 20L6 14M12 20L18 14" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default FloatingQuote;
