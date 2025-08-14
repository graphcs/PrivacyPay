export interface PrivacyNote {
  value: string
  secret: string
  randomness: string
  commitment: string
  nullifier?: string
  index?: number
}

export interface ShieldedAccount {
  viewKey: string
  auditKey: string
  spendingKey: string
  address: string
}

export interface Transaction {
  hash: string
  blockNumber: number
  timestamp: string
  type: 'deposit' | 'shield' | 'transfer' | 'unshield'
  amount: string
  fee?: string
  memo?: string
  nullifiers?: string[]
  commitments?: string[]
  proof?: ZKProof
}

export interface ZKProof {
  pi_a: [string, string]
  pi_b: [[string, string], [string, string]]
  pi_c: [string, string]
}

export interface MerkleProof {
  pathElements: string[]
  pathIndices: number[]
  root: string
  leaf: string
}

export interface ChainConfig {
  chainId: number
  name: string
  rpcUrl: string
  contractAddress: string
  blockExplorer: string
  isTestnet: boolean
}

export interface ComplianceReport {
  accountId: string
  keyType: 'view' | 'audit'
  generatedAt: string
  timeRange: {
    from: string
    to: string
  }
  transactions: Transaction[]
  summary: {
    totalTransactions: number
    totalVolume: string
    uniqueCounterparties: number
    riskScore: 'LOW' | 'MEDIUM' | 'HIGH'
  }
  riskAnalysis: {
    highRiskTransactions: Transaction[]
    suspiciousPatterns: string[]
    recommendations: string[]
  }
}

export interface ViewKeyAccess {
  viewKey: string
  permissions: {
    canViewTransactions: boolean
    canViewBalances: boolean
    canExportHistory: boolean
  }
}

export interface AuditKeyAccess {
  auditKey: string
  permissions: {
    canViewAllTransactions: boolean
    canAnalyzePatterns: boolean
    canGenerateReports: boolean
    canAccessMetadata: boolean
  }
}

export interface EncryptedStorage {
  encryptedData: string
  nonce: string
  timestamp: number
}

export interface WalletState {
  accounts: ShieldedAccount[]
  notes: PrivacyNote[]
  transactions: Transaction[]
  merkleTree: {
    root: string
    leaves: string[]
    depth: number
  }
  chainConfigs: ChainConfig[]
  selectedChain: number
}