import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-sos/20 bg-sos/5 p-6 text-center">
            <p className="text-sm font-bold text-sos">Algo correu mal</p>
            <p className="mt-2 break-words font-mono text-xs text-ink">{this.state.error.message}</p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
              onClick={() => window.location.reload()}
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}