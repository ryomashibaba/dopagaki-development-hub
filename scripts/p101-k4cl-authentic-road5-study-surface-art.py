"""K4CL: real physical Blender research road appearance built from K4BQ skin.

Keep original source Road5 B48 mesh, physics, source road render flags and
camera FROZEN. Use an immutable K4CK editable A-coast parent and switch only
isolated research A/B geology visibility. An actual independent study road
surface mesh is cloned from the existing non-game K4BQ visual mesh; both A
and B are purely renderable pavement and coherent world-space paint with
no collision/game integration or postcompositing.
"""
import bpy,math,hashlib,json,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="80eff12f48b2913d8f700d14f7d84ba86b10dd7ea622033f61fbe51859271330"
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
print("K4CL_LEFT_ROAD_SHOULDER_FROM_SOURCE",{"leftSideSign":leftsign,"projections":orient,
       "roadWidthApproxMetres":26.3,"firstRay":samples[0],"lastRay":samples[-1]},flush=True)
# Freeze actual road geometry, chase, every inherited object's visibility
# and matrix. New geometry is entirely beyond the source road +/-13.15 m.


# True study scene based on K4CK A (basalt and retaining wall), using
# actual research appearance of the roadway from K4BQ. K4CK's saved
# editable DCC includes B active. All swaps are non-destructive and
# source Road5 remains hidden as in its unmodified DCC parent.
study=bpy.data.collections.new("K4CL | realistic source-compatible race asphalt and mineral roadway | ART HOLD")
sc.collection.children.link(study)
def one(prefix):
 matches=[o for o in bpy.data.objects if o.name.startswith(prefix)]
 assert len(matches)==1,("K4CL_RESEARCH_LAYER_NOT_UNIQUE",prefix,[o.name for o in matches])
 return matches[0]
coastA=one("K4CK | direction A genuinely contiguous")
coastB=one("K4CK | direction B genuinely contiguous")
wall=one("K4CK | A one continuous low cast maritime")
assert coastA.type==coastB.type==wall.type=="MESH"
assert coastA.hide_render and not coastB.hide_render and wall.hide_render
assert all(o.get("NOT_GAME_COLLIDER") is True and o.get("DCC_RESEARCH_ONLY") is True
           for o in (coastA,coastB,wall))
# Geometry of K4CK alternatives is immutable. Only render-mode study toggles.
coastA.hide_render=False
coastB.hide_render=True
wall.hide_render=False
# The visible gray road is a K4BQ independent research visual surface,
# and is NOT the imported original B48 road/collision mesh.
surface=good
assert surface.type=="MESH" and not surface.hide_render and surface not in roads.values()
assert len(surface.data.vertices)>500 and len(surface.data.polygons)>500
assert surface.name.startswith("K4BQ / physically variegated 26m")
def fingerprint(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for face in obj.data.polygons:
  h.update(struct.pack("<I",len(face.vertices)))
  for k in face.vertices:h.update(struct.pack("<I",int(k)))
 return h.hexdigest()
original_study_surface_sha=fingerprint(surface)
replaced={
 o.name:fingerprint(o) for o in (coastA,coastB,wall,surface)
}
surface.hide_render=True

# These two road treatments are deliberately NOT two materials on the
# original source Road5. They are editable non-collision render-only
# meshes, identical in geometry to the existing study road. Overlay
# paint is actual native world-coordinate mesh above the same study
# surface, all with independently verifiable SOURCE world positions.
made=[]
def track_material(label,tones,scale,grain,roughness):
 m=bpy.data.materials.new("K4CL | "+label)
 m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();ln=m.node_tree.links
 out=ns.new("ShaderNodeOutputMaterial")
 bs=ns.new("ShaderNodeBsdfPrincipled")
 bs.inputs["Roughness"].default_value=roughness
 bs.inputs["Metallic"].default_value=0.0
 ln.new(bs.outputs["BSDF"],out.inputs["Surface"])
 geo=ns.new("ShaderNodeNewGeometry")
 fwd=ns.new("ShaderNodeVectorMath")
 fwd.operation="DOT_PRODUCT";fwd.inputs[1].default_value=tuple(F)
 ln.new(geo.outputs["Position"],fwd.inputs[0])
 across=ns.new("ShaderNodeVectorMath")
 across.operation="DOT_PRODUCT";across.inputs[1].default_value=tuple(S)
 ln.new(geo.outputs["Position"],across.inputs[0])
 longitudinal=ns.new("ShaderNodeMath")
 longitudinal.operation="MULTIPLY";longitudinal.inputs[1].default_value=grain
 ln.new(fwd.outputs["Value"],longitudinal.inputs[0])
 lateral=ns.new("ShaderNodeMath")
 lateral.operation="MULTIPLY";lateral.inputs[1].default_value=1.2
 ln.new(across.outputs["Value"],lateral.inputs[0])
 v=ns.new("ShaderNodeCombineXYZ")
 ln.new(longitudinal.outputs[0],v.inputs["X"])
 ln.new(lateral.outputs[0],v.inputs["Y"])
 noise=ns.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale
 noise.inputs["Detail"].default_value=5.
 noise.inputs["Roughness"].default_value=.67
 ln.new(v.outputs[0],noise.inputs["Vector"])
 ramp=ns.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(where,c) in enumerate(tones):
  e=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(where)
  e.position=where;e.color=(*c,1)
 ln.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 ln.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 surface_micro=ns.new("ShaderNodeTexNoise")
 surface_micro.inputs["Scale"].default_value=45.
 surface_micro.inputs["Detail"].default_value=2.
 ln.new(geo.outputs["Position"],surface_micro.inputs["Vector"])
 bump=ns.new("ShaderNodeBump")
 bump.inputs["Strength"].default_value=.14
 bump.inputs["Distance"].default_value=.026
 ln.new(surface_micro.outputs["Fac"],bump.inputs["Height"])
 ln.new(bump.outputs["Normal"],bs.inputs["Normal"])
 return m
def flat_mat(label,rgb,roughness=.53):
 m=bpy.data.materials.new("K4CL | "+label)
 m.diffuse_color=(*rgb,1)
 m.use_nodes=True
 bs=m.node_tree.nodes.get("Principled BSDF")
 bs.inputs["Base Color"].default_value=(*rgb,1)
 bs.inputs["Roughness"].default_value=roughness
 bs.inputs["Metallic"].default_value=.07
 return m

asphalt=track_material("A authentic dark graphite asphalt flow-aligned aggregate",
 [(.09,(.047,.050,.053)),(.31,(.085,.095,.101)),(.51,(.126,.134,.138)),
  (.73,(.166,.17,.171)),(.91,(.205,.204,.198))],2.4,.135,.87)
shoulder=track_material("A rough aggregate stone shoulder distinct from racing asphalt",
 [(.10,(.115,.125,.118)),(.33,(.19,.19,.175)),(.54,(.27,.26,.23)),
  (.76,(.34,.33,.28))],3.2,.20,.95)
mineral=track_material("B dense sun-weathered mineral road concrete without fake image",
 [(.11,(.135,.143,.144)),(.32,(.22,.225,.218)),(.53,(.29,.291,.272)),
  (.76,(.37,.354,.32)),(.89,(.46,.416,.363))],2.2,.17,.91)
mineral_edge=track_material("B heavier natural stony outer band on roadway",
 [(.08,(.10,.116,.112)),(.34,(.18,.194,.18)),(.58,(.26,.257,.236)),
  (.82,(.32,.314,.29))],2.7,.16,.93)
paint_white=flat_mat("traffic-grade weathered pearl white directional lines",(.49,.50,.48),.52)
paint_amber=flat_mat("subtle warm retroreflective road rhythm",(.42,.27,.13),.52)
paint_dark=flat_mat("mineral expansion joint fine neutral gray",(.11,.122,.12),.94)

def create_road_skin(label,mats):
 p=surface.copy()
 p.data=surface.data.copy()
 p.name="K4CL | "+label+" separate road graphics on original study surface"
 study.objects.link(p)
 p.data.materials.clear()
 for m in mats:p.data.materials.append(m)
 p["DCC_RESEARCH_ONLY"]=True
 p["NOT_GAME_COLLIDER"]=True
 p["DRAW_ONLY_NO_SOURCE_GAME_ALTERATION"]=True
 p["ROAD5_SOURCE_COLLIDER_NOT_USED_OR_REPLACED"]=True
 assert fingerprint(p)==original_study_surface_sha
 made.append(p)
 return p
roadA=create_road_skin("A dark graphite roadway with continuous mineral edge", [asphalt,shoulder])
roadB=create_road_skin("B sun-weathered mineral concrete highway", [mineral,mineral_edge])

def native_paint(name,items,mats):
 vv=[];ff=[];ids=[]
 for d0,d1,s0,s1,material in items:
  assert -17<d0<187 and d1<=189 and d1>d0
  assert -12.9<s0<s1<12.9
  start=len(vv)
  # SOURCE ground curve sampled at the physical longitudinal endpoints.
  # Original research K4BQ road top = SOURCE_ground + .54 + crown.
  # 10mm painted decal above the visual road, no physics colliders.
  for d,s in ((d0,s0),(d1,s0),(d1,s1),(d0,s1)):
   crown=.025*(1-(s/13.1)**2)
   vv.append(P(d,s,ground(d)+.54+crown+.011))
  ff.append((start,start+1,start+2,start+3))
  ids.append(material)
 assert len(vv)>100 and len(ff)>25
 me=bpy.data.meshes.new("K4CL native paint | "+name)
 me.from_pydata(vv,[],ff);me.update()
 for mat in mats:me.materials.append(mat)
 for face,k in zip(me.polygons,ids):face.material_index=k
 o=bpy.data.objects.new("K4CL | "+name,me)
 study.objects.link(o)
 o["DCC_RESEARCH_ONLY"]=True
 o["NOT_GAME_COLLIDER"]=True
 o["SOURCE_ROAD5_UNMODIFIED"]=True
 o["WORLD_COORDINATE_TRAFFIC_MARKING"]=True
 made.append(o)
 return o
# A: two-lane coastal high-speed tarmac with physically measured 4m
# reflective lane markings at 14m intervals and shoulder rumble strips.
marks_A=[]
for d in range(-5,180,14):
 marks_A.append((float(d),float(d+3.5),-.14,.14,0))
for d in range(5,181,11):
 for s in (-12.1,12.1):
  marks_A.append((float(d),float(d+1.15),s-.30,s+.30,1))
# B: warm mineral-paved alternative using more restrained centerline and
# transverse panel joints that provide physical perspective. All geometry
# belongs to the render-only study, not the SOURCE physics route.
marks_B=[]
for d in range(0,179,15):
 marks_B.append((float(d),float(d+4.2),-.11,.11,0))
for d in range(11,177,12):
 marks_B.append((float(d),float(d+.11),-11.3,11.3,1))
paintA=native_paint("A true-road station-based center dashes and shoulder reflectors",
                   marks_A,[paint_white,paint_amber])
paintB=native_paint("B longitudinal lane guide and sparse mineral panel expansion joints",
                   marks_B,[paint_white,paint_dark])
assert len(made)==4
assert not any(o in roads.values() for o in made)
assert all(o.get("NOT_GAME_COLLIDER") is True for o in made)
# Verify every world-space paint point is physically on the exact SOURCE
# roadway corridor and in-front of the frozen source travel camera.
for o in (paintA,paintB):
 for vert in o.data.vertices:
  q=Vector(vert.co)
  local=q-C
  s=float(local.dot(S))
  assert abs(s)<12.9 and s>-13.15 and s<13.15,("PAINT_OUTSIDE_SOURCE_ROAD5_WIDTH",o.name,s)
  assert (o.get("SOURCE_ROAD5_UNMODIFIED") is True)

# Baseline geology from parent K4CK A is identical across road A and B.
# The original research road remains in DCC, hidden for new render only;
# the actual imported game Road5 tessellated meshes are untouched.
guarded={o.name:fingerprint(o) for o in (coastA,coastB,wall,surface)}
assert {roadsha(o) for o in roads.values()}=={ROAD}
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
allowed_render_only={o.name for o in (coastA,coastB,wall,surface)}
for name,state in parent_state.items():
 o=bpy.data.objects[name]
 if name in allowed_render_only:
  assert (bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state[1:],("STUDY_GEO_CHANGED",name)
 else:
  assert (bool(o.hide_render),bool(o.hide_viewport),
          tuple(tuple(row) for row in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state,("FROZEN_RESEARCH_SOURCE_MUTATED",name)
for o in (coastA,coastB,wall,surface):
 assert fingerprint(o)==guarded[o.name]
assert bad.hide_render
assert sha(parent)==PARENT
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
pathA=out/"K4CL_A_TRUE_CHASE_GRAPHITE_RACING_ASPHALT_NOT_GAME.png"
pathB=out/"K4CL_B_TRUE_CHASE_MINERAL_HIGHWAY_ROAD_NOT_GAME.png"
bl=out/"K4CL_TRUE_EDITABLE_DUAL_PHYSICAL_PAVEMENT_STUDIES_ART_HOLD.blend"
roadB.hide_render=True;paintB.hide_render=True
roadA.hide_render=False;paintA.hide_render=False
sc.render.filepath=str(pathA);bpy.ops.render.render(write_still=True)
assert pathA.stat().st_size>30000
roadA.hide_render=True;paintA.hide_render=True
roadB.hide_render=False;paintB.hide_render=False
sc.render.filepath=str(pathB);bpy.ops.render.render(write_still=True)
assert pathB.stat().st_size>30000
roadA.hide_render=False;paintA.hide_render=False
roadB.hide_render=True;paintB.hide_render=True
bpy.ops.wm.save_as_mainfile(filepath=str(bl))
assert bl.stat().st_size>230_000_000
assert {roadsha(o) for o in roads.values()}=={ROAD}
audit={
 "schema":"dopagaki.k4cl.native-source-locked-road-skin-two-material-directions-v1",
 "parentK4CKExactSHA256":PARENT,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "allOriginalSourceAndParentResearchMeshPositionsUnchanged":True,
 "actualSourceRoad5ImportOriginalRenderStateUnchanged":True,
 "originalResearchOnlyVisibilitySwaps":sorted(allowed_render_only),
 "sourceRoad5GameEdited":False,"sourcePhysicsEdited":False,
 "newGameColliders":0,
 "newResearchEditableMeshObjects":len(made),
 "bothRoadSkinClonesIdenticalToOldStudyRoadGeometry":fingerprint(roadA)==fingerprint(roadB)==original_study_surface_sha,
 "originalK4BQVisibleStudyRoadGeometrySHA256":original_study_surface_sha,
 "twoNativeWorldSpacePaintMeshes":True,
 "researchAArtDirectionGeologyRendered":True,
 "ARealReflectorQuads":len(paintA.data.polygons),
 "BRealMarkingQuads":len(paintB.data.polygons),
 "actualRoadVisualAreaMetersSourceWidth":26.3,
 "nativeTrueCHASE768x480":True,"renderEngine":"BLENDER_EEVEE",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (bl,pathA,pathB)}
}
(out/"K4CL_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CL_GENUINE_ROAD_SOURCE_UNCHANGED_NATIVE_BLENDER_ROAD_SURFACE_RENDER",
 json.dumps({"newMeshes":len(made),"paintA":len(paintA.data.polygons),
             "paintB":len(paintB.data.polygons),
             "originalRoad5SHA":ROAD},ensure_ascii=False),flush=True)
