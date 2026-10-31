/**
 * A13 W3 only: additional high-silhouette ACTUAL B51-C moving collider
 * locations. No new collision primitive; existing 12 P95 machines remain
 * byte-for-byte equivalent. These are playable prototypes, not fair/clear.
 * Each tuple is [real physical section, normalized u, native type index, lateral offset].
 */
export const A13_HAZARD_SPECS=Object.freeze([
 [0,.28,0,-11],[0,.73,1,13],
 [1,.40,2,7],[1,.69,0,-12],
 [2,.14,1,-9],[2,.43,0,14],[2,.80,2,-8],
 [3,.10,0,10],[3,.34,1,-14],[3,.63,2,8],
 [4,.17,1,10],[4,.61,0,-9],
 [5,.26,2,-10],[5,.64,1,8],
 [6,.22,0,10],[6,.61,2,-6]
]);
export const A13_EXTRA_HAZARDS=A13_HAZARD_SPECS.length;
export const a13MachineId=index=>'a13-machine-'+String(index+1).padStart(2,'0');
