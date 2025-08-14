'use client'

import { useState } from 'react'
import ComingSoonModal from './ComingSoonModal'

export default function OverrideConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.5rem 1rem',
          borderRadius: '0.75rem',
          border: 'none',
          background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 14px 0 rgba(96, 165, 250, 0.39)'
        }}
        onMouseOver={(e) => {
          (e.target as HTMLElement).style.transform = 'translateY(-1px)'
          ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px 0 rgba(96, 165, 250, 0.5)'
        }}
        onMouseOut={(e) => {
          (e.target as HTMLElement).style.transform = 'translateY(0)'
          ;(e.target as HTMLElement).style.boxShadow = '0 4px 14px 0 rgba(96, 165, 250, 0.39)'
        }}
      >
        Connect Wallet
      </button>
      
      <ComingSoonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}