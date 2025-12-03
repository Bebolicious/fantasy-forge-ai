import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingQuote from '@/components/FloatingQuote';
import ImageUploader from '@/components/ImageUploader';
import RaceSelect from '@/components/RaceSelect';
import RegionSelect from '@/components/RegionSelect';
import GenerateButton from '@/components/GenerateButton';
import ResultDialog from '@/components/ResultDialog';
import { generateFantasyImage, regenerateImage } from '@/api';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setSelectedImage(preview);
    setOriginalFile(file);
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
    setOriginalFile(null);
  }, []);

  const generateImage = async (baseImage: string, isSpiciness = false) => {
    setIsLoading(true);
    setIsDialogOpen(true);

    try {
      const result = isSpiciness
        ? await regenerateImage(baseImage, selectedRace, selectedRegion)
        : await generateFantasyImage({ image: baseImage, race: selectedRace, region: selectedRegion });

      if (result.success && result.image) {
        setGeneratedImage(result.image);
        toast.success('Your transformation is complete!', {
          description: `You are now a ${selectedRace} from ${selectedRegion}`,
        });
      } else {
        toast.error('Generation failed', {
          description: result.error || 'Please try again',
        });
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!selectedImage || !selectedRace || !selectedRegion) {
      toast.error('Please complete all fields', {
        description: 'Upload an image and select both race and region',
      });
      return;
    }
    generateImage(selectedImage);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `dnd-${selectedRace}-${selectedRegion}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded!');
  };

  const handleAddSpiciness = () => {
    if (!generatedImage) return;
    toast.info('Adding more spice to your character...');
    generateImage(generatedImage, true);
  };

  const handleRedo = () => {
    if (!selectedImage) return;
    toast.info('Regenerating from your original image...');
    generateImage(selectedImage);
  };

  const isGenerateDisabled = !selectedImage || !selectedRace || !selectedRegion || isLoading;

  return (
    <div className="min-h-screen bg-fantasy-gradient relative overflow-hidden">
      <ParticleBackground />
      
      <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-cinzel font-bold fantasy-title leading-tight"
            animate={{ 
              textShadow: [
                '0 0 10px hsl(var(--gold) / 0.5), 0 0 20px hsl(var(--gold) / 0.3)',
                '0 0 20px hsl(var(--gold) / 0.6), 0 0 40px hsl(var(--gold) / 0.4)',
                '0 0 10px hsl(var(--gold) / 0.5), 0 0 20px hsl(var(--gold) / 0.3)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Dungeons & Dragons
          </motion.h1>
          <motion.p 
            className="text-2xl md:text-3xl lg:text-4xl font-cinzel text-primary/80 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            AI Helper
          </motion.p>
          
          {/* Decorative line */}
          <motion.div 
            className="w-48 h-1 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Floating Quote */}
        <div className="mb-16">
          <FloatingQuote />
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="fantasy-card p-6 md:p-8 backdrop-blur-sm">
            {/* Image Uploader */}
            <ImageUploader
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onClear={handleClearImage}
            />

            {/* Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <RaceSelect
                value={selectedRace}
                onValueChange={setSelectedRace}
              />
              <RegionSelect
                value={selectedRegion}
                onValueChange={setSelectedRegion}
              />
            </div>

            {/* Generate Button */}
            <GenerateButton
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              isLoading={isLoading}
            />
          </div>
        </motion.div>

        {/* Footer decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground font-cormorant text-sm">
            Transform yourself into a legendary hero
          </p>
        </motion.div>
      </main>

      {/* Result Dialog */}
      <ResultDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        generatedImage={generatedImage}
        onDownload={handleDownload}
        onAddSpiciness={handleAddSpiciness}
        onRedo={handleRedo}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Index;
