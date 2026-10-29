"""R15K4B independent real source CX polygon 25-point support and screen gate.

Not an independent Blender BVH mesh solver. Reconcile 25 actual source
footprint witness cells, two ROAD matching, frame-visibility and B51 warnings
against saved R15K3 source frames, enforce no human/ART/gameplay promotion,
reject forged geographic, screen, topology and authorization claims.
"""
import json,os,copy,math,argparse
P=argparse.ArgumentParser()
for k in ("r15k","r15k3","r15k4","data","out"):P.add_argument("--"+k,required=True)
a=P.parse_args()
read=lambda p:json.load(open(p,encoding="utf8"))
K=read(a.r15k);K3=read(a.r15k3);K4=read(a.r15k4);D=read(a.data)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
roads=("true-pinch","pinch-switch")
patches=("02 roadbank-promenade None","04 roadbank-promenade None")
def validate(d):
 assert d["schema"]=="dopagaki.r15k4b-original-upface-triangulated-interior-25point-floor-recheck/1"
 assert d["sourceCXBlob"]==K["originalSourceCXBlob"]==K3["sourceBlob"]==K4["sourceBlob"]==SRC
 assert d["sourceWorlds"]==list(roads)
 assert d["sourceOriginalCXMeshes"]==list(patches)
 assert d["priorR15K4DisqualifiedEdgeAnchoredStudyBoxes"]==30
 assert d["noNewMeshesOrCollider"] is True
 for x in ("anyOriginalRoadToCXPublicAccessibleRouteBuilt","allOriginalMovingB51TrueObstaclesRendered",
  "physicalLoadOrStructureCertified","actualRealGameplayWebGL","humanArtApproved"):
  assert d[x] is False,x
 assert (d["newSourceGameColliders"],d["officialArt"],d["officialSlope2Meters"])==(0,0,0)
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 worlds=d["sourceFaceInteriorWorldResults"]
 assert set(worlds)==set(roads)
 originals={}
 num=0
 for road in roads:
  assert set(worlds[road])==set(patches)
  originals[road]={}
  for patch in patches:
   info=worlds[road][patch]
   assert info["originalSourceUpFaceTriangleCount"]>=1
   assert info["originalSourceUpFaceTriangleAreaSumSqm"]>0
   assert len(info["originalSourceUpFacePolygonIndices"])>=1
   assert info["sourceFaceInteriorSamplePoints"]>=0
   assert info["initialR15K4ZeroFootprintSelectionWasEdgeAnchored"] is True
   c=info["sourceCentreInteriorNoNewMeshes"]
   assert len(c)==info["fullySourceGrounded25PointStudyBoxes"] and len(c)<=20
   for item in c:
    cid=item["id"]
    assert cid not in originals[road]
    assert cid.startswith(patch+"|") and cid.endswith(("|4","|8","|14","|24"))
    assert len(item["centreOriginalCXFaceXYZ"])==3
    side=item["virtualSquareFootprintSideMetres"];height=item["virtualHeightMetres"]
    assert (side,height) in ((4.,10.),(8.,14.),(14.,24.),(24.,48.))
    probes=item["originalFootprint5By5SourceFaceChecks"]
    assert len(probes)==25
    assert item["full25PointOriginalTopFaceMembership"] is True
    assert all(q["onSameSourceCXUpFacingTriangle"] for q in probes)
    assert all(q["originalSurfaceFaceIndex"] in info["originalSourceUpFacePolygonIndices"] for q in probes)
    assert all(q["originalSurfaceY"] is not None and
       abs(q["originalSurfaceY"]-item["centreOriginalCXFaceXYZ"][1])<=.301 for q in probes)
    assert {(x["u"],x["v"]) for x in probes}=={(u,v) for u in (-1,-.5,0,.5,1) for v in (-1,-.5,0,.5,1)}
    f=item["sourceRoadsCamera"];assert len(f)==13
    assert [z["id"] for z in f]==["t"+str(n) for n in range(1100,1701,50)]
    src_haz={q["frame"]:q for r in K3["twoRoadTwoCXOriginalCameraDetailedComparisons"]
      if r["road"]==road and r["originalCXPatchName"]==patch
      for q in r["originalSourceRealCameraFrames"]}
    assert len(src_haz)==13
    for frame in f:
     assert frame["actualNewArchitectureSafetyOrArtCertified"] is False
     assert 0<=frame["sourceOriginalCXB48UnoccludedPointCount"]<=14
     b=frame["sourcePointBoundsNotRealMeshSilhouette"]
     aa=frame["sourceScreenPointBoundingAreaProxyPixelsSquared"]
     if b is None:
      assert aa==0 and frame["sourceOriginalCXB48UnoccludedPointCount"]==0
      assert frame["sourceOriginalB51EnvelopeDistancePixels"] is None
     else:
      assert len(b)==4 and 0<b[0]<=b[2]<1008 and 0<b[1]<=b[3]<645
      assert abs(round((b[2]-b[0])*(b[3]-b[1]),1)-aa)<=.2
      assert frame["sourceOriginalCXB48UnoccludedPointCount"]>0
     h=src_haz[frame["id"]]["projectedOriginalMovers"]
     assert frame["sourceOriginalB51CenterVisibleEnvelopeCount"]==len(h)
     if b and h:
      def sep(rect,obb):
       return math.hypot(max(rect[0]-obb[2],obb[0]-rect[2],0),
                         max(rect[1]-obb[3],obb[1]-rect[3],0))
      near=min(sep(b,q["conservativeYawSignUnionScreenBox"]) for q in h)
      assert abs(round(near,3)-frame["sourceOriginalB51EnvelopeDistancePixels"])<=.002
      assert frame["sourceOriginalB51ResearchGuard48pxConcern"]==(near<=48)
     else:
      assert frame["sourceOriginalB51EnvelopeDistancePixels"] is None
      assert frame["sourceOriginalB51ResearchGuard48pxConcern"] is False
    originals[road][cid]=item;num+=1
 pairs=d["matchedTwoRoadSourceOnlyCandidateScreenResults"]
 ids=set();test_recount=[]
 for item in pairs:
  cid=item["sourceMatchedCandidateId"]
  assert cid in originals[roads[0]] and cid in originals[roads[1]]
  assert cid not in ids;ids.add(cid)
  x=originals[roads[0]][cid];y=originals[roads[1]][cid]
  assert item["originalCXPatch"] in patches and cid.startswith(item["originalCXPatch"]+"|")
  assert x["centreOriginalCXFaceXYZ"]==y["centreOriginalCXFaceXYZ"]==item["virtualCentreXYZ"]
  assert x["virtualSquareFootprintSideMetres"]==y["virtualSquareFootprintSideMetres"]==item["squareSideMetres"]
  assert item["notRealGameB51FullSilhouette"] is True
  assert item["realArchitectureWalkArtSafetyAccepted"] is False
  readable=[];warnings=[]
  for f,g in zip(x["sourceRoadsCamera"],y["sourceRoadsCamera"]):
   assert f["id"]==g["id"]
   if all(z["sourceOriginalCXB48UnoccludedPointCount"]>=4 and
          z["sourceScreenPointBoundingAreaProxyPixelsSquared"]>=2500 for z in (f,g)):
    readable.append(f["id"])
   if f["sourceOriginalB51ResearchGuard48pxConcern"] or g["sourceOriginalB51ResearchGuard48pxConcern"]:
    warnings.append(f["id"])
  assert item["bothRoadOriginalSourceCameraSampleReadableFrames"]==readable
  assert item["originalB51ScreenBoxResearchConcernFrames"]==warnings
  run=best=0
  for t in ("t"+str(n) for n in range(1100,1701,50)):
   run=run+1 if t in readable else 0
   best=max(run,best)
  assert item["bothRoadLongestContinuousSourceFrameSamples"]==best
  eligible=best>=5 and not set(readable)&set(warnings)
  assert item["sourceOnlyConditionalCameraAndHalfsizeResearchMatch"]==eligible
  test_recount.append(item)
 assert ids==set(originals[roads[0]])&set(originals[roads[1]])
 test_recount.sort(key=lambda x:(-int(x["sourceOnlyConditionalCameraAndHalfsizeResearchMatch"]),
    -x["bothRoadLongestContinuousSourceFrameSamples"],-x["squareSideMetres"],x["sourceMatchedCandidateId"]))
 assert test_recount==pairs
 return {"uniqueSourceCXOriginalSurfacePatches":2,
  "bothRoadSourceGrounded25PointCandidateCount":len(pairs),
  "strictCameraHazardResearchSurvivors":sum(x["sourceOnlyConditionalCameraAndHalfsizeResearchMatch"] for x in pairs),
  "originalRealWalkableEntranceVerified":False}
summary=validate(D)
def veto(name,change):
 q=copy.deepcopy(D);change(q)
 try:validate(q)
 except (AssertionError,KeyError,ValueError,TypeError,IndexError):return name
 raise AssertionError("R15K4B_FALSE_ACCEPTED_"+name)
patch=patches[0];road=roads[0]
first=D["sourceFaceInteriorWorldResults"][road][patch]["sourceCentreInteriorNoNewMeshes"]
first_pair=D["matchedTwoRoadSourceOnlyCandidateScreenResults"]
def change_foot(q):
 q["sourceFaceInteriorWorldResults"][road][patch]["sourceCentreInteriorNoNewMeshes"][0]["originalFootprint5By5SourceFaceChecks"][0]["onSameSourceCXUpFacingTriangle"]=False
def change_frame(q):
 q["sourceFaceInteriorWorldResults"][road][patch]["sourceCentreInteriorNoNewMeshes"][0]["sourceRoadsCamera"][0]["sourceScreenPointBoundingAreaProxyPixelsSquared"]=999999
def change_B51(q):
 q["sourceFaceInteriorWorldResults"][road][patch]["sourceCentreInteriorNoNewMeshes"][0]["sourceRoadsCamera"][0]["sourceOriginalB51ResearchGuard48pxConcern"]=True
mutations=[("fake_art",lambda q:q.__setitem__("officialArt",1)),
 ("fake_webgl",lambda q:q.__setitem__("actualRealGameplayWebGL",True)),
 ("fake_walking",lambda q:q.__setitem__("anyOriginalRoadToCXPublicAccessibleRouteBuilt",True)),
 ("fake_physical_support",lambda q:q.__setitem__("physicalLoadOrStructureCertified",True)),
 ("fake_b51",lambda q:q.__setitem__("allOriginalMovingB51TrueObstaclesRendered",True)),
 ("fake_source",lambda q:q.__setitem__("sourceCXBlob","fake")),
 ("fake_newmesh",lambda q:q.__setitem__("noNewMeshesOrCollider",False)),
 ("fake_original_sites",lambda q:q.__setitem__("sourceOriginalCXMeshes",["02","04","04"])),
 ("fake_artcount",lambda q:q.__setitem__("officialSlope2Meters",100)),
 ("fake_footprint",change_foot if first else lambda q:q["sourceFaceInteriorWorldResults"][road][patch].__setitem__("fullySourceGrounded25PointStudyBoxes",88)),
 ("fake_screen",change_frame if first else lambda q:q.__setitem__("priorR15K4DisqualifiedEdgeAnchoredStudyBoxes",31)),
 ("fake_screen_b51",change_B51 if first else lambda q:q.__setitem__("humanArtApproved",True)),
 ("fake_final",lambda q:q["matchedTwoRoadSourceOnlyCandidateScreenResults"][0].__setitem__("realArchitectureWalkArtSafetyAccepted",True) if first_pair else q.__setitem__("officialArt",2))]
summary["independentFalseApprovalMutationsRejected"]=[veto(n,fn) for n,fn in mutations]
summary["schema"]="dopagaki.r15k4b-independent-genuine-cx-topface-25point-source-visibility/1"
summary.update({"sourceBlob":SRC,"sourceFaceGridReconciledBothRoads":True,
 "recomputedSourceB51ScreenConcernDistance":True,
 "actualNewBlenderCityMade":False,"humanArtGameplayWebGLPassed":False,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"})
os.makedirs(a.out,exist_ok=True)
with open(os.path.join(a.out,"R15K4B_INDEPENDENT_CX_FACE_25POINT_AND_SCREEN_GATE.json"),"w",encoding="utf8") as f:
 json.dump(summary,f,indent=2,ensure_ascii=False)
print("R15K4B_INDEPENDENT_TRUE_UPFACE_FOOTPRINT_BOTH_ROADS",summary,flush=True)
