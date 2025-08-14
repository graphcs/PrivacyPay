const circom = require("circom_tester").wasm;
const path = require("path");
const fs = require("fs");

async function compileCircuit(circuitName) {
    console.log(`Compiling ${circuitName} circuit...`);
    
    const circuitPath = path.join(__dirname, "../circuits", `${circuitName}.circom`);
    const outputDir = path.join(__dirname, "../circuits/build");
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    try {
        const circuit = await circom(circuitPath, {
            output: outputDir,
            sym: true,
            r1cs: true,
            wasm: true,
            include: [
                path.join(__dirname, "../node_modules"),
                path.join(__dirname, "../circuits")
            ]
        });
        
        console.log(`✅ Successfully compiled ${circuitName} circuit`);
        
        return circuit;
    } catch (error) {
        console.error(`❌ Failed to compile ${circuitName} circuit:`, error);
        throw error;
    }
}

async function main() {
    console.log("🔧 Compiling zero-knowledge circuits...\n");
    
    const circuits = ["shield", "transfer", "unshield"];
    
    for (const circuitName of circuits) {
        try {
            await compileCircuit(circuitName);
            console.log();
        } catch (error) {
            console.error(`Failed to compile ${circuitName}:`, error);
            process.exit(1);
        }
    }
    
    console.log("🎉 All circuits compiled successfully!");
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { compileCircuit };