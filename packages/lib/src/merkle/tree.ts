import { MerkleTree } from 'merkletreejs'
import { keccak256 } from 'js-sha3'
import { MerkleProof } from '../types'

export class PrivacyMerkleTree {
  private tree: MerkleTree
  private leaves: string[]
  private readonly depth: number

  constructor(depth: number = 20) {
    this.depth = depth
    this.leaves = []
    this.tree = new MerkleTree([], this.hashFunction, {
      hashLeaves: false,
      sortPairs: false,
      fillDefaultHash: '0x' + '0'.repeat(64)
    })
  }

  /**
   * Hash function for Merkle tree (using Keccak256)
   */
  private hashFunction(data: Buffer | string): Buffer {
    if (typeof data === 'string') {
      data = Buffer.from(data.replace('0x', ''), 'hex')
    }
    return Buffer.from(keccak256(data), 'hex')
  }

  /**
   * Add a new leaf (note commitment) to the tree
   */
  addLeaf(commitment: string): number {
    if (!commitment.startsWith('0x')) {
      commitment = '0x' + commitment
    }
    
    this.leaves.push(commitment)
    
    // Rebuild tree with new leaves
    const leafBuffers = this.leaves.map(leaf => 
      Buffer.from(leaf.replace('0x', ''), 'hex')
    )
    
    this.tree = new MerkleTree(leafBuffers, this.hashFunction, {
      hashLeaves: false,
      sortPairs: false,
      fillDefaultHash: Buffer.from('0'.repeat(64), 'hex')
    })
    
    return this.leaves.length - 1
  }

  /**
   * Get Merkle proof for a leaf at given index
   */
  getProof(index: number): MerkleProof {
    if (index >= this.leaves.length || index < 0) {
      throw new Error('Invalid leaf index')
    }
    
    const leaf = Buffer.from(this.leaves[index].replace('0x', ''), 'hex')
    const proof = this.tree.getProof(leaf, index)
    
    const pathElements = proof.map(p => '0x' + p.data.toString('hex'))
    const pathIndices = proof.map(p => p.position === 'right' ? 1 : 0)
    
    // Pad to required depth
    while (pathElements.length < this.depth) {
      pathElements.push('0x' + '0'.repeat(64))
      pathIndices.push(0)
    }
    
    return {
      pathElements: pathElements.slice(0, this.depth),
      pathIndices: pathIndices.slice(0, this.depth),
      root: this.getRoot(),
      leaf: this.leaves[index]
    }
  }

  /**
   * Verify a Merkle proof
   */
  verifyProof(proof: MerkleProof): boolean {
    try {
      const leafBuffer = Buffer.from(proof.leaf.replace('0x', ''), 'hex')
      const proofBuffers = proof.pathElements.map(elem => 
        Buffer.from(elem.replace('0x', ''), 'hex')
      )
      
      const positions = proof.pathIndices.map(idx => idx === 1 ? 'right' : 'left')
      const proofObjects = proofBuffers.map((data, i) => ({
        data,
        position: positions[i] as 'left' | 'right'
      }))
      
      const rootBuffer = Buffer.from(proof.root.replace('0x', ''), 'hex')
      
      return this.tree.verify(proofObjects, leafBuffer, rootBuffer)
    } catch (error) {
      console.error('Error verifying Merkle proof:', error)
      return false
    }
  }

  /**
   * Get current root hash
   */
  getRoot(): string {
    if (this.leaves.length === 0) {
      // Return empty tree root
      return '0x' + '0'.repeat(64)
    }
    
    const rootBuffer = this.tree.getRoot()
    return '0x' + rootBuffer.toString('hex')
  }

  /**
   * Get all leaves
   */
  getLeaves(): string[] {
    return [...this.leaves]
  }

  /**
   * Get leaf count
   */
  getLeafCount(): number {
    return this.leaves.length
  }

  /**
   * Find index of a specific leaf
   */
  findLeafIndex(commitment: string): number {
    if (!commitment.startsWith('0x')) {
      commitment = '0x' + commitment
    }
    
    return this.leaves.findIndex(leaf => leaf.toLowerCase() === commitment.toLowerCase())
  }

  /**
   * Check if a leaf exists in the tree
   */
  hasLeaf(commitment: string): boolean {
    return this.findLeafIndex(commitment) !== -1
  }

  /**
   * Update tree from a list of commitments (for syncing with blockchain)
   */
  updateFromCommitments(commitments: string[]): void {
    this.leaves = commitments.map(c => c.startsWith('0x') ? c : '0x' + c)
    
    if (this.leaves.length === 0) {
      this.tree = new MerkleTree([], this.hashFunction, {
        hashLeaves: false,
        sortPairs: false,
        fillDefaultHash: Buffer.from('0'.repeat(64), 'hex')
      })
      return
    }
    
    const leafBuffers = this.leaves.map(leaf => 
      Buffer.from(leaf.replace('0x', ''), 'hex')
    )
    
    this.tree = new MerkleTree(leafBuffers, this.hashFunction, {
      hashLeaves: false,
      sortPairs: false,
      fillDefaultHash: Buffer.from('0'.repeat(64), 'hex')
    })
  }

  /**
   * Get tree statistics
   */
  getStats() {
    return {
      depth: this.depth,
      leafCount: this.leaves.length,
      root: this.getRoot(),
      maxCapacity: Math.pow(2, this.depth)
    }
  }
}