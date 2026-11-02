#!/usr/bin/env python3
"""R15S3D6 independent source-consistency QA. Does not certify gameplay.
Never turn real Runner 'running' into finished or count graphical roads as B48.
"""
import argparse,copy,json,math,re
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
MODES=('A_EARLY_DESCENT_SUPPORT','B_LOW_ANGLE_RECONTACT')
HOLDS=('GAMEPLAY','ART','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE')
def norm(x):return math.sqrt(sum(v*v for v in x))
def verify(doc):
 assert doc['schema']=='dopagaki.r15s3d6-genuine-B48-two-hypotheses-four-original-240hz-trials/1'
 assert doc['originalSourceBlob']==SHA and doc['sourceRunnerHz']==240 and doc['sourceRadiusM']==.65
 assert doc['actualNativeCases']==4 and doc['genuinePhysicalB48Changed'] is True
 assert doc['sourceOriginalPhysicalRunnerUnchanged'] is True
 assert doc['noHiddenCollisionOrTeleport'] is True
 assert doc['roadCount']==7 and doc['movingB51Count']==28
 assert doc['reusedOriginal17And21p5Prefix'] is True
 assert doc['oldR15S3D4UsedOnlyAsComparison'] is True
 assert doc['standardActualCameraRendered'] is False
 assert doc['actualBrowserWebGLTested'] is False and doc['humanFairnessEstablished'] is False
 assert doc['officialArt']==doc['officialSlope2Meters']==0
 assert all(doc[k]=='HOLD' for k in HOLDS)
 assert doc['sourceTechnicalExecution']=='FOUR_NATIVE_REPLAY_COMPLETED_UNDER_SOURCE_ONLY_REQUIREMENTS'
 assert set(doc['cases'])==set(WORLDS)
 report=[]
 for w in WORLDS:
  assert set(doc['cases'][w])==set(MODES)
  for mode in MODES:
   c=doc['cases'][w][mode];g=c['geometry']
   assert (c['world'],c['mode'])==(w,mode)
   assert c['originalPrefixChecks']==2
   assert g['schema']=='R15S3D6-real-B48-candidate/1'
   assert g['world']==w and g['mode']==mode
   assert g['sourceBlob']==SHA and g['studyOnly'] is True
   assert g['actualPhysicalEditedSections']==[2,3]
   assert g['originalCrownB16AndEarlySCISSORPreserved'] is True
   assert g['originalB51Count']==28 and g['physicsSteeringGuideCameraChanged'] is False
   assert g['hiddenPhysicalColliders']==0
   assert g['seamXYZM']<0.00001
   assert g['firstFourNextRowsHaveContinuedTangent'] is True
   assert g['maxOriginalSCISSORVertexDisplacementM']>10
   assert len(g['actualChangedB48ControlPointHashes'])==2
   assert all(re.fullmatch('[0-9a-f]{64}',v) for v in g['actualChangedB48ControlPointHashes'])
   assert g['actualWebGLPassed'] is False and g['humanFairnessCertified'] is False
   assert g['officialArt']==g['officialSlope2Meters']==0
   assert all(g[k]=='HOLD' for k in ('GAMEPLAY','ART','HUMAN','RELEASE'))
   assert c['trueNativeTerminalState'] in ('failed','finished','running')
   assert c['trueFinishedAllSevenRoads']==(c['trueNativeTerminalState']=='finished')
   assert 17<c['terminalOrCapSeconds']<=45.00001
   assert c['actualScissorGroundedSeconds']>=0
   assert c['actualNextRoadGroundedSeconds']>=0
   assert c['nativeActualMaxSpeedMps']>50 and math.isfinite(c['nativeActualMaxSpeedMps'])
   assert c['lateGroundedTicks']>=0
   assert 0<=c['lateGroundedNativeForwardBelow25Ticks']<=c['lateGroundedTicks']
   assert 0<=c['lateGroundedNativeForwardNegativeTicks']<=c['lateGroundedNativeForwardBelow25Ticks']
   assert 0<=c['actualNextRoadNativeForwardNegativeTicks']<=round(c['actualNextRoadGroundedSeconds']*240+.1)
   assert c['actualNextRoadFirstContact'] is None if c['actualNextRoadGroundedSeconds']==0 else c['actualNextRoadFirstContact'] is not None
   assert c['actualNextRoadLastContact'] is None if c['actualNextRoadGroundedSeconds']==0 else c['actualNextRoadLastContact'] is not None
   assert c['originalMovingB51ContactEvents']>=0
   assert c['maximumTotalOne240HzTickVelocityChangeAfter23Seconds']['deltaVelocityMps']>=0
   assert c['maximumTotalOne240HzTickVelocityChangeAfter23Seconds']['tick'] is not None
   assert 0<=c['largestHorizontalVelocityHeadingChangeOne240HzTickAfter23Seconds']['degrees']<=180
   assert c['R15S3D4TruePinchOrSwitchLMaxVelocityDeltaForReferenceMps']>70
   assert c['comparisonOnly_CannotClaimImpactBetterIfFirstLandingTimeDifferent'] is True
   assert c['standardGameWebGLTested'] is False
   assert c['humanGameplayPassed'] is False and c['officialArtAdopted'] is False
   for key in ('actualNextRoadFirstContact','actualNextRoadLastContact','lastScissorContact'):
    item=c[key]
    if item is not None:
     assert 0<item['timeSeconds']<=c['terminalOrCapSeconds']+.000002
     assert item['tick']>0 and len(item['xyz'])==3 and all(math.isfinite(x) for x in item['xyz'])
   transitions=c['sourceContactTransitions'];timeline=c['actualNativeTenHzPlusTransitionTimeline']
   assert len(timeline)>10
   assert all(a['tick']<b['tick'] for a,b in zip(timeline,timeline[1:]))
   assert all(a['tick']<b['tick'] for a,b in zip(transitions,transitions[1:]))
   for e in timeline:
    assert e['status'] in ('failed','finished','running')
    assert 0<=e['timeSeconds']<=c['terminalOrCapSeconds']+.000002
    assert len(e['positionXYZ'])==len(e['velocityXYZ'])==len(e['forwardXYZ'])==3
    assert abs(e['actualNativeSpeedMps']-norm(e['velocityXYZ']))<.00001
    assert -1<=e['legalInput']<=1
    assert abs(e['signedNativeForwardSpeedMps']-sum(x*y for x,y in zip(e['velocityXYZ'],e['forwardXYZ'])))<.0006
    if e['sourceGroundRoad'] is None:
     assert e['trueB48NearestCenterlineUProxy'] is None
     assert e['signedSourceRoadTangentMps'] is None
    else:
     assert 0<=e['trueB48NearestCenterlineUProxy']<=1
   orientation=c['compare31p4To31p6']
   if orientation is not None:
    assert len(orientation['samples'])==2
    assert orientation['samples'][0]['tick']==7536 and orientation['samples'][1]['tick']==7584
    for sample in orientation['samples']:
     assert len(sample['velocityXYZ'])==len(sample['nativeForwardXYZ'])==len(sample['nativeGuideForwardXYZ'])==3
     assert sample['nativeGuideSource'] in ('generated-surface','original-route')
    for k in ('ballHorizontalDirection31p4To31p6Degrees','actualForwardHorizontal31p4To31p6Degrees','guideHorizontalDirection31p4To31p6Degrees'):
     assert orientation[k] is None or 0<=orientation[k]<=180
   report.append({'world':w,'mode':mode,'trueTerminalState':c['trueNativeTerminalState'],
     'endSeconds':c['terminalOrCapSeconds'],'SCISSORGroundSeconds':c['actualScissorGroundedSeconds'],
     'nextB48GroundSeconds':c['actualNextRoadGroundedSeconds'],
     'peakTotalPerTickVelocityChangeMps':c['maximumTotalOne240HzTickVelocityChangeAfter23Seconds']['deltaVelocityMps'],
     'originalRouteUnchanged':True,'SOURCE_TECH':'ONLY','GAMEPLAY':'HOLD','ART':'HOLD'})
 return report

def main():
 p=argparse.ArgumentParser()
 p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 x=p.parse_args()
 raw=json.loads(Path(x.source).read_text())
 verified=verify(raw)
 bad=(
 ('fake-gameplay',lambda q:q.update(GAMEPLAY='PASS')),
 ('fake-art',lambda q:q.update(officialArt=1)),
 ('fake-human',lambda q:q.update(humanFairnessEstablished=True)),
 ('fake-webgl',lambda q:q.update(actualBrowserWebGLTested=True)),
 ('fake-physics',lambda q:q.update(sourceRunnerHz=60)),
 ('fake-collider',lambda q:q.update(noHiddenCollisionOrTeleport=False)),
 ('fake-B51',lambda q:q['cases'][WORLDS[0]][MODES[0]]['geometry'].update(originalB51Count=27)),
 ('fake-prefix',lambda q:q['cases'][WORLDS[1]][MODES[1]].update(originalPrefixChecks=0)),
 ('fake-seam',lambda q:q['cases'][WORLDS[0]][MODES[1]]['geometry'].update(seamXYZM=3)),
 ('fake-terminal',lambda q:q['cases'][WORLDS[0]][MODES[0]].update(trueFinishedAllSevenRoads=True if q['cases'][WORLDS[0]][MODES[0]]['trueNativeTerminalState']!='finished' else False)),
 ('fake-speed',lambda q:q['cases'][WORLDS[0]][MODES[1]]['actualNativeTenHzPlusTransitionTimeline'][10].update(actualNativeSpeedMps=9999)),
 ('fake-unsafe-input',lambda q:q['cases'][WORLDS[1]][MODES[1]]['actualNativeTenHzPlusTransitionTimeline'][10].update(legalInput=999)),
 )
 rejected=[]
 for name,edit in bad:
  forged=copy.deepcopy(raw);edit(forged)
  try:verify(forged)
  except (AssertionError,KeyError,ValueError,TypeError,ZeroDivisionError):
   rejected.append(name)
  else:raise AssertionError('FORGED evidence accepted: '+name)
 assert len(rejected)==12
 out=Path(x.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D6_INDEPENDENT_SOURCE_ONLY_VETO_AND_RESULTS.json').write_text(
  json.dumps({'SOURCE_TECH':'CHECKS_COMPLETE','trueNativeCases':verified,
   'independentRejectedFalseClaims':rejected,'allRoadsGameplayCertified':False,
   'sourceWebGLCertified':False,'humanFairnessCertified':False,
   'officialART':0,'officialSlope2Metres':0},ensure_ascii=False,indent=2)+'\n')
 print('R15S3D6_SOURCE_ONLY verified 4 genuine native cases, 12 false certification claims rejected')
if __name__=='__main__':main()
