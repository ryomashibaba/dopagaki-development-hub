"""Independent no-network synthetic source-evidence tests; no Blender/WebGL claims."""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / 'scripts' / 'p101-w9c2-g4e7dz-r6b-evidence-gate.py'
spec = importlib.util.spec_from_file_location('r6b_gate', MODULE)
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


def fixture(road, collisions=False):
    return {
        'road': road,
        'schema': 'dopagaki.g4e7dz-r6b-integrated-section/1',
        'originalCXBlob': gate.EXPECTED_CX_BLOB,
        'sourceCX': 18, 'sourceB48': 7, 'sourceB51': 28, 'sourceCameras': 5,
        'gap52': True, 'sourceIdentityPreserved': True,
        'sourceGameChanged': False, 'gameNewColliders': 0,
        'officialArt': 0, 'officialSlope2Meters': 0,
        'B48TriangleOverlaps': [], 'CXTriangleOverlaps': [],
        'B51FourTimeSampleTriangleOverlaps': {
            t: ([['new transit', 'a13-machine-04', 12]] if collisions and t == 't1550' else [])
            for t in gate.TIMES
        },
        'nativeCameraVisibilityNotArtQuality': {},
    }


class R6BIndependentGateTests(unittest.TestCase):
    def test_real_collision_pattern_is_rejected(self):
        x = gate.evaluate([fixture('true-pinch', True), fixture('pinch-switch', True)])
        self.assertEqual(x['candidate_sampled_clearance'], 'REJECT')
        self.assertEqual(x['roads']['true-pinch']['B51_machine_ids'], ['a13-machine-04'])

    def test_clear_samples_do_not_prove_human_or_art(self):
        x = gate.evaluate([fixture('true-pinch'), fixture('pinch-switch')])
        self.assertEqual(x['candidate_sampled_clearance'], 'PASS_SAMPLES_ONLY')
        self.assertEqual(x['art'], 'HUMAN_IMAGE_REVIEW_REQUIRED')
        self.assertEqual(x['gameplay_human_performance_integration_release'], 'HOLD')

    def test_source_tampering_is_an_error(self):
        a, b = fixture('true-pinch'), fixture('pinch-switch')
        a['sourceGameChanged'] = True
        with self.assertRaisesRegex(ValueError, 'protected-source'):
            gate.evaluate([a, b])

    def test_missing_road_or_sample_is_an_error(self):
        with self.assertRaisesRegex(ValueError, 'both original road'):
            gate.evaluate([fixture('true-pinch')])
        a = fixture('true-pinch')
        del a['B51FourTimeSampleTriangleOverlaps']['t1700']
        with self.assertRaisesRegex(ValueError, 'incomplete time'):
            gate.evaluate([a, fixture('pinch-switch')])


if __name__ == '__main__':
    unittest.main()
