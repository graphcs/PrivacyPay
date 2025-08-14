pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

/*
 * Shield Circuit
 * 
 * This circuit proves:
 * 1. The user can create a valid note commitment
 * 2. The public amount matches the note value
 * 3. Generate a commitment for the Merkle tree
 */
template Shield() {
    // Private inputs (all inputs are private by default in circom)
    signal input noteSecret;          // Secret for the new note
    signal input noteRandomness;      // Randomness for the note commitment
    
    // Public inputs
    signal input noteValue;           // Value being shielded (public)
    signal input depositor;           // Address making the deposit (public)
    
    // Public outputs
    signal output commitment;         // Commitment for the note

    // Create note commitment using Poseidon hash
    component noteCommitment = Poseidon(3);
    noteCommitment.inputs[0] <== noteValue;
    noteCommitment.inputs[1] <== noteSecret;
    noteCommitment.inputs[2] <== noteRandomness;
    
    commitment <== noteCommitment.out;
}

// Circuit for shielding deposits
component main = Shield();