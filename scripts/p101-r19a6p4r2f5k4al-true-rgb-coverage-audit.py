#!/usr/bin/env python3
"""K4AL: original-RGB provenance/coverage gate for K4AJ/K4AK (ART HOLD).

Does not certify WebGL/physical safety, generate imagery, or promote ART.
"""
import argparse
import hashlib
import json
import struct
import tempfile
from pathlib import Path

SRC = 'af076d67492a677d2235e4730aef8cdf4808e106'
WINDOWS = {'ultra': (11320, 11369), 'control': (11259, 11307)}
CENTER = {'ultra': 11341, 'control': 11278}
REQUESTS = {
    'ultra': (11320, 11326, 11338, 11341, 11349, 11351, 11363, 11369),
    'control': (11259, 11265, 11277, 11280, 11284, 11301, 11307),
}
N = 11176


def require(condition, code):
    if not condition:
        raise ValueError('K4AL_REJECT_' + code)


def planned(mode):
    low, high = WINDOWS[mode]
    return {11280, low, high, CENTER[mode]}


def coverage(expected=None):
    captured = {(mode, tick) for mode in WINDOWS for tick in planned(mode)}
    requested = {(mode, tick) for mode, ts in REQUESTS.items() for tick in ts}
    if expected is not None:
        require(expected == requested, 'REQUEST_SET')
    return captured, requested


def check_png(base, meta):
    require(isinstance(meta, dict) and all(k in meta for k in ('file', 'bytes', 'sha256')), 'PNG_META')
    rel = Path(meta['file'])
    require(not rel.is_absolute() and '..' not in rel.parts and len(rel.parts) == 1, 'PNG_PATH')
    file = base / rel
    raw = file.read_bytes()
    require(len(raw) == meta['bytes'], 'PNG_SIZE')
    require(hashlib.sha256(raw).hexdigest() == meta['sha256'], 'PNG_SHA256')
    require(raw[:8] == b'\x89PNG\r\n\x1a\n' and raw[12:16] == b'IHDR' and len(raw) >= 24, 'PNG_HEADER')
    w, h = struct.unpack('>II', raw[16:24])
    require(0 < w <= 4096 and 0 < h <= 4096, 'PNG_DIMENSIONS')
    return {'file': meta['file'], 'bytes': len(raw), 'sha256': meta['sha256'], 'width': w, 'height': h}


def checked_depth(record, field):
    d = record[field]
    require(d['available'] is True and d['width'] == 1013 and d['height'] == 698
            and d['stride'] == 8 and d['method'] == 'ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY'
            and d['nonlinearDepth'] is True and d['originalVertexShader'] is True, 'GPU_SCHEMA')
    samples = d['samples']
    require(len(samples) == N and all(type(x) is int and 0 <= x <= 16777215 for x in samples), 'GPU_SAMPLES')
    return samples


def evaluate(raw, packet, base):
    require(raw['originalSourceBlob'] == SRC and raw['Hz'] == 240
            and raw['B48'] == 7 and raw['B51'] == 28, 'SOURCE')
    require(raw['errors'] == [] and len(raw['sessions']) == 2, 'RAW_ERRORS')
    require(raw['newModels'] == raw['newColliders'] == raw['officialARTAccepted'] == raw['slope2DNAMetres'] == 0, 'RAW_NO_ART')
    require(raw['ART'] == 'NOT_TESTED_HOLD' and raw['RELEASE'] == raw['MERGE'] == 'HOLD', 'RAW_HOLD')
    require(packet['ART'] == 'NOT_TESTED_HOLD' and packet['HUMAN'] == 'HOLD'
            and packet['RELEASE'] == packet['MERGE'] == 'HOLD'
            and packet['candidateCount'] == packet['officialARTAccepted'] == packet['slope2DNAMetres'] == 0, 'PACKET_HOLD')
    require(packet['verificationLimit'] == 'STRUCTURAL_CHECK_ONLY_NOT_INDEPENDENT_RAW_GPU_SHA_CRC_VERIFICATION', 'PACKET_PROOF_LIMIT')
    captured, requested = coverage()
    incoming = [(x['mode'], x['nativeTick']) for x in packet['captureRequests']]
    require(len(incoming) == 15 and len(set(incoming)) == 15 and set(incoming) == requested, 'REVIEW_REQUESTS')
    for x in packet['captureRequests']:
        require(x['candidateGeometry'] == 'NOT_CREATED' and x['sourceCandidateSamePoseColorAB'] == 'NOT_CAPTURED'
                and x['humanObstructionDuration'] == 'NOT_MEASURED' and x['ART'] == 'NOT_TESTED_HOLD', 'UNBUILT_REVIEW')
    images = {}
    for mode in WINDOWS:
        matches = [s for s in raw['sessions'] if s['mode'] == mode]
        require(len(matches) == 1, 'MODE')
        session = matches[0]
        low, high = WINDOWS[mode]
        ticks = sorted({11280, *range(low, high + 1)})
        for key in ('frames', 'masks', 'restored'):
            require([x['tick'] for x in session[key]] == ticks, 'TICK_COVERAGE_' + key)
        for original, masked, restored in zip(session['frames'], session['masks'], session['restored']):
            tick = original['tick']
            require(original['source']['tick'] == tick and original['source']['paused'] == tick
                    and original['source']['status'] == 'running'
                    and original['source']['camera'] == 'ball-lock-unfiltered-heading'
                    and original['source']['effectiveMask'] == 'none', 'ORIGINAL_POSE')
            require(masked['mask'] == 'without-B51-bodies' and restored['sourceRoad'] == original['source']['road'], 'MASK')
            orig = checked_depth(original, 'synchronousRenderDepth')
            mask = checked_depth(masked, 'synchronousDepth')
            recov = checked_depth(restored, 'depth')
            require(orig == recov, 'RESTORE_DEPTH')
            require(not any(b < a for a, b in zip(orig, mask)), 'MASK_DEPTH_MONOTONIC')
            changed = sum(b > a for a, b in zip(orig, mask))
            has_rgb = (mode, tick) in captured
            metas = [original.get('originalPNG'), masked.get('screenshot'), restored.get('screenshot')]
            require(all(x is not None for x in metas) == has_rgb, 'CAPTURE_PLAN')
            if has_rgb:
                triplet = [check_png(base, x) for x in metas]
                require(len({(x['width'], x['height']) for x in triplet}) == 1, 'RGB_SIZE_MISMATCH')
                images[(mode, tick)] = {'original': triplet[0], 'b51GroupHidden': triplet[1],
                                         'restored': triplet[2], 'sampledDepthChanged': changed,
                                         'sampledDepthTotal': N}
    require(set(images) == captured, 'ACTUAL_RGB_SET')
    requested_rows = []
    for req in packet['captureRequests']:
        key = (req['mode'], req['nativeTick'])
        proof = images.get(key)
        require(proof is None or proof['sampledDepthChanged'] == req['originalGPUGroupDepthChangedSamples'], 'DEPTH_COUNT_PACKET')
        requested_rows.append({'mode': key[0], 'tick': key[1], 'originalRGB': 'AVAILABLE_SHA_VERIFIED' if proof else 'NOT_CAPTURED',
                               'sourceRGB': proof, 'candidateSamePoseRGB': 'NOT_CREATED',
                               'humanLegibility': 'NOT_TESTED', 'ART': 'HOLD'})
    extras = [{'mode': key[0], 'tick': key[1], 'sourceRGB': images[key]}
              for key in sorted(captured - requested)]
    require(sum(r['sourceRGB'] is not None for r in requested_rows) == 6
            and len(extras) == 2, 'COUNTS')
    return {
        'schema': 'dopagaki.K4AL.original-RGB-source-coverage/1',
        'interpretation': 'K4AJ_SOURCE_IMAGE_SHA_ONLY_NOT_ART_OR_HUMAN_VISIBILITY_PROOF',
        'observedSourceRGBSnapshots': 8,
        'artFirstRequestedTicks': 15,
        'requestedAlreadyCapturedOriginalRGB': 6,
        'requestedMissingOriginalRGB': 9,
        'capturedUnrequestedOriginalRGB': 2,
        'reviewRequests': requested_rows,
        'additionalCapturedSnapshots': extras,
        'originalSourceBlob': SRC, 'officialARTAccepted': 0, 'slope2DNAMetres': 0,
        'candidateModels': 0, 'HUMAN': 'HOLD', 'ART': 'NOT_TESTED_HOLD',
        'SAT': 'HOLD', 'CCD': 'HOLD', 'FPS': 'HOLD', 'RELEASE': 'HOLD', 'MERGE': 'HOLD',
    }


def self_test():
    captured, req = coverage()
    require(len(captured) == 8 and len(req) == 15 and len(captured & req) == 6
            and len(req - captured) == 9 and len(captured - req) == 2, 'PLAN_COUNTS')
    try:
        coverage(set(list(req)[:-1]))
    except ValueError:
        pass
    else:
        raise AssertionError('missing art-review request accepted')
    with tempfile.TemporaryDirectory() as folder:
        base = Path(folder)
        sample = b'\x89PNG\r\n\x1a\n' + b'\x00\x00\x00\rIHDR' + struct.pack('>II', 1013, 698) + b'\x08\x06\x00\x00\x00'
        (base/'test.png').write_bytes(sample)
        meta = {'file': 'test.png', 'bytes': len(sample), 'sha256': hashlib.sha256(sample).hexdigest()}
        require(check_png(base, meta)['width'] == 1013, 'PNG_POSITIVE')
        for altered in ({**meta, 'sha256': '0'*64}, {**meta, 'bytes': len(sample)+1}, {**meta, 'file': '../test.png'}):
            try:
                check_png(base, altered)
            except ValueError:
                pass
            else:
                raise AssertionError('altered screenshot metadata accepted')
    print('K4AL_PREFLIGHT_8_REAL_SOURCE_RGB_PLANNED_15_REVIEW_REQUESTS_6_OVERLAP_9_MISSING_2_EXTRA')
    print('K4AL_STATIC_NEGATIVE_CONTROLS_PASS_TRUE_GPU_ARTIFACT_NOT_SUPPLIED_HOLD')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--self-test', action='store_true')
    p.add_argument('--raw', type=Path)
    p.add_argument('--packet', type=Path)
    p.add_argument('--root', type=Path)
    p.add_argument('--out', type=Path)
    args = p.parse_args()
    if args.self_test:
        self_test()
        return
    require(all((args.raw, args.packet, args.root, args.out)), 'REQUIRES_GENUINE_K4AJ_AND_K4AK_INPUTS')
    result = evaluate(json.loads(args.raw.read_text(encoding='utf-8')),
                      json.loads(args.packet.read_text(encoding='utf-8')), args.root)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print('K4AL_SOURCE_RGB_SHA_AND_REVIEW_COVERAGE_PASS_ART_HOLD')


if __name__ == '__main__':
    main()
