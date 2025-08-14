const snarkjs = require("snarkjs");
const path = require("path");
const fs = require("fs");

async function setupKeys(circuitName) {
    console.log(`Setting up proving and verification keys for ${circuitName}...`);
    
    const buildDir = path.join(__dirname, "../circuits/build");
    const keysDir = path.join(__dirname, "../keys");
    
    // Ensure keys directory exists
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }
    
    const r1csPath = path.join(buildDir, `${circuitName}.r1cs`);
    const ptauPath = path.join(keysDir, "powersOfTau28_hez_final_15.ptau");
    const zkeyPath = path.join(keysDir, `${circuitName}.zkey`);
    const vkeyPath = path.join(keysDir, `${circuitName}_vkey.json`);
    
    try {
        // Download powers of tau file if it doesn't exist
        if (!fs.existsSync(ptauPath)) {
            console.log("   📥 Creating powers of tau file...");
            // Create a small powers of tau for development
            await snarkjs.powersOfTau.newAccumulator(ptauPath, 12, false);  // 2^12 constraints max
            
            await snarkjs.powersOfTau.contribute(
                ptauPath,
                path.join(keysDir, "pot12_0001.ptau"),
                "privacy-payments-dev",
                "dev entropy"
            );
            
            await snarkjs.powersOfTau.beacon(
                path.join(keysDir, "pot12_0001.ptau"),
                ptauPath,
                "0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
                2  // 2 beacon iterations for faster setup
            );
            
            // Clean up intermediate file
            if (fs.existsSync(path.join(keysDir, "pot12_0001.ptau"))) {
                fs.unlinkSync(path.join(keysDir, "pot12_0001.ptau"));
            }
        }
        
        console.log("   🔐 Generating proving key...");
        
        // Phase 1: Generate initial zkey
        await snarkjs.zKey.newZKey(r1csPath, ptauPath, zkeyPath + "_0000.zkey");
        
        // Phase 2: Contribute to zkey
        await snarkjs.zKey.contribute(
            zkeyPath + "_0000.zkey",
            zkeyPath,
            "privacy-payments-contribution",
            "random entropy for phase 2"
        );
        
        // Generate verification key
        const vKey = await snarkjs.zKey.exportVerificationKey(zkeyPath);
        fs.writeFileSync(vkeyPath, JSON.stringify(vKey, null, 2));
        
        // Clean up intermediate file
        fs.unlinkSync(zkeyPath + "_0000.zkey");
        
        console.log(`✅ Successfully generated keys for ${circuitName}`);
        console.log(`   - Proving key: ${zkeyPath}`);
        console.log(`   - Verification key: ${vkeyPath}`);
        
    } catch (error) {
        console.error(`❌ Failed to setup keys for ${circuitName}:`, error);
        throw error;
    }
}

async function main() {
    console.log("🔑 Setting up zero-knowledge proving keys...\n");
    
    const circuits = ["shield", "transfer", "unshield"];
    
    for (const circuitName of circuits) {
        try {
            await setupKeys(circuitName);
            console.log();
        } catch (error) {
            console.error(`Failed to setup keys for ${circuitName}:`, error);
            process.exit(1);
        }
    }
    
    console.log("🎉 All keys generated successfully!");
    console.log("\n⚠️  IMPORTANT: In production, use a trusted setup ceremony!");
    console.log("   These keys are for development only and should not be used in production.");
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { setupKeys };