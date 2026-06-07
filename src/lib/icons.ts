import {
  Activity, ArrowRight, ArrowUpRight, Award, BarChart3, Building2, Calendar,
  Check, CheckCircle2, ChevronDown, Circle, ClipboardList, Clock, CreditCard,
  FileCheck, FileText, FlaskConical, Gauge, Globe, GraduationCap, Handshake,
  Headphones, Heart, HeartPulse, LayoutGrid, Lightbulb, Lock, Mail, MapPin,
  Microscope, Monitor, Network, Package, Phone, Pill, PlayCircle, Plus, Quote, Rocket,
  Search, Send, Settings, Shield, ShieldCheck, Sparkles, Star, Stethoscope,
  TrendingUp, UserPlus, Users, Workflow, Zap, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Activity, ArrowRight, ArrowUpRight, Award, BarChart3, Building2, Calendar,
  Check, CheckCircle2, ChevronDown, Circle, ClipboardList, Clock, CreditCard,
  FileCheck, FileText, FlaskConical, Gauge, Globe, GraduationCap, Handshake,
  Headphones, HeadphonesIcon: Headphones, Heart, HeartPulse, LayoutGrid,
  Lightbulb, Lock, Mail, MapPin, Microscope, Monitor, Network, Package, Phone, Pill,
  PlayCircle, Plus, Quote, Rocket, Search, Send, Settings, Shield, ShieldCheck,
  Sparkles, Star, Stethoscope, TrendingUp, UserPlus, Users, Workflow, Zap,
};

export function getLucideIcon(name?: string | null, fallback: LucideIcon = LayoutGrid): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] || fallback;
}
