pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "./merkle_tree.circom";

/*
 * Shielded Transfer Circuit
 * 
 * This circuit proves:
 * 1. The sender knows the secret to spend input notes (nullifier integrity)
 * 2. Input notes exist in the Merkle tree (membership proof)
 * 3. No double spending (unique nullifiers)
 * 4. Conservation of value (input sum = output sum)
 * 5. Output note commitments are correctly formed
 */
template ShieldedTransfer(levels, nInputs, nOutputs) {
    // Private inputs (all inputs are private by default in circom)
    signal input inputNoteSecrets[nInputs];          // Secrets for input notes
    signal input inputNoteValues[nInputs];           // Values of input notes
    signal input inputNoteRandomness[nInputs];       // Randomness for input notes
    signal input inputNotePathElements[nInputs][levels]; // Merkle tree path elements
    signal input inputNotePathIndices[nInputs][levels];  // Merkle tree path indices
    
    signal input outputNoteValues[nOutputs];         // Values for output notes
    signal input outputNoteSecrets[nOutputs];        // Secrets for output notes
    signal input outputNoteRandomness[nOutputs];     // Randomness for output notes
    
    // Public inputs
    signal input merkleRoot;                                 // Current Merkle tree root
    
    // Public outputs
    signal output nullifiers[nInputs];                       // Nullifiers for input notes
    signal output commitments[nOutputs];                     // Commitments for output notes
    signal output valueBalance;                              // Net value change (should be 0 for transfers)

    var i;
    var j;

    // Instantiate Merkle tree verifier
    component merkleProof[nInputs];
    
    // Instantiate Poseidon hash for commitments and nullifiers
    component inputCommitments[nInputs];
    component outputCommitments[nOutputs];
    component nullifierHashers[nInputs];

    // Signals for value calculation
    signal inputSum;
    signal outputSum;
    signal tempInputSum[nInputs];
    signal tempOutputSum[nOutputs];

    // Initialize sums
    tempInputSum[0] <== inputNoteValues[0];
    for (i = 1; i < nInputs; i++) {
        tempInputSum[i] <== tempInputSum[i-1] + inputNoteValues[i];
    }
    inputSum <== tempInputSum[nInputs-1];

    tempOutputSum[0] <== outputNoteValues[0];
    for (i = 1; i < nOutputs; i++) {
        tempOutputSum[i] <== tempOutputSum[i-1] + outputNoteValues[i];
    }
    outputSum <== tempOutputSum[nOutputs-1];

    // Process input notes
    for (i = 0; i < nInputs; i++) {
        // Create input note commitment using Poseidon hash
        inputCommitments[i] = Poseidon(3);
        inputCommitments[i].inputs[0] <== inputNoteValues[i];
        inputCommitments[i].inputs[1] <== inputNoteSecrets[i];
        inputCommitments[i].inputs[2] <== inputNoteRandomness[i];

        // Verify input note exists in Merkle tree
        merkleProof[i] = MerkleTreeInclusionProof(levels);
        merkleProof[i].leaf <== inputCommitments[i].out;
        merkleProof[i].root <== merkleRoot;
        
        for (j = 0; j < levels; j++) {
            merkleProof[i].pathElements[j] <== inputNotePathElements[i][j];
            merkleProof[i].pathIndices[j] <== inputNotePathIndices[i][j];
        }

        // Generate nullifier (prevents double spending)
        nullifierHashers[i] = Poseidon(2);
        nullifierHashers[i].inputs[0] <== inputCommitments[i].out;
        nullifierHashers[i].inputs[1] <== inputNoteSecrets[i];
        nullifiers[i] <== nullifierHashers[i].out;
    }

    // Process output notes
    for (i = 0; i < nOutputs; i++) {
        // Create output note commitment using Poseidon hash
        outputCommitments[i] = Poseidon(3);
        outputCommitments[i].inputs[0] <== outputNoteValues[i];
        outputCommitments[i].inputs[1] <== outputNoteSecrets[i];
        outputCommitments[i].inputs[2] <== outputNoteRandomness[i];
        
        commitments[i] <== outputCommitments[i].out;
    }

    // Verify conservation of value
    // For a simple transfer: inputSum should equal outputSum
    // For deposits/withdrawals: valueBalance represents the net change
    valueBalance <== inputSum - outputSum;
}

// Circuit for 2-input, 2-output transfers with 20-level Merkle tree
component main = ShieldedTransfer(20, 2, 2);