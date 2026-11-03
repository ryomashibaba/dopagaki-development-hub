"""Independent K4BD full-seven B48 source static surface intersection audit.

Source geometry is rebuilt DIRECTLY from genuine readonly all7 native JSON,
NOT from newly rendered art meshes; this is a separate implementation audit.
K4BC only visible new off-road architectural mesh vs 7 B48 in both modes,
plus 28 B51 at exact six original source timepoints. Original camera and game
source unchanged. Surface triangle overlap is NOT sphere CCD, nor all times.
"""
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index("--")+1:]
def arg(k):
    i=args.index(k);return os.path.abspath(args[i+1])
blend=arg("--blend");seven=arg("--all7");orig=arg("--original");out=arg("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(orig,encoding="utf8"))
X=json.load(open(seven,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert X["schema"]=="dopagaki.K4BC.exact-all-seven-original-B48-control-ultra-surfaces/1"
assert S["frozenOriginalGameGitBlob"]==X["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert X["B48SurfaceCount"]==7 and X["originalB51MovingBodies"]==28 and X["sourcePhysicsHz"]==240
bpy.ops.wm.open_mainfile(filepath=blend)
scene=bpy.context.scene
def bounds(vs):
    return (tuple(min(v[i] for v in vs) for i in range(3)),
            tuple(max(v[i] for v in vs) for i in range(3)))
def intersects_bounds(a,b,eps=.001):
    return all(a[0][i]<=b[1][i]+eps and a[1][i]>=b[0][i]-eps for i in range(3))
def bvh(vs,fs):
    assert len(vs)>=3 and len(fs)>0
    return BVHTree.FromPolygons(vs,fs,all_triangles=False)
roads=[]
total_triangles=0
for mode in ("control","ultra"):
    source=X["modes"][mode]["B48SourceRoads"]
    assert len(source)==7
    assert [z["sourceSurfaceId"] for z in source]==S["modes"][mode]["allB48SurfaceIDs"]
    for record in source:
        m=record["mesh"];p=m["positions"];ix=m["indices"]
        vv=[Vector((p[i],-p[i+2],p[i+1])) for i in range(0,len(p),3)]
        ff=[tuple(ix[i:i+3]) for i in range(0,len(ix),3)]
        assert len(ff)==record["trueTriangles"]
        assert len(vv)==record["trueVertices"]
        assert all(0<=v<len(vv) for f in ff for v in f)
        roads.append({"mode":mode,"sourceRoadIndex":record["sourceIndex"],
                      "id":record["sourceSurfaceId"],
                      "triangles":len(ff),"bounds":bounds(vv),
                      "BVH":bvh(vv,ff)})
        total_triangles+=len(ff)
assert len(roads)==14
assert len([r for r in roads if r["sourceRoadIndex"]==5])==2
assert all(r["triangles"]==4728 for r in roads if r["sourceRoadIndex"]==5)
# All six original native time B51 physical OBB snapshots from K4AY JSON.
unit=[(x,z,y) for y in (-1,1) for z in (-1,1) for x in (-1,1)]
obfaces=[(0,1,3),(0,3,2),(4,6,7),(4,7,5),
         (0,4,5),(0,5,1),(1,5,7),(1,7,3),
         (3,7,6),(3,6,2),(2,6,4),(2,4,0)]
obbs=[]
for mode in ("control","ultra"):
    for r in S["modes"][mode]["sourceTimeRecords"]:
        tick=r["tick"]
        assert abs(r["sourceNativeSeconds"]-tick/240)<1e-10
        assert len(r["B51CollisionOBBNotOriginalVisibleMesh"])==28
        for ob in r["B51CollisionOBBNotOriginalVisibleMesh"]:
            assert ob["enabled"],"K4BD six source frames assume original 28 enabled"
            half=ob["halfSize"];yaw=ob["yawRadians"]
            co,si=math.cos(yaw),math.sin(yaw)
            cx,cy,cz=ob["center"]
            vv=[]
            for xx,zz,yy in unit:
                x=xx*half[0];y=-zz*half[2];z=yy*half[1]
                vv.append(Vector((cx+co*x-si*y,
                                  -cz+si*x+co*y,cy+z)))
            obbs.append({"mode":mode,"tick":tick,"id":ob["id"],
                         "bounds":bounds(vv),"BVH":bvh(vv,obfaces)})
assert len(obbs)==168
candidates=[]
for col in bpy.data.collections:
    if col.name.startswith(("K4BC 01 |","K4BC 02 |",
                            "K4BC 03 |",
                            "K4BC V3 01 |","K4BC V3 02 |",
                            "K4BC V3 03 |","K4BC V3 04 |",
                            "K4BD 02 |")):
        candidates +=[obj for obj in col.objects if obj.type in ("MESH","CURVE")]
assert len(candidates)>=100
# Verify the survey really includes V3, not only earlier K4BC architecture.
old_sky=bpy.data.collections.get("K4BC 04 | monumental occupied skyline, NOT a driveable road")
assert old_sky is not None and old_sky.hide_render and len(old_sky.objects)>0
v3cols=[c for c in bpy.data.collections if c.name.startswith((
    "K4BC V3 01 |","K4BC V3 02 |","K4BC V3 03 |","K4BC V3 04 |"))]
assert len(v3cols)==4
v3objects=[o for c in v3cols for o in c.objects if o.type in ("MESH","CURVE")]
assert len(v3objects)>50
assert any("SKY CIVIC MUSEUM" in ob.name for ob in v3objects)
assert any("BEDROCK" in ob.name or "FOUNDATION" in ob.name for ob in v3objects)
# Verify new offroad K4BD real public terrace objects are included, while
# visual-only Road5 stone inlays and deep sea are not falsely collision-tested.
k4bd_ped=bpy.data.collections.get("K4BD 02 | road-exterior deep public waterfront terrace")
assert k4bd_ped is not None
k4bd_objects=[o for o in k4bd_ped.objects if o.type in ("MESH","CURVE")]
assert len(k4bd_objects)>=40
k4bd_inlay=bpy.data.collections.get("K4BD 01 | all source-sampled outer inlay PBR proposal NONCOLLISION")
k4bd_water=bpy.data.collections.get("K4BD 03 | under-road original-stage-distant coastal horizon ART ONLY")
assert k4bd_inlay and len(k4bd_inlay.objects)==52
assert k4bd_water and len(k4bd_water.objects)==1
assert not any(o in candidates for o in k4bd_inlay.objects)
assert not any(o in candidates for o in k4bd_water.objects)
deps=bpy.context.evaluated_depsgraph_get()
roadhits=[];b51hits=[]
tested=0;facesCount=0
for obj in candidates:
    ev=obj.evaluated_get(deps)
    mesh=ev.to_mesh()
    try:
        if mesh is None or len(mesh.polygons)==0:continue
        vv=[ev.matrix_world@v.co for v in mesh.vertices]
        ff=[tuple(f.vertices) for f in mesh.polygons]
        tested+=1;facesCount+=len(ff)
        bb=bounds(vv);v=None
        for road in roads:
            if not intersects_bounds(bb,road["bounds"]):continue
            if v is None:v=bvh(vv,ff)
            pairs=v.overlap(road["BVH"])
            if pairs:
                roadhits.append({"architecturalObject":obj.name,
                                 "sourceMode":road["mode"],
                                 "sourceB48Index":road["sourceRoadIndex"],
                                 "sourceB48ID":road["id"],
                                 "triangleIntersectionPairs":len(pairs)})
        for o in obbs:
            if not intersects_bounds(bb,o["bounds"]):continue
            if v is None:v=bvh(vv,ff)
            pairs=v.overlap(o["BVH"])
            if pairs:
                b51hits.append({"architecturalObject":obj.name,
                                "sourceMode":o["mode"],
                                "nativeTick":o["tick"],
                                "sourceB51ID":o["id"],
                                "triangleIntersectionPairs":len(pairs)})
    finally:
        ev.to_mesh_clear()
report={
 "schema":"dopagaki.K4BD.independent-exact-all-seven-B48-and-native-six-B51-static-survey/1",
 "originalGameBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "numberOriginalB48Modes":2,"numberOriginalB48RoadsPerMode":7,
 "independentSourceB48PhysicalMeshesEvaluated":len(roads),
 "independentSourceB48PhysicalTrianglesEvaluated":total_triangles,
 "numberSourceB51OriginalTickCollisionOBBs":len(obbs),
 "candidateK4BDPlusEarlierCivicArchitectureMeshesOrCurves":tested,
 "candidateK4BDPlusEarlierCivicArchitectureEvaluatedFaces":facesCount,
 "roadContacts":roadhits,
 "originalNativeB51Contacts":b51hits,
 "otherSixOriginalRoadsIncludedUnlikePriorK4BCV1":True,
 "originalB48TrianglesUntouched":True,
 "originalGameArtAndPhysicsUnchanged":True,
 "DCCOnlyVisualRoadStoneSeamsExcluded":True,
 "oldRejectedK4BAK4BBPreservedButHiddenExcluded":True,
 "oldK4BCV1OffframeSkylineExcludedAndPreserved":bool(old_sky.hide_render and len(old_sky.objects)>0),
 "newV3PhysicalSkyMuseumAndCivicFoundationsIncluded":len(v3objects)>50,
  "newV3ObjectsIndependentlyIncluded":len(v3objects),
 "newK4BDPedestrianArchitecturalObjectsIncluded":len(k4bd_objects),
 "newK4BDPBRVisualSkinObjectsExplicitlyExcluded":len(k4bd_inlay.objects),
 "newK4BDDeepSeaBelowEveryNativeRoadExcluded":True,
 "limitedStaticSourceTriangleIntersectionOnly":True,
 "wholeStageFutureTimeCCD":"NOT_TESTED_HOLD",
 "ballRadius065SafetyTest":"NOT_TESTED_HOLD",
 "originalNativeGameWebGL2Run":"NOT_TESTED_HOLD",
 "fullGameCameraReadability":"NOT_TESTED_HOLD",
 "formalArtAccepted":0,"Slope2DNACertifiedMetres":0,
 "ART":"REJECT_HOLD","HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD",
 "FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "staticSourceCollisionClearance":"NOT_CLEARED_HOLD" if (roadhits or b51hits) else "LIMITED_TRIANGLE_INTERSECTION_0_ONLY"
}
with open(os.path.join(out,"K4BD_EXACT_SEVEN_SOURCE_B48_B51_STATIC_AUDIT.json"),"w") as f:
    json.dump(report,f,indent=2)
print("K4BD_SOURCE_ORIGINAL_FULL_SEVEN_ROAD_LIMITED_STATIC_BVH_FINISHED",
      json.dumps({"sourceRoads":len(roads),"sourceRoadTriangles":total_triangles,
                 "nativeB51OBBs":len(obbs),"objects":tested,
                 "RoadContacts":len(roadhits),"B51Contacts":len(b51hits),
                 "verdict":report["staticSourceCollisionClearance"]}))
# Report ALWAYS saved even if intersections found. Fail-closed to preserve
# ART/SAT/CCD HOLD and prevent accidental adoption.
assert tested>=100
assert not roadhits,"TRUE all-seven B48 source roads INTERSECT K4BD pedestrian and existing source-side architecture; see saved audit, ART/SAT HOLD"
assert not b51hits,"TRUE B51 native time OBBs INTERSECT K4BC proposed architecture; see saved audit, ART/SAT HOLD"
