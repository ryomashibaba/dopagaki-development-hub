#!/usr/bin/env python3
"""R15S3D6R1: verify source-native lower B48 runout trial and refuse false promotion."""
import argparse,copy,json,math
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
HOLDS=('GAMEPLAY','ART','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE')
MODE='B_RUNOUT_SUPPORT'
def norm(a):return math.sqrt(sum(x*x for x in a))
def check(d):
 assert d['schema']=='dopagaki.r15s3d6r1-genuine-B48-downstream-two-original-240hz-trials/1'
 assert d['originalSourceBlob']==SHA and d['sourceRunnerHz']==240 and d['sourceRadiusM']==.65
 assert d['actualNativeCases']==2 and d['genuinePhysicalB48Changed'] is True
 assert d['sourceOriginalPhysicalRunnerUnchanged'] is True and d['noHiddenCollisionOrTeleport'] is True
 assert d['roadCount']==7 and d['movingB51Count']==28
 assert d['reusedOriginal17And21p5Prefix'] is True
 assert d['R15S3D6BaselineBUsedOnlyAsComparison'] is True
 assert d['standardActualCameraRendered'] is False and d['actualBrowserWebGLTested'] is False
 assert d['humanFairnessEstablished'] is False and d['officialArt']==d['officialSlope2Meters']==0
 assert d['sourceTechnicalExecution']=='TWO_NATIVE_REPLAY_COMPLETED_UNDER_SOURCE_ONLY_REQUIREMENTS'
 assert all(d[k]=='HOLD' for k in HOLDS)
 assert set(d['cases'])==set(WORLDS)
 report=[]
 for w in WORLDS:
  assert set(d['cases'][w])=={MODE}
  c=d['cases'][w][MODE];g=c['geometry']
  assert c['world']==w and c['mode']==MODE
  assert c['originalPrefixChecks']==2
  assert g['sourceOriginalBlob']==SHA and g['world']==w
  assert g['originalB48']==7 and g['originalMovingB51']==28
  assert g['originalRunnerGuideSteerCameraChanged'] is False
  assert g['originalCrownAndSCISSORUnchanged'] is True
  assert g['modifiedB48Section']==3 and g['modifiedControlGridRows']==[2,19]
  assert g['firstTwoAndLastElevenRowsFrozen'] is True
  assert g['maxActualLowerControlYDisplacementM']>8
  assert g['noAddedGhostCollider'] is True and g['sourceWebGL'] is False and g['humanQA'] is False
  assert g['officialArt']==g['officialSlope2Meters']==0 and g['GAMEPLAY']==g['ART']=='HOLD'
  assert c['trueNativeTerminalState'] in ('failed','running','finished')
  assert c['trueFinishedAllSevenRoads']==(c['trueNativeTerminalState']=='finished')
  assert 17<c['terminalOrCapSeconds']<=45.00001
  assert c['actualNextRoadGroundedSeconds']>=0
  assert c['actualScissorGroundedSeconds']>=0
  assert c['lateGroundedNativeForwardNegativeTicks']<=c['lateGroundedNativeForwardBelow25Ticks']<=c['lateGroundedTicks']
  assert c['originalMovingB51ContactEvents']>=0
  assert 0<=c['actualNextRoadNativeForwardNegativeTicks']<=round(c['actualNextRoadGroundedSeconds']*240+.1)
  assert c['R15S3D6BaselineBMaxVelocityDeltaForReferenceMps']>40
  assert c['comparisonOnly_CannotClaimImpactBetterIfFirstLandingTimeDifferent'] is True
  assert c['maximumTotalOne240HzTickVelocityChangeAfter23Seconds']['deltaVelocityMps']>=0
  assert c['standardGameWebGLTested'] is False and c['humanGameplayPassed'] is False
  assert c['officialArtAdopted'] is False
  for k in ('actualNextRoadFirstContact','actualNextRoadLastContact','lastScissorContact'):
   v=c[k]
   if v is not None:
    assert v['tick']>0 and 0<v['timeSeconds']<=c['terminalOrCapSeconds']+.000002
    assert len(v['xyz'])==3 and all(math.isfinite(x) for x in v['xyz'])
  lines=c['actualNativeTenHzPlusTransitionTimeline']
  assert len(lines)>20
  assert all(x['tick']<y['tick'] for x,y in zip(lines,lines[1:]))
  for x in lines:
   assert 0<x['timeSeconds']<=c['terminalOrCapSeconds']+.000002
   assert len(x['positionXYZ'])==len(x['velocityXYZ'])==len(x['forwardXYZ'])==3
   assert abs(norm(x['velocityXYZ'])-x['actualNativeSpeedMps'])<.00001
   assert abs(sum(a*b for a,b in zip(x['velocityXYZ'],x['forwardXYZ']))-x['signedNativeForwardSpeedMps'])<.0006
   assert -1<=x['legalInput']<=1
  events=c['sourceContactTransitions']
  assert all(x['tick']<y['tick'] for x,y in zip(events,events[1:]))
  report.append({'world':w,'actualSourceStatus':c['trueNativeTerminalState'],
   'terminalSeconds':c['terminalOrCapSeconds'],
   'nextRoadTrueGroundedSeconds':c['actualNextRoadGroundedSeconds'],
   'maxStepDeltaMps':c['maximumTotalOne240HzTickVelocityChangeAfter23Seconds']['deltaVelocityMps'],
   'previousBMaxStepDeltaMps':c['R15S3D6BaselineBMaxVelocityDeltaForReferenceMps'],
   'sourceTechnicalOnly':True,'gameplayCertified':False})
 return report
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args();d=json.loads(Path(a.source).read_text());results=check(d)
 edits=(
 ('fake-human',lambda x:x.update(humanFairnessEstablished=True)),
 ('fake-gameplay',lambda x:x.update(GAMEPLAY='PASS')),
 ('fake-collider',lambda x:x.update(noHiddenCollisionOrTeleport=False)),
 ('fake-crown',lambda x:x['cases']['true-pinch'][MODE]['geometry'].update(originalCrownAndSCISSORUnchanged=False)),
 ('fake-source',lambda x:x.update(originalSourceBlob='bad')),
 ('fake-physics',lambda x:x.update(sourceRunnerHz=60)),
 ('fake-B51',lambda x:x['cases']['pinch-switch'][MODE]['geometry'].update(originalMovingB51=20)),
 ('fake-prefix',lambda x:x['cases']['pinch-switch'][MODE].update(originalPrefixChecks=0)),
 ('fake-finish',lambda x:x['cases']['true-pinch'][MODE].update(trueFinishedAllSevenRoads=not x['cases']['true-pinch'][MODE]['trueFinishedAllSevenRoads'])),
 ('fake-speed',lambda x:x['cases']['true-pinch'][MODE]['actualNativeTenHzPlusTransitionTimeline'][20].update(actualNativeSpeedMps=999)),
 )
 rejected=[]
 for name,edit in edits:
  bad=copy.deepcopy(d);edit(bad)
  try:check(bad)
  except (AssertionError,TypeError,KeyError,ValueError,ZeroDivisionError):rejected.append(name)
  else:raise AssertionError('forged trial accepted: '+name)
 assert len(rejected)==10
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D6R1_TWO_WORLD_INDEPENDENT_SOURCE_QA.json').write_text(
   json.dumps({'results':results,'falseClaimsRejected':rejected,
    'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
    'sourceActualWebGL':False,'officialSlope2Metres':0},indent=2,ensure_ascii=False)+'\n')
 print('R15S3D6R1_SOURCE_ONLY 2 genuine original Runner cases, 10 forged claims rejected')
if __name__=='__main__':main()
