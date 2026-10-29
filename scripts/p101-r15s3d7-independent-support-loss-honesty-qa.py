#!/usr/bin/env python3
"""R15S3D7 independent numeric consistency / no false-cause or gameplay QA.
Validation of the native-data artifact, not a second independent 240Hz Runner.
"""
import argparse,copy,json,math
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
HOLDS=('GAMEPLAY','ART','HUMAN','PERFORMANCE','INTEGRATION','RELEASE','MERGE')
def norm(v):return math.sqrt(sum(x*x for x in v))
def calc(v,w):return norm([y-x for x,y in zip(v,w)])
def check(d):
 assert d['schema']=='dopagaki.r15s3d7-native-source-34p5-support-loss-observational/1'
 assert d['sourceOriginalBlob']==SHA and d['sourceHz']==240 and d['sourceBallRadiusM']==.65
 assert d['actualSourceWorlds']==2 and d['realB48Count']==7 and d['movingObstacleB51Count']==28
 assert d['extraPhysicsColliders']==0 and d['sourceRunnerSteeringCameraGuideModified'] is False
 assert d['original17And21p5PrefixPreserved'] is True and d['observationalOnly'] is True
 assert d['CCDInstantaneousCollisionNormalMeasured'] is False
 assert d['individualFixedCollisionImpulseMeasured'] is False
 assert d['sourceCausalExplanationProven'] is False
 assert d['sourceSupportMeaning'].startswith('contacts() PRE-STEP')
 assert d['geometricEdgeClearanceMeaning'].find('NOT true collider exact')!=-1
 assert d['timeWindowSeconds']==[34.25,34.75]
 assert d['officialART']==d['officialSlope2Metres']==0
 assert d['actualBrowserWebGL'] is False and d['humanFairnessEstablished'] is False
 assert all(d[k]=='HOLD' for k in HOLDS)
 assert set(d['results'])==set(WORLDS)
 reports=[]
 for w in WORLDS:
  c=d['results'][w]
  assert c['world']==w and c['prefixTicks']==[4080,5160]
  assert c['sourceR1NativeTelemetryParity'] is True
  assert c['priorR1NativeTimelineSamplesMatched']>100
  assert c['nativeTerminalStatus']=='failed'
  assert 38.3<c['nativeTerminalTimeSeconds']<38.6
  assert 2.0<c['actualLowerGroundedSeconds']<3.0
  assert c['actualScissorGroundedSeconds']>1.0
  s=c['allNative240HzWindowSamples']
  assert len(s)==121
  assert [r['tick'] for r in s]==list(range(8220,8341))
  observed=[]
  for r in s:
   assert abs(r['timeSeconds']-r['tick']/240)<1.5e-6
   assert -1<=r['actualNativeSteer']<=1
   assert r['nativeStatus']=='running'
   for k in ('prePositionXYZ','postPositionXYZ','preVelocityXYZ','postVelocityXYZ','preForwardXYZ','postForwardXYZ'):
    assert len(r[k])==3 and all(math.isfinite(x) for x in r[k])
   assert r['nativeRunnerCollisionDelta']>=0
   assert abs(calc(r['preVelocityXYZ'],r['postVelocityXYZ'])-r['fullStepDeltaVelocityMps'])<6e-6
   assert abs(sum(a*b for a,b in zip(r['postVelocityXYZ'],r['postForwardXYZ']))-r['nativeForwardSpeedMps'])<.0007
   assert abs(sum(a*b for a,b in zip(r['postVelocityXYZ'],r['roadFrameTangentAtProxyXYZ']))-r['roadTangentForwardSpeedMps'])<.0007
   assert r['nativeRunnerGrounded']==(r['preStepSelectedSupport'] is not None)
   assert r['nativeRunnerRoad']==(r['preStepSelectedSupport']['road'] if r['preStepSelectedSupport'] else None)
   for k in ('preStepSelectedSupport','preStepClosestCollisionContact','postStepProspectiveSupport','postStepNearestCollisionContact'):
    contact=r[k]
    if contact is None:continue
    assert contact['distanceM']<=.691 and contact['distanceM']>=0
    assert len(contact['pointXYZ'])==len(contact['normalXYZ'])==len(contact['triangleNormalXYZ'])==3
    assert abs(norm(contact['normalXYZ'])-1)<.003
    if k.endswith('Support'):
     assert contact['triangleRideable'] is True and contact['normalXYZ'][1]>.15
   for k in ('centerlineNearest3DPolylineDistanceM','leftEdge3DPolylineDistanceM',
             'rightEdge3DPolylineDistanceM','leftEdgeXZPolylineDistanceM','rightEdgeXZPolylineDistanceM'):
    assert math.isfinite(r[k]) and r[k]>=0
   assert 0<=r['nearestRoadCentreUProjectionProxy']<=1
   assert abs(norm(r['roadFrameTangentAtProxyXYZ'])-1)<.002
   assert abs(norm(r['roadFrameNormalAtProxyXYZ'])-1)<.002
   assert r['nativeGuidePreStep']['source'] in ('original-generated-surface','original-document-route')
   assert r['nativeGuidePostStep']['source'] in ('original-generated-surface','original-document-route')
   observed.append(r['fullStepDeltaVelocityMps'])
  assert abs(max(observed)-c['maxNativePerStepDeltaInWindowMps'])<.000001
  supports=[r for r in s if r['preStepSelectedSupport'] and r['preStepSelectedSupport']['road']=='p93-LOWER_REVERSAL-01']
  assert len(supports)>0
  last=supports[-1]
  next_sample=next(r for r in s if r['tick']==last['tick']+1)
  assert next_sample['preStepSelectedSupport'] is None or next_sample['preStepSelectedSupport']['road']!='p93-LOWER_REVERSAL-01'
  assert c['lastSupportedTick']==last['tick'] and c['firstUnsupportedTick']==next_sample['tick']
  assert c['lastSupportedTimeSeconds']==last['timeSeconds']
  assert c['lastSupportedContact']==last['preStepSelectedSupport']
  assert c['firstUnsupportedPreStepNearestContact']==next_sample['preStepClosestCollisionContact']
  assert c['lastSupportedPositionXYZ']==last['prePositionXYZ']
  assert c['firstUnsupportedPrePositionXYZ']==next_sample['prePositionXYZ']
  assert c['lastSupportedRoadCentreUProxy']==last['nearestRoadCentreUProjectionProxy']
  for name,k in (('lastSupportedLeftEdge3DM','leftEdge3DPolylineDistanceM'),
                 ('lastSupportedRightEdge3DM','rightEdge3DPolylineDistanceM'),
                 ('lastSupportedLeftEdgeXZApproxM','leftEdgeXZPolylineDistanceM'),
                 ('lastSupportedRightEdgeXZApproxM','rightEdgeXZPolylineDistanceM')):
   assert c[name]==last[k]
  rows=c['realOriginalB48Rows6To22Geometry']
  assert [r['row'] for r in rows]==list(range(6,23))
  for row in rows:
   assert abs(row['u']-row['row']/30)<2e-6
   for k in ('centerXYZ','actualSurfaceCenterTangentXYZ','actualSampledFrameNormalXYZ'):
    assert len(row[k])==3 and all(math.isfinite(x) for x in row[k])
   assert row['actualSurfaceWidthXZ']>0
   assert 0<=row['normalAngleAcross0p02UProxyDegrees']<=180
   assert abs(norm(row['actualSurfaceCenterTangentXYZ'])-1)<.002
  reports.append({'world':w,'nativeTickParity':c['priorR1NativeTimelineSamplesMatched'],
                  'lastSupportedTick':c['lastSupportedTick'],
                  'supportNormal':c['lastSupportedContact']['normalXYZ'],
                  'lastSupportedRoadUProxy':c['lastSupportedRoadCentreUProxy'],
                  'lastSupportedEdgeXZDistancesM':[c['lastSupportedLeftEdgeXZApproxM'],c['lastSupportedRightEdgeXZApproxM']],
                  'largestObservedWholeTickDeltaMps':c['maxNativePerStepDeltaInWindowMps'],
                  'causalConclusion':'HOLD'})
 return reports
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args();raw=json.loads(Path(a.source).read_text());results=check(raw)
 falsifications=(
  ('fake-collision-normal-proof',lambda x:x.update(CCDInstantaneousCollisionNormalMeasured=True)),
  ('fake-causal-conclusion',lambda x:x.update(sourceCausalExplanationProven=True)),
  ('fake-human',lambda x:x.update(humanFairnessEstablished=True)),
  ('fake-gameplay',lambda x:x.update(GAMEPLAY='PASS')),
  ('fake-webgl',lambda x:x.update(actualBrowserWebGL=True)),
  ('fake-source',lambda x:x.update(sourceOriginalBlob='deadbeef')),
  ('fake-prefix',lambda x:x['results']['true-pinch'].update(prefixTicks=[])),
  ('fake-last-support-tick',lambda x:x['results']['pinch-switch'].update(lastSupportedTick=999)),
  ('fake-contact',lambda x:x['results']['true-pinch']['allNative240HzWindowSamples'][70].update(nativeRunnerGrounded=False)),
  ('fake-speed',lambda x:x['results']['pinch-switch']['allNative240HzWindowSamples'][60].update(postVelocityXYZ=[600,0,0])),
  ('fake-geometry',lambda x:x['results']['true-pinch']['realOriginalB48Rows6To22Geometry'][5].update(actualSurfaceWidthXZ=0)),
  ('fake-independent-window',lambda x:x['results']['pinch-switch'].update(maxNativePerStepDeltaInWindowMps=999)),
 )
 rejected=[]
 for name,fn in falsifications:
  bad=copy.deepcopy(raw);fn(bad)
  try:check(bad)
  except (AssertionError,TypeError,KeyError,ZeroDivisionError,ValueError):rejected.append(name)
  else:raise AssertionError('false approval accepted '+name)
 assert len(rejected)==12
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D7_INDEPENDENT_SOURCE_CONSISTENCY_AND_CAUSAL_HOLD.json').write_text(
  json.dumps({'results':results,'rejectedFalsifications':rejected,'SOURCE_TECH':'OBSERVATIONAL_ONLY',
              'GAMEPLAY':'HOLD','ART':'HOLD','CCDIndividualImpulseKnown':False,
              'actualBrowserWebGL':False,'humanFairnessCertified':False},indent=2,ensure_ascii=False)+'\n')
 print('R15S3D7_NATIVE_FORENSIC_INDEPENDENT_QA',len(results),'worlds',len(rejected),'forged claims rejected')
if __name__=='__main__':main()
