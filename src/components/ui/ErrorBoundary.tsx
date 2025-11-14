import React, { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Stellar Compass Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-midnight flex items-center justify-center">
          <div className="hologram p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold text-cyber-neon stellar-text mb-4">
              SYSTEM ERROR
            </h2>
            <p className="text-subtle-white/80 mb-6">
              The stellar navigation system encountered an error. 
              Attempting to reinitialize...
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2 bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/50 rounded stellar-text hover:bg-cyber-neon/30 transition-colors"
            >
              RESTART NAVIGATION
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
