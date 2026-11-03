"""K4AY - overlay original source B48/B51 geometry into downloaded K4AX editable .blend.
The 6 B51 groups are exact SOURCE COLLISION OBB PROXIES, NOT in-game art meshes.
DCC lighting and previews are NOT original WebGL2 frames. ART remains REJECT.
"""
import bpy, json, os, sys, math, hashlib
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index("--")+1:]
def val(key):
    i=args.index(key)
    return os.path.abspath(args[i+1])
base=val("--base")
source=val("--source")
output=val("--out")
os.makedirs(output,exist_ok=True)
doc=json.load(open(source,encoding="utf8"))
assert doc["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert doc["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert doc["originalPhysicsHz"]==240 and doc["originalB48Roads"]==7
assert doc["originalB51MovingObstacles"]==28
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
scene.render.engine="CYCLES"
scene.cycles.samples=15
scene.cycles.use_denoising=False
scene.render.resolution_percentage=80
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses")
assert rig is not None, "Missing K4AX original editable camera collection"
hero=bpy.data.collections.get("01_HERO | Tidal Exchange Hall - editable architecture")
assert hero is not None and len(hero.objects)>30, "K4AX design unexpectedly missing"
# Geometry is stored in source-world XYZ, converted as (x,-z,y).
def B(p):return (p[0],-p[2],p[1])
def collection(name):
    c=bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c
def mat(name,color,alpha=1,metal=0,rough=.65):
    m=bpy.data.materials.new(name);m.use_nodes=True
    m.diffuse_color=(*color,alpha)
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*color,1)
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    if alpha<1:
        p.inputs["Alpha"].default_value=alpha
        try:m.surface_render_method="DITHERED"
        except Exception:pass
    return m
road_mat=mat("K4AY | SOURCE original B48 real top / collision surface",(.19,.23,.25))
edge_mat=mat("K4AY | SOURCE original B48 sides and void caps",(.12,.15,.17))
proxy_mats={
    "fail":mat("K4AY OBB | Source collision FAIL - not original art",(.67,.15,.11),.74),
    "bounce":mat("K4AY OBB | Source collision BOUNCE - not original art",(.72,.47,.15),.74),
    "push":mat("K4AY OBB | Source collision PUSH - not original art",(.40,.22,.61),.74)
}
rcols={}
for mode,source_mode in doc["modes"].items():
    group=collection("K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5")
    rcols[mode]=group
    native=source_mode["mesh"]
    xyz=native["positions"];tris=native["indices"]
    assert len(xyz)%3==0 and len(tris)%3==0
    points=[B(xyz[i:i+3]) for i in range(0,len(xyz),3)]
    faces=[tuple(tris[i:i+3]) for i in range(0,len(tris),3)]
    assert len(faces)==source_mode["trueSourceTriangleCount"]
    assert native["degenerate"]==0
    m=bpy.data.meshes.new("K4AY actual B48 "+mode+" source mesh")
    m.from_pydata(points,[],faces)
    m.materials.append(road_mat);m.materials.append(edge_mat)
    m.update(calc_edges=True)
    for p in m.polygons:
        p.material_index=0 if p.index<native["topIndexCount"]//3 else 1
    road=bpy.data.objects.new("SOURCE PHYSICAL ROAD5 "+mode.upper()+" "+source_mode["roadID"],m)
    road["REAL_SOURCE_COLLIDER_GEOMETRY_REFERENCE_ONLY"]=True
    road["SOURCE_POINTS_SHA256"]=source_mode["originalRoadSourcePointsSHA256"]
    road["SOURCE_TRIANGLES"]=len(faces)
    road["SOURCE_VOID_CELLS"]=json.dumps(source_mode["originalVoidLongitudinalCells"])
    group.objects.link(road)
# Unit cube in Blender X/Y/Z; source halfSize mapped with y -> vertical Blender Z.
verts=[(x,y,z) for z in (-1,1) for y in (-1,1) for x in (-1,1)]
faces=[(0,2,3,1),(4,5,7,6),(0,1,5,4),
       (1,3,7,5),(3,2,6,7),(2,0,4,6)]
boxes={}
for mode,source_mode in doc["modes"].items():
    for frame in source_mode["sourceTimeRecords"]:
        tick=frame["tick"]
        group=collection("K4AY SOURCE B51 OBB PROXIES | "+mode.upper()+" | TICK "+str(tick))
        boxes[(mode,tick)]=group
        assert abs(frame["sourceNativeSeconds"]-tick/240)<1e-12
        poses=frame["B51CollisionOBBNotOriginalVisibleMesh"]
        assert len(poses)==28
        for pose in poses:
            mesh=bpy.data.meshes.new("source OBB unit cube "+pose["id"])
            mesh.from_pydata(verts,[],faces)
            mesh.materials.append(proxy_mats[pose["mode"]])
            mesh.update()
            obj=bpy.data.objects.new("SOURCE B51 COLLISION OBB | "+pose["id"],mesh)
            obj.location=B(pose["center"])
            half=pose["halfSize"]
            obj.scale=(half[0],half[2],half[1])
            obj.rotation_euler[2]=pose["yawRadians"]
            obj.show_wire=True
            obj.show_all_edges=True
            obj["SOURCE_NATIVE_TICK"]=tick
            obj["SOURCE_NATIVE_SECONDS"]=frame["sourceNativeSeconds"]
            obj["COLLISION_PROXY_NOT_GAME_VISUAL"]=True
            obj["COLLISION_MODE"]=pose["mode"]
            obj["ORIGINAL_MOVING_OBSTACLE_ID"]=pose["id"]
            group.objects.link(obj)
# Keep original CONTROL cameras when identical, add 3 ULTRA in numeric source pose.
cams={}
for item in doc["modes"]["control"]["sourceTimeRecords"]:
    matches=[obj for obj in rig.objects if obj.type=="CAMERA" and str(item["tick"]) in obj.name]
    assert len(matches)==1, "K4AX original control camera missing "+str(item["tick"])
    cam=matches[0]
    assert (Vector(cam.location)-Vector(B(item["eye"]))).length<1e-4
    cams[("control",item["tick"])]=cam
for item in doc["modes"]["ultra"]["sourceTimeRecords"]:
    lens=bpy.data.cameras.new("K4AY original game camera lens - ULTRA "+str(item["tick"]))
    lens.lens=21.6;lens.sensor_height=32;lens.sensor_fit="VERTICAL"
    lens.clip_start=.2;lens.clip_end=3500
    cam=bpy.data.objects.new("SOURCE TRUE-NUMERIC ULTRA EYE "+str(item["tick"]),lens)
    rig.objects.link(cam)
    cam.location=B(item["eye"])
    cam.rotation_euler=Vector(B(item["front"])).normalized().to_track_quat("-Z","Y").to_euler()
    cams[("ultra",item["tick"])]=cam
assert len(cams)==6
def visibility(mode,tick):
    for m,c in rcols.items():c.hide_render=(m!=mode)
    for key,c in boxes.items():c.hide_render=(key!=(mode,tick))
    bpy.context.view_layer.update()
reports=[]
for mode in ("control","ultra"):
    for frame in doc["modes"][mode]["sourceTimeRecords"]:
        tick=frame["tick"]
        visibility(mode,tick)
        cam=cams[(mode,tick)]
        scene.camera=cam
        visible_candidates=0
        for obj in boxes[(mode,tick)].objects:
            projected=[world_to_camera_view(scene,cam,obj.matrix_world @ Vector(corner))
                       for corner in obj.bound_box]
            if any(p.z>0 and 0<=p.x<=1 and 0<=p.y<=1 for p in projected):
                visible_candidates+=1
        filename="K4AY_DCC_ONLY_"+mode.upper()+"_TICK_"+str(tick)+".png"
        scene.render.filepath=os.path.join(output,filename)
        bpy.ops.render.render(write_still=True)
        reports.append({"mode":mode,"tick":tick,"nativeSeconds":frame["sourceNativeSeconds"],
            "numericCameraMatchesK4AXSource":True,
            "physicalRoadId":doc["modes"][mode]["roadID"],
            "sourceB51CollisionProxies":len(boxes[(mode,tick)].objects),
            "proxyCornersInsideCameraFrustumBroadphaseOnly":visible_candidates,
            "cameraSourcePNG_SHA256":frame["sourceImageSHA256"],
            "DCCPreviewFile":filename,
            "sourceB51PhysicalOBBIsRealGameVisibleMesh":False,
            "exactVisualOcclusionNotClaimed":True,
            "roadArchitectureBVHIntersectionNotYetProven":True})
# Make first reference shot the default visible editable scene, still retain all 6.
visibility("control",11259)
scene.camera=cams[("control",11259)]
blend=os.path.join(output,"K4AY_TIDAL_EXCHANGE_WITH_TRUE_B48_B51_REFERENCE.blend")
bpy.ops.wm.save_as_mainfile(filepath=blend)
glb=os.path.join(output,"K4AY_TIDAL_EXCHANGE_WITH_SOURCE_CONTEXT.glb")
bpy.ops.export_scene.gltf(filepath=glb,export_format="GLB",
                          export_cameras=False,export_lights=False)
files=[os.path.basename(blend),os.path.basename(glb)]+[x["DCCPreviewFile"] for x in reports]
hashes={}
for file in files:
    p=os.path.join(output,file)
    assert os.path.isfile(p) and os.path.getsize(p)>2000,file
    with open(p,"rb") as f:hashes[file]={"bytes":os.path.getsize(p),
                                       "sha256":hashlib.sha256(f.read()).hexdigest()}
report={"schema":"dopagaki.K4AY.original-Blender-road5-B51-native-context/1",
  "source":"K4AX editable Blender restored from original pinned Actions artifact",
  "originalSourceBlob":doc["frozenOriginalGameGitBlob"],
  "DCCPreviewsAreRealWebGL2":False,"originalGamePhysicsChanged":False,
  "nativeTimeRule":"exact source tick/240 supported by earlier K4AI true native review",
  "originalRoad5ImportedFromTrueSourceTessellate":True,
  "B51SourceCollisionProxiesNotOriginalVisualMesh":True,
  "trueSourceB51Boxes":168,"roadStageVariants":["control","ultra"],
  "K4AXArchitectureStillEditable":True,"renderedSourceCameras":6,
  "originalGameBlenderStageGeometryIsGameRelease":False,
  "B48VsArchitectureDetailedGeometricIntersection":"NOT_TESTED_HOLD",
  "humanScaleAndReadability":"NOT_TESTED_HOLD",
  "formalArtAccepted":0,"slope2DNAMetres":0,"ART":"REJECT_HOLD",
  "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
  "RELEASE":"HOLD","MERGE":"HOLD","sourcePoseDCCOnlyShots":reports,"files":hashes}
with open(os.path.join(output,"K4AY_BLENDER_CONTEXT_PROVENANCE.json"),"w",encoding="utf8") as f:
    json.dump(report,f,ensure_ascii=False,indent=2)
print("K4AY_ORIGINAL_B48_AND_168_NATIVE_B51_COLLISION_PROXIES_IN_EDITABLE_BLENDER_ART_REJECT",
      json.dumps({"cameras":len(reports),"OBBs":168,"roadVariants":2,"art":report["ART"]}))
