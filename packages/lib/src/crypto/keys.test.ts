import {
  generateShieldedAccount,
  generateRandomness,
  generateNoteSecret,
  createNoteCommitment,
  deriveNullifier,
  validateKey,
  encryptData,
  decryptData
} from './keys'

describe('Key Generation', () => {
  test('should generate valid shielded account', () => {
    const account = generateShieldedAccount()
    
    expect(account.viewKey).toMatch(/^0x[a-f0-9]{64}$/)
    expect(account.auditKey).toMatch(/^0x[a-f0-9]{64}$/)
    expect(account.spendingKey).toMatch(/^0x[a-f0-9]{64}$/)
    expect(account.address).toMatch(/^0x[a-f0-9]{40}$/)
    
    // All keys should be different
    expect(account.viewKey).not.toBe(account.auditKey)
    expect(account.viewKey).not.toBe(account.spendingKey)
    expect(account.auditKey).not.toBe(account.spendingKey)
  })

  test('should generate different accounts', () => {
    const account1 = generateShieldedAccount()
    const account2 = generateShieldedAccount()
    
    expect(account1.address).not.toBe(account2.address)
    expect(account1.viewKey).not.toBe(account2.viewKey)
  })

  test('should generate valid randomness', () => {
    const randomness = generateRandomness()
    expect(randomness).toMatch(/^0x[a-f0-9]{64}$/)
    
    // Should be different each time
    const randomness2 = generateRandomness()
    expect(randomness).not.toBe(randomness2)
  })

  test('should generate valid note secret', () => {
    const secret = generateNoteSecret()
    expect(secret).toMatch(/^0x[a-f0-9]{64}$/)
  })
})

describe('Note Operations', () => {
  test('should create consistent note commitments', () => {
    const value = '1000000000000000000' // 1 ETH in wei
    const secret = generateNoteSecret()
    const randomness = generateRandomness()
    
    const commitment1 = createNoteCommitment(value, secret, randomness)
    const commitment2 = createNoteCommitment(value, secret, randomness)
    
    expect(commitment1).toBe(commitment2)
    expect(commitment1).toMatch(/^0x[a-f0-9]{64}$/)
  })

  test('should create different commitments for different inputs', () => {
    const value = '1000000000000000000'
    const secret1 = generateNoteSecret()
    const secret2 = generateNoteSecret()
    const randomness = generateRandomness()
    
    const commitment1 = createNoteCommitment(value, secret1, randomness)
    const commitment2 = createNoteCommitment(value, secret2, randomness)
    
    expect(commitment1).not.toBe(commitment2)
  })

  test('should derive consistent nullifiers', () => {
    const noteCommitment = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    const spendingKey = '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'
    
    const nullifier1 = deriveNullifier(noteCommitment, spendingKey)
    const nullifier2 = deriveNullifier(noteCommitment, spendingKey)
    
    expect(nullifier1).toBe(nullifier2)
    expect(nullifier1).toMatch(/^0x[a-f0-9]{64}$/)
  })
})

describe('Key Validation', () => {
  test('should validate correct key formats', () => {
    const validKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    
    expect(validateKey(validKey, 'view')).toBe(true)
    expect(validateKey(validKey, 'audit')).toBe(true)
    expect(validateKey(validKey, 'spending')).toBe(true)
  })

  test('should reject invalid key formats', () => {
    expect(validateKey('invalid', 'view')).toBe(false)
    expect(validateKey('0x123', 'view')).toBe(false)
    expect(validateKey('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'view')).toBe(false)
    expect(validateKey('0xgg34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'view')).toBe(false)
  })
})

describe('Encryption/Decryption', () => {
  test('should encrypt and decrypt data correctly', () => {
    const data = 'test secret data'
    const key = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    
    const encrypted = encryptData(data, key)
    const decrypted = decryptData(encrypted, key)
    
    expect(decrypted).toBe(data)
    expect(encrypted.encryptedData).toBeDefined()
    expect(encrypted.nonce).toBeDefined()
    expect(encrypted.timestamp).toBeGreaterThan(0)
  })

  test('should fail decryption with wrong key', () => {
    const data = 'test secret data'
    const key1 = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    const key2 = '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'
    
    const encrypted = encryptData(data, key1)
    
    expect(() => {
      decryptData(encrypted, key2)
    }).toThrow()
  })

  test('should create different encrypted outputs for same data', () => {
    const data = 'test secret data'
    const key = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    
    const encrypted1 = encryptData(data, key)
    const encrypted2 = encryptData(data, key)
    
    // Should be different due to random nonces
    expect(encrypted1.encryptedData).not.toBe(encrypted2.encryptedData)
    expect(encrypted1.nonce).not.toBe(encrypted2.nonce)
    
    // But both should decrypt correctly
    expect(decryptData(encrypted1, key)).toBe(data)
    expect(decryptData(encrypted2, key)).toBe(data)
  })
})