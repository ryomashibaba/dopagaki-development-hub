"""R15I4: choose multi-camera, grade-feasible original-road/CX entrance studies.

Independent source R15I/R15I2 artifacts; no new Blender/physical changes.
ROAD and CX points are genuine, but the proposed cubic in air has NOT been
swept for original CX/B48 meshes, supports, or dynamic human B51 fairness.
Visibility is from original source camera only at one point, NOT true city art.
"""
import argparse,json,math,os
P=argparse.ArgumentParser()
P.add_argument("--r15i",required=True);P.add_argument("--r15i2",required=True);P.add_argument("--out",required=True)
arg=P.parse_args()
r1=json.load(open(arg.r15i,encoding="utf8"))
r2=json.load(open(arg.r15i2,encoding="utf8"))
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
assert r1["schema"]=="dopagaki.r15i-real-b48-road-rim-first-dual-original-world-entrance-support-preflight/1"
assert r2["schema"]=="dopagaki.r15i2-original-cx-terrain-real-3d-load-path-hypothesis-readonly/1"
assert r1["originalSourceCXBlob"]==r2["originalSourceCXBlob"]==SRC
assert r1["spatiallyDistinctSourceRoadsideTestHypotheses"]==r2["originalPairedWorldHypothesesTested"]==79
assert r1["eligibleSameXYZPhysicalSupportAndCameraStudyCount"]==0
assert r2["twoRoadUnbuiltCXBracingResearchHypothesisCount"]==42
assert not r1["realPublicFloorOrPedestrianEntranceBuilt"]
assert not r2["actualSupportStructuresBuilt"]
assert all(r1[k]=="HOLD" and r2[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
native={r:{a["id"]:a for a in r1["originalPairedWorldCandidateEvaluations"][r]} for r in ROADS}
terrain={r:{a["id"]:a for a in r2["sourceResultsByRoad"][r]} for r in ROADS}
assert len(native[ROADS[0]])==len(native[ROADS[1]])==79
def vec(v):return [float(z) for z in v]
def add(a,b):return [a[k]+b[k] for k in range(3)]
def minus(a,b):return [a[k]-b[k] for k in range(3)]
def scale(a,m):return [a[k]*m for k in range(3)]
def length(v):return math.sqrt(sum(x*x for x in v))
def curve(a,b,c,d,t):
 q=1-t
 return add(add(scale(a,q**3),scale(b,3*q*q*t)),
            add(scale(c,3*q*t*t),scale(d,t**3)))
rows=[]
for id in native[ROADS[0]]:
 a,b=(native[r][id] for r in ROADS)
 x,y=(terrain[r][id] for r in ROADS)
 assert id==a["id"]==b["id"]==x["id"]==y["id"]
 assert a["testDeckCenterXYZ"]==b["testDeckCenterXYZ"]
 assert a["rimMid"]==b["rimMid"]
 witnesses=[w["bestUnobstructedHypotheticalCXBrace"] for w in (x,y)]
 visible=set(a["sevenOriginalCameraSourceUnoccludedFrames"]) & set(b["sevenOriginalCameraSourceUnoccludedFrames"])
 record={"id":id,"originalRoadRimXYZ":a["rimMid"],"commonOriginalNativeCameraPointVisibleFrames":sorted(visible),
         "originalGameGeometryAndCXSupportCandidateOnly":False,
         "cameraImpactAndActualVisualArtCertified":False}
 reasons=[]
 if not all((w is not None) for w in witnesses):reasons.append("NO_NEAR_CX_ANCHOR")
 if not all(q["originalB48RoadRimWitness"] and q["priorRoadAdjacent8x6SourceGeometryClear"] and
     q["priorB51DeckConservativeEnvelopeClear"] and q["priorOriginalCameraUnoccludedFrameCount"]>=2 for q in (x,y)):
  reasons.append("SOURCE_B48_B51_OR_PROBE_VETO")
 if len(visible)<2:reasons.append("SHARED_SOURCE_CAMERA_POINT_VISIBILITY_LT2")
 if witnesses and all(w is not None for w in witnesses):
  p0,p1=(vec(w["trueNearestTriangleWorldXYZ"]) for w in witnesses)
  if length(minus(p0,p1))>5:reasons.append("PAIRED_WORLD_CX_LANDING_MISMATCH")
  src_center=vec(a["testDeckCenterXYZ"]);road_rim=vec(a["rimMid"]);outward=vec(a["outward"])
  ca=add(road_rim,scale(outward,.08))
  cb=add(src_center,scale(outward,2))
  cc=add(p0,add(scale(minus(p0,src_center),-.4),[0,.05,0]))
  cd=p0
  pts=[curve(ca,cb,cc,cd,t/32) for t in range(33)]
  lengths=[length(minus(v,u)) for u,v in zip(pts,pts[1:])]
  horizontal=[math.hypot(v[0]-u[0],v[2]-u[2]) for u,v in zip(pts,pts[1:])]
  slope=[abs(v[1]-u[1])/max(h,.001) for (u,v),h in zip(zip(pts,pts[1:]),horizontal)]
  total=sum(lengths);max_grade=max(slope)
  if not math.isfinite(total) or min(horizontal)<.12:reasons.append("DEGENERATE_APPROACH")
  if total>85:reasons.append("TOO_LONG_FOR_FIRST_INTEGRATED_REPRESENTATIVE_SLICE")
  if max_grade>=.09:reasons.append("CURVE_CENTERLINE_GRADE_GT_OR_EQ_9_PERCENT")
  record.update({"originalCXTerrainLandingWorldXYZ":list(cd),
       "originalCXSourceMeshName":witnesses[0]["cxTerrainSource"],
       "theoreticalBezierApproachMetres":round(total,3),
       "theoretical32SegmentMaxSlope":round(max_grade,5),
       "originalCXNearest3DSourceMetres":witnesses[0]["originalTerrainProximity3DMetres"],
       "sameTwoWorldSelectedLandingDeltaMetres":round(length(minus(p0,p1)),3)})
 else:
  record.update({"originalCXTerrainLandingWorldXYZ":None,
                 "theoreticalBezierApproachMetres":None,
                 "theoretical32SegmentMaxSlope":None})
 early=sum(t in visible for t in ("t1100","t1200","t1300","t1400"))
 coverage=len(visible)
 record["frames11to14BothRoads"]=early
 record["visibleOriginalCameraTimesBothRoads"]=coverage
 eligible=len(reasons)==0
 record["rejectedStudyReasons"]=reasons
 record["originalGameGeometryAndCXSupportCandidateOnly"]=eligible
 record["sourceResearchRankScore"]=round(
   early*5+coverage*2-max(0.,(record["theoreticalBezierApproachMetres"] or 10000)-25)*.1-
   (record["theoretical32SegmentMaxSlope"] or 10)*10,3) if eligible else None
 record["structuralSupportActuallyConstructed"]=False
 record["humanContinuousPublicWalkActuallyCertified"]=False
 record["genuineEditableFutureCityModelBuilt"]=False
 rows.append(record)
accepted=[r for r in rows if r["originalGameGeometryAndCXSupportCandidateOnly"]]
accepted.sort(key=lambda x:(-x["sourceResearchRankScore"],x["id"]))
assert len(accepted)>0,"no true source candidates after early-visibility slope preflight"
previous="B48 original physics p93-CROWN_REVERSAL-01:689:702"
prior=next(x for x in rows if x["id"]==previous)
assert prior["originalGameGeometryAndCXSupportCandidateOnly"],"R15I3 source site unexpectedly vetoed at I4"
report={"schema":"dopagaki.r15i4-dual-original-source-multicamera-true-cx-access-grade-shortlist/1",
 "sourceBlob":SRC,"pairedOriginalNativeRoads":list(ROADS),
 "originalSourceR15I77PlusCandidatesTested":len(rows),
 "originalRoadRimResearchCount":79,
 "previousR15I3SourceArtRejectedSiteId":previous,
 "previousR15I3NoArtPromotion":True,
 "commonTwoWorldOriginalCXSourceResearchRows":rows,
 "gradeAndEarlyCameraSelectionOnlyNotBuilt":accepted[:6],
 "theoreticalSourceModelSiteQualifiers":len(accepted),
 "noTrueSceneBlenderRenderedThisStage":True,
 "actual3DColliderAdded":False,
 "originalGameSourceModified":False,
 "humanWalkingRouteCertified":False,
 "fullB51AdvanceWarningOrFairHumanGameplayCertified":False,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
os.makedirs(arg.out,exist_ok=True)
with open(os.path.join(arg.out,"R15I4_ORIGINAL_TWO_ROAD_CX_MACRO_SITE_PREFLIGHT.json"),"w",encoding="utf8") as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print("R15I4_MULTI_CAM_2_ROAD_CX_THEORETICAL_SHORTLIST",len(accepted),
 "retained out of",len(rows))
print("R15I4_SOURCE_PROXY_ONLY_TOP",[(r["id"],r["theoreticalBezierApproachMetres"],
 r["theoretical32SegmentMaxSlope"],r["commonOriginalNativeCameraPointVisibleFrames"]) for r in accepted[:6]])
print("NEVER independent human road support or true source art approval",flush=True)
