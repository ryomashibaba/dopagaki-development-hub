"""K4CO: one source-grounded functional maritime freight transfer viaduct.
Continues the K4CN R2 ART REJECT; true 3D Blender research only. No gameplay claims.
Frozen original Road5, chase camera, 240Hz physics and complete K4CN parent.
"""
import bpy,math,hashlib,json,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="f66531d8596e67a19f4c6f2debcf2521efbae54d9fc5ac911f94963dd6a45156"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for block in iter(lambda:f.read(1<<20),b""):h.update(block)
 return h.hexdigest()
assert sha(parent)==PARENT,("WRONG_K4CN_R2_TRUE_NATIVE_PARENT",sha(parent))
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
print("K4CO_ORIGINAL_SOURCE_ROAD_SHOULDER",{"leftSideSign":leftsign,"projections":orient,
       "roadWidthApproxMetres":26.3,"firstRay":samples[0],"lastRay":samples[-1]},flush=True)
# Freeze actual road geometry, chase, every inherited object's visibility
# and matrix. New geometry is entirely beyond the source road +/-13.15 m.
# K4CO creates ONE huge functional 3D over-road freight transfer viaduct.
# This is a new editable research layer on the SHA-fixed K4CN R2 original,
# never a replacement road, physics change, image overlay or fake camera.
assert leftsign==1
rightsign=-leftsign
frozen_count=len(bpy.data.objects)
def mesh_digest(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in o.data.polygons:
  h.update(struct.pack("<I",len(p.vertices)))
  for q in p.vertices:h.update(struct.pack("<I",int(q)))
 return h.hexdigest()
before_mesh={o.name:mesh_digest(o) for o in bpy.data.objects if o.type=="MESH"}
def unique(prefix):
 matches=[o for o in bpy.data.objects if o.name.startswith(prefix)]
 assert len(matches)==1,("PARENT_K4CN_ART_MESH_AMBIGUOUS",prefix,[o.name for o in matches])
 return matches[0]
cliff=unique("K4CN | continuous exposed headland")
portland=unique("K4CN | extended physically integrated")
terminal=unique("K4CN | one built maritime megaterminal")
assert all(o.get("DCC_RESEARCH_ONLY") is True and o.get("NOT_GAME_COLLIDER") is True for o in (cliff,portland,terminal))
assert not cliff.hide_render and not portland.hide_render and not terminal.hide_render
# R1 genuine CHASE image put the 95m bridge shadow across 1,482 protected
# road pixels (independent maximum <120) and clipped the crown above frame.
# Translate the WHOLE actual 3D landmark farther along source Road5 while
# retaining true terrain-sourced abutments, road-ray clearance and the same
# original camera. Never relax image QA or patch pixels after rendering.
d_cross=154.
z_road=ground(d_cross)
# Read the genuinely existing Road5 across the complete crossing footprint,
# not merely its center point. A local 3D deck must clear the highest sampled
# native physical road triangle without editing or replacing that triangle.
real_road_clearance_samples=[]
for d_sample in (d_cross-4.6,d_cross,d_cross+4.6):
 for s_sample in (-11.0,0.,11.0):
  h=source_height(d_sample,s_sample)
  if h is not None:real_road_clearance_samples.append(h)
assert len(real_road_clearance_samples)>=6,("SOURCE_ROAD_CROSS_SECTION_UNVERIFIABLE",real_road_clearance_samples)
highest_source_road=max(real_road_clearance_samples)
def actual_anchor(o,side,target):
 pts=[o.matrix_world@v.co for v in o.data.vertices]
 assert len(pts)>700
 cands=sorted(pts,key=lambda p:((p-C).dot(F)-d_cross)**2+((p-C).dot(S)-side*target)**2)
 assert abs((cands[0]-C).dot(F)-d_cross)<7.
 assert abs((cands[0]-C).dot(S)-side*target)<14.
 return cands[0]
left_anchor=actual_anchor(cliff,leftsign,38.)
right_anchor=actual_anchor(portland,rightsign,49.)
# Deck sits *above* original 26.3m SOURCE road at every intersection.
# The pre-existing on-road motion/physics is absolutely untouched.
base_deck=max(z_road+28.,left_anchor.z-C.z+6.,right_anchor.z-C.z+12.)
assert base_deck-1.30-highest_source_road>20.,("SOURCE_ROAD_ENVELOPE_CLEARANCE_UNSAFE",base_deck-1.30-highest_source_road)
start_s=-51.
end_s=44.
assert start_s<-13.15 and end_s>13.15 and end_s-start_s>90
print("K4CO_TRUE_SOURCE_ANCHORS_AND_CLEARANCE",{"left":[round(x,3) for x in left_anchor],
 "right":[round(x,3) for x in right_anchor],"deckRoadClearance":round(base_deck-z_road,3)},flush=True)
art=bpy.data.collections.new("K4CO | source grounded maritime freight transfer viaduct | ART HOLD")
sc.collection.children.link(art)
def material(name,colors,metal=.0,rough=.81,scale=.16):
 m=bpy.data.materials.new("K4CO | "+name);m.use_nodes=True
 nd=m.node_tree.nodes;nd.clear();lk=m.node_tree.links
 out=nd.new("ShaderNodeOutputMaterial")
 bs=nd.new("ShaderNodeBsdfPrincipled");bs.inputs["Roughness"].default_value=rough
 bs.inputs["Metallic"].default_value=metal
 lk.new(bs.outputs["BSDF"],out.inputs["Surface"])
 noise=nd.new("ShaderNodeTexNoise");noise.inputs["Scale"].default_value=scale
 noise.inputs["Detail"].default_value=4
 geo=nd.new("ShaderNodeNewGeometry");lk.new(geo.outputs["Position"],noise.inputs["Vector"])
 ramp=nd.new("ShaderNodeValToRGB");ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(x,c) in enumerate(colors):
  e=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(x)
  e.position=x;e.color=(*c,1.)
 lk.new(noise.outputs["Fac"],ramp.inputs["Fac"]);lk.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 return m
stone=material("massive weathered coastal abutments",[(.10,(.125,.135,.135)),(.52,(.22,.221,.210)),(.90,(.315,.300,.269))],rough=.94,scale=.08)
steel=material("deep sea-weathered loadbearing steel",[(.10,(.044,.067,.076)),(.52,(.090,.116,.123)),(.90,(.175,.185,.173))],metal=.54,rough=.74)
deckmat=material("maritime freight service deck",[(.1,(.085,.101,.101)),(.50,(.159,.174,.165)),(.9,(.243,.238,.216))],metal=.18,rough=.86)
cables=material("muted galvanized load bearing suspension",[(.1,(.16,.176,.172)),(.52,(.26,.273,.250)),(.9,(.345,.341,.290))],metal=.52,rough=.62)
V=[];faces=[];ids=[]
def add_vertex(v):
 V.append(tuple(float(x) for x in v));return len(V)-1
def add_face(vs,mat):
 faces.append(tuple(vs));ids.append(mat)
def source_pos(s,d,z):
 return P(d,s,z)
def girder(a,b,width,depth,mat):
 a=Vector(a);b=Vector(b)
 axis=(b-a).normalized()
 ref=Vector((0,0,1)) if abs(axis.z)<.93 else F
 tangent=axis.cross(ref).normalized()
 other=axis.cross(tangent).normalized()
 q=tangent*(width/2);r=other*(depth/2)
 points=[a-q-r,a+q-r,a+q+r,a-q+r,b-q-r,b+q-r,b+q+r,b-q+r]
 n=len(V)
 for p in points:add_vertex(p)
 for face in ((0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)):
  add_face(tuple(n+x for x in face),mat)
# One 95m source-grounded continuous deck, NOT scores of decorative boxes.
svals=[start_s+(end_s-start_s)*i/36 for i in range(37)]
deck_rows=[]
for s in svals:
 # slight intentional camber across a real 95m freight transfer.
 rise=1.15*(1-(2*(s-start_s)/(end_s-start_s)-1)**2)
 z=base_deck+rise
 row=[add_vertex(source_pos(s,d_cross+dd,z+zz)) for dd,zz in
      ((-4.6,-1.30),(4.6,-1.30),(4.6,.20),(-4.6,.20))]
 deck_rows.append(row)
for i in range(len(deck_rows)-1):
 a=deck_rows[i];b=deck_rows[i+1]
 for u,v,mi in ((0,1,2),(1,2,2),(2,3,2),(3,0,2)):
  add_face((a[u],b[u],b[v],a[v]),mi)
add_face(tuple(deck_rows[0]),2);add_face(tuple(reversed(deck_rows[-1])),2)
# Two REAL continuous parabolic structural tied arches with braced depth,
# not isolated triangular spikes, boxes, decorative arches or billboards.
for dside in (-3.75,3.75):
 previous=None
 for s in svals:
  t=(s-start_s)/(end_s-start_s)
  z=base_deck+6.+16.8*(1-(2*t-1)**2)
  p=source_pos(s,d_cross+dside,z)
  if previous is not None:girder(previous,p,.82,1.10,1)
  previous=p
 # vertical hangers transmit deck load into the tied arch.
 for i in (3,7,11,15,19,23,27,31,35):
  s=svals[i];t=(s-start_s)/(end_s-start_s)
  upper=base_deck+6.+16.8*(1-(2*t-1)**2)
  camber=1.15*(1-(2*t-1)**2)
  girder(source_pos(s,d_cross+dside,base_deck+camber+.20),
         source_pos(s,d_cross+dside,upper),.12,.16,3)
# Three transverse structural ties join both ribs, rather than a toy lattice.
for i in (7,18,29):
 s=svals[i];t=(s-start_s)/(end_s-start_s)
 z=base_deck+6.+16.8*(1-(2*t-1)**2)
 girder(source_pos(s,d_cross-3.75,z),source_pos(s,d_cross+3.75,z),.42,.48,1)
# True anchored support beams deliberately terminate *in* actual inherited
# terrain vertices. Earlier nominal s-based foot positions could float away
# from the real headland/quay: that is not a grounded structure.
terrain_anchor_footings=0
for s,anchor in ((end_s,left_anchor),(start_s,right_anchor)):
 foot=anchor-Vector((0,0,1.50))
 assert base_deck-(foot.z-C.z)>5.
 assert abs((foot-C).dot(S)-s)<16.,("ABUTMENT_NOT_AT_REAL_TERRAIN",s,tuple(foot))
 assert ((foot-C).dot(S)*s)>0 and abs((foot-C).dot(S))>19.
 for dside in (-3.35,3.35):
  # Each inclined buttress embeds its lower end in a measured actual
  # K4CN rock/quay vertex and reaches the continuous deck end in world space.
  top=source_pos(s,d_cross+dside,base_deck+.10)
  girder(foot,top,2.35,3.05,0)
  terrain_anchor_footings+=1
 # Large transverse pier cap mechanically unites both deck ribs.
 girder(source_pos(s,d_cross-5.,base_deck-1.2),
        source_pos(s,d_cross+5.,base_deck-1.2),1.55,2.4,0)
assert terrain_anchor_footings==4
assert len(V)>500 and len(faces)>400,(len(V),len(faces))
mesh=bpy.data.meshes.new("K4CO | one continuous freight span over true Road5")
mesh.from_pydata(V,[],faces);mesh.update()
for m in (stone,steel,deckmat,cables):mesh.materials.append(m)
for poly,mi in zip(mesh.polygons,ids):
 poly.material_index=mi;poly.use_smooth=False
span=bpy.data.objects.new("K4CO | one source grounded 95m maritime freight overpass and port utility link",mesh)
art.objects.link(span)
span["DCC_RESEARCH_ONLY"]=True;span["NOT_GAME_COLLIDER"]=True
span["ORIGINAL_ROAD5_SOURCE_FROZEN"]=True
span["AUTHOR_INTENT"]="Source-grounded utility overpass: frame the speed corridor in distant depth, link geological headland to actual working port"
# The geometric road clearance at the crossing is derived from the SOURCE
# floor height, not an invented road or a proxy camera.
bridge_visible=sum(1 for v in span.data.vertices
 if (lambda q:q[2]>0 and .01<q[0]<.99 and .08<q[1]<.94)(project(span.matrix_world@v.co)))
assert bridge_visible>100,("TRUE_SOURCE_CHASE_CANNOT_SEE_LANDMARK",bridge_visible)
assert len(bpy.data.objects)==frozen_count+1
for name,state in parent_state.items():
 o=bpy.data.objects[name]
 current=(bool(o.hide_render),bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)
 assert current==state,("K4CN_PARENT_OBJECT_MUTATED",name)
assert all(mesh_digest(bpy.data.objects[name])==digest for name,digest in before_mesh.items())
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {roadsha(o) for o in roads.values()}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
assert sha(parent)==PARENT
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CO_TRUE_SOURCE_LOCKED_FREIGHT_VIADUCT_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CO_TRUE_SOURCE_CHASE_FREIGHT_VIADUCT_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230000000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4co.real-source-grounded-freight-overpass-v1",
 "parentK4CNR2ExactSHA256":PARENT,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,"newGameColliders":0,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "allInheritedMeshGeometryAndTransformsUnchanged":True,
 "newNativeEditableResearchMeshes":1,
 "realSpanBetweenGroundedAbutmentsMetres":end_s-start_s,
 "realSourceRoadClearanceMetres":base_deck-highest_source_road-1.3,
 "road5CrossingNativeSamplesCount":len(real_road_clearance_samples),
 "actualLeftSourceHeadlandAnchorMetres":list(left_anchor),
 "actualRightSourceQuayAnchorMetres":list(right_anchor),
 "trueViaductVertices":len(V),"trueViaductFaces":len(faces),
 "realSourceVertexAnchoredButtressCount":terrain_anchor_footings,
 "sourceChaseProjectedViaductVerticesNotArtScore":bridge_visible,
 "realNativeCHASE768x480":True,"renderEngine":"BLENDER_EEVEE",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CO_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CO_ONE_SOURCE_GROUNDED_VIADUCT_NATIVE_BLENDER_ART_HOLD",
 json.dumps({"spanMetres":end_s-start_s,"clearanceMetres":base_deck-highest_source_road-1.3,
 "visibleNativeVertices":bridge_visible,"faces":len(faces),"originalRoad5SHA":ROAD}),flush=True)
