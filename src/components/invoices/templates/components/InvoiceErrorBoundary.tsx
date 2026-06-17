'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
  fallbackTemplate: React.ReactNode
}

interface State {
  hasError: boolean
}

export class InvoiceErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Invoice Template Render Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallbackTemplate
    }

    return this.props.children
  }
}
