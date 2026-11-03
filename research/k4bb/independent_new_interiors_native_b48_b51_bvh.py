"""Independent, Blender-native *limited geometry* contact audit for K4BB.

Tests visible candidate OFFROAD architectural meshes/curves against exact Road5
physical B48 triangles and six native 28-body source B51 OBBS. This is a STATIC
DCC research overlap survey, NOT game CCD, speed, human read, or SAT proof.
"""
import bpy, sys, os, json, math, hashlib
from mathutils import Vector
from mathutils.bvhtree import BVHTree
argv=sys.argv[sys.argv.index("--")+1:]
def get(key):
    i=argv.index(key);return os.path.abspath(argv[i+1])
model=get("--blend")
source=get("--source")
out=get("--out");os.makedirs(out,exist_ok=True)
data=json.load(open(source,encoding="utf8"))
assert data["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert data["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
bpy.ops.wm.open_mainfile(filepath=model)
scene=bpy.context.scene
roadcoll=bpy.data.collections.get("K4AY SOURCE B48 | CONTROL | TRUE TESSELLATED ROAD5")
assert roadcoll is not None and len(roadcoll.objects)==1
roadobj=next(iter(roadcoll.objects))
assert roadobj.type=="MESH"
assert len(roadobj.data.polygons)==4728
assert len(roadobj.data.vertices)==2366
assert len([o for c in bpy.data.collections if c.name.startswith("K4BB 0")
            for o in c.objects])>100
def worldbounds(vertices):
    return (tuple(min(v[i] for v in vertices) for i in range(3)),
            tuple(max(v[i] for v in vertices) for i in range(3)))
def aabb_overlap(a,b,eps=.001):
    return all(a[0][i]<=b[1][i]+eps and a[1][i]>=b[0][i]-eps for i in range(3))
def bvhgeom(vertices,faces):
    # Full geometry is in Blender WORLD coordinate, no transform missing.
    assert len(vertices)>=3 and len(faces)>0
    return BVHTree.FromPolygons(vertices,faces,all_triangles=False)
rv=[roadobj.matrix_world@p.co for p in roadobj.data.vertices]
rf=[tuple(face.vertices) for face in roadobj.data.polygons]
road_bvh=bvhgeom(rv,rf);road_bound=worldbounds(rv)
# B51 original physics OBBs from source JSON, not visualization wireframe.
source_obbs=[]
unitcorners=[(x,z,y) for y in (-1,1) for z in (-1,1) for x in (-1,1)]
triangles=[
  (0,1,3),(0,3,2),(4,6,7),(4,7,5),
  (0,4,5),(0,5,1),(1,5,7),(1,7,3),
  (3,7,6),(3,6,2),(2,6,4),(2,4,0)
]
for mode in ("control","ultra"):
    for snapshot in data["modes"][mode]["sourceTimeRecords"]:
        tick=snapshot["tick"]
        assert abs(snapshot["sourceNativeSeconds"]-tick/240)<1e-11
        assert len(snapshot["B51CollisionOBBNotOriginalVisibleMesh"])==28
        for proxy in snapshot["B51CollisionOBBNotOriginalVisibleMesh"]:
            if not proxy["enabled"]:continue
            half=proxy["halfSize"]
            yaw=proxy["yawRadians"];co=math.cos(yaw);si=math.sin(yaw)
            cx,cy,cz=proxy["center"]
            # World web (x,y,z) -> Blender (x,-z,y) and original yaw.
            vertices=[]
            for ux,uz,uy in unitcorners:
                x=ux*half[0];y=-uz*half[2];z=uy*half[1]
                vertices.append(Vector((cx+co*x-si*y,
                                        -cz+si*x+co*y,cy+z)))
            source_obbs.append({
                "mode":mode,"tick":tick,"id":proxy["id"],
                "bounds":worldbounds(vertices),
                "bvh":bvhgeom(vertices,triangles)
            })
assert len(source_obbs)==168

# Ignore source B48 itself, reference OBB cages, camera/light and original
# old K4AX geometry, plus explicit road-inlay VISUAL_ONLY_PROPOSAL layer.
candidate=[]
for c in bpy.data.collections:
    if c.name.startswith(("K4BB 01 |","K4BB 02 |",
                           "K4BB 03 |")):
        for ob in c.objects:
            if ob.type in ("MESH","CURVE"):
                candidate.append(ob)
assert len(candidate)>=100
depsgraph=bpy.context.evaluated_depsgraph_get()
road_hits=[]; b51_hits=[]
tested_objects=0;tested_faces=0;all_bounds=[]
for obj in candidate:
    e=obj.evaluated_get(depsgraph)
    m=e.to_mesh()
    try:
        if m is None or not len(m.polygons):continue
        verts=[e.matrix_world@v.co for v in m.vertices]
        faces=[tuple(f.vertices) for f in m.polygons]
        tested_objects+=1;tested_faces+=len(faces)
        bound=worldbounds(verts)
        all_bounds.append(bound)
        bvh=None
        if aabb_overlap(bound,road_bound):
            bvh=bvhgeom(verts,faces)
            pairs=bvh.overlap(road_bvh)
            if pairs:road_hits.append({"object":obj.name,"trianglePairCount":len(pairs)})
        for body in source_obbs:
            if not aabb_overlap(bound,body["bounds"]):continue
            if bvh is None:bvh=bvhgeom(verts,faces)
            pairs=bvh.overlap(body["bvh"])
            if pairs:
                b51_hits.append({"object":obj.name,"mode":body["mode"],
                                  "tick":body["tick"],"sourceB51ID":body["id"],
                                  "trianglePairCount":len(pairs)})
    finally:
        e.to_mesh_clear()
report={
    "schema":"dopagaki.K4BB.independent-original-B48-B51-static-DCC-survey/1",
    "sourceBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
    "surveySourceRoad":"p93-PRISM_CREST-01",
    "sourceRoadTriangles":len(rf),
    "originalCameraNativeTickSourceOBBSnapshots":168,
    "sourceCollisionOBBNotVisibleGameMesh":True,
    "candidateArchitectureMeshOrCurveObjects":tested_objects,
    "candidateArchitectureEvaluatedFaces":tested_faces,
    "sourceRoadContactMeshes":road_hits,
    "nativeB51ContactMeshes":b51_hits,
    "sourcePhysicalRoadSkinModified":False,
    "otherSixRoadsFullIntersectionNotTested":True,
    "existingK4BAArchitectureNotRetestedByThisIndependentBVH":True,
    "onlyNewK4BBEditableCivicRoomsTested":True,
    "sourceRoadPBRUVIsNonCollidingDCCArtOnly":True,
    "sourceVisualOnlyRoadMaterialLayerExcluded":True,
    "allOriginalB51TimeSnapshotsCheckedNotContinuous":True,
    "wholeTrajectorySourceCCD":"NOT_TESTED_HOLD",
    "fullGameSpeedAndPhysics":"NOT_TESTED_HOLD",
    "humanReadabilityAndVisualSafety":"NOT_TESTED_HOLD",
    "ART":"REJECT_HOLD","HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD",
    "FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
    "formalArtAccepted":0,"slope2DNAMetres":0,
}
with open(os.path.join(out,"K4BB_INDEPENDENT_STATIC_B48_B51_GEOMETRY_AUDIT.json"),"w",encoding="utf8") as f:
    json.dump(report,f,ensure_ascii=False,indent=2)
assert tested_objects>=100
assert not road_hits, "true B48 intersects K4BB authored visible architecture: see report; DO NOT certify"
assert not b51_hits, "source native B51 OBB intersects K4BB authored visible architecture: see report; DO NOT certify"
print("K4BB_LIMITED_STATIC_B48_B51_SNAPSHOT_GEOMETRY_NONINTERSECTION_PASS_NOT_GAMEPLAY_SAFETY",
      json.dumps({"candidate":tested_objects,"faces":tested_faces,"roads":len(road_hits),
                  "B51OBBSnapshots":len(source_obbs),"B51contacts":len(b51_hits)}))
