import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { depositRoutes } from './routes/deposit'
import { shieldRoutes } from './routes/shield'
import { transferRoutes } from './routes/transfer'
import { proveRoutes } from './routes/prove'
import { disclosureRoutes } from './routes/disclosure'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Privacy Payments API',
      version: '1.0.0',
      description: 'API for privacy-preserving payments with selective disclosure',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
}

const specs = swaggerJsdoc(swaggerOptions)

app.use(helmet())
app.use(cors())
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/deposit', depositRoutes)
app.use('/api/shield', shieldRoutes)
app.use('/api/transfer', transferRoutes)
app.use('/api/prove', proveRoutes)
app.use('/api/disclosure', disclosureRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Privacy Payments API server running on port ${PORT}`)
  logger.info(`API documentation available at http://localhost:${PORT}/api-docs`)
})