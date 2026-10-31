#!/usr/bin/env python3
"""R15S3D5 independent numeric consistency and false-certification veto.
The input is actual replay evidence; this checks it, not the closed CCD impulse
and not whether any game geometry is playable by a human.
"""
import argparse
import copy
import json
import math
from pathlib import Path

SHA = 'af076d67492a677d2235e4730aef8cdf4808e106'
WORLDS = ('true-pinch', 'pinch-switch')
MODES = ('L_WESTWARD_SUPPORT', 'M_LOWER_RECONTACT')
HOLDS = ('GAMEPLAY', 'ART', 'HUMAN', 'PERFORMANCE', 'INTEGRATION', 'RELEASE', 'MERGE')


def magnitude(v):
    return math.sqrt(sum(x*x for x in v))


def almost_vector(a, b, tol=0.000004):
    return len(a) == len(b) == 3 and magnitude([x-y for x,y in zip(a,b)]) <= tol


def angle_horizontal(a, b):
    x = (a[0], a[2])
    y = (b[0], b[2])
    d = math.hypot(*x)*math.hypot(*y)
    if d < 1e-9:
        return None
    return math.degrees(math.acos(max(-1, min(1, (x[0]*y[0]+x[1]*y[1])/d))))


def angle_close(value, expected):
    if expected is None:
        assert value is None
    else:
        assert value is not None and abs(value-expected) < 0.005


def verify(out, source):
    assert out['schema'] == 'dopagaki.r15s3d5-four-original-source-guide-drive-frame-replay/1'
    assert out['sourceGameBlob'] == source['sourceGameBlob'] == SHA
    assert out['sourcePhysicsHz'] == source['sourcePhysicsHz'] == 240
    assert out['sourceBallRadiusM'] == 0.65
    assert out['caseCount'] == 4
    assert out['originalSourceModified'] is False and out['observationalOnly'] is True
    assert out['originalB48SevenPreserved'] is True and out['originalMovingB51Count'] == 28
    assert out['originalRunnerRouteGuideAndSteeringUnchanged'] is True
    assert out['extraPhysicalColliders'] == 0
    assert out['ccdInstantaneousImpactNormalDirectlyMeasured'] is False
    assert out['individualCollisionImpulseSeparated'] is False
    assert out['sourceWebGLTested'] is False and out['humanFairnessEstablished'] is False
    assert out['officialArt'] == out['officialSlope2Meters'] == 0
    assert all(out[k] == 'HOLD' for k in HOLDS)
    assert 'Not a causal CCD' in out['analysisMeaning']
    assert set(out['cases']) == set(source['cases']) == set(WORLDS)
    report = []
    for w in WORLDS:
        assert set(out['cases'][w]) == set(source['cases'][w]) == set(MODES)
        for mode in MODES:
            c = out['cases'][w][mode]
            s = source['cases'][w][mode]
            assert c['world'] == w and c['mode'] == mode
            assert c['actualSourcePrefixChecks'] == 2
            assert c['sourceR15S3D4TerminalAndSupportParity'] is True
            assert c['nativeActualStatus'] == s['trueNativeStatus']
            assert abs(c['terminalOrCapSeconds'] - s['terminalSeconds']) < 0.000003
            assert abs(c['actualNextRoadGroundedSeconds']-s['nextRoadGroundedSeconds']) < 0.000003
            assert abs(c['actualScissorGroundedSeconds']-s['scissorGroundedSeconds']) < 0.000003
            source_samples = s['native240HzWindowSamples']
            samples = c['native240HzGuidanceObservations']
            assert len(samples) == len(source_samples) == c['countNative240HzSamples'] == c['originalR15S3D4EveryWindowTickMatched']
            assert len(samples) >= 600
            for a,b in zip(samples,source_samples):
                assert a['tick'] == b['tick']
                assert abs(a['timeSeconds']-b['timeSeconds']) < 0.000002
                assert abs(a['legalNativeInput']-b['legalSteer']) < 0.000001
                assert -1 <= a['legalNativeInput'] <= 1
                assert a['nativeOriginalSteeringInput'] == a['legalNativeInput']
                assert almost_vector(a['preVelocityXYZ'],b['preVelocityXYZ'])
                assert almost_vector(a['postVelocityXYZ'],b['postVelocityXYZ'])
                assert a['nativePreStepGrounded'] == b['nativeRunnerGroundedFromPreStep']
                assert a['nativePreStepRoad'] == b['nativeRunnerRoadFromPreStep']
                expect_normal = b['nativePreStepRideableSupport']
                expect_normal = expect_normal['normalXYZ'] if expect_normal else None
                assert a['nativePreStepSupportNormalXYZ'] == expect_normal
                expect_next = b['nativePostStepProspectiveRideableSupport']
                expect_next = expect_next['normalXYZ'] if expect_next else None
                assert a['nativePostStepProspectiveNormalXYZ'] == expect_next
                assert a['sourceFixedCollisionCountDelta'] == b['runnerCollisionCountDelta']
                assert a['originalR15S3D4PositionVelocityParity'] is True
                for vector in ('actualOriginalForwardBeforeXYZ','actualOriginalForwardAfterXYZ','nativeGuideForwardXYZ'):
                    assert len(a[vector]) == 3
                    assert all(math.isfinite(v) for v in a[vector])
                    assert 0.998 < magnitude(a[vector]) < 1.002
                assert math.isfinite(a['nativeGuideDistanceM']) and a['nativeGuideDistanceM'] >= 0
                assert a['nativeGuideIndex'] >= 0
                assert a['nativeGuideSource'] in ('generated-surface', 'original-route')
                angle_close(a['horizontalVelocityDirectionChangeOneTickDegrees'],angle_horizontal(a['preVelocityXYZ'],a['postVelocityXYZ']))
                angle_close(a['horizontalForwardDirectionChangeOneTickDegrees'],angle_horizontal(a['actualOriginalForwardBeforeXYZ'],a['actualOriginalForwardAfterXYZ']))
                angle_close(a['velocityGuideAngleBeforeDegrees'],angle_horizontal(a['preVelocityXYZ'],a['nativeGuideForwardXYZ']))
                angle_close(a['forwardGuideAngleBeforeDegrees'],angle_horizontal(a['actualOriginalForwardBeforeXYZ'],a['nativeGuideForwardXYZ']))
                forward = sum(v*f for v,f in zip(a['postVelocityXYZ'],a['actualOriginalForwardAfterXYZ']))
                guide = sum(v*f for v,f in zip(a['postVelocityXYZ'],a['nativeGuideForwardXYZ']))
                assert abs(a['nativeSignedForwardVelocityMps']-forward) < 0.0008
                assert abs(a['nativeSignedGuideVelocityMps']-guide) < 0.0008
            points = {a['tick']:a for a in samples}
            a,b = points[7536],points[7584]
            summary = c['intervalSummary']
            angle_close(summary['horizontalBallVelocityRotation31p4To31p6Degrees'],angle_horizontal(a['postVelocityXYZ'],b['postVelocityXYZ']))
            angle_close(summary['horizontalPlayerForwardRotation31p4To31p6Degrees'],angle_horizontal(a['actualOriginalForwardAfterXYZ'],b['actualOriginalForwardAfterXYZ']))
            angle_close(summary['horizontalGuideRotation31p4To31p6Degrees'],angle_horizontal(a['nativeGuideForwardXYZ'],b['nativeGuideForwardXYZ']))
            assert summary['sourcePreStepRoadAt31p4'] == a['nativePreStepRoad']
            assert summary['sourcePreStepRoadAt31p6'] == b['nativePreStepRoad']
            assert summary['guideDistanceMAt31p4'] == a['nativeGuideDistanceM']
            assert summary['guideDistanceMAt31p6'] == b['nativeGuideDistanceM']
            assert summary['originalCollisionCountAt31p4'] == a['sourceFixedCollisionCountDelta']
            assert summary['originalCollisionCountAt31p6'] == b['sourceFixedCollisionCountDelta']
            assert summary['noCcdCausalAttribution'] is True
            report.append({'world':w,'mode':mode,'ticksMatchedToR15S3D4':len(samples),
                'officialGameplay':'HOLD', 'intervalObservation':summary})
    return report


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--source',required=True)
    p.add_argument('--analysis',required=True)
    p.add_argument('--out',required=True)
    args = p.parse_args()
    source = json.loads(Path(args.source).read_text())
    result = json.loads(Path(args.analysis).read_text())
    verified = verify(result,source)
    mutations = (
        ('fake-art-pass',lambda d:d.update(ART='PASS')),
        ('fake-gameplay-pass',lambda d:d.update(GAMEPLAY='PASS')),
        ('fake-ccd-proof',lambda d:d.update(ccdInstantaneousImpactNormalDirectlyMeasured=True)),
        ('fake-game-webgl',lambda d:d.update(sourceWebGLTested=True)),
        ('fake-physics',lambda d:d.update(sourcePhysicsHz=60)),
        ('fake-collider',lambda d:d.update(extraPhysicalColliders=1)),
        ('fake-geometry-protection',lambda d:d.update(originalB48SevenPreserved=False)),
        ('fake-next-road',lambda d:d['cases']['true-pinch']['L_WESTWARD_SUPPORT'].update(actualNextRoadGroundedSeconds=999)),
        ('fake-vector',lambda d:d['cases']['true-pinch']['L_WESTWARD_SUPPORT']['native240HzGuidanceObservations'][100].update(postVelocityXYZ=[999,0,0])),
        ('fake-forward-angle',lambda d:d['cases']['true-pinch']['L_WESTWARD_SUPPORT']['native240HzGuidanceObservations'][100].update(horizontalForwardDirectionChangeOneTickDegrees=90)),
        ('fake-route-bearing',lambda d:d['cases']['true-pinch']['L_WESTWARD_SUPPORT']['intervalSummary'].update(horizontalGuideRotation31p4To31p6Degrees=179)),
        ('fake-legal-input',lambda d:d['cases']['true-pinch']['L_WESTWARD_SUPPORT']['native240HzGuidanceObservations'][100].update(legalNativeInput=1.5)),
    )
    refused = []
    for name,edit in mutations:
        alternate = copy.deepcopy(result)
        edit(alternate)
        try:
            verify(alternate,source)
        except (AssertionError, KeyError, ValueError, TypeError, ZeroDivisionError):
            refused.append(name)
        else:
            raise AssertionError('false certificate accepted: '+name)
    assert len(refused) == 12
    out = Path(args.out)
    out.mkdir(parents=True,exist_ok=True)
    (out/'R15S3D5_INDEPENDENT_GUIDANCE_CONSISTENCY_QA.json').write_text(
      json.dumps({'sourceIntegrity':'PASS','matchedNativeCases':verified,
       'rejectedFabricatedClaims':refused,'actualBrowserGamePassed':False,
       'isolatedCcdImpulseCausallyProven':False,'humanPlayabilityCertified':False,
       'officialGameArtAdopted':False},indent=2,ensure_ascii=False)+'\n')
    print('R15S3D5_SOURCE_ONLY',len(verified),'4-case 240Hz replays;',
      len(refused),'false claims rejected. GAMEPLAY/ART HOLD')


if __name__ == '__main__':
    main()
