pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "./merkle_tree.circom";

/*
 * Unshield Circuit
 * 
 * This circuit proves:
 * 1. The sender knows the secret to spend the input note
 * 2. The input note exists in the Merkle tree
 * 3. The revealed amount matches the note value
 * 4. Generate nullifier to prevent double spending
 */
template Unshield(levels) {
    // Private inputs (all inputs are private by default in circom)
    signal input noteSecret;          // Secret for the note being unshielded
    signal input noteValue;           // Value of the note
    signal input noteRandomness;      // Randomness used in note commitment
    signal input pathElements[levels]; // Merkle tree path elements
    signal input pathIndices[levels];  // Merkle tree path indices
    
    // Public inputs
    signal input merkleRoot;                  // Current Merkle tree root
    signal input recipient;                   // Public address receiving unshielded funds
    signal input amount;                      // Amount being unshielded (must match noteValue)
    
    // Public outputs
    signal output nullifier;                  // Nullifier for the spent note

    // Verify that the revealed amount matches the note value
    amount === noteValue;

    // Create note commitment using Poseidon hash
    component noteCommitment = Poseidon(3);
    noteCommitment.inputs[0] <== noteValue;
    noteCommitment.inputs[1] <== noteSecret;
    noteCommitment.inputs[2] <== noteRandomness;

    // Verify note exists in Merkle tree
    component merkleProof = MerkleTreeInclusionProof(levels);
    merkleProof.leaf <== noteCommitment.out;
    merkleProof.root <== merkleRoot;
    
    for (var i = 0; i < levels; i++) {
        merkleProof.pathElements[i] <== pathElements[i];
        merkleProof.pathIndices[i] <== pathIndices[i];
    }

    // Generate nullifier using Poseidon hash
    component nullifierHasher = Poseidon(3);
    nullifierHasher.inputs[0] <== noteCommitment.out;
    nullifierHasher.inputs[1] <== noteSecret;
    nullifierHasher.inputs[2] <== recipient;  // Include recipient in nullifier for additional security
    
    nullifier <== nullifierHasher.out;
}

// Circuit for unshielding with 20-level Merkle tree
component main = Unshield(20);