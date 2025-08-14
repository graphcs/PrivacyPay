const fs = require("fs");
const path = require("path");

async function createMockKeys() {
    console.log("🔑 Creating mock keys for development...\n");
    
    const keysDir = path.join(__dirname, "../keys");
    
    // Ensure keys directory exists
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }
    
    const circuits = ["shield", "transfer", "unshield"];
    
    for (const circuitName of circuits) {
        console.log(`Creating mock keys for ${circuitName}...`);
        
        const zkeyPath = path.join(keysDir, `${circuitName}.zkey`);
        const vkeyPath = path.join(keysDir, `${circuitName}_vkey.json`);
        
        // Create mock proving key (empty file for now)
        fs.writeFileSync(zkeyPath, Buffer.alloc(32));
        
        // Create mock verification key
        const mockVKey = {
            protocol: "groth16",
            curve: "bn128",
            nPublic: 3,
            vk_alpha_1: ["0", "0", "0"],
            vk_beta_2: [["0", "0"], ["0", "0"], ["0", "0"]],
            vk_gamma_2: [["0", "0"], ["0", "0"], ["0", "0"]],
            vk_delta_2: [["0", "0"], ["0", "0"], ["0", "0"]],
            vk_alphabeta_12: [["0", "0"], ["0", "0"]],
            IC: [["0", "0", "0"], ["0", "0", "0"]]
        };
        
        fs.writeFileSync(vkeyPath, JSON.stringify(mockVKey, null, 2));
        
        console.log(`✅ Created mock keys for ${circuitName}`);
    }
    
    console.log("\n🎉 Mock keys created successfully!");
    console.log("\n⚠️  IMPORTANT: These are mock keys for development only!");
    console.log("   Replace with proper trusted setup keys before production use.");
}

if (require.main === module) {
    createMockKeys().catch(console.error);
}

module.exports = { createMockKeys };