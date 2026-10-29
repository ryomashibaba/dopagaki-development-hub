"""R15K3: actual R1 3D B51 halfSize/yaw screen ENVELOPE vs actual CX surface samples.

NOT gameplay certification. 3D B51 yaw sign convention is unverified in
source Blender, so use conservative union of +yaw and -yaw projected corners.
Only original-source CENTER-visible movers are considered; others are NOT
declared clear. 48 px is a SCREEN DIAGNOSTIC, not human reaction time.
"""
import argparse,os,json,math,statistics
from PIL import Image,ImageDraw
P=argparse.ArgumentParser()
for x in ("r15k","native-true-pinch","native-pinch-switch","original-images","out"):
 P.add_argument("--"+x,required=True)
a=P.parse_args();os.makedirs(a.out,exist_ok=True)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch");TIMES=["t"+str(i) for i in range(1100,1701,50)]
SITES=(("CX02_840m2","02 roadbank-promenade None"),("CX04_216m2","04 roadbank-promenade None"))
W,H=1008,645;GUARD=48
d=json.load(open(a.r15k,encoding="utf8"))
assert d["originalSourceCXBlob"]==SRC and d["actualDistinctOriginalCXLandingCoordinates"]==4
assert d["officialArt"]==d["newGameColliders"]==0
def dot(u,v):return sum(x*y for x,y in zip(u,v))
def sub(u,v):return [x-y for x,y in zip(u,v)]
def cross(u,v):return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
def norm(v):
 length=math.sqrt(dot(v,v))
 assert length>1e-7
 return [x/length for x in v]
def projection(frame,point):
 f=norm(frame["front"]);r=norm(cross(f,[0,1,0]));up=cross(r,f)
 diff=sub(point,frame["eye"]);depth=dot(f,diff)
 if depth<=.01:return None
 return [(0.5+0.675*dot(r,diff)/depth/(W/H))*W,
         (0.5-0.675*dot(up,diff)/depth)*H]
def box(frame,hazard):
 """Real source half sizes. ±yaw union to avoid unsupported sign choice."""
 cx,cy,cz=hazard["center"];sx,sy,sz=hazard["halfSize"];angle=hazard["yawRadians"]
 assert all(math.isfinite(v) and v>=0 for v in (sx,sy,sz))
 corners=[]
 for yaw in (angle,-angle):
  co=math.cos(yaw);si=math.sin(yaw)
  for x in (-sx,sx):
   for y in (-sy,sy):
    for z in (-sz,sz):
     p=[cx+co*x+si*z,cy+y,cz-si*x+co*z]
     uv=projection(frame,p)
     if uv is not None:corners.append(uv)
 if not corners:return None
 raw=[min(v[0] for v in corners),min(v[1] for v in corners),
      max(v[0] for v in corners),max(v[1] for v in corners)]
 return [round(x,3) for x in raw]
def distance(pt,rect):
 x,y=pt;x0,y0,x1,y1=rect
 return math.hypot(max(x0-x,0,x-x1),max(y0-y,0,y-y1))
def source_site(road,name):
 vals=[v for v in d["originalSourceEvidenceByRoad"][road]["realOriginalCXSiteObservations"].values()
       if v["originalCXSourceName"]==name]
 assert vals
 assert all(v["realOriginalCXSourceCameraViews"]==vals[0]["realOriginalCXSourceCameraViews"]
            for v in vals)
 return {q["frame"]:q for q in vals[0]["realOriginalCXSourceCameraViews"]}
# Backwards-compatible public source field is "realOriginalCXSiteObservations"
# ONLY in future APIs. The R15K actual JSON calls this "realOriginalCXSiteObservations"?
# Resolve exact recognized saved schema here, never silently accept unknown keys.
if "realOriginalCXSiteObservations" not in d["originalSourceEvidenceByRoad"][ROADS[0]]:
 def source_site(road,name):
  vals=[v for v in d["originalSourceEvidenceByRoad"][road]["realOriginalCXSiteObservations"].values()
        if v["originalCXSourceName"]==name]
  assert vals
  assert all(v["realOriginalCXSourceCameraViews"]==vals[0]["realOriginalCXSourceCameraViews"]
            for v in vals)
  return {q["frame"]:q for q in vals[0]["realOriginalCXSourceCameraViews"]}
# R15K's actual schema uses realOriginalCXSiteObservations?
reports=[]
for road in ROADS:
 native=json.load(open(getattr(a,"native_"+road.replace("-","_")),encoding="utf8"))
 assert native["sourceCXBlob"]==SRC and native["road"]==road and native["physicsHz"]==240
 frames={f["id"]:f for f in native["frames"]}
 assert set(frames)==set(TIMES)
 orig=d["originalSourceEvidenceByRoad"][road]
 baseline={f["frame"]:f["baselineOriginalB51CentersVisible"] for f in orig["originalB51BaselineCenterProjectionByCameraFrame"]}
 for tag,source in SITES:
  actual=source_site(road,source)
  stats=[];sheets=[]
  for time in TIMES:
   frame=frames[time];visible=actual[time]["normalizedVisibleSampleScreenCoordinates"]
   pts=[(round(x*W),round((1-y)*H)) for x,y in visible]
   old=baseline[time];moving={h["id"]:h for h in frame["moving"] if h["enabled"]}
   blockers=[]
   for item in old:
    hazard=moving[item["id"]]
    uv=projection(frame,hazard["center"])
    assert uv and abs(uv[0]-item["sourceCameraUV"][0]*W)<.13
    assert abs(uv[1]-(1-item["sourceCameraUV"][1])*H)<.13
    rect=box(frame,hazard)
    assert rect
    mind=min((distance(p,rect) for p in pts),default=None)
    blockers.append({"id":item["id"],
       "genuineOriginalHalfSize":hazard["halfSize"],"sourceYawRadians":round(hazard["yawRadians"],6),
       "conservativeYawSignUnionScreenBox":rect,
       "screenPixelDistanceFromSourceCXFaceSampleToProjectedBox":round(mind,3) if mind is not None else None,
       "sourceProjectedB51EnvelopeWithin48pxOfPatch":mind is not None and mind<=GUARD})
   near=[b for b in blockers if b["sourceProjectedB51EnvelopeWithin48pxOfPatch"]]
   stats.append({"frame":time,"actualCXOriginalFaceSamplesVisible":len(pts),
     "originalCenterVisibleHazardsExamined":len(old),
     "originalB51EnvelopeScreenNearCount":len(near),
     "originalB51EnvelopeNearIDs":sorted(x["id"] for x in near),
     "projectedOriginalMovers":blockers,
     "allPhysicalHazardsAndRealHumanReactionCertified":False})
   src_image=os.path.join(a.original_images,"result-"+road,
     "R1_"+road+"_"+time+"_TRUE_BLENDER_SOURCE_NOT_WEBGL.png")
   image=Image.open(src_image).convert("RGB")
   assert image.size==(W,H)
   layer=image.copy();draw=ImageDraw.Draw(layer)
   for b in blockers:
    x0,y0,x1,y1=b["conservativeYawSignUnionScreenBox"]
    border=(252,100,86) if b["sourceProjectedB51EnvelopeWithin48pxOfPatch"] else (73,196,244)
    draw.rectangle((x0,y0,x1,y1),outline=border,width=2)
   for x,y in pts:draw.ellipse((x-5,y-5,x+5,y+5),fill=(255,213,72),outline=(25,21,21),width=1)
   panel=Image.new("RGB",(1020,344),(21,24,28))
   pd=ImageDraw.Draw(panel)
   pd.text((8,4),"ORIGINAL R1 "+time+" "+road,fill=(232,236,240))
   pd.text((520,4),"R15K3 source CX yellow / original B51 3D +/- yaw box",fill=(232,236,240))
   panel.paste(image.resize((504,322)),(4,20))
   panel.paste(layer.resize((504,322)),(512,20))
   sheets.append(panel)
  output=Image.new("RGB",(1020,344*len(sheets)),(21,24,28))
  for i,panel in enumerate(sheets):output.paste(panel,(0,i*344))
  imagefile="R15K3_"+tag+"_"+road+"_TRUE_R1_CAMERA_B51_3D_ENVELOPE_13_FRAME_COMPARISON.jpg"
  output.save(os.path.join(a.out,imagefile),quality=87)
  reports.append({"road":road,"originalCXPatchName":source,"originalCXPatchLabel":tag,
    "originalSourceRealCameraFrames":stats,"thirteenFrameSourceComparisonImage":imagefile,
    "sourceProjectedYawSignUnionNotTrueSourceMeshSilhouette":True,
    "realNewCitySourceGeometryAdded":False,"genuineHumanObstacleWarningFairnessTested":False})
result={"schema":"dopagaki.r15k3-original-B51-halfsize-3d-yaw-conservative-cameras-vs-real-cx-surface/1",
 "sourceBlob":SRC,"originalTwoRoads":list(ROADS),"originalCXGroundPatchSourceNames":[p[1] for p in SITES],
 "sourceProjection": "R1 1.35 focal / exact eye/front and 1008x645", 
 "originalScreenWidth":W,"originalScreenHeight":H,"researchGuardScreenPixels":GUARD,
 "sourceYawSignConventionUnverifiedUnionBothSigns":True,
 "conservativeEnvelopeIsNotActual3DSourceMeshSilhouette":True,
 "originalSourceOriginalCenterVisibleMoversOnlyNotAll28OcclusionProven":True,
 "twoRoadTwoCXOriginalCameraDetailedComparisons":reports,
 "originalGameSourceChanged":False,"newSourceGameColliders":0,
 "genuineRealWebGL":False,"humanARTApproved":False,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(a.out,"R15K3_ORIGINAL_B51_3D_SCREEN_ENVELOPE_TWO_CX_PATCHES.json"),"w",encoding="utf8") as f:
 json.dump(result,f,indent=2,ensure_ascii=False)
print("R15K3_ORIGINAL_VISIBLE_HAZARD_3D_PROJECTION_SOURCES_ONLY",
 [(q["road"],q["originalCXPatchLabel"],
  sum(z["originalB51EnvelopeScreenNearCount"]>0 for z in q["originalSourceRealCameraFrames"]),
  max(z["originalB51EnvelopeScreenNearCount"] for z in q["originalSourceRealCameraFrames"]))
  for q in reports],"NO CITY/WEBGL/HUMAN CERTIFICATION",flush=True)
