"""K4BU: repair ONE offscreen K4BS native pine by source-axis orientation + camera projection.

Single original research CHASE camera, one 768x480 REAL Blender render, one
editable .blend. Preserve the eight original CC0 source meshes and all game assets.
No original camera, physical Road5, collider, source game or production writes.
No claim that bbox, TECH PASS or render existence means visual ART PASS.
"""
import bpy, hashlib, json, math, struct, sys
from pathlib import Path
from math import sin, cos, pi
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

a = sys.argv[sys.argv.index("--")+1:]
def required(k):
    return Path(a[a.index(k)+1]).resolve()

parent = required("--base")
k4bt = required("--projection-audit")
outdir = required("--out")
outdir.mkdir(parents=True, exist_ok=True)

SHA_BLEND="156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de"
SHA_GAME="af076d67492a677d2235e4730aef8cdf4808e106"
SHA_ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"

def sha(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for b in iter(lambda:f.read(1<<20),b""):h.update(b)
    return h.hexdigest()

assert sha(parent)==SHA_BLEND
old=json.loads(k4bt.read_text(encoding="utf-8"))
assert old["originK4BSNativeBlendSHA256"]==SHA_BLEND
assert old["sourceGameImmutableBlob"]==SHA_GAME
assert old["summary"]["trees"]==8
assert old["summary"]["inFrameEnvelopes"]==5
assert old["summary"]["outOfFrame"]==3
assert old["summary"]["trianglesPerTree"]==398144
assert old["formalArtAccepted"]==old["formalSlope2DNAMetres"]==0

bpy.ops.wm.open_mainfile(filepath=str(parent))
scene=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
    return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
            for o in rig.objects if o.type=="CAMERA"}
camera_before=poses()
assert len(camera_before)>=6
research=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith(
          "K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(research)==1
cam=research[0]
cam_before=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
control=bpy.data.collections["K4AY SOURCE B48 | CONTROL | TRUE TESSELLATED ROAD5"]
ultra=bpy.data.collections["K4AY SOURCE B48 | ULTRA | TRUE TESSELLATED ROAD5"]
assert len(control.objects)==len(ultra.objects)==1
roads=[next(iter(control.objects)),next(iter(ultra.objects))]
def roadsha(ob):
    h=hashlib.sha256()
    for v in ob.data.vertices:h.update(struct.pack("<3d",*[float(z) for z in v.co]))
    for poly in ob.data.polygons:h.update(struct.pack("<3i",*[int(z) for z in poly.vertices]))
    return h.hexdigest()
assert {roadsha(r) for r in roads}=={SHA_ROAD}

trees=sorted((o for o in bpy.data.objects
             if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")),key=lambda o:o.name)
assert len(trees)==8
assert all(o.instance_type=="COLLECTION" for o in trees)
collection=trees[0].instance_collection
assert all(o.instance_collection==collection for o in trees)
meshes=[o for o in collection.objects if o.type=="MESH"]
assert len(meshes)==3
triangles=sum(len(p.vertices)-2 for ob in meshes for p in ob.data.polygons)
assert triangles==398144
other_matrices={o.name:o.matrix_world.copy() for o in trees[1:]}
hero=trees[0]
assert hero.get("source_road_station_d")==14
assert old["treeInstances"][0]["intersectsFrameByBoundingEnvelope"] is False

# Imported glTF is much longer in X than Z. Previous K4BS scaled Z
# height to 5.8m, leaving an apparently sideways/wide pine in camera.
# Rotate the longest native axis into world Z, then scale by that axis.
mastercorners=[m.matrix_world@Vector(c) for m in meshes for c in m.bound_box]
extent=[max(v[i] for v in mastercorners)-min(v[i] for v in mastercorners) for i in range(3)]
assert extent[0]>1.35*extent[2] and extent[0]>1.35*extent[1],extent
centre=Vector([(min(v[i] for v in mastercorners)+max(v[i] for v in mastercorners))*.5 for i in range(3)])

# Validate that source template * instance transform produces the same
# TRUE evaluated native mesh bounds as the K4BT audit, before correction.
def bounds(points):
    return ([min(v[i] for v in points) for i in range(3)],
            [max(v[i] for v in points) for i in range(3)])
pred= [hero.matrix_world@v for v in mastercorners]
pl,ph=bounds(pred)
reference=old["treeInstances"][0]["worldBoundsM"]
for i in range(3):
    assert abs(pl[i]-reference["min"][i])<.10,(i,pl,reference)
    assert abs(ph[i]-reference["max"][i])<.10,(i,ph,reference)

original_camera=next(o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name)
C=original_camera.location.copy()
direction=original_camera.matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((direction.x,direction.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):
    return C+F*d+S*s+Vector((0,0,z))
inverse=roads[0].matrix_world.inverted()
def ground(d):
    start=inverse@P(d,0,600)
    ray=(inverse.to_3x3()@Vector((0,0,-1))).normalized()
    hit,pos,n,idx=roads[0].ray_cast(start,ray,distance=1600)
    assert hit,("no authentic source Road5 under station",d)
    return float((roads[0].matrix_world@pos).z-C.z)
def terrain_height(d,s):
    h=ground(d)
    v=max(0,(abs(s)-16.4)/75)
    n=(sin(d*.17+s*.19)*.55+
       sin(d*.063-s*.117)*1.6+
       cos(d*.41-s*.35)*.26+
       sin(d*.93+s*.78)*.11)
    if s>0:return h+.3+9.5*v**.73+6*v*v+n*(.20+.82*v)
    return h+.3-13.0*v**.8-3.8*v*v+n*(.2+.55*v)

# Full candidate geometry projection at reference resolution, not a render.
# Keep the tree roadside: |s|>=26m, beyond study-road halfwidth=13.15m.
W,H=1280,800
def project(matrix):
    projected=[world_to_camera_view(scene,cam,matrix@v) for v in mastercorners]
    if any(v.z<=0 for v in projected):return None
    xs=[v.x*W for v in projected]
    ys=[(1-v.y)*H for v in projected]
    raw=[min(xs),min(ys),max(xs),max(ys)]
    clipped=[max(0,min(W,raw[0])),max(0,min(H,raw[1])),
             max(0,min(W,raw[2])),max(0,min(H,raw[3]))]
    w=max(0,clipped[2]-clipped[0])
    h=max(0,clipped[3]-clipped[1])
    return {"rawBBoxPx":[round(v,3) for v in raw],
            "clippedBBoxPx":[round(v,3) for v in clipped],
            "widthPx":round(w,3),"heightPx":round(h,3),
            "centreXFrac":round((clipped[0]+clipped[2])/(2*W),5),
            "bottomYFrac":round(clipped[3]/H,5),
            "envelopePct":round(100*w*h/(W*H),6)}

originalproj=project(hero.matrix_world)
assert originalproj is not None and originalproj["widthPx"]==0,originalproj

# Native source X (longest dimension) is corrected into Z-up via Y-axis
# rotation. The CC0 mesh geometry/material textures stay intact.
target_height=8.2
scale=target_height/extent[0]
assert 1.0<scale<12,scale
candidates=[]
for d in (55,66,77,88,99,110,121,132,143,154):
    for s in (-26,-32,-38,-44,-50,-56,-62):
        # Root the TRUE bounding-box foot at the authored terrain height;
        # K4BS had placed the bbox centre at ground and buried ~half the tree.
        position=P(d,s,terrain_height(d,s)+.15+target_height*.5)
        matrix=(Matrix.Translation(position)@
                Matrix.Rotation(math.radians(12),4,"Z")@
                Matrix.Rotation(-pi/2,4,"Y")@
                Matrix.Scale(scale,4)@
                Matrix.Translation(-centre))
        p=project(matrix)
        if p is None:continue
        if not (30<=p["widthPx"]<=180 and 50<=p["heightPx"]<=230):continue
        if not (.05<=p["centreXFrac"]<=.95 and .32<=p["bottomYFrac"]<=.96):continue
        # A tree silhouette should be readable near the right side while
        # preserving central view into the roadway, not artificial symmetry.
        score=(4*abs(p["centreXFrac"]-.68)+
               3*abs(p["bottomYFrac"]-.69)+
               2*abs(p["heightPx"]/H-.15)+
               .0007*abs(d-100))
        candidates.append((score,d,s,matrix,p))
assert candidates,("no bounded camera-readable research candidate",extent)
score,d,s,matrix,p=sorted(candidates,key=lambda v:(v[0],v[1],v[2]))[0]
hero.matrix_world=matrix
actual_bounds=bounds([matrix@v for v in mastercorners])
true_ground_z=P(d,s,terrain_height(d,s)).z
true_foot_clearance_m=actual_bounds[0][2]-true_ground_z
assert 0<=true_foot_clearance_m<=.6,(true_foot_clearance_m,actual_bounds)
assert abs((actual_bounds[1][2]-actual_bounds[0][2])-target_height)<.01
hero["K4BU_RESEARCH_TRANSFORM_ONLY"]=True
hero["K4BU_BEST_CANDIDATE_D"]=d
hero["K4BU_BEST_CANDIDATE_S"]=s
hero["K4BU_UPRIGHT_NATIVE_LONG_AXIS"]="X_TO_WORLD_Z"
hero["K4BU_VISUAL_APPROVAL"]="ART_REJECT_PENDING_ACTUAL_IMAGE"
bpy.context.view_layer.update()

assert {roadsha(r) for r in roads}=={SHA_ROAD}
assert camera_before==poses()
assert cam_before==(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
assert all(tuple(o.matrix_world)==tuple(other_matrices[o.name]) for o in trees[1:])
assert triangles==sum(len(q.vertices)-2 for m in meshes for q in m.data.polygons)
assert sha(parent)==SHA_BLEND
assert len(trees)==8

# Exactly ONE low-cost real Blender Eevee image. No new vendor download
# and no two-frame/full-resolution high-density rerun.
scene.camera=cam
scene.render.engine="BLENDER_EEVEE"
scene.render.resolution_x=768
scene.render.resolution_y=480
scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG"
try:
    scene.eevee.taa_render_samples=8
except AttributeError:
    pass
native=outdir/"K4BU_ONE_REPOSITIONED_UPRIGHT_GENUINE_CC0_PINE_EDITABLE_RESEARCH_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(native))
shot=outdir/"K4BU_ONE_FRAME_NATIVE_UPRIGHT_PINE_CHASE_768x480_ART_HOLD_NOT_GAME.png"
scene.render.filepath=str(shot)
bpy.ops.render.render(write_still=True)
assert native.stat().st_size>30000000
assert shot.stat().st_size>30000
files={file.name:{"bytes":file.stat().st_size,"sha256":sha(file)} for file in (native,shot)}
audit={
    "schema":"dopagaki.K4BU.one-real-native-upright-pine-source-immutable-art-hold/1",
    "sourceK4BSBlendSHA256":SHA_BLEND,
    "sourceK4BTProjectionJSON_SHA256":sha(k4bt),
    "sourceGameBlob":SHA_GAME,"sourceB48Road5Fingerprint":SHA_ROAD,
    "originalSixCamerasUnchanged":True,"frozenChaseCameraUnchanged":True,
    "originalSevenOtherTreesTransformUnchanged":True,
    "realNativeTreeTriangles":triangles,"nativeSourceMeshCount":len(meshes),
    "originalResearchTreeCount":len(trees),
    "sourceNativeMasterExtentsXYZ_M":[round(z,4) for z in extent],
    "oneNativeSourceAxisReorientedXToZ":True,
    "originalHeroProjectedEnvelope":originalproj,
    "repositionedUprightHeroProjectedEnvelope":p,
    "chosenPosition":{"dRoadM":d,"sSideM":s,"heightM":target_height,
                      "actualBoundingFootClearanceM":round(true_foot_clearance_m,5),
                      "footRootedAtTerrainInsteadOfBuriedCentre":True,
                      "candidatesEvaluated":len(candidates),"score":round(score,6)},
    "researchRenderActualBlenderEevee":True,
    "researchRenderedPixelSize":[768,480],
    "isOriginalResearchChaseNotWebGL2Game":True,
    "visualActualPineReadable":"UNJUDGED_REQUIRES_IMAGE_REVIEW",
    "ART":"UNJUDGED_HOLD",
    "formalArtAccepted":0,"formalSlope2DNAMetres":0,
    "sourceB48RoadCount":7,"sourceB51MoverCount":28,"sourcePhysicsHz":240,
    "sourceBallRadiusM":.65,"newGameColliders":0,"sourceGameEdited":False,
    "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
    "RELEASE":"HOLD","MERGE":"HOLD",
    "files":files
}
(outdir/"K4BU_NATIVE_SINGLE_HERO_TREE_ART_HOLD_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding="utf-8")
print("K4BU_REAL_NATIVE_ONE_PINE_POSITION_ORIENTATION_SINGLE_FRAME_TECH_REVIEW_PENDING",
      json.dumps({"position":[d,s],"before":originalproj,"after":p,
                  "referenceImage":"actual Blender 768x480, not game"},ensure_ascii=False))
