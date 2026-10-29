"""R15K2 independent source-centre projection QA with adversarial changes.

Verifies source overlays have not become approval for human obstacle warning,
art, safety, road access or real game engine WebGL. Source R15K is invariant.
"""
import argparse,os,json,copy,math
from PIL import Image
P=argparse.ArgumentParser()
for x in ("r15k","audit","overlays","out"):P.add_argument("--"+x,required=True)
a=P.parse_args()
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
TIMES=["t"+str(k) for k in range(1100,1701,50)]
source=json.load(open(a.r15k,encoding="utf8"))
audit=json.load(open(a.audit,encoding="utf8"))
def site_for(road,name):
 sites=source["originalSourceEvidenceByRoad"][road]["realOriginalSourceCXSiteObservations"]
 matches=[v for v in sites.values() if v["originalCXSourceName"]==name]
 assert matches
 x=matches[0]
 assert all(v["realOriginalCXSourceCameraViews"]==x["realOriginalCXSourceCameraViews"] for v in matches)
 return {f["frame"]:f for f in x["realOriginalCXSourceCameraViews"]}
def check(d,images=False):
 assert source["originalSourceCXBlob"]==d["sourceBlob"]==SRC
 assert d["schema"]=="dopagaki.r15k2-real-source-r1-cx-face-b51-center-overlay/1"
 assert d["originalR1CameraFrames"]==TIMES
 assert d["actualUniqueSourceCXSurfacePatchCount"]==2
 assert d["approach"]=="projected-source-CX-face-and-original-B51-center-only"
 assert d["conservativeCenterProximityCircleRadiusPixels"]==48
 assert d["notHumanReactionTimeOrPhysicalHazardMask"] and d["noNewGeometryOrOriginalGameSourceChanged"]
 assert (d["newGameColliders"],d["officialArt"],d["officialSlope2Meters"])==(0,0,0)
 assert all(d[x]=="HOLD" for x in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 valid={"02 roadbank-promenade None","04 roadbank-promenade None"}
 assert set(d["originalSourceDesignStudySurfaceNames"])==valid
 assert len(d["independentSourceCameraComparisons"])==4
 checked=set()
 for audit in d["independentSourceCameraComparisons"]:
  road=audit["road"];name=audit["uniqueOriginalCXSourcePatch"]
  assert road in ROADS and name in valid
  assert (road,name) not in checked;checked.add((road,name))
  assert audit["actualSourceCameraFramesReviewed"]==13
  assert audit["actualNewBuildingScreenOccupancyCertified"] is False
  assert audit["actualB51HumanWarningOcclusionCertified"] is False
  W=audit["realSourceRasterWidth"];H=audit["realSourceRasterHeight"]
  assert (W,H)==(1008,645)
  contact=audit["sourceComparisonsContactSheet"]
  assert contact.startswith("R15K2_") and contact.endswith(".jpg")
  if images:
   assert Image.open(os.path.join(a.overlays,contact)).size==(1016,346*13)
  site=site_for(road,name)
  baseline={x["frame"]:x["baselineOriginalB51CentersVisible"] for x in
    source["originalSourceEvidenceByRoad"][road]["originalB51BaselineCenterProjectionByCameraFrame"]}
  assert len(audit["originalR1CameraDiagnosticFrames"])==13
  assert [f["frame"] for f in audit["originalR1CameraDiagnosticFrames"]]==TIMES
  for row in audit["originalR1CameraDiagnosticFrames"]:
   t=row["frame"];points=site[t]["normalizedVisibleSampleScreenCoordinates"]
   cues=baseline[t]
   assert row["cxOriginalRealFaceSamplesVisible"]==len(points)
   assert row["originalB51CentersVisible"]==len(cues)
   assert row["actualNewBuildingHazardOcclusionMeasured"] is False
   def px(x):return (round(x[0]*W),round((1-x[1])*H))
   danger=[];mind=None
   for cue in cues:
    x,y=px(cue["sourceCameraUV"])
    if not points:continue
    dis=min(math.hypot(x-u,y-v) for u,v in (px(q) for q in points))
    mind=dis if mind is None else min(mind,dis)
    if dis<=48:danger.append({"originalB51Id":cue["id"],"minimumScreenPixelDistance":round(dis,3)})
   danger.sort(key=lambda z:z["originalB51Id"])
   assert row["conservative48PixelNearOriginalB51CenterWarnings"]==danger
   assert row["closestOriginalB51CenterToCXVisibleSamplePixels"]==(
      round(mind,3) if mind is not None else None)
   image=row["annotatedOriginalSourceImage"]
   assert image.startswith("R15K2_") and image.endswith(".jpg")
   if images:
    assert Image.open(os.path.join(a.overlays,image)).size==(W,H+34)
 assert len(checked)==4
 return [{"road":q["road"],"patch":q["uniqueOriginalCXSourcePatch"],
          "nearCueFrames":sum(bool(f["conservative48PixelNearOriginalB51CenterWarnings"])
            for f in q["originalR1CameraDiagnosticFrames"]),
          "frameCount":13} for q in d["independentSourceCameraComparisons"]]
summaries=check(audit,images=True)
def reject(change):
 q=copy.deepcopy(audit);change(q)
 try:check(q)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return
 raise AssertionError("R15K2_FABRICATED_RESULT_ACCEPTED")
cases=[
 ("false_art",lambda q:q.__setitem__("officialArt",1)),
 ("false_human",lambda q:q["independentSourceCameraComparisons"][0].__setitem__("actualB51HumanWarningOcclusionCertified",True)),
 ("false_webgl",lambda q:q.__setitem__("noNewGeometryOrOriginalGameSourceChanged",False)),
 ("false_building",lambda q:q["independentSourceCameraComparisons"][0]["originalR1CameraDiagnosticFrames"][0].__setitem__("actualNewBuildingHazardOcclusionMeasured",True)),
 ("false_near_cue",lambda q:q["independentSourceCameraComparisons"][0]["originalR1CameraDiagnosticFrames"][0].__setitem__("conservative48PixelNearOriginalB51CenterWarnings",[{"originalB51Id":"fake","minimumScreenPixelDistance":0}])),
 ("false_source",lambda q:q.__setitem__("sourceBlob","fake")),
 ("false_duplicates",lambda q:q.__setitem__("actualUniqueSourceCXSurfacePatchCount",4)),
 ("false_radius",lambda q:q.__setitem__("conservativeCenterProximityCircleRadiusPixels",2))
]
for name,fn in cases:reject(fn)
result={"schema":"dopagaki.r15k2-independent-original-r1-cx-source-b51-center-gate/1",
 "sourceBlob":SRC,"originalR1TrueFramesPerRoad":13,
 "originalUniqueCXSourcePatchesIndependentlyVerified":2,
 "source2DNearCueFramesByRoadPatch":summaries,
 "originalGameEdited":False,"newGameColliders":0,
 "actualNewGeometryOcclusionCertified":False,
 "originalB51HumanFairnessCertified":False,
 "artCertified":False,"webGL2GameRenderVerified":False,
 "adversarialFalseCertificationChecksRejected":[v[0] for v in cases],
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","INTEGRATION":"HOLD","RELEASE":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15K2_INDEPENDENT_SOURCE_B51_CUE_OVERLAY_GATE.json"),"w",encoding="utf8") as f:
 json.dump(result,f,indent=2,ensure_ascii=False)
print("R15K2_INDEPENDENT_SOURCE_HAZARD_CUE_PROXIMITY_ONLY",
  summaries,"NO HUMAN WARNING FAIRNESS, NO ART, NO WEBGL",flush=True)
