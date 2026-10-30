#!/usr/bin/env python3
"""R15S3D9: audit actual saved source-native evidence, NOT independent simulation.
Source-only, 240Hz 0s Runner replays checked against source B16 prefix, static
four candidate geometry, no fabricated GamePlay/Human/ART or full-course finish.
"""
import argparse,copy,json,math,re
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
MODES=('A_CONTINUOUS_NARROW_MACRO','B_ELEVATED_REAL_GAP_MACRO')
HOLDS=('GAMEPLAY','ART','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE')
def mag(v):return math.hypot(*v)
def verify(d):
 assert d['schema']=='dopagaki.r15s3d9-physically-paired-road5-road6-4-world-modes-native-95s/1'
 assert d['sourceOriginalBlob']==SHA and d['physicsHz']==240 and d['sourceBallRadius']==.65
 assert d['sourceGeometryChangedOnlyInPrivateB48']==[5,6]
 assert d['originalB48Count']==7 and d['originalB51Count']==28 and d['nativeFourCases']==4
 assert d['oldNativeR15S3D8R1TwoWorldReference'] is True and d['extendedNativeCapSeconds']==95
 assert d['staticRealB48GateAllFourPassed'] is True
 assert d['originalP96P94InputAndA13Unmodified'] is True
 assert d['originalPhysicsRouteCameraSteeringUnmodified'] is True
 assert d['extraHiddenColliders']==0 and d['noAutomaticPlayerSnapping'] is True
 assert d['sourceFullBrowserWebGL'] is False and d['humanControlPassed'] is False
 assert d['officialArtCount']==d['officialSlope2Meters']==0
 assert d['actualNativeRunCompleted'] is True
 assert all(d[k]=='HOLD' for k in HOLDS)
 assert set(d['cases'])==set(WORLDS)
 summaries=[]
 for world in WORLDS:
  assert set(d['cases'][world])==set(MODES)
  for mode in MODES:
   r=d['cases'][world][mode];g=r['actualGeometry']
   assert (r['world'],r['mode'])==(world,mode) and r['originalSourcePrefixChecks']==2
   assert g['schema']=='dopagaki.r15s3d9-real-existing-two-downstream-B48-macro/1'
   assert g['sourceOriginalGameBlob']==SHA and g['world']==world and g['mode']==mode
   assert g['originalB48Count']==7 and g['originalMovingB51Count']==28
   assert g['changedPhysicalRoadIndices']==[5,6] and g['unchangedCompleteRoads0Through4'] is True
   assert g['actualOriginalP96P94A13RunnerGuideCameraCCDUnmodified'] is True
   assert g['newHiddenRoadsOrPhysicsColliders']==0
   assert g['genuineB48GapCellsOnRoad5']==(2 if mode==MODES[1] else 0)
   assert g['realOldRoad5ControlPointMaxChangeM']>100
   assert g['realOldRoad6ControlPointMaxChangeM']>10
   assert len(g['realRoad4ToRoad5FiveVertexSeamDistancesM'])==5
   assert len(g['realRoad5ToRoad6FiveVertexSeamDistancesM'])==5
   assert max(g['realRoad4ToRoad5FiveVertexSeamDistancesM'])<1e-5
   assert max(g['realRoad5ToRoad6FiveVertexSeamDistancesM'])<1e-5
   for road in ('realRoad5Geometry','realRoad6Geometry'):
    gg=g[road]
    assert gg['minFrameNormalY']>.75
    assert 0<=gg['maxNeighbourFrameNormalDegrees']<25
    assert 14<=gg['minWidthXZ']<=gg['maxWidthXZ']<=18
   assert g['realRoad4To5HeadingAngleDegrees']<20
   assert g['realRoad5To6HeadingAngleDegrees']<20
   assert len(g['oldFinalFinishCentreStillAtXYZ'])==3
   assert re.fullmatch('[0-9a-f]{64}',g['actualPhysicalGeometrySHA256'])
   assert g['missingOriginalB51RelocationOrPlayabilityCheck'] is True
   assert g['originalGuideMayBeMisaligned'] is True
   assert g['originalHumanNativeControlsUnproven'] is True
   assert g['sourceWebGLRendered'] is False
   assert g['actualFullCourseFinished'] is False
   assert g['officialArtAdopted']==g['officialSlope2Metres']==0
   assert g['GAMEPLAY']==g['ART']==g['HUMAN']==g['RELEASE']=='HOLD'
   assert r['originalNativeRunnerStatus'] in ('failed','finished','running')
   assert r['actualFinishedAllSevenRoads']==(r['originalNativeRunnerStatus']=='finished')
   assert 21.5<r['terminalTimeOr95sCap']<=95.00001
   assert r['priorR15S3D8R1Original65sStatus']=='failed'
   assert r['priorR15S3D8R1Original65sRoad4SupportedSeconds']>12
   assert 58<r['priorR15S3D8R1TerminalSeconds']<59.2
   assert r['actualPhysicalRoads']==7 and r['originalPhysicalB51']==28
   assert r['genuineRunnerClockWasNotAltered'] is True
   assert r['originalSourceGameOrEngineModified'] is False
   assert r['humanGameplayOrVisualArtAccepted'] is False
   for k in ('trueSCISSORGroundSeconds','trueLOWERGroundSeconds',
             'trueFollowingB48GroundSeconds','trueOriginalRoad5GroundSeconds',
             'trueOriginalRoad6GroundSeconds'):
    assert 0<=r[k]<=r['terminalTimeOr95sCap']
   for k,seconds in (('firstOriginalRoad5TrueContact','trueOriginalRoad5GroundSeconds'),
                     ('firstOriginalRoad6TrueContact','trueOriginalRoad6GroundSeconds'),
                     ('firstFollowingB48TrueContact','trueFollowingB48GroundSeconds')):
    assert (r[k] is None)==(r[seconds]==0)
    if r[k]:
     assert 0<=r[k]['roadUProxy']<=1
     assert len(r[k]['xyz'])==3 and 0<r[k]['t']<=r['terminalTimeOr95sCap']
   assert len(r['largestRoadUProjectionProxy'])==5
   assert all(0<=v<=1 for v in r['largestRoadUProjectionProxy'])
   assert r['originalNativeMovingContactEvents']>=0
   assert r['actualNegativeForwardGroundedTicksAfter23']>=0
   peak=r['largestWhole240HzTickVelocityChangeAfter23']
   assert peak['tick'] is not None and peak['valueMps']>0
   timeline=r['genuineNative10HzAndContactTimeline']
   assert len(timeline)>30
   assert all(a['tick']<b['tick'] for a,b in zip(timeline,timeline[1:]))
   for t in timeline:
    assert t['status'] in ('running','failed','finished')
    assert 23<=t['t']<=r['terminalTimeOr95sCap']+.000001
    assert -1<=t['actualLegalSteeringInput']<=1
    assert len(t['xyz'])==len(t['velocityXYZ'])==len(t['forwardXYZ'])==3
    assert abs(mag(t['velocityXYZ'])-t['nativeTrueSpeedMps'])<.00002
    assert abs(sum(a*b for a,b in zip(t['velocityXYZ'],t['forwardXYZ']))-t['signedNativeForwardMps'])<.0008
    assert t['originalFixedCollisionCountDelta']>=0
    if t['road'] is None:
     assert t['onRoadUProxy'] is None and t['signedPhysicalRoadTangentMps'] is None
   summaries.append({'world':world,'mode':mode,'status':r['originalNativeRunnerStatus'],
    'nativeTerminalOrCapSeconds':r['terminalTimeOr95sCap'],
    'trueRoad5ContactSeconds':r['trueOriginalRoad5GroundSeconds'],
    'trueRoad6ContactSeconds':r['trueOriginalRoad6GroundSeconds'],
    'actualFinishedByNativeRunner':r['actualFinishedAllSevenRoads'],
    'originalCrownSourceParity':2,'sourceART':'HOLD','sourceGAMEPLAY':'HOLD'})
 return summaries
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args()
 d=json.loads(Path(a.source).read_text());evidence=verify(d)
 tests=(
  ('fake-finish',lambda x:x['cases'][WORLDS[0]][MODES[0]].update(actualFinishedAllSevenRoads=not x['cases'][WORLDS[0]][MODES[0]]['actualFinishedAllSevenRoads'])),
  ('fake-WebGL',lambda x:x.update(sourceFullBrowserWebGL=True)),
  ('fake-human',lambda x:x.update(humanControlPassed=True)),
  ('fake-main',lambda x:x['cases'][WORLDS[1]][MODES[1]]['actualGeometry'].update(unchangedCompleteRoads0Through4=False)),
  ('fake-hazards',lambda x:x['cases'][WORLDS[0]][MODES[1]]['actualGeometry'].update(originalMovingB51Count=0)),
  ('fake-physics',lambda x:x.update(physicsHz=60)),
  ('fake-invisible',lambda x:x['cases'][WORLDS[1]][MODES[0]]['actualGeometry'].update(newHiddenRoadsOrPhysicsColliders=1)),
  ('fake-geometry',lambda x:x['cases'][WORLDS[1]][MODES[1]]['actualGeometry']['realRoad5Geometry'].update(minFrameNormalY=-.95)),
  ('fake-gap',lambda x:x['cases'][WORLDS[0]][MODES[1]]['actualGeometry'].update(genuineB48GapCellsOnRoad5=0)),
  ('fake-prefix',lambda x:x['cases'][WORLDS[0]][MODES[0]].update(originalSourcePrefixChecks=1)),
  ('fake-speed',lambda x:x['cases'][WORLDS[0]][MODES[0]]['genuineNative10HzAndContactTimeline'][10].update(nativeTrueSpeedMps=999)),
  ('fake-road5-contact',lambda x:x['cases'][WORLDS[1]][MODES[1]].update(trueOriginalRoad5GroundSeconds=-1))
 )
 rejected=[]
 for name,fn in tests:
  t=copy.deepcopy(d);fn(t)
  try:verify(t)
  except (AssertionError,KeyError,TypeError,ValueError,ZeroDivisionError):rejected.append(name)
  else:raise AssertionError('forged source accepted '+name)
 assert len(rejected)==12
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D9_FOUR_REAL_PHYSICS_95S_SOURCE_ONLY_INDEPENDENT_QA.json').write_text(
  json.dumps({'actualSourceNativeCases':evidence,'rejectedFalseClaims':rejected,
    'originalSourcePhysicallyTested':True,'nativeEntireCourseFinished':sum(int(x['actualFinishedByNativeRunner']) for x in evidence),
    'humanPlayabilityApproved':False,'actualGameWebGLRendered':False,'ART':'HOLD','GAMEPLAY':'HOLD'},
   ensure_ascii=False,indent=2)+'\n')
 print('R15S3D9_4_CASE_NATIVE_SOURCE_QA',len(evidence),'original 240Hz trials',len(rejected),'fake claims rejected',
  'finished',sum(int(x['actualFinishedByNativeRunner']) for x in evidence))
if __name__=='__main__':main()
