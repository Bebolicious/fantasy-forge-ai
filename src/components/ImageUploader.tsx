import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, Sparkles, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

const ImageUploader = ({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full"
    >
      <AnimatePresence mode="wait">
        {selectedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group"
          >
            <div className="fantasy-border rounded-xl overflow-hidden">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-64 object-cover"
              />
              <motion.div 
                className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              >
                <button
                  onClick={onClear}
                  className="p-3 bg-destructive/80 hover:bg-destructive rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-foreground" />
                </button>
              </motion.div>
            </div>
            <motion.div
              className="absolute -inset-1 rounded-xl fantasy-glow opacity-50 -z-10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center 
              w-full h-64 rounded-xl cursor-pointer
              fantasy-border transition-all duration-300
              ${isDragOver ? 'bg-primary/10 border-primary' : 'bg-card/50 hover:bg-card/80'}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <motion.div
              animate={{ 
                y: isDragOver ? -5 : 0,
                scale: isDragOver ? 1.1 : 1 
              }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div 
                className="relative"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="p-4 rounded-full bg-primary/20 fantasy-glow">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-gold-light" />
                </motion.div>
              </motion.div>
              
              <div className="text-center">
                <p className="text-lg font-cinzel text-primary">
                  Drop your image here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse your realm
                </p>
              </div>
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-primary/50 rounded-tl" />
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-primary/50 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-primary/50 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-primary/50 rounded-br" />
          </motion.label>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUploader;
