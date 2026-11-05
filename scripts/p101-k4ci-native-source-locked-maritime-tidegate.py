"""K4CI: one architected true 3D offshore shipyard tide-gate and quay access.

Source-preserving DCC study only. Retain the exact K4CH full frame, actual
original Road5, game, six original cameras, true CHASE, trees and lighting.
No billboard, fake screenshot, collision change, official acceptance or merge.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="74dadf53327e7fff0fd3b57a9b9ff369371e2c0fffa43241eb27bee1ca19cace"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for chunk in iter(lambda:f.read(1<<20),b""):h.update(chunk)
 return h.hexdigest()
assert sha(parent)==PARENT,("K4CI_NOT_THE_GENUINE_K4CH_EDITABLE_DCC_PARENT",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def sourceposes():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
camera_source=sourceposes();assert len(camera_source)>=6
cams=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cams)==1 and sc.camera==cams[0]
cam=cams[0];truechase=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
def project(world):
 q=world_to_camera_view(sc,cam,world)
 return (float(q.x),float(q.y),float(q.z))
roads=[]
for mode in ("CONTROL","ULTRA"):
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roads.append(next(iter(col.objects)))
def roadsha(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in o.data.polygons:h.update(struct.pack("<3i",*[int(i) for i in p.vertices]))
 return h.hexdigest()
assert {roadsha(o) for o in roads}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
treenames=("K4BS | genuine CC0 scanned pine tree ","K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY",
           "K4CA | actual Poly Haven island_tree_02")
trees=[o for o in bpy.data.objects if o.name.startswith(treenames)]
assert len(trees)==11
tree_state={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
light_state={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
parent_states={o.name:(bool(o.hide_render),bool(o.hide_viewport),
                       tuple(tuple(row) for row in o.matrix_world),
                       len(o.data.vertices) if o.type=="MESH" else -1)
               for o in bpy.data.objects}
def fingerprint(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for face in obj.data.polygons:
  h.update(struct.pack("<I",len(face.vertices)))
  for i in face.vertices:h.update(struct.pack("<I",int(i)))
 return h.hexdigest()
# Use actual K4CH visible native copper roof and support assembly as the
# geographical base for the *single* tide-gate, not camera-aligned artwork.
roof=[o for o in bpy.data.objects if o.name.startswith("K4CH | full-span aged copper coastal terminal canopy")]
posts=[o for o in bpy.data.objects if o.name.startswith("K4CH | one structurally continuous timber ferry station")]
assert len(roof)==len(posts)==1
roof=roof[0];posts=posts[0]
assert all(o.type=="MESH" and not o.hide_render and o.get("NOT_GAME_COLLIDER") is True for o in (roof,posts))
roof_hash=fingerprint(roof);post_hash=fingerprint(posts)
roofverts=[roof.matrix_world@v.co for v in roof.data.vertices]
postverts=[posts.matrix_world@v.co for v in posts.data.vertices]
anchor=sum(roofverts,Vector())/len(roofverts)
basez=min(v.z for v in postverts)
# Source-native forward, and exact orthogonal lateral harbor direction.
source_fwd=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(source_fwd)==1
F3=source_fwd[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((F3.x,F3.y,0)).normalized()
S=Vector((-F.y,F.x,0))
sgn=1 if project(anchor+S*30)[0]>project(anchor-S*30)[0] else -1
O=S*sgn;Z=Vector((0,0,1))
def location(u,v,z):
 return Vector((anchor.x,anchor.y,basez))+F*u+O*v+Z*z
# Choose a real physically situated industrial port structure near the existing
# terminal roof. The unchanged source CHASE only measures its legibility.
# Entire structural frame must stay right of the original racing corridor.
candidates=[]
debug=[]
for along in (-90,-60,-35,-10,15,40,70,100):
 for offshore in (12,22,34,46,58,72,92):
  for width in (24,30,38,46,56):
   for high in (27,35,44,54,66):
    # Two real-world quay positions, structural bent and top crossbar.
    pts=[project(location(along,q,z))
         for q in (offshore-width/2,offshore+width/2)
         for z in (1.,high)]
    if any(q[2]<=0 for q in pts):continue
    xmin=min(q[0] for q in pts);xmax=max(q[0] for q in pts)
    ymin=min(q[1] for q in pts);ymax=max(q[1] for q in pts)
    debug.append((xmin,xmax,ymin,ymax,along,offshore,width,high))
    if not (.595<xmin and xmax<.985 and .31<ymin and ymax<.965):continue
    projected_width=xmax-xmin;projected_height=ymax-ymin
    if projected_width<.090 or projected_height<.15:continue
    cx=(xmin+xmax)/2;cy=(ymin+ymax)/2
    score=4*abs(cx-.79)+1.2*abs(cy-.65)+2*abs(projected_width-.25)+1.2*abs(projected_height-.30)
    score+=.004*max(0,offshore-58)+.00015*abs(along)
    candidates.append((score,along,offshore,width,high,(xmin,ymin,xmax,ymax)))
assert candidates,("NO_SOURCE_PROTECTED_LARGE_GANTRY_ON_REAL_QUAY",
                  sorted(debug,key=lambda p:abs((p[0]+p[1])/2-.79))[:10])
candidates.sort(key=lambda x:x[0])
_,u,v,w,H,bbox=candidates[0]
print("K4CI_ACTUAL_WORLD_POSITION_TRUE_CHASE",{"along":u,"offshore":v,"spanMetres":w,
      "towerHeightMetres":H,"screenBounds":bbox,"candidateCount":len(candidates)},flush=True)
# Individual components contribute to ONE coherent physical crane silhouette,
# not an unrelated skyline object collection or a fake image.
verts=[];faces=[];face_mats=[]
def beam(a,b,width=1.,depth=1.,mat=0):
 a=Vector(a);b=Vector(b);long=b-a
 assert long.length>.01
 axis=long.normalized()
 ref=Z if abs(axis.dot(Z))<.90 else F
 side=axis.cross(ref).normalized()
 up=axis.cross(side).normalized()
 off0=side*(width/2);off1=up*(depth/2)
 p=[a-off0-off1,a+off0-off1,a+off0+off1,a-off0+off1,
    b-off0-off1,b+off0-off1,b+off0+off1,b-off0+off1]
 shift=len(verts)
 verts.extend(tuple(q) for q in p)
 for f in ((0,1,2,3),(4,7,6,5),(0,4,5,1),
           (1,5,6,2),(2,6,7,3),(3,7,4,0)):
  faces.append(tuple(shift+k for k in f));face_mats.append(mat)
def cable(a,b,r=.13):
 beam(a,b,r,r,2)
L=v-w/2;R=v+w/2
# Two 3D portal A-frames with 4 genuine bedded legs and large steel top span.
for side in (L,R):
 head=location(u,side,H)
 for end in (-5.2,5.2):
  beam(location(u+end,side,1.0),head,1.25,1.45,0)
 # maritime anti-rack structural lower diagonal and tie beam
 beam(location(u-5.2,side,5.8),location(u+5.2,side,5.8),.86,.88,0)
 beam(location(u-5.2,side,6),location(u+3.4,side,H*.72),.43,.5,1)
 beam(location(u+5.2,side,6),location(u-3.4,side,H*.72),.43,.5,1)
 # Honest triangulated anti-rack structure: repeated X-bracing is part of
 # one continuous port gantry, not decorative unrelated props.
 for k in range(5):
  bottom=H*(.20+.115*k)
  top=bottom+H*.095
  beam(location(u-5.2*(1-bottom/H),side,bottom),
       location(u+5.2*(1-top/H),side,top),.22,.28,0)
  beam(location(u+5.2*(1-bottom/H),side,bottom),
       location(u-5.2*(1-top/H),side,top),.22,.28,0)
# Cross-span tension ties distribute real sea-wind loads between pylons.
for level in (.38,.62):
 for shift in (-1.7,1.7):
  beam(location(u+shift,L,H*level),location(u+shift,R,H*level),.28,.32,0)
# Overhead main hoisting truss, two real longitudinal rails in F direction.
for foff in (-1.8,1.8):
 beam(location(u+foff,L,H),location(u+foff,R,H),1.18,2.10,1)
 beam(location(u+foff,L,H-3.7),location(u+foff,R,H-3.7),.50,.72,0)
for j in range(11):
 q=L+w*j/10
 beam(location(u-1.8,q,H),location(u+1.8,q,H-3.7),.31,.30,0)
 if j<10:
  q2=L+w*(j+1)/10
  beam(location(u+1.8,q,H),location(u-1.8,q2,H-3.7),.23,.28,0)
# Seaworthy suspended container handling block & high-contrast drop lines.
load_v=L+w*.66
for dx in (-1.3,1.3):
 cable(location(u+dx,load_v,H-3.4),location(u+dx,load_v,H*.39),.12)
beam(location(u-4.0,load_v,H*.39),location(u+4.0,load_v,H*.39),2.2,1.6,1)
for foff in (-3.2,3.2):
 cable(location(u+foff,load_v,H*.39),location(u+foff,load_v,H*.21),.12)
# Shore platform is a single linked actual 3D access span to inherited terminal.
# Do not invent a floating disconnected gantry base.
start=Vector((anchor.x,anchor.y,basez+.9))
end=location(u,L,1.0)
span=end-start
assert span.length<190,("TERMINAL_TO_GANTRY_NOT_PHYSICALLY_CONNECTED",span.length)
beam(start,end,3.8,.78,3)
# Large main-frame stays are real steel cables, not composited line graphics.
for side in (L,R):
 for end in (-5.2,5.2):
  cable(location(u,side,H*.87),location(u+end*1.6,side,H*.30),.13)
assert len(verts)>500 and len(faces)>400
def mat(name,rgb,metal,rough):
 m=bpy.data.materials.new("K4CI | "+name)
 m.diffuse_color=(*rgb,1)
 m.use_nodes=True
 bs=m.node_tree.nodes.get("Principled BSDF")
 bs.inputs["Base Color"].default_value=(*rgb,1.)
 bs.inputs["Metallic"].default_value=metal
 bs.inputs["Roughness"].default_value=rough
 return m
steel=mat("weathered industrial sea-steel teal",(.055,.21,.24),.65,.45)
warm=mat("high visibility oxidized amber structural steel",(.57,.25,.085),.49,.46)
wire=mat("galvanized sea-tension cable",(.32,.37,.37),.77,.40)
deck=mat("maritime gangway wood to quay",(.36,.25,.16),.05,.70)
collection=bpy.data.collections.new("K4CI | ONE TRUE MARITIME TIDE-GATE 3D HERO | RESEARCH")
sc.collection.children.link(collection)
data=bpy.data.meshes.new("K4CI | actual connected shipyard gantry triangulated structural mesh")
data.from_pydata(verts,[],faces);data.update()
for m in (steel,warm,wire,deck):data.materials.append(m)
for poly,idx in zip(data.polygons,face_mats):poly.material_index=idx;poly.use_smooth=False
gantry=bpy.data.objects.new("K4CI | coherent 3D ferry-loading tidegate at actual inherited quay",data)
collection.objects.link(gantry)
gantry["NOT_GAME_COLLIDER"]=True
gantry["DCC_RESEARCH_ONLY"]=True
gantry["REAL_WORLDSCAPE_FUNCTION"]="TIDAL_BASIN_FERRY_LOADING_GANTRY_CONNECTED_TO_ORIGINAL_TERMINAL"
gantry["ORIGINAL_SOURCE_NOT_MODIFIED"]=True
# Preserve every inherited object, including every original research mesh,
# its render visibility, transforms and frozen source road.
assert sourceposes()==camera_source
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==truechase
assert {roadsha(o) for o in roads}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
assert roof_hash==fingerprint(roof) and post_hash==fingerprint(posts)
for name,state in parent_states.items():
 o=bpy.data.objects[name]
 assert (bool(o.hide_render),bool(o.hide_viewport),tuple(tuple(r) for r in o.matrix_world),
         len(o.data.vertices) if o.type=="MESH" else -1)==state,("FROZEN_PARENT_CHANGED",name)
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT
sc.camera=cam
sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CI_EDITABLE_SOURCE_LOCKED_MARITIME_TIDE_GATE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CI_TRUE_SOURCE_CHASE_MARITIME_TIDEGATE_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4ci.actual-source-locked-tidegate-native-art-v1",
 "parentK4CHExactSHA256":PARENT,
 "originalGameGitBlob":GAME,
 "originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,
 "originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,
 "originalLightsUnchanged":True,
 "allExistingSourceAndResearchObjectsIdentical":True,
 "K4BZ_bad_duplicate_road_hidden":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,
 "newGameColliders":0,
 "realGantryEditableObjects":1,
 "actualGantryVertices":len(data.vertices),
 "actualGantryPolygonFaces":len(data.polygons),
 "physicalGantrySpanMetres":w,
 "physicalGantryTowerHeightMetres":H,
 "gantryPhysicalWorldCoordinate":{"along":u,"offshore":v},
 "realQuayPhysicalConnectionMetres":span.length,
 "gantryTrueChaseProjectedBoundsNotArtScore":[round(q,6) for q in bbox],
 "nativeWorldProjectedCandidateCount":len(candidates),
 "originalSourceRoadSampleSafety":["Source Road5 untouched; image QA independently checks road"],
 "renderEngine":"BLENDER_EEVEE","originalChase768x480":True,
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CI_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CI_REAL_NATIVE_SOURCE_PROTECTED_GANTRY_ART_HOLD",json.dumps({
  "world":audit["gantryPhysicalWorldCoordinate"],
  "realSpanMetres":w,"heightMetres":H,
  "newEditableVertices":len(data.vertices),
  "newMeshFaces":len(data.polygons),
  "trueCHASEProjectedBBox":bbox}),flush=True)
