'use client'

import { useState, useEffect } from 'react'
import { useNetwork } from 'wagmi'
import { SUPPORTED_CHAINS } from '@privacy-payments/lib'

export default function OverviewPage() {
  const { chain } = useNetwork()
  const [systemStatus, setSystemStatus] = useState({
    apiConnected: false,
    chainConnected: false,
    merkleTreeSynced: false,
    circuitsReady: false
  })

  useEffect(() => {
    checkSystemStatus()
  }, [chain])

  const checkSystemStatus = async () => {
    try {
      // Check API connection
      const apiResponse = await fetch('/api/health')
      const apiConnected = apiResponse.ok

      // Check chain connection
      const chainConnected = !!chain && SUPPORTED_CHAINS.some(c => c.chainId === chain.id)

      // TODO: Check other services
      const merkleTreeSynced = true // Placeholder
      const circuitsReady = true // Placeholder

      setSystemStatus({
        apiConnected,
        chainConnected,
        merkleTreeSynced,
        circuitsReady
      })
    } catch (error) {
      console.error('Failed to check system status:', error)
    }
  }

  const StatusIndicator = ({ status, label }: { status: boolean; label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{
        width: '0.75rem',
        height: '0.75rem',
        borderRadius: '50%',
        backgroundColor: status ? '#10b981' : '#ef4444'
      }} />
      <span style={{ color: status ? '#065f46' : '#b91c1c', fontSize: '0.875rem' }}>{label}</span>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #581c87, #0f172a)',
      color: 'white',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem 0'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3rem)',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>Privacy Protocol Overview</h1>
        
        {/* System Status */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '1rem'
          }}>System Status</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <StatusIndicator status={systemStatus.apiConnected} label="API Server" />
            <StatusIndicator status={systemStatus.chainConnected} label="Blockchain" />
            <StatusIndicator status={systemStatus.merkleTreeSynced} label="Merkle Tree" />
            <StatusIndicator status={systemStatus.circuitsReady} label="ZK Circuits" />
          </div>
          
          {chain && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              marginTop: '1rem'
            }}>
              <p style={{ color: '#93c5fd', fontSize: '0.875rem' }}>
                <strong>Connected to:</strong> {chain.name} (Chain ID: {chain.id})
              </p>
            </div>
          )}
        </div>

        {/* Privacy Flow Diagram */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>Anonymous Payment Flow</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Public to Shielded */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(to bottom right, #60a5fa, #3b82f6)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>1. Shield</h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.875rem'
                }}>
                  Move funds into anonymous pool
                </p>
              </div>
              <div style={{ textAlign: 'left', fontSize: '0.875rem', color: '#d1d5db' }}>
                <p>• Connect your wallet</p>
                <p>• Deposit tokens to contract</p>
                <p>• Generate private note</p>
                <p>• Hide in anonymity set</p>
              </div>
            </div>

            {/* Shielded to Shielded */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(to bottom right, #a855f7, #9333ea)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>2. Transfer</h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.875rem'
                }}>
                  Untraceable private transfers
                </p>
              </div>
              <div style={{ textAlign: 'left', fontSize: '0.875rem', color: '#d1d5db' }}>
                <p>• Generate ZK proof</p>
                <p>• Prove ownership privately</p>
                <p>• Break transaction links</p>
                <p>• Hide recipient identity</p>
              </div>
            </div>

            {/* Shielded to Public */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(to bottom right, #10b981, #059669)',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>3. Unshield</h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.875rem'
                }}>
                  Exit to any address anonymously
                </p>
              </div>
              <div style={{ textAlign: 'left', fontSize: '0.875rem', color: '#d1d5db' }}>
                <p>• Prove note ownership</p>
                <p>• Specify any recipient</p>
                <p>• Maintain anonymity</p>
                <p>• Withdraw clean funds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>Privacy-First Architecture</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#60a5fa',
                marginBottom: '1rem'
              }}>Core Privacy Technology</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { title: 'Zero-Knowledge Proofs', desc: 'Circom circuits with Groth16 for efficient proving' },
                  { title: 'Poseidon Hashing', desc: 'Optimized hash function for zk-SNARK circuits' },
                  { title: 'Nullifier System', desc: 'Prevent double-spending without revealing notes' },
                  { title: 'Merkle Anonymity', desc: '2^20 tree depth for massive anonymity sets' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#60a5fa', marginTop: '0.25rem' }}>•</span>
                    <div>
                      <strong style={{ color: 'white' }}>{item.title}:</strong>
                      <span style={{ color: '#d1d5db', marginLeft: '0.5rem' }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#a855f7',
                marginBottom: '1rem'
              }}>Advanced Privacy Features</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { title: 'Transaction Mixing', desc: 'Break on-chain analysis and clustering' },
                  { title: 'Amount Hiding', desc: 'Conceal transaction values completely' },
                  { title: 'Stealth Addresses', desc: 'Generate unique addresses per transaction' },
                  { title: 'Metadata Shielding', desc: 'Hide timing and pattern analysis' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#a855f7', marginTop: '0.25rem' }}>•</span>
                    <div>
                      <strong style={{ color: 'white' }}>{item.title}:</strong>
                      <span style={{ color: '#d1d5db', marginLeft: '0.5rem' }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supported Networks */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>Supported Networks</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {SUPPORTED_CHAINS.map(config => (
              <div 
                key={config.chainId}
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: chain?.id === config.chainId 
                    ? '2px solid #60a5fa' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: chain?.id === config.chainId 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <h3 style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                  {config.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '0.25rem' }}>
                  Chain ID: {config.chainId}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {config.isTestnet ? 'Testnet' : 'Mainnet'}
                </p>
                {chain?.id === config.chainId && (
                  <p style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.5rem' }}>
                    ✓ Currently connected
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}