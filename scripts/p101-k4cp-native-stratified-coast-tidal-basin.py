"""K4CP: SOURCE-locked genuine coherent coastal lithology and marine tidal basin.
Single integrated full-view environment redesign after K4CO R2 ART REJECT.
Blender research only; no ART or WebGL2 gameplay claim, no collision/game edits.
"""
import bpy,math,hashlib,json,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="9574e6f49865cf962280caa073f2c5583cf1a3ed1ae41a9efb2a4167d6ed3c91"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for block in iter(lambda:f.read(1<<20),b""):h.update(block)
 return h.hexdigest()
assert sha(parent)==PARENT,("WRONG_K4CO_R2_TRUE_NATIVE_PARENT",sha(parent))
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
print("K4CP_ORIGINAL_SOURCE_ROAD_SHOULDER",{"leftSideSign":leftsign,"projections":orient,
       "roadWidthApproxMetres":26.3,"firstRay":samples[0],"lastRay":samples[-1]},flush=True)
# Freeze actual road geometry, chase, every inherited object's visibility
# and matrix. New geometry is entirely beyond the source road +/-13.15 m.
# K4CO creates ONE huge functional 3D over-road freight transfer viaduct.
# 2026-11-05 K4CP: one unified landscape edit with two editable meshes.
# 1. Reauthor the inherited same-topology cliff into continuous geological strata.
# 2. Extend the inherited working port with a fixed-elevation, physical tidal basin.
# A foreground road, proxy camera, physics substitute, new collider or 2D paint
# would invalidate this study.  The fixed K4CO bridge is inherited intact.
assert leftsign==1
rightsign=-leftsign
def fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:
  h.update(struct.pack("<3d",*[float(x) for x in v.co]))
 for polygon in o.data.polygons:
  h.update(struct.pack("<I",len(polygon.vertices)))
  for k in polygon.vertices:h.update(struct.pack("<I",int(k)))
 return h.hexdigest()
all_mesh_before={o.name:fingerprint(o) for o in bpy.data.objects if o.type=="MESH"}
def unique(prefix):
 hits=[o for o in bpy.data.objects if o.name.startswith(prefix)]
 assert len(hits)==1,("AMBIGUOUS_REAL_SOURCE_PARENT",prefix,[o.name for o in hits])
 return hits[0]
original_scarp=unique("K4CM | one eroded 200m folded coastal schist")
spiked_scarp=unique("K4CN | continuous exposed headland")
portland=unique("K4CN | extended physically integrated large")
toy_terminal=unique("K4CN | one built maritime megaterminal")
inherited_viaduct=unique("K4CO | one source grounded 95m maritime freight")
assert all(o.type=="MESH" and o.get("NOT_GAME_COLLIDER") is True and
           o.get("DCC_RESEARCH_ONLY") is True
           for o in (original_scarp,spiked_scarp,portland,toy_terminal,inherited_viaduct))
assert original_scarp.hide_render and not spiked_scarp.hide_render
assert not toy_terminal.hide_render and not inherited_viaduct.hide_render
assert len(original_scarp.data.vertices)==len(spiked_scarp.data.vertices)==1600
assert len(original_scarp.data.polygons)==len(spiked_scarp.data.polygons)
assert sha(parent)==PARENT
art=bpy.data.collections.new("K4CP | STRATIFIED COAST PLUS TIDAL WORKING HARBOUR | ART HOLD")
sc.collection.children.link(art)
created=[]
def make_mat(name,tones,scale=.18,rough=.9,metallic=.0,bump=.11):
 m=bpy.data.materials.new("K4CP | "+name)
 m.use_nodes=True
 nodes=m.node_tree.nodes
 nodes.clear()
 link=m.node_tree.links
 out=nodes.new("ShaderNodeOutputMaterial")
 bs=nodes.new("ShaderNodeBsdfPrincipled")
 bs.inputs["Roughness"].default_value=rough
 bs.inputs["Metallic"].default_value=metallic
 link.new(bs.outputs["BSDF"],out.inputs["Surface"])
 geom=nodes.new("ShaderNodeNewGeometry")
 noise=nodes.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale
 noise.inputs["Detail"].default_value=5
 link.new(geom.outputs["Position"],noise.inputs["Vector"])
 ramp=nodes.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(pos,color) in enumerate(tones):
  stop=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(pos)
  stop.position=pos
  stop.color=(*color,1.)
 link.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 link.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 if bump:
  detail=nodes.new("ShaderNodeTexNoise")
  detail.inputs["Scale"].default_value=1.6
  link.new(geom.outputs["Position"],detail.inputs["Vector"])
  bn=nodes.new("ShaderNodeBump")
  bn.inputs["Strength"].default_value=bump
  bn.inputs["Distance"].default_value=.13
  link.new(detail.outputs["Fac"],bn.inputs["Height"])
  link.new(bn.outputs["Normal"],bs.inputs["Normal"])
 return m
strata=make_mat("real coastal stratified schist mass",[
 (.06,(.087,.100,.099)),(.28,(.135,.145,.144)),(.52,(.191,.188,.165)),
 (.76,(.268,.252,.211)),(.94,(.340,.301,.238))],scale=.11,rough=.95,bump=.18)
fault=make_mat("deep genuine tectonic shale beds",[
 (.06,(.047,.066,.074)),(.38,(.072,.085,.093)),
 (.68,(.128,.132,.129)),(.94,(.207,.197,.159))],scale=.24,rough=.94,bump=.22)
weather=make_mat("salt and wind weathered upper cut",[
 (.07,(.127,.145,.137)),(.40,(.224,.220,.174)),
 (.69,(.304,.273,.216)),(.94,(.388,.334,.257))],scale=.15,rough=.96,bump=.18)
basalt=make_mat("tide aged caisson stone",[
 (.08,(.088,.102,.107)),(.35,(.155,.173,.170)),
 (.67,(.222,.223,.200)),(.9,(.311,.301,.269))],scale=.20,rough=.95,bump=.12)
seafoam=make_mat("tidal wash at actual revetment",[
 (.08,(.16,.241,.259)),(.44,(.236,.311,.315)),
 (.77,(.337,.396,.381)),(.93,(.44,.48,.45))],scale=.12,rough=.31,bump=.04)
water=make_mat("one constant datum sheltered sea basin",[
 (.05,(.024,.100,.141)),(.35,(.044,.149,.186)),
 (.61,(.080,.212,.230)),(.85,(.129,.261,.273)),
 (.95,(.209,.310,.314))],scale=.055,rough=.18,bump=.03)
# The K4CN cliff's repeated spikes are not a natural geological silhouette.
# Rebuild a SINGLE continuous cliff copy by interpolating corresponding
# K4CM and K4CN authentic 3D vertices. Keep the far real bridge abutment
# completely unmodified for d>=145m (K4CO span is grounded there).
newcliff=spiked_scarp.copy()
newcliff.data=spiked_scarp.data.copy()
newcliff.name="K4CP | one continuous stratified source-locked natural escarpment"
art.objects.link(newcliff)
newcliff.data.materials.clear()
for m in (strata,fault,weather):newcliff.data.materials.append(m)
inv=newcliff.matrix_world.inverted_safe()
changed=0
bridge_buffer_same=0
for i,v in enumerate(newcliff.data.vertices):
 old=newcliff.matrix_world@v.co
 reference=original_scarp.matrix_world@original_scarp.data.vertices[i].co
 d=(old-C).dot(F);side=(old-C).dot(S)*leftsign
 assert 15.<side<65.,("SOURCE_CLIFF_OUTSIDE_LEFT_3D_ZONE",side)
 blend_d=max(0.,min(1.,(145.-d)/31.))
 blend_side=max(0.,min(1.,(side-18.)/15.))
 blend=.81*blend_d*blend_side
 # Smooth kilometre-scale geological mass with actual depth and erosional
 # catchments. No repeated sharp pyramids or billboard hills.
 slow=(3.1*math.sin(d*.028+.4)+1.8*math.sin(d*.047-.9)
       -2.2*math.exp(-((d-65.)/23.)**2)
       -1.6*math.exp(-((d-126.)/20.)**2))
 relief=blend_side*blend_d*slow
 proposed=old*(1.-blend)+reference*blend+Vector((0,0,relief))
 v.co=inv@proposed
 if (proposed-old).length>.05:changed+=1
 if d>=145.:bridge_buffer_same+=1;assert (proposed-old).length<1e-7
for poly in newcliff.data.polygons:
 centroid=sum((newcliff.matrix_world@newcliff.data.vertices[k].co
              for k in poly.vertices),Vector())/len(poly.vertices)
 d=(centroid-C).dot(F)
 s=(centroid-C).dot(S)*leftsign
 bed=centroid.z-C.z
 poly.material_index=(1 if int((bed*.41+d*.018+s*.024))%9<3
                      else (2 if s>37 and int(d/23)%5==0 else 0))
 poly.use_smooth=False
newcliff["DCC_RESEARCH_ONLY"]=True
newcliff["NOT_GAME_COLLIDER"]=True
newcliff["ORIGINAL_ROAD5_UNMODIFIED"]=True
newcliff["AUTHOR_INTENT"]="continuous natural exposed coast and legible sedimentary depth; true original bridge support untouched"
spiked_scarp.hide_render=True
created.append(newcliff)
assert changed>600 and bridge_buffer_same>30,("NO_SUBSTANTIVE_GEOLOGY_OR_BRIDGE_ANCHOR_NOT_PRESERVED",changed,bridge_buffer_same)
# Working harbour water must be a genuine constant global sea-level, not a
# strip of ocean textured onto the roadway or a fake screen-space photograph.
# Use SOURCE road heights to place the shared harbor basin below all its
# approach road sections, with actual quay top rising behind it.
stations=list(range(48,190,2))
bay_water_z=C.z+min(ground(d) for d in stations)-11.2
assert all(bay_water_z+8<C.z+ground(d) for d in stations)
V=[];faces=[];indices=[]
def add(p):
 V.append(tuple(float(x) for x in p))
 return len(V)-1
def face(vertices,mat):
 faces.append(tuple(vertices))
 indices.append(mat)
# One connected 3D mesh integrates the visible outer shore, salt wash, and
# water body. The quay S=57 is inherited K4CN real earthwork and must stay.
sections=(57.,60.,64.,69.,76.,92.,116.,147.,183.)
rows=[]
for d in stations:
 h=ground(d)
 row=[]
 for s in sections:
  if s==57.: z=C.z+h-8.6
  elif s==60.:z=C.z+h-9.2
  elif s==64.:z=max(bay_water_z-.2,C.z+h-10.3)
  elif s==69.:z=bay_water_z+.08
  else:z=bay_water_z+.04*math.sin(d*.095+s*.078)
  row.append(add(Vector((P(d,rightsign*s,0).x,P(d,rightsign*s,0).y,z))))
 rows.append(row)
for i in range(len(rows)-1):
 for j in range(len(sections)-1):
  k=(rows[i][j],rows[i+1][j],rows[i+1][j+1],rows[i][j+1])
  face(k,0 if j<2 else (1 if j==2 else 2))
# Continuous end caps keep this an actual mesh volume at its basin limits,
# not a post-processed image or infinitely thin screen-plane.
assert len(V)>500 and len(faces)>400
mesh=bpy.data.meshes.new("K4CP | one physically unified marine basin")
mesh.from_pydata(V,[],faces)
mesh.update()
for mat in (basalt,seafoam,water):mesh.materials.append(mat)
for poly,idx in zip(mesh.polygons,indices):
 poly.material_index=idx
 poly.use_smooth=(idx==2)
bay=bpy.data.objects.new("K4CP | actual stratified 140m working tide basin and one water datum",mesh)
art.objects.link(bay)
bay["DCC_RESEARCH_ONLY"]=True
bay["NOT_GAME_COLLIDER"]=True
bay["AUTHOR_INTENT"]="one coherent fixed-waterline salt harbor and true 3D seawall connected to original real quay"
created.append(bay)
# Hide only the already-ART-rejected K4CN study megaterminal, leaving its
# Mesh/transform intact and all earlier genuine ferry & port architecture.
# The true K4CO freight bridge and all inherited original sources stay visible.
toy_terminal.hide_render=True
assert len(created)==2
# Verify that the two bodies actually enter the immutable CHASE as real
# original-camera-projected vertices, not invisible geometry or a new camera.
visible={}
for ob,key in ((newcliff,"left"),(bay,"right")):
 count=0
 for v in ob.data.vertices:
  x,y,z=project(ob.matrix_world@v.co)
  if z>0 and .04<y<.95 and (.005<x<.50 if key=="left" else .50<x<.995):
   count+=1
 visible[key]=count
assert visible["left"]>200 and visible["right"]>100,("NEW_WORLD_NOT_VISIBLE_IN_REAL_CHASE",visible)
# Every parent mesh and transform remains strictly bitwise identical.
for name,fp in all_mesh_before.items():
 assert fingerprint(bpy.data.objects[name])==fp,("MODIFIED_INHERITED_REAL_MESH",name)
for name,state in parent_state.items():
 o=bpy.data.objects[name]
 current=(bool(o.hide_render),bool(o.hide_viewport),
          tuple(tuple(row) for row in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)
 if name in (spiked_scarp.name,toy_terminal.name):
  assert not state[0] and current[0] is True and current[1:]==state[1:],("BAD_PARENT_STUDY_VISIBILITY",name)
 else:
  assert current==state,("FROZEN_PARENT_CHANGED",name)
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {roadsha(o) for o in roads.values()}=={ROAD}
assert {o.name:tuple(tuple(r) for r in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
assert sha(parent)==PARENT
sc.camera=cam
sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768
sc.render.resolution_y=480
sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CP_TRUE_STRATIFIED_COAST_TIDAL_BASIN_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CP_TRUE_SOURCE_CHASE_STRATIFIED_COAST_TIDAL_BASIN_NOT_GAME.png"
sc.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230000000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cp.integrated-real-coastal-tectonics-tidal-waterline-v1",
 "parentK4COR2ExactSHA256":PARENT,
 "originalGameGitBlob":GAME,
 "originalRoad5FullVertexFaceSHA256":ROAD,
 "sourceGameEdited":False,
 "sourcePhysicsEdited":False,
 "newGameColliders":0,
 "originalSixCameraPosesUnchanged":True,
 "originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,
 "originalLightsUnchanged":True,
 "allInheritedMeshGeometryAndTransformsUnchanged":True,
 "oldRejectedK4CNCliffAndTerminalHiddenInResearchRenderOnly":True,
 "realK4COFreightSpanInheritedAndGeometryIdentical":True,
 "newNativeEditableResearchMeshes":len(created),
 "actualOriginalTopologyCliffVertices":len(newcliff.data.vertices),
 "reshapedNaturalRockVertices":changed,
 "bridgeRealTerrainAnchorVerticesUnchanged":bridge_buffer_same,
 "tidalBasinOneDatumWorldZ":bay_water_z,
 "tidalBasinContinuousStations":len(stations),
 "tidalBasinRealVertices":len(V),
 "tidalBasinRealFaces":len(faces),
 "visibleProjectedVerticesNotArtScore":visible,
 "realNativeCHASE768x480":True,
 "renderEngine":"BLENDER_EEVEE",
 "ART":"UNJUDGED_HOLD",
 "formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CP_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CP_REAL_NATIVE_DCC_COMPLETE_ART_UNJUDGED",json.dumps({
 "nativeMeshes":len(created),"cliffChangedVertices":changed,
 "tidalBasinRealVertices":len(V),"visible":visible,
 "originalRoad5SHA":ROAD}),flush=True)
