const snarkjs = require('snarkjs')
import * as fs from 'fs'
import * as path from 'path'

export interface ProofData {
  proof: {
    pi_a: [string, string]
    pi_b: [[string, string], [string, string]]
    pi_c: [string, string]
  }
  publicSignals: string[]
}

export interface CircuitInputs {
  [key: string]: string | string[] | string[][]
}

export class ZKProver {
  private readonly keysDir: string
  
  constructor(keysDir?: string) {
    this.keysDir = keysDir || path.join(__dirname, '../keys')
  }

  /**
   * Generate a zero-knowledge proof for a circuit
   */
  async generateProof(
    circuitName: string,
    inputs: CircuitInputs
  ): Promise<ProofData> {
    try {
      const wasmPath = path.join(__dirname, '../circuits/build', `${circuitName}.wasm`)
      const zkeyPath = path.join(this.keysDir, `${circuitName}.zkey`)
      
      if (!fs.existsSync(wasmPath)) {
        throw new Error(`WASM file not found: ${wasmPath}`)
      }
      
      if (!fs.existsSync(zkeyPath)) {
        throw new Error(`Proving key not found: ${zkeyPath}`)
      }
      
      console.log(`Generating proof for ${circuitName}...`)
      
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        inputs,
        wasmPath,
        zkeyPath
      )
      
      // Format proof for Solidity verifier
      const formattedProof = {
        pi_a: [proof.pi_a[0] || "0", proof.pi_a[1] || "0"] as [string, string],
        pi_b: [[proof.pi_b[0][1] || "0", proof.pi_b[0][0] || "0"], [proof.pi_b[1][1] || "0", proof.pi_b[1][0] || "0"]] as [[string, string], [string, string]],
        pi_c: [proof.pi_c[0] || "0", proof.pi_c[1] || "0"] as [string, string]
      }
      
      return {
        proof: formattedProof,
        publicSignals: publicSignals.map((s: any) => s.toString())
      }
    } catch (error) {
      console.error(`Failed to generate proof for ${circuitName}:`, error)
      throw error
    }
  }

  /**
   * Verify a zero-knowledge proof
   */
  async verifyProof(
    circuitName: string,
    proof: ProofData['proof'],
    publicSignals: string[]
  ): Promise<boolean> {
    try {
      const vkeyPath = path.join(this.keysDir, `${circuitName}_vkey.json`)
      
      if (!fs.existsSync(vkeyPath)) {
        throw new Error(`Verification key not found: ${vkeyPath}`)
      }
      
      const vKey = JSON.parse(fs.readFileSync(vkeyPath, 'utf8'))
      
      const result = await snarkjs.groth16.verify(vKey, publicSignals, proof)
      
      console.log(`Proof verification for ${circuitName}: ${result ? 'VALID' : 'INVALID'}`)
      
      return result
    } catch (error) {
      console.error(`Failed to verify proof for ${circuitName}:`, error)
      throw error
    }
  }

  /**
   * Calculate witness for a circuit (useful for debugging)
   */
  async calculateWitness(
    circuitName: string,
    inputs: CircuitInputs
  ): Promise<any> {
    try {
      const wasmPath = path.join(__dirname, '../circuits/build', `${circuitName}.wasm`)
      
      if (!fs.existsSync(wasmPath)) {
        throw new Error(`WASM file not found: ${wasmPath}`)
      }
      
      const witnessCalculator = await snarkjs.wtns.calculate(inputs, wasmPath)
      
      return witnessCalculator
    } catch (error) {
      console.error(`Failed to calculate witness for ${circuitName}:`, error)
      throw error
    }
  }
}

export { snarkjs }