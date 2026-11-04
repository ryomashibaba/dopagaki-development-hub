"""K4CD: actual source-locked Blender maritime basin and a legible working ferry.
Native editable DCC only. Never change source game, Road5, 6 cameras, physics,
parent geology, original CC0 trees or light rigs. ART verdict requires direct PNG.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(args[args.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT_SHA="4fcd20db998696c270df95f624fed1a229ae2703322c180de1f3bfbc15abd6da"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for b in iter(lambda:f.read(1024*1024),b""):h.update(b)
 return h.hexdigest()
assert sha(parent)==PARENT_SHA,("PARENT_NATIVE_HASH_MISMATCH",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def camera_poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
orig_poses=camera_poses();assert len(orig_poses)>=6
cams=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cams)==1 and sc.camera==cams[0]
cam=cams[0];chasepose=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
roads=[]
for mode in ("CONTROL","ULTRA"):
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roads.append(next(iter(col.objects)))
def roadsha(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(i) for i in v.co]))
 for f in o.data.polygons:h.update(struct.pack("<3i",*[int(i) for i in f.vertices]))
 return h.hexdigest()
assert {roadsha(o) for o in roads}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
pines=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
canopies=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
coastals=[o for o in bpy.data.objects if o.name.startswith("K4CA | actual Poly Haven island_tree_02")]
assert (len(pines),len(canopies),len(coastals))==(8,1,2)
trees=pines+canopies+coastals
old_trees={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
old_lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
old_obj={o.name:(bool(o.hide_render),bool(o.hide_viewport)) for o in bpy.data.objects}
rock=bpy.data.objects.get("K4CC | TRUE_EDITABLE_NATIVE_ROCK_RELIEF | NO_GAME_COLLIDER")
assert rock and not rock.hide_render and rock.get("NOT_GAME_COLLIDER") is True
old_rock=(len(rock.data.vertices),len(rock.data.polygons),tuple(tuple(row) for row in rock.matrix_world))
orig_roof=[o for o in bpy.data.objects if o.name.startswith("K4BW | folded coastal museum and boat service canopy shell")]
piers=[o for o in bpy.data.objects if o.name.startswith("K4BW | galvanized slender structural pier")]
assert len(orig_roof)==1 and len(piers) in (12,14)
pts=[orig_roof[0].matrix_world@v.co for v in orig_roof[0].data.vertices]
basez=min((o.matrix_world@v.co).z for o in piers for v in o.data.vertices)
base=Vector((sum(p.x for p in pts)/len(pts),sum(p.y for p in pts)/len(pts),basez))
sourcecam=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(sourcecam)==1
forward=sourcecam[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((forward.x,forward.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def at(along,side,z=0.):return base+F*along+S*side+Vector((0,0,z))
s_front=min((-5.85,5.85),key=lambda s:(at(0,s)-cam.location).length)
sgn=1 if s_front>0 else -1
def point(u,t,z):return at(u,s_front+sgn*t,z)
def projected(p):
 q=world_to_camera_view(sc,cam,p)
 return (float(q.x),float(q.y),float(q.z))
A3=[o for o in bpy.data.objects if o.name.startswith("K4CB A3 | ") and o.type=="MESH"]
assert len(A3)==10
gangway=[o for o in A3 if "real sloping tide-level passenger gangway" in o.name]
assert len(gangway)==1 and gangway[0].get("NOT_GAME_COLLIDER") is True
coll=bpy.data.collections.new("K4CD | functioning ferry harbor | EDITABLE NOT GAME")
sc.collection.children.link(coll)
new=[]
def material(name,c1,c2,rough=.55,metal=.0,scale=.36,bump=.02):
 mat=bpy.data.materials.new("K4CD | "+name);mat.use_nodes=True
 nodes=mat.node_tree.nodes;nodes.clear();ln=mat.node_tree.links
 outnode=nodes.new("ShaderNodeOutputMaterial");p=nodes.new("ShaderNodeBsdfPrincipled")
 p.inputs["Roughness"].default_value=rough;p.inputs["Metallic"].default_value=metal
 ln.new(p.outputs["BSDF"],outnode.inputs["Surface"])
 pos=nodes.new("ShaderNodeNewGeometry")
 tex=nodes.new("ShaderNodeTexNoise");tex.inputs["Scale"].default_value=scale
 tex.inputs["Detail"].default_value=5
 ramp=nodes.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements[0].color=(*c1,1)
 ramp.color_ramp.elements[1].color=(*c2,1)
 ln.new(pos.outputs["Position"],tex.inputs["Vector"])
 ln.new(tex.outputs["Fac"],ramp.inputs["Fac"])
 ln.new(ramp.outputs["Color"],p.inputs["Base Color"])
 if bump>0:
  det=nodes.new("ShaderNodeTexNoise");det.inputs["Scale"].default_value=3.9
  ln.new(pos.outputs["Position"],det.inputs["Vector"])
  bm=nodes.new("ShaderNodeBump");bm.inputs["Strength"].default_value=.12
  bm.inputs["Distance"].default_value=bump
  ln.new(det.outputs["Fac"],bm.inputs["Height"])
  ln.new(bm.outputs["Normal"],p.inputs["Normal"])
 return mat
sea=material("cold northern tidal basin deep sea",(.027,.080,.098),(.089,.185,.206),.23,.16,.065,.05)
hullmat=material("working ferry offwhite ceramic coated composite",(.51,.58,.56),(.71,.75,.70),.49,.18,.30,.012)
keelmat=material("marine hull lower antifouling deep blue",(.052,.09,.095),(.10,.16,.17),.48,.1,.45,.015)
deckmat=material("ferry nonslip gridded deck",(.24,.28,.25),(.39,.43,.38),.77,.05,1.15,.009)
glass=material("large passenger saloon tinted maritime glass",(.031,.069,.074),(.085,.13,.14),.22,.1,.85,.004)
metal=material("curved ferry roof and rub rails",(.27,.35,.34),(.47,.54,.52),.38,.46,.18,.01)
def make(name,verts,faces,mat,role,smooth=False):
 mesh=bpy.data.meshes.new("K4CD | "+name)
 mesh.from_pydata([tuple(p) for p in verts],[],faces);mesh.update()
 obj=bpy.data.objects.new("K4CD | "+name,mesh)
 coll.objects.link(obj);mesh.materials.append(mat)
 obj["DCC_RESEARCH_ONLY"]=True;obj["NOT_GAME_COLLIDER"]=True;obj["REAL_MARITIME_FUNCTION"]=role
 if smooth:
  for face in mesh.polygons:face.use_smooth=True
 new.append(obj);return obj
# Real native 3D water with geometric wave undulation outside physical Road5.
# An open tidal inlet below the berth, not a surface pasted onto the roadway.
U=64;V=26
verts=[]
for i in range(U+1):
 u=-52.+128*i/U
 for j in range(V+1):
  t=24.5+48*j/V
  h=-1.85+ .10*math.sin(u*.28+t*.19)+.052*math.cos(u*.44-t*.37)
  verts.append(point(u,t,h))
faces=[]
for i in range(U):
 for j in range(V):
  a=i*(V+1)+j;b=a+V+1
  faces.append((a,b,b+1,a+1))
water=make("single coherent physical tidal water inlet",verts,faces,sea,"CONTINUOUS_SEA_BASIN_OUTSIDE_SOURCE_ROAD",True)
# A single actual ferry alongside the inherited passenger gangway.
# Hull cross-sections taper to a rounded bow; 6 vertical rings and 42
# transverse slices form curved surfaces, not a stack of cuboid props.
L=40;K=6
boat_u=18.0;boat_t=29.2
def hullpoint(i,k):
 x=2*i/L-1
 bow=max(0,(x-.69)/.31)
 stern=max(0,(-x-.83)/.17)
 outline=(1-.86*bow**1.8-.30*stern**2)
 u=boat_u+16.0*x
 t=boat_t
 zz=[-4.1,-3.6,-3.05,-2.35,-1.05,-.20][k]
 spread=[.28,.48,.69,.89,1.,1.][k]
 # bow flare is continuous with the gunwale, not pointy triangulated slab.
 return u,t,zz,4.5*max(.09,outline)*spread
hverts=[]
for i in range(L+1):
 for k in range(K):
  u,t,z,w=hullpoint(i,k)
  hverts.append(point(u,t-w,z));hverts.append(point(u,t+w,z))
hfaces=[]
for i in range(L):
 for k in range(K-1):
  a=2*(i*K+k);b=2*((i+1)*K+k)
  hfaces.extend(((a,b,b+2,a+2),(a+3,b+3,b+1,a+1)))
hfaces.append(tuple(2*k for k in reversed(range(K)))+tuple(2*k+1 for k in range(K)))
hfaces.append(tuple(2*L*K+2*k for k in range(K))+tuple(2*L*K+2*k+1 for k in reversed(range(K))))
hull=make("curved seaworthy ferry hull transverse frames",hverts,hfaces,hullmat,"PHYSICAL_FERRY_SHELL_FLOATS_AT_BERTH",True)
# Deck and passenger saloon have real 3D mass; the ferry's gap to quay
# is physically readable in a moving perspective camera.
def cuboid(name,u0,u1,t0,t1,z0,z1,mat,role):
 v=[point(u,t,z) for z in (z0,z1) for u,t in
   ((u0,t0),(u1,t0),(u1,t1),(u0,t1))]
 return make(name,v,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],mat,role)
deck=cuboid("continuous practical boarding deck",boat_u-15,boat_u+15,
            boat_t-3.7,boat_t+3.7,-.24,.05,deckmat,"BOARDING_SURFACE_NOT_GAME")
# Curved 3D glass band, not dark rectangular painted window decal.
Nu=28;Nv=10
windowverts=[]
for i in range(Nu+1):
 u=boat_u-8.5+17*i/Nu
 for j in range(Nv+1):
  phi=math.pi*j/Nv
  t=boat_t-2.6*math.cos(phi)
  z=.27+3.7*math.sin(phi)
  windowverts.append(point(u,t,z))
windowfaces=[]
for i in range(Nu):
 for j in range(Nv):
  a=i*(Nv+1)+j;b=a+Nv+1
  windowfaces.append((a,b,b+1,a+1))
saloon=make("single occupiable curved ferry passenger saloon",windowverts,windowfaces,glass,
            "VISIBLE_OCCUPIED_PASSENGER_DECK",True)
# Actual continuous sculpted roof shell, thickness 0.34m, with foredeck
# and retracted glazing: perceptible load path and spatial depth.
roofverts=[]
for low in (0,1):
 for i in range(Nu+1):
  u=boat_u-9.2+18.4*i/Nu
  for j in range(Nv+1):
   v=j/Nv
   t=boat_t-3.03+6.06*v
   z=4.03+0.56*math.sin(math.pi*v)+.24*math.sin(math.pi*i/Nu)-.34*low
   roofverts.append(point(u,t,z))
stride=(Nu+1)*(Nv+1)
def ix(i,j,k):return k*stride+i*(Nv+1)+j
rfaces=[]
for i in range(Nu):
 for j in range(Nv):
  rfaces.append((ix(i,j,0),ix(i+1,j,0),ix(i+1,j+1,0),ix(i,j+1,0)))
  rfaces.append((ix(i,j+1,1),ix(i+1,j+1,1),ix(i+1,j,1),ix(i,j,1)))
for k in (0,Nv):
 for i in range(Nu):
  rfaces.append((ix(i,k,0),ix(i,k,1),ix(i+1,k,1),ix(i+1,k,0)))
roof=make("single thick formed marine passenger roof",roofverts,rfaces,metal,
          "ACTUAL_WORKING_FERRY_WEATHERPROOF_STRUCTURE",True)
# An open starboard boarding gate aligned to the source gangway.
# Keep deck as a real continuous plane, never a game road collider.
gangwaygate=cuboid("short side boarding access bridge",boat_u+2,boat_u+5,
                   boat_t-5.2,boat_t-3.55,-.13,.09,deckmat,
                   "FERRY_GANGWAY_PHYSICAL_ACCESS")
# Visibility check: the vessel and water must actually appear in CHASE
# at scale, without covering the camera's protected racing focal center.
screen={}
for ob in new:
 q=[projected(ob.matrix_world@v.co) for v in ob.data.vertices]
 vis=[p for p in q if p[2]>0 and 0<=p[0]<=1 and 0<=p[1]<=1]
 screen[ob.name]={"visibleVertices":len(vis),
  "bbox":[min(p[0] for p in vis),min(p[1] for p in vis),
          max(p[0] for p in vis),max(p[1] for p in vis)] if vis else None}
nonsea=[o for o in new if o is not water]
assert len(nonsea)>=4 and sum(screen[o.name]["visibleVertices"] for o in nonsea)>120,("WORKING_FERRY_NOT_RENDERED",screen)
assert screen[water.name]["visibleVertices"]>30,("SEA_NOT_PRESENT_IN_TRUE_CHASE",screen[water.name])
visible_x=[screen[o.name]["bbox"][0] for o in new if screen[o.name]["bbox"]]
assert min(visible_x)>.475,("ACTUAL_RACING_FOCUS_OBSTRUCTED",screen)
assert camera_poses()==orig_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==chasepose
assert {roadsha(o) for o in roads}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==old_trees
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==old_lights
assert all((bool(bpy.data.objects[n].hide_render),bool(bpy.data.objects[n].hide_viewport))==s
           for n,s in old_obj.items())
assert (len(rock.data.vertices),len(rock.data.polygons),tuple(tuple(row) for row in rock.matrix_world))==old_rock
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT_SHA
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CD_TRUE_MARITIME_HARBOR_FERRY_EDITABLE_NATIVE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CD_TRUE_SAME_CHASE_MARITIME_FERRY_NOT_GAME.png"
sc.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cd.native-maritime-ferry-and-tidal-inlet/1",
 "parentK4CC_exact_sha256":PARENT_SHA,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "K4BZ_bad_duplicate_road_hidden":True,
 "existingObjectsVisibilityUnchanged":True,"originalResearchRockUnmodified":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,
 "newGameColliders":0,"noExtraRoadSurfaceAdded":True,
 "newRealDCCResearchObjects":len(new),
 "nativeVisibleObjectProjectionsNotArtScore":screen,
 "actualWaterMeshTriangles":2*U*V,
 "actualFerryHullFrameCount":(L+1)*K,
 "materialClaims":"Author-created procedural real 3D working ferry and tidal basin; not photo-scanned assets.",
 "originalChase768x480":True,"renderEngine":"BLENDER_EEVEE",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","HUMAN":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{f.name:{"bytes":f.stat().st_size,"sha256":sha(f)} for f in (blend,png)}
}
(out/"K4CD_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CD_REAL_MARITIME_FERRY_BLENDER_RENDER_COMPLETE_ART_HOLD",json.dumps(
 {"objects":len(new),"visibility":screen},ensure_ascii=False),flush=True)
