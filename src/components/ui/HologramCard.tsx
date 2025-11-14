import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface HologramCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  delay?: number
}

export function HologramCard({ 
  children, 
  className, 
  glowColor = '#6C1BDB',
  delay = 0 
}: HologramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -50, rotateX: 15 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={cn(
        "hologram relative p-6 rounded-lg",
        "transform-gpu perspective-1000",
        "hover:scale-105 transition-all duration-300",
        className
      )}
      style={{
        boxShadow: `
          0 0 20px ${glowColor}40,
          inset 0 0 20px ${glowColor}10,
          0 4px 32px rgba(0, 0, 0, 0.3)
        `
      }}
      whileHover={{
        rotateY: 5,
        rotateX: 5,
        scale: 1.05,
      }}
    >
      {/* Hologram scan lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${glowColor}08 2px,
            ${glowColor}08 4px
          )`
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-current opacity-60" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-current opacity-60" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-current opacity-60" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-current opacity-60" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2 pointer-events-none"
        style={{ borderColor: glowColor }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}
