'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ComingSoonModal from '../../components/ComingSoonModal'

export default function WalletPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const router = useRouter()

  const handleModalClose = () => {
    setIsModalOpen(false)
    // Redirect back to homepage after modal closes
    router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #581c87, #0f172a)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <ComingSoonModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </div>
  )
}