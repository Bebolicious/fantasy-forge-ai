import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Flame, RefreshCw, Loader2 } from 'lucide-react';

interface ResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  generatedImage: string | null;
  onDownload: () => void;
  onAddSpiciness: () => void;
  onRedo: () => void;
  isLoading?: boolean;
}

const ResultDialog = ({
  isOpen,
  onClose,
  generatedImage,
  onDownload,
  onAddSpiciness,
  onRedo,
  isLoading = false,
}: ResultDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-primary/30 fantasy-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cinzel fantasy-title text-center">
            Your Transformation Awaits
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {isLoading ? (
            <div className="w-full h-80 flex flex-col items-center justify-center gap-4 bg-muted/50 rounded-lg fantasy-border">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="text-muted-foreground font-cormorant text-lg">
                The arcane forces are at work...
              </p>
            </div>
          ) : generatedImage ? (
            <>
              <div className="relative rounded-lg overflow-hidden fantasy-border">
                <img 
                  src={generatedImage} 
                  alt="Generated fantasy character" 
                  className="w-full h-auto"
                />
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    background: [
                      'linear-gradient(45deg, transparent 0%, hsl(var(--gold) / 0.1) 50%, transparent 100%)',
                      'linear-gradient(45deg, transparent 100%, hsl(var(--gold) / 0.1) 50%, transparent 0%)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <motion.div
                className="absolute -inset-2 rounded-xl fantasy-glow opacity-30 -z-10"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          ) : null}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button 
              onClick={onDownload}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-cinzel"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button 
              onClick={onAddSpiciness}
              disabled={isLoading}
              className="w-full bg-ember hover:bg-ember/90 text-foreground font-cinzel"
            >
              <Flame className="w-4 h-4 mr-2" />
              Add Spiciness
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button 
              onClick={onRedo}
              disabled={isLoading}
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/10 font-cinzel"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Redo
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
