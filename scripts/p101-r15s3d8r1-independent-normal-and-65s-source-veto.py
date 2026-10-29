#!/usr/bin/env python3
"""R15S3D8R1: independent consistency of original Runner 65s evidence.
No claims of human control or complete game. Never mistake cap for finish.
"""
import argparse,copy,json,math
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
MODE='A_ROAD4_WINDING_REPAIRED'
HOLDS=('GAMEPLAY','ART','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE')
def mag(a):return math.sqrt(sum(x*x for x in a))
def verify(d):
 assert d['schema']=='dopagaki.r15s3d8r1-continuous-physical-road4-two-world-65s-original-native/1'
 assert d['sourceOriginalBlob']==SHA and d['physicsHz']==240 and d['sourceBallRadius']==.65
 assert d['sourceGeometryChangedOnlyInPrivateB48']==[4]
 assert d['originalB48Count']==7 and d['originalB51Count']==28
 assert d['nativeTwoCases']==2 and d['oldNativeR15S3D8FourCaseReference'] is True
 assert d['extendedNativeCapSeconds']==65
 assert d['originalP96P94InputAndA13Unmodified'] is True
 assert d['originalPhysicsRouteCameraSteeringUnmodified'] is True
 assert d['extraHiddenColliders']==0 and d['noAutomaticPlayerSnapping'] is True
 assert d['sourceFullBrowserWebGL'] is False and d['humanControlPassed'] is False
 assert d['officialArtCount']==d['officialSlope2Meters']==0
 assert d['actualNativeRunCompleted'] is True
 assert all(d[k]=='HOLD' for k in HOLDS)
 assert set(d['cases'])==set(WORLDS)
 out=[]
 for w in WORLDS:
  assert set(d['cases'][w])=={MODE}
  c=d['cases'][w][MODE];g=c['actualGeometry']
  assert c['world']==w and c['mode']==MODE
  assert c['originalSourcePrefixChecks']==2
  assert g['schema']=='dopagaki.r15s3d8r1-source-real-road4-winding/1'
  assert g['sourceProtectedGameBlob']==SHA and g['world']==w and g['baseStudy']=='A_DISTRIBUTED_MACRO_ARC'
  assert g['realB48ControlPointModificationSection']==4
  assert g['originalB48Count']==7 and g['originalB51Count']==28
  assert g['realRemovedRoadCells']==0 and g['addedPhysicalOrHiddenColliders']==0
  assert g['existingRoad3SurfaceAndFullWidthSeamUnchanged'] is True
  assert g['originalPhysicsCCDInputCameraGuideRouteUnchanged'] is True
  assert g['sourceCrownAndEarlyScissorPreserved'] is True
  assert g['oldMacroRoad4CrossOrientationRowsReversed']>=1
  assert g['maximumOriginalRoad4VertexMovedM']>1
  assert 0<=g['road4MaximumAdjacentSampledNormalAngleDegrees']<35
  assert g['road4MinimumSampledNormalY']>.75
  assert g['road4ExitToUnchangedRoad5EntryM']>100
  assert abs(g['oldRoad4ExitToRoad5GapM']-g['road4ExitToUnchangedRoad5EntryM'])<.001
  assert g['downstreamGapRemainsUnresolved'] is True
  for key in ('realRoad4ExitXYZ','nextOriginalRoad5EntryXYZ'):
   assert len(g[key])==3 and all(math.isfinite(v) for v in g[key])
  assert abs(mag([a-b for a,b in zip(g['realRoad4ExitXYZ'],g['nextOriginalRoad5EntryXYZ'])])-g['road4ExitToUnchangedRoad5EntryM'])<.00001
  assert g['actualSourceWebGLTested'] is False and g['humanPlayabilityTested'] is False
  assert g['actualFullCourseFinishedCertified'] is False and g['officialArt']==g['officialSlope2Meters']==0
  assert g['GAMEPLAY']==g['ART']==g['HUMAN']==g['RELEASE']=='HOLD'
  assert c['originalNativeRunnerStatus'] in ('failed','finished','running')
  assert c['actualFinishedAllSevenRoads']==(c['originalNativeRunnerStatus']=='finished')
  assert c['priorR15S3D8Original45sStatus']=='running'
  assert c['priorR15S3D8Original45sRoad4SupportedSeconds']>1
  assert c['priorR15S3D6R1TerminalSeconds']>38
  assert 17<c['terminalTimeOr45sCap']<=65.00001
  assert c['actualPhysicalRoads']==7 and c['originalPhysicalB51']==28
  assert c['genuineRunnerClockWasNotAltered'] is True
  assert c['originalSourceGameOrEngineModified'] is False
  assert c['humanGameplayOrVisualArtAccepted'] is False
  for key in ('trueSCISSORGroundSeconds','trueLOWERGroundSeconds','trueFollowingB48GroundSeconds','trueOriginalRoad5GroundSeconds'):
   assert c[key]>=0 and c[key]<=c['terminalTimeOr45sCap']
  assert (c['firstFollowingB48TrueContact'] is None)==(c['trueFollowingB48GroundSeconds']==0)
  assert (c['firstOriginalRoad5TrueContact'] is None)==(c['trueOriginalRoad5GroundSeconds']==0)
  assert len(c['largestRoadUProjectionProxy'])==4
  assert all(0<=x<=1 for x in c['largestRoadUProjectionProxy'])
  assert c['largestWhole240HzTickVelocityChangeAfter23']['valueMps']>0
  assert c['originalNativeMovingContactEvents']>=0
  lines=c['genuineNative10HzAndContactTimeline']
  assert len(lines)>30
  assert all(x['tick']<y['tick'] for x,y in zip(lines,lines[1:]))
  for x in lines:
   assert x['status'] in ('failed','finished','running')
   assert 23<=x['t']<=c['terminalTimeOr45sCap']+.000001
   assert -1<=x['actualLegalSteeringInput']<=1
   assert len(x['xyz'])==len(x['velocityXYZ'])==len(x['forwardXYZ'])==3
   assert abs(mag(x['velocityXYZ'])-x['nativeTrueSpeedMps'])<.00002
   assert abs(sum(a*b for a,b in zip(x['velocityXYZ'],x['forwardXYZ']))-x['signedNativeForwardMps'])<.0008
   assert x['originalFixedCollisionCountDelta']>=0
  out.append({'world':w,'status':c['originalNativeRunnerStatus'],
   'actualTerminalOrCapSeconds':c['terminalTimeOr45sCap'],
   'lowerGroundSeconds':c['trueLOWERGroundSeconds'],
   'road4GroundSeconds':c['trueFollowingB48GroundSeconds'],
   'actualRoad5GroundSeconds':c['trueOriginalRoad5GroundSeconds'],
   'physicalRoad4WorstAdjacentNormalDegrees':g['road4MaximumAdjacentSampledNormalAngleDegrees'],
   'unresolvedPhysicalRoad4ToRoad5GapM':g['road4ExitToUnchangedRoad5EntryM'],
   'fullCourseCertified':False})
 return out
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args();d=json.loads(Path(a.source).read_text());cases=verify(d)
 negative=(
  ('fabricated-finish',lambda x:x['cases'][WORLDS[0]][MODE].update(actualFinishedAllSevenRoads=not x['cases'][WORLDS[0]][MODE]['actualFinishedAllSevenRoads'])),
  ('fabricated-physics',lambda x:x.update(physicsHz=30)),
  ('fabricated-gameplay',lambda x:x.update(GAMEPLAY='PASS')),
  ('fabricated-human',lambda x:x.update(humanControlPassed=True)),
  ('fabricated-CCD',lambda x:x['cases'][WORLDS[0]][MODE]['actualGeometry'].update(originalPhysicsCCDInputCameraGuideRouteUnchanged=False)),
  ('fabricated-CROWN',lambda x:x['cases'][WORLDS[1]][MODE]['actualGeometry'].update(sourceCrownAndEarlyScissorPreserved=False)),
  ('fabricated-geometry',lambda x:x['cases'][WORLDS[0]][MODE]['actualGeometry'].update(road4MaximumAdjacentSampledNormalAngleDegrees=179.9)),
  ('fabricated-gap',lambda x:x['cases'][WORLDS[1]][MODE]['actualGeometry'].update(road4ExitToUnchangedRoad5EntryM=0)),
  ('fabricated-prefix',lambda x:x['cases'][WORLDS[1]][MODE].update(originalSourcePrefixChecks=0)),
  ('fabricated-speed',lambda x:x['cases'][WORLDS[0]][MODE]['genuineNative10HzAndContactTimeline'][25].update(nativeTrueSpeedMps=999)),
 )
 rejects=[]
 for name,fn in negative:
  bad=copy.deepcopy(d);fn(bad)
  try:verify(bad)
  except (AssertionError,ValueError,KeyError,TypeError,ZeroDivisionError):rejects.append(name)
  else:raise AssertionError('false claim accepted: '+name)
 assert len(rejects)==10
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D8R1_ORIGINAL_TWO_WORLD_65S_INDEPENDENT_GATE.json').write_text(
 json.dumps({'worlds':cases,'rejectedFalseClaims':rejects,'GAMEPLAY':'HOLD','ART':'HOLD',
  'SOURCE_TECH':'ORIGINAL_TWO_NATIVE_CASES_SOURCE_ONLY',
  'sourceBrowserWebGLTested':False,'humanPlayabilityCertified':False},ensure_ascii=False,indent=2)+'\n')
 print('R15S3D8R1_SOURCE_ONLY',len(cases),'genuine 65s original 240Hz trials',
       len(rejects),'fake assertions rejected')
if __name__=='__main__':main()
