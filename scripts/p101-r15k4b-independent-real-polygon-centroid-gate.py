"""R15K4B independent polygon topological support QA without Blender API.

Recompute true original face XZ inclusion, area and centroid for all 36
paired layout trials from output world vertices. Reject fabricated B48 walking
route, visual art, actual WebGL or new meshes.
"""
import argparse,json,math,copy,os
P=argparse.ArgumentParser()
for name in ("source","r15k","out"):P.add_argument("--"+name,required=True)
a=P.parse_args()
f=lambda p:json.load(open(p,encoding="utf8"))
data=f(a.source);r15k=f(a.r15k)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
SITES={"02 roadbank-promenade None":840.,"04 roadbank-promenade None":216.}
ROADS=("true-pinch","pinch-switch")
def polygon_contains(pt,verts):
 x,z=pt[0],pt[2]
 # Exact 2D XZ point-in-face: on-boundary counts as inside.
 for i in range(len(verts)):
  u,v=verts[i],verts[(i+1)%len(verts)]
  ax,az=u[0],u[2];bx,bz=v[0],v[2]
  cross=(x-ax)*(bz-az)-(z-az)*(bx-ax)
  dot=(x-ax)*(x-bx)+(z-az)*(z-bz)
  if abs(cross)<=.00002 and dot<=.00005:return True
 inside=False
 for i in range(len(verts)):
  xi,zi=verts[i][0],verts[i][2]
  xj,zj=verts[(i+1)%len(verts)][0],verts[(i+1)%len(verts)][2]
  if (zi>z)!=(zj>z) and x<(xj-xi)*(z-zi)/(zj-zi)+xi:inside=not inside
 return inside
def poly_area(v):
 return abs(sum(v[i][0]*v[(i+1)%len(v)][2]-v[(i+1)%len(v)][0]*v[i][2] for i in range(len(v)))*.5)
def check(d):
 assert d["schema"]=="dopagaki.r15k4b-actual-original-cx-up-facing-2face-interior-bvh-first-hit-ambiguity/1"
 assert d["sourceBlob"]==r15k["originalSourceCXBlob"]==SRC
 assert d["twoOriginalRoads"]==list(ROADS)
 assert d["originalCXSourceGeometry"]=={"CX":18,"B48":7,"B51":28}
 assert d["actualDistinctCXPolygonsExamined"]==2
 assert d["sourceUpwardPolygonArea840And216VerifiedDirectly"] is True
 assert d["newOriginalGameOrBlenderMeshes"]==d["officialArt"]==d["officialSlope2Meters"]==0
 for k in ("B48OriginalRoadIngressActualWalkableCertified",
   "sourceFloorLoadAndBuildingSafetyCertified","sourceVirtualMacroActuallyRenderedWebGL",
   "sourceGameModified"):
  assert d[k] is False,k
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 result=d["originalSource2FaceTrialsByRoad"];assert set(result)==set(ROADS)
 measurements={}
 for road in ROADS:
  assert set(result[road])==set(SITES)
  for name,expectedarea in SITES.items():
   r=result[road][name];vert=r["faceSourceWorldVertices"]
   assert len(vert)>=3 and len(vert)<100
   assert abs(poly_area(vert)-expectedarea)<.003
   assert abs(r["exactOriginalSourceFaceAreaSqm"]-expectedarea)<.001
   assert r["faceOriginalUpwardNormal"][1]>=.7
   centroid=r["faceSourceWorldCentroid"]
   assert all(abs(sum(p[i] for p in vert)/len(vert)-centroid[i])<=.001 for i in range(3))
   assert r["originalTriangleTessellationCount"]>=1
   assert len(r["originalR15KLandingWitnessPoints"])==(1 if name.startswith("02") else 2)
   trials=r["originalActualSurfacePolygonFootprintTrials"]
   assert len(trials)==18
   seen=set()
   for trial in trials:
    label=trial["label"];size=trial["widthDepthMetres"]
    assert size in (8,14,24)
    assert (label,size) not in seen;seen.add((label,size))
    point=trial["testedRealOriginalSourceWorldCentre"];assert len(point)==3
    if label=="ORIGINAL_R15K_ROAD_ANCHOR":
     assert point==r["originalR15KLandingWitnessPoints"][0]
    else:
     assert label.startswith("ACTUAL_ORIGINAL_FACE_CENTROID_")
     suffix=label.removeprefix("ACTUAL_ORIGINAL_FACE_CENTROID_")
     x,z=map(int,suffix.split("_"))
     assert (x,z) in ((0,0),(-4,0),(4,0),(0,-4),(0,4))
     assert abs(point[0]-centroid[0]-x)<.00001
     assert abs(point[2]-centroid[2]-z)<.00001
     assert abs(point[1]-centroid[1])<.00001
    sample=[]
    for u,v in ((-1,-1),(-1,1),(1,-1),(1,1),(0,0)):
     p=(point[0]+u*size/2,point[1],point[2]+v*size/2)
     sample.append(polygon_contains(p,vert) and abs(p[1]-centroid[1])<1.25)
    assert trial["explicitTrueOriginalUpwardFaceFootprintFive"]==sample
    assert trial["explicitTrueOriginalUpwardFaceFivePointSupported"]==sum(sample)
    assert trial["originalDirectPolygonIsActualWalkableConstructionCertified"] is False
    if trial["originalBVHNearestFaceDistance"] is not None:
     assert trial["originalBVHNearestFaceDistance"]>=0
   measurements[(road,name)]=r
 paired=d["pairedOriginalSourceTwoFacePositionAndFootprints"]
 assert len(paired)==36
 checked=set();ambiguities=0;centroid=0;anchor=0
 for trial in paired:
  name=trial["sourceCXOriginalPolygonName"];label=trial["footprintPosition"]
  size=trial["footprintWidthDepthMetres"]
  key=(name,label,size);assert key not in checked;checked.add(key)
  left=next(t for t in measurements[(ROADS[0],name)]["originalActualSurfacePolygonFootprintTrials"]
            if t["label"]==label and t["widthDepthMetres"]==size)
  right=next(t for t in measurements[(ROADS[1],name)]["originalActualSurfacePolygonFootprintTrials"]
             if t["label"]==label and t["widthDepthMetres"]==size)
  assert left["explicitTrueOriginalUpwardFaceFootprintFive"]==right["explicitTrueOriginalUpwardFaceFootprintFive"]
  assert trial["sourceTrueFaceFivePointBothWorldWitnessCount"]==left["explicitTrueOriginalUpwardFaceFivePointSupported"]
  assert trial["sourceOriginalBVHFirstRayNormalYPerRoad"]==[
    left["firstDownwardRayOriginalSourceFaceNormalY"],right["firstDownwardRayOriginalSourceFaceNormalY"]]
  full=left["explicitTrueOriginalUpwardFaceFivePointSupported"]==5
  assert trial["actualSourceOriginalFaceInteriorFull5PointsResearchOnly"]==full
  assert trial["humanRoadEntryOrStructuralArtApproved"] is False
  ambiguities+=int(full and any(n is not None and n<.7 for n in trial["sourceOriginalBVHFirstRayNormalYPerRoad"]))
  if full and label.startswith("ACTUAL_"):centroid+=1
  if full and label=="ORIGINAL_R15K_ROAD_ANCHOR":anchor+=1
 return {"verifiedUniqueOriginalCXPolygons":2,
  "pairedOriginalSurfaceFootprintTrials":len(paired),
  "full5InteriorCentroidBasedTrials":centroid,
  "full5InteriorPriorLandingBasedTrials":anchor,
  "sourceRayFaceOrientationAmbiguityCases":ambiguities,
  "publicWalkAndHumanArtApproved":False}
checkdata=check(data)
def mutate(name,fn):
 draft=copy.deepcopy(data);fn(draft)
 try:check(draft)
 except (AssertionError,KeyError,TypeError,ValueError,IndexError):return name
 raise AssertionError("R15K4B_FRAUD_ACCEPTED "+name)
cases=[
 ("art",lambda x:x.__setitem__("officialArt",1)),
 ("walk",lambda x:x.__setitem__("B48OriginalRoadIngressActualWalkableCertified",True)),
 ("webgl",lambda x:x.__setitem__("sourceVirtualMacroActuallyRenderedWebGL",True)),
 ("source",lambda x:x.__setitem__("sourceBlob","other")),
 ("polygon_area",lambda x:x["originalSource2FaceTrialsByRoad"]["true-pinch"]["02 roadbank-promenade None"].__setitem__("exactOriginalSourceFaceAreaSqm",900)),
 ("centroid",lambda x:x["originalSource2FaceTrialsByRoad"]["true-pinch"]["02 roadbank-promenade None"]["faceSourceWorldCentroid"].__setitem__(0,123)),
 ("footprint",lambda x:x["pairedOriginalSourceTwoFacePositionAndFootprints"][0].__setitem__("sourceTrueFaceFivePointBothWorldWitnessCount",5)),
 ("false_support",lambda x:x["pairedOriginalSourceTwoFacePositionAndFootprints"][0].__setitem__("actualSourceOriginalFaceInteriorFull5PointsResearchOnly",True)),
 ("fake_district",lambda x:x.__setitem__("actualDistinctCXPolygonsExamined",4))]
checkdata["rejectedForgedClaims"]=[mutate(x,y) for x,y in cases]
checkdata.update({"schema":"dopagaki.r15k4b-independent-original-polygon-xz-support-and-normal-ambiguity-gate/1",
 "sourceBlob":SRC,"originalWorldVerticesRecomputed":True,
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"})
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15K4B_INDEPENDENT_ORIGINAL_CX_FACE_CENTROID_AND_FOOTPRINT_GATE.json"),"w",encoding="utf8") as o:
 json.dump(checkdata,o,ensure_ascii=False,indent=2)
print("R15K4B_INDEPENDENT_ORIGINAL_REAL_POLYGON_CENTROID",checkdata,flush=True)
