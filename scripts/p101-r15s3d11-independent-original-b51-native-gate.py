#!/usr/bin/env python3
"""R15S3D11 independent recorded-physics integrity, not another Runner.
Collision and true finish vs derived object separations remain distinct.
"""
import argparse,copy,json,math
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS=('true-pinch','pinch-switch')
MODES=('A_EDGE_READABLE','B_INNER_CROSSING')
def verify(d):
 assert d['schema']=='dopagaki.r15s3d11-real-six-B51-4-original-240Hz-comparison/1'
 assert d['originalSourceGameBlob']==SHA and d['physicsHz']==240
 assert d['nativeTrials']==4 and d['realB48Count']==7 and d['realB51Count']==28
 assert d['relocatedB51PerVariant']==6
 assert d['sourceBaselineNativeFinish2of2'] is True
 assert d['fullOriginal240HzInputAndPower'] is True
 assert d['sourceCrownExpectedOriginalPrefix'] is True
 assert d['defaultProductionUnchanged'] is True
 assert d['sourceWebGLNotTested'] is True
 assert d['officialArtAdopted']==0 and d['humanPlayableApproved'] is False
 assert d['GAMEPLAY']==d['ART']==d['HUMAN']==d['RELEASE']=='HOLD'
 assert set(d['cases'])==set(WORLDS)
 results=[]
 for w in WORLDS:
  assert set(d['cases'][w])==set(MODES)
  for m in MODES:
   r=d['cases'][w][m]
   assert r['world']==w and r['mode']==m and r['originalCrownPrefixChecks']==2
   assert r['nativeStatus'] in ('failed','running','finished')
   assert r['nativeFinishEvents']==int(r['nativeStatus']=='finished')
   assert r['trueNativeFinished']==(r['nativeStatus']=='finished')
   if r['trueNativeFinished']:
    assert r['finalRoad']=='p93-FINISH_RIDGE-01'
    assert r['terminalGrounded'] is True
   assert 21.5<r['actualNativeTerminatedAtSeconds']<=95.00001
   assert 69<r['baselineSourceFinishSeconds']<71
   assert len(r['terminalXYZ'])==3 and all(math.isfinite(x) for x in r['terminalXYZ'])
   assert r['actualMovingB51ContactEvents']>=0
   assert r['peakTickWholeVelocityChangeMps']>=0
   assert 0<=r['numberMovingB51Within10m']<=r['numberMovingB51Within30m']<=28
   assert r['movingObjectTimeSamplesWithin30m']>=r['numberMovingB51Within30m']
   assert len(r['machineMinClearanceAll28'])==28
   assert len({x['id'] for x in r['machineMinClearanceAll28']})==28
   assert len(r['nearest10OriginalB51'])==10
   assert r['nearest10OriginalB51']==r['machineMinClearanceAll28'][:10]
   assert len(r['movedSixOriginalB51'])==6
   assert len({a['id'] for a in r['movedSixOriginalB51']})==6
   for ob in r['movedSixOriginalB51']:
    assert ob['positionChanged'] is True and ob['actualOriginalMovingSolid'] is True
    assert ob['roadIndex'] in (5,6)
    assert ob['alteredSourceObjectIndex'] in tuple(range(22,28))
    assert 0<=ob['laneV']<=1 and 0<=ob['u']<=1
    assert 14<=ob['realApproxWidthM']<=18
    assert len(ob['editedWorldXYZ'])==len(ob['originalWorldXYZ'])==3
    assert all(math.isfinite(x) for x in ob['editedWorldXYZ'])
   for ob in r['machineMinClearanceAll28']:
    assert ob['separation'] is None or math.isfinite(ob['separation'])
    assert ob['samplesWithin30m']>=ob['samplesWithin10m']>=0
   assert sum(x['samplesWithin30m']>0 for x in r['machineMinClearanceAll28'])==r['numberMovingB51Within30m']
   assert sum(x['samplesWithin10m']>0 for x in r['machineMinClearanceAll28'])==r['numberMovingB51Within10m']
   assert sum(x['samplesWithin30m'] for x in r['machineMinClearanceAll28'])==r['movingObjectTimeSamplesWithin30m']
   assert len(r['native5HzProgressSnapshots'])>50
   assert all(a['tick']<b['tick'] for a,b in zip(r['native5HzProgressSnapshots'],r['native5HzProgressSnapshots'][1:]))
   assert r['originalSourceRunGenuine'] is True
   assert r['sourcePhysicsAndB48Unchanged'] is True
   assert r['browserAndHumanNotTested'] is True
   assert r['GAMEPLAY']==r['ART']=='HOLD'
   results.append({'world':w,'mode':m,'nativeStatus':r['nativeStatus'],
    'seconds':r['actualNativeTerminatedAtSeconds'],'finishEvents':r['nativeFinishEvents'],
    'reachedWithin30m':r['numberMovingB51Within30m'],
    'reachedWithin10m':r['numberMovingB51Within10m'],
    'movingContactEvents':r['actualMovingB51ContactEvents']})
 return results
def main():
 p=argparse.ArgumentParser()
 p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args()
 source=json.loads(Path(a.source).read_text())
 cases=verify(source)
 tests=[
  ('fake-human',lambda x:x.update(humanPlayableApproved=True)),
  ('fake-gameplay',lambda x:x.update(GAMEPLAY='PASS')),
  ('fake-source',lambda x:x.update(originalSourceGameBlob='tampered')),
  ('fake-road-count',lambda x:x.update(realB48Count=8)),
  ('fake-hazard-count',lambda x:x.update(realB51Count=22)),
  ('fake-autopilot',lambda x:x.update(fullOriginal240HzInputAndPower=False)),
  ('fake-prefix',lambda x:x['cases'][WORLDS[0]][MODES[0]].update(originalCrownPrefixChecks=0)),
  ('fake-finish',lambda x:x['cases'][WORLDS[0]][MODES[0]].update(nativeFinishEvents=42)),
  ('fake-geometry',lambda x:x['cases'][WORLDS[1]][MODES[1]].update(sourcePhysicsAndB48Unchanged=False)),
  ('fake-new-B51',lambda x:x['cases'][WORLDS[1]][MODES[1]]['movedSixOriginalB51'][0].update(actualOriginalMovingSolid=False)),
  ('fake-near-miss',lambda x:x['cases'][WORLDS[0]][MODES[1]].update(numberMovingB51Within30m=999)),
  ('fake-sample',lambda x:x['cases'][WORLDS[1]][MODES[0]]['machineMinClearanceAll28'][0].update(samplesWithin30m=-1)),
 ]
 rejected=[]
 for name,mut in tests:
  fake=copy.deepcopy(source);mut(fake)
  try:verify(fake)
  except (AssertionError,ValueError,KeyError,TypeError):rejected.append(name)
  else:raise AssertionError('FORGED RECORD ACCEPTED: '+name)
 assert len(rejected)==12
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D11_INDEPENDENT_ORIGINAL_B51_NATIVE_QA.json').write_text(json.dumps(
  {'fourGenuinePhysicsCases':cases,'rejectedFalseClaims':rejected,
   'sourceNativeOnly':True,'realWebGLNotTested':True,'humanArtNotCertified':True,
   'GAMEPLAY':'HOLD','ART':'HOLD'},ensure_ascii=False,indent=2)+'\n')
 print('R15S3D11_ORIGINAL_QA',len(cases),'genuine Runner cases',len(rejected),'forged claims rejected',json.dumps(cases))
if __name__=='__main__':main()
