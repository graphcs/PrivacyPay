import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const EMAILS_FILE = join(process.cwd(), 'airdrop-signups.json')

interface SignupData {
  email: string
  timestamp: string
  ip?: string
  userAgent?: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, timestamp } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Read existing signups
    let signups: SignupData[] = []
    if (existsSync(EMAILS_FILE)) {
      try {
        const fileContent = readFileSync(EMAILS_FILE, 'utf-8')
        signups = JSON.parse(fileContent)
      } catch (error) {
        console.error('Error reading signups file:', error)
      }
    }

    // Check if email already exists
    const existingSignup = signups.find(signup => signup.email.toLowerCase() === email.toLowerCase())
    if (existingSignup) {
      return NextResponse.json({ message: 'Already signed up' }, { status: 200 })
    }

    // Add new signup
    const newSignup: SignupData = {
      email: email.toLowerCase().trim(),
      timestamp,
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    signups.push(newSignup)

    // Save to file
    writeFileSync(EMAILS_FILE, JSON.stringify(signups, null, 2))

    console.log(`New airdrop signup: ${email} at ${timestamp}`)

    return NextResponse.json({ message: 'Successfully signed up for airdrop' }, { status: 200 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}