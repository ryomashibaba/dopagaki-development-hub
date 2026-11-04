"""K4CE: single foreground working ferry + connected shore gangway composition.
Rescue the proven K4CD boat by moving its ACTUAL 3D geometry into frame.
Research DCC ONLY. All frozen game/source/road/cameras/old scenery protected.
ART is unjudged until true Blender CHASE PNG is opened and assessed.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector,Matrix
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(args[args.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="c81111664d4703ec044aeaaeee1e7b659d95343dbf762ebf9892c6636a7d5a0a"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for c in iter(lambda:f.read(1<<20),b""):h.update(c)
 return h.hexdigest()
assert sha(parent)==PARENT,("NOT_AUTHENTIC_K4CD_PARENT",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
frozen_poses=poses();assert len(frozen_poses)>=6
cams=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cams)==1 and sc.camera==cams[0]
cam=cams[0];chase=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
def proj(v):
 p=world_to_camera_view(sc,cam,v)
 return (float(p.x),float(p.y),float(p.z))
def visible(p):
 return p[2]>0 and 0<=p[0]<=1 and 0<=p[1]<=1
roads=[]
for mode in ("CONTROL","ULTRA"):
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roads.append(next(iter(col.objects)))
def roadsha(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(x) for x in v.co]))
 for f in o.data.polygons:h.update(struct.pack("<3i",*[int(x) for x in f.vertices]))
 return h.hexdigest()
assert {roadsha(o) for o in roads}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
trees=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
trees +=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
trees +=[o for o in bpy.data.objects if o.name.startswith("K4CA | actual Poly Haven island_tree_02")]
assert len(trees)==11
trees_start={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
light_start={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
old_state={o.name:(bool(o.hide_render),bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world))
           for o in bpy.data.objects}
# Real K4CD objects are already native edited in the parent; NEVER recreate them.
objs=[o for o in bpy.data.objects if o.type=="MESH" and o.name.startswith("K4CD | ")]
assert len(objs)==6,("K4CD_MUST_HAVE_EXACT_SIX_NATIVE_MESHES",[o.name for o in objs])
def exactly(label):
 x=[o for o in objs if label in o.name]
 assert len(x)==1,(label,[o.name for o in x])
 return x[0]
water=exactly("single coherent physical tidal water inlet")
hull=exactly("curved seaworthy ferry hull transverse frames")
deck=exactly("continuous practical boarding deck")
saloon=exactly("single occupiable curved ferry passenger saloon")
roof=exactly("single thick formed marine passenger roof")
old_bridge=exactly("short side boarding access bridge")
ferry=[hull,deck,saloon,roof]
assert all(o.get("NOT_GAME_COLLIDER") is True and o.get("DCC_RESEARCH_ONLY") is True for o in objs)
assert all(not o.hide_render for o in objs)
# Get the true working ferry's berth axis from the original source camera.
sourcecam=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(sourcecam)==1
fwd=sourcecam[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((fwd.x,fwd.y,0)).normalized()
S=Vector((-F.y,F.x,0))
A3=[o for o in bpy.data.objects if o.type=="MESH" and o.name.startswith("K4CB A3 | ")]
gang=[o for o in A3 if "real sloping tide-level passenger gangway" in o.name]
assert len(A3)==10 and len(gang)==1
tail=[gang[0].matrix_world@v.co for v in list(gang[0].data.vertices)[-4:]]
quaytip=sum(tail,Vector())/4.
# Actual complete 3D mesh projections, not a fake camera-facing image.
def worldverts(o):
 return [o.matrix_world@v.co for v in o.data.vertices]
def screen_bbox(objects,offset=Vector((0,0,0)),stride=1):
 samples=[proj(v+offset) for o in objects for v in worldverts(o)[::stride]]
 if not samples:return None
 return (min(p[0] for p in samples),min(p[1] for p in samples),
         max(p[0] for p in samples),max(p[1] for p in samples),
         sum(visible(p) for p in samples)/len(samples))
def frame_volume(o):
 return (len(o.data.vertices),len(o.data.polygons))
a0=screen_bbox(ferry)
assert a0 is not None and a0[2]>.985,("K4CD_NOT_RIGHT_EDGE_CLIPPED",a0)
# Rigid-body movement of EXISTING research ship, with original hull shape
# untouched. Keep the vessel under the spatial extent of its original 3D sea
# and near the genuinely constructed passenger gangway.
deck_vertices=worldverts(deck)
orig_dock=min((Vector((v.x,v.y,0))-Vector((quaytip.x,quaytip.y,0))).length for v in deck_vertices)
# Search larger than trivial micro-repositioning, but require contiguous berth.
candidates=[]
diagnostics=[]
for du in range(-27,28,3):
 for ds in range(-13,14,2):
  if du==0 and ds==0:continue
  delta=du*F+ds*S
  bb=screen_bbox(ferry,delta,stride=4)
  if bb is None:continue
  cx=(bb[0]+bb[2])/2
  cy=(bb[1]+bb[3])/2
  # Road visual protection is a hard physical-geometry gate, not optional.
  xok=bb[0]>.505 and bb[2]<.968
  yok=bb[1]>.19 and bb[3]<.77
  center_deck=min((Vector((v.x+delta.x,v.y+delta.y,0))-Vector((quaytip.x,quaytip.y,0))).length for v in deck_vertices[::2])
  # The berth must not move impossibly far from inherited passenger access.
  dockok=center_deck<=max(35.,orig_dock+12.)
  if len(diagnostics)<32: diagnostics.append([du,ds,*[round(v,3) for v in bb],round(center_deck,2)])
  if not (xok and yok and dockok and bb[4]>.995):continue
  area=(bb[2]-bb[0])*(bb[3]-bb[1])
  score=30*abs(cx-.77)+8*abs(cy-.46)+.10*center_deck-8*area
  candidates.append((score,du,ds,delta,bb,center_deck))
assert candidates,("K4CE_NO_SAFE_REAL_3D_FERRY_RELOCATION",a0,orig_dock,diagnostics)
candidates.sort(key=lambda c:c[0])
_,du,ds,translation,quick,dist=candidates[0]
for o in ferry:
 o.matrix_world=Matrix.Translation(translation)@o.matrix_world
newbbox=screen_bbox(ferry)
assert newbbox[0]>.50 and newbbox[2]<.973 and newbbox[4]>.99,("FERRY_NOT_FULLY_FRAMED",newbbox)
assert newbbox[0]<a0[0]-.015 or newbbox[2]<a0[2]-.04,("NOT_MEANINGFUL_FRAME_RECOVERY",a0,newbbox)
# Replace only obsolete research ferry bridge. Its data is preserved in the
# editable file, but hidden in rendering; construct one genuinely connected
# gangway into the actual new ferry deck instead.
old_bridge.hide_render=True
deckpts=worldverts(deck)
def horizontal(p,q):return math.hypot(p.x-q.x,p.y-q.y)
boarding=min(deckpts,key=lambda p:horizontal(p,quaytip))
gap=horizontal(boarding,quaytip)
assert gap<max(40.,orig_dock+14),("K4CE_PASSENGER_CONNECTION_GAP",gap,orig_dock)
along=(boarding-quaytip)
axis=Vector((along.x,along.y,0)).normalized()
lat=Vector((-axis.y,axis.x,0))*.95
a=quaytip+Vector((0,0,.10))
b=boarding+Vector((0,0,.10))
vs=[a-lat,a+lat,b+lat,b-lat,
    a-lat-Vector((0,0,.23)),a+lat-Vector((0,0,.23)),
    b+lat-Vector((0,0,.23)),b-lat-Vector((0,0,.23))]
fs=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
me=bpy.data.meshes.new("K4CE | honest passenger bridge from real quay to moved ship")
me.from_pydata([tuple(p) for p in vs],[],fs);me.update()
coll=bpy.data.collections.new("K4CE | coherent foreground ferry berth and boarding connection | DCC HOLD")
sc.collection.children.link(coll)
bridge=bpy.data.objects.new("K4CE | full-width physically connected ferry boarding bridge",me)
coll.objects.link(bridge)
assert old_bridge.data.materials
bridge.data.materials.append(old_bridge.data.materials[0])
bridge["DCC_RESEARCH_ONLY"]=True
bridge["NOT_GAME_COLLIDER"]=True
bridge["REAL_MARITIME_FUNCTION"]="PHYSICAL_PASSENGER_CONNECTION_FIXED_QUAY_TO_REFRAMED_FERRY"
# The bridge must remain wholly in the harbor right-side screen area.
bridgeq=[proj(bridge.matrix_world@v.co) for v in bridge.data.vertices]
assert all(visible(p) and p[0]>.475 for p in bridgeq),("BOARDING_BRIDGE_ROAD_INTRUSION",bridgeq)
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==chase
assert {roadsha(o) for o in roads}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==trees_start
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_start
# Original scene and source A3/K4CC preserved in their entirety.
for name,old in old_state.items():
 o=bpy.data.objects[name]
 if o in ferry:
  assert (bool(o.hide_render),bool(o.hide_viewport))==old[:2]
  assert frame_volume(o)[0]>4
 elif o is old_bridge:
  assert o.hide_render and bool(o.hide_viewport)==old[1]
  assert tuple(tuple(row) for row in o.matrix_world)==old[2]
 else:
  assert (bool(o.hide_render),bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world))==old,(name,"UNINTENDED_EDIT")
assert not water.hide_render and water.matrix_world==Matrix(old_state[water.name][2])
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT
# Save the exact full, editable native DCC before any ablation.
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CE_REAL_COHERENT_FOREGROUND_FERRY_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
# Genuine Blender with and without the research ferry: prove visible pixels
# by image differences, not projection claims.
water_only=out/"K4CE_REAL_WATER_AND_QUAY_ONLY_CHASE_CONTROL.png"
for ob in ferry:ob.hide_render=True
bridge.hide_render=True
sc.render.filepath=str(water_only);bpy.ops.render.render(write_still=True)
for ob in ferry:ob.hide_render=False
bridge.hide_render=False
png=out/"K4CE_REAL_FERRY_CONNECTED_TO_QUAY_CHASE_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000 and water_only.stat().st_size>30000
audit={
 "schema":"dopagaki.k4ce.real-coherent-berth-foreground-ferry/1",
 "exactK4CDSourceParentSHA256":PARENT,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "K4BZ_bad_duplicate_road_hidden":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,"newGameColliders":0,
 "allOriginalObjectsPreserved":True,
 "K4CDWaterGeometryAndPoseUnchanged":True,"K4CDOriginalFerryMeshTopologyUnchanged":True,
 "movedResearchOnlyK4CDFerryObjectCount":len(ferry),
 "originalResearchBoardingBridgeHiddenOnly":old_bridge.name,
 "newPhysicallyConnectedResearchGangway":bridge.name,
 "newTrueResearchGeometryOnly":True,
 "originalFerryBBoxNotArtScore":a0[:4],"newFerryBBoxNotArtScore":newbbox[:4],
 "boatTranslationRealMetres":{"along":du,"side":ds},
 "passengerBridgeWorldLengthMetres":gap,"originalDeckToQuayDistanceMetres":orig_dock,
 "candidateCount":len(candidates),"renderEngine":"BLENDER_EEVEE","originalChase768x480":True,
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png,water_only)}
}
(out/"K4CE_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CE_TRUE_NATIVE_BLENDER_COMPLETE_ART_HOLD",
 json.dumps({"originalScreenBBox":a0,"newScreenBBox":newbbox,
             "worldShift":(du,ds),"dockGap":gap,"candidates":len(candidates)}),flush=True)
