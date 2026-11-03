#!/usr/bin/env python3
"""K4AN: genuine source-vs-B51-group mask ART-FIRST review sheets, not ART approval."""
import argparse
import csv
import hashlib
import json
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw

SRC = 'af076d67492a677d2235e4730aef8cdf4808e106'
EXPECTED = {
    'ultra': (11280, 11320, 11341, 11369),
    'control': (11259, 11278, 11280, 11307),
}
GRID = 11176


def need(ok, code):
    if not ok:
        raise ValueError('K4AN_REJECT_' + code)


def read_image(root, info):
    need(type(info) is dict, 'MISSING_PNG_INFO')
    name = info['file']
    p = Path(name)
    need(len(p.parts) == 1 and p.suffix.lower() == '.png' and p.name == name, 'PNG_PATH')
    raw = (root / name).read_bytes()
    need(len(raw) == info['bytes'] and hashlib.sha256(raw).hexdigest() == info['sha256'],
         'PNG_BYTES_OR_SHA')
    image = Image.open(BytesIO(raw)).convert('RGB')
    need(image.size == (1013, 698), 'PNG_SIZE')
    return image, raw


def build(root, packet, coverage, output):
    raw = json.loads((root / 'K4AJ_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json').read_text())
    audit = json.loads((root / 'K4AJ_INDEPENDENT_99_CONTIGUOUS_SOURCE_GPU_MASK_AUDIT.json').read_text())
    need(raw['originalSourceBlob'] == audit['originalSourceBlob'] == SRC, 'SOURCE')
    need(raw['errors'] == [] and raw['ART'] == 'NOT_TESTED_HOLD', 'SOURCE_HOLD')
    need(audit['officialARTAccepted'] == audit['slope2DNAMetres'] == 0, 'AUDIT_ART_HOLD')
    need(audit['trueOriginalGPUFrames'] == audit['genuineSourceB51Masks'] ==
         audit['originalDepthRestorations'] == 100, 'DEPTH_COUNT')
    need(audit['originalSourceGPUReadbackRequestCount'] == 300, 'READBACK_COUNT')
    need(packet['candidateCount'] == 0 and packet['officialARTAccepted'] ==
         packet['slope2DNAMetres'] == 0, 'PACKET_HOLD')
    need(packet['ART'] == 'NOT_TESTED_HOLD' and packet['humanObstructionSeconds'] ==
         'NOT_MEASURED', 'PACKET_NOT_HUMAN')
    need(coverage['observedSourceRGBSnapshots'] == 8 and coverage['artFirstRequestedTicks'] == 15
         and coverage['requestedAlreadyCapturedOriginalRGB'] == 6
         and coverage['requestedMissingOriginalRGB'] == 9
         and coverage['capturedUnrequestedOriginalRGB'] == 2, 'COVERAGE')
    rows = list(csv.DictReader((root / 'K4AJ_100_REAL_SOURCE_GPU_DEPTH_MASKS.csv').open()))
    need(len(rows) == 100, 'CSV_COUNT')
    csv_lookup = {(q['mode'], int(q['tick'])): q for q in rows}
    needs = {(x['mode'], x['nativeTick']) for x in packet['captureRequests']}
    need(len(needs) == 15, 'REQUEST_COUNT')
    source_times = {(mode, tick) for mode, ticks in EXPECTED.items() for tick in ticks}
    need(len(needs & source_times) == 6 and len(needs - source_times) == 9, 'REAL_OVERLAP')
    need({(q['mode'], q['tick']) for q in coverage['reviewRequests']} == needs, 'COVERAGE_REQUESTS')
    output.mkdir(parents=True, exist_ok=True)
    index = []
    sheets = []
    for mode in ('ultra', 'control'):
        sessions = [s for s in raw['sessions'] if s['mode'] == mode]
        need(len(sessions) == 1, 'SOURCE_SESSION')
        session = sessions[0]
        f_by = {f['tick']: f for f in session['frames']}
        m_by = {f['tick']: f for f in session['masks']}
        r_by = {f['tick']: f for f in session['restored']}
        sheet = Image.new('RGB', (2026, (698 + 38) * 4), '#f2f4f8')
        draw = ImageDraw.Draw(sheet)
        for n, tick in enumerate(EXPECTED[mode]):
            f, m, rec = f_by[tick], m_by[tick], r_by[tick]
            need(f['captureProof']['tick'] == tick and m['proof']['tick'] == tick, 'TICK_CAPTURE')
            need(m['mask'] == 'without-B51-bodies', 'MASK_NAME')
            orig, orig_bytes = read_image(root, f['originalPNG'])
            mask, mask_bytes = read_image(root, m['screenshot'])
            restored, restore_bytes = read_image(root, rec['screenshot'])
            need(orig_bytes == restore_bytes, 'RESTORED_PNG_BYTE_DIFFERENCE')
            a = f['synchronousRenderDepth']['samples']
            b = m['synchronousDepth']['samples']
            c = rec['depth']['samples']
            need(len(a) == len(b) == len(c) == GRID and a == c, 'DEPTH_RESTORE')
            near = sum(v < u for u, v in zip(a, b))
            far = sum(v > u for u, v in zip(a, b))
            need(near == 0, 'MASK_CREATED_NEAR_DEPTH')
            need(far == int(csv_lookup[(mode, tick)]['maskedFartherDepthSamples']), 'CSV_DEPTH')
            y = n * (698 + 38)
            draw.text((14, y + 12), f'{mode} TICK {tick} ORIGINAL SOURCE', fill='#121826')
            draw.text((1027, y + 12), 'B51_BODY ALL 28 HIDDEN (RESEARCH A/B)', fill='#121826')
            sheet.paste(orig, (0, y + 38))
            sheet.paste(mask, (1013, y + 38))
            index.append({'mode': mode, 'tick': tick, 'sourceOriginalPNG': f['originalPNG'],
                          'groupHiddenPNG': m['screenshot'], 'restoredPNG': rec['screenshot'],
                          'maskedFartherSampledGPUdepth': far,
                          'sampledGrid': GRID, 'humanVisibilityDuration': 'NOT_MEASURED',
                          'candidateSourceColorAB': 'NOT_CAPTURED', 'ART': 'NOT_TESTED_HOLD'})
        name = f'K4AN_{mode.upper()}_FOUR_SOURCE_RGB_VS_B51_GROUP_MASK_REVIEW.png'
        sheet.save(output / name, optimize=True)
        sheets.append({'file': name, 'sha256': hashlib.sha256((output / name).read_bytes()).hexdigest()})
    need(len(index) == 8 and len(sheets) == 2, 'SCREENSHOT_COUNT')
    result = {
        'schema': 'dopagaki.K4AN.true-original-rgb-art-first-review/1',
        'sourceBlob': SRC, 'K4AJIndependentDecision': audit['decision'],
        'reviewPurpose': 'SOURCE_ONLY_NOT_NEW_CANDIDATE_ART',
        'originalScreenshotsChecked': 8, 'sourceB51MaskedScreenshotsChecked': 8,
        'restoredScreenshotsChecked': 8,
        'artRequestTicks': 15, 'alreadyCoveredOriginalRGB': 6, 'stillMissingOriginalRGB': 9,
        'sheets': sheets, 'sourceSnapshots': index,
        'trueHumanObstructionSeconds': 'NOT_MEASURED',
        'singleObstaclePerTickAttribution': 'UNKNOWN_EXCEPT_K4AG_TICK11280',
        'officialARTAccepted': 0, 'slope2DNAMetres': 0,
        'candidateModels': 0, 'newColliders': 0,
        'ART': 'NOT_TESTED_HOLD', 'HUMAN': 'HOLD', 'SAT': 'HOLD', 'CCD': 'HOLD',
        'FPS': 'HOLD', 'RELEASE': 'HOLD', 'MERGE': 'HOLD',
    }
    (output / 'K4AN_REAL_SOURCE_RGB_ART_FIRST_REVIEW_INDEX.json').write_text(
        json.dumps(result, indent=2, ensure_ascii=False) + '\n')
    return result


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--k4aj', type=Path, required=True)
    p.add_argument('--k4ak', type=Path, required=True)
    p.add_argument('--k4al', type=Path, required=True)
    p.add_argument('--out', type=Path, required=True)
    a = p.parse_args()
    r = build(a.k4aj, json.loads(a.k4ak.read_text()),
              json.loads(a.k4al.read_text()), a.out)
    print('K4AN_GENUINE_EIGHT_ORIGINAL_AND_MASKED_RGB_SNAPSHOTS_VERIFIED_ART_HOLD')
    print('K4AN_ART_FIRST_REQUEST_COVERAGE', r['alreadyCoveredOriginalRGB'], r['stillMissingOriginalRGB'])


if __name__ == '__main__':
    main()
