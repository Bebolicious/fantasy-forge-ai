import { motion } from 'framer-motion';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const GenerateButton = ({ onClick, disabled, isLoading }: GenerateButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full mt-6"
    >
      <motion.div
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <Button
          onClick={onClick}
          disabled={disabled}
          className={`
            w-full py-6 text-lg font-cinzel tracking-wider
            relative overflow-hidden group
            ${disabled 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground fantasy-glow'
            }
          `}
        >
          {/* Animated shimmer effect */}
          {!disabled && !isLoading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
          
          <span className="relative flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                Conjuring Your Image...
              </>
            ) : (
              <>
                <motion.div
                  animate={!disabled ? { rotate: [0, 15, -15, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Wand2 className="w-5 h-5" />
                </motion.div>
                Begin The Transformation
              </>
            )}
          </span>
        </Button>
      </motion.div>
      
      {disabled && !isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground text-center mt-2 font-cormorant"
        >
          Upload an image and select your race & realm to begin
        </motion.p>
      )}
    </motion.div>
  );
};

export default GenerateButton;
