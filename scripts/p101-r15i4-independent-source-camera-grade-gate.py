"""R15I4 independent source/camera/grade recomputation and adversarial QA."""
import argparse,json,math,os,copy
arg=argparse.ArgumentParser()
for name in ("r15i","r15i2","preflight","out"):arg.add_argument("--"+name,required=True)
p=arg.parse_args()
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
def load(file):
 with open(file,encoding="utf8") as f:return json.load(f)
r1=load(p.r15i);r2=load(p.r15i2);x=load(p.preflight)
def dist(a,b):return math.dist(a,b)
def mix(a,b,f):return [(1-f)*a[k]+f*b[k] for k in range(3)]
def independent_slope(a,b,c,d):
 # sampled cubic, formed from independent linear interpolation to avoid
 # trusting the generation output's calculated slope and distance.
 pts=[]
 for j in range(33):
  t=j/32
  aa=mix(a,b,t);bb=mix(b,c,t);cc=mix(c,d,t)
  pts.append(mix(mix(aa,bb,t),mix(bb,cc,t),t))
 ds=[dist(a,b) for a,b in zip(pts,pts[1:])]
 horizontal=[math.hypot(b[0]-a[0],b[2]-a[2]) for a,b in zip(pts,pts[1:])]
 grade=[abs(b[1]-a[1])/max(.001,h) for (a,b),h in zip(zip(pts,pts[1:]),horizontal)]
 return sum(ds),max(grade),min(horizontal)
def validate(x):
 assert x["schema"]=="dopagaki.r15i4-dual-original-source-multicamera-true-cx-access-grade-shortlist/1"
 assert x["sourceBlob"]==r1["originalSourceCXBlob"]==r2["originalSourceCXBlob"]==SRC
 assert x["pairedOriginalNativeRoads"]==list(ROADS)
 assert x["originalRoadRimResearchCount"]==79
 assert x["originalSourceR15I77PlusCandidatesTested"]==79
 assert x["previousR15I3NoArtPromotion"] is True
 assert x["previousR15I3SourceArtRejectedSiteId"]=="B48 original physics p93-CROWN_REVERSAL-01:689:702"
 for k in ("noTrueSceneBlenderRenderedThisStage","previousR15I3NoArtPromotion"):
  assert x[k] is True
 for k in ("actual3DColliderAdded","originalGameSourceModified",
           "humanWalkingRouteCertified","fullB51AdvanceWarningOrFairHumanGameplayCertified"):
  assert x[k] is False
 assert (x["officialArt"],x["officialSlope2Meters"])==(0,0)
 assert all(x[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 real={r:{z["id"]:z for z in r1["originalPairedWorldCandidateEvaluations"][r]} for r in ROADS}
 terrain={r:{z["id"]:z for z in r2["sourceResultsByRoad"][r]} for r in ROADS}
 assert len(x["commonTwoWorldOriginalCXSourceResearchRows"])==len(real[ROADS[0]])==79
 result=[]
 for z in x["commonTwoWorldOriginalCXSourceResearchRows"]:
  id=z["id"]
  assert id in real[ROADS[0]] and id in real[ROADS[1]]
  a,b=(real[r][id] for r in ROADS)
  aa,bb=(terrain[r][id] for r in ROADS)
  assert a["rimMid"]==b["rimMid"]==z["originalRoadRimXYZ"]
  assert a["testDeckCenterXYZ"]==b["testDeckCenterXYZ"]
  vis=set(a["sevenOriginalCameraSourceUnoccludedFrames"]) & set(b["sevenOriginalCameraSourceUnoccludedFrames"])
  assert sorted(vis)==z["commonOriginalNativeCameraPointVisibleFrames"]
  assert z["frames11to14BothRoads"]==len(vis & {"t1100","t1200","t1300","t1400"})
  assert z["visibleOriginalCameraTimesBothRoads"]==len(vis)
  assert z["cameraImpactAndActualVisualArtCertified"] is False
  assert z["structuralSupportActuallyConstructed"] is False
  assert z["humanContinuousPublicWalkActuallyCertified"] is False
  assert z["genuineEditableFutureCityModelBuilt"] is False
  witnesses=[w["bestUnobstructedHypotheticalCXBrace"] for w in (aa,bb)]
  rejects=[]
  if any(w is None for w in witnesses):rejects.append("NO_NEAR_CX_ANCHOR")
  if not all(t["originalB48RoadRimWitness"] and t["priorRoadAdjacent8x6SourceGeometryClear"]
      and t["priorB51DeckConservativeEnvelopeClear"] and t["priorOriginalCameraUnoccludedFrameCount"]>=2
      for t in (aa,bb)):rejects.append("SOURCE_B48_B51_OR_PROBE_VETO")
  if len(vis)<2:rejects.append("SHARED_SOURCE_CAMERA_POINT_VISIBILITY_LT2")
  if all(w is not None for w in witnesses):
   w0,w1=witnesses
   c=w0["trueNearestTriangleWorldXYZ"]
   if dist(c,w1["trueNearestTriangleWorldXYZ"])>5:rejects.append("PAIRED_WORLD_CX_LANDING_MISMATCH")
   center=a["testDeckCenterXYZ"];rim=a["rimMid"];direction=a["outward"]
   p0=[rim[i]+.08*direction[i] for i in range(3)]
   p1=[center[i]+2*direction[i] for i in range(3)]
   p2=[c[i]-.4*(c[i]-center[i])+(.05 if i==1 else 0) for i in range(3)]
   actual_len,actual_slope,min_horizontal=independent_slope(p0,p1,p2,c)
   assert z["originalCXTerrainLandingWorldXYZ"]==c
   assert z["originalCXSourceMeshName"]==w0["cxTerrainSource"]
   assert abs(z["theoreticalBezierApproachMetres"]-actual_len)<.002
   assert abs(z["theoretical32SegmentMaxSlope"]-actual_slope)<.00002
   if actual_len>85:rejects.append("TOO_LONG_FOR_FIRST_INTEGRATED_REPRESENTATIVE_SLICE")
   if actual_slope>=.09:rejects.append("CURVE_CENTERLINE_GRADE_GT_OR_EQ_9_PERCENT")
   # A duplicated or invalid parametric path is blocked before an art model.
   if not math.isfinite(actual_len) or min_horizontal<.12:rejects.append("DEGENERATE_APPROACH")
  assert sorted(z["rejectedStudyReasons"])==sorted(rejects),(id,z["rejectedStudyReasons"],rejects)
  allowed=not rejects
  assert z["originalGameGeometryAndCXSupportCandidateOnly"]==allowed
  if allowed:
   score=round(len(vis&{"t1100","t1200","t1300","t1400"})*5+len(vis)*2-
     max(0,actual_len-25)*.1-actual_slope*10,3)
   assert abs(z["sourceResearchRankScore"]-score)<.005
   result.append(z)
 result.sort(key=lambda q:(-q["sourceResearchRankScore"],q["id"]))
 assert x["theoreticalSourceModelSiteQualifiers"]==len(result)
 assert x["gradeAndEarlyCameraSelectionOnlyNotBuilt"]==result[:6]
 assert len(result)>0
 return len(result)
n=validate(x)
def veto(change):
 z=copy.deepcopy(x);change(z)
 try:validate(z)
 except (AssertionError,KeyError,ValueError,TypeError,IndexError,OverflowError):return
 raise AssertionError("FAKE_R15I4_APPROVAL_OR_SITE_EVIDENCE_ACCEPTED")
checks=[
 ("ART",lambda z:z.__setitem__("officialArt",1)),
 ("WEBGL",lambda z:z.__setitem__("noTrueSceneBlenderRenderedThisStage",False)),
 ("CANDIDATE_COUNT",lambda z:z.__setitem__("theoreticalSourceModelSiteQualifiers",999)),
 ("HUMAN",lambda z:z.__setitem__("humanWalkingRouteCertified",True)),
 ("ORIGINAL",lambda z:z.__setitem__("sourceBlob","spoofed")),
 ("GAMEPLAY",lambda z:z.__setitem__("GAMEPLAY","PASS"))]
if x["gradeAndEarlyCameraSelectionOnlyNotBuilt"]:
 checks.append(("GRADE",lambda z:z["gradeAndEarlyCameraSelectionOnlyNotBuilt"][0].__setitem__(
   "theoretical32SegmentMaxSlope",.8)))
for name,mut in checks:veto(mut)
o={"schema":"dopagaki.r15i4-independent-original-two-road-grade-veto/1",
   "originalSourceBlob":SRC,"originalRoadsideCandidatesIndependentlyChecked":79,
   "futureTheoreticalMacroSiteCandidates":n,"forgeryCasesRejected":[z[0] for z in checks],
   "sourceAndHumanGameplayUnmodified":True,
   "humanARTCertified":False,"realFoundationBuilt":False,"actualWebGLRendered":False}
os.makedirs(p.out,exist_ok=True)
with open(os.path.join(p.out,"R15I4_INDEPENDENT_TWO_ROAD_GRADE_AND_CAMERA_VETO.json"),"w",encoding="utf8") as f:
 json.dump(o,f,indent=2)
print("R15I4_SOURCE_ORIGINAL_INDEPENDENT_GRADE_RECALCULATED",n,
 "concept site ONLY, 79 real source witnesses, true new world ART 0")
