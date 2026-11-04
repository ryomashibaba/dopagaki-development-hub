"""K4BW: one research-only authored seaside harbor + landscape composition.

Open immutable K4BV real native Blender; preserve ALL B48 Road5 vertices,
six original source cameras, research CHASE pose, B51 and main game.
This is NOT a game source, collider, performance proof or ART acceptance.
Generate one same-camera 768x480 native Blender research image only.
"""
import bpy, hashlib, json, math, random, struct, sys
from pathlib import Path
from math import sin, cos, pi
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

args = sys.argv[sys.argv.index("--")+1:]
def opt(name):return Path(args[args.index(name)+1]).resolve()
BASE=opt("--base"); OUT=opt("--out"); OUT.mkdir(parents=True,exist_ok=True)
BASE_HASH="7c28000ad1a75afb7f64958a6d48ec5ff205849c37d5a2878f17bdd1d2d4e1c4"
GAME_HASH="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD_HASH="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for b in iter(lambda:f.read(1<<20),b""):h.update(b)
 return h.hexdigest()
assert sha(BASE)==BASE_HASH,("K4BV parent mismatch",sha(BASE))
bpy.ops.wm.open_mainfile(filepath=str(BASE))
sc=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def original_poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
poses=original_poses();assert len(poses)>=6
research=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(research)==1
cam=research[0]
cam_pose=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
assert sc.render.resolution_x==768 and sc.render.resolution_y==480
source={}
for mode in ("CONTROL","ULTRA"):
 co=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(co.objects)==1
 source[mode]=next(iter(co.objects))
def road_fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for face in o.data.polygons:h.update(struct.pack("<3i",*[int(i) for i in face.vertices]))
 return h.hexdigest()
assert set(road_fingerprint(o) for o in source.values())=={ROAD_HASH}
oldtrees=sorted([o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")],key=lambda o:o.name)
assert len(oldtrees)==8
old_tree_transform={o.name:tuple(tuple(row) for row in o.matrix_world) for o in oldtrees}
original_new_tree=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
assert len(original_new_tree)==1
original_tree_transform=tuple(tuple(row) for row in original_new_tree[0].matrix_world)
assert original_new_tree[0].get("NOT_GAME_COLLIDER") is True

c11307=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(c11307)==1
C=c11307[0].location.copy()
look=c11307[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((look.x,look.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
inv=source["CONTROL"].matrix_world.inverted()
def road_z(d,s=0):
 start=inv@P(d,s,650)
 ray=(inv.to_3x3()@Vector((0,0,-1))).normalized()
 hit,pos,normal,index=source["CONTROL"].ray_cast(start,ray,distance=1900)
 if not hit:return None
 return float((source["CONTROL"].matrix_world@pos).z)
def ground(d):
 z=road_z(d)
 assert z is not None,("no original Road5 under research station",d)
 return z-C.z
def terrain(d,s):
 h=ground(d);v=max(0,(abs(s)-16.4)/75)
 n=sin(d*.17+s*.19)*.55+sin(d*.063-s*.117)*1.6+cos(d*.41-s*.35)*.26+sin(d*.93+s*.78)*.11
 if s>0:return h+.3+9.5*v**.73+6*v*v+n*(.20+.82*v)
 return h+.3-13*v**.8-3.8*v*v+n*(.2+.55*v)
def at(d,s,dz=0):return P(d,s,terrain(d,s)+dz)
def local(center,along,side,height=0):return center+F*along+S*side+Vector((0,0,height))
def proj(world):
 v=world_to_camera_view(sc,cam,world)
 return (float(v.x),float(v.y),float(v.z))
def inframe(world):
 x,y,z=proj(world)
 return z>0 and .02<x<.98 and .03<y<.98

collection=bpy.data.collections.new("K4BW | ONE FRAME coastal harbor author composition | RESEARCH ONLY")
sc.collection.children.link(collection)
object_names=[]
def mesh(name,vertices,faces,material,kind="mesh",smooth=False):
 if not faces:return None
 m=bpy.data.meshes.new("K4BW | "+name)
 m.from_pydata([tuple(v) for v in vertices],[],faces)
 m.update()
 ob=bpy.data.objects.new("K4BW | "+name,m)
 collection.objects.link(ob)
 if material:m.materials.append(material)
 if smooth:
  for f in m.polygons:f.use_smooth=True
 ob["RESEARCH_DCC_ONLY"]=True
 ob["NOT_GAME_COLLIDER"]=True
 ob["AUTHORED_FUNCTION"]=kind
 object_names.append(ob.name)
 return ob
def palette(name,a,b=None,scale=.1,rough=.82,metal=0):
 m=bpy.data.materials.new("K4BW | "+name)
 m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();lk=m.node_tree.links
 out=ns.new("ShaderNodeOutputMaterial")
 pr=ns.new("ShaderNodeBsdfPrincipled")
 pr.inputs["Roughness"].default_value=rough
 pr.inputs["Metallic"].default_value=metal
 lk.new(pr.outputs["BSDF"],out.inputs["Surface"])
 if b:
  geo=ns.new("ShaderNodeNewGeometry")
  n=ns.new("ShaderNodeTexNoise");n.inputs["Scale"].default_value=scale
  n.inputs["Detail"].default_value=4.5;n.inputs["Roughness"].default_value=.69
  lk.new(geo.outputs["Position"],n.inputs["Vector"])
  ramp=ns.new("ShaderNodeValToRGB")
  ramp.color_ramp.elements[0].position=.22
  ramp.color_ramp.elements[1].position=.78
  ramp.color_ramp.elements[0].color=(*a,1)
  ramp.color_ramp.elements[1].color=(*b,1)
  lk.new(n.outputs["Fac"],ramp.inputs["Fac"])
  lk.new(ramp.outputs["Color"],pr.inputs["Base Color"])
  bump=ns.new("ShaderNodeBump");bump.inputs["Strength"].default_value=.13;bump.inputs["Distance"].default_value=.045
  lk.new(n.outputs["Fac"],bump.inputs["Height"])
  lk.new(bump.outputs["Normal"],pr.inputs["Normal"])
 else:pr.inputs["Base Color"].default_value=(*a,1)
 return m
asphalt=palette("wet mineral road asphalt",(.12,.135,.146),(.245,.252,.253),.65,.86)
stone=palette("salt weathered mineral limestone",(.39,.36,.30),(.60,.55,.42),.095,.88)
basalt=palette("harbor quay stratified basalt",(.20,.23,.24),(.37,.36,.34),.25,.89)
wood=palette("silvered shore oak walkway",(.26,.23,.17),(.43,.35,.25),.23,.79)
copper=palette("hand folded oxidised zinc canopy",(.13,.24,.24),(.27,.35,.32),.09,.43,.40)
glass=palette("sea tinted facade glazing",(.08,.18,.20),(.17,.31,.34),.19,.21,.24)
steel=palette("salt worn galvanized rail",(.30,.33,.32),(.50,.49,.43),.38,.40,.65)
green=palette("coastal salt tolerant heath",(.21,.25,.17),(.39,.39,.25),.12,.91)

# Author one continuous, non-colliding research-only mineral road-skin.
# It intentionally does NOT edit source Road5 geometry or material and
# does not cover the existing native white racing edge lines.
stations=list(range(14,167,5))
rows=(-9.4,-6.2,-3.2,0,3.2,6.2,9.4)
roadpoints=[]
for d in stations:
 for s in rows:
  z=road_z(d,s)
  if z is None:raise RuntimeError("K4BW_ROAD_OVERLAY_HOLD_NO_SOURCE_SURFACE_AT_%s_%s"%(d,s))
  roadpoints.append(P(d,s,z-C.z+.016))
roadfaces=[]
for i in range(len(stations)-1):
 for j in range(len(rows)-1):
  k=i*len(rows)+j
  roadfaces.append((k,k+len(rows),k+len(rows)+1,k+1))
roadskin=mesh("continuous source-sampled procedural road patina surface",roadpoints,roadfaces,asphalt,"RESEARCH_OVERLAY_NO_COLLIDER")
assert roadskin is not None

# Left natural landmass: an asymmetrical erosion ridge with continuous
# faces and native photograph-ground material, not rectangular color cards.
photomat=[m for m in bpy.data.materials if m.name.startswith("K4BS | Continuously masked REAL CC0")]
assert len(photomat)>=1
terrain_mat=photomat[0]
left_ds=list(range(25,191,8))
left_ss=(26,33,41,52,65,79,94)
vertices=[]
for d in left_ds:
 for s in left_ss:
  weight=max(0,s-23)/75
  lift=(2.6+3.8*sin(d*.031)**2)*weight
  lift+=1.45*sin(d*.095+s*.088)*weight
  lift+=.65*sin(d*.23-s*.17)*weight
  vertices.append(at(d,s,lift+.22))
faces=[]
for i in range(len(left_ds)-1):
 for j in range(len(left_ss)-1):
  k=i*len(left_ss)+j
  faces.append((k,k+len(left_ss),k+len(left_ss)+1,k+1))
left_ridge=mesh("wind eroded continuous left limestone heath ridge",vertices,faces,terrain_mat,"REAL_TERRAIN_STUDY_NO_COLLIDER",True)
# A1 frame showed an artificial dark join with the immutable old terrain.
# Keep the genuine editable study geometry, but do not show a bad seam as art.
left_ridge.hide_render=True

# Position the waterfront interpretation / water safety station where
# it is likely to register in the original near-chase frame. The station
# uses real function: open visitor hall, boat-repair bay and public terrace.
site_candidates=[]
for d in range(51,123,8):
 for s in (-30,-34,-38,-42,-46,-50,-54):
  centre=at(d,s,5.2)
  x,y,z=proj(centre)
  if z<=0 or not(.60<x<.95 and .26<y<.78):continue
  score=abs(x-.80)*3+abs(y-.49)*2+abs(d-80)*.002
  site_candidates.append((score,d,s,x,y))
assert site_candidates, "K4BW_HOLD_NO_VISIBLE_HARBOR_ANCHOR"
_,hub_d,hub_s,hub_x,hub_y=sorted(site_candidates)[0]
hub_base=at(hub_d,hub_s,2.15)
assert inframe(local(hub_base,0,0,4))

# Subdivided, curvilinear public deck surfacing; actual along-road axis
# is F and seaward axis is negative S. Vertices are NOT giant boxes.
def curved_deck(name,d0,d1,s0,s1,h0,material,segments=20):
 vs=[]
 for i in range(segments+1):
  u=i/segments;d=d0+(d1-d0)*u
  for j in range(5):
   v=j/4;s=s0+(s1-s0)*v+.72*sin(2*pi*u)*(v*(1-v))
   z=ground(d)+h0+.35*sin(pi*u)*sin(pi*v)
   vs.append(P(d,s,z))
 fs=[]
 for i in range(segments):
  for j in range(4):
   k=i*5+j
   fs.append((k,k+5,k+6,k+1))
 mesh(name,vs,fs,material,"COAST_PUBLIC_WALKWAY_NO_COLLIDER")
 return vs

# Floating dock/viewing promontory is partly stepped down from road.
# Build broad decks with a visible timber face + sheltered path; shore
# landform itself is not replaced by boxes.
deck_points=curved_deck("public foreshore vista walk",hub_d-31,hub_d+35,hub_s+8,hub_s-9,4.6,wood)
curved_deck("weathered harbor lower quay",hub_d-19,hub_d+20,hub_s-8,hub_s-19,1.8,basalt)

# Purpose-built pavilion: large *thin folded curved canopy*, high
# glazed open facade, slender supports. This is NOT a giant monolithic
# rectangular volume, and has architectural tectonic structure.
n=24;w=10
roof=[]
for i in range(n+1):
 u=i/n; along=(u-.5)*31
 for j in range(w+1):
  v=j/w;side=(v-.5)*14
  height=(8.1+.9*sin(pi*u)+.75*cos(pi*(v-.5))+
          .22*sin(3*pi*u+2*pi*v))
  roof.append(local(hub_base,along,side,height))
rooffaces=[]
for i in range(n):
 for j in range(w):
  k=i*(w+1)+j
  rooffaces.append((k,k+w+1,k+w+2,k+1))
mesh("folded coastal museum and boat service canopy shell",roof,rooffaces,copper,"CIVIC_INTERPRETIVE_CANOPY",True)
def bar(name,a,b,width,material,kind):
 # Actual bevel-safe 8-sided swept tube between arbitrary world endpoints.
 axis=b-a
 assert axis.length>.02
 side=axis.normalized().cross(Vector((0,0,1)))
 if side.length<.001:side=Vector((1,0,0))
 side.normalize()
 other=axis.normalized().cross(side).normalized()
 vv=[]
 for c in (a,b):
  for i in range(8):
   theta=2*pi*i/8
   vv.append(c+width*(cos(theta)*side+sin(theta)*other))
 ff=[tuple(range(7,-1,-1)),tuple(range(8,16))]
 for i in range(8):ff.append((i,(i+1)%8,(i+1)%8+8,i+8))
 return mesh(name,vv,ff,material,kind,True)
for i in (0,4,8,12,16,20,24):
 a=roof[i*(w+1)+0];b=roof[i*(w+1)+w]
 bar("folded copper roof glulam rib %02d"%i,a,b,.105,wood,"LOAD_PATH_ROOF_RIB")
for ui in (-13,-8,-3,3,8,13):
 for vi in (-6.6,6.6):
  pos=local(hub_base,ui,vi,0)
  top=local(hub_base,ui,vi,8.0+.7*cos((ui/13)*pi/2))
  bar("galvanized slender structural pier %g %g"%(ui,vi),pos,top,.135,steel,"CIVIC_SUPPORT_COLUMN")
# Human-scaled open glazed walls as separate faceted tilted panels,
# not a large opaque gray cube. Timber vertical mullions define scale.
def panel(name,a,b,c,d,mat,kind):
 mesh(name,[a,b,c,d],[(0,1,2,3)],mat,kind)
for row,side in enumerate((-5.85,5.85)):
 for j in range(11):
  a=-12+j*24/11;b=-12+(j+1)*24/11
  p0=local(hub_base,a,side,1.0)
  p1=local(hub_base,b,side,1.0)
  p2=local(hub_base,b,side,5.4)
  p3=local(hub_base,a,side,5.4)
  panel("maritime hall floor to clerestory glazed bay %s %s"%(row,j),p0,p1,p2,p3,glass,"HUMAN_SCALE_GLAZED_CIVIC")
 for j in range(12):
  x=-12+j*24/11
  bar("exposed oak mullion row %s bay %s"%(row,j),
      local(hub_base,x,side,.9),local(hub_base,x,side,5.7),.07,wood,"FACETED_CIVIC_GLAZING_FRAME")
# Open terraced sea-facing access and seating; 4 terraces, not many cubes.
for k in range(4):
 s=-8.3-k*2.8
 a=local(hub_base,-10,s,1.6-k*.32)
 b=local(hub_base,10,s,1.6-k*.32)
 c=local(hub_base,10,s-2.4,1.6-(k+1)*.32)
 d=local(hub_base,-10,s-2.4,1.6-(k+1)*.32)
 panel("public viewing amphitheatre step %02d"%k,a,b,c,d,stone,"WATERFRONT_CULTURAL_TERRACE")
# Slender safety railing aligned with waterfront promenade, no collision.
rails=[]
for d in range(hub_d-25,hub_d+29,6):
 s=hub_s-8.2
 base=at(d,s,5.1)
 tip=base+Vector((0,0,1.22))
 bar("accessible harbor promenade vertical guard %03d"%d,base,tip,.045,steel,"GUARD_NO_GAME_COLLIDER")
 rails.append(tip)
for i in range(len(rails)-1):
 bar("continuous coastal footpath guardrail %03d"%i,rails[i],rails[i+1],.045,steel,"GUARD_NO_GAME_COLLIDER")

# Racing-course edge is kept physically unchanged. Thin upper guard
# guides beyond the nominal research envelope are VISUAL RESEARCH ONLY.
for side in (-16.6,16.6):
 points=[]
 for d in range(30,163,11):
  p=P(d,side,road_z(d,0)-C.z+1.05)
  points.append(p)
  bar("mineral route safety stanchion %g %g"%(side,d),p-Vector((0,0,1)),p,.065,steel,"NOT_REAL_GAME_BARRIER")
 for i in range(len(points)-1):
  bar("route optical guide rail %g %03d"%(side,i),points[i],points[i+1],.062,steel,"NO_COLLIDER_RACE_VISUAL")

# A1 genuine visual review found the thin wheel-path stripes looked like
# fake bright straight painted ribbons. Reject them rather than repeating
# unconvincing decoration; physically original Road5 remains untouched.

assert original_poses()==poses,"source camera mutation"
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_pose,"CHASE camera mutation"
assert set(road_fingerprint(o) for o in source.values())=={ROAD_HASH},"Road5 geometry mutation"
assert all(tuple(tuple(row) for row in o.matrix_world)==old_tree_transform[o.name] for o in oldtrees)
assert tuple(tuple(row) for row in original_new_tree[0].matrix_world)==original_tree_transform
assert sha(BASE)==BASE_HASH
assert len(object_names)>100,len(object_names)

# Object count is not an aesthetic success metric. Record limited actual
# screen projections so reviewers can see what enters the camera frame.
anchors={
 "functional-harbor-visitor-hall":local(hub_base,0,0,5),
 "harbor-deck":deck_points[len(deck_points)//2],
 "left-natural-landform":at(80,52,4),
 "right-wind-shaped-real-tree":original_new_tree[0].location.copy(),
 "road-control-center":P(65,0,ground(65))
}
projections={k:{"x":round(proj(v)[0],5),"y":round(proj(v)[1],5),
                "inFront":proj(v)[2]>0,"insideFrame":inframe(v)}
             for k,v in anchors.items()}
assert projections["functional-harbor-visitor-hall"]["insideFrame"],projections
assert projections["road-control-center"]["insideFrame"],projections

sc.camera=cam
sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480
sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
native=OUT/"K4BW_ONE_COHERENT_COASTAL_CIVIC_ROAD_EDITABLE_NATIVE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(native))
image=OUT/"K4BW_SAME_CHASE_ONE_COHERENT_COASTAL_CIVIC_ROAD_ART_HOLD_NOT_GAME.png"
sc.render.filepath=str(image)
bpy.ops.render.render(write_still=True)
assert native.stat().st_size>150000000 and image.stat().st_size>40000
audit={
 "schema":"dopagaki.K4BW.authored-harbor-road-foreshore-one-frame-art-hold/1",
 "originalK4BVNativeSHA256":BASE_HASH,
 "originalGameBlob":GAME_HASH,"originalB48Road5Fingerprint":ROAD_HASH,
 "originalSixCamerasNumericallyUnchanged":True,"originalResearchChaseUnchanged":True,
 "originalRoad5VertexFaceUnchanged":True,
 "originalEightK4BSPineTransformsUnchanged":True,
 "originalRealK4BVCanopyTreeUnchanged":True,
 "nativeTrueCC0CanopyPreservedNotCloned":True,
 "authorStudyElements":len(object_names),
 "leftRidgeExperimentSavedButRenderHiddenAfterA1ArtReject":True,
 "fakeStraightWheelMarkStudyRemovedAfterA1ArtReject":True,
 "artAuthorship":"one shell-roof maritime public visitor and boat service building with glazed occupied frontage, tidal quay terraced public walk, continuous left natural ridge, noncolliding road patina and safety guides",
 "harborChoice":{"d":hub_d,"s":hub_s,"cameraX":round(hub_x,4),"cameraY":round(hub_y,4)},
 "frameProjections":projections,"sourceB48Roads":7,"sourceB51Movers":28,
 "sourcePhysicsHz":240,"sourceBallRadiusM":.65,"newGameColliders":0,
 "gameSourceChanged":False,"newResearchRoadNotVerifiedGameCollider":True,
 "researchNativeSingleFrame":True,"imageSize":[768,480],
 "notRealWebGL2Game":True,"fpsAndLOD":"HOLD",
 "ART":"UNJUDGED_HOLD","formalArtAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (native,image)}
}
(OUT/"K4BW_COHERENT_HARBOR_ROAD_NATIVE_ART_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print("K4BW_AUTHORED_HARBOR_CIVIC_ROAD_NATIVE_IMAGE_TECH_HOLD",json.dumps({
 "objects":len(object_names),"hub":audit["harborChoice"],"frames":projections
},ensure_ascii=False),flush=True)
