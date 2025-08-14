'use client'

import { useState, useEffect } from 'react'
import { BrowserStorage } from '@privacy-payments/lib'

export default function PrivacyAdminPage() {
  const [storageStats, setStorageStats] = useState<any>(null)
  const [systemInfo, setSystemInfo] = useState<any>(null)
  const [privacyStatus, setPrivacyStatus] = useState<any>(null)

  useEffect(() => {
    loadSystemInfo()
    loadStorageStats()
    checkPrivacyStatus()
  }, [])

  const loadSystemInfo = () => {
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      localStorage: typeof(Storage) !== "undefined",
      webCrypto: !!window.crypto?.subtle,
    }
    setSystemInfo(info)
  }

  const loadStorageStats = () => {
    const stats = BrowserStorage.getStorageStats()
    setStorageStats(stats)
  }

  const checkPrivacyStatus = async () => {
    try {
      // Mock privacy system status
      setPrivacyStatus({
        circuitsLoaded: true,
        merkleTreeSynced: true,
        anonymityPoolSize: 2847,
        lastMixingRound: new Date().toISOString(),
        privacyLevel: 'HIGH',
        zkProofsGenerated: 156,
        status: 'Operational'
      })
    } catch (error) {
      setPrivacyStatus({
        status: 'Error',
        error: error
      })
    }
  }

  const clearPrivateData = () => {
    if (confirm('Are you sure you want to clear all private data? This will delete your encrypted notes and keys.')) {
      BrowserStorage.clearWalletState()
      BrowserStorage.clearTempData()
      alert('Private data cleared securely')
      loadStorageStats()
    }
  }

  const clearCacheData = () => {
    BrowserStorage.clearTempData()
    alert('Cache cleared')
    loadStorageStats()
  }

  const downloadPrivacyReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      systemInfo,
      storageStats,
      privacyStatus,
      version: '1.0.0-privacy',
      type: 'Privacy System Diagnostics'
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `privacy-system-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

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
        }}>Privacy System Administration</h1>
        
        {/* Privacy System Status */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1rem'
            }}>ZK Circuit Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '50%',
                backgroundColor: privacyStatus?.circuitsLoaded ? '#10b981' : '#ef4444'
              }} />
              <span style={{ color: privacyStatus?.circuitsLoaded ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>
                {privacyStatus?.circuitsLoaded ? 'Circuits Loaded' : 'Circuits Not Ready'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              ZK-SNARKs operational for private transactions
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1rem'
            }}>Anonymity Pool</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }} />
              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>
                {privacyStatus?.anonymityPoolSize?.toLocaleString()} Users
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Active participants in privacy pool
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '1rem'
            }}>Privacy Level</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }} />
              <span style={{ color: '#10b981', fontSize: '0.875rem' }}>
                {privacyStatus?.privacyLevel || 'HIGH'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Current system privacy rating
            </p>
          </div>
        </div>

        {/* Privacy Metrics */}
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
            marginBottom: '1.5rem'
          }}>Privacy System Metrics</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#60a5fa',
                marginBottom: '1rem'
              }}>Zero-Knowledge Proofs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Proofs Generated:</span>
                  <span style={{ color: 'white' }}>{privacyStatus?.zkProofsGenerated || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Merkle Tree Depth:</span>
                  <span style={{ color: 'white' }}>20 levels</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Hash Function:</span>
                  <span style={{ color: 'white' }}>Poseidon</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#a855f7',
                marginBottom: '1rem'
              }}>Privacy Protection</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Encryption:</span>
                  <span style={{ color: 'white' }}>AES-256-GCM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Key Derivation:</span>
                  <span style={{ color: 'white' }}>PBKDF2</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Mixing Rounds:</span>
                  <span style={{ color: 'white' }}>Active</span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#10b981',
                marginBottom: '1rem'
              }}>Storage Security</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Local Storage:</span>
                  <span style={{ color: 'white' }}>{systemInfo?.localStorage ? 'Encrypted' : 'Unavailable'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Web Crypto:</span>
                  <span style={{ color: 'white' }}>{systemInfo?.webCrypto ? 'Available' : 'Unavailable'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#d1d5db' }}>Data Size:</span>
                  <span style={{ color: 'white' }}>{storageStats ? formatBytes(storageStats.totalSize) : 'Loading...'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
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
            marginBottom: '1.5rem'
          }}>Privacy System Information</h2>
          
          {systemInfo && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#d1d5db',
                  marginBottom: '0.75rem'
                }}>Client Environment</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontWeight: '500', color: '#9ca3af' }}>Platform:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>{systemInfo.platform}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: '#9ca3af' }}>Language:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>{systemInfo.language}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: '#9ca3af' }}>Online Status:</span>
                    <span style={{ color: systemInfo.onLine ? '#10b981' : '#ef4444', marginLeft: '0.5rem' }}>
                      {systemInfo.onLine ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#d1d5db',
                  marginBottom: '0.75rem'
                }}>Privacy Application</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontWeight: '500', color: '#9ca3af' }}>Version:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>1.0.0 Privacy MVP</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: '#9ca3af' }}>Mode:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>Development</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '500', color: '#9ca3af' }}>Started:</span>
                    <span style={{ color: 'white', marginLeft: '0.5rem' }}>
                      {new Date(systemInfo.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Administration Actions */}
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
            marginBottom: '1.5rem'
          }}>Privacy Administration Actions</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <button
              onClick={loadStorageStats}
              style={{
                backgroundColor: '#60a5fa',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3b82f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#60a5fa'}
            >
              Refresh Privacy Stats
            </button>
            
            <button
              onClick={checkPrivacyStatus}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              Check Privacy Status
            </button>
            
            <button
              onClick={clearCacheData}
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
            >
              Clear Cache Data
            </button>
            
            <button
              onClick={downloadPrivacyReport}
              style={{
                backgroundColor: '#a855f7',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#9333ea'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#a855f7'}
            >
              Download Report
            </button>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#ef4444',
              marginBottom: '1rem'
            }}>🔒 Secure Data Management</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={clearPrivateData}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Securely Erase Private Data
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              This will permanently and securely delete all encrypted wallet data, private keys, and transaction history.
            </p>
          </div>
        </div>

        {/* Privacy Development Tools */}
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
            marginBottom: '1rem'
          }}>Privacy Development Tools</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <h3 style={{ fontWeight: '600', color: '#d1d5db', marginBottom: '0.5rem' }}>
                ZK Circuit Commands
              </h3>
              <div style={{
                backgroundColor: '#1f2937',
                color: '#10b981',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem'
              }}>
                <p># Build privacy circuits</p>
                <p>pnpm run build:circuits</p>
                <p></p>
                <p># Generate proving keys</p>
                <p>pnpm run setup:keys</p>
                <p></p>
                <p># Test zero-knowledge proofs</p>
                <p>pnpm run test:circuits</p>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontWeight: '600', color: '#d1d5db', marginBottom: '0.5rem' }}>
                Privacy API Endpoints
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem' }}>
                <p>
                  <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    POST /api/shield
                  </code>
                  <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>- Shield funds privately</span>
                </p>
                <p>
                  <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    POST /api/transfer/private
                  </code>
                  <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>- Anonymous transfer</span>
                </p>
                <p>
                  <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    POST /api/unshield
                  </code>
                  <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>- Unshield to public</span>
                </p>
                <p>
                  <code style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    GET /api/privacy/status
                  </code>
                  <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>- Privacy system health</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}