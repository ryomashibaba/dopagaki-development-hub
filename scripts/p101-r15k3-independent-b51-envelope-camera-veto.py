"""Independent R15K3 3D yaw± source hazard envelope original-camera gate.

Reprojects each source original R1 mover's eight corners with both sign
conventions; verifies recorded bounding boxes and distances to true R15K
CX source-face samples; refuses art/human/game/WebGL certification.
"""
import json,math,os,copy,argparse
from PIL import Image
P=argparse.ArgumentParser()
for t in ("r15k","native-true-pinch","native-pinch-switch","audit","images","out"):P.add_argument("--"+t,required=True)
a=P.parse_args()
SRC="af076d67492a677d2235e4730aef8cdf4808e106";W,H=1008,645
original=json.load(open(a.r15k,encoding="utf8"))
N={r:json.load(open(getattr(a,"native_"+r.replace("-","_")),encoding="utf8"))
   for r in ("true-pinch","pinch-switch")}
data=json.load(open(a.audit,encoding="utf8"))
def mul(v,n):return [n*x for x in v]
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def cross(a,b):return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
def norm(a):
 n=math.sqrt(dot(a,a));assert n>1e-7
 return [x/n for x in a]
def uv(frame,point):
 f=norm(frame["front"]);right=norm(cross(f,[0,1,0]));up=cross(right,f)
 delta=[x-y for x,y in zip(point,frame["eye"])]
 depth=dot(f,delta)
 if depth<=.01:return None
 # Re-solve the original ray projection, not trust generated screen coords.
 return [W*(.5+dot(right,delta)*.675/depth/(W/H)),
         H*(.5-dot(up,delta)*.675/depth)]
def obb(frame,h):
 cx,cy,cz=h["center"];sx,sy,sz=h["halfSize"]
 points=[]
 for sign in (-1,1):
  co=math.cos(sign*h["yawRadians"]);si=math.sin(sign*h["yawRadians"])
  for x in (-sx,sx):
   for y in (-sy,sy):
    for z in (-sz,sz):
     p=[cx+co*x+si*z,cy+y,cz-si*x+co*z]
     projected=uv(frame,p)
     if projected is not None:points.append(projected)
 if not points:return None
 return [round(min(q[0] for q in points),3),round(min(q[1] for q in points),3),
         round(max(q[0] for q in points),3),round(max(q[1] for q in points),3)]
def boxdist(pt,r):
 x,y=pt
 return math.hypot(max(r[0]-x,0,x-r[2]),max(r[1]-y,0,y-r[3]))
def validate(d,images=False):
 assert original["originalSourceCXBlob"]==d["sourceBlob"]==SRC
 assert d["schema"]=="dopagaki.r15k3-original-B51-halfsize-3d-yaw-conservative-cameras-vs-real-cx-surface/1"
 assert d["originalTwoRoads"]==["true-pinch","pinch-switch"]
 assert d["originalCXGroundPatchSourceNames"]==["02 roadbank-promenade None","04 roadbank-promenade None"]
 assert (d["originalScreenWidth"],d["originalScreenHeight"],d["researchGuardScreenPixels"])==(W,H,48)
 for flag in ("sourceYawSignConventionUnverifiedUnionBothSigns",
    "conservativeEnvelopeIsNotActual3DSourceMeshSilhouette",
    "originalSourceOriginalCenterVisibleMoversOnlyNotAll28OcclusionProven"):assert d[flag] is True
 for flag in ("originalGameSourceChanged","genuineRealWebGL","humanARTApproved"):assert d[flag] is False
 assert (d["newSourceGameColliders"],d["officialArt"],d["officialSlope2Meters"])==(0,0,0)
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert len(d["twoRoadTwoCXOriginalCameraDetailedComparisons"])==4
 seen=set();summary=[]
 for report in d["twoRoadTwoCXOriginalCameraDetailedComparisons"]:
  road=report["road"];source=report["originalCXPatchName"]
  assert road in N and source in d["originalCXGroundPatchSourceNames"]
  assert (road,source) not in seen;seen.add((road,source))
  assert report["sourceProjectedYawSignUnionNotTrueSourceMeshSilhouette"] is True
  assert report["realNewCitySourceGeometryAdded"] is False
  assert report["genuineHumanObstacleWarningFairnessTested"] is False
  frames={f["id"]:f for f in N[road]["frames"]}
  assert len(frames)==13
  sites=[x for x in original["originalSourceEvidenceByRoad"][road]["realOriginalSourceCXSiteObservations"].values()
    if x["originalCXSourceName"]==source]
  assert sites
  assert all(sites[0]["realOriginalCXSourceCameraViews"]==s["realOriginalCXSourceCameraViews"] for s in sites)
  patches={q["frame"]:q for q in sites[0]["realOriginalCXSourceCameraViews"]}
  baseline={q["frame"]:q["baselineOriginalB51CentersVisible"]
    for q in original["originalSourceEvidenceByRoad"][road]["originalB51BaselineCenterProjectionByCameraFrame"]}
  rows=report["originalSourceRealCameraFrames"]
  assert len(rows)==13 and set(x["frame"] for x in rows)==set(frames)
  if images:assert Image.open(os.path.join(a.images,report["thirteenFrameSourceComparisonImage"])).size==(1020,344*13)
  conflicts=0;ids=set()
  for row in rows:
   frame=frames[row["frame"]]
   points=[(round(x*W),round((1-y)*H)) for x,y in patches[row["frame"]]["normalizedVisibleSampleScreenCoordinates"]]
   movers={x["id"]:x for x in frame["moving"] if x["enabled"]}
   assert row["actualCXOriginalFaceSamplesVisible"]==len(points)
   original_cues=baseline[row["frame"]]
   assert row["originalCenterVisibleHazardsExamined"]==len(original_cues)
   assert row["allPhysicalHazardsAndRealHumanReactionCertified"] is False
   assert len(row["projectedOriginalMovers"])==len(original_cues)
   flags=[]
   for b,cue in zip(row["projectedOriginalMovers"],original_cues):
    assert b["id"]==cue["id"]
    mover=movers[b["id"]]
    assert b["genuineOriginalHalfSize"]==mover["halfSize"]
    assert abs(b["sourceYawRadians"]-mover["yawRadians"])<=.000001
    center=uv(frame,mover["center"]);assert center
    assert abs(center[0]/W-cue["sourceCameraUV"][0])<.00017
    assert abs(1-center[1]/H-cue["sourceCameraUV"][1])<.00017
    assert b["conservativeYawSignUnionScreenBox"]==obb(frame,mover)
    dist=min((boxdist(p,b["conservativeYawSignUnionScreenBox"]) for p in points),default=None)
    assert b["screenPixelDistanceFromSourceCXFaceSampleToProjectedBox"]==(
     round(dist,3) if dist is not None else None)
    near=dist is not None and dist<=48
    assert b["sourceProjectedB51EnvelopeWithin48pxOfPatch"]==near
    if near:flags.append(b["id"]);ids.add(b["id"])
   assert row["originalB51EnvelopeScreenNearCount"]==len(flags)
   assert row["originalB51EnvelopeNearIDs"]==sorted(flags)
   conflicts+=bool(flags)
  summary.append({"road":road,"originalPatch":source,"nearFrameCount":conflicts,"individualOriginalB51Ids":sorted(ids)})
 assert len(seen)==4
 return summary
result=validate(data,images=True)
def fake(name,fn):
 sample=copy.deepcopy(data);fn(sample)
 try:validate(sample)
 except (KeyError,AssertionError,TypeError,ValueError,IndexError):return name
 raise AssertionError("R15K3_FAKE_CERTIFICATION_ACCEPTED "+name)
attempts=[
 ("art",lambda z:z.__setitem__("officialArt",1)),
 ("game",lambda z:z.__setitem__("genuineRealWebGL",True)),
 ("human",lambda z:z["twoRoadTwoCXOriginalCameraDetailedComparisons"][0].__setitem__("genuineHumanObstacleWarningFairnessTested",True)),
 ("radius",lambda z:z.__setitem__("researchGuardScreenPixels",1)),
 ("geometry",lambda z:z.__setitem__("newSourceGameColliders",5)),
 ("source",lambda z:z.__setitem__("sourceBlob","forged")),
 ("fake_obb",lambda z:z["twoRoadTwoCXOriginalCameraDetailedComparisons"][0]["originalSourceRealCameraFrames"][3]["projectedOriginalMovers"][0].__setitem__("conservativeYawSignUnionScreenBox",[1,1,2,2])),
 ("fake_distance",lambda z:z["twoRoadTwoCXOriginalCameraDetailedComparisons"][0]["originalSourceRealCameraFrames"][3]["projectedOriginalMovers"][0].__setitem__("screenPixelDistanceFromSourceCXFaceSampleToProjectedBox",0)),
 ("fake_sign",lambda z:z.__setitem__("sourceYawSignConventionUnverifiedUnionBothSigns",False))
]
negative=[fake(n,f) for n,f in attempts]
out={"schema":"dopagaki.r15k3-independent-original-b51-obb-two-road-source-screen-gate/1",
 "sourceBlob":SRC,"originalR1SourcesByRoad":list(N),"checkedTrueSourcePatchCount":2,
 "sourceObbBoundingBoxAndDistanceIndependentlyRecomputed":True,
 "originalVisibleOnlyAndYawUncertaintyPreserved":True,
 "fourRoadPatchSourceResults":result,
 "rejectedFalseResultMutations":negative,
 "humanArtGameplayAndGenuineWebGLCertified":False,
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15K3_INDEPENDENT_ORIGINAL_OBB_CONSERVATIVE_CAMERA_VETO.json"),"w",encoding="utf8") as f:
 json.dump(out,f,ensure_ascii=False,indent=2)
print("R15K3_INDEPENDENT_REAL_SOURCE_3D_B51_ENVELOPE_RECALCULATED",
 result,"not actual obstacle mesh, not human, not ART",flush=True)
