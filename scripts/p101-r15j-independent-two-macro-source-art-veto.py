"""Independent R15J source evidence + paired actual R1 image comparison.
No human or aesthetic auto-pass; do not silently excuse original intersections.
"""
import argparse,os,json,copy,statistics
from PIL import Image,ImageChops,ImageDraw
P=argparse.ArgumentParser()
for key in ("audit","original","trial","out"):P.add_argument("--"+key,required=True)
p=P.parse_args()
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
TIMES=("t1100","t1200","t1300","t1400","t1500","t1600","t1700")
def check(a):
 assert a["schema"]=="dopagaki.r15j-real-source-road-cx-two-macro-architectures-private-visual/1"
 assert a["originalSourceBlob"]==SRC
 assert a["originalRoad"] in ("true-pinch","pinch-switch")
 assert a["design"] in ("LANDSCAPE","RIFT")
 assert a["originalRoadRimId"]=="B48 original physics p93-CROWN_REVERSAL-01:377:390"
 assert len(a["originalRoadRimWorldXYZ"])==len(a["originalCXExactLandingXYZ"])==3
 assert a["originalCXSurfaceNearestDistance"]<.6
 assert 6<=a["actualEditableBlenderObjectCount"]<=20
 assert all(isinstance(v,list) and len(v)==4 and v[3]>0 for v in a["realOriginalCollisionTriangleOverlapPairsNotWaived"])
 assert all(len(v)==2 for v in a["all28B51Original721TickCoarseAABBWarningsNotWaived"])
 assert a["privateEditableBlend"].endswith(".blend")
 assert len(a["sourceR1SevenFramesActuallyRendered"])==7
 assert a["newSourceGameColliders"]==a["officialArt"]==a["officialSlope2Meters"]==0
 for key in ("originalSourceGameModified","sourceActualBrowserWebGL","humanStructuralLoadingCertified",
   "actualRoadToBuildingFullWidthHumanWalkCertified","originalB51HumanWarningFairnessCertified",
   "genuineArtApproved"):assert a[key] is False,key
 assert all(a[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 fh=a["sourceR1CameraThirteenFrameInitialHit"]
 assert len(fh)==13 and set(TIMES).issubset(set(fh))
 for f in fh.values():
  assert f["originalSourceCameraRays"]==228
  assert 0<=f["newStudyFirstHits"]<=228
  assert abs(f["newStudyFirstHitFraction"]-f["newStudyFirstHits"]/228)<.00002
 assert set(a["openMainVoidSampledHorizontalRayHitsNotArtProof"])=={"3","10","18","26"}
 return True
def mutation_rejected(a,do):
 t=copy.deepcopy(a);do(t)
 try:check(t)
 except (AssertionError,KeyError,ValueError,TypeError):return True
 raise AssertionError("R15J_FALSE_CERTIFICATE_WAS_ACCEPTED")
a=json.load(open(p.audit,encoding="utf8"));check(a)
road=a["originalRoad"];variant=a["design"]
os.makedirs(p.out,exist_ok=True)
contact=Image.new("RGB",(1040,7*326),(25,27,29))
draw=ImageDraw.Draw(contact)
image_diff={}
for i,t in enumerate(TIMES):
 original=Image.open(os.path.join(p.original,
   "R1_"+road+"_"+t+"_TRUE_BLENDER_SOURCE_NOT_WEBGL.png")).convert("RGB")
 trial=Image.open(os.path.join(p.trial,
   "R15J_"+variant+"_"+road+"_"+t+"_TRUE_R1_CAMERA_BLENDER_NOT_WEBGL.png")).convert("RGB")
 assert original.size==trial.size and original.width>=800 and original.height>=500
 delta=ImageChops.difference(original,trial)
 fraction=sum(max(x)>45 for x in delta.getdata())/(original.width*original.height)
 image_diff[t]=round(fraction,5)
 original.thumbnail((500,300));trial.thumbnail((500,300))
 y=i*326
 draw.text((5,y+2),"Original R1 "+road+" "+t,fill=(220,220,220))
 draw.text((522,y+2),"R15J "+variant+" source Blender "+t,fill=(220,220,220))
 contact.paste(original,(5,y+24));contact.paste(trial,(522,y+24))
image_name="R15J_"+variant+"_"+road+"_ORIGINAL_R1_7_FRAME_IMAGE_COMPARISON.jpg"
contact.save(os.path.join(p.out,image_name),quality=88)
fractions=[a["sourceR1CameraThirteenFrameInitialHit"][x]["newStudyFirstHitFraction"] for x in TIMES]
mean=statistics.mean(fractions)
# Significant original obstruction or B51 warnings veto EVEN preliminary
# physics safety. First-hit alone cannot make this beautiful to humans.
geometry="SOURCE_GEOMETRY_CONFLICT" if a["realOriginalCollisionTriangleOverlapPairsNotWaived"] else "SOURCE_TRIANGLE_OVERLAP_0_ONLY"
b51="SOURCE_B51_ENVELOPE_WARNING" if a["all28B51Original721TickCoarseAABBWarningsNotWaived"] else "SOURCE_B51_COARSE_AABB_CLEAR_ONLY"
impact="TOO_SMALL_IN_NATIVE_CAMERAS" if mean<.08 else "IMAGE_VIEW_REQUIRED_NOT_ART_PASS"
mutations=[
 ("ART",lambda z:z.__setitem__("officialArt",1)),
 ("HUMAN",lambda z:z.__setitem__("actualRoadToBuildingFullWidthHumanWalkCertified",True)),
 ("GAME",lambda z:z.__setitem__("sourceActualBrowserWebGL",True)),
 ("B51",lambda z:z.__setitem__("originalB51HumanWarningFairnessCertified",True)),
 ("GAME_EDIT",lambda z:z.__setitem__("originalSourceGameModified",True)),
 ("NO_MESH",lambda z:z.__setitem__("actualEditableBlenderObjectCount",0)),
 ("SOURCE",lambda z:z.__setitem__("originalSourceBlob","fake")),
 ("CAMERA",lambda z:z["sourceR1CameraThirteenFrameInitialHit"]["t1300"].__setitem__("newStudyFirstHitFraction",.5)),
]
for name,do in mutations:mutation_rejected(a,do)
report={"schema":"dopagaki.r15j-independent-real-r1-visual-geometry-verdict/1",
 "sourceBlob":SRC,"road":road,"variant":variant,
 "originalR1ImageComparison":image_name,
 "differenceFractionOver45AtSevenActualR1FramePixels":image_diff,
 "mean13To17SevenFrameSourceNewFirstHitNotBeauty":round(mean,5),
 "researchArtImpactOnly":impact,
 "sourceIntersectionStatus":geometry,"B51ConservativeSourceStatus":b51,
 "actualOpenAtriumAndGroundStructureNotCertified":True,
 "negativeCertificationMutationsRejected":[x[0] for x in mutations],
 "officialArt":0,"officialSlope2Meters":0,"newGameColliders":0,
 "ART":"REJECT" if mean<.08 or geometry=="SOURCE_GEOMETRY_CONFLICT" else "HOLD",
 "GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD","INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(p.out,"R15J_"+variant+"_"+road+"_INDEPENDENT_IMAGE_AND_SOURCE_GATE.json"),"w",encoding="utf8") as f:
 json.dump(report,f,indent=2)
print("R15J_INDEPENDENT_R1_SOURCE_COMPARISON",road,variant,"sourceCameraRays",mean,
 "intersections",geometry,"hazard",b51,"art",impact,"no release approval")
