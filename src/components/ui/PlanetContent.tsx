import { motion, AnimatePresence } from 'framer-motion'
import { HologramCard } from './HologramCard'
import { X, Code, Rocket, Brain, Mail, Github, Linkedin, ExternalLink } from 'lucide-react'

interface PlanetContentProps {
  planetId: string
  isOpen: boolean
  onClose: () => void
}

const contentData = {
  about: {
    title: "About Me",
    color: "#6C1BDB",
    content: (
      <div className="space-y-6">
        <HologramCard glowColor="#6C1BDB">
          <h3 className="text-xl font-bold text-soft-white mb-3">Who I Am</h3>
          <p className="text-soft-white/80 leading-relaxed">
            I'm a passionate full-stack developer with a love for creating immersive digital experiences. 
            Specializing in React, Three.js, and modern web technologies.
          </p>
        </HologramCard>
        
        <HologramCard glowColor="#12A7FF" delay={0.2}>
          <h3 className="text-xl font-bold text-soft-white mb-3">My Mission</h3>
          <p className="text-soft-white/80 leading-relaxed">
            To bridge the gap between imagination and reality through code, creating applications 
            that not only function beautifully but inspire and delight users.
          </p>
        </HologramCard>
      </div>
    )
  },
  
  projects: {
    title: "Projects",
    color: "#12A7FF",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HologramCard glowColor="#12A7FF">
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="w-6 h-6 text-electric" />
            <h3 className="text-xl font-bold text-soft-white">3D Portfolio</h3>
          </div>
          <p className="text-soft-white/80 mb-4">
            Interactive space-themed portfolio with Three.js and React
          </p>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1 bg-electric/20 text-electric rounded">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-nebula/20 text-nebula rounded">
              <Github className="w-4 h-4" />
              Code
            </button>
          </div>
        </HologramCard>

        <HologramCard glowColor="#9D4EDD" delay={0.2}>
          <div className="flex items-center gap-3 mb-3">
            <Code className="w-6 h-6 text-nebula" />
            <h3 className="text-xl font-bold text-soft-white">AI Dashboard</h3>
          </div>
          <p className="text-soft-white/80 mb-4">
            Modern dashboard with real-time data visualization
          </p>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1 bg-electric/20 text-electric rounded">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </button>
            <button className="flex items-center gap-2 px-3 py-1 bg-nebula/20 text-nebula rounded">
              <Github className="w-4 h-4" />
              Code
            </button>
          </div>
        </HologramCard>
      </div>
    )
  },

  skills: {
    title: "Skills",
    color: "#EAF6FF",
    content: (
      <div className="space-y-6">
        <HologramCard glowColor="#EAF6FF">
          <h3 className="text-xl font-bold text-soft-white mb-4">Frontend</h3>
          <div className="grid grid-cols-3 gap-3">
            {['React', 'TypeScript', 'Three.js', 'Next.js', 'Tailwind', 'Framer Motion'].map((skill) => (
              <div key={skill} className="px-3 py-2 bg-soft-white/10 rounded text-center text-sm">
                {skill}
              </div>
            ))}
          </div>
        </HologramCard>

        <HologramCard glowColor="#12A7FF" delay={0.2}>
          <h3 className="text-xl font-bold text-soft-white mb-4">Backend & Tools</h3>
          <div className="grid grid-cols-3 gap-3">
            {['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'Git'].map((skill) => (
              <div key={skill} className="px-3 py-2 bg-soft-white/10 rounded text-center text-sm">
                {skill}
              </div>
            ))}
          </div>
        </HologramCard>
      </div>
    )
  },

  contact: {
    title: "Contact",
    color: "#9D4EDD",
    content: (
      <div className="space-y-6">
        <HologramCard glowColor="#9D4EDD">
          <h3 className="text-xl font-bold text-soft-white mb-4">Get In Touch</h3>
          <p className="text-soft-white/80 mb-6">
            Ready to collaborate on something amazing? Let's connect and bring your ideas to life!
          </p>
          
          <div className="space-y-4">
            <button className="flex items-center gap-3 w-full p-3 bg-nebula/20 hover:bg-nebula/30 rounded transition-colors">
              <Mail className="w-5 h-5 text-nebula" />
              <span className="text-soft-white">hello@example.com</span>
            </button>
            
            <button className="flex items-center gap-3 w-full p-3 bg-electric/20 hover:bg-electric/30 rounded transition-colors">
              <Linkedin className="w-5 h-5 text-electric" />
              <span className="text-soft-white">LinkedIn Profile</span>
            </button>
            
            <button className="flex items-center gap-3 w-full p-3 bg-soft-white/20 hover:bg-soft-white/30 rounded transition-colors">
              <Github className="w-5 h-5 text-soft-white" />
              <span className="text-soft-white">GitHub Profile</span>
            </button>
          </div>
        </HologramCard>
      </div>
    )
  }
}

export function PlanetContent({ planetId, isOpen, onClose }: PlanetContentProps) {
  const content = contentData[planetId as keyof typeof contentData]
  
  if (!content) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 1, 15, 0.9)' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-xs sm:max-w-2xl lg:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <motion.h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold glow-text stellar-text"
                style={{ color: content.color }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {content.title}
              </motion.h2>
              
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-soft-white/10 hover:bg-soft-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-soft-white" />
              </button>
            </div>

            {/* Content */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {content.content}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
