import { Flame, GlassWater, HandPlatter, MonitorPlay, ParkingCircle, Refrigerator, ShowerHead, Snowflake, Sparkles, Speaker, UsersRound, Wifi, type LucideIcon } from 'lucide-react';
import type { Amenity } from '@/data/venue';

const icons: Record<Amenity['icon'], LucideIcon> = {
  speaker: Speaker,
  fridge: Refrigerator,
  ice: Snowflake,
  glass: GlassWater,
  plate: HandPlatter,
  towel: ShowerHead,
  parking: ParkingCircle,
  staff: UsersRound,
  clean: Sparkles,
  wifi: Wifi,
  screen: MonitorPlay,
  flame: Flame,
};

export function AmenityIcon({ name, className }: { name: Amenity['icon']; className?: string }) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" strokeWidth={1.4} className={className} />;
}
