import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

const forgottenRealmsLocations = [
  { value: "baldurs-gate", label: "Baldur's Gate" },
  { value: "waterdeep", label: "Waterdeep" },
  { value: "neverwinter", label: "Neverwinter" },
  { value: "candlekeep", label: "Candlekeep" },
  { value: "sword-coast", label: "Sword Coast" },
  { value: "icewind-dale", label: "Icewind Dale" },
  { value: "underdark", label: "The Underdark" },
  { value: "menzoberranzan", label: "Menzoberranzan" },
  { value: "silverymoon", label: "Silverymoon" },
  { value: "luskan", label: "Luskan" },
  { value: "amn", label: "Amn" },
  { value: "athkatla", label: "Athkatla" },
  { value: "calimshan", label: "Calimshan" },
  { value: "calimport", label: "Calimport" },
  { value: "cormyr", label: "Cormyr" },
  { value: "suzail", label: "Suzail" },
  { value: "dalelands", label: "The Dalelands" },
  { value: "shadowdale", label: "Shadowdale" },
  { value: "thay", label: "Thay" },
  { value: "rashemen", label: "Rashemen" },
  { value: "chult", label: "Chult" },
  { value: "port-nyanzaru", label: "Port Nyanzaru" },
  { value: "avernus", label: "Avernus (Nine Hells)" },
  { value: "ravenloft", label: "Ravenloft" },
  { value: "barovia", label: "Barovia" },
  { value: "moonshae-isles", label: "Moonshae Isles" },
  { value: "evermeet", label: "Evermeet" },
  { value: "anauroch", label: "Anauroch Desert" },
  { value: "high-forest", label: "High Forest" },
  { value: "spine-of-world", label: "Spine of the World" },
];

interface RegionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const RegionSelect = ({ value, onValueChange }: RegionSelectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <label className="block text-sm font-cinzel text-primary mb-2 tracking-wider">
        Choose Your Realm
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full fantasy-border bg-card/80 backdrop-blur-sm text-foreground hover:bg-card transition-colors">
          <SelectValue placeholder="Select a region..." />
        </SelectTrigger>
        <SelectContent className="bg-popover border-primary/30 max-h-80">
          {forgottenRealmsLocations.map((location) => (
            <SelectItem 
              key={location.value} 
              value={location.value}
              className="text-foreground hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary cursor-pointer"
            >
              {location.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default RegionSelect;
