#!/usr/bin/env python3
"""Read-only source-artifact gate. CI execution success != safe or visually adopted city.

Usage: python3 scripts/p101-w9c2-g4e7dz-r6b-evidence-gate.py \
 --audit .../result-true-pinch/*_AUDIT.json .../result-pinch-switch/*_AUDIT.json \
 --output independent.json [--require-clear]
"""
import argparse
import json
from pathlib import Path

EXPECTED_CX_BLOB = 'af076d67492a677d2235e4730aef8cdf4808e106'
ROADS = {'true-pinch', 'pinch-switch'}
TIMES = ('t1550', 't1600', 't1650', 't1700')


def evaluate(audits):
    found = {}
    for a in audits:
        road = a.get('road')
        if road not in ROADS or road in found:
            raise ValueError(f'Invalid or duplicated road: {road}')
        checks = (
            a.get('schema') == 'dopagaki.g4e7dz-r6b-integrated-section/1',
            a.get('originalCXBlob') == EXPECTED_CX_BLOB,
            (a.get('sourceCX'), a.get('sourceB48'), a.get('sourceB51'), a.get('sourceCameras')) == (18, 7, 28, 5),
            a.get('gap52') is True,
            a.get('sourceIdentityPreserved') is True,
            a.get('sourceGameChanged') is False,
            (a.get('gameNewColliders'), a.get('officialArt'), a.get('officialSlope2Meters')) == (0, 0, 0),
        )
        if not all(checks):
            raise ValueError(f'{road}: invalid protected-source provenance')
        frames = a.get('B51FourTimeSampleTriangleOverlaps', {})
        if set(frames) != set(TIMES):
            raise ValueError(f'{road}: incomplete time evidence')
        by_time = {t: len(frames[t]) for t in TIMES}
        moving_ids = sorted({hit[1] for items in frames.values() for hit in items})
        road_pairs = len(a.get('B48TriangleOverlaps', []))
        cx_pairs = len(a.get('CXTriangleOverlaps', []))
        clear = road_pairs == 0 and all(v == 0 for v in by_time.values())
        targets = a.get('nativeCameraVisibilityNotArtQuality', {})
        role_views = {}
        for role in ('public', 'rail', 'housing', 'CXcontact'):
            role_views[role] = sum(
                1 for f in targets.values()
                if role in f and f[role].get('inFrame') and f[role].get('clearToNearTarget')
            )
        found[road] = {
            'source_preservation': 'PASS',
            'B48_triangle_overlap_pairs': road_pairs,
            'B51_overlap_pairs_per_sample': by_time,
            'B51_total_sampled_overlap_pairs': sum(by_time.values()),
            'B51_machine_ids': moving_ids,
            'CX_triangle_overlap_pairs_requires_review': cx_pairs,
            'target_rays_visible_out_of_4': role_views,
            'candidate_sampled_clearance_gate': 'PASS_SAMPLES_ONLY' if clear else 'REJECT',
            'continuous_time_safety': 'UNTESTED',
            'human_legibility': 'UNTESTED',
            'art_adoption': 'NOT_AUTOMATICALLY_APPROVABLE',
        }
    if set(found) != ROADS:
        raise ValueError('Must audit both original road variants')
    both_clear = all(v['candidate_sampled_clearance_gate'] == 'PASS_SAMPLES_ONLY' for v in found.values())
    return {
        'schema': 'dopagaki.g4e7dz-r6b-independent-evidence-gate/1',
        'candidate_sampled_clearance': 'PASS_SAMPLES_ONLY' if both_clear else 'REJECT',
        'source_protection': 'PASS',
        'art': 'HUMAN_IMAGE_REVIEW_REQUIRED',
        'gameplay_human_performance_integration_release': 'HOLD',
        'roads': found,
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--audit', nargs='+', type=Path, required=True)
    p.add_argument('--output', type=Path)
    p.add_argument('--require-clear', action='store_true', help='Fail when a candidate has sampled collisions')
    args = p.parse_args()
    result = evaluate([json.loads(f.read_text(encoding='utf-8')) for f in args.audit])
    txt = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(txt, encoding='utf-8')
    print(txt, end='')
    return 2 if args.require_clear and result['candidate_sampled_clearance'] == 'REJECT' else 0


if __name__ == '__main__':
    raise SystemExit(main())
