"""K4BC v2 AUTHENTIC all-seven B48 source physical roads in DCC context.

No fabricated driveable geometry. Existing editable K4BC art, original Road5
source model and six original source Camera numeric poses are preserved.
Other six roads come from the exact source generateP101W9C1AbyssCandidate
and tessellate() arrays (both control/ultra). DCC clay rendering only.
Not proof of native WebGL2 play, original painted surfaces, CCD or ART pass.
"""
import os,sys,json,hashlib,struct,bpy
from mathutils import Vector
args=sys.argv[sys.argv.index("--")+1:]
def opt(key):
    i=args.index(key);return os.path.abspath(args[i+1])
base=opt("--base");original=opt("--original");all7=opt("--all7");out=opt("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(original,encoding="utf8"))
D=json.load(open(all7,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert D["schema"]=="dopagaki.K4BC.exact-all-seven-original-B48-control-ultra-surfaces/1"
assert S["frozenOriginalGameGitBlob"]==D["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert D["B48SurfaceCount"]==7 and D["sourcePhysicsHz"]==240 and D["originalB51MovingBodies"]==28
assert D["readonlyNoNativeGameWrites"] and not D["sourcePhysicsOrCollisionChanged"]
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
sourcecols={m:bpy.data.collections.get("K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5") for m in ("control","ultra")}
assert all(c and len(c.objects)==1 for c in sourcecols.values())
road5={m:next(iter(c.objects)) for m,c in sourcecols.items()}
def fp(ob):
    h=hashlib.sha256()
    for v in ob.data.vertices:h.update(struct.pack("<3d",*[float(x) for x in v.co]))
    for face in ob.data.polygons:h.update(struct.pack("<3i",*[int(x) for x in face.vertices]))
    return h.hexdigest()
before={m:fp(ob) for m,ob in road5.items()}
assert before["control"]==before["ultra"]
assert len(road5["control"].data.polygons)==4728
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses");assert rig
cams={};obbs={}
for mode in ("control","ultra"):
    assert D["modes"][mode]["sourceCameraNativeTicks"]==[r["tick"] for r in S["modes"][mode]["sourceTimeRecords"]]
    for r in S["modes"][mode]["sourceTimeRecords"]:
        t=r["tick"];ca=[x for x in rig.objects if x.type=="CAMERA" and str(t) in x.name]
        assert len(ca)==1
        v=Vector((r["eye"][0],-r["eye"][2],r["eye"][1]))
        assert (ca[0].location-v).length<.0002
        cams[mode,t]=ca[0]
        col=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+mode.upper()+" | TICK "+str(t))
        assert col and len(col.objects)==28
        obbs[mode,t]=col
assert len(cams)==len(obbs)==6
def collection(name):
    c=bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c
othercols={mode:collection("K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+mode.upper()) for mode in ("control","ultra")}
def material(name,color):
    m=bpy.data.materials.new(name)
    m.diffuse_color=(*color,1)
    m.use_nodes=True
    b=m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value=(*color,1)
    b.inputs["Roughness"].default_value=.81
    return m
# Clay-like independent DCC preview (not claiming fidelity of game texture).
sourceClay=material("K4BC v2 all-seven B48 ORIGINAL ROAD SOURCE / neutral matte DCC-only",(.145,.16,.165))
sourceUnderside=material("K4BC v2 original roadway actual underside / neutral slate",(.075,.087,.092))
surface_records=[]
for mode in ("control","ultra"):
    roadset=D["modes"][mode]["B48SourceRoads"]
    assert len(roadset)==7
    assert [x["sourceSurfaceId"] for x in roadset]==S["modes"][mode]["allB48SurfaceIDs"]
    road5Record=roadset[5]
    assert road5Record["sourceSurfaceId"]=="p93-PRISM_CREST-01"
    assert road5Record["trueTriangles"]==4728
    assert road5Record["originalPointSHA256"]==S["modes"][mode]["originalRoadSourcePointsSHA256"]
    assert road5Record["mesh"]["positions"]==S["modes"][mode]["mesh"]["positions"]
    assert road5Record["mesh"]["indices"]==S["modes"][mode]["mesh"]["indices"]
    for v in roadset:
        if v["sourceIndex"]==5:continue # TRUE Road5 already exists and stays untouched!
        g=v["mesh"];P=g["positions"];I=g["indices"]
        verts=[(P[i],-P[i+2],P[i+1]) for i in range(0,len(P),3)]
        faces=[tuple(I[i:i+3]) for i in range(0,len(I),3)]
        assert len(verts)==v["trueVertices"] and len(faces)==v["trueTriangles"]
        assert v["trianglesComeFromNativeTessellate"] is True
        mesh=bpy.data.meshes.new("TRUE SOURCE B48 "+mode+" "+v["sourceSurfaceId"])
        mesh.from_pydata(verts,[],faces);mesh.update(calc_edges=True)
        mesh.materials.append(sourceClay);mesh.materials.append(sourceUnderside)
        split=g["topIndexCount"]//3
        for face in mesh.polygons:face.material_index=0 if face.index<split else 1
        o=bpy.data.objects.new("ORIGINAL SOURCE B48 #"+str(v["sourceIndex"])+" "+
                               mode.upper()+" "+v["sourceSurfaceId"],mesh)
        othercols[mode].objects.link(o)
        o["K4BC_SOURCE_IS_FROM_EXACT_NATIVE_TESSELLATION"]=True
        o["ORIGINAL_NATIVE_GAME_MATERIAL_FIDELITY"]="NOT_CLAIMED_DCC_CLAY_ONLY"
        o["sourceIndex"]=v["sourceIndex"]
        o["originalSourcePointsSHA256"]=v["originalPointSHA256"]
        o["originalTriangleIndexSHA256"]=v["originalTriangleIndexSHA256"]
        o["trueOriginalTriangles"]=v["trueTriangles"]
        o["nativeRideable"]=v["originalRideable"]
        o["nativeCollidable"]=v["originalCollidable"]
        o["DCC_ADDED_NATIVE_COLLIDER"]=False
        assert len(o.data.polygons)==v["trueTriangles"]
        surface_records.append({"mode":mode,"index":v["sourceIndex"],
          "sourceID":v["sourceSurfaceId"],
          "trueSourceTriangles":v["trueTriangles"],
          "nativePointSHA256":v["originalPointSHA256"],
          "trueOriginalVoidCells":v["originalVoidLongitudinalCells"],
          "sourceBounds":v["sourceBounds"],
          "originalRideable":v["originalRideable"]})
assert len(surface_records)==12
assert set(r["index"] for r in surface_records)=={0,1,2,3,4,6}
def show(mode,tick):
    for m,c in sourcecols.items():c.hide_render=m!=mode
    for m,c in othercols.items():c.hide_render=m!=mode
    for (m,t),c in obbs.items():c.hide_render=(m,t)!=(mode,tick)
    bpy.context.view_layer.update()
scene.cycles.use_denoising=False
scene.cycles.samples=32
scene.render.resolution_x=1013;scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
def shot(name,cam):
    scene.camera=cam;scene.render.filepath=os.path.join(out,name)
    bpy.ops.render.render(write_still=True)
images=[]
for mode in ("control","ultra"):
    for rec in S["modes"][mode]["sourceTimeRecords"]:
        t=rec["tick"];show(mode,t)
        name="K4BC_V2_ALL_SEVEN_SOURCE_B48_DCC_"+mode.upper()+"_"+str(t)+".png"
        shot(name,cams[mode,t])
        images.append({"mode":mode,"sourceNativeTick":t,
            "sourceNativeTimeSeconds":rec["sourceNativeSeconds"],
            "originalNativeCameraScreenshotSHA256":rec["sourceImageSHA256"],
            "originalNativeB51CollisionOBBCount":28,
            "DCCimage":name})
assert len(images)==6
show("control",11278)
authors=[x for x in bpy.data.objects if x.type=="CAMERA" and
         "K4BC author design aerial" in x.name]
assert len(authors)==1
shot("K4BC_V2_ALL_SEVEN_SOURCE_B48_AERIAL_STUDIO_DCC_NOT_GAME.png",authors[0])
show("control",11259)
scene.camera=cams["control",11259]
after={m:fp(ob) for m,ob in road5.items()}
assert before==after
blend="K4BC_V2_ORIGINAL_ALL_SEVEN_B48_FULL_CONTEXT_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
glb="K4BC_V2_ORIGINAL_ALL_SEVEN_B48_DCC_ONLY_NOT_GAME.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),
                          export_format="GLB",export_cameras=False,export_lights=False)
names=[blend,glb,"K4BC_V2_ALL_SEVEN_SOURCE_B48_AERIAL_STUDIO_DCC_NOT_GAME.png"]+[r["DCCimage"] for r in images]
checks={}
for name in names:
    p=os.path.join(out,name)
    raw=open(p,"rb").read()
    assert len(raw)>2000,name
    checks[name]={"bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest()}
report={
 "schema":"dopagaki.K4BC.v2.all-seven-exact-native-B48-full-context-DCC/1",
 "originalGameFrozenBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "sourceStageGenerator":"generateP101W9C1AbyssCandidate",
 "sourceGeometryTessellator":"tessellate",
 "originalSourceB48Roads":7,"originalSourceB51MovingObstacles":28,
 "originalSourcePhysicsHz":240,
 "originalB48Road5MeshFingerprintsBefore":before,
 "originalB48Road5MeshFingerprintsAfter":after,
 "originalSourceRoad5MeshUnmodified":True,
 "road5ControlPointsSHA":S["modes"]["control"]["originalRoadSourcePointsSHA256"],
 "trueOriginalOtherB48RoadsImported":12,
 "originalB48RoadIDs":D["modes"]["control"]["allSourceSurfaceIDs"],
 "sourceOtherRoadsAndMeshes":surface_records,
 "sourceOriginalB51CollisionOBBSnapshotInstances":168,
 "originalSixSourceCameraNumericUnchanged":True,
 "trueSourceCameraDCCImages":images,
 "otherSixRoadMaterialsAreDCCClayPreviewNotOriginalGame":True,
 "originalNativeGameWebGL2Screenshots":False,
 "sourceTrueRoadGeometryManufacturedOrModified":False,
 "newOriginalGameColliders":0,
 "sourceAllSevenB48ArchitectureStaticBVH":"NOT_YET_TESTED_HOLD",
 "nativeGameFullTrajectoryCCD":"NOT_TESTED_HOLD",
 "humanArtReview":"NOT_TESTED_HOLD",
 "formalArtAccepted":0,"Slope2DNACertifiedMetres":0,
 "ART":"REJECT_HOLD","HUMAN":"HOLD","SAT":"HOLD",
 "CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":checks}
with open(os.path.join(out,"K4BC_V2_TRUE_ALL7_B48_SOURCE_PROVENANCE.json"),"w") as f:
    json.dump(report,f,indent=2)
print("K4BC_V2_SOURCE_7_ROADS_TRUE_TESSELLATION_CONTEXT_NOT_NEW_GAMEPASS",
      json.dumps({"nativeRoads":7,"totalModeContextMeshes":len(surface_records)+2,
                  "sourceCameraDCCImages":len(images),"Road5FingerprintPreserved":before==after}))
