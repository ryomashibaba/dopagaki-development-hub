/** Canonical P95 physical obstacle station descriptors.
 * Used only to READ authored B51-C placement; never changes collision rules.
 * Entries: [real authored road index, centerline u, native machine type index, lateral offset meters].
 */
export const P95_HAZARD_SPECS=Object.freeze([
 [1,.22,0,-16],[1,.57,1,14],[1,.84,2,-5],
 [2,.26,0,12],[2,.64,1,-18],
 [3,.18,2,7],[3,.48,0,-13],[3,.82,1,16],
 [4,.35,2,-8],[4,.78,0,16],
 [5,.30,1,-16],[5,.73,2,8]
]);
