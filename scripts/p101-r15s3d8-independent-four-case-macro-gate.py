#!/usr/bin/env python3
"""R15S3D8 independent saved native-evidence consistency and negative QA.
This DOES NOT independently simulate the Runner or prove CCD normals, art,
playability, or full course finish in any non-finished case.
"""
import argparse,copy,json,math,re
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
MODES=('A_DISTRIBUTED_MACRO_ARC','B_REAL_AIRBORNE_TRANSFER')
HOLDS=('GAMEPLAY','ART','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE')
def norm(v):return math.sqrt(sum(x*x for x in v))
def inspect(d):
 assert d['schema']=='dopagaki.r15s3d8-two-physical-B48-macro-geometries-four-original-native-240hz/1'
 assert d['sourceOriginalBlob']==SHA and d['physicsHz']==240 and d['sourceBallRadius']==.65
 assert d['sourceGeometryChangedOnlyInPrivateB48']==[3,4]
 assert d['originalB48Count']==7 and d['originalB51Count']==28 and d['nativeFourCases']==4
 assert d['originalP96P94InputAndA13Unmodified'] is True
 assert d['originalPhysicsRouteCameraSteeringUnmodified'] is True and d['extraHiddenColliders']==0
 assert d['noAutomaticPlayerSnapping'] is True and d['sourceFullBrowserWebGL'] is False
 assert d['humanControlPassed'] is False and d['officialArtCount']==d['officialSlope2Meters']==0
 assert d['actualNativeRunCompleted'] is True
 assert all(d[k]=='HOLD' for k in HOLDS)
 assert set(d['cases'])==set(WORLDS)
 summary=[]
 for world in WORLDS:
  assert set(d['cases'][world])==set(MODES)
  for mode in MODES:
   r=d['cases'][world][mode]
   g=r['actualGeometry']
   assert r['world']==world and r['mode']==mode
   assert r['originalSourcePrefixChecks']==2
   assert g['sourceGameBlob']==SHA and g['world']==world and g['mode']==mode
   assert g['nativeRoadCount']==7 and g['originalB51Count']==28
   assert g['editedRealPhysicalB48Indices']==[3,4]
   assert g['protectedEntireCROWNAndEarlySCISSOR'] is True
   assert g['originalPhysicsGuideSteeringCameraUnmodified'] is True
   assert g['originalRouteUnchanged'] is True and g['additionalHiddenPhysicalColliders']==0
   assert g['physicallyRemovedRoadCells']==(2 if mode==MODES[1] else 0)
   assert g['actualRoad3LargestControlVertexMoveM']>1
   assert g['actualRoad4LargestControlVertexMoveM']>1
   assert g['trueRoad3Road4CentreSeamM']<1e-5
   assert g['road4EndToOriginalRoad5StartGapM']>=0
   assert g['sourceHumanGuidanceCanBeWrong'] is True and g['noSourceWebGL'] is True
   assert g['finishNotCertified'] is True
   assert g['artApproved']==g['slope2ApprovedMeters']==0
   assert g['GAMEPLAY']==g['ART']==g['HUMAN']==g['RELEASE']=='HOLD'
   assert re.fullmatch('[0-9a-f]{64}',g['geometryHash'])
   for v in ('road3Original9To30Sampled','road4Sampled'):
    geo=g[v]
    assert math.isfinite(geo['maxSampledAdjacentRowTangentDegrees'])
    assert math.isfinite(geo['maxSampledAdjacentRowFrameNormalDegrees'])
    assert len(geo['sampledRows'])==22
    for row in geo['sampledRows']:
     assert 9<=row['row']<=30
     assert len(row['centre'])==len(row['tangent'])==len(row['frameNormal'])==3
     assert all(math.isfinite(x) for x in row['centre']+row['tangent']+row['frameNormal'])
     assert row['widthXZ']>0
   assert r['originalNativeRunnerStatus'] in ('running','failed','finished')
   assert r['actualFinishedAllSevenRoads']==(r['originalNativeRunnerStatus']=='finished')
   assert 17<r['terminalTimeOr45sCap']<=45.00001
   assert r['genuineRunnerClockWasNotAltered'] is True
   assert r['originalSourceGameOrEngineModified'] is False
   assert r['humanGameplayOrVisualArtAccepted'] is False
   assert r['priorR15S3D6R1TerminalSeconds']>38
   assert r['actualPhysicalRoads']==7 and r['originalPhysicalB51']==28
   for key in ('trueSCISSORGroundSeconds','trueLOWERGroundSeconds','trueFollowingB48GroundSeconds'):
    assert r[key]>=0 and r[key]<=r['terminalTimeOr45sCap']
   assert r['originalNativeMovingContactEvents']>=0
   assert r['actualNegativeForwardGroundedTicksAfter23']>=0
   assert len(r['largestRoadUProjectionProxy'])==3
   assert all(0<=v<=1 for v in r['largestRoadUProjectionProxy'])
   impact=r['largestWhole240HzTickVelocityChangeAfter23']
   assert impact['valueMps']>0 and impact['tick'] is not None
   for item in ('firstSCISSORTrueContact','firstLOWERTrueContact','firstFollowingB48TrueContact'):
    v=r[item]
    if v is not None:
     assert v['tick']>0 and 0<=v['roadUProxy']<=1
     assert len(v['xyz'])==3 and all(math.isfinite(x) for x in v['xyz'])
   assert (r['firstFollowingB48TrueContact'] is None)==(r['trueFollowingB48GroundSeconds']==0)
   timeline=r['genuineNative10HzAndContactTimeline']
   assert len(timeline)>20
   assert all(a['tick']<b['tick'] for a,b in zip(timeline,timeline[1:]))
   for t in timeline:
    assert t['status'] in ('running','failed','finished')
    assert 23<=t['t']<=r['terminalTimeOr45sCap']+.000001
    assert -1<=t['actualLegalSteeringInput']<=1
    assert len(t['xyz'])==len(t['velocityXYZ'])==len(t['forwardXYZ'])==3
    assert abs(norm(t['velocityXYZ'])-t['nativeTrueSpeedMps'])<.00002
    assert abs(sum(a*b for a,b in zip(t['velocityXYZ'],t['forwardXYZ']))-t['signedNativeForwardMps'])<.0008
    assert t['originalFixedCollisionCountDelta']>=0
    if t['road'] is None:
     assert t['onRoadUProxy'] is None and t['signedPhysicalRoadTangentMps'] is None
    else:
     if t['onRoadUProxy'] is not None:assert 0<=t['onRoadUProxy']<=1
   summary.append({'world':world,'mode':mode,'sourceNativeStatus':r['originalNativeRunnerStatus'],
     'timeOrCapS':r['terminalTimeOr45sCap'],'road3SupportS':r['trueLOWERGroundSeconds'],
     'realFollowingB48SupportS':r['trueFollowingB48GroundSeconds'],
     'followingB48ContactExists':r['firstFollowingB48TrueContact'] is not None,
     'originalSourcePreserved':True,'gameplayCertified':False})
 return summary

def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args();raw=json.loads(Path(a.source).read_text());summary=inspect(raw)
 tests=(
  ('fake-human',lambda x:x.update(humanControlPassed=True)),
  ('fake-art',lambda x:x.update(officialArtCount=1)),
  ('fake-runner',lambda x:x.update(physicsHz=30)),
  ('fake-ghost-collider',lambda x:x.update(extraHiddenColliders=1)),
  ('fake-original-route',lambda x:x['cases'][WORLDS[0]][MODES[0]]['actualGeometry'].update(originalRouteUnchanged=False)),
  ('fake-CROWN',lambda x:x['cases'][WORLDS[1]][MODES[1]]['actualGeometry'].update(protectedEntireCROWNAndEarlySCISSOR=False)),
  ('fake-source-hash',lambda x:x.update(sourceOriginalBlob='abc')),
  ('fake-prefix',lambda x:x['cases'][WORLDS[0]][MODES[0]].update(originalSourcePrefixChecks=0)),
  ('fake-finish',lambda x:x['cases'][WORLDS[1]][MODES[1]].update(actualFinishedAllSevenRoads=not x['cases'][WORLDS[1]][MODES[1]]['actualFinishedAllSevenRoads'])),
  ('fake-physical-gap',lambda x:x['cases'][WORLDS[0]][MODES[1]]['actualGeometry'].update(physicallyRemovedRoadCells=0)),
  ('fake-edge-seam',lambda x:x['cases'][WORLDS[0]][MODES[0]]['actualGeometry'].update(trueRoad3Road4CentreSeamM=99)),
  ('fake-speed-sample',lambda x:x['cases'][WORLDS[0]][MODES[0]]['genuineNative10HzAndContactTimeline'][20].update(nativeTrueSpeedMps=999)),
 )
 rejected=[]
 for name,mutate in tests:
  t=copy.deepcopy(raw);mutate(t)
  try:inspect(t)
  except (AssertionError,KeyError,ValueError,TypeError,ZeroDivisionError):rejected.append(name)
  else:raise AssertionError('FALSE DATA ACCEPTED '+name)
 assert len(rejected)==12
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D8_INDEPENDENT_TWO_ROAD_MACRO_SOURCE_QA.json').write_text(
 json.dumps({'nativeOriginalSourceCases':summary,'rejectedFakeClaims':rejected,
  'sourceTechnicalOnly':True,'allCourseGameplayCertified':False,'WebGLTested':False,
  'humanPlayabilityProven':False,'ART':'HOLD','GAMEPLAY':'HOLD'},ensure_ascii=False,indent=2)+'\n')
 print('R15S3D8_SOURCE_TECH_QA',len(summary),'original native trials',len(rejected),'false claims rejected')
if __name__=='__main__':main()
