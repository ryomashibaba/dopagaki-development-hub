#!/usr/bin/env python3
"""R15S3D3 independent source/honesty QA: checks original Runner telemetry but never certifies gameplay."""
import argparse,copy,json,math
from pathlib import Path
WORLDS=('true-pinch','pinch-switch')
MODES=('L_WESTWARD_SUPPORT','M_LOWER_RECONTACT')
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
def check(d):
 assert d['sourceGameBlob']==SHA and d['sourcePhysicsHz']==240 and d['trueNativeTrialCount']==4
 assert d['originalB51DefinitionsPreserved'] is True and d['trueSourceCrownPreserved'] is True
 assert d['sourcePhysicsOrCameraModified'] is False and d['extraGameColliders']==0
 assert d['sourceWebGLRendered'] is False and d['humanFairnessEstablished'] is False
 assert d['officialArt']==d['officialSlope2Meters']==0
 assert all(d[k]=='HOLD' for k in ('ART','GAMEPLAY','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE'))
 assert set(d['cases'])==set(WORLDS)
 records=[]
 for world in WORLDS:
  assert set(d['cases'][world])==set(MODES)
  for mode in MODES:
   c=d['cases'][world][mode]
   assert c['world']==world and c['mode']==mode
   assert c['originalTrueB16SourcePrefixParityChecks']==2
   assert c['sourceB48Surfaces']==7 and c['original28MovingB51']==28
   assert c['trueNativeStatusAtEnd'] in ('failed','running','finished')
   assert c['actualFinishedEntireCourse']==(c['trueNativeStatusAtEnd']=='finished')
   assert c['artOrGameplayAdopted'] is False and c['sourceActualBrowserWebGL'] is False
   assert c['humanControlSuccessCertified'] is False
   s=c['sourcePhysicalDesignMetadata']
   assert s['sourceBlob']==SHA and s['world']==world and s['mode']==mode and s['studyOnly'] is True
   assert s['changedTruePhysicalB48Sections']==[2,3]
   assert s['freezeProvenCROWNEntireSurface'] is True and s['freezeEarlySCISSORRows0To11'] is True
   assert s['originalDynamicB51DefinitionsUnmodified']==28
   assert s['originalPhysicsCCDSteeringRouteAndCameraUnmodified'] is True
   assert s['newHiddenColliders']==0 and s['noTeleportOrForceAcceleration'] is True
   assert s['roadSeamCentrePositionGapM']<=.0001 and s['actualMaxVertexDisplacementM']>100
   assert s['sourceTrueSurfaceNormalAndHumanCollisionContinuityNotVerified'] is True
   assert s['originalRouteGuidanceMayNotMatchNewRoad'] is True and s['sourceActualWebGL'] is False
   assert s['officialArt']==s['officialSlope2Meters']==0
   assert c['nativeNextRoadContactEntered'] is None or c['actualNextRoadGroundedSeconds']>0
   samples=c['sourceNativeEveryTickTransitionAnd10HzGeometryProxy']
   assert len(samples)>25
   prev=0
   for p in samples:
    assert p['tick']>prev;prev=p['tick']
    assert 23<=p['timeSeconds']<=c['trueTerminalOrCapSeconds']+.000002
    assert all(math.isfinite(v) for v in p['positionXYZ']+p['velocityXYZ'])
    assert math.isfinite(p['scissorNearestSourceCenterlineDistance3DProxyM'])
    assert p['scissorNearestSourceCenterlineDistance3DProxyM']>=0
    assert 0<=p['scissorNearestSourceCenterlineUProxy']<=1
    assert p['trueNativeGrounded']==(p['contactRoad'] is not None)
    if not p['contactTransition']:assert p['tick']%24==0
   records.append({'world':world,'mode':mode,'status':c['trueNativeStatusAtEnd'],
    'scissorLastGrounding':c['sourceSCISSORLastGrounding'],
    'nextRoadRealContact':c['nativeNextRoadContactEntered'],
    'sourceSCISSORGroundedSeconds':c['actualSCISSORGroundedSeconds'],
    'transitionCount':sum(bool(p['contactTransition']) for p in samples)})
 return records
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--source',required=True);ap.add_argument('--out',required=True)
 a=ap.parse_args();d=json.loads(Path(a.source).read_text());rows=check(d)
 forged=[]
 for name,mutate in (
  ('fake-gameplay',lambda x:x.update(GAMEPLAY='PASS')),
  ('fake-human',lambda x:x.update(HUMAN='PASS')),
  ('fake-art',lambda x:x.update(officialArt=1)),
  ('fake-source',lambda x:x.update(sourceGameBlob='x')),
  ('fake-physics',lambda x:x.update(sourcePhysicsHz=60)),
  ('fake-hidden-floor',lambda x:x.update(extraGameColliders=1)),
  ('fake-next-contact',lambda x:x['cases']['true-pinch']['L_WESTWARD_SUPPORT'].update(nativeNextRoadContactEntered={'timeSeconds':25,'xyz':[0,0,0]},actualNextRoadGroundedSeconds=0)),
 ):
  z=copy.deepcopy(d);mutate(z)
  try:check(z)
  except (AssertionError,KeyError,TypeError,ValueError):forged.append(name)
  else:raise AssertionError('forgery accepted '+name)
 assert len(forged)==7
 Path(a.out).mkdir(parents=True,exist_ok=True)
 Path(a.out,'R15S3D3_INDEPENDENT_SOURCE_QA.json').write_text(json.dumps(
  {'sourceIntegrity':'PASS','forgeriesRejected':forged,'rows':rows,
   'GAMEPLAY':'HOLD','ART':'HOLD','HUMAN':'HOLD','RELEASE':'HOLD'},ensure_ascii=False,indent=2)+'\n')
 print('R15S3D3_SOURCE_ONLY_QA',json.dumps(rows),len(forged),'forgeries rejected')
if __name__=='__main__':main()
