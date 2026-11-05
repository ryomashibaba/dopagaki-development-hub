"""K4CJ – actual Blender world-space source Road5 shoulder and coastal cut.

ART FIRST, not a screenshot, not a new game collider. Source world:
original camera 11307 and ORIGINAL Road5 CONTROL mesh supply station height,
road width and travel tangent. One continuous physically authored 3D cut and
one linked storm-windbreak: world-space depth rhythm with a frozen CHASE.
All inherited geometry, cameras, sources and rendering remain unchanged.
"""
import bpy,math,hashlib,json,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="f1ce87fff6c88841890b6fc2dd4840db4b35a86be75236d90c02613a26ac7bb4"
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
print("K4CJ_LEFT_ROAD_SHOULDER_FROM_SOURCE",{"leftSideSign":leftsign,"projections":orient,
       "roadWidthApproxMetres":26.3,"firstRay":samples[0],"lastRay":samples[-1]},flush=True)
# Freeze actual road geometry, chase, every inherited object's visibility
# and matrix. New geometry is entirely beyond the source road +/-13.15 m.
coll=bpy.data.collections.new("K4CJ | coherent real coastal roadcut and windbreak depth | ART HOLD")
sc.collection.children.link(coll)
made=[]
def newobj(name,vs,fs,materials,face_mats,role):
 me=bpy.data.meshes.new("K4CJ native | "+name)
 me.from_pydata([tuple(p) for p in vs],[],fs)
 me.update()
 ob=bpy.data.objects.new("K4CJ | "+name,me)
 coll.objects.link(ob)
 for m in materials:me.materials.append(m)
 assert len(me.polygons)==len(face_mats)
 for poly,k in zip(me.polygons,face_mats):
  poly.material_index=k
  poly.use_smooth=False
 ob["DCC_RESEARCH_ONLY"]=True
 ob["NOT_GAME_COLLIDER"]=True
 ob["REAL_RACE_WORLD_FUNCTION"]=role
 ob["FROZEN_ORIGINAL_ROAD5_NOT_MODIFIED"]=True
 made.append(ob)
 return ob
def mat(label,colors,scale,rough=.89,metal=0.,bump=.18):
 m=bpy.data.materials.new("K4CJ | "+label)
 m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();ln=m.node_tree.links
 output=ns.new("ShaderNodeOutputMaterial")
 shader=ns.new("ShaderNodeBsdfPrincipled")
 shader.inputs["Roughness"].default_value=rough
 shader.inputs["Metallic"].default_value=metal
 ln.new(shader.outputs["BSDF"],output.inputs["Surface"])
 geo=ns.new("ShaderNodeNewGeometry")
 noise=ns.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale
 noise.inputs["Detail"].default_value=4.
 noise.inputs["Roughness"].default_value=.61
 ln.new(geo.outputs["Position"],noise.inputs["Vector"])
 ramp=ns.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(at,color) in enumerate(colors):
  e=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(at)
  e.position=at;e.color=(*color,1)
 ln.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 ln.new(ramp.outputs["Color"],shader.inputs["Base Color"])
 finer=ns.new("ShaderNodeTexNoise")
 finer.inputs["Scale"].default_value=2.8
 finer.inputs["Detail"].default_value=3.
 ln.new(geo.outputs["Position"],finer.inputs["Vector"])
 bumpnode=ns.new("ShaderNodeBump")
 bumpnode.inputs["Strength"].default_value=bump
 bumpnode.inputs["Distance"].default_value=.13
 ln.new(finer.outputs["Fac"],bumpnode.inputs["Height"])
 ln.new(bumpnode.outputs["Normal"],shader.inputs["Normal"])
 return m
schist=mat("dark marine schist fractured by natural coastal uplift",
           [(.13,(.042,.054,.057)),(.29,(.081,.099,.105)),(.48,(.13,.145,.15)),
            (.67,(.19,.201,.194)),(.88,(.26,.26,.245))],.18)
weather=mat("weathered low-contrast broken-grey mineral crest",
            [(.13,(.07,.082,.086)),(.33,(.115,.12,.123)),(.50,(.17,.175,.17)),
             (.71,(.24,.243,.22)),(.85,(.31,.29,.26))],.15,.90,0.,.10)
joint=mat("dark real fracture seam between shore bedrock scales",
          [(.14,(.035,.047,.048)),(.48,(.12,.14,.14)),(.84,(.22,.23,.22))],.33,.92,0.,.10)
steel=mat("marine galvanized roadcut wind-shield structure",
          [(.14,(.13,.19,.20)),(.50,(.23,.30,.31)),(.84,(.39,.43,.42))],.24,.61,.47,.045)
bronze=mat("muted coastal navigation rhythm embedded in windbreak",
           [(.14,(.20,.15,.09)),(.50,(.34,.25,.15)),(.84,(.48,.35,.19))],.22,.72,.40,.055)

# The R1 actual CHASE showed a new grey cut but the preexisting foreground
# rock remained unnaturally bright/soft and visually disconnected. R2 preserves
# the original research rock geometry, replacing only the study render layer
# with separate, editable tonal-matched shale copies. Real game/source art,
# Camera, Road5 and all other parent research objects remain frozen.
backing_prefixes=("K4CH | true broken coastal bedrock and fractured road cut",
                  "K4CH | connected same-basalt coastal ground beneath headland")
replaced_research=[]
new_rock_layers=[]
for prefix in backing_prefixes:
 matches=[o for o in bpy.data.objects if o.name.startswith(prefix)]
 assert len(matches)==1,("VISIBLE_ROCK_RESEARCH_PARENT_MISSING_OR_DUPLICATED",prefix,[o.name for o in matches])
 source=matches[0]
 assert source.type=="MESH" and not source.hide_render
 assert source.get("DCC_RESEARCH_ONLY") is True and source.get("NOT_GAME_COLLIDER") is True
 copy=source.copy();copy.data=source.data.copy()
 copy.name="K4CJ | same-source shale rock non-destructive "+str(len(new_rock_layers))
 coll.objects.link(copy)
 copy.data.materials.clear()
 copy.data.materials.append(schist if not new_rock_layers else weather)
 copy["DCC_RESEARCH_ONLY"]=True
 copy["NOT_GAME_COLLIDER"]=True
 copy["REAL_RACE_WORLD_FUNCTION"]="UNIFIED_NATURAL_EXISTING_LEFT_ROCK_NOT_GAME_ORIGINAL"
 made.append(copy)
 source.hide_render=True
 replaced_research.append(source)
 new_rock_layers.append(copy)


# A continuous actual granite/schist longitudinal cut. Source original road
# spans +/-13.15 m, and source existing topography starts at +/-16.4 m.
# Lateral section progresses from the original public shoulder into cliffs.
# This is not an image, nor a flat wall or rows of floating rocks.
cross=((16.65,.48),(17.5,.65),(18.7,1.85),(20.0,3.8),
       (22.3,5.9),(25.2,7.2),(28.3,8.45),
       (32.0,8.05),(36.4,7.15),(42.4,6.0),(47.,6.4))
stations=list(range(-12,187,2))
assert len(stations)>80 and len(cross)>9
rock_v=[];rock_f=[];rock_mat=[]
seen=0;max_proj=-1.;min_real_lateral=1e9
for i,d in enumerate(stations):
 for j,(side,base_h) in enumerate(cross):
  worldside=leftsign*side
  min_real_lateral=min(min_real_lateral,abs(worldside))
  base=ground(d)
  large=.82*math.sin(.058*d+.9)+.47*math.sin(.163*d+.53*j)
  seam=.25*math.sin(d*.32+j*1.53)+.14*math.cos(d*.47-j*1.1)
  # No repeating Gaussian cones; use naturally nonuniform long fractured beds.
  h=base_h+(large+seam)*(.08 if j<2 else .57)
  p=P(d,worldside,base+h)
  x,y,z=project(p)
  if z>0 and -.04<y<1.07:
   max_proj=max(max_proj,x)
   assert x<.49,("K4CJ_STONE_PROTRUDES_INTO_FROZEN_ROAD_VIEW",d,j,x,y)
   if 0<x<.5 and 0<y<1:seen+=1
  rock_v.append(p)
stride=len(cross)
for i in range(len(stations)-1):
 for j in range(stride-1):
  a=i*stride+j
  b=(i+1)*stride+j
  # Diagonally broken large natural rock planes show geologic mass in
  # actual EEVEE light, not generic smoothing / color-only art.
  if (i*7+j*11)%5<2:
   polys=((a,b,b+1),(a,b+1,a+1))
  else:polys=((a,b,a+1),(b,b+1,a+1))
  rock_f.extend(polys)
  k=0 if j<5 else (1 if j>7 else 2)
  rock_mat.extend((k,k))
assert seen>100 and len(rock_v)>850 and len(rock_f)>1600
cliff=newobj("single true world-roadcut coastal rock section, 198m",
             rock_v,rock_f,[schist,weather,joint],rock_mat,
             "CONTINUOUS_ROAD_FACING_GEOLOGICAL_CUT_WITH_NATIVE_SHOULDER_ELEVATION")
# Rhythm: one real-world connected windbreak assembly integrated into the
# cut. Inherited rock remains behind it; modules are massive load-bearing
# ribs every ~19m, not dozens of unrelated billboard props.
wind_v=[];wind_f=[];wind_mat=[]
def block(q,material=0):
 # q = eight world-space 3D corners, exterior faces / actual volume
 assert len(q)==8
 off=len(wind_v);wind_v.extend(q)
 for f in ((0,1,2,3),(4,7,6,5),(0,4,5,1),
           (1,5,6,2),(2,6,7,3),(3,7,4,0)):
  wind_f.append(tuple(off+k for k in f));wind_mat.append(material)
def thickbeam(a,b,width=.35,depth=.35,material=0):
 a=Vector(a);b=Vector(b)
 axis=(b-a).normalized()
 ref=Vector((0,0,1)) if abs(axis.z)<.88 else S
 side=axis.cross(ref).normalized()
 up=axis.cross(side).normalized()
 x=side*width*.5;y=up*depth*.5
 block((a-x-y,a+x-y,a+x+y,a-x+y,
        b-x-y,b+x-y,b+x+y,b-x+y),material)
rib_ds=list(range(33,187,17))
for index,d in enumerate(rib_ds):
 h=ground(d)
 # physical fin rooted into the geological cut, not a freestanding pylon
 origin=P(d,leftsign*19.5,h+2.1)
 top=P(d+1.2,leftsign*22.4,h+9.4+.8*math.sin(index*1.41))
 heel=P(d-1.2,leftsign*25.1,h+6.9)
 thickbeam(origin,top,.72,1.10,0)
 thickbeam(top,heel,.61,.80,0)
 thickbeam(origin,heel,.54,.75,0)
 # It is a windbreak with a real continuous top sight line / perspective,
 # not a line drawn in post-processing.
 thickbeam(P(d,leftsign*19.1,h+3.75),
           P(d+2.9,leftsign*19.1,ground(d+2.9)+3.75),.26,.38,1)
# One long coherent upper windbreak cap linked to all smaller elements.
for a,b in zip(rib_ds,rib_ds[1:]):
 start=P(a,leftsign*20.7,ground(a)+6.7)
 end=P(b,leftsign*20.7,ground(b)+6.7)
 thickbeam(start,end,.18,.33,0)
# Triangular industrial protection material inset, no road collider.
assert len(wind_v)>350 and len(wind_f)>260
wind=newobj("one linked marine windbreak and geological buttress rhythm",
            wind_v,wind_f,[steel,bronze],wind_mat,
            "WORLD_GEOMETRY_SPEED_RHYTHM_VISIBLE_ALONG_SOURCE_ROAD5_NOT_A_COLLIDER")
# Direct camera/world safety of every windbreak prism corner, including
# parts near the existing Road5 left edge.
visible_wind=0;max_wind_x=-1.
for v in wind_v:
 x,y,z=project(v)
 if z>0 and -.03<y<1.06:
  max_wind_x=max(max_wind_x,x)
  assert x<.49,("K4CJ_WIND_SHIELD_ENTERED_ROADWAY_VIEW",x,y)
  if 0<x<.5 and 0<y<1:visible_wind+=1
assert visible_wind>30 and min_real_lateral>16.4
assert all(o.get("NOT_GAME_COLLIDER") is True for o in (cliff,wind))
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {roadsha(o) for o in roads.values()}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
research_only_swaps={ob.name for ob in replaced_research}
for name,state in parent_state.items():
 ob=bpy.data.objects[name]
 if name in research_only_swaps:
  assert ob.hide_render and not state[0],("SOURCE_RESEARCH_LAYER_NOT_HIDDEN",name)
  assert (bool(ob.hide_viewport),tuple(tuple(row) for row in ob.matrix_world),
          len(ob.data.vertices) if ob.type=="MESH" else -1)==state[1:]
 else:
  assert (bool(ob.hide_render),bool(ob.hide_viewport),
          tuple(tuple(row) for row in ob.matrix_world),
          len(ob.data.vertices) if ob.type=="MESH" else -1)==state,("FROZEN_DCC_SOURCE_MUTATED",name)
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CJ_SOURCE_ROAD5_CONTINUOUS_COAST_CUT_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CJ_TRUE_CHASE_ROAD_EDGE_SPEED_RHYTHM_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230000000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cj.true-source-road5-continuous-cut-windbreak-v1",
 "parentK4CIExactSHA256":PARENT,
 "originalGameGitBlob":GAME,
 "originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,
 "originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,
 "originalLightsUnchanged":True,
 "allInheritedSourceAndResearchGeometryIdentical":True,
 "nonDestructiveResearchRockRenderSwaps":[ob.name for ob in replaced_research],
 "sourceGameEdited":False,"sourcePhysicsEdited":False,
 "K4BZ_bad_duplicate_road_hidden":True,"newGameColliders":0,
 "trueResearchEditableMeshes":4,
 "actualReauthoredForegroundRockCopyCount":len(new_rock_layers),
 "actualRoadCutRealWorldVertices":len(cliff.data.vertices),
 "actualRoadCutRealWorldTriangleFaces":len(cliff.data.polygons),
 "actualRealWindbreakVertices":len(wind.data.vertices),
 "actualRealWindbreakFaces":len(wind.data.polygons),
 "realLongitudinalRoadCutStations":len(stations),
 "realIntegratedWindbreakBays":len(rib_ds),
 "windbreakStartsAfterSourceStationMetres":rib_ds[0],
 "roadOriginalApproxHalfWidthMetres":13.15,
 "minimumRoadCentreLateralDistanceOfNewCoastMetres":min_real_lateral,
 "leftSignFromRealFrozenCHASE":leftsign,
 "leftSignSourceCameraProjection":orient,
 "actualRoadcutCameraVisibleVertices":seen,
 "actualWindbreakCameraVisibleVertices":visible_wind,
 "maxVisibleNewRoadCutXNotArtScore":max_proj,
 "maxVisibleWindbreakXNotArtScore":max_wind_x,
 "renderEngine":"BLENDER_EEVEE","trueCHASE768x480":True,
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CJ_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CJ_SOURCE_ROAD5_WORLD_SCALE_GEOMETRY_REAL_NATIVE_RENDER_ART_HOLD",
      json.dumps({"originalSourceRoadWidth":26.3,"realCutStations":len(stations),
                  "realWindbreakBays":len(rib_ds),
                  "leftSign":leftsign,"realRockVertices":len(rock_v),
                  "realWindbreakVertices":len(wind_v),"visibleRock":seen},ensure_ascii=False),flush=True)
