"""R15I2 original CX terrain anchorage preflight.

Follow-up to R15I's 0/79 downhill-45m support probes. Search genuine
original terrain in THREE dimensions, not only directly below floating road.
This only supplies structural geometry hypotheses; no foundation or passage
is built or certified.
"""
import bpy,sys,os,json,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index("--")+1:]
def arg(k):
 assert k in args,k
 return args[args.index(k)+1]
out=arg("--out");os.makedirs(out,exist_ok=True)
src="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
study=json.load(open(arg("--r15i"),encoding="utf8"))
assert study["schema"]=="dopagaki.r15i-real-b48-road-rim-first-dual-original-world-entrance-support-preflight/1"
assert study["originalSourceCXBlob"]==src and study["eligibleSameXYZPhysicalSupportAndCameraStudyCount"]==0
assert study["realPublicFloorOrPedestrianEntranceBuilt"] is False
b51={r:json.load(open(arg("--hazards-"+r),encoding="utf8")) for r in ROADS}
for r in ROADS:
 assert b51[r]["sourceCXBlob"]==src and len(b51[r]["hazards"])==28
def vec(x):return Vector(x)
def coords(v):return [round(float(x),4) for x in v]
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
def box(a,b,radius):
 return {"min":[min(a[i],b[i])-radius for i in range(3)],
         "max":[max(a[i],b[i])+radius for i in range(3)]}
def overlap(a,b):
 return all(a["min"][i]<=b["max"][i] and b["min"][i]<=a["max"][i] for i in range(3))
def source_sig(cx,b48,b51_orig):
 return (sorted((o.name,o["source_sha256"],len(o.data.polygons)) for o in cx),
  sorted((o.name,o["ORIGINAL_GAME_B48_SHA256"],len(o.data.polygons)) for o in b48),
  sorted((o.name,o["SOURCE_ORIGINAL_B51_ID"],len(o.data.vertices)) for o in b51_orig))
result={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg("--source-"+road))
 s=bpy.context.scene
 assert s["DO_SCENE_IS_NOT_GAME_WEBGL"] and s["DR_ACTUAL_B48_MESH_COUNT"]==7
 cx=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
 b48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
 originals=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
 assert (len(cx),len(b48),len(originals))==(18,7,28)
 before=source_sig(cx,b48,originals)
 terrain=[(o,bvh(o)) for o in cx]
 protected=[(o,bvh(o)) for o in cx+b48]
 hz=[x for x in b51[road]["hazards"] if x["sampledAabb"]]
 assert len(hz)==28
 rows=[]
 for original in study["originalPairedWorldCandidateEvaluations"][road]:
  center=vec(original["testDeckCenterXYZ"])
  # Collect exact closest triangle points from original CX source terrain,
  # as well as 250m vertical ground rays that the old 45m probe missed.
  near=[]
  for obj,tree in terrain:
   hit,n,j,d=tree.find_nearest(center,300)
   if hit is not None and n is not None:
    near.append((float(d),obj.name,hit,n))
  near.sort(key=lambda a:(a[0],a[1]))
  down=[]
  for offset in ((0,0,0),(4,0,3),(-4,0,3),(4,0,-3),(-4,0,-3)):
   p=center+vec(offset)+Vector((0,.5,0))
   found=[]
   for ob,tr in terrain:
    hit,n,j,d=tr.ray_cast(p,Vector((0,-1,0)),250)
    if hit is not None:found.append((float(d),ob.name))
   if found:
    d,obj=min(found)
    down.append({"hit":True,"distance":round(d,3),"terrainObject":obj})
   else:down.append({"hit":False,"distance":None,"terrainObject":None})
  # The closest witnesses are not claimed as load-bearing anchors.
  anchors=[]
  for distance,obj,hit,normal in near[:5]:
   p=hit
   ray=p-center
   delta=ray.length
   if delta<1e-6: continue
   direction=ray.normalized()
   # Reject source intersections IN THE INTERIOR of a hypothetical
   # 3D brace. Original B48 contact at its entrance is not assessed here.
   obstacles=[]
   for protected_obj,t in protected:
    q,n,j,hitdist=t.ray_cast(center+direction*min(2.5,delta*.1),
       direction,max(0.,delta-min(3.5,delta*.2)))
    if q is not None:
     obstacles.append(protected_obj.name)
   envelope=box(center,p,1.2)
   moving=[h["id"] for h in hz if overlap(envelope,h["sampledAabb"])]
   anchors.append({"cxTerrainSource":obj,"trueNearestTriangleWorldXYZ":coords(p),
     "originalTerrainSurfaceNormal":coords(normal),
     "originalTerrainProximity3DMetres":round(distance,3),
     "hypotheticalBraceOriginalSourceInteriorIntersections":obstacles,
     "hypotheticalBraceB51AllTickConservativeEnvelopeOverlaps":moving,
     "structuralBraceActuallyConstructed":False})
  candidates=[a for a in anchors if a["originalTerrainProximity3DMetres"]<=120
     and not a["hypotheticalBraceOriginalSourceInteriorIntersections"]
     and not a["hypotheticalBraceB51AllTickConservativeEnvelopeOverlaps"]]
  best=candidates[0] if candidates else None
  rows.append({"id":original["id"],"testDeckCenterXYZ":original["testDeckCenterXYZ"],
   "originalB48RoadRimWitness":bool(original["originalB48InboardSurfaceWitness"]),
   "priorRoadAdjacent8x6SourceGeometryClear":not original["sourceCXB48CandidateDeckIntersectionPairs"],
   "priorB51DeckConservativeEnvelopeClear":not original["B51Conservative721TickEnvelopeOverlaps"],
   "priorOriginalCameraUnoccludedFrameCount":len(original["sevenOriginalCameraSourceUnoccludedFrames"]),
   "originalCXNearest3DMetres":round(near[0][0],3) if near else None,
   "originalCXNearestObject":near[0][1] if near else None,
   "actualSourceCXGroundFiveVertical250mRays":down,
   "terrainAnchorage3DWitnesses":anchors,
   "bestUnobstructedHypotheticalCXBrace":best,
   "originalB48AccessBridgeActuallyBuilt":False,
   "CXStructuralLoadPathPhysicallyCertified":False,
   "humanPublicEntranceCertified":False})
 assert source_sig(cx,b48,originals)==before
 result[road]=rows
 print("R15I2_ACTUAL_CX_TERRAIN",road,"source sites",len(rows),
  "CX proximity <=120m",sum(x["originalCXNearest3DMetres"] is not None
         and x["originalCXNearest3DMetres"]<=120 for x in rows),
  "unobstructed potential braces",sum(bool(x["bestUnobstructedHypotheticalCXBrace"]) for x in rows),flush=True)
# BOTH original road source worlds must witness nearly identical same-world
# terrain contact and preserve previous rim and original-camera checks.
common=[]
for a,b in zip(result[ROADS[0]],result[ROADS[1]]):
 assert a["id"]==b["id"] and a["testDeckCenterXYZ"]==b["testDeckCenterXYZ"]
 if not all(x["originalB48RoadRimWitness"] and x["priorRoadAdjacent8x6SourceGeometryClear"]
  and x["priorB51DeckConservativeEnvelopeClear"]
  and x["priorOriginalCameraUnoccludedFrameCount"]>=2
  and x["bestUnobstructedHypotheticalCXBrace"] for x in (a,b)):continue
 a0=a["bestUnobstructedHypotheticalCXBrace"];b0=b["bestUnobstructedHypotheticalCXBrace"]
 if math.dist(a0["trueNearestTriangleWorldXYZ"],b0["trueNearestTriangleWorldXYZ"])>5:continue
 common.append({"id":a["id"],"testDeckCenterXYZ":a["testDeckCenterXYZ"],
  "originalCXHypotheticalSharedSupportWitnessMetres":max(
    a0["originalTerrainProximity3DMetres"],b0["originalTerrainProximity3DMetres"]),
  "trueSourceCXEndpointXYZByRoad":{ROADS[0]:a0["trueNearestTriangleWorldXYZ"],
      ROADS[1]:b0["trueNearestTriangleWorldXYZ"]},
  "isOnlyUnbuiltStructuralResearchHypothesis":True,
  "realBuildingFoundation":False,"actualWalkingEntrance":False})
common.sort(key=lambda x:(x["originalCXHypotheticalSharedSupportWitnessMetres"],x["id"]))
output={"schema":"dopagaki.r15i2-original-cx-terrain-real-3d-load-path-hypothesis-readonly/1",
 "originalSourceCXBlob":src,"originalCX18":18,"originalB48":7,"originalB51":28,
 "originalPairedWorldHypothesesTested":len(result[ROADS[0]]),
 "sourceResultsByRoad":result,
 "bothRoadIdenticalWorldCXNearbyCandidateLocationsForFurtherEngineering":common[:10],
 "twoRoadUnbuiltCXBracingResearchHypothesisCount":len(common),
 "originalSourceFilesModified":False,
 "actualSupportStructuresBuilt":False,"actualHumanRoadAccessBuilt":False,
 "realSourceCameraBlenderArtProduced":False,"realBrowserWebGLTest":False,
 "obstacleWarningHumanFairnessCertified":False,
 "officialArt":0,"officialSlope2Meters":0,"newGameColliders":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(out,"R15I2_REAL_TERRAIN_BRACE_HYPOTHESES.json"),"w",encoding="utf8") as f:
 json.dump(output,f,ensure_ascii=False,indent=2)
print("R15I2_FINAL_TWO_WORLD_CX_UNBUILT_STUDIES",len(common),
   "NOT REAL FOUNDATIONS, WALKWAYS, ART, OR GAMEPLAY",flush=True)
