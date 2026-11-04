"""K4CB A1: source-locked architectural replacement study for the Road5 CHASE harbor.
REAL editable Blender render, never a browser shot or an ART acceptance.
Only add distinct, usable maritime-exchange geometry inside isolated A2 native.
No source game, Road5 vertex/face, camera, lights, prior trees, duplicate road
skins, paid asset or existing source object visibility is altered.
"""
import bpy, math, sys, hashlib, json, struct
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(flag): return Path(argv[argv.index(flag)+1]).resolve()
BASE=arg("--base"); OUT=arg("--out"); OUT.mkdir(parents=True,exist_ok=True)
PARENT_SHA="299f1972e3383a7fc0047409a0f58581da3884988749dff6842a80cdf49a3ffa"
GAME_BLOB="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD_SHA="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def digest(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for part in iter(lambda:f.read(1048576),b""):h.update(part)
 return h.hexdigest()
assert digest(BASE)==PARENT_SHA,("K4CB_HOLD_PARENT_NOT_A2",digest(BASE))
bpy.ops.wm.open_mainfile(filepath=str(BASE))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
frozen_poses=poses();assert len(frozen_poses)>=6
chasers=[o for o in bpy.data.objects if o.type=="CAMERA"
         and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(chasers)==1
cam=chasers[0];frozen_chase=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
assert sc.camera==cam
roads=[]
for label in ("CONTROL","ULTRA"):
 co=bpy.data.collections["K4AY SOURCE B48 | "+label+" | TRUE TESSELLATED ROAD5"]
 assert len(co.objects)==1
 roads.append(next(iter(co.objects)))
def original_road_fingerprint(ob):
 h=hashlib.sha256()
 for v in ob.data.vertices:
  h.update(struct.pack("<3d",*[float(k) for k in v.co]))
 for f in ob.data.polygons:
  h.update(struct.pack("<3i",*[int(k) for k in f.vertices]))
 return h.hexdigest()
assert {original_road_fingerprint(o) for o in roads}=={ROAD_SHA}
orig_trees=[o for o in bpy.data.objects if
  o.name.startswith("K4BS | genuine CC0 scanned pine tree ") or
  o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY") or
  o.name.startswith("K4CA | actual Poly Haven island_tree_02 original CC0 coastal tree ")]
assert len(orig_trees)==11
frozen_trees={o.name:tuple(tuple(row) for row in o.matrix_world) for o in orig_trees}
lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and good.type=="MESH" and not good.hide_render
existing={o.name:(bool(o.hide_render),bool(o.hide_viewport)) for o in bpy.data.objects}
# Use the *existing* actual authored civic hall and actual load-bearing piers,
# not a guessed camera-aligned billboard or arbitrary floating box.
roof=[o for o in bpy.data.objects
      if o.name.startswith("K4BW | folded coastal museum and boat service canopy shell")]
piers=[o for o in bpy.data.objects
       if o.name.startswith("K4BW | galvanized slender structural pier")]
assert len(roof)==1 and len(piers) in (12,14)
roof=roof[0]
points=[roof.matrix_world@v.co for v in roof.data.vertices]
assert len(points)==275
min_roof_z=min(float(p.z) for p in points)
base_z=min(float((o.matrix_world@v.co).z) for o in piers for v in o.data.vertices)
assert 6<min_roof_z-base_z<11.2
center=sum(points,Vector())/len(points)
base=Vector((center.x,center.y,base_z))
source_cam=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(source_cam)==1
direction=source_cam[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((direction.x,direction.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def at(along,side,height=0):
 return base+F*along+S*side+Vector((0,0,height))
s_front=min((-5.85,5.85),key=lambda s:(at(0,s)-cam.location).length)
sgn=1 if s_front>0 else -1
# Three genuinely recessed limestone arcades: tall, load-bearing springing
# piers + volumetric segmented semi-circular lintel, rather than a thin 2D
# rectangular wall texture or additional little boxes.
height=min(7.05,min_roof_z-base_z-.35)
spring=2.6
outer=height-spring
inner=outer-.83
assert 3.0<outer<4.6 and inner>2.2
front=s_front+sgn*1.55
rear=front-sgn*1.25
glass_s=rear-sgn*.32
coll=bpy.data.collections.new("K4CB | inhabited maritime exchange arcades | DCC RESEARCH ONLY")
sc.collection.children.link(coll)
created=[]
def material(name,a,b=None,scale=.34,rough=.86,metal=0):
 m=bpy.data.materials.new("K4CB | "+name);m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();lk=m.node_tree.links
 output=ns.new("ShaderNodeOutputMaterial");p=ns.new("ShaderNodeBsdfPrincipled")
 p.inputs["Metallic"].default_value=metal;p.inputs["Roughness"].default_value=rough
 lk.new(p.outputs["BSDF"],output.inputs["Surface"])
 if b:
  pos=ns.new("ShaderNodeNewGeometry")
  noise=ns.new("ShaderNodeTexNoise");noise.inputs["Scale"].default_value=scale
  noise.inputs["Detail"].default_value=3.8;noise.inputs["Roughness"].default_value=.69
  lk.new(pos.outputs["Position"],noise.inputs["Vector"])
  ramp=ns.new("ShaderNodeValToRGB")
  ramp.color_ramp.elements[0].color=(*a,1)
  ramp.color_ramp.elements[1].color=(*b,1)
  lk.new(noise.outputs["Fac"],ramp.inputs["Fac"])
  lk.new(ramp.outputs["Color"],p.inputs["Base Color"])
 else:p.inputs["Base Color"].default_value=(*a,1)
 return m
limestone=material("locally quarried veined limestone, shaded arcade",(.26,.25,.20),(.52,.47,.36),.38)
soffit=material("recessed smoked oak ceiling and structure",(.13,.105,.073),(.31,.24,.17),.62)
glazing=material("inset marine glass behind real arch reveals",(.035,.085,.095),(.095,.19,.205),.16,.20,.12)
bronze=material("dark marine patina anodized entrance frame",(.08,.14,.13),(.18,.245,.21),.78,.34,.58)
floorstone=material("walkable honed harbor exchange floor",(.30,.29,.23),(.51,.47,.37),.40,.80)
def mesh(name,vertices,faces,mat,function):
 assert vertices and faces
 datab=bpy.data.meshes.new("K4CB | "+name)
 datab.from_pydata([tuple(v) for v in vertices],[],faces);datab.update()
 obj=bpy.data.objects.new("K4CB | "+name,datab);coll.objects.link(obj)
 datab.materials.append(mat)
 obj["DCC_RESEARCH_ONLY"]=True;obj["NOT_GAME_COLLIDER"]=True
 obj["ACTUAL_BUILDING_FUNCTION"]=function
 created.append(obj)
 return obj
def block(name,xa,xb,sa,sb,z0,z1,mat,func):
 vs=[at(x,s,z) for z in (z0,z1) for x,s in
    ((xa,sa),(xb,sa),(xb,sb),(xa,sb))]
 fs=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 return mesh(name,vs,fs,mat,func)
def panel(name,vs,mat,func):
 return mesh(name,vs,[(0,1,2,3)],mat,func)
nseg=24
arcades=[]
for n,station in enumerate((-9.,0.,9.)):
 # Actual deep arcade voussoirs: front/back outer/inner quads, through-depth
 # closures, and a physical pair of pier legs with continuous springing.
 V=[]
 for side in (front,rear):
  for ringrad in (outer,inner):
   for i in range(nseg+1):
    theta=math.pi*i/nseg
    V.append(at(station+ringrad*math.cos(theta),side,
                spring+ringrad*math.sin(theta)))
 def idx(layer,r,i):return layer*(2*(nseg+1))+r*(nseg+1)+i
 faces=[]
 for i in range(nseg):
  a,b,c,d=idx(0,0,i),idx(0,0,i+1),idx(0,1,i+1),idx(0,1,i)
  e,f,g,h=idx(1,0,i),idx(1,0,i+1),idx(1,1,i+1),idx(1,1,i)
  faces.extend(((a,b,c,d),(h,g,f,e),(a,e,f,b),(d,c,g,h)))
 for j in (0,nseg):
  faces.append((idx(0,0,j),idx(0,1,j),idx(1,1,j),idx(1,0,j)))
 mesh("true load-bearing masonry vault %d"%(n+1),V,faces,limestone,"PUBLIC_ARCADE_STRUCTURAL_ARCH")
 for s in (-1,1):
  xa=station+s*inner;xb=station+s*outer
  block("vault %d limestone pier %s"%(n+1,"A" if s<0 else "B"),
        min(xa,xb),max(xa,xb),front,rear,.06,spring,
        limestone,"STRUCTURAL_PIER_FROM_REAL_HALL_FLOOR")
 # No paper-thin opaque wall over the actual central public entrance.
 # Side bays have physically recessed glazed daylight; central bay opens
 # into the deep interior except two actual glazed entrance sidelights.
 if n!=1:
  panel("deep set transparent occupied bay %d"%(n+1),[
   at(station-inner*.84,glass_s,.50),at(station+inner*.84,glass_s,.50),
   at(station+inner*.84,glass_s,spring+.22),
   at(station-inner*.84,glass_s,spring+.22)],glazing,
   "ENCLOSED_PASSENGER_AND_MARKET_ACTIVITY")
 else:
  for direction_side in (-1,1):
   l=station+direction_side*1.35
   panel("usable entrance leaf glazed sidelight %d"%direction_side,[
    at(l-.58,glass_s,.15),at(l+.58,glass_s,.15),
    at(l+.58,glass_s,2.8),at(l-.58,glass_s,2.8)],glazing,
    "PUBLIC_SLIDING_ENTRANCE_WITH_CLEAR_CENTRE")
 # Deep bronze mid-height transom, not hundreds of fake pencil mullions
 block("arcade %d solid entrance threshold"%(n+1),
       station-inner*.82,station+inner*.82,glass_s-.08,glass_s+.08,
       .08,.22,floorstone,"REAL_WEATHERPROTECTED_ENTRY_THRESHOLD")
 arcades.append(at(station,front,spring+outer))
# Floor, overhead shaded timber and a step-free promenade connection:
# serviceable internal space, not a faceless full-wall cuboid.
block("continuous actual harbour concourse slab",-14.8,14.8,-5.4,5.4,-.18,.08,
      floorstone,"CONTINUOUS_OCCUPIED_PUBLIC_CONCOURSE")
# Articulate roof structural depth from the existing real sheet -- do NOT
# add a second coplanar skin or change its inherited hide/modifiers.
for along in (-10.,0.,10.):
 for side in (-4.2,4.2):
  block("genuine timber beam support %.0f %.1f"%(along,side),
        along-.21,along+.21,side-.27,side+.27,2.9,
        max(3.5,min_roof_z-base_z-.52),soffit,
        "ROOF_LOAD_PATH_AND_INTERIOR_SHADOW")
# A short seaside access ramp with clear public destination. It remains
# within the original public wharf study, never across the racing surface.
sea_sign=-1
s_a=-7.2 if s_front<0 else 7.2
s_b=-12.5 if s_front<0 else 12.5
rampV=[at(x,s,z) for x,s,z in
  ((-4.,s_a,.08),(4.,s_a,.08),(4.,s_b,-.67),(-4.,s_b,-.67))]
panel("accessible public gangway to existing harbor promenades",rampV,
      floorstone,"ACTUAL_WATERFRONT_PUBLIC_ACCESS_RAMP")
def projection(v):
 q=world_to_camera_view(sc,cam,v)
 return {"x":round(float(q.x),5),"y":round(float(q.y),5),
         "inFront":bool(q.z>0),
         "inFrame":bool(q.z>0 and .01<q.x<.99 and .01<q.y<.99)}
proj=[projection(p) for p in arcades]
assert sum(p["inFrame"] for p in proj)>=2,("K4CB_HOLD_ARCADES_NOT_IN_ACTUAL_CHASE",proj)
assert all(p["x"]>.53 for p in proj),("K4CB_HOLD_PORTAL_OVERLAPS_RACE_FOCUS",proj)
assert len(created)>=17
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==frozen_chase
assert {original_road_fingerprint(o) for o in roads}=={ROAD_SHA}
assert all(tuple(tuple(row) for row in o.matrix_world)==frozen_trees[o.name] for o in orig_trees)
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==lights
assert all((bool(bpy.data.objects[name].hide_render),bool(bpy.data.objects[name].hide_viewport))==state
           for name,state in existing.items())
assert bad.hide_render and not good.hide_render
assert digest(BASE)==PARENT_SHA
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=OUT/"K4CB_TRUE_MARITIME_EXCHANGE_ARCADES_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=OUT/"K4CB_TRUE_SAME_CHASE_MARITIME_EXCHANGE_NOT_GAME.png"
sc.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.K4CB.authentic-editable-maritime-exchange-art-hold/1",
 "parentA2SHA256":PARENT_SHA,"frozenOriginalGameGitBlob":GAME_BLOB,
 "frozenOriginalRoad5FullVertexFaceSHA256":ROAD_SHA,
 "sourceSixCameraUnchanged":True,"sourceCHASEUnchanged":True,
 "oldNineTreesAndNewTwoCC0InstancesUnchanged":True,"lightsUnchanged":True,
 "K4BZProvenBadResearchRoadHidden":True,
 "noExistingObjectVisibilityChanged":True,"existingRoadAndResearchSkinNotCopied":True,
 "sourceGameEdited":False,"gamePhysicsEdited":False,"newGameColliders":0,
 "originalCivicRoofGeometryUnchanged":True,"originalCivicPiersUnchanged":True,
 "sourceParentIsRealEditableBlender":True,
 "newResearchDCCMeshCount":len(created),
 "authorConcept":"three deep structural stone arch vaults with clear real entrance, recessed occupied glazing, physical piers, shaded roof load paths and one accessible quay connection integrated with the inherited public hall",
 "primaryBuilding":roof.name,"sourcePierCount":len(piers),
 "archedPortalScreensActualCHASE":proj,"vaultHeightM":round(height,4),
 "vendorNote":"No new external assets; all new stones/glazing/wood are original research procedural materials, not claimed photographic scans",
 "authenticEEVEESameCHASE":[768,480],"notNativeWebGL2Game":True,
 "ART":"UNJUDGED_HOLD","formalArtAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":digest(p)} for p in (blend,png)}
}
(OUT/"K4CB_SOURCE_LOCKED_TRUE_MARITIME_EXCHANGE_AUDIT.json").write_text(
 json.dumps(audit,indent=2,ensure_ascii=False),encoding="utf-8")
print("K4CB_TRUE_NATIVE_MARITIME_EXCHANGE_COMPLETE_ART_UNJUDGED",
      json.dumps({"newAuthoredMeshes":len(created),"visiblePortalProjections":proj},
      ensure_ascii=False),flush=True)
