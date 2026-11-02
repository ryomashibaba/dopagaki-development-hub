/** G4E-7DZ R1 — PRIVATE native-camera candidate location inventory.
 * No city mesh, game file, collision, camera, physics or publication changes.
 * This emits temporal windows for HUMAN storyboard evaluation, NOT an art score.
 * 18.5s is intentionally excluded: prior DJ classified it off-road diagnostic.
 */
import {g4e7djNativeStoryboard} from './p101-w9c2-g4e7dj-native-storyboard.mjs';

export function g4e7dzR1CameraWindows(snapshot=g4e7djNativeStoryboard()) {
  if (snapshot.physicsHz !== 240 ||
      snapshot.certifiedSlope2Meters !== 0 ||
      snapshot.camera !== 'UNCHANGED_ORIGINAL_BALL_RELATIVE_NATIVE') {
    throw new Error('Protected physical/camera baseline mismatch');
  }
  const result = {};
  for (const [road, stage] of Object.entries(snapshot.stages)) {
    if (stage.actualB48 !== 7 || stage.actualMovingB51 !== 28 ||
        stage.originalGapCell52 !== true) throw new Error('Protected road mismatch '+road);
    const frames = [...stage.frames].sort((a,b)=>a.timeSeconds-b.timeSeconds)
      .filter(f=>f.timeSeconds >= 14 && f.timeSeconds <= 18.01);
    for (const f of frames) {
      if (!Array.isArray(f.eye) || !Array.isArray(f.front) ||
          f.eye.length !== 3 || f.front.length !== 3 ||
          ![...f.eye,...f.front].every(Number.isFinite) ||
          !f.source.includes('NOT_HUMAN')) throw new Error('Invalid native frame '+road);
    }
    const windows = [];
    // Four successive half-second frames serve as ingress / approach /
    // passage / exit anchors. They are candidates, not a quality judgement.
    for(let i=0;i+3<frames.length;i++) {
      const seq=frames.slice(i,i+4);
      if(seq.some((f,k)=>k && f.timeSeconds-seq[k-1].timeSeconds > 0.501)) continue;
      windows.push({
        id:seq.map(f=>f.id).join('_'),
        fourStageNativeFrames:seq.map(f=>({
          id:f.id,seconds:f.timeSeconds,eye:f.eye,front:f.front,
          physicalRoad:f.physicalRoad,grounded:f.grounded,speedMps:f.speedMps
        })),
        artDisposition:'UNREVIEWED',
        requires:'overlay real baseline WebGL 4 shots, sketch silhouette/void/wayfinding at ALL 4 native views before modeling',
        safety:'NO GEOMETRY; no clearance or gameplay inference'
      });
    }
    result[road]={windows,reference:'DJ native P96 scripted run, not human'};
  }
  return {schema:'dopagaki.g4e7dz-r1-private-camera-windows/1',
    source:'G4E7DJ_SAME_NATIVE_240HZ_CAMERAS',result,
    production:'DO_NOT_PUBLISH',art:'HOLD',human:'HOLD',
    formalSlope2Meters:0};
}

if (process.argv[1] && import.meta.url === new URL('file://'+process.argv[1]).href) {
  process.stdout.write(JSON.stringify(g4e7dzR1CameraWindows(),null,2)+'\n');
}
