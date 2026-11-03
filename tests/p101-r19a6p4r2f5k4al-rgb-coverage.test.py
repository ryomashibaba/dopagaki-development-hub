#!/usr/bin/env python3
"""K4AL complete synthetic end-to-end negatives; never real GPU/ART evidence."""
import copy
import hashlib
import json
import runpy
import struct
import tempfile
import zlib
from pathlib import Path

m = runpy.run_path(str(Path(__file__).resolve().parents[1] / 'scripts' / 'p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py'))
SRC = m['SRC']; WIN = m['WINDOWS']; REQS = m['REQUESTS']; N = m['N']


def png():
    def chunk(t, data):
        return struct.pack('>I', len(data))+t+data+struct.pack('>I', zlib.crc32(t+data) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', 1, 1, 8, 6, 0, 0, 0)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(b'\0\0\0\0\xff')) + chunk(b'IEND', b'')


def make(base):
    raw = {'originalSourceBlob': SRC, 'Hz': 240, 'B48': 7, 'B51': 28,
           'errors': [], 'newModels': 0, 'newColliders': 0, 'officialARTAccepted': 0,
           'slope2DNAMetres': 0, 'ART': 'NOT_TESTED_HOLD', 'RELEASE': 'HOLD',
           'MERGE': 'HOLD', 'sessions': []}
    packet = {'ART': 'NOT_TESTED_HOLD', 'HUMAN': 'HOLD', 'RELEASE': 'HOLD', 'MERGE': 'HOLD',
              'candidateCount': 0, 'officialARTAccepted': 0, 'slope2DNAMetres': 0,
              'verificationLimit': 'STRUCTURAL_CHECK_ONLY_NOT_INDEPENDENT_RAW_GPU_SHA_CRC_VERIFICATION',
              'captureRequests': []}
    for mode, ticks in REQS.items():
        for tick in ticks:
            packet['captureRequests'].append({
                'mode': mode, 'nativeTick': tick, 'candidateGeometry': 'NOT_CREATED',
                'sourceCandidateSamePoseColorAB': 'NOT_CAPTURED', 'humanObstructionDuration': 'NOT_MEASURED',
                'ART': 'NOT_TESTED_HOLD', 'originalGPUGroupDepthChangedSamples': 1})
    for mode,(lo,hi) in WIN.items():
        s = {'mode': mode, 'frames': [], 'masks': [], 'restored': []}
        for tick in sorted({11280, *range(lo,hi+1)}):
            z = lambda samples: {'available': True, 'width': 1013, 'height': 698,
                                 'stride': 8, 'method': 'ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY',
                                 'nonlinearDepth': True, 'originalVertexShader': True, 'samples': samples}
            originals = [5]*N; masked = [6]+[5]*(N-1)
            original = {'tick': tick, 'source': {'tick': tick, 'paused': tick, 'status': 'running',
                        'camera': 'ball-lock-unfiltered-heading', 'effectiveMask': 'none',
                        'road': 'p93-PRISM_CREST-01'},
                        'synchronousRenderDepth': z(originals), 'originalPNG': None}
            mask = {'tick': tick, 'mask': 'without-B51-bodies', 'synchronousDepth': z(masked),
                    'screenshot': None}
            restore = {'tick': tick, 'sourceRoad': 'p93-PRISM_CREST-01', 'depth': z(originals.copy()),
                       'screenshot': None}
            if tick in m['planned'](mode):
                for obj, key, type_ in ((original,'originalPNG','original'),(mask,'screenshot','mask'),(restore,'screenshot','restored')):
                    file = '%s_%s_%s.png' % (mode,tick,type_)
                    binary = png(); (base/file).write_bytes(binary)
                    obj[key] = {'file': file, 'bytes':len(binary),'sha256':hashlib.sha256(binary).hexdigest()}
            s['frames'].append(original);s['masks'].append(mask);s['restored'].append(restore)
        raw['sessions'].append(s)
    return raw,packet


def reject(f, name):
    try:
        f()
    except ValueError:
        print('REJECT',name)
    else:
        raise AssertionError('accepted mutation '+name)


def main():
    with tempfile.TemporaryDirectory() as t:
        root = Path(t)
        raw, packet = make(root)
        r = m['evaluate'](raw, packet, root)
        assert r['requestedAlreadyCapturedOriginalRGB'] == 6
        assert r['requestedMissingOriginalRGB'] == 9
        assert r['capturedUnrequestedOriginalRGB'] == 2
        assert len(r['reviewRequests']) == 15
        print('K4AL_SYNTHETIC_FULL_100_DEPTH_FRAMES_8_TRIPLE_PNG_POSITIVE_PASS')
        bad = copy.deepcopy(packet)
        bad['captureRequests'][0]['candidateGeometry'] = 'MADE_UP_ART'
        reject(lambda:m['evaluate'](raw,bad,root),'FAKE_ART_CANDIDATE')
        bad = copy.deepcopy(packet)
        bad['captureRequests'].pop()
        reject(lambda:m['evaluate'](raw,bad,root),'MISSING_ART_TIME')
        bad = copy.deepcopy(raw)
        bad['sessions'][0]['masks'][0]['synchronousDepth']['samples'][0] = 2
        reject(lambda:m['evaluate'](bad,packet,root),'GPU_MASK_UNPHYSICAL_NEARER')
        bad = copy.deepcopy(raw)
        bad['sessions'][0]['restored'][0]['depth']['samples'][0] = 4
        reject(lambda:m['evaluate'](bad,packet,root),'GPU_RESTORE_CHANGED')
        photo = root/'ultra_11320_original.png'; photo.write_bytes(b'FAKE')
        reject(lambda:m['evaluate'](raw,packet,root),'TAMPERED_IMAGE_BYTES')
    print('K4AL_SYNTHETIC_E2E_5_NEGATIVE_CONTROLS_PASS_REAL_ARTIFACT_NOT_TESTED')


if __name__=='__main__':main()
