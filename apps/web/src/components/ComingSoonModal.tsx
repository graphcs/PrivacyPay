'use client'

import { useState } from 'react'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setEmail('')
      } else {
        alert('Failed to sign up. Please try again.')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsSubmitted(false)
    setEmail('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      paddingTop: '10vh'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #1e293b)',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '28rem',
        width: '100%',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '0.25rem',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => (e.target as HTMLElement).style.color = 'white'}
          onMouseOut={(e) => (e.target as HTMLElement).style.color = '#9ca3af'}
        >
          ×
        </button>

        {!isSubmitted ? (
          <div style={{ textAlign: 'center' }}>
            {/* Icon */}
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(to bottom right, #60a5fa, #a855f7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 32px rgba(96, 165, 250, 0.3)'
            }}>
              <span style={{ 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '1.5rem' 
              }}>🚀</span>
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              Coming Soon!
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.125rem',
              color: '#d1d5db',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              🚀 Exclusive Token Launch
            </p>

            {/* Description */}
            <p style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              Be among the first to access our privacy tokens and participate in the 
              future of anonymous transactions. Early supporters get priority access.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, background-color 0.2s'
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor = '#60a5fa'
                    ;(e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    ;(e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={!email || isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: (!email || isSubmitting) 
                    ? '#6b7280' 
                    : 'linear-gradient(to right, #60a5fa, #a855f7)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (!email || isSubmitting) ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s',
                  boxShadow: (!email || isSubmitting) 
                    ? 'none' 
                    : '0 4px 16px rgba(96, 165, 250, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!(!email || isSubmitting)) {
                    (e.target as HTMLElement).style.transform = 'translateY(-1px)'
                    ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(96, 165, 250, 0.4)'
                  }
                }}
                onMouseOut={(e) => {
                  if (!(!email || isSubmitting)) {
                    (e.target as HTMLElement).style.transform = 'translateY(0)'
                    ;(e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(96, 165, 250, 0.3)'
                  }
                }}
              >
                {isSubmitting ? 'Signing Up...' : 'Notify Me About Token Launch 🚀'}
              </button>
            </form>

            {/* Benefits */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#60a5fa',
                marginBottom: '0.5rem'
              }}>
                Early Supporter Benefits:
              </h3>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#d1d5db',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <div>🎯 Priority token allocation</div>
                <div>⚡ Early access to privacy features</div>
                <div>🏆 Exclusive governance voting rights</div>
                <div>💎 Bonus tokens for early supporters</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            {/* Success Icon */}
            <div style={{
              width: '4rem',
              height: '4rem',
              background: 'linear-gradient(to bottom right, #10b981, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
            }}>
              <span style={{ 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: '1.5rem' 
              }}>✓</span>
            </div>

            {/* Success Message */}
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem'
            }}>
              You're In! 🎉
            </h2>

            <p style={{
              fontSize: '1rem',
              color: '#d1d5db',
              marginBottom: '0.5rem'
            }}>
              Welcome to the privacy revolution!
            </p>

            <p style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              You'll be the first to know when our tokens launch. 
              Keep an eye on your inbox for exclusive updates.
            </p>

            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'linear-gradient(to right, #10b981, #059669)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-1px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)'
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  )
}