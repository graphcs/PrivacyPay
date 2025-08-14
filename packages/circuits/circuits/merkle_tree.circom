pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/mux1.circom";

/*
 * Merkle Tree Inclusion Proof
 * 
 * Verifies that a leaf is included in a Merkle tree with a given root
 * Uses Pedersen hash for better zk-SNARK efficiency
 */
template MerkleTreeInclusionProof(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    component selectors[levels];
    component hashers[levels];

    for (var i = 0; i < levels; i++) {
        selectors[i] = MultiMux1(2);
        
        selectors[i].c[0][0] <== i == 0 ? leaf : hashers[i-1].out;
        selectors[i].c[0][1] <== pathElements[i];
        
        selectors[i].c[1][0] <== pathElements[i];
        selectors[i].c[1][1] <== i == 0 ? leaf : hashers[i-1].out;
        
        selectors[i].s <== pathIndices[i];
        
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== selectors[i].out[0];
        hashers[i].inputs[1] <== selectors[i].out[1];
    }

    root === hashers[levels-1].out;
}

/*
 * Merkle Tree Updater
 * 
 * Computes the new root when inserting a leaf at a specific position
 */
template MerkleTreeUpdater(levels) {
    signal input oldRoot;
    signal input newLeaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal output newRoot;

    component hashers[levels];
    component selectors[levels];

    for (var i = 0; i < levels; i++) {
        selectors[i] = MultiMux1(2);
        
        selectors[i].c[0][0] <== i == 0 ? newLeaf : hashers[i-1].out;
        selectors[i].c[0][1] <== pathElements[i];
        
        selectors[i].c[1][0] <== pathElements[i];
        selectors[i].c[1][1] <== i == 0 ? newLeaf : hashers[i-1].out;
        
        selectors[i].s <== pathIndices[i];
        
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== selectors[i].out[0];
        hashers[i].inputs[1] <== selectors[i].out[1];
    }

    newRoot <== hashers[levels-1].out;
}