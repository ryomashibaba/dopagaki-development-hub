"""K4BE salvage existing genuinely rendered 2 source Camera pilot, no rerender.

After Github runner lacked numpy for GLB only: old Blender .blend and three
PNG completed. Verify them against original K4BD/K4AY/K4BC source provenance,
export GLB in a correctly prepared Blender, and emit explicit ART REJECT/HOLD.
Never represent the failed original workflow as completed SUCCESS.
"""
import bpy,sys,os,json,hashlib,struct
from mathutils import Vector
args=sys.argv[sys.argv.index("--")+1:]
def arg(k):return os.path.abspath(args[args.index(k)+1])
base=arg("--base");source=arg("--source");all7=arg("--all7")
parent=arg("--parent");out=arg("--out")
S=json.load(open(source,encoding="utf8"))
X=json.load(open(all7,encoding="utf8"))
P=json.load(open(parent,encoding="utf8"))
assert S["frozenOriginalGameGitBlob"]==X["frozenOriginalGameGitBlob"]==P["originalFrozenWebGL2GameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert S["originalB48Roads"]==X["B48SurfaceCount"]==7
assert S["originalB51MovingObstacles"]==X["originalB51MovingBodies"]==28
assert S["originalPhysicsHz"]==X["sourcePhysicsHz"]==240
assert P["originalRoad5GeometryBefore"]==P["originalRoad5GeometryAfter"]
bpy.ops.wm.open_mainfile(filepath=base)
def fingerprint(o):
    h=hashlib.sha256()
    for v in o.data.vertices:h.update(struct.pack("<3d",*[float(p) for p in v.co]))
    for f in o.data.polygons:h.update(struct.pack("<3i",*[int(v) for v in f.vertices]))
    return h.hexdigest()
cams={};original={};originalB51={}
for m in ("control","ultra"):
    c=bpy.data.collections.get("K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5")
    assert c and len(c.objects)==1
    obj=next(iter(c.objects))
    original[m]=obj
    assert len(obj.data.polygons)==4728 and len(obj.data.vertices)==2366
    assert fingerprint(obj)==P["originalRoad5GeometryAfter"][m]
    other=bpy.data.collections.get("K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+m.upper())
    assert other and len(other.objects)==6
    assert X["modes"][m]["allSourceSurfaceIDs"]==S["modes"][m]["allB48SurfaceIDs"]
    assert X["modes"][m]["B48SourceRoads"][5]["mesh"]["positions"]==S["modes"][m]["mesh"]["positions"]
    rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses")
    assert rig
    for r in S["modes"][m]["sourceTimeRecords"]:
        tick=r["tick"]
        camera=[o for o in rig.objects if o.type=="CAMERA" and str(tick) in o.name]
        assert len(camera)==1
        assert (camera[0].location-Vector((r["eye"][0],-r["eye"][2],r["eye"][1]))).length<.0002
        cams[m,tick]=camera[0]
        p=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+m.upper()+" | TICK "+str(tick))
        assert p and len(p.objects)==28
        originalB51[m,tick]=p
assert len(cams)==6 and len(originalB51)==6
newcols=[c for c in bpy.data.collections if c.name.startswith(("K4BE 01 |","K4BE 02 |","K4BE 03 |","K4BE 04 |"))]
assert len(newcols)==4
newobjs=[o for c in newcols for o in c.objects if o.type in ("MESH","CURVE")]
assert len(newobjs)>95
for pre in ("K4BC V3 02 |","K4BC V3 03 |","K4BC V3 04 |","K4BD 02 |"):
    old=[c for c in bpy.data.collections if c.name.startswith(pre)]
    assert len(old)==1 and old[0].hide_render and len(old[0].objects)>0
assert any(o.type=="FONT" and "TIDAL FORUM" in o.name for o in bpy.data.objects)
# Preserve original 2 render images exactly byte-for-byte. Export editably
# inspected GLB from that saved .blend; no third/fourth source camera render.
glb="K4BE_SALVAGED_BLENDER_SOURCE_INTEGRATED_CIVIC_DCC_ART_REJECT.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),
                          export_format="GLB",export_cameras=False,export_lights=False)
names=[
"K4BE_TRUE_B48_ALL7_SOURCE_CAMERA_INHABITED_TIDAL_FORUM_ART_HOLD.blend",
"K4BE_REAL_SOURCE_CAMERA_CONTROL_11307_ART_REJECT_PILOT.png",
"K4BE_REAL_SOURCE_CAMERA_ULTRA_11341_ART_REJECT_PILOT.png",
"K4BE_LANDMARK_URBAN_PLANNING_AERIAL_DCC_NOT_GAME.png",glb]
manifest={}
for name in names:
    bb=open(os.path.join(out,name),"rb").read()
    assert len(bb)>10000,name
    manifest[name]={"bytes":len(bb),"sha256":hashlib.sha256(bb).hexdigest()}
assert open(os.path.join(out,glb),"rb").read(4)==b"glTF"
rep={
 "schema":"dopagaki.K4BE.salvage-previous-real-blender-no-camera-rerender-source-verification/1",
 "salvagedFromOriginallyFailedCI":41657612279,
 "originalCIWasNotSuccess":True,
 "firstFailureReason":"numpy missing in runner, GLB exporter; original two Camera and editable blend did complete",
 "originalGameBlob":S["frozenOriginalGameGitBlob"],
 "originalB48Roads":7,"sourceB48RoadGeometryMeshed2Modes":14,
 "trueOriginalSourceRoad5TrianglesEachMode":4728,
 "originalB51Movers":28,"originalB51SixNativeTicks":168,
 "originalPhysicsHz":240,"originalBallRadiusMetres":.65,
 "road5FingerprintStillParentK4BD":{m:fingerprint(o) for m,o in original.items()},
 "sourceOriginalSixNumericCamerasPreserved":True,
 "nativeCameraPhotosProduced":2,"nativeCameraTicksRendered":[11307,11341],
 "noFurtherFourNativeCamerasRendered":True,
 "additionalArtistAerialNativeGame":False,
 "newIntegratedUrbanEditables":len(newobjs),
 "oldRejectedArchitectureRetainedHidden":True,
 "noGameCollisionOrRoadAdded":True,"originalSourceGameFileChanged":False,
 "nativeWebGL2GameRendered":False,
 "independentSevenB48AndB51BVH":"NOT_YET_REVIEWED_HOLD",
 "ART":"REJECT_HOLD","formalARTApproved":0,"slope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD","files":manifest}
with open(os.path.join(out,"K4BE_AUTHENTIC_TWO_CAMERA_SALVAGED_SHA_ART_REJECT.json"),"w") as f:
    json.dump(rep,f,indent=2)
print("K4BE_TWO_SOURCE_CAMERA_SALVAGED_NO_RERENDER_B48_7_B51_28_ART_REJECT",
      {"objects":len(newobjs),"fingerprints":rep["road5FingerprintStillParentK4BD"]})
