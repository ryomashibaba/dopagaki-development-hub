"""R15I: original B48 roadside / CX-ground anchored entrance preflight.

Read-only source Blender study. This is NOT a public floor, bridge, supported
building, dynamic-hazard fairness certification or browser render. Both native
road variants must be checked at exactly the same world XYZ.
"""
import bpy, json, math, os, sys, collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index("--")+1:]
def arg(k):
    assert k in argv, "missing " + k
    return argv[argv.index(k)+1]
OUT=arg("--out");os.makedirs(OUT,exist_ok=True)
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
TIMES=("t1100","t1200","t1300","t1400","t1500","t1600","t1700")
native={r:json.load(open(arg("--native-"+r),encoding="utf8")) for r in ROADS}
hazards={r:json.load(open(arg("--hazards-"+r),encoding="utf8")) for r in ROADS}
for r in ROADS:
    assert native[r]["schema"]=="dopagaki.g4e7dz-r6d-r1-original-early-native/1"
    assert native[r]["sourceCXBlob"]==SHA and native[r]["road"]==r and len(native[r]["frames"])==13
    assert hazards[r]["sourceCXBlob"]==SHA and hazards[r]["road"]==r
    assert len(hazards[r]["hazards"])==28
def flat(v):
    t=Vector((v[0],0,v[2]))
    return t.normalized() if t.length>1e-6 else None
def xyz(v):
    return [round(float(a),4) for a in v]
def box(c,along,outward):
    # Study an 8m by 6m by 0.35m road-adjacent slab centered 5m OUTSIDE
    # the original visible road rim. Physical deck is NOT generated.
    v=[]
    for y in (-.25,.10):
        for a,b in ((-4,-3),(-4,3),(4,3),(4,-3)):
            v.append(c+along*a+outward*b+Vector((0,y,0)))
    faces=((0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7))
    tr=BVHTree.FromPolygons([tuple(x) for x in v],faces,all_triangles=False)
    bounds={"min":[min(p[k] for p in v) for k in range(3)],
            "max":[max(p[k] for p in v) for k in range(3)]}
    return tr,bounds,v
def intersects(a,b):
    return all(a["min"][k]<=b["max"][k] and b["min"][k]<=a["max"][k] for k in range(3))
def signature(CX,B48,B51):
    return (sorted((o.name,o["source_sha256"],len(o.data.polygons)) for o in CX),
       sorted((o.name,o["ORIGINAL_GAME_B48_SHA256"],len(o.data.polygons)) for o in B48),
       sorted((o.name,o["SOURCE_ORIGINAL_B51_ID"],len(o.data.vertices)) for o in B51))
def getscene(r):
    bpy.ops.wm.open_mainfile(filepath=arg("--source-"+r))
    scene=bpy.context.scene
    assert scene["DO_SCENE_IS_NOT_GAME_WEBGL"] and scene["DR_ACTUAL_B48_VOID_CELL52"]
    assert scene["DR_ACTUAL_B48_MESH_COUNT"]==7 and scene["DR_ACTUAL_B51_POSES_PER_FRAME"]==28
    CX=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
    B48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
    B51=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
    MOV=[o for o in bpy.data.objects if o.get("R1_B51_ID")]
    assert (len(CX),len(B48),len(B51),len(MOV))==(18,7,28,28)
    cams=bpy.data.collections["DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION"]
    early=bpy.data.collections["R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION"]
    assert len(cams.objects)==5 and len(early.objects)==8
    source=[]
    for ob in CX+B48:
        v=[ob.matrix_world@x.co for x in ob.data.vertices]
        t=BVHTree.FromPolygons([tuple(q) for q in v],
            [tuple(poly.vertices) for poly in ob.data.polygons],all_triangles=False)
        bb={"min":[min(p[k] for p in v) for k in range(3)],
            "max":[max(p[k] for p in v) for k in range(3)]}
        source.append((ob,t,bb))
    return scene,CX,B48,B51,MOV,cams,early,source

scene,CX,B48,B51,MOV,cams,early,source=getscene(ROADS[0])
pre=signature(CX,B48,B51)
frames=[next(f for f in native[ROADS[0]]["frames"] if f["id"]==t) for t in TIMES]
# REAL source top-surface perimeter: count edges incident on original
# nearly-horizontal upward-facing road polygons, not arbitrary sky boxes.
edges=collections.defaultdict(list)
top_polygons=0
for ob in B48:
    mat=ob.matrix_world
    v=[mat@x.co for x in ob.data.vertices]
    transform=mat.to_3x3().inverted().transposed()
    for poly in ob.data.polygons:
        normal=(transform@poly.normal).normalized()
        if abs(normal.y)<.48: continue
        top_polygons+=1
        ids=list(poly.vertices)
        center=sum((v[i] for i in ids),Vector())/len(ids)
        for i in range(len(ids)):
            a,b=ids[i],ids[(i+1)%len(ids)]
            edges[(ob.name,min(a,b),max(a,b))].append((center,v[a],v[b]))
raw=[]
for key,faces in edges.items():
    if len(faces)!=1:continue
    face,a,b=faces[0]
    mid=(a+b)*.5
    edge=flat(b-a)
    outward=flat(mid-face)
    if edge is None or outward is None:continue
    edge_length=(b-a).length
    if not(1<=edge_length<=300):continue
    matches=[]
    for f in frames:
        point=Vector(f["playerPosition"]); direction=flat(f["front"])
        if direction is None:continue
        horizontal=(flat(mid-point))
        horizontal_dist=math.hypot(mid.x-point.x,mid.z-point.z)
        if horizontal_dist>140 or abs(mid.y-point.y)>55:continue
        if abs(edge.dot(direction))<.35:continue
        matches.append((horizontal_dist+abs(mid.y-point.y)*.6,f))
    if not matches:continue
    dist,f=min(matches,key=lambda x:x[0])
    if abs(edge.dot(flat(f["front"])))<.35:continue
    # Orthogonalize outward to edge, so the 8x6m test volume is reproducible.
    outward=(outward-edge*outward.dot(edge)).normalized()
    if outward.dot(mid-face)<0:outward=-outward
    center=mid+outward*5+Vector((0,.15,0))
    if not all(math.isfinite(x) for x in center):continue
    raw.append({"id":key[0]+":"+str(key[1])+":"+str(key[2]),
      "roadSource":key[0],"rimMid":xyz(mid),"outward":xyz(outward),
      "along":xyz(edge),"testDeckCenterXYZ":xyz(center),
      "boundarySegmentLength":round(edge_length,3),
      "closestFrame":f["id"],"closestPlayerFrameDistance":round(dist,3)})
assert signature(CX,B48,B51)==pre
# Deduplicate on physical locations rather than repeating adjacent triangles.
raw.sort(key=lambda x:(x["closestPlayerFrameDistance"],x["id"]))
picked=[]
for item in raw:
    if all(math.dist(item["rimMid"],p["rimMid"])>=12 for p in picked):
        picked.append(item)
    if len(picked)==90:break
del scene,CX,B48,B51,MOV,cams,early,source
outcome={}
for r in ROADS:
    scene,CX,B48,B51,MOV,cams,early,source=getscene(r)
    before=signature(CX,B48,B51)
    roadTrees=[(ob,t) for ob,t,bb in source if ob in B48]
    dynamic=[h["sampledAabb"] for h in hazards[r]["hazards"] if h["sampledAabb"]]
    assert len(dynamic)==28
    result=[]
    for item in picked:
        mid=Vector(item["rimMid"]);center=Vector(item["testDeckCenterXYZ"])
        along=Vector(item["along"]).normalized();outward=Vector(item["outward"]).normalized()
        # A physical original B48 surface immediately INBOARD of the rim
        # is required; this does not create a human entrance or foundation.
        inboard=mid-outward*.50+Vector((0,4,0))
        roadHit=[]
        for ob,t in roadTrees:
            p,n,face,d=t.ray_cast(inboard,Vector((0,-1,0)),8)
            if p is not None and abs(n.y)>.45 and abs(p.y-mid.y)<1.8:
                roadHit.append((round(float(d),4),ob.name,xyz(p)))
        roadHit.sort()
        proposed,bounds,corners=box(center,along,outward)
        collided=[]
        for ob,t,bb in source:
            if intersects(bounds,bb):
                overlaps=proposed.overlap(t)
                if overlaps:collided.append({"source":ob.name,"triPairs":len(overlaps)})
        moving=[h["id"] for h in hazards[r]["hazards"] if h["sampledAabb"]
            and intersects(bounds,h["sampledAabb"])]
        # Ground directly beneath deck FOUR real corners, including CX18.
        ground=[]
        for corner in (center-along*3-outward*2,center+along*3-outward*2,
                       center+along*3+outward*2,center-along*3+outward*2):
            probe=corner+Vector((0,.25,0))
            hits=[]
            for ob,t,bb in source:
                hit,n,j,d=t.ray_cast(probe,Vector((0,-1,0)),45)
                if hit is not None and abs(n.y)>.35:
                    hits.append((float(d),ob.name))
            ground.append({"sourceGroundBelow45m":bool(hits),
                "nearestVerticalDistanceMetres":round(min(hits)[0],3) if hits else None,
                "nearestOriginalSurface":min(hits)[1] if hits else None})
        visible=[]
        for frame_index,f in enumerate(native[r]["frames"],1):
            if f["id"] not in TIMES:continue
            scene.frame_set(frame_index);bpy.context.view_layer.update()
            cam=cams.objects.get(f["id"]+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+f["id"]+" SOURCE CAMERA")
            assert cam and (cam.location-Vector(f["eye"])).length<.0002
            target=center+Vector((0,2.5,0))
            proj=world_to_camera_view(scene,cam,target)
            if proj.z<=0 or not (.055<proj.x<.945 and .075<proj.y<.925):continue
            ray=target-cam.location
            if ray.length<1:continue
            if any(t.ray_cast(cam.location,ray.normalized(),ray.length-.3)[0] is not None
                   for ob,t,bb in source):
                continue
            visible.append(f["id"])
        result.append({**item,
          "originalB48InboardSurfaceWitness":roadHit[0] if roadHit else None,
          "sourceCXB48CandidateDeckIntersectionPairs":collided,
          "B51Conservative721TickEnvelopeOverlaps":moving,
          "fourDeckCornersOriginalSourceSupportProximity":ground,
          "bothGroundContactAndStructuralFoundationCertified":False,
          "sevenOriginalCameraSourceUnoccludedFrames":visible,
          "actualGameCameraObstacleLegibilityCertified":False,
          "newFloorOrAccessRouteBuilt":False})
    assert signature(CX,B48,B51)==before
    outcome[r]=result
    print("R15I_REAL_B48_ORIGINAL_ROADSIDE_DIAGNOSTIC",r,"scanned",len(result),
      "inboardWitness",sum(bool(x["originalB48InboardSurfaceWitness"]) for x in result),
      "geometryClear",sum(not x["sourceCXB48CandidateDeckIntersectionPairs"] for x in result),
      flush=True)
# SAME spatial candidate must pass both original road variants.
combined=[]
for a,b in zip(outcome[ROADS[0]],outcome[ROADS[1]]):
    assert a["id"]==b["id"] and a["testDeckCenterXYZ"]==b["testDeckCenterXYZ"]
    is_road=all(x["originalB48InboardSurfaceWitness"] for x in (a,b))
    geometry=all(not x["sourceCXB48CandidateDeckIntersectionPairs"] for x in (a,b))
    moving=all(not x["B51Conservative721TickEnvelopeOverlaps"] for x in (a,b))
    vis=min(len(a["sevenOriginalCameraSourceUnoccludedFrames"]),
            len(b["sevenOriginalCameraSourceUnoccludedFrames"]))
    contact=min(sum(x["sourceGroundBelow45m"] for x in z["fourDeckCornersOriginalSourceSupportProximity"])
        for z in (a,b))
    score=vis*2+contact*2-a["closestPlayerFrameDistance"]*.02
    combined.append({"id":a["id"],"testDeckCenterXYZ":a["testDeckCenterXYZ"],
     "originalRoadRimXYZ":a["rimMid"],"bothOriginalRoadSourceRimWitness":bool(is_road),
     "bothOriginalWorldHypotheticalDeckGeometryClear":bool(geometry),
     "bothOriginalWorldB51ConservativeEnvelopeClear":bool(moving),
     "minimumActualGroundUnderFourTestCorners":contact,
     "minimumVisibleSourceCameraFrames":vis,"researchScore":round(score,3),
     "eligibleForNextStructuralDesignStudy":bool(is_road and geometry and moving and vis>=2 and contact>=2),
     "publicEntranceCertified":False,"structuralFoundationCertified":False})
eligible=sorted((x for x in combined if x["eligibleForNextStructuralDesignStudy"]),
    key=lambda x:(-x["researchScore"],x["id"]))
report={"schema":"dopagaki.r15i-real-b48-road-rim-first-dual-original-world-entrance-support-preflight/1",
 "originalSourceCXBlob":SHA,"originalCX18":18,"originalB48":7,"originalB51":28,
 "sourcePhysicsHz":240,"bothOriginalRoadVariants":list(ROADS),
 "originalB48TopSurfacePolygonsObserved":top_polygons,
 "actualOriginalB48TopFaceBoundaryEdges":sum(len(v)==1 for v in edges.values()),
 "nativeTrajectoryWindows":list(TIMES),
 "physicalRoadsideSourceHypothesesBeforeSpatialDedup":len(raw),
 "spatiallyDistinctSourceRoadsideTestHypotheses":len(picked),
 "originalPairedWorldCandidateEvaluations":outcome,
 "independentlyOrderedSameXYZBothRoadNextStudyCandidates":eligible[:8],
 "eligibleSameXYZPhysicalSupportAndCameraStudyCount":len(eligible),
 "resultStatus":"PRELIMINARY_GEOMETRY_AND_GROUND_PROXIMITY_NOT_HUMAN_ACCESS",
 "realPublicFloorOrPedestrianEntranceBuilt":False,
 "realFoundationsOrLoadPathsBuilt":False,
 "actualBlenderArtStudyProduced":False,
 "realWebGLGameRendered":False,"originalGameEdited":False,
 "originalB51ObstacleWarningAndHumanFairnessCertified":False,
 "officialArt":0,"officialSlope2Meters":0,"newGameColliders":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(OUT,"R15I_TRUE_B48_ROAD_FIRST_TWO_WORLD_PREFLIGHT.json"),"w",encoding="utf8") as f:
    json.dump(report,f,ensure_ascii=False,indent=2)
print("R15I_FINAL_SOURCE_ONLY_ROAD_FIRST",len(eligible),"eligible for NEXT engineering study",
      "NO BUILT ENTRANCE OR FOUNDATION; NO ART OR GAMEPLAY APPROVAL",flush=True)
