#!/usr/bin/env python3
"""R15S3D4 independent *consistency* QA: 240Hz forensic samples, not gameplay certification.
Checks source replay parity claims, per-tick numeric consistency, pre-step support correspondence,
and rejects deliberately false approvals. Cannot prove unexposed CCD impulse/contact normal.
"""
import argparse,copy,json,math
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
MODES=('L_WESTWARD_SUPPORT','M_LOWER_RECONTACT')
HOLDS=('GAMEPLAY','ART','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE')
def magnitude(a):
 return math.sqrt(sum(v*v for v in a))
def inspect(d):
 assert d['schema']=='dopagaki.r15s3d4-observational-prestep-support-velocity-discontinuity/1'
 assert d['sourceGameBlob']==SHA and d['sourcePhysicsHz']==240 and d['sourceBallRadiusM']==.65
 assert d['sameFourR15S3D3GeometryAndOriginalLegalInput'] is True
 assert d['originalSourceChanged'] is False
 assert d['trueCrownAndEarlyScissorFrozen'] is True
 assert d['originalB51Unmodified']==28 and d['extraGameColliders']==0
 assert d['observationalOnly'] is True and d['runnerCcdImpactNormalDirectlyAvailable'] is False
 assert d['sourceActualBrowserWebGL'] is False and d['humanFairnessEstablished'] is False
 assert d['officialArt']==0 and d['officialSlope2Meters']==0
 assert all(d[k]=='HOLD' for k in HOLDS)
 assert 'NOT CCD' in d['measuredNormalMeaning']
 assert 'NOT an isolated collision impulse' in d['measuredVelocityChangeMeaning']
 assert d['sampleWindowSeconds']==[30.75,33.4]
 assert set(d['cases'])==set(WORLDS)
 summaries=[]
 for world in WORLDS:
  assert set(d['cases'][world])==set(MODES)
  for mode in MODES:
   c=d['cases'][world][mode]
   assert c['world']==world and c['mode']==mode
   assert c['originalPrefixParityCount']==2
   assert all(c[f] is True for f in ('sourceR15S3D3StatusParity','sourceR15S3D3TerminalTimeParity','sourceR15S3D3RoadSupportParity','sourceR15S3D3B51ContactParity'))
   assert c['trueNativeStatus'] in ('running','failed','finished')
   assert 31.0<c['terminalSeconds']<=45.000003
   assert c['scissorGroundedSeconds']>=0 and c['nextRoadGroundedSeconds']>0
   assert c['originalB51ContactEvents']>=0
   samples=c['native240HzWindowSamples']
   assert len(samples)==c['windowSampleCount'] and len(samples)>600
   first=round(30.75*240)
   prev_tick=first-1
   peak_delta=0;peak_delta_tick=None;peak_angle=0;peak_angle_tick=None
   for s in samples:
    tick=s['tick']
    assert tick==prev_tick+1;prev_tick=tick
    assert first<=tick<=round(33.4*240)
    assert abs(s['timeSeconds']-tick/240)<2e-6
    assert -1<=s['legalSteer']<=1
    assert s['runnerStatus'] in ('running','failed','finished')
    assert s['runnerCollisionCountDelta']>=0
    for key in ('prePositionXYZ','postPositionXYZ','preVelocityXYZ','postVelocityXYZ'):
     assert len(s[key])==3 and all(math.isfinite(v) for v in s[key])
    dv=[b-a for a,b in zip(s['preVelocityXYZ'],s['postVelocityXYZ'])]
    measured=magnitude(dv)
    assert abs(measured-s['velocityChangeMps'])<.000006
    assert abs(s['wholeStepVelocityChangePerSecondMps2']-s['velocityChangeMps']*240)<.0002
    aa=s['preVelocityXYZ'];bb=s['postVelocityXYZ'];den=magnitude(aa)*magnitude(bb)
    angle=math.degrees(math.acos(max(-1,min(1,sum(a*b for a,b in zip(aa,bb))/den)))) if den>1e-8 else 0
    assert abs(angle-s['headingVelocityChangeDegrees'])<.0001
    support=s['nativePreStepRideableSupport']
    assert (support is not None)==s['nativeRunnerGroundedFromPreStep']
    assert (support['road'] if support else None)==s['nativeRunnerRoadFromPreStep']
    for contact in (support,s['nativePostStepProspectiveRideableSupport']):
     if contact is None:continue
     assert contact['part']=='top'
     assert contact['distanceM']>=0 and contact['distanceM']<=.691
     assert len(contact['normalXYZ'])==len(contact['triangleNormalXYZ'])==3
     assert all(math.isfinite(x) for x in contact['normalXYZ']+contact['triangleNormalXYZ'])
     assert abs(magnitude(contact['normalXYZ'])-1)<.001
    if measured>peak_delta:
     peak_delta=measured;peak_delta_tick=tick
    if angle>peak_angle:
     peak_angle=angle;peak_angle_tick=tick
   assert abs(peak_delta-c['peakWholeStepVelocityDelta']['deltaVelocityMps'])<.000006
   assert peak_delta_tick==c['peakWholeStepVelocityDelta']['tick']
   assert abs(peak_angle-c['peakWholeStepHeadingDelta']['degrees'])<.0001
   assert peak_angle_tick==c['peakWholeStepHeadingDelta']['tick']
   summaries.append(dict(world=world,mode=mode,terminal=c['trueNativeStatus'],nextRoadSeconds=c['nextRoadGroundedSeconds'],
     maximumWholeTickVelocityChangeMps=c['peakWholeStepVelocityDelta'],
     maximumWholeTickHeadingDegrees=c['peakWholeStepHeadingDelta']))
 return summaries
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args();d=json.loads(Path(a.source).read_text());summaries=inspect(d)
 forged=[]
 for name,fn in (
  ('fake-ccd-normal',lambda x:x.update(runnerCcdImpactNormalDirectlyAvailable=True)),
  ('fake-human',lambda x:x.update(HUMAN='PASS')),
  ('fake-gameplay',lambda x:x.update(GAMEPLAY='PASS')),
  ('fake-art',lambda x:x.update(officialArt=1)),
  ('fake-physics',lambda x:x.update(sourcePhysicsHz=60)),
  ('fake-collision-floor',lambda x:x.update(extraGameColliders=1)),
  ('fake-prefix',lambda x:x['cases'][WORLDS[0]][MODES[0]].update(originalPrefixParityCount=0)),
  ('fake-next-road',lambda x:x['cases'][WORLDS[1]][MODES[0]].update(nextRoadGroundedSeconds=0)),
  ('fake-impulse',lambda x:x['cases'][WORLDS[0]][MODES[0]]['native240HzWindowSamples'][100].update(velocityChangeMps=999)),
  ('fake-contact',lambda x:x['cases'][WORLDS[0]][MODES[0]]['native240HzWindowSamples'][100].update(nativeRunnerGroundedFromPreStep=not x['cases'][WORLDS[0]][MODES[0]]['native240HzWindowSamples'][100]['nativeRunnerGroundedFromPreStep'])),
  ('fake-heading',lambda x:x['cases'][WORLDS[0]][MODES[0]].update(peakWholeStepHeadingDelta={'degrees':999,'tick':1})),
 ):
  trial=copy.deepcopy(d);fn(trial)
  try:inspect(trial)
  except (AssertionError,KeyError,ValueError,TypeError,ZeroDivisionError):forged.append(name)
  else:raise AssertionError('false telemetry accepted: '+name)
 assert len(forged)==11
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D4_INDEPENDENT_CONSISTENCY_QA.json').write_text(json.dumps({
  'sourceIntegrity':'PASS','rejectedFalseClaims':forged,'genuineCases':summaries,
  'CCDContactImpulseDirectlyProven':False,'gameplayCertified':False,'artCertified':False
 },ensure_ascii=False,indent=2)+'\n')
 print('R15S3D4_INDEPENDENT_SOURCE_ONLY',len(summaries),'forensic trials',len(forged),'false claims rejected')
if __name__=='__main__':main()
