# Privacy Payments 

A production-ready system for privacy-preserving payments with assets on Ethereum mainnet and Sepolia testnet, featuring zero-knowledge proofs and selective disclosure for regulatory compliance.

<img width="1206" height="778" alt="CleanShot 2025-08-13 at 22 08 44" src="https://github.com/user-attachments/assets/e1be303d-23ac-454b-88ea-bb23703c6667" />


## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Build zero-knowledge circuits
pnpm run build:circuits

# Start development servers
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Features

### Core Privacy Features
- **Shielded Transactions**: Zero-knowledge proofs using Circom/Groth16
- **Note Commitments**: Pedersen hashes for efficient zk-SNARK proving
- **Nullifiers**: Prevent double-spending of private notes
- **Merkle Tree**: 20-level tree for membership proofs

### Compliance & Regulatory
- **View Keys**: Selective transaction disclosure for compliance
- **Audit Keys**: Comprehensive access for regulatory audits
- **Transaction Notes**: Encrypted memos for transaction context
- **PDF Reports**: Exportable compliance reports

### Multi-Chain Support
- **Ethereum Mainnet**: Production-ready mainnet integration
- **Sepolia Testnet**: Full testnet support for development
- **Configurable RPC**: Easy chain configuration and switching

## 🏗️ Architecture

### Monorepo Structure
```
├── apps/
│   ├── web/           # Next.js 14 + App Router frontend
│   └── api/           # Node.js/Express API server
├── packages/
│   ├── circuits/      # Circom zk-SNARK circuits
│   └── lib/           # Shared TypeScript libraries
└── docs/              # Documentation and compliance guides
```

### Technology Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, RainbowKit
- **Backend**: Node.js, Express, TypeScript
- **Zero-Knowledge**: Circom, snarkjs, Groth16 proofs
- **Blockchain**: Ethers.js, Viem, Wagmi
- **Monorepo**: pnpm workspaces, Turbo

## 🔧 Development

### Prerequisites
- Node.js 18+
- pnpm 8+
- Git

### Commands
```bash
# Development
pnpm dev              # Start all development servers
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages

# Circuits
pnpm build:circuits   # Compile circuits and generate keys
pnpm test:circuits    # Test circuit constraints

# Individual packages
pnpm --filter @privacy-payments/web dev
pnpm --filter @privacy-payments/api dev
```

## 🔐 Privacy Model

### Transaction Flow
1. **Shield**: Move funds from public wallet to private pool
   - Deposit tokens to smart contract
   - Generate note commitment with secret
   - Add commitment to Merkle tree

2. **Transfer**: Private transfers within shielded pool
   - Generate zero-knowledge proof
   - Prove note ownership without revealing amounts
   - Create nullifiers to prevent double-spending
   - Generate new output commitments

3. **Unshield**: Move funds back to public addresses
   - Prove ownership of private note
   - Nullify the spent note
   - Transfer to specified public address

### Key Management
- **Spending Key**: Master key for spending private notes
- **View Key**: Allows viewing transaction history (compliance)
- **Audit Key**: Comprehensive access for regulatory audits

## 🛡️ Security Considerations

### Production Readiness
- **Trusted Setup**: Uses development keys - replace with ceremony keys for production
- **Audit Required**: Smart contracts and circuits need professional audit
- **Key Management**: Implement secure key storage and recovery
- **Rate Limiting**: API endpoints protected against abuse

### Threat Model
- **Privacy**: Transactions are private unless disclosed via view/audit keys
- **Compliance**: Selective disclosure maintains privacy while enabling compliance
- **Double Spending**: Prevented by nullifier tracking on-chain
- **Front-running**: Proof generation happens client-side

## 📖 Usage Guide

### Web Application

#### Overview Page
- System status and health checks
- Privacy flow diagrams
- Technical architecture overview
- Supported network information

#### Wallet Management
- Create and manage shielded accounts
- View public and private balances
- Shield funds from public to private
- Execute private transfers
- Unshield funds to public addresses

#### Compliance Tools
- View key transaction disclosure
- Audit key comprehensive reporting
- PDF report generation
- Risk analysis and pattern detection

#### Admin Panel
- System monitoring and diagnostics
- Chain synchronization status
- Storage management
- Development tools and API reference

### API Endpoints

All endpoints are documented with OpenAPI/Swagger at `/api-docs`

- `POST /api/deposit` - Public deposit transactions
- `POST /api/shield` - Shield funds to private pool
- `POST /api/transfer/shielded` - Private shielded transfers
- `POST /api/transfer/unshield` - Unshield to public address
- `POST /api/prove/transfer` - Generate zero-knowledge proofs
- `POST /api/prove/verify` - Verify proofs
- `POST /api/disclosure/view` - View key disclosure
- `POST /api/disclosure/audit` - Audit key reporting

## 🧪 Testing

### Unit Tests
```bash
pnpm test              # Run all unit tests
pnpm test:circuits     # Test circuit constraints
pnpm test:lib          # Test shared library functions
pnpm test:api          # Test API endpoints
```

### End-to-End Tests
```bash
pnpm test:e2e          # Run Playwright E2E tests
```

### Test Coverage
- Circuit constraint validation
- Cryptographic primitive correctness
- API endpoint functionality
- Merkle tree operations
- Key management and encryption

## 📚 Documentation

### Compliance Guide
- Regulatory considerations
- View key vs audit key usage
- Selective disclosure best practices
- Export procedures for compliance

### Technical Documentation
- Circuit specification and constraints
- Cryptographic primitives explanation
- Smart contract interface
- API reference with examples

### Deployment Guide
- Smart contract deployment
- Production environment setup
- Monitoring and alerting
- Backup and recovery procedures

## 🚀 Deployment

### Development
```bash
pnpm dev              # Starts web on :3000, API on :3001
```

### Production
```bash
pnpm build            # Build all packages
pnpm start            # Start production servers
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- RPC endpoints for Ethereum and Sepolia
- Smart contract addresses (after deployment)
- API keys for Alchemy/Infura
- WalletConnect project ID

## ⚠️ Important Notes

### For Production Use
1. **Deploy Smart Contracts**: Current setup uses placeholder addresses
2. **Trusted Setup Ceremony**: Replace development keys with production keys
3. **Professional Audit**: Audit circuits and contracts before mainnet
4. **Key Management**: Implement secure key storage and recovery
5. **Monitoring**: Set up comprehensive monitoring and alerting

### Legal Compliance
- Users are responsible for regulatory compliance in their jurisdiction
- Selective disclosure features should only be used as required by law
- This is experimental software - use at your own risk

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Documentation](./docs/)
- [API Reference](http://localhost:3001/api-docs)
- [Compliance Guide](./docs/compliance.md)
- [Threat Model](./docs/threat-model.md)

---

**⚠️ Disclaimer**: This is experimental software for educational and development purposes. Do not use in production without proper audits and security reviews.
