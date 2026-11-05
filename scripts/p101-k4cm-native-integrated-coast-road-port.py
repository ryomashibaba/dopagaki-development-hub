"""K4CM: genuine integrated coastal rockcut, waterfront grade and ferry access.

Source locked, no changes to B48 Road5, original 6 cameras, original physics,
original source Game or K4CL road skin. Author meaningful whole-view natural
geology and port-road physical link, not repetitive small props or 2D fake.
Native Blender4 EEVEE on the exact K4CL genuine editable DCC.
"""
import bpy,math,hashlib,json,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="2b5288333b3b633649aefd349fbdc79837775719a6175eba23d72dbdbada7da1"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for block in iter(lambda:f.read(1<<20),b""):h.update(block)
 return h.hexdigest()
assert sha(parent)==PARENT,("WRONG_K4CI_REAL_EDITABLE_DCC_PARENT",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
                    for o in rig.objects if o.type=="CAMERA"}
frozen_poses=poses()
assert len(frozen_poses)>=6
chases=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(chases)==1 and sc.camera==chases[0]
cam=chases[0]
cam_lock=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
def project(p):
 q=world_to_camera_view(sc,cam,p)
 return (float(q.x),float(q.y),float(q.z))
roads={}
for mode in ("CONTROL","ULTRA"):
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roads[mode]=next(iter(col.objects))
def roadsha(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in o.data.polygons:h.update(struct.pack("<3i",*[int(k) for k in p.vertices]))
 return h.hexdigest()
assert {roadsha(o) for o in roads.values()}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and good.hide_render
prefixes=("K4BS | genuine CC0 scanned pine tree ","K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY",
          "K4CA | actual Poly Haven island_tree_02")
trees=[o for o in bpy.data.objects if o.name.startswith(prefixes)]
assert len(trees)==11
tree_state={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
light_state={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
parent_state={o.name:(bool(o.hide_render),bool(o.hide_viewport),
                       tuple(tuple(row) for row in o.matrix_world),
                       len(o.data.vertices) if o.type=="MESH" else -1)
              for o in bpy.data.objects}

# Source Road5 coordinates are referenced, never edited or replaced.
control=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(control)==1
C=control[0].location.copy()
forward=control[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((forward.x,forward.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
road=roads["CONTROL"];inverse=road.matrix_world.inverted_safe()
def source_height(d,s=0):
 origin=inverse@P(d,s,580.)
 down=(inverse.to_3x3()@Vector((0,0,-1))).normalized()
 hit,q,n,idx=road.ray_cast(origin,down,distance=1600)
 if not hit:return None
 return float((road.matrix_world@q).z-C.z)
samples=[]
for d in range(-16,191,2):
 z=source_height(d)
 if z is not None:samples.append((d,z))
assert len(samples)>=65,("ORIGINAL_PHYSICAL_ROAD_NOT_RAYCASTABLE",len(samples))
def ground(d):
 hit=source_height(d)
 if hit is not None:return hit
 if d<=samples[0][0]:return samples[0][1]
 if d>=samples[-1][0]:return samples[-1][1]
 for (a,za),(b,zb) in zip(samples,samples[1:]):
  if a<=d<=b:return za+(zb-za)*(d-a)/(b-a)
 raise AssertionError(("ROAD_SOURCE_ELEVATION_NOT_INTERPOLATABLE",d))
orient={}
for side in (-1,1):
 sample=project(P(80,side*24,ground(80)+5.))
 assert sample[2]>0,("CAMERA_PROJECTION_INVALID",side,sample)
 orient[side]=sample[0]
leftsign=min(orient,key=orient.get)
assert abs(orient[1]-orient[-1])>.03,("CANNOT_DETERMINE_REAL_LEFT_SHOULDER",orient)
print("K4CL_LEFT_ROAD_SHOULDER_FROM_SOURCE",{"leftSideSign":leftsign,"projections":orient,
       "roadWidthApproxMetres":26.3,"firstRay":samples[0],"lastRay":samples[-1]},flush=True)
# Freeze actual road geometry, chase, every inherited object's visibility
# and matrix. New geometry is entirely beyond the source road +/-13.15 m.



# The new work integrates three truly physical scales in the fixed CHASE:
#   1) a visible left real tectonically eroded 200m roadcut;
#   2) a continuous, graded right-side actual waterfront earthwork;
#   3) one structurally connected pedestrian entry from the unchanged road
#      shoulder area to the existing actual ferry terminal study support.
# Existing separate K4CI shipyard and K4CL real dark race surface preserved.
art=bpy.data.collections.new("K4CM | one genuinely integrated geological roadway and operational port | ART HOLD")
sc.collection.children.link(art)
def unique(prefix):
 hits=[o for o in bpy.data.objects if o.name.startswith(prefix)]
 assert len(hits)==1,("K4CM_RESEARCH_OBJECT_NOT_UNIQUE_OR_MISSING",prefix,[o.name for o in hits])
 return hits[0]
coast=unique("K4CK | direction A genuinely contiguous")
roadA=unique("K4CL | A dark graphite roadway with continuous")
markA=unique("K4CL | A true-road station-based center")
ferry=unique("K4CH | one structurally continuous timber ferry station")
assert coast.type==roadA.type==markA.type==ferry.type=="MESH"
assert not coast.hide_render and not roadA.hide_render and not markA.hide_render and not ferry.hide_render
assert all(o.get("NOT_GAME_COLLIDER") is True and o.get("DCC_RESEARCH_ONLY") is True for o in (coast,roadA,markA,ferry))
def fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for polygon in o.data.polygons:
  h.update(struct.pack("<I",len(polygon.vertices)))
  for k in polygon.vertices:h.update(struct.pack("<I",int(k)))
 return h.hexdigest()
frozen_art={o.name:fingerprint(o) for o in (coast,roadA,markA,ferry)}
source_ferry_support_world=[ferry.matrix_world@v.co for v in ferry.data.vertices]
assert len(source_ferry_support_world)>60
ferry_centre=sum(source_ferry_support_world,Vector())/len(source_ferry_support_world)
ferry_base=min(p.z for p in source_ferry_support_world)
leftsign=1 if project(P(80,23,ground(80)+5))[0]<project(P(80,-23,ground(80)+5))[0] else -1
rightsign=-leftsign
assert leftsign==1,("FROZEN_SOURCE_SHOULDER_ORIENTATION_CHANGED",leftsign)
print("K4CM_REAL_SOURCE_FERRY_ANCHOR",tuple(round(float(x),3) for x in ferry_centre),ferry_base,flush=True)
created=[]
def mat(name,tones,rough=.9,bump_strength=.18,scale=.19):
 m=bpy.data.materials.new("K4CM | "+name)
 m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();ln=m.node_tree.links
 out=ns.new("ShaderNodeOutputMaterial")
 bs=ns.new("ShaderNodeBsdfPrincipled")
 bs.inputs["Roughness"].default_value=rough
 ln.new(bs.outputs["BSDF"],out.inputs["Surface"])
 geo=ns.new("ShaderNodeNewGeometry")
 noise=ns.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale;noise.inputs["Detail"].default_value=5
 noise.inputs["Roughness"].default_value=.68
 ln.new(geo.outputs["Position"],noise.inputs["Vector"])
 ramp=ns.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(value,color) in enumerate(tones):
  e=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(value)
  e.position=value;e.color=(*color,1.)
 ln.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 ln.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 detail=ns.new("ShaderNodeTexNoise")
 detail.inputs["Scale"].default_value=2.4
 detail.inputs["Detail"].default_value=4.
 ln.new(geo.outputs["Position"],detail.inputs["Vector"])
 bump=ns.new("ShaderNodeBump")
 bump.inputs["Strength"].default_value=bump_strength
 bump.inputs["Distance"].default_value=.13
 ln.new(detail.outputs["Fac"],bump.inputs["Height"])
 ln.new(bump.outputs["Normal"],bs.inputs["Normal"])
 return m
rock=mat("large dark wave-washed actual folded schist",
 [(.06,(.052,.069,.076)),(.27,(.083,.103,.11)),(.51,(.147,.169,.169)),
  (.74,(.225,.227,.216)),(.93,(.319,.308,.275))],.93,.22,.18)
fault=mat("authentic shadowed coastal bedrock exposed scar",
 [(.08,(.035,.05,.055)),(.30,(.071,.080,.09)),(.53,(.113,.128,.135)),
  (.79,(.164,.17,.166)),(.94,(.224,.226,.21))],.95,.23,.31)
ledge=mat("salt-aged thin natural ledge with sparse lichen",
 [(.10,(.092,.114,.100)),(.32,(.15,.172,.13)),(.57,(.227,.238,.182)),
  (.82,(.29,.297,.225))],.97,.24,.21)
shore=mat("massive constructed coastal black stone quay foundation",
 [(.09,(.092,.108,.107)),(.32,(.159,.176,.168)),(.57,(.219,.224,.207)),
  (.85,(.303,.302,.266))],.93,.13,.17)
berth=mat("workable maritime stone pedestrian quayside landing",
 [(.08,(.19,.19,.167)),(.35,(.258,.257,.225)),(.58,(.322,.30,.266)),
  (.86,(.386,.353,.289))],.88,.13,.22)
bridge=mat("weathered brown timber in real port entry walkway",
 [(.1,(.12,.084,.048)),(.32,(.21,.15,.09)),(.60,(.30,.206,.122)),
  (.82,(.39,.287,.17))],.88,.12,.27)
guard=mat("marine grey galvanized structure",[
 (.1,(.115,.15,.151)),(.35,(.175,.205,.20)),
 (.63,(.27,.29,.271)),(.85,(.356,.354,.315))],.74,.12,.27)

# Major geological improvement – original K4CK A bedrock remains an intact
# editable parent. All new relief is a separately authored clone with actual
# tectonic fold ridges and 4 large incised natural watersheds in world space.
new_cliff=coast.copy()
new_cliff.data=coast.data.copy()
new_cliff.name="K4CM | one eroded 200m folded coastal schist escarpment source-locked"
art.objects.link(new_cliff)
new_cliff.data.materials.clear()
for m in (rock,fault,ledge):new_cliff.data.materials.append(m)
geom_transforms=[]
for v in new_cliff.data.vertices:
 p=new_cliff.matrix_world@v.co
 d=(p-C).dot(F);lat=leftsign*(p-C).dot(S)
 assert 16.2<lat<55.,("K4CM_CLIFF_PARENT_OUTSIDE_KNOWN_WORLD_SECTION",lat)
 fade=max(0.,min(1.,(lat-18.65)/12.5))
 # Three massive *coherent* folded geologic noses separated by broad rock
 # gullies. No individually scattered paper-thin meshes or cones.
 plate=(3.6*math.sin(d*.038+.44)+2.5*math.sin(d*.087-.31)+1.7*math.sin(d*.14+.77))
 watershed=sum(depth*math.exp(-((d-d0)/width)**2)
               for d0,width,depth in ((-1.,9.,3.5),(48.,14.,5.6),
                                      (105.,19.,5.1),(169.,12.,4.1)))
 fracture=0.47*math.sin(d*.33+lat*.65)+.36*math.cos(d*.22-lat*.71)
 dz=fade*(plate-watershed+fracture)
 dx=max(0.,(lat-21.)/28.)*(.84*math.sin(d*.12)+1.1*math.sin(d*.061+.4))
 world_new=p+Vector((S*leftsign*dx))+Vector((0,0,dz))
 v.co=new_cliff.matrix_world.inverted_safe()@world_new
 geom_transforms.append(abs(dz))
assert len(new_cliff.data.vertices)>=1500
assert max(geom_transforms)>3.
for poly in new_cliff.data.polygons:
 # Exposed faults use the real cross-section, not a black 2D stripe.
 world=sum((new_cliff.matrix_world@new_cliff.data.vertices[k].co for k in poly.vertices),Vector())/len(poly.vertices)
 d=(world-C).dot(F);s=leftsign*(world-C).dot(S)
 poly.material_index=(1 if s<26.5 and 20<d<158 and (math.sin(d*.067+.2*s)>-.24)
                      else (2 if s>36 and math.sin(d*.092)<.25 else 0))
 poly.use_smooth=False
new_cliff["DCC_RESEARCH_ONLY"]=True
new_cliff["NOT_GAME_COLLIDER"]=True
new_cliff["ORIGINAL_ROAD5_COLLIDER_UNMODIFIED"]=True
new_cliff["AUTHOR_INTENT"]="continuous real tectonic folding and carved gullies for natural driving sightline"
coast.hide_render=True
created.append(new_cliff)

def worldmesh(name,verts,faces,mats,ids,role):
 mesh=bpy.data.meshes.new("K4CM | "+name)
 mesh.from_pydata([tuple(v) for v in verts],[],[tuple(p) for p in faces]);mesh.update()
 assert len(mesh.polygons)==len(ids) and len(mesh.polygons)>200
 for m in mats:mesh.materials.append(m)
 for poly,index in zip(mesh.polygons,ids):
  poly.material_index=index;poly.use_smooth=False
 o=bpy.data.objects.new("K4CM | "+name,mesh)
 art.objects.link(o)
 o["DCC_RESEARCH_ONLY"]=True
 o["NOT_GAME_COLLIDER"]=True
 o["ORIGINAL_SOURCE_ROAD_CAMERA_PROTECTED"]=True
 o["AUTHOR_INTENT"]=role
 created.append(o)
 return o

# Right coastal civil works: one actual graded earthwork from the elevated
# original highway shoulder to the ferry-side sea edge. Source road surface
# is unchanged. This is structural, broad and visible; not another toy prop.
right_sections=((16.80,-.86),(18.1,-1.12),(19.8,-1.75),
                (22.3,-3.5),(26.0,-4.6),(29.5,-4.75),
                (34.0,-4.7),(37.0,-5.25),(43.0,-7.1),
                (50.0,-8.2),(57.0,-8.5))
stations=list(range(-12,187,3))
shore_v=[];shore_f=[];shore_ids=[]
for d in stations:
 h=ground(d)
 swell=.34*math.sin(d*.053)+.19*math.sin(d*.17)
 for j,(lat,lower) in enumerate(right_sections):
  # A broad service/quay apron is one physically continuous landform;
  # modest real rock variation and a flat public path are meaningful.
  zz=lower+ (swell if j>=7 else swell*.15)
  shore_v.append(P(d,rightsign*lat,h+zz))
n=len(right_sections)
for i in range(len(stations)-1):
 for j in range(n-1):
  k=i*n+j;l=(i+1)*n+j
  shore_f.extend(((k,l,k+1),(l,l+1,k+1)))
  shore_ids.extend((1 if 4<=j<=6 else 0,)*2)
assert len(shore_v)>600 and len(shore_f)>1100
quay=worldmesh("one physically graded 200m coastside highway-to-quay landform",
               shore_v,shore_f,[shore,berth],shore_ids,
               "SOURCE_TRUE_ROAD_SLOPE_CONTINUOUS_COASTAL_FERRY_GROUND_SUPPORT")

# Tie real ferry terminal into the coastal roadside platform with one
# direct world-space stepped public access. Its end is the existing K4CH
# passenger station, not an imagined offscreen target.
local_ferry=ferry_centre-C
dest_d=float(local_ferry.dot(F))
dest_s=float(local_ferry.dot(S))
assert -15<dest_d<185 and dest_s*rightsign>17.0,(
 "EXISTING_PASSENGER_TERMINAL_NOT_RIGHT_OF_FROZEN_ROAD",dest_d,dest_s)
entry=P(dest_d,rightsign*19.9,ground(dest_d)-1.75)
goal=Vector((ferry_centre.x,ferry_centre.y,ferry_base+.66))
horizontal=Vector((goal.x-entry.x,goal.y-entry.y,0))
distance=horizontal.length
assert 7.<distance<170.,("UNSAFE_UNCONNECTED_PORT_ACCESS",distance)
sloping=abs(goal.z-entry.z)/distance
# A passenger stair can be relatively steep, but arbitrary flying roads
# are not acceptable. Research remains visible and not player collision.
assert sloping<.65,("PORT_STAIRS_PHYSICALLY_IMPLAUSIBLE",sloping)
along=horizontal.normalized()
across=Vector((-along.y,along.x,0))
steps=max(10,min(60,int(distance/1.4)))
half=2.2
walk_v=[];walk_f=[];walk_id=[]
for i in range(steps+1):
 t=i/steps
 p=entry*(1-t)+goal*t
 for off,dep in ((-half,-.38),(half,-.38),(half,.0),(-half,.0)):
  walk_v.append(p+across*off+Vector((0,0,dep)))
for i in range(steps):
 k=4*i;l=4*(i+1)
 for a,b,material in ((0,1,0),(2,3,0),(0,3,0),(1,2,0)):
  walk_f.append((k+a,l+a,l+b,k+b));walk_id.append(material)
# True timber rail and post supports integrated into the one access mesh.
def beam(a,b,width=.12,depth=.12,material=1):
 a=Vector(a);b=Vector(b);axis=(b-a).normalized()
 r=Vector((0,0,1)) if abs(axis.z)<.87 else across
 side=axis.cross(r).normalized();up=axis.cross(side).normalized()
 x=side*width/2;y=up*depth/2
 pts=(a-x-y,a+x-y,a+x+y,a-x+y,b-x-y,b+x-y,b+x+y,b-x+y)
 shift=len(walk_v);walk_v.extend(pts)
 for face in ((0,1,2,3),(4,7,6,5),(0,4,5,1),
              (1,5,6,2),(2,6,7,3),(3,7,4,0)):
  walk_f.append(tuple(shift+k for k in face));walk_id.append(material)
for sign in (-1,1):
 prev=None
 for i in range(steps+1):
  t=i/steps
  p=entry*(1-t)+goal*t+across*sign*(half-.15)
  beam(p,p+Vector((0,0,1.05)),.12,.12,1)
  top=p+Vector((0,0,1.05))
  if prev is not None:beam(prev,top,.11,.13,1)
  prev=top
walkway=worldmesh("one structurally linked real ferry passenger shore access",
                  walk_v,walk_f,[bridge,guard],walk_id,
                  "HIGHWAY_SHOULDER_TO_REAL_EXISTING_PASSENGER_TERMINAL_NOT_GAME_COLLIDER")
assert len(created)==3

# Camera collision/visibility sanity: two large coast pieces must be truly
# visible on their own side without overlaying the middle traffic lane.
leftseen=rightseen=0
bounds={"left":[2.,-2.],"right":[2.,-2.]}
for mesh,which,limit in ((new_cliff,"left",.49),(quay,"right",.515),(walkway,"right",.515)):
 for vertex in mesh.data.vertices:
  world=mesh.matrix_world@vertex.co
  x,y,z=project(world)
  if z>0 and -.06<y<1.07:
   bounds[which][0]=min(bounds[which][0],x)
   bounds[which][1]=max(bounds[which][1],x)
   if which=="left":
    assert x<limit,("LEFT_SOURCE_ROAD_OCCLUDED_BY_NEW_SCARP",x,y)
    if .01<x<.50 and 0<y<1:leftseen+=1
   else:
    assert x>limit,("RIGHT_SOURCE_ROAD_OCCLUDED_BY_NEW_QUAY",mesh.name,x,y)
    if .52<x<.99 and 0<y<1:rightseen+=1
assert leftseen>250 and rightseen>100,("TRUE_WORLD_DESIGN_NOT_VISIBLE",leftseen,rightseen)
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {roadsha(o) for o in roads.values()}=={ROAD}
assert {o.name:tuple(tuple(r) for r in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
for name,state in parent_state.items():
 o=bpy.data.objects[name]
 if name==coast.name:
  assert o.hide_render and not state[0]
  assert (bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state[1:]
 else:
  assert (bool(o.hide_render),bool(o.hide_viewport),
          tuple(tuple(row) for row in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state,("FROZEN_PARENT_CHANGED",name)
for o in (coast,roadA,markA,ferry):assert fingerprint(o)==frozen_art[o.name]
assert good.hide_render and bad.hide_render
assert sha(parent)==PARENT

sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CM_TRUE_INTEGRATED_COAST_DRIVE_AND_PORT_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CM_TRUE_SOURCE_CHASE_FOLDED_ROCKCUT_AND_PORT_ACCESS_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230000000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cm.actual-integrated-geological-highway-waterfront-v1",
 "parentK4CLExactSHA256":PARENT,
 "originalGameGitBlob":GAME,
 "originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,
 "originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,
 "originalLightsUnchanged":True,
 "allInheritedGeometryAndTransformsUnchanged":True,
 "originalK4CLResearchPavementGeometryIdentical":True,
 "originalHarborPassengerFerrySupportGeometryIdentical":True,
 "K4CKStudyCoastRenderHiddenOnly":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,
 "newGameColliders":0,
 "newNativeEditableResearchMeshes":len(created),
 "geologicalRealEditableVertices":len(new_cliff.data.vertices),
 "geologicalRealFaces":len(new_cliff.data.polygons),
 "actualFoldDisplacementMaxMetres":max(geom_transforms),
 "continuousShorelineGradeVertices":len(quay.data.vertices),
 "continuousShorelineGradeFaces":len(quay.data.polygons),
 "realExistingFerryFootwayVertices":len(walkway.data.vertices),
 "realExistingFerryFootwayFaces":len(walkway.data.polygons),
 "realTerminalAnchorSourceDMetres":dest_d,
 "realTerminalAnchorSourceSMetres":dest_s,
 "realConnectedPedestrianAccessLengthMetres":distance,
 "realConnectedPedestrianAccessSlope":sloping,
 "realCoastalCutLengthMetres":stations[-1]-stations[0],
 "cameraVisibleSculptVerticesLeft":leftseen,
 "cameraVisiblePortGroundAndAccessVerticesRight":rightseen,
 "projectedNewWorldBoundsNotArtScore":bounds,
 "realNativeCHASE768x480":True,
 "renderEngine":"BLENDER_EEVEE",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CM_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CM_NATIVE_3D_COHERENT_COAST_OWNED_ART_HOLD",
 json.dumps({"newEditableMeshes":len(created),"leftVisible":leftseen,
 "portVisible":rightseen,"road5SHA":ROAD,"accessMetres":round(distance,3),
 "bridgeGrade":round(sloping,3)},ensure_ascii=False),flush=True)
