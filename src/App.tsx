import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail, ExternalLink, Code2, Briefcase, GraduationCap, Award, BookOpen, Star, Zap, Terminal, Coffee, Heart } from 'lucide-react';

let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (typeof window !== 'undefined') {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }
  return audioCtx;
};

const playSound = (type: 'pop' | 'boop' | 'click') => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'boop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    console.warn("Audio play failed", e);
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 12, mass: 0.8 } 
  }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 10 }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50, rotate: -5 },
  visible: { 
    opacity: 1, 
    x: 0, 
    rotate: 0, 
    transition: { type: "spring", stiffness: 100, damping: 12, mass: 0.8 } 
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50, rotate: 5 },
  visible: { 
    opacity: 1, 
    x: 0, 
    rotate: 0, 
    transition: { type: "spring", stiffness: 100, damping: 12, mass: 0.8 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const DoodleCard = ({ children, className = "", bgColor = "bg-white", hover = true }: { children: React.ReactNode, className?: string, bgColor?: string, hover?: boolean }) => (
  <div 
    className={`relative ${className}`}
    onMouseEnter={() => { if (hover) playSound('boop') }}
  >
    <div className={`absolute inset-0 bg-black br-doodle ${hover ? 'group-hover:translate-x-1 group-hover:translate-y-1 transition-transform' : ''}`}></div>
    <div className={`relative h-full ${bgColor} border-4 border-black br-doodle px-6 py-8 ${hover ? '-translate-x-1 -translate-y-1 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform' : ''}`}>
      {children}
    </div>
  </div>
);

interface SectionHeadingProps {
  children: React.ReactNode;
  icon?: React.ElementType;
}

const SectionHeading = ({ children, icon: Icon }: SectionHeadingProps) => (
  <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={popIn} 
    className="flex items-center gap-4 mb-12 relative z-10"
  >
    {Icon && (
      <div className="w-12 h-12 shrink-0 rounded-full bg-pastel-pink border-4 border-black flex items-center justify-center shadow-doodle">
        <Icon className="w-6 h-6 stroke-2" />
      </div>
    )}
    <h2 className="text-3xl sm:text-4xl min-w-0 font-display font-bold relative inline-block group">
      <span className="relative z-10">{children}</span>
      <div className="absolute bottom-1 left-0 right-0 h-3 bg-pastel-yellow -z-10 -rotate-1 group-hover:rotate-1 group-hover:h-4 group-hover:bg-pastel-blue transition-all duration-300"></div>
    </h2>
  </motion.div>
);

interface FloatingDoodleProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  rotate?: number;
  className?: string;
}

const FloatingDoodle = ({ children, delay = 0, duration = 5, y = -20, rotate = 10, className = "" }: FloatingDoodleProps) => (
  <motion.div
    className={`absolute pointer-events-none z-0 ${className}`}
    animate={{ y: [0, y, 0], rotate: [0, rotate, -rotate, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f5] text-gray-900 font-sans overflow-x-hidden selection:bg-pastel-pink selection:text-black">
      
      {/* Background Scattered Doodles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 mix-blend-multiply opacity-60">
         <FloatingDoodle className="top-[10%] left-[5%] text-gray-800" duration={6} y={-30} rotate={15}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5,20 Q12.5,5 20,20 T35,20" />
            </svg>
         </FloatingDoodle>
         <FloatingDoodle className="top-[25%] right-[10%] text-pastel-pink" duration={7} delay={1} y={20} rotate={-20}>
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <path d="M10,15 C20,-5 40,30 15,35 C-5,40 25,10 40,25" />
            </svg>
         </FloatingDoodle>
         <FloatingDoodle className="top-[55%] left-[8%] text-pastel-blue" duration={8} delay={2} y={-25} rotate={10}>
           <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
              <path d="M15,2 L15,28 M2,15 L28,15 M6,6 L24,24 M6,24 L24,6" />
           </svg>
         </FloatingDoodle>
         <FloatingDoodle className="top-[60%] right-[8%] text-gray-900" duration={5} delay={1.5} y={30} rotate={-15}>
           <svg width="40" height="30" viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
             <path d="M2,28 L38,28 L32,5 L25,15 L20,2 L15,15 L8,5 Z" className="fill-pastel-yellow" />
           </svg>
         </FloatingDoodle>
         <FloatingDoodle className="bottom-[10%] left-[15%] text-pastel-green" duration={6.5} delay={0.5} y={-20} rotate={25}>
           <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
              <circle cx="15" cy="15" r="12" />
              <path d="M10,15 L20,15 M15,10 L15,20" />
           </svg>
         </FloatingDoodle>
         <FloatingDoodle className="top-[80%] right-[20%] text-pastel-pink" duration={7.5} delay={2.5} y={25} rotate={-15}>
           <svg width="30" height="25" viewBox="0 0 30 25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15,25 C15,25 2,15 2,8 C2,3 8,1 15,6 C22,1 28,3 28,8 C28,15 15,25 15,25 Z" className="fill-current text-opacity-80" />
           </svg>
         </FloatingDoodle>
         <FloatingDoodle className="top-[15%] left-[45%] text-gray-800" duration={8} delay={1} y={30} rotate={45}>
             <svg width="20" height="50" viewBox="0 0 20 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
               <path d="M10,5 L10,35" />
               <circle cx="10" cy="45" r="3" fill="currentColor" stroke="none" />
             </svg>
         </FloatingDoodle>
         <FloatingDoodle className="bottom-[45%] right-[25%] text-gray-800" duration={9} delay={3} y={-40} rotate={-35}>
             <svg width="25" height="25" viewBox="0 0 25 25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
               <path d="M2.5,12.5 L22.5,12.5 M12.5,2.5 L12.5,22.5 M5.5,5.5 L19.5,19.5 M5.5,19.5 L19.5,5.5" />
             </svg>
         </FloatingDoodle>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-center pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20, rotate: -5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: -2 }}
            className="text-2xl font-display font-black tracking-tight bg-white px-5 py-2 border-4 border-black br-doodle shadow-doodle cursor-pointer"
          >
            HR.
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <a onMouseEnter={() => playSound('pop')} href="https://github.com/Hemanth-Raju-311" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-pastel-blue border-4 border-black br-doodle flex items-center justify-center shadow-doodle hover:-translate-y-1 hover:translate-x-1 transition-all">
              <Github className="w-6 h-6" />
            </a>
            <a onMouseEnter={() => playSound('pop')} href="https://www.linkedin.com/in/-hemanth-raju/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-pastel-yellow border-4 border-black br-doodle flex items-center justify-center shadow-doodle hover:-translate-y-1 hover:-translate-x-1 transition-all">
              <Linkedin className="w-6 h-6" />
            </a>
            <a onMouseEnter={() => playSound('pop')} href="mailto:hemanthraju311@gmail.com" className="w-12 h-12 bg-pastel-green border-4 border-black br-doodle-alt flex items-center justify-center shadow-doodle hover:-translate-y-1 transition-all group">
              <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </a>
          </motion.div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 py-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative w-64 h-64 md:w-[400px] md:h-[400px] flex-shrink-0 cursor-crosshair group"
            style={{ x: mousePos.x, y: mousePos.y }}
          >
            {/* Abstract Doodle Character / Silhouette representation */}
            <div className="absolute inset-0 bg-pastel-yellow border-4 border-black br-doodle-alt shadow-doodle-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-500 ease-out"></div>
            <div className="absolute inset-0 bg-white border-4 border-black br-doodle flex items-center justify-center p-6 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out overflow-visible">
               
               <svg viewBox="0 0 200 200" className="w-full h-full text-black stroke-current overflow-visible" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  {/* Speech Bubble floating interacting */}
                  <motion.g 
                    animate={{ y: [0, -5, 0] }} 
                    transition={{ duration: 3, repeat: Infinity }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <path d="M150,10 C180,10 190,30 180,50 C170,70 140,80 140,80 L130,90 L135,75 C125,75 120,60 120,50 C120,30 130,10 150,10 Z" className="fill-pastel-blue stroke-black" />
                    <text x="135" y="45" className="fill-black stroke-none text-[15px] font-bold font-handwriting">Hi!</text>
                  </motion.g>

                  {/* Character Body Blob */}
                  <path d="M40,160 C30,100 80,70 120,80 C160,90 170,140 160,180 C150,210 50,210 40,160 Z" className="fill-pastel-pink stroke-none" />
                  
                  {/* Character Head */}
                  <circle cx="100" cy="80" r="35" className="fill-white stroke-black" strokeWidth="4" />
                  
                  {/* Crazy Hair */}
                  <path d="M65,70 Q50,40 70,50 Q75,20 90,40 Q105,10 115,35 Q135,20 125,50 Q150,45 135,70 Q145,85 130,90" className="fill-black stroke-black" strokeWidth="4" />
                  
                  {/* Glasses */}
                  <circle cx="85" cy="85" r="10" className="fill-white stroke-black" strokeWidth="3" />
                  <circle cx="115" cy="85" r="10" className="fill-white stroke-black" strokeWidth="3" />
                  <path d="M95,85 L105,85" strokeWidth="3" />
                  <path d="M75,85 Q65,85 65,75" strokeWidth="3" />
                  <path d="M125,85 Q135,85 135,75" strokeWidth="3" />
                  
                  {/* Eyes (moving with mouse approximation) */}
                  <motion.circle 
                    cx={85 + (mousePos.x / 10)} 
                    cy={85 + (mousePos.y / 10)} 
                    r="3" 
                    fill="black" 
                    stroke="none" 
                  />
                  <motion.circle 
                    cx={115 + (mousePos.x / 10)} 
                    cy={85 + (mousePos.y / 10)} 
                    r="3" 
                    fill="black" 
                    stroke="none" 
                  />
                  
                  {/* Smile */}
                  <path d="M90,100 Q100,108 110,100" strokeWidth="3" />

                  {/* Desk / Keyboard area */}
                  <path d="M20,160 L180,160" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Laptop Rectangle covering body */}
                  <path d="M60,140 L140,140 L150,160 L50,160 Z" className="fill-white stroke-black" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M65,110 L135,110 L140,140 L60,140 Z" className="fill-pastel-blue stroke-black" strokeWidth="4" strokeLinejoin="round" />
                  
                  {/* Code on screen */}
                  <path d="M75,118 L110,118 M75,125 L95,125 M100,125 L125,125 M75,132 L115,132" strokeWidth="3" />

                  {/* Hands typing */}
                  <path d="M50,160 C30,130 60,130 75,150" strokeWidth="4" />
                  <path d="M150,160 C170,130 140,130 125,150" strokeWidth="4" />

                  {/* Coffee Mug on desk */}
                  <path d="M150,160 L155,140 L170,140 L170,160 Z" className="fill-white stroke-black" strokeLinejoin="round" />
                  <path d="M170,145 C180,145 180,155 170,155" strokeWidth="3" strokeLinecap="round" />

                  {/* Floating Elements (Animated inside SVG) */}
                  <motion.g animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }}>
                    <path d="M30,70 L40,80 M30,80 L40,70" strokeWidth="3" strokeLinecap="round" />
                  </motion.g>
                  
                  <motion.g animate={{ y: [5, -5, 5] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>
                    <circle cx="160" cy="110" r="4" className="fill-pastel-yellow stroke-black" strokeWidth="2" />
                  </motion.g>

               </svg>
            </div>
            {/* Playful outer elements */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 text-pastel-pink z-10 pointer-events-none">
              <Star fill="currentColor" className="w-16 h-16 stroke-black stroke-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" />
            </motion.div>
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-8 -left-10 text-pastel-yellow z-10 pointer-events-none">
              <Zap fill="currentColor" className="w-16 h-16 stroke-black stroke-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" />
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 text-center md:text-left z-10"
          >
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ rotate: -2, scale: 1.05 }}
              className="inline-block mb-4 px-4 py-2 bg-pastel-green border-4 border-black br-doodle-alt text-sm font-bold tracking-widest uppercase cursor-default"
            >
              Hello, I'm
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-display font-black leading-tight mb-6">
              Hemanth <br/>
              <span className="relative inline-block group">
                Raju
                <svg className="absolute -bottom-2 left-0 w-full h-4 text-pastel-pink group-hover:scale-y-150 transition-transform" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-700 font-medium mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed font-handwriting">
              AI & ML Engineer crafting intelligent systems, wrangling knowledge graphs, and building playful digital experiences.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a onMouseEnter={() => playSound('boop')} onClick={() => playSound('click')} href="#projects" className="group px-8 py-4 bg-pastel-pink border-4 border-black br-doodle text-xl font-bold flex items-center gap-2 shadow-doodle hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                View My Work <Coffee className="w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
              </a>
              <a onMouseEnter={() => playSound('boop')} onClick={() => playSound('click')} href="mailto:hemanthraju311@gmail.com" className="group px-8 py-4 bg-white border-4 border-black br-doodle-alt text-xl font-bold flex items-center gap-2 shadow-doodle hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Let's Talk <Mail className="w-6 h-6 group-hover:-rotate-12 group-hover:scale-110 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section className="py-24" id="experience">
          <SectionHeading icon={Briefcase}>Experience</SectionHeading>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="group">
              <DoodleCard bgColor="bg-pastel-blue">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-display font-bold">LLM Evaluator</h3>
                    <p className="font-handwriting text-gray-600 text-2xl mt-1">DataAnnotation Tech (Freelance/Contract) · Remote</p>
                  </div>
                  <div className="px-4 py-2 bg-white border-2 border-black br-doodle font-bold text-sm text-center shrink-0">
                    May 2026 – Present
                  </div>
                </div>
                <ul className="space-y-4 text-lg">
                  <li className="flex gap-4 items-start">
                    <span className="text-pastel-yellow mt-1"><Star fill="currentColor" className="w-5 h-5 stroke-black stroke-2" /></span>
                    <span>Engineered <strong>adversarial coding prompts</strong> to benchmark frontier LLMs and uncover failures in reasoning, instruction following, debugging, algorithm design, and edge-case handling.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-pastel-yellow mt-1"><Star fill="currentColor" className="w-5 h-5 stroke-black stroke-2" /></span>
                    <span>Evaluated and ranked responses across foundation models for correctness, efficiency, code quality, and logical consistency, with detailed evaluation rationales.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-pastel-yellow mt-1"><Star fill="currentColor" className="w-5 h-5 stroke-black stroke-2" /></span>
                    <span>Contributed to frontier AI training through prompt engineering, comparative analysis, quality assurance, error analysis, and model alignment.</span>
                  </li>
                </ul>
              </DoodleCard>
            </motion.div>
            <motion.div variants={fadeInUp} className="group">
              <DoodleCard bgColor="bg-pastel-yellow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-display font-bold">AI Model Trainer / LLM Evaluator</h3>
                    <p className="font-handwriting text-gray-600 text-2xl mt-1">Outlier AI (Freelance/Contract) · Remote</p>
                  </div>
                  <div className="px-4 py-2 bg-white border-2 border-black br-doodle font-bold text-sm text-center">
                    Sept 2025 – April 2026
                  </div>
                </div>
                <ul className="space-y-4 text-lg">
                  <li className="flex gap-4 items-start">
                    <span className="text-pastel-pink mt-1"><Star fill="currentColor" className="w-5 h-5 stroke-black stroke-2" /></span>
                    <span>Evaluated <strong>100+ LLM outputs</strong> across reasoning, coding, and instruction-following tasks via structured RLHF feedback loops, directly informing model fine-tuning priorities.</span>
                  </li>
                  <li className="flex gap-4 items-start">
                    <span className="text-pastel-pink mt-1"><Star fill="currentColor" className="w-5 h-5 stroke-black stroke-2" /></span>
                    <span>Performed systematic prompt analysis, comparative response ranking, and error taxonomy tagging — improving output quality signals across multiple model iterations.</span>
                  </li>
                </ul>
              </DoodleCard>
            </motion.div>
          </motion.div>
        </section>

        {/* Achievements Section */}
        <section className="py-24" id="achievements">
          <SectionHeading icon={Award}>Achievements</SectionHeading>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="group">
            <DoodleCard bgColor="bg-pastel-purple">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                <div>
                  <p className="font-handwriting text-2xl text-gray-700 mb-2">A little silver, a lot of optimization.</p>
                  <h3 className="text-3xl font-display font-bold">Kaggle NeuroGolf 2026</h3>
                </div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black br-doodle font-bold shrink-0">
                  <Award className="w-6 h-6" /> Silver Medal
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="px-4 py-2 bg-pastel-yellow border-2 border-black br-doodle-alt font-bold">Top 2.53%</span>
                <span className="px-4 py-2 bg-white border-2 border-black br-doodle font-bold">75 / 2,963 teams</span>
              </div>
              <p className="text-lg mb-6 max-w-3xl">Optimized ONNX graphs, eliminated redundant computation, and reduced inference cost while preserving correctness.</p>
              <a href="https://www.kaggle.com/certification/competitions/hemanthraju311/neurogolf-2026" target="_blank" rel="noopener noreferrer" onMouseEnter={() => playSound('boop')} onClick={() => playSound('click')} className="inline-flex px-4 py-2 bg-white border-2 border-black br-doodle font-bold items-center gap-2 hover:bg-gray-100 transition-colors">
                View Certificate <ExternalLink className="w-4 h-4" />
              </a>
            </DoodleCard>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section className="py-24" id="projects">
          <SectionHeading icon={Terminal}>Featured Projects</SectionHeading>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                title: "LLM & Knowledge Graph Interviewer System",
                tech: ["Python", "LLaMa 3.1-70B", "LangChain", "Neo4j"],
                date: "Aug 2025",
                color: "bg-pastel-blue",
                link: "https://github.com/Hemanth-Raju-311/LLM-and-Knowledge-Graph-Based-Interviewer-Selection-System",
                doodle: (
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" className="w-20 h-20 absolute -right-4 -top-6 text-black opacity-0 group-hover:opacity-100 group-hover:text-black transition-all rotate-12 scale-50 group-hover:scale-100 group-hover:-translate-y-4">
                    <circle cx="50" cy="30" r="10" className="fill-white" />
                    <circle cx="20" cy="70" r="10" className="fill-white" />
                    <circle cx="80" cy="70" r="10" className="fill-pastel-yellow" />
                    <path d="M40 38 L25 55" />
                    <path d="M60 38 L75 55" />
                    <path d="M30 70 L70 70" strokeDasharray="4 4" />
                  </svg>
                ),
                desc: [
                  "Architected end-to-end interviewer selection pipeline with Neo4j spanning 1,000+ nodes.",
                  "Achieved 64% job-skill coverage, outperforming baselines 2.5×.",
                  "Engineered automated skill extraction via LangChain NLP pipelines."
                ]
              },
              {
                title: "XWF-Agg: Federated Learning NID",
                tech: ["TensorFlow", "Flower FL", "LIME", "Streamlit"],
                date: "Jan 2026",
                color: "bg-pastel-pink",
                link: "https://github.com/Hemanth-Raju-311/XWF-Agg-Federated-Intrusion-Detection",
                doodle: (
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" className="w-20 h-20 absolute -right-2 -top-6 text-black opacity-0 group-hover:opacity-100 group-hover:text-black transition-all -rotate-12 scale-50 group-hover:scale-100 group-hover:-translate-y-4">
                    <path d="M50 10 L90 30 L90 60 C90 80 50 95 50 95 C50 95 10 80 10 60 L10 30 Z" className="fill-white" />
                    <circle cx="50" cy="50" r="15" className="fill-pastel-blue" />
                    <path d="M40 50 L60 50 M50 40 L50 60" />
                  </svg>
                ),
                desc: [
                  "Designed novel FL aggregation using LIME for weighted client contributions.",
                  "Achieved 99.27% accuracy on CICIDS2017 preserving full data privacy.",
                  "Built real distributed system across 10 federated rounds using Docker."
                ]
              },
              {
                title: "Underwater Plastic Surveillance",
                tech: ["YOLOv9", "Deep Learning", "Computer Vision"],
                date: "Mar 2024",
                color: "bg-pastel-green",
                link: "https://github.com/Hemanth-Raju-311/Underwater-Plastic-Surveillance-with-YOLOv9",
                doodle: (
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" className="w-20 h-20 absolute -right-4 -top-6 text-black opacity-0 group-hover:opacity-100 group-hover:text-black transition-all rotate-6 scale-50 group-hover:scale-100 group-hover:-translate-y-4">
                    <path d="M10 50 Q 25 30 50 50 T 90 50" />
                    <path d="M20 70 Q 35 50 60 70 T 90 70" />
                    <circle cx="40" cy="30" r="5" className="fill-white" />
                    <circle cx="60" cy="20" r="3" className="fill-white" />
                    <rect x="70" y="30" width="10" height="15" className="fill-pastel-pink" transform="rotate(20 70 30)" />
                  </svg>
                ),
                desc: [
                  "Fine-tuned YOLOv9 on custom dataset: 80% precision, 73% recall.",
                  "Designed 6-stage inference pipeline enabling plug-and-play edge deployment."
                ]
              }
            ].map((p, i) => (
              <motion.div key={i} variants={fadeInUp} className="group h-full">
                <DoodleCard bgColor={p.color} className="h-full relative overflow-visible">
                  {p.doodle}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-display font-bold leading-tight flex-1">{p.title}</h3>
                    <div className="px-3 py-1 bg-white border-2 border-black br-doodle text-xs font-bold whitespace-nowrap ml-4">
                      {p.date}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.tech.map((t, j) => (
                      <span key={j} className="px-2 py-1 bg-white border border-black br-doodle-alt text-xs font-bold">
                        {t}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {p.desc.map((d, j) => (
                      <li key={j} className="flex gap-2 items-start text-sm md:text-base">
                        <span className="text-black font-bold mt-0.5">→</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <a 
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => playSound('boop')}
                    onClick={() => playSound('click')}
                    className="mt-auto inline-flex px-4 py-2 bg-white border-2 border-black br-doodle font-bold items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer w-max"
                  >
                    View Project <ExternalLink className="w-4 h-4" />
                  </a>
                </DoodleCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Publications & Education */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-16" id="publications">
          
          <div>
            <SectionHeading icon={BookOpen}>Publications</SectionHeading>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.div variants={slideInLeft} className="group">
                <DoodleCard bgColor="bg-white">
                  <h3 className="text-2xl font-display font-bold mb-2">Similar Document Template Matching Algorithm</h3>
                  <p className="font-handwriting text-2xl text-gray-600 mb-4">Medical Fraud Detection • Nov 2023</p>
                  <p className="mb-6 text-gray-800">
                    Proposed pipeline combining ROI extraction, SSIM scoring, and OCR to verify medical documents and flag tampering.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["OpenCV", "OCR", "SSIM"].map((t, j) => (
                      <span key={j} className="px-2 py-1 bg-pastel-yellow border border-black br-doodle-alt text-xs font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a 
                    href="https://arxiv.org/abs/2311.12663" 
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => playSound('boop')}
                    className="inline-flex items-center gap-2 font-bold hover:underline underline-offset-4 decoration-2 decoration-pastel-pink"
                  >
                    Read on arXiv <ExternalLink className="w-4 h-4" />
                  </a>
                </DoodleCard>
              </motion.div>
            </motion.div>
          </div>

          <div>
            <SectionHeading icon={GraduationCap}>Education</SectionHeading>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={slideInRight} className="group">
                <DoodleCard bgColor="bg-pastel-blue">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-display font-bold pr-4">Vellore Institute of Technology (VIT), Chennai</h3>
                  </div>
                  <p className="font-bold border-b-2 border-black pb-2 mb-2 inline-block">B.Tech CSE (AI & ML Specialization)</p>
                  <div className="flex justify-between font-handwriting text-xl">
                    <span>Sept 2022 – 2026</span>
                    <span className="font-bold text-2xl">CGPA: 8.82</span>
                  </div>
                </DoodleCard>
              </motion.div>

              <motion.div variants={slideInRight} className="group">
                <DoodleCard bgColor="bg-white">
                  <h3 className="text-xl font-display font-bold mb-2">Narayana Junior College</h3>
                  <p className="font-bold border-b-2 border-black pb-2 mb-2 inline-block">MPC, Class XII</p>
                  <div className="flex justify-between font-handwriting text-xl">
                    <span>2020 – 2022</span>
                    <span className="font-bold text-2xl">96.6%</span>
                  </div>
                </DoodleCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-24" id="skills">
          <SectionHeading icon={Code2}>Technical Arsenal</SectionHeading>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-wrap gap-6"
          >
            {[
              { cat: "Languages", items: ["Python", "SQL", "Java", "C/C++", "HTML/CSS", "JavaScript"] },
              { cat: "ML / DL", items: ["TensorFlow", "Keras", "Scikit", "XGBoost", "YOLOv9", "Flower FL", "LIME"] },
              { cat: "NLP & LLM", items: ["LangChain", "LLaMa 3.1", "Semantic Search", "Prompt Eng", "RLHF", "KG"] },
              { cat: "Data & Viz", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "OpenCV", "Tableau", "Streamlit"] },
              { cat: "Tools", items: ["Neo4j", "Docker", "Git", "Jupyter", "VS Code"] }
            ].map((group, i) => (
              <motion.div key={i} variants={fadeInUp} className="w-full relative">
                <DoodleCard bgColor="bg-white" hover={false} className="mb-2">
                  <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pastel-pink border-2 border-black inline-block"></span>
                    {group.cat}
                    <span className="text-xs text-gray-400 font-handwriting ml-auto">Drag & drop!</span>
                  </h3>
                  <div className="flex flex-wrap gap-4 min-h-[50px] p-2 relative">
                    {group.items.map((skill, j) => (
                      <motion.div 
                        key={j} 
                        drag
                        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                        dragElastic={0.2}
                        onHoverStart={() => playSound('pop')}
                        whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }}
                        whileTap={{ scale: 0.95, cursor: "grabbing" }}
                        className="px-4 py-2 bg-[#faf9f5] border-2 border-black br-doodle text-sm font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] cursor-grab transition-colors hover:bg-pastel-yellow relative z-10"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </DoodleCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer / CTA */}
        <section className="py-24 mt-12 mb-12 relative text-center">
          <div className="absolute inset-0 bg-pastel-yellow border-4 border-black br-doodle-alt shadow-doodle transform -rotate-1 z-0"></div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative z-10 py-16 px-8 bg-white border-4 border-black br-doodle transform rotate-1"
          >
            <motion.h2 variants={fadeInUp} className="text-5xl font-display font-black mb-6">Let's build something awesome!</motion.h2>
            <motion.p variants={fadeInUp} className="text-xl font-medium text-gray-700 mb-10 max-w-2xl mx-auto">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </motion.p>
            <motion.a 
              variants={fadeInUp} 
              href="mailto:hemanthraju311@gmail.com" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white border-4 border-black br-doodle text-2xl font-bold hover:bg-pastel-pink hover:text-black transition-colors"
            >
              <Mail className="w-8 h-8" /> Say Hello
            </motion.a>
          </motion.div>
        </section>

      </main>

      <footer className="text-center py-8 font-bold border-t-4 border-black bg-white">
        <p className="flex items-center justify-center gap-2">
          Designed & Built with <Coffee className="w-5 h-5 fill-pastel-pink stroke-black stroke-2" /> by Hemanth Raju © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
