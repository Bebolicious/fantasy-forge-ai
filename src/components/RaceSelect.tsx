import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

const dndRaces = [
  { value: "human", label: "Human" },
  { value: "elf", label: "Elf" },
  { value: "high-elf", label: "High Elf" },
  { value: "wood-elf", label: "Wood Elf" },
  { value: "dark-elf", label: "Dark Elf (Drow)" },
  { value: "dwarf", label: "Dwarf" },
  { value: "hill-dwarf", label: "Hill Dwarf" },
  { value: "mountain-dwarf", label: "Mountain Dwarf" },
  { value: "halfling", label: "Halfling" },
  { value: "lightfoot-halfling", label: "Lightfoot Halfling" },
  { value: "stout-halfling", label: "Stout Halfling" },
  { value: "gnome", label: "Gnome" },
  { value: "rock-gnome", label: "Rock Gnome" },
  { value: "forest-gnome", label: "Forest Gnome" },
  { value: "half-elf", label: "Half-Elf" },
  { value: "half-orc", label: "Half-Orc" },
  { value: "tiefling", label: "Tiefling" },
  { value: "dragonborn", label: "Dragonborn" },
  { value: "aasimar", label: "Aasimar" },
  { value: "goliath", label: "Goliath" },
  { value: "tabaxi", label: "Tabaxi" },
  { value: "kenku", label: "Kenku" },
  { value: "firbolg", label: "Firbolg" },
  { value: "triton", label: "Triton" },
  { value: "yuan-ti", label: "Yuan-ti Pureblood" },
  { value: "genasi", label: "Genasi" },
  { value: "tortle", label: "Tortle" },
  { value: "aarakocra", label: "Aarakocra" },
  { value: "kobold", label: "Kobold" },
  { value: "bugbear", label: "Bugbear" },
  { value: "goblin", label: "Goblin" },
  { value: "hobgoblin", label: "Hobgoblin" },
  { value: "orc", label: "Orc" },
  { value: "lizardfolk", label: "Lizardfolk" },
];

interface RaceSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const RaceSelect = ({ value, onValueChange }: RaceSelectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <label className="block text-sm font-cinzel text-primary mb-2 tracking-wider">
        Choose Your Race
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full fantasy-border bg-card/80 backdrop-blur-sm text-foreground hover:bg-card transition-colors">
          <SelectValue placeholder="Select a race..." />
        </SelectTrigger>
        <SelectContent className="bg-popover border-primary/30 max-h-80">
          {dndRaces.map((race) => (
            <SelectItem 
              key={race.value} 
              value={race.value}
              className="text-foreground hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary cursor-pointer"
            >
              {race.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default RaceSelect;
