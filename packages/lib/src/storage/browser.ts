import { encryptData, decryptData } from '../crypto/keys'
import { WalletState, EncryptedStorage } from '../types'

const STORAGE_KEY = 'privacy-payments-wallet'
const STORAGE_VERSION = '1.0.0'

export class BrowserStorage {
  /**
   * Save encrypted wallet state to localStorage
   */
  static async saveWalletState(state: WalletState, password: string): Promise<void> {
    try {
      const stateJson = JSON.stringify({
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        data: state
      })
      
      // Use password to derive encryption key
      const encryptionKey = await this.deriveKeyFromPassword(password)
      const encrypted = encryptData(stateJson, encryptionKey)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted))
    } catch (error) {
      console.error('Failed to save wallet state:', error)
      throw new Error('Failed to save wallet state')
    }
  }

  /**
   * Load and decrypt wallet state from localStorage
   */
  static async loadWalletState(password: string): Promise<WalletState | null> {
    try {
      const encryptedJson = localStorage.getItem(STORAGE_KEY)
      if (!encryptedJson) {
        return null
      }
      
      const encrypted: EncryptedStorage = JSON.parse(encryptedJson)
      const encryptionKey = await this.deriveKeyFromPassword(password)
      
      const decryptedJson = decryptData(encrypted, encryptionKey)
      const walletData = JSON.parse(decryptedJson)
      
      // Check version compatibility
      if (walletData.version !== STORAGE_VERSION) {
        console.warn('Wallet data version mismatch:', walletData.version, 'vs', STORAGE_VERSION)
        // TODO: Handle migration if needed
      }
      
      return walletData.data as WalletState
    } catch (error) {
      console.error('Failed to load wallet state:', error)
      throw new Error('Failed to decrypt wallet state - check password')
    }
  }

  /**
   * Check if wallet state exists in storage
   */
  static hasWalletState(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null
  }

  /**
   * Clear wallet state from storage
   */
  static clearWalletState(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Export wallet state as encrypted backup
   */
  static async exportWallet(password: string): Promise<string> {
    const encryptedJson = localStorage.getItem(STORAGE_KEY)
    if (!encryptedJson) {
      throw new Error('No wallet state found')
    }
    
    // Re-encrypt with export password for security
    const walletState = await this.loadWalletState(password)
    if (!walletState) {
      throw new Error('Failed to load wallet state')
    }
    
    const exportKey = await this.deriveKeyFromPassword(password + '_export')
    const exportData = {
      version: STORAGE_VERSION,
      exported: Date.now(),
      data: walletState
    }
    
    const encrypted = encryptData(JSON.stringify(exportData), exportKey)
    return JSON.stringify(encrypted)
  }

  /**
   * Import wallet state from encrypted backup
   */
  static async importWallet(backupData: string, password: string): Promise<void> {
    try {
      const encrypted: EncryptedStorage = JSON.parse(backupData)
      const importKey = await this.deriveKeyFromPassword(password + '_export')
      
      const decryptedJson = decryptData(encrypted, importKey)
      const importData = JSON.parse(decryptedJson)
      
      if (!importData.data) {
        throw new Error('Invalid backup format')
      }
      
      // Save imported state with new password
      await this.saveWalletState(importData.data, password)
    } catch (error) {
      console.error('Failed to import wallet:', error)
      throw new Error('Failed to import wallet - check backup file and password')
    }
  }

  /**
   * Derive encryption key from password using Web Crypto API
   */
  private static async deriveKeyFromPassword(password: string): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto) {
      // Fallback for non-browser environments
      const crypto = require('crypto')
      const hash = crypto.createHash('sha256')
      hash.update(password + 'privacy-payments-salt')
      return hash.digest('hex')
    }
    
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password + 'privacy-payments-salt')
    
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveBits']
    )
    
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode('privacy-payments-salt-2024'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    )
    
    return Array.from(new Uint8Array(derivedBits))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  /**
   * Save temporary data (not encrypted)
   */
  static saveTempData(key: string, data: any): void {
    const fullKey = `privacy-payments-temp-${key}`
    localStorage.setItem(fullKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
  }

  /**
   * Load temporary data
   */
  static loadTempData(key: string, maxAge: number = 3600000): any | null {
    const fullKey = `privacy-payments-temp-${key}`
    const tempData = localStorage.getItem(fullKey)
    
    if (!tempData) {
      return null
    }
    
    try {
      const parsed = JSON.parse(tempData)
      const age = Date.now() - parsed.timestamp
      
      if (age > maxAge) {
        localStorage.removeItem(fullKey)
        return null
      }
      
      return parsed.data
    } catch {
      localStorage.removeItem(fullKey)
      return null
    }
  }

  /**
   * Clear all temporary data
   */
  static clearTempData(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('privacy-payments-temp-')
    )
    
    keys.forEach(key => localStorage.removeItem(key))
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats(): {
    totalSize: number
    walletSize: number
    tempSize: number
    available: boolean
  } {
    let totalSize = 0
    let walletSize = 0
    let tempSize = 0
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key) continue
        
        const value = localStorage.getItem(key) || ''
        const size = key.length + value.length
        
        totalSize += size
        
        if (key === STORAGE_KEY) {
          walletSize = size
        } else if (key.startsWith('privacy-payments-temp-')) {
          tempSize += size
        }
      }
      
      return {
        totalSize,
        walletSize,
        tempSize,
        available: true
      }
    } catch {
      return {
        totalSize: 0,
        walletSize: 0,
        tempSize: 0,
        available: false
      }
    }
  }
}