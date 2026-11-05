"""K4CK: two architect-authored, true-world geologic coastal corridor directions.

A: excavated layered basalt with a single grounded continuous seawall.
B: massive naturally incised peninsula-cut with drainage channels.
Both replace the earlier floating repetitive triangular windbreak in this
isolated Blender study. Never change original Road5, camera, game physics,
source trees/lights, frozen art or original research mesh vertices.
"""
import bpy,math,hashlib,json,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="296326d18c446e70c25ca45598ad623affaf20c07a26e263b1789e9dc2bb04d2"
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
assert good and not good.hide_render
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
print("K4CK_LEFT_ROAD_SHOULDER_FROM_SOURCE",{"leftSideSign":leftsign,"projections":orient,
       "roadWidthApproxMetres":26.3,"firstRay":samples[0],"lastRay":samples[-1]},flush=True)
# Freeze actual road geometry, chase, every inherited object's visibility
# and matrix. New geometry is entirely beyond the source road +/-13.15 m.

# A/B true 3D world-space authoring of major visible racing environments:
# prior SOURCE ROAD5 is untouched, K4CJ prior cut/triangles preserved but
# rendered hidden in this research-only successor.
coll=bpy.data.collections.new("K4CK | true coastal drive escarpment A/B | ART HOLD")
sc.collection.children.link(coll)
made=[]
def obj(name,verts,faces,mats,ids,role):
 data=bpy.data.meshes.new("K4CK | "+name)
 data.from_pydata([tuple(v) for v in verts],[],[tuple(f) for f in faces])
 data.update()
 assert len(faces)==len(ids) and len(faces)>100
 for mat in mats:data.materials.append(mat)
 for poly,k in zip(data.polygons,ids):
  poly.material_index=k;poly.use_smooth=False
 o=bpy.data.objects.new("K4CK | "+name,data)
 coll.objects.link(o)
 o["DCC_RESEARCH_ONLY"]=True;o["NOT_GAME_COLLIDER"]=True
 o["ART_FIRST_EDITABLE_WORLD_FUNCTION"]=role
 o["ORIGINAL_GAME_ROAD5_UNCHANGED"]=True
 made.append(o)
 return o
def mat(label,colors,scale,rough=.93,metal=0.,bump=.23):
 m=bpy.data.materials.new("K4CK | "+label)
 m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();lk=m.node_tree.links
 outnode=ns.new("ShaderNodeOutputMaterial")
 bs=ns.new("ShaderNodeBsdfPrincipled")
 bs.inputs["Roughness"].default_value=rough
 bs.inputs["Metallic"].default_value=metal
 lk.new(bs.outputs["BSDF"],outnode.inputs["Surface"])
 geo=ns.new("ShaderNodeNewGeometry")
 noise=ns.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale
 noise.inputs["Detail"].default_value=5.
 noise.inputs["Roughness"].default_value=.72
 lk.new(geo.outputs["Position"],noise.inputs["Vector"])
 ramp=ns.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(pos,col) in enumerate(colors):
  e=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(pos)
  e.position=pos;e.color=(*col,1.)
 lk.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 lk.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 detail=ns.new("ShaderNodeTexNoise")
 detail.inputs["Scale"].default_value=3.1
 detail.inputs["Detail"].default_value=4.
 lk.new(geo.outputs["Position"],detail.inputs["Vector"])
 b=ns.new("ShaderNodeBump")
 b.inputs["Strength"].default_value=bump
 b.inputs["Distance"].default_value=.095
 lk.new(detail.outputs["Fac"],b.inputs["Height"])
 lk.new(b.outputs["Normal"],bs.inputs["Normal"])
 return m

a_dark=mat("A salt-dark broken coastal basalt rock",
 [(.13,(.051,.066,.071)),(.32,(.095,.115,.119)),(.53,(.16,.181,.176)),
  (.74,(.234,.237,.212)),(.87,(.33,.316,.27))],.17)
a_face=mat("A natural grey fracture exposure",
 [(.13,(.075,.083,.079)),(.35,(.16,.173,.17)),(.53,(.25,.246,.218)),
  (.76,(.38,.35,.30)),(.88,(.48,.432,.36))],.23)
a_ledge=mat("A lichened marine cut ledge",
 [(.12,(.075,.10,.087)),(.30,(.17,.20,.16)),(.55,(.29,.31,.24)),
  (.80,(.39,.39,.31))],.19,.97,0,.17)
b_rock=mat("B warm slate sea-cut natural slabstone",
 [(.1,(.086,.093,.09)),(.30,(.18,.19,.185)),(.5,(.29,.285,.27)),
  (.70,(.38,.363,.325)),(.88,(.51,.474,.40))],.18)
b_face=mat("B shadowed river-incised rock exposures",
 [(.1,(.048,.056,.061)),(.36,(.13,.14,.147)),(.55,(.21,.217,.207)),
  (.79,(.32,.32,.29))],.26)
concrete=mat("A actual cast wet maritime aggregate retaining face",
 [(.1,(.098,.11,.112)),(.34,(.19,.21,.211)),(.58,(.28,.30,.29)),
  (.81,(.37,.39,.35))],.35)
coping=mat("A hard basalt weathered capstone",
 [(.1,(.082,.091,.088)),(.35,(.17,.183,.177)),(.59,(.25,.257,.246)),
  (.84,(.36,.365,.33))],.26)

# Preserve K4CJ parent research authoring, including the artist's actual
# previous wrong triangular windbreak. Never erase or mutate it.
find_prefixes=(
 "K4CJ | single true world-roadcut coastal rock section",
 "K4CJ | one linked marine windbreak and geological buttress rhythm"
)
old=[]
def fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(c) for c in v.co]))
 for face in o.data.polygons:
  h.update(struct.pack("<I",len(face.vertices)))
  for idx in face.vertices:h.update(struct.pack("<I",int(idx)))
 return h.hexdigest()
original_mesh_hashes={}
for prefix in find_prefixes:
 candidates=[o for o in bpy.data.objects if o.name.startswith(prefix)]
 assert len(candidates)==1,(prefix,"K4CJ_AUTHOR_ART_OBJECT_AMBIGUOUS",[o.name for o in candidates])
 o=candidates[0]
 assert o.type=="MESH" and not o.hide_render
 assert o.get("DCC_RESEARCH_ONLY") is True and o.get("NOT_GAME_COLLIDER") is True
 original_mesh_hashes[o.name]=fingerprint(o)
 o.hide_render=True
 old.append(o)

# Original Road5 from SOURCE 11307 is the only station/elevation reference.
# Both landscape DIRECTIONS share 2m longitudinal samples for almost 200m,
# but differ in actual 3D terracing, erosion/strata and drainage function.
stations=list(range(-12,188,2))
# each profile starts 3.55m outside the original 13.15m road edge.
profA=((16.70,.48),(17.65,.61),(18.72,1.28),(19.80,3.2),
       (21.0,5.9),(22.2,8.45),(23.0,9.15),(24.8,9.6),
       (27.0,10.8),(29.2,11.75),(31.6,11.7),(33.2,10.6),
       (36.3,9.9),(40.4,8.65),(45.0,7.1),(51.0,6.2))
profB=((16.70,.35),(17.6,.55),(18.8,1.05),(20.0,1.9),
       (21.7,3.3),(23.3,4.7),(24.8,6.4),(26.0,8.0),
       (27.7,8.7),(29.8,9.25),(32.2,9.35),(35.0,8.5),
       (38.4,7.2),(42.6,6.5),(47.5,6.0),(54.0,5.4))
minimum_lateral=1e9
screen_extent={}
def make_cliff(which,prof,colors):
 global minimum_lateral
 vv=[];ff=[];ids=[]
 minx=2.;maxx=-2.;vis=0
 for i,d in enumerate(stations):
  for j,(s,elevation) in enumerate(prof):
   minimum_lateral=min(minimum_lateral,s)
   # Smooth but non-periodic large-scale geologic uplift, rather than
   # identical triangle ribs, painted zigzags or Gaussian cones.
   shear=.80*math.sin(d*.050+j*.29)+.52*math.cos(d*.119-j*.50)
   erosion=.32*math.sin(d*.23+j*.73)+.13*math.cos(d*.47-j*.33)
   # Three broad, real sculpted watershed incisions change the actual
   # local Z and create water-runoff valleys through the strata.
   watercut=0.
   for centre,width,depth in ((22.,10.,2.2),(89.,16.,1.5),(150.,11.,2.6)):
    watercut+=depth*math.exp(-((d-centre)/width)**2)
   relief=(shear+erosion)*(.09 if j<2 else (.36 if which=="B" else .58))
   h=ground(d)+elevation+relief
   if 3<=j<=12:h-=watercut*(.45 if which=="A" else .85)
   p=P(d,leftsign*s,h)
   proj=project(p)
   if proj[2]>0 and -.07<proj[1]<1.07:
    maxx=max(maxx,proj[0]);minx=min(minx,proj[0])
    assert proj[0]<.49,("K4CK_ROAD_VIEW_CUT_OVERLAP",which,d,j,proj)
    if 0<proj[0]<.50 and 0<proj[1]<1:vis+=1
   vv.append(p)
 n=len(prof)
 for i in range(len(stations)-1):
  for j in range(n-1):
   k=i*n+j;l=(i+1)*n+j
   # Non-repeating tilted actual planar rock fractures for genuine
   # EEVEE changing normals and landmark-scale silhouette.
   if ((i*19+j*13)//7)%2:
    triangles=((k,l,l+1),(k,l+1,k+1))
   else:triangles=((k,l,k+1),(l,l+1,k+1))
   ff.extend(triangles)
   material=1 if j in (3,4,8,9,10,11) else (2 if j>12 else 0)
   ids.extend((material,material))
 assert len(vv)>1400 and len(ff)>2800 and vis>350,("NOT_ENOUGH_REAL_LEFT_SCREEN_GEOLOGY",which,vis)
 screen_extent[which]=(minx,maxx,vis)
 o=obj("direction "+which+" genuinely contiguous eroded coastal cross-section",vv,ff,colors,ids,
        "REAL_WORLDSCALE_GEOGRAPHIC_BASE_FOR_RACECORRIDOR_" + which)
 return o

A=make_cliff("A",profA,[a_dark,a_face,a_ledge])
B=make_cliff("B",profB,[b_rock,b_face,a_ledge])
# Unlike K4CJ triangles, A's source-grounded, horizontal, connected
# retaining system has actual thickness and a clear traffic-side role.
wallv=[];wallf=[];wallmat=[]
N=8
for i,d in enumerate(stations):
 h=ground(d)
 # Low retaining wall faces the road; sandstone footing and cast
 # aggregate top cap integrated to the larger cut.
 # Four lateral sections, true beam volume with stable route height.
 for s,z in ((16.70,.18),(18.35,.18),(18.35,1.72),(16.70,1.64),
             (16.70,1.98),(18.35,1.98),(18.35,2.12),(16.70,2.06)):
  wallv.append(P(d,leftsign*s,h+z))
for i in range(len(stations)-1):
 for ring in ((0,1,2,3),(4,5,6,7)):
  for j in range(4):
   k=i*N+ring[j];nk=i*N+ring[(j+1)%4]
   k2=(i+1)*N+ring[j];nk2=(i+1)*N+ring[(j+1)%4]
   wallf.append((k,k2,nk2,nk));wallmat.append(0 if ring[0]==0 else 1)
# Cap and concrete wall are in ONE physically unbroken cross-sectional structure.
wall=obj("A one continuous low cast maritime retaining parapet with stone cap",
         wallv,wallf,[concrete,coping],wallmat,
         "STRUCTURAL_SHOULDER_RETENTION_LINKED_TO_GEOLOGY_NOT_SCREEN_ORIGINAL")
for p in wallv[::5]:
 x,y,z=project(p)
 if z>0 and -.07<y<1.07:
  assert x<.49,("K4CK_REAL_WALL_OVERLAPS_FROZEN_GAME_ROAD",x,y)
assert minimum_lateral>16.4

# Native editability: both alternatives are in ONE .blend. A and B are
# mutually exclusive art-directions in the same editable DCC scene, never
# composited or pixel manipulated to fake good scenery.
for o in (A,B,wall):
 assert o.get("DCC_RESEARCH_ONLY") is True
 assert o.get("NOT_GAME_COLLIDER") is True
assert len(made)==3
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {roadsha(o) for o in roads.values()}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
whitelist={o.name for o in old}
for name,state in parent_state.items():
 o=bpy.data.objects[name]
 if name in whitelist:
  assert o.hide_render and not state[0]
  assert (bool(o.hide_viewport),tuple(tuple(r) for r in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state[1:]
 else:
  assert (bool(o.hide_render),bool(o.hide_viewport),
          tuple(tuple(r) for r in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state,("SOURCE_OR_FROZEN_PARENT_CHANGED",name)
for o in old:assert fingerprint(o)==original_mesh_hashes[o.name]
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
imageA=out/"K4CK_A_TRUE_CHASE_CONTINUOUS_BASALT_CUT_AND_RETAINING_WALL_NOT_GAME.png"
imageB=out/"K4CK_B_TRUE_CHASE_ERODED_NATURAL_CLIFF_NO_WALL_NOT_GAME.png"
bl=out/"K4CK_EDITABLE_TWO_TRUE_COHERENT_COASTAL_CORRIDOR_DIRECTIONS_ART_HOLD.blend"
# A: natural massive basalt cut plus real traffic retaining structure.
B.hide_render=True;A.hide_render=False;wall.hide_render=False
sc.render.filepath=str(imageA)
bpy.ops.render.render(write_still=True)
assert imageA.stat().st_size>30000
# B: exposed eroded geological cut, with no artificial road retaining wall.
A.hide_render=True;wall.hide_render=True;B.hide_render=False
sc.render.filepath=str(imageB)
bpy.ops.render.render(write_still=True)
assert imageB.stat().st_size>30000
# Save B active while retaining all A+wall editable in the same native BLEND.
bpy.ops.wm.save_as_mainfile(filepath=str(bl))
assert bl.stat().st_size>230000000
assert {roadsha(o) for o in roads.values()}=={ROAD}
audit={
 "schema":"dopagaki.k4ck.two-full-geologic-corridor-art-directions-v1",
 "parentK4CJR2ExactSHA256":PARENT,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "parentSourceAndAllMeshesMatrixUnchanged":True,
 "originalResearchCutAndTriangleWindbreakHiddenOnlyInStudy":[o.name for o in old],
 "hiddenResearchOriginalMeshFingerprints":original_mesh_hashes,
 "newGameColliders":0,"sourceGameEdited":False,"sourcePhysicsEdited":False,
 "allThreeRealEditableGeometryMeshes":len(made),
 "realCoastLongitudinalStations":len(stations),
 "realDirectionACliffVertices":len(A.data.vertices),
 "realDirectionBCliffVertices":len(B.data.vertices),
 "realDirectionACliffFaces":len(A.data.polygons),
 "realDirectionBCliffFaces":len(B.data.polygons),
 "realConnectedTrafficRetainingWallVertices":len(wall.data.vertices),
 "realConnectedTrafficRetainingWallFaces":len(wall.data.polygons),
 "sourceOriginalRoad5ApproxHalfWidthMetres":13.15,
 "minimumPhysicalNewRoadcutLateralMetres":minimum_lateral,
 "geologyActualCHASEVisibleLimitsNotArtScore":screen_extent,
 "nativeTrueCHASE768x480":True,"renderEngine":"BLENDER_EEVEE",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (bl,imageA,imageB)}
}
(out/"K4CK_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CK_TWO_NATIVE_EDITABLE_COASTAL_DIRECTIONS_SOURCE_GAME_UNTOUCHED",
 json.dumps({"realA":len(A.data.vertices),"realB":len(B.data.vertices),
             "wall":len(wall.data.vertices),"screen":screen_extent,
             "originalGameColliderChanges":0},ensure_ascii=False),flush=True)
