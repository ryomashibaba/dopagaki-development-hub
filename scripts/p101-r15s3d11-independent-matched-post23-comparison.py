#!/usr/bin/env python3
"""Inspect existing same-ball-path source-original B51 counterfactual math.
Not the 240Hz Runner, screenshots, human QA, or actual native finish test.
"""
import argparse,copy,json,math
from pathlib import Path
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
def inspect(d):
 assert d['schema']=='dopagaki.r15s3d11-original-28-B51-paired-same-0p5s-post23-trace-counterfactual/1'
 assert d['gameSourceGitBlob']==SHA
 assert d['fullSamplePeriodSeconds']==.5 and d['firstSampleAtOrAfterSeconds']==23
 assert d['matchedSameBallXYZAndSourceSimulationTime'] is True
 assert d['originalB51Count']==28 and d['actualModifiedOriginalB51Count']==6
 assert d['isActualAlternativePhysicalPlayback'] is False and d['noNewRealPhysicsSimulation'] is True
 assert d['thisStudyDoesNotProveMissOrHumanVisibility'] is True
 assert d['ART']==d['GAMEPLAY']==d['HUMAN']==d['RELEASE']=='HOLD'
 assert set(d['worlds'])=={'true-pinch','pinch-switch'}
 results=[]
 for w,r in d['worlds'].items():
  assert w==r['world']
  assert r['realSamplingPointsAfter23']>85
  assert r['originalNativeSourceRunnerFinishedBoth'] is True
  assert r['originalSource240HzUnmodified'] is True
  assert r['overlapSameTickOriginalD9Snapshots']>80
  assert math.isfinite(r['maxOriginalD9VsD11BallXYZErrorAtMatchingTickM'])
  assert r['maxOriginalD9VsD11BallXYZErrorAtMatchingTickM']>=0
  assert r['samplePeriodExactly0p5s'] is True and r['allSamplesSameXYZAndTime'] is True
  assert r['nativeSourceContactEventsAfterNewPositions']==0
  assert r['actualDriverInterventionTested'] is False
  assert len(r['sixEditedBodiesVsOriginal'])==6
  assert len({v['id'] for v in r['sixEditedBodiesVsOriginal']})==6
  a=r['originalIdenticalTrajectoryCounterfactual']
  assert set(a)=={'original28B51UntouchedPositions','sixRealB51ReanchoredPrivatePositions'}
  for v in a.values():
   assert 0<=v['distinctRealMovingBodiesWithin30m']<=28
   assert 0<=v['distinctRealMovingBodiesWithin10m']<=v['distinctRealMovingBodiesWithin30m']
   assert v['timeSampleBodyPairCountWithin30m']>=v['distinctRealMovingBodiesWithin30m']
   assert len(v['originalBodyIDsWithin30m'])==v['distinctRealMovingBodiesWithin30m']
   assert math.isfinite(v['minimumBallSurfaceToOriginalMovingBodyM'])
  results.append({'world':w,'same0p5secondSampledPoints':r['realSamplingPointsAfter23'],
    'original28Within30m':a['original28B51UntouchedPositions']['distinctRealMovingBodiesWithin30m'],
    'modifiedSixWithin30m':a['sixRealB51ReanchoredPrivatePositions']['distinctRealMovingBodiesWithin30m'],
    'sameSourceXYZMaxMismatchM':r['maxOriginalD9VsD11BallXYZErrorAtMatchingTickM'],
    'sourceNativeFinishStill2of2':True,'actualHumanDecisionQA':False})
 return results
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--out',required=True)
 a=p.parse_args();d=json.loads(Path(a.source).read_text())
 results=inspect(d)
 tests=[
  ('fake-rendered',lambda x:x.update(isActualAlternativePhysicalPlayback=True)),
  ('fake-source-blob',lambda x:x.update(gameSourceGitBlob='bad')),
  ('fake-sample-interval',lambda x:x.update(fullSamplePeriodSeconds=1)),
  ('fake-human',lambda x:x.update(HUMAN='PASS')),
  ('fake-total-B51',lambda x:x.update(originalB51Count=15)),
  ('fake-unchanged',lambda x:x['worlds']['true-pinch'].update(originalSource240HzUnmodified=False)),
  ('fake-contact-events',lambda x:x['worlds']['pinch-switch'].update(nativeSourceContactEventsAfterNewPositions=-1)),
  ('fake-encounters',lambda x:x['worlds']['true-pinch']['originalIdenticalTrajectoryCounterfactual']['sixRealB51ReanchoredPrivatePositions'].update(distinctRealMovingBodiesWithin30m=100)),
  ('fake-ids',lambda x:x['worlds']['pinch-switch']['sixEditedBodiesVsOriginal'][0].update(id=x['worlds']['pinch-switch']['sixEditedBodiesVsOriginal'][1]['id']))
 ]
 rejected=[]
 for name,mut in tests:
  forged=copy.deepcopy(d);mut(forged)
  try:inspect(forged)
  except (AssertionError,ValueError,KeyError,TypeError):rejected.append(name)
  else:raise AssertionError('False claim accepted: '+name)
 assert len(rejected)==9
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 (out/'R15S3D11_MATCHED_POST23_INDEPENDENT_QA.json').write_text(json.dumps({
  'matchedSourceEvidence':results,'rejectedFakeClaims':rejected,
  'sameSourceBallTraceCounterfactualOnly':True,
  'humanARTandGameplayApproved':False},ensure_ascii=False,indent=2)+'\n')
 print('R15S3D11_MATCHED_POST23_SOURCE_QA',len(results),'worlds',len(rejected),'forgeries rejected',json.dumps(results))
if __name__=='__main__':main()
