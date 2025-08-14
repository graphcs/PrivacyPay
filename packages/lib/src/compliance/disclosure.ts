import { keccak256 } from 'js-sha3'
import { canDecryptWithViewKey, validateKey } from '../crypto/keys'
import type { 
  Transaction, 
  ComplianceReport, 
  ViewKeyAccess, 
  AuditKeyAccess,
  PrivacyNote 
} from '../types'

export class SelectiveDisclosure {
  /**
   * Decrypt transaction history using a view key
   */
  static decryptWithViewKey(
    viewKey: string,
    transactions: Transaction[],
    notes: PrivacyNote[]
  ): {
    accessibleTransactions: Transaction[]
    balance: string
    permissions: ViewKeyAccess
  } {
    if (!validateKey(viewKey, 'view')) {
      throw new Error('Invalid view key format')
    }

    const accessibleTransactions: Transaction[] = []
    let totalBalance = BigInt(0)

    // Filter transactions that can be decrypted with this view key
    for (const tx of transactions) {
      if (this.canAccessTransaction(viewKey, tx, 'view')) {
        accessibleTransactions.push({
          ...tx,
          // Decrypt memo if present
          memo: tx.memo ? this.decryptMemo(viewKey, tx.memo) : undefined
        })
      }
    }

    // Calculate accessible balance from notes
    for (const note of notes) {
      if (canDecryptWithViewKey(viewKey, note.commitment)) {
        totalBalance += BigInt(note.value)
      }
    }

    const permissions: ViewKeyAccess = {
      viewKey: viewKey.slice(0, 10) + '...',
      permissions: {
        canViewTransactions: true,
        canViewBalances: true,
        canExportHistory: true
      }
    }

    return {
      accessibleTransactions,
      balance: totalBalance.toString(),
      permissions
    }
  }

  /**
   * Generate comprehensive audit report using audit key
   */
  static generateAuditReport(
    auditKey: string,
    transactions: Transaction[],
    notes: PrivacyNote[],
    timeRange?: { from: string; to: string }
  ): ComplianceReport {
    if (!validateKey(auditKey, 'audit')) {
      throw new Error('Invalid audit key format')
    }

    // Filter transactions by time range if specified
    let filteredTransactions = transactions
    if (timeRange) {
      const fromTime = new Date(timeRange.from).getTime()
      const toTime = new Date(timeRange.to).getTime()
      
      filteredTransactions = transactions.filter(tx => {
        const txTime = new Date(tx.timestamp).getTime()
        return txTime >= fromTime && txTime <= toTime
      })
    }

    // Analyze transaction patterns
    const riskAnalysis = this.analyzeTransactionRisk(filteredTransactions)
    const summary = this.generateSummary(filteredTransactions)

    const report: ComplianceReport = {
      accountId: this.deriveAccountId(auditKey),
      keyType: 'audit',
      generatedAt: new Date().toISOString(),
      timeRange: timeRange || {
        from: new Date(0).toISOString(),
        to: new Date().toISOString()
      },
      transactions: filteredTransactions,
      summary,
      riskAnalysis
    }

    return report
  }

  /**
   * Check if a transaction can be accessed with a specific key
   */
  private static canAccessTransaction(
    key: string,
    transaction: Transaction,
    keyType: 'view' | 'audit'
  ): boolean {
    if (keyType === 'audit') {
      // Audit keys can access all transactions
      return true
    }

    // View keys can only access related transactions
    // In a real implementation, this would check if the transaction
    // involves notes that can be decrypted with the view key
    
    // For demo purposes, we'll use a simple hash-based check
    const accessHash = keccak256(Buffer.concat([
      Buffer.from(key.replace('0x', ''), 'hex'),
      Buffer.from(transaction.hash.replace('0x', ''), 'hex')
    ]))
    
    // Simple heuristic - in practice, use proper cryptographic checks
    return parseInt(accessHash.slice(-1), 16) % 3 === 0
  }

  /**
   * Decrypt encrypted memo using key
   */
  private static decryptMemo(key: string, encryptedMemo: string): string {
    // In a real implementation, this would use proper encryption/decryption
    // For demo purposes, return a mock decrypted memo
    return `Decrypted memo for ${key.slice(0, 10)}...`
  }

  /**
   * Analyze transaction patterns for risk assessment
   */
  private static analyzeTransactionRisk(transactions: Transaction[]) {
    const highRiskTransactions: Transaction[] = []
    const suspiciousPatterns: string[] = []
    const recommendations: string[] = []

    // Volume analysis
    const totalVolume = transactions.reduce((sum, tx) => {
      return sum + BigInt(tx.amount || '0')
    }, BigInt(0))

    const avgTransactionValue = transactions.length > 0 
      ? totalVolume / BigInt(transactions.length)
      : BigInt(0)

    // Flag high-value transactions
    const highValueThreshold = avgTransactionValue * BigInt(10)
    for (const tx of transactions) {
      if (BigInt(tx.amount || '0') > highValueThreshold) {
        highRiskTransactions.push(tx)
        suspiciousPatterns.push(`High-value transaction: ${tx.hash}`)
      }
    }

    // Frequency analysis
    const timeGroups = this.groupTransactionsByTime(transactions)
    for (const [timeWindow, txs] of Object.entries(timeGroups)) {
      if (txs.length > 10) { // More than 10 transactions in a short period
        suspiciousPatterns.push(`High frequency trading in ${timeWindow}`)
      }
    }

    // Generate recommendations
    if (highRiskTransactions.length > 0) {
      recommendations.push('Review high-value transactions for legitimacy')
    }
    if (suspiciousPatterns.length > 5) {
      recommendations.push('Consider enhanced due diligence procedures')
    }
    if (transactions.length === 0) {
      recommendations.push('No transactions found - verify account activity')
    }

    return {
      highRiskTransactions,
      suspiciousPatterns,
      recommendations
    }
  }

  /**
   * Generate transaction summary statistics
   */
  private static generateSummary(transactions: Transaction[]) {
    const totalVolume = transactions.reduce((sum, tx) => {
      return sum + BigInt(tx.amount || '0')
    }, BigInt(0))

    // Count unique counterparties (simplified)
    const counterparties = new Set<string>()
    transactions.forEach(tx => {
      if (tx.commitments) {
        tx.commitments.forEach(c => counterparties.add(c.slice(0, 10)))
      }
    })

    // Risk scoring
    let riskScore: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
    if (transactions.length > 100 || totalVolume > BigInt('100000000000000000000')) {
      riskScore = 'MEDIUM'
    }
    if (transactions.length > 1000 || totalVolume > BigInt('1000000000000000000000')) {
      riskScore = 'HIGH'
    }

    return {
      totalTransactions: transactions.length,
      totalVolume: totalVolume.toString(),
      uniqueCounterparties: counterparties.size,
      riskScore
    }
  }

  /**
   * Group transactions by time windows for frequency analysis
   */
  private static groupTransactionsByTime(transactions: Transaction[]): Record<string, Transaction[]> {
    const groups: Record<string, Transaction[]> = {}
    
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp)
      const hourKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
      
      if (!groups[hourKey]) {
        groups[hourKey] = []
      }
      groups[hourKey].push(tx)
    })
    
    return groups
  }

  /**
   * Derive account ID from audit key for report identification
   */
  private static deriveAccountId(auditKey: string): string {
    const hash = keccak256(Buffer.from(auditKey.replace('0x', ''), 'hex'))
    return `account-${hash.slice(0, 16)}`
  }

  /**
   * Validate disclosure request permissions
   */
  static validateDisclosureRequest(
    keyType: 'view' | 'audit',
    requestedData: string[],
    timeRange?: { from: string; to: string }
  ): { valid: boolean; permissions: string[]; restrictions: string[] } {
    const permissions: string[] = []
    const restrictions: string[] = []

    if (keyType === 'view') {
      permissions.push('View own transaction history')
      permissions.push('View account balances')
      permissions.push('Export transaction records')
      
      restrictions.push('Cannot view other accounts')
      restrictions.push('Cannot analyze transaction patterns')
      restrictions.push('Limited to owned transactions only')
    } else if (keyType === 'audit') {
      permissions.push('View all accessible transactions')
      permissions.push('Generate compliance reports')
      permissions.push('Analyze transaction patterns')
      permissions.push('Risk assessment and scoring')
      
      restrictions.push('Subject to audit access controls')
      restrictions.push('Must maintain audit trail')
      restrictions.push('Limited by regulatory requirements')
    }

    // Validate time range
    if (timeRange) {
      const fromDate = new Date(timeRange.from)
      const toDate = new Date(timeRange.to)
      const maxRange = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
      
      if (toDate.getTime() - fromDate.getTime() > maxRange) {
        restrictions.push('Time range limited to 1 year maximum')
      }
    }

    return {
      valid: true,
      permissions,
      restrictions
    }
  }
}