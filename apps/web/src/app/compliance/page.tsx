'use client'

import { useState } from 'react'
import { validateKey, shortenHash } from '@privacy-payments/lib'

export default function PrivacyToolsPage() {
  const [viewKey, setViewKey] = useState('')
  const [auditKey, setAuditKey] = useState('')
  const [activeTab, setActiveTab] = useState<'view' | 'mixing'>('view')
  const [disclosureResult, setDisclosureResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleViewKeyDecryption = async () => {
    if (!validateKey(viewKey, 'view')) {
      alert('Invalid view key format')
      return
    }

    setLoading(true)
    try {
      // Simulate decryption process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock result for demo
      const mockResult = {
        balance: '5.247',
        transactions: [
          {
            type: 'shield',
            amount: '2.5',
            transactionHash: '0x1234...5678',
            blockNumber: 18500123,
            timestamp: new Date().toISOString(),
            note: 'Privacy deposit'
          },
          {
            type: 'transfer',
            amount: '1.0',
            transactionHash: '0xabcd...efgh',
            blockNumber: 18500456,
            timestamp: new Date().toISOString(),
            note: 'Anonymous payment'
          }
        ]
      }
      
      setDisclosureResult(mockResult)
    } catch (error) {
      alert('Error processing view key')
    } finally {
      setLoading(false)
    }
  }

  const handleMixingAnalysis = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockAnalysis = {
        anonymityScore: 8.7,
        mixingRounds: 15,
        poolSize: 2847,
        privacyLevel: 'HIGH',
        recommendations: [
          'Your transactions are well-mixed with high anonymity',
          'Consider waiting for larger pool sizes for maximum privacy',
          'Your anonymity set includes 2,847 similar transactions'
        ]
      }
      
      setDisclosureResult(mockAnalysis)
    } catch (error) {
      alert('Error analyzing mixing patterns')
    } finally {
      setLoading(false)
    }
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
        }}>Privacy Analysis Tools</h1>
        
        {/* Information Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(to bottom right, #60a5fa, #3b82f6)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '0.75rem'
            }}>View Key Decryption</h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              lineHeight: 1.5
            }}>
              Decrypt your own transaction history using your private view key. 
              Only you can access this information - complete privacy by design.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> View your private transaction history
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> Check shielded account balances
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> Verify transaction confirmations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> Export encrypted records
              </div>
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(to bottom right, #a855f7, #9333ea)',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'white',
              marginBottom: '0.75rem'
            }}>Anonymity Analysis</h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              lineHeight: 1.5
            }}>
              Analyze your transaction mixing and anonymity levels. 
              Optimize your privacy with detailed anonymity metrics.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> Measure anonymity set size
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> Track mixing effectiveness
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> Privacy score calculation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>•</span> Anonymity recommendations
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <nav style={{ display: 'flex', gap: '2rem', padding: '0 1.5rem' }}>
              <button
                onClick={() => setActiveTab('view')}
                style={{
                  padding: '1rem 0',
                  borderBottom: activeTab === 'view' ? '2px solid #60a5fa' : '2px solid transparent',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  color: activeTab === 'view' ? '#60a5fa' : '#9ca3af',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                View Key Decryption
              </button>
              <button
                onClick={() => setActiveTab('mixing')}
                style={{
                  padding: '1rem 0',
                  borderBottom: activeTab === 'mixing' ? '2px solid #a855f7' : '2px solid transparent',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  color: activeTab === 'mixing' ? '#a855f7' : '#9ca3af',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
              >
                Anonymity Analysis
              </button>
            </nav>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {activeTab === 'view' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem'
                  }}>Decrypt Your Transaction History</h3>
                  <p style={{
                    color: '#d1d5db',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    Enter your private view key to decrypt and view your shielded transaction history.
                  </p>
                  
                  <div style={{ maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#d1d5db',
                        marginBottom: '0.5rem'
                      }}>
                        Your Private View Key
                      </label>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={viewKey}
                        onChange={(e) => setViewKey(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={handleViewKeyDecryption}
                      disabled={loading || !viewKey}
                      style={{
                        width: '100%',
                        backgroundColor: loading || !viewKey ? '#6b7280' : '#60a5fa',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: loading || !viewKey ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {loading ? 'Decrypting...' : 'Decrypt Transaction History'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mixing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem'
                  }}>Analyze Your Anonymity</h3>
                  <p style={{
                    color: '#d1d5db',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    Get detailed analysis of your transaction mixing and privacy levels.
                  </p>
                  
                  <div style={{ maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#d1d5db',
                        marginBottom: '0.5rem'
                      }}>
                        Shielded Address to Analyze
                      </label>
                      <input
                        type="text"
                        placeholder="0x..."
                        value={auditKey}
                        onChange={(e) => setAuditKey(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '0.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={handleMixingAnalysis}
                      disabled={loading || !auditKey}
                      style={{
                        width: '100%',
                        backgroundColor: loading || !auditKey ? '#6b7280' : '#a855f7',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: loading || !auditKey ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {loading ? 'Analyzing...' : 'Analyze Privacy Level'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Display */}
            {disclosureResult && (
              <div style={{
                marginTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '1rem'
                }}>Analysis Results</h3>

                {disclosureResult.anonymityScore ? (
                  // Anonymity analysis display
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '0.5rem'
                      }}>
                        <h4 style={{ fontWeight: '600', color: '#d1d5db', fontSize: '0.875rem' }}>Anonymity Score</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                          {disclosureResult.anonymityScore}/10
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '0.5rem'
                      }}>
                        <h4 style={{ fontWeight: '600', color: '#d1d5db', fontSize: '0.875rem' }}>Mixing Rounds</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>
                          {disclosureResult.mixingRounds}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '0.5rem'
                      }}>
                        <h4 style={{ fontWeight: '600', color: '#d1d5db', fontSize: '0.875rem' }}>Pool Size</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
                          {disclosureResult.poolSize.toLocaleString()}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '0.5rem'
                      }}>
                        <h4 style={{ fontWeight: '600', color: '#d1d5db', fontSize: '0.875rem' }}>Privacy Level</h4>
                        <p style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: disclosureResult.privacyLevel === 'HIGH' ? '#10b981' : 
                                disclosureResult.privacyLevel === 'MEDIUM' ? '#f59e0b' : '#ef4444'
                        }}>
                          {disclosureResult.privacyLevel}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontWeight: '600', color: 'white', marginBottom: '0.75rem' }}>Privacy Recommendations</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {disclosureResult.recommendations.map((rec: string, index: number) => (
                          <div key={index} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.5rem',
                            padding: '1rem'
                          }}>
                            <p style={{ color: '#d1d5db', fontSize: '0.875rem' }}>{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // View key decryption display
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}>
                      <h4 style={{ fontWeight: '600', color: '#d1d5db', marginBottom: '0.5rem' }}>Shielded Balance</h4>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>
                        {disclosureResult.balance} ETH
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontWeight: '600', color: 'white', marginBottom: '0.75rem' }}>
                        Private Transaction History ({disclosureResult.transactions.length} transactions)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {disclosureResult.transactions.map((tx: any, index: number) => (
                          <div key={index} style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.5rem',
                            padding: '1rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <h5 style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                                  {tx.type.toUpperCase()} - {tx.amount} ETH
                                </h5>
                                <p style={{ fontSize: '0.875rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                                  {shortenHash(tx.transactionHash)}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                  Block {tx.blockNumber} • {new Date(tx.timestamp).toLocaleString()}
                                </p>
                                {tx.note && (
                                  <p style={{ fontSize: '0.875rem', color: '#60a5fa', marginTop: '0.5rem' }}>{tx.note}</p>
                                )}
                              </div>
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                borderRadius: '9999px',
                                backgroundColor: tx.type === 'shield' ? 'rgba(168, 85, 247, 0.2)' :
                                                tx.type === 'transfer' ? 'rgba(16, 185, 129, 0.2)' :
                                                'rgba(249, 115, 22, 0.2)',
                                color: tx.type === 'shield' ? '#a855f7' :
                                       tx.type === 'transfer' ? '#10b981' :
                                       '#f97316'
                              }}>
                                {tx.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div style={{
          marginTop: '2rem',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#93c5fd', marginBottom: '0.5rem' }}>
            🔒 Privacy Guarantee
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#bfdbfe' }}>
            These tools are designed for your personal privacy analysis only. All data remains encrypted and 
            private. Only you can decrypt your transaction history using your private view key. No third parties 
            can access your private transaction data.
          </p>
        </div>
      </div>
    </div>
  )
}