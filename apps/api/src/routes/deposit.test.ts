import request from 'supertest'
import express from 'express'
import { depositRoutes } from './deposit'

const app = express()
app.use(express.json())
app.use('/api/deposit', depositRoutes)

describe('Deposit API', () => {
  describe('POST /api/deposit', () => {
    test('should accept valid deposit request', async () => {
      const depositData = {
        amount: '1000000000000000000', // 1 ETH in wei
        recipientAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
      }

      const response = await request(app)
        .post('/api/deposit')
        .send(depositData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.transactionHash).toBeDefined()
      expect(response.body.message).toContain('successfully')
    })

    test('should reject invalid amount', async () => {
      const depositData = {
        amount: '', // Invalid empty amount
        recipientAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
      }

      const response = await request(app)
        .post('/api/deposit')
        .send(depositData)
        .expect(400)

      expect(response.body.errors).toBeDefined()
    })

    test('should reject invalid recipient address', async () => {
      const depositData = {
        amount: '1000000000000000000',
        recipientAddress: 'invalid-address',
        chainId: 1,
      }

      const response = await request(app)
        .post('/api/deposit')
        .send(depositData)
        .expect(400)

      expect(response.body.errors).toBeDefined()
    })

    test('should reject invalid chain ID', async () => {
      const depositData = {
        amount: '1000000000000000000',
        recipientAddress: '0x1234567890123456789012345678901234567890',
        chainId: 0, // Invalid chain ID
      }

      const response = await request(app)
        .post('/api/deposit')
        .send(depositData)
        .expect(400)

      expect(response.body.errors).toBeDefined()
    })

    test('should accept optional token address', async () => {
      const depositData = {
        amount: '1000000000000000000',
        recipientAddress: '0x1234567890123456789012345678901234567890',
        chainId: 1,
        tokenAddress: '0xA0b86a33E6441e3cf58e3DE32321a7dE7c5b52c5', // Example ERC-20
      }

      const response = await request(app)
        .post('/api/deposit')
        .send(depositData)
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })
})