#!/usr/bin/env python3
"""Independent evidence QA for original WebGL2 real-camera art comparisons.
6 sessions: prior R15S3D13R1 SKYOPEN as art baseline in two worlds,
and two new giant landmark megacities x two native worlds.
It NEVER promotes ART just because static QA and screenshots exist.
"""
import json,copy,re,sys
from pathlib import Path
WORLDS=('true-pinch','pinch-switch')
MODES=('A_SKY_DELTA_CIVIC_CORE','B_CROWNED_OPEN_SKY_CITY')
TIMES=(54,58,61,64,67)
def inspect(d):
 assert d['schema']=='dopagaki.r15s3d15r1-real-original-drive3d-webgl2-macro-city-same-native-tick/1'
 assert d['cases']==6 and len(d['sessions'])==6
 assert d['sourceOriginalB48']==7 and d['sourceOriginalB51']==28
 assert d['originalGameSourceChanged'] is False
 assert d['trueNativeTickFrozenBeforeScreenshot'] is True
 assert d['strictlyRawUnfilteredOriginalCamera'] is True
 assert d['scriptedP96P94NotHuman'] is True
 assert d['formalARTApproved'] is False and d['genuineHandOperatedQA'] is False
 assert d['officialSlope2Meters']==0 and d['RELEASE']=='HOLD'
 assert d['errors']==[]
 keys=set();results=[]
 for session in d['sessions']:
  w,m=session['world'],session['mode'];key=(w,m)
  assert key not in keys;keys.add(key)
  assert w in WORLDS and m in ('R14R1_REFERENCE_HABITAT',*MODES)
  if m=='R14R1_REFERENCE_HABITAT':assert w in WORLDS
  assert session['realGPU']['webGL2'] is True
  assert session['artApproved'] is False and session['humanTested'] is False
  snaps=session['realScreenshots']
  assert len(snaps)>=len(TIMES)
  assert all(x['cameraMode']=='ball-lock-unfiltered-heading' for x in snaps)
  assert all(x['sourceB48']==7 and x['sourceB51']==28 for x in snaps)
  assert all(x['actualCanvasPngBytes']>15000 and x['actualHudPngBytes']>26000 for x in snaps)
  assert all(re.fullmatch(r'[0-9a-f]{64}',x['canvasPngSHA256']) for x in snaps)
  assert [x['originalNativeTargetSeconds'] for x in snaps[:len(TIMES)]]==list(TIMES)
  for i,t in enumerate(TIMES):
   x=snaps[i]
   assert x['runnerStatus']=='running'
   assert x['nativeTicks']==t*240
   assert abs(float(x['nativePauseAt'])-t)<.009
  if m in MODES:
   assert session['isNewD15R1RealArchitecture'] is True
   assert session['oldRejectedArchitectureReplaced'] is True
   assert all(x['mode']==m for x in snaps)
   assert all(x['artTriangles']>1500 and x['genuineOpenVoids']>80 for x in snaps)
  else:
   assert all(x['mode']=='legacy' for x in snaps)
  if m!='LEGACY':
   last=snaps[-1]
   assert last['runnerStatus']=='finished' and last['finishEvents']==1
   assert last['groundedRoad']=='p93-FINISH_RIDGE-01'
  results.append({'world':w,'mode':m,'screens':len(snaps),
    'nativeFinish':snaps[-1]['runnerStatus']=='finished',
    'nativeFinishEvents':snaps[-1]['finishEvents'],
    'cityTriangles':snaps[0]['artTriangles']})
 assert keys=={*((w,'R14R1_REFERENCE_HABITAT') for w in WORLDS),
   *((w,m) for w in WORLDS for m in MODES)}
 for w in WORLDS:
  prior=next(s for s in d['sessions'] if s['world']==w and s['mode']=='R14R1_REFERENCE_HABITAT')
  scenes=[next(s for s in d['sessions'] if s['world']==w and s['mode']==m) for m in MODES]
  for i,t in enumerate(TIMES):
   base=prior['realScreenshots'][i]
   for n in scenes:
    new=n['realScreenshots'][i]
    assert new['nativeTicks']==base['nativeTicks']==t*240
    assert new['runnerStatus']==base['runnerStatus']=='running'
    assert new['speedHud']==base['speedHud']
    assert new['groundedRoad']==base['groundedRoad']
  for n in scenes:
   distinct=sum(n['realScreenshots'][i]['canvasPngSHA256']!=
    prior['realScreenshots'][i]['canvasPngSHA256'] for i in range(len(TIMES)))
   assert distinct>=2, 'new real GPU background is not seen in original camera'
  for i in range(len(TIMES)):
   assert scenes[0]['realScreenshots'][i]['canvasPngSHA256']!=scenes[1]['realScreenshots'][i]['canvasPngSHA256'], 'two proposals look identical at the real camera/time'
 return results
def main():
 d=json.loads(Path(sys.argv[1]).read_text())
 cases=inspect(d)
 fakes=[
  ('fake-human',lambda x:x.update(genuineHandOperatedQA=True)),
  ('fake-art',lambda x:x.update(formalARTApproved=True)),
  ('fake-city-stages',lambda x:x.update(cases=5)),
  ('fake-surface-count',lambda x:x.update(sourceOriginalB48=8)),
  ('fake-physics-tick',lambda x:x['sessions'][3]['realScreenshots'][0].update(nativeTicks=13921)),
  ('fake-final-surface',lambda x:x['sessions'][3]['realScreenshots'][-1].update(groundedRoad='fake_collision_road')),
  ('fake-browser-webgl',lambda x:x['sessions'][3]['realGPU'].update(webGL2=False)),
  ('fake-manual',lambda x:x.update(scriptedP96P94NotHuman=False)),
  ('fake-image-hash',lambda x:x['sessions'][4]['realScreenshots'][1].update(canvasPngSHA256='not_sha')),
  ('fake-frame-image',lambda x:x['sessions'][4]['realScreenshots'][1].update(actualCanvasPngBytes=4))
 ]
 rejected=[]
 for name,fn in fakes:
  x=copy.deepcopy(d);fn(x)
  try:inspect(x)
  except (AssertionError,KeyError,TypeError,ValueError):rejected.append(name)
  else:raise AssertionError('FORGED PROOF ACCEPTED: '+name)
 assert len(rejected)==10
 out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D15R1_INDEPENDENT_REAL_WEBGL2_ART_SOURCE_GATE.json').write_text(json.dumps({
  'sourceNativeSixRenderedSessions':cases,'forgedClaimsRejected':rejected,
  'sourceActualWebGL2Supported':True,'gameplayHumanArtPerformanceRelease':'HOLD',
  'nativeRoads':7,'movingB51':28,'zeroNewCollisionMeshes':True},indent=2,ensure_ascii=False)+'\n')
 print('R15S3D15R1_INDEPENDENT_ORIGINAL_GAME_ART_GATE',json.dumps({
  'cases':len(cases),'realSourceScreenshots':sum(c['screens'] for c in cases),
  'fakeClaimsVetoed':len(rejected),
  'twoWorldNewArtFinish4of4':all(c['nativeFinish'] for c in cases if c['mode'] in MODES),
  'sourceNativeNotHuman':True,'ART':'HOLD'}))
if __name__=='__main__':main()
