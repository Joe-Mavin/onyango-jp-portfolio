import { useState, useEffect } from 'react'
import { SpaceScene } from './components/3d/SpaceScene'
import { PlanetContent } from './components/ui/PlanetContent'
import { StellarAudio } from './components/audio/StellarAudio'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [activePlanet, setActivePlanet] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true)
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
    }

    document.addEventListener('click', enableAudio)
    document.addEventListener('keydown', enableAudio)

    return () => {
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-midnight">
      {/* Audio System */}
      <StellarAudio isActive={audioEnabled} />
      
      {/* 3D Space Scene */}
      <ErrorBoundary>
        <SpaceScene onPlanetClick={setActivePlanet} />
      </ErrorBoundary>
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <motion.header 
          className="absolute top-0 left-0 right-0 z-10 p-6 pointer-events-auto"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <motion.h1 
              className="text-lg sm:text-xl md:text-2xl font-bold glow-text text-subtle-white font-mono"
              whileHover={{ scale: 1.05 }}
              style={{ 
                fontFamily: 'monospace',
                textShadow: '0 0 10px #00E5FF, 0 0 20px #00E5FF, 0 0 30px #00E5FF'
              }}
            >
              ONYANGO_JP
            </motion.h1>
            
            <nav className="flex gap-3 sm:gap-6 flex-wrap">
              {['About', 'Projects', 'Skills', 'Contact'].map((item, index) => (
                <motion.button
                  key={item}
                  className="text-xs sm:text-sm text-subtle-white/70 hover:text-cyber-neon transition-colors font-mono px-2 py-1"
                  style={{ 
                    fontFamily: 'monospace',
                    textShadow: '0 0 5px #00E5FF'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  onClick={() => setActivePlanet(item.toLowerCase())}
                >
                  {item}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.header>

        {/* Instructions - Mobile Responsive */}
        <motion.div 
          className="absolute bottom-6 left-4 sm:left-6 pointer-events-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="hologram p-3 sm:p-4 rounded-lg max-w-xs sm:max-w-sm">
            <h3 className="text-sm sm:text-lg font-semibold text-subtle-white mb-2 stellar-text">Navigation</h3>
            <ul className="text-subtle-white/70 text-xs sm:text-sm space-y-1">
              <li>• Click planets to explore</li>
              <li className="hidden sm:block">• Drag to rotate view</li>
              <li className="sm:hidden">• Touch to interact</li>
              <li>• Scroll/pinch to zoom</li>
              <li className="hidden sm:block">• Use mouse to navigate space</li>
            </ul>
          </div>
        </motion.div>

        {/* System Status - Mobile Responsive */}
        <motion.div 
          className="absolute bottom-6 right-4 sm:right-6 pointer-events-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="hologram p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyber-neon rounded-full animate-pulse"></div>
              <span className="text-subtle-white text-xs sm:text-sm stellar-text">System Online</span>
            </div>
            <div className="text-subtle-white/70 text-xs">
              <div className="hidden sm:block">
                Stellar Navigation: Active<br/>
                Hologram Projectors: Ready<br/>
                Quantum Drive: Standby
              </div>
              <div className="sm:hidden">
                Navigation: Active<br/>
                Systems: Ready
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Planet Content Modal */}
      <PlanetContent 
        planetId={activePlanet || ''}
        isOpen={!!activePlanet}
        onClose={() => setActivePlanet(null)}
      />

      {/* Loading Screen */}
      <motion.div
        className="absolute inset-0 bg-midnight flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 1 }}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-nebula border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-soft-white glow-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Initializing Stellar Navigation...
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}

export default App
