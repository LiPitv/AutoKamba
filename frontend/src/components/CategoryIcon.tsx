import {
  CarFront,
  CircleDot,
  Droplet,
  Fuel,
  Gauge,
  HelpCircle,
  KeyRound,
  Plug,
  Shield,
  Stethoscope,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'

const MAPA: Record<string, typeof Wrench> = {
  'circle-dot': CircleDot,
  zap: Zap,
  fuel: Fuel,
  truck: Truck,
  wrench: Wrench,
  plug: Plug,
  'key-round': KeyRound,
  'help-circle': HelpCircle,
  'car-crash': CarFront,
  droplet: Droplet,
  shield: Shield,
  stethoscope: Stethoscope,
  gauge: Gauge,
}

export default function CategoryIcon({ icone, className }: { icone?: string | null; className?: string }) {
  const Icone = icone ? MAPA[icone] : undefined
  if (!Icone) {
    return <Wrench className={className} />
  }
  return <Icone className={className} />
}