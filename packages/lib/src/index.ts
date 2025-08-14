// Types
export * from './types'

// Cryptographic utilities
export * from './crypto/keys'

// Merkle tree implementation
export { PrivacyMerkleTree } from './merkle/tree'

// Ethereum chain integration
export { EthereumClient, SUPPORTED_CHAINS } from './chain/ethereum'

// Browser storage
export { BrowserStorage } from './storage/browser'

// Compliance and selective disclosure
export { SelectiveDisclosure } from './compliance/disclosure'

// Constants
export const FIELD_SIZE = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617')
export const MERKLE_TREE_DEPTH = 20
export const MAX_NOTES_PER_TRANSACTION = 16

// Utility functions
export function formatAmount(wei: string, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals)
  const quotient = BigInt(wei) / divisor
  const remainder = BigInt(wei) % divisor
  
  if (remainder === BigInt(0)) {
    return quotient.toString()
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0').replace(/0+$/, '')
  return `${quotient}.${remainderStr}`
}

export function parseAmount(amount: string, decimals: number = 18): string {
  const [whole, fraction = ''] = amount.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  const wei = BigInt(whole + paddedFraction)
  return wei.toString()
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!validateAddress(address)) {
    return address
  }
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`
}

export function shortenHash(hash: string, chars: number = 6): string {
  if (!hash.startsWith('0x') || hash.length < 10) {
    return hash
  }
  return `${hash.slice(0, 2 + chars)}...${hash.slice(-chars)}`
}