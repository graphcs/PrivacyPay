const fs = require('fs')
const path = require('path')

const SIGNUPS_FILE = path.join(__dirname, 'airdrop-signups.json')

function viewSignups() {
  try {
    if (!fs.existsSync(SIGNUPS_FILE)) {
      console.log('No signups file found yet.')
      return
    }

    const data = fs.readFileSync(SIGNUPS_FILE, 'utf-8')
    const signups = JSON.parse(data)

    console.log(`\n📧 AIRDROP SIGNUPS (${signups.length} total)\n`)
    console.log('=' * 50)

    signups.forEach((signup, index) => {
      const date = new Date(signup.timestamp).toLocaleString()
      console.log(`${index + 1}. ${signup.email}`)
      console.log(`   📅 ${date}`)
      console.log(`   🌐 IP: ${signup.ip}`)
      console.log(`   🔍 ${signup.userAgent.substring(0, 60)}${signup.userAgent.length > 60 ? '...' : ''}`)
      console.log('')
    })

    console.log(`Total signups: ${signups.length}`)
    
    // Export just emails for easy copy/paste
    console.log('\n📋 EMAIL LIST (comma-separated):')
    console.log(signups.map(s => s.email).join(', '))

  } catch (error) {
    console.error('Error reading signups:', error.message)
  }
}

// Run if called directly
if (require.main === module) {
  viewSignups()
}

module.exports = { viewSignups }