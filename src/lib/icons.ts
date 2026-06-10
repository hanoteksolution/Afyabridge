import {
  Activity, ArrowRight, ArrowUpRight, Award, BarChart3, BookOpen, Briefcase,
  Building2, Calendar, Check, CheckCircle2, ChevronDown, Circle, ClipboardList,
  Clock, CreditCard, Eye, EyeOff, FileCheck, FileText, FlaskConical, Gauge, Globe,
  GalleryHorizontal, GraduationCap, Handshake, Headphones, Heart, HeartPulse,
  Image, Layers, LayoutGrid, Lightbulb, Link2, Lock, Mail, MapPin, Menu,
  MessageSquare, Microscope, Monitor,
  Network, Package, Phone, Pill, PlayCircle, Plus, Quote, Rocket, Search, Send,
  Settings, Shield, ShieldCheck, Sparkles, Star, Stethoscope, TrendingUp,
  UserPlus, Users, Workflow, Zap, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Activity, ArrowRight, ArrowUpRight, Award, BarChart3, BookOpen, Briefcase,
  Building2, Calendar, Check, CheckCircle2, ChevronDown, Circle, ClipboardList,
  Clock, CreditCard, Eye, EyeOff, FileCheck, FileText, FlaskConical, Gauge, Globe,
  GalleryHorizontal, GraduationCap, Handshake, Headphones, HeadphonesIcon: Headphones,
  Heart, HeartPulse, Image, Layers, LayoutGrid, Lightbulb, Link2, Lock, Mail,
  MapPin, Menu, MessageSquare, Microscope, Monitor, Network, Package, Phone,
  Pill, PlayCircle,
  Plus, Quote, Rocket, Search, Send, Settings, Shield, ShieldCheck, Sparkles,
  Star, Stethoscope, TrendingUp, UserPlus, Users, Workflow, Zap,
};

export function getLucideIcon(name?: string | null, fallback: LucideIcon = LayoutGrid): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] || fallback;
}
