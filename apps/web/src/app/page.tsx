'use client'

import { useState } from 'react'
import Link from 'next/link'
import ComingSoonModal from '../components/ComingSoonModal'
import OverrideConnectButton from '../components/OverrideConnectButton'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #0f172a, #581c87, #0f172a)',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'relative',
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            height: '4rem' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                background: 'linear-gradient(to bottom right, #60a5fa, #9333ea)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.75rem'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>ZK</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>
                PrivacyPay
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <Link href="/overview" style={{ 
                  color: '#d1d5db', 
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}>
                  Overview
                </Link>
                <Link href="/wallet" style={{ 
                  color: '#d1d5db', 
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}>
                  Wallet
                </Link>
                <Link href="/compliance" style={{ 
                  color: '#d1d5db', 
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}>
                  Privacy Tools
                </Link>
                <Link href="/admin" style={{ 
                  color: '#d1d5db', 
                  textDecoration: 'none',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}>
                  System
                </Link>
              </div>
              
              <OverrideConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: 'relative' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-10rem',
            right: '-8rem',
            width: '24rem',
            height: '24rem',
            background: '#a855f7',
            borderRadius: '50%',
            mixBlendMode: 'multiply',
            filter: 'blur(4rem)',
            opacity: 0.2
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-10rem',
            left: '-8rem',
            width: '24rem',
            height: '24rem',
            background: '#3b82f6',
            borderRadius: '50%',
            mixBlendMode: 'multiply',
            filter: 'blur(4rem)',
            opacity: 0.2
          }}></div>
        </div>

        <div style={{ 
          position: 'relative', 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '5rem 1rem 4rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#93c5fd',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#4ade80',
                borderRadius: '50%',
                marginRight: '0.5rem'
              }}></div>
              Zero-Knowledge Privacy Protocol
            </div>

            {/* Main heading */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1.5rem',
              lineHeight: 1.1
            }}>
              Private Payments
              <br />
              <span style={{
                background: 'linear-gradient(to right, #60a5fa, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Made Simple
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.25rem',
              color: '#d1d5db',
              marginBottom: '2.5rem',
              maxWidth: '48rem',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6
            }}>
              Shield your Ethereum transactions with zero-knowledge proofs. Complete privacy 
              without revealing amounts, recipients, or transaction history.
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '5rem'
            }}>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleActionClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 2rem',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '0.375rem',
                    color: 'white',
                    backgroundColor: '#2563eb',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Launch App
                </button>
                <Link
                  href="/overview"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem 2rem',
                    border: '1px solid #9ca3af',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '0.375rem',
                    color: '#9ca3af',
                    backgroundColor: 'transparent',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ 
          position: 'relative', 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '4rem 1rem' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Advanced Privacy Infrastructure
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#9ca3af',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              Built with cutting-edge cryptographic primitives to ensure complete transaction 
              privacy for all users without compromising security or decentralization.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {/* Feature cards */}
            {[
              {
                title: 'Zero-Knowledge Proofs',
                description: 'Prove transaction validity without revealing sensitive information using advanced zk-SNARK technology.',
                color: '#60a5fa'
              },
              {
                title: 'Anonymous Transactions', 
                description: 'Send and receive funds without revealing your identity, balance, or transaction patterns.',
                color: '#4ade80'
              },
              {
                title: 'Multi-Chain Support',
                description: 'Native support for Ethereum mainnet and testnet with extensible architecture.',
                color: '#a855f7'
              },
              {
                title: 'Untraceable Payments',
                description: 'Break transaction graph analysis and protect your financial privacy from surveillance.',
                color: '#f97316'
              },
              {
                title: 'Enterprise Ready',
                description: 'Production-ready infrastructure with enterprise-grade security and scalability.',
                color: '#ec4899'
              },
              {
                title: 'Developer APIs',
                description: 'Comprehensive APIs and SDKs for seamless integration into existing applications.',
                color: '#6366f1'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(4px)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: `${feature.color}20`,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    backgroundColor: feature.color,
                    borderRadius: '0.25rem'
                  }}></div>
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          position: 'relative', 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '4rem 1rem' 
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '2rem'
            }}>
              {[
                { value: '100%', label: 'Privacy Preserved', color: '#60a5fa' },
                { value: '<10s', label: 'Proof Generation', color: '#4ade80' },
                { value: '2^20', label: 'Merkle Tree Depth', color: '#a855f7' },
                { value: '24/7', label: 'Network Uptime', color: '#f97316' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  style={{ 
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                    fontWeight: 'bold',
                    color: stat.color,
                    marginBottom: '0.5rem',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ 
          position: 'relative', 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '4rem 1rem' 
        }}>
          <div style={{
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Ready to Experience Private Payments?
            </h2>
            <p style={{
              color: '#bfdbfe',
              marginBottom: '1.5rem',
              maxWidth: '32rem',
              margin: '0 auto 1.5rem'
            }}>
              Join the privacy revolution. Shield your transactions and protect your financial 
              freedom with military-grade cryptographic privacy.
            </p>
            <button
              onClick={handleActionClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem 2rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '0.375rem',
                color: '#2563eb',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </main>
      
      <ComingSoonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}