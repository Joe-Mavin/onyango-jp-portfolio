import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

interface StellarAudioProps {
  isActive: boolean
}

export function StellarAudio({ isActive }: StellarAudioProps) {
  const ambientSynthRef = useRef<Tone.Oscillator | null>(null)
  const filterRef = useRef<Tone.Filter | null>(null)
  const reverbRef = useRef<Tone.Reverb | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    const initAudio = async () => {
      if (isInitialized.current) return

      try {
        // Initialize Tone.js context
        await Tone.start()
        
        // Create ambient bass hum
        const filter = new Tone.Filter(80, 'lowpass').toDestination()
        const reverb = new Tone.Reverb(8).connect(filter)
        
        const ambientSynth = new Tone.Oscillator({
          frequency: 28, // Very low frequency for hull vibration feel
          type: 'sawtooth'
        }).connect(reverb)

        // Store references
        ambientSynthRef.current = ambientSynth
        filterRef.current = filter
        reverbRef.current = reverb
        
        isInitialized.current = true

        if (isActive) {
          ambientSynth.start()
          ambientSynth.volume.value = -25 // Very quiet ambient
        }
      } catch (error) {
        console.warn('Audio initialization failed:', error)
      }
    }

    initAudio()

    return () => {
      // Cleanup on unmount
      if (ambientSynthRef.current) {
        ambientSynthRef.current.stop()
        ambientSynthRef.current.dispose()
      }
      if (filterRef.current) filterRef.current.dispose()
      if (reverbRef.current) reverbRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (!ambientSynthRef.current) return

    if (isActive) {
      try {
        ambientSynthRef.current.start()
      } catch (error) {
        // Oscillator might already be started
      }
    } else {
      ambientSynthRef.current.stop()
    }
  }, [isActive])

  return null
}

// Audio utility functions for interactions
export const playHoverSound = () => {
  if (!Tone.context.state || Tone.context.state !== 'running') return

  try {
    const shimmer = new Tone.Oscillator({
      frequency: 800,
      type: 'sine'
    }).toDestination()

    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.1,
      decay: 0.3,
      sustain: 0.2,
      release: 0.5
    }).connect(shimmer)

    shimmer.start()
    envelope.triggerAttackRelease('0.3')
    shimmer.volume.value = -20

    setTimeout(() => {
      shimmer.stop()
      shimmer.dispose()
      envelope.dispose()
    }, 800)
  } catch (error) {
    console.warn('Hover sound failed:', error)
  }
}

export const playHyperspaceSound = () => {
  if (!Tone.context.state || Tone.context.state !== 'running') return

  try {
    const whoosh = new Tone.Noise('pink').toDestination()
    const filter = new Tone.Filter(2000, 'lowpass').connect(whoosh)
    
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.05,
      decay: 0.2,
      sustain: 0.3,
      release: 1.0
    }).connect(filter)

    whoosh.start()
    envelope.triggerAttackRelease('1.2')
    whoosh.volume.value = -15

    // Sweep the filter for whoosh effect
    filter.frequency.exponentialRampTo(200, 1.2)

    setTimeout(() => {
      whoosh.stop()
      whoosh.dispose()
      filter.dispose()
      envelope.dispose()
    }, 1500)
  } catch (error) {
    console.warn('Hyperspace sound failed:', error)
  }
}
