import { randomBytes } from 'crypto'
import * as nacl from 'tweetnacl'
import * as naclUtil from 'tweetnacl-util'
import { keccak256 } from 'js-sha3'
import { ShieldedAccount, EncryptedStorage } from '../types'

/**
 * Generate a new shielded account with view, audit, and spending keys
 */
export function generateShieldedAccount(): ShieldedAccount {
  // Generate master seed
  const seed = randomBytes(32)
  
  // Derive spending key from seed
  const spendingKey = keccak256(Buffer.concat([seed, Buffer.from('spending', 'utf8')]))
  
  // Derive view key from spending key (allows viewing without spending)
  const viewKey = keccak256(Buffer.concat([Buffer.from(spendingKey, 'hex'), Buffer.from('view', 'utf8')]))
  
  // Derive audit key from seed (allows comprehensive auditing)
  const auditKey = keccak256(Buffer.concat([seed, Buffer.from('audit', 'utf8')]))
  
  // Generate public address from spending key
  const address = generateAddress(spendingKey)
  
  return {
    viewKey: `0x${viewKey}`,
    auditKey: `0x${auditKey}`,
    spendingKey: `0x${spendingKey}`,
    address: `0x${address}`
  }
}

/**
 * Generate public address from spending key
 */
function generateAddress(spendingKey: string): string {
  const publicKey = keccak256(Buffer.concat([
    Buffer.from(spendingKey.replace('0x', ''), 'hex'),
    Buffer.from('public', 'utf8')
  ]))
  
  // Take last 20 bytes for address (similar to Ethereum)
  return publicKey.slice(-40)
}

/**
 * Generate random field element for note randomness
 */
export function generateRandomness(): string {
  const randomBytes32 = randomBytes(32)
  // Ensure it's within the field size (BN254 scalar field)
  const fieldSize = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617')
  let randomBigInt = BigInt('0x' + randomBytes32.toString('hex'))
  randomBigInt = randomBigInt % fieldSize
  return '0x' + randomBigInt.toString(16).padStart(64, '0')
}

/**
 * Generate note secret for creating note commitments
 */
export function generateNoteSecret(): string {
  return generateRandomness()
}

/**
 * Derive nullifier from note commitment and spending key
 */
export function deriveNullifier(noteCommitment: string, spendingKey: string): string {
  const nullifierPreimage = Buffer.concat([
    Buffer.from(noteCommitment.replace('0x', ''), 'hex'),
    Buffer.from(spendingKey.replace('0x', ''), 'hex')
  ])
  
  return '0x' + keccak256(nullifierPreimage)
}

/**
 * Create note commitment from value, secret, and randomness
 */
export function createNoteCommitment(value: string, secret: string, randomness: string): string {
  const commitmentPreimage = Buffer.concat([
    Buffer.from(value.replace('0x', '').padStart(64, '0'), 'hex'),
    Buffer.from(secret.replace('0x', ''), 'hex'),
    Buffer.from(randomness.replace('0x', ''), 'hex')
  ])
  
  return '0x' + keccak256(commitmentPreimage)
}

/**
 * Encrypt data using NaCl secretbox
 */
export function encryptData(data: string, key: string): EncryptedStorage {
  const keyBytes = Buffer.from(key.replace('0x', ''), 'hex').slice(0, 32)
  const nonce = nacl.randomBytes(24)
  const dataBytes = naclUtil.encode(data)
  
  const encrypted = nacl.secretbox(dataBytes, nonce, keyBytes)
  
  return {
    encryptedData: naclUtil.encode(encrypted),
    nonce: naclUtil.encode(nonce),
    timestamp: Date.now()
  }
}

/**
 * Decrypt data using NaCl secretbox
 */
export function decryptData(encryptedStorage: EncryptedStorage, key: string): string {
  const keyBytes = Buffer.from(key.replace('0x', ''), 'hex').slice(0, 32)
  const nonce = naclUtil.decode(encryptedStorage.nonce)
  const encryptedBytes = naclUtil.decode(encryptedStorage.encryptedData)
  
  const decrypted = nacl.secretbox.open(encryptedBytes, nonce, keyBytes)
  
  if (!decrypted) {
    throw new Error('Failed to decrypt data - invalid key or corrupted data')
  }
  
  return naclUtil.decode(decrypted)
}

/**
 * Validate key format
 */
export function validateKey(key: string, keyType: 'view' | 'audit' | 'spending'): boolean {
  if (!key.startsWith('0x') || key.length !== 66) {
    return false
  }
  
  try {
    // Ensure it's valid hex
    BigInt(key)
    return true
  } catch {
    return false
  }
}

/**
 * Check if an address can be decrypted with a view key
 */
export function canDecryptWithViewKey(viewKey: string, noteCommitment: string): boolean {
  // In a real implementation, this would involve more complex cryptographic operations
  // For now, we'll use a simple hash-based check
  const checkHash = keccak256(Buffer.concat([
    Buffer.from(viewKey.replace('0x', ''), 'hex'),
    Buffer.from(noteCommitment.replace('0x', ''), 'hex')
  ]))
  
  // Simple heuristic - in practice, you'd use proper encryption/decryption
  return parseInt(checkHash.slice(-2), 16) % 4 === 0
}