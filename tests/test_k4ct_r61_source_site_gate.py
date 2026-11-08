"""R61 independent original-source tests. Run with already extracted artifact inputs.
R49_DCC_JSON=<path> R60_NATIVE_JSON=<path> python -m unittest -q tests/test_k4ct_r61_source_site_gate.py
"""
from copy import deepcopy
from hashlib import sha256
from pathlib import Path
import os,importlib.util,json,unittest
gatePath=Path(__file__).resolve().parents[1]/'scripts/k4ct-r61-source-site-gate.py'
spec=importlib.util.spec_from_file_location('r61_gate',gatePath)
gate=importlib.util.module_from_spec(spec);spec.loader.exec_module(gate)
class OriginalR61(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.dpath=Path(os.environ['R49_DCC_JSON']);cls.npath=Path(os.environ['R60_NATIVE_JSON'])
  cls.bytesBefore=(sha256(cls.dpath.read_bytes()).hexdigest(),sha256(cls.npath.read_bytes()).hexdigest())
  cls.d=json.loads(cls.dpath.read_text());cls.n=json.loads(cls.npath.read_text())
  cls.result=gate.compute(cls.d,cls.n)
 @classmethod
 def tearDownClass(cls):
  assert cls.bytesBefore==(sha256(cls.dpath.read_bytes()).hexdigest(),sha256(cls.npath.read_bytes()).hexdigest())
 def test_original_water_not_bank(self):
  p=self.result['physicalObservations']
  self.assertAlmostEqual(p['nearestActualWaterSurfaceDistanceM'],65.801,places=3)
  self.assertAlmostEqual(p['nearestBankCrestDistanceM'],56.625,places=3)
  self.assertAlmostEqual(p['B51HeightAboveWaterSurfaceM'],29.433,places=3)
 def test_original_camera_and_tick(self):
  xs=self.result['trueSourceCameraScreenProjections_NOT_NativeCandidateArt']
  self.assertEqual([x['nativeTick'] for x in xs],[15660,15744,15924])
  self.assertTrue(all(x['actualOriginalB51Screen']['insideOriginalCanvas'] and x['sourceWaterBoundaryScreen']['insideOriginalCanvas'] for x in xs))
 def test_source_driven_yaw_differences(self):
  w=self.result['sourceMotion']['sourceYawRatesRadPerSecond']
  self.assertAlmostEqual(w[0],w[1],places=9)
  self.assertAlmostEqual(w[0],-1.451082,places=5)
 def test_road_original_triangle_skin_not_crossed(self):
  self.assertEqual(self.result['proposedResearchSite_NOT_AUTHORING']['roadMeshSegmentIntersections'],[0,0,0,0])
 def test_no_claim_of_power_or_human_art(self):
  v=self.result['proposedResearchSite_NOT_AUTHORING']
  self.assertFalse(v['realFluidFlowOrElectricalPowerProven'])
  self.assertFalse(v['visualLinkAcrossRoadProven'])
  self.assertFalse(v['originalB51KinematicActuationProven'])
  self.assertEqual(self.result['conclusion']['ART'],'HOLD')
 def test_refuses_tampered_physics_and_tick(self):
  d=deepcopy(self.d);d['originalB51']=29
  with self.assertRaises(AssertionError):gate.compute(d,self.n)
  n=deepcopy(self.n);n['frames'][1]['tick']=15745
  with self.assertRaises(AssertionError):gate.compute(self.d,n)
 def test_inputs_not_mutated(self):
  b1=sha256(json.dumps(self.d,sort_keys=True).encode()).hexdigest()
  b2=sha256(json.dumps(self.n,sort_keys=True).encode()).hexdigest()
  gate.compute(self.d,self.n)
  self.assertEqual(b1,sha256(json.dumps(self.d,sort_keys=True).encode()).hexdigest())
  self.assertEqual(b2,sha256(json.dumps(self.n,sort_keys=True).encode()).hexdigest())
