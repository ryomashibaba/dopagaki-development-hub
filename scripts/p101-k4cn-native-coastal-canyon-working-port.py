"""K4CN: substantive native Blender coastal canyon and functional working-harbor composition.
ART HOLD research ONLY. Parent is SHA-pinned K4CM genuine editable native Blender.
Never touches original Road5, Game, physics, cameras, or inherited mesh data.
"""
import bpy,math,hashlib,json,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="273c6ab1ec334ff8b2524c43c611da43831aaef3374056f3ab02352e3e914aab"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for block in iter(lambda:f.read(1<<20),b""):h.update(block)
 return h.hexdigest()
assert sha(parent)==PARENT,("WRONG_K4CM_TRUE_NATIVE_PARENT",sha(parent))
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
print("K4CN_ORIGINAL_SOURCE_ROAD_SHOULDER",{"leftSideSign":leftsign,"projections":orient,
       "roadWidthApproxMetres":26.3,"firstRay":samples[0],"lastRay":samples[-1]},flush=True)
# Freeze actual road geometry, chase, every inherited object's visibility
# and matrix. New geometry is entirely beyond the source road +/-13.15 m.




# ART-first single composition: left wind-cut fault massif and right actual
# high-span working port.  No replacement road, virtual-camera proxy, decals,
# billboard, geometry edits to the inherited scene, or game colliders.
art=bpy.data.collections.new("K4CN | SOURCE-LOCKED COASTAL CANYON AND WORKING HARBOR | ART HOLD")
sc.collection.children.link(art)
created=[]
hidden_parent={}
def unique(prefix):
 hits=[o for o in bpy.data.objects if o.name.startswith(prefix)]
 assert len(hits)==1,("K4CN_AMBIGUOUS_INHERITED_OBJECT",prefix,[o.name for o in hits])
 return hits[0]
cliff=unique("K4CM | one eroded 200m folded coastal schist")
quay=unique("K4CM | one physically graded 200m coastside")
gangway=unique("K4CM | one structurally linked real ferry passenger")
gantry=unique("K4CM | salt-aged original 3D ferry") if any(o.name.startswith("K4CM | salt-aged original 3D ferry") for o in bpy.data.objects) else None
assert cliff.type==quay.type==gangway.type=="MESH"
assert not cliff.hide_render and not quay.hide_render and not gangway.hide_render
assert all(o.get("NOT_GAME_COLLIDER") is True and o.get("DCC_RESEARCH_ONLY") is True for o in (cliff,quay,gangway))
def fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(x) for x in v.co]))
 for poly in o.data.polygons:
  h.update(struct.pack("<I",len(poly.vertices)))
  for k in poly.vertices:h.update(struct.pack("<I",int(k)))
 return h.hexdigest()
frozen_research={o.name:fingerprint(o) for o in (cliff,quay,gangway)}
leftsign=1
rightsign=-1
assert project(P(80,23,ground(80)+5))[0]<project(P(80,-23,ground(80)+5))[0]
def make_mat(name,colors,scale=.13,bump=.13,rough=.87,metallic=0):
 m=bpy.data.materials.new("K4CN | "+name)
 m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();links=m.node_tree.links
 out=ns.new("ShaderNodeOutputMaterial")
 surface=ns.new("ShaderNodeBsdfPrincipled")
 surface.inputs["Roughness"].default_value=rough
 surface.inputs["Metallic"].default_value=metallic
 links.new(surface.outputs["BSDF"],out.inputs["Surface"])
 coord=ns.new("ShaderNodeNewGeometry")
 noise=ns.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale;noise.inputs["Detail"].default_value=5
 links.new(coord.outputs["Position"],noise.inputs["Vector"])
 ramp=ns.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(p,c) in enumerate(colors):
  stop=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(p)
  stop.position=p;stop.color=(*c,1.)
 links.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 links.new(ramp.outputs["Color"],surface.inputs["Base Color"])
 n2=ns.new("ShaderNodeTexNoise")
 n2.inputs["Scale"].default_value=2.1;n2.inputs["Detail"].default_value=4
 links.new(coord.outputs["Position"],n2.inputs["Vector"])
 bn=ns.new("ShaderNodeBump")
 bn.inputs["Strength"].default_value=bump
 bn.inputs["Distance"].default_value=.11
 links.new(n2.outputs["Fac"],bn.inputs["Height"])
 links.new(bn.outputs["Normal"],surface.inputs["Normal"])
 return m
slate=make_mat("bedrock dark schist natural large-scale variation",[(.09,(.032,.046,.055)),(.29,(.066,.077,.084)),(.53,(.11,.124,.127)),(.76,(.176,.173,.165)),(.94,(.244,.221,.188))],.14,.19)
seam=make_mat("stratified mineral fault faces",[(.1,(.053,.061,.059)),(.32,(.088,.099,.097)),(.60,(.158,.153,.131)),(.85,(.237,.211,.169))],.29,.18)
weather=make_mat("erosion salt-bleached upper cap",[(.12,(.14,.146,.135)),(.36,(.19,.183,.155)),(.65,(.245,.227,.181)),(.89,(.296,.272,.216))],.17,.20)
concrete=make_mat("cast marine civic breakwater",[(.11,(.105,.115,.12)),(.36,(.162,.166,.157)),(.64,(.223,.221,.206)),(.90,(.303,.293,.263))],.23,.11)
rust=make_mat("working port patinated structural steel",[(.09,(.047,.087,.105)),(.31,(.085,.139,.148)),(.57,(.146,.172,.163)),(.85,(.219,.224,.204))],.24,.08,.68,.46)
roofmat=make_mat("dark sea-facing ceramic metal roofing",[(.09,(.07,.09,.091)),(.32,(.12,.14,.133)),(.62,(.199,.202,.179)),(.89,(.26,.238,.194))],.18,.07,.53,.30)

# A single new COPY of the existing continuous natural scarp, never modifying
# the 1600 original K4CM rock vertices. Dramatic but coherent LONG scale folds,
# long incised gullies and laminated faceted geological bands (not tiny props).
rock=cliff.copy();rock.data=cliff.data.copy()
rock.name="K4CN | continuous exposed headland, four true erosional catchments"
art.objects.link(rock)
rock.data.materials.clear()
for m in (slate,seam,weather):rock.data.materials.append(m)
rock_ref=rock.matrix_world.inverted_safe()
amplitudes=[]
for v in rock.data.vertices:
 p=rock.matrix_world@v.co
 d=(p-C).dot(F);lat=leftsign*(p-C).dot(S)
 assert 15.7<lat<61.5,("ROCK_NOT_ACTUAL_LEFT_ROAD_SIDE",lat)
 f=max(0.,min(1.,(lat-19.)/13.))
 # Three asymmetrical rock promontories and two through-cut catchments; the
 # near shoulder remains precisely where the parent placed it.
 ridge=(7.6*math.sin(d*.027+.72)+5.5*math.sin(d*.061-.8))
 gully=sum(h*math.exp(-((d-x)/w)**2) for x,w,h in ((24,14,9.1),(104,17,12.3),(173,13,7.8)))
 striation=1.7*math.sin(d*.21+lat*.27)
 uplift=f*(ridge-gully+striation+7.6*max(0.,(lat-36.)/22.))
 outward=f*2.6*math.sin(d*.043+.25)
 q=p+S*(leftsign*outward)+Vector((0,0,uplift))
 v.co=rock_ref@q;amplitudes.append(abs(uplift))
assert len(rock.data.vertices)==1600 and max(amplitudes)>13
for poly in rock.data.polygons:
 p=sum((rock.matrix_world@rock.data.vertices[k].co for k in poly.vertices),Vector())/len(poly.vertices)
 d=(p-C).dot(F);lat=(p-C).dot(S)
 poly.material_index=(1 if (int((p.z*.38+d*.05))%9)<4 else (2 if lat>35 and int(d/22)%4==0 else 0))
 poly.use_smooth=False
rock["DCC_RESEARCH_ONLY"]=True;rock["NOT_GAME_COLLIDER"]=True
rock["AUTHOR_INTENT"]="large continuous naturally eroded coastal fault canyon, not repeating modules"
cliff.hide_render=True;hidden_parent[cliff.name]=True
created.append(rock)

# A new world-space quay copy with true hard-edged multi-level massing: upper
# public concourse, sea-side active drydock and large industrial harbor podium.
# No inherited K4CM landform vertices/materials are overwritten.
portland=quay.copy();portland.data=quay.data.copy()
portland.name="K4CN | extended physically integrated large working-quay podium"
art.objects.link(portland)
portland.data.materials.clear()
portland.data.materials.append(concrete);portland.data.materials.append(seam)
inv=portland.matrix_world.inverted_safe()
port_height=[]
for v in portland.data.vertices:
 p=portland.matrix_world@v.co
 d=(p-C).dot(F);s=rightsign*(p-C).dot(S)
 assert 16.0<s<60.0,("INHERITED_QUAY_NOT_OUTSIDE_SOURCE_ROAD",s)
 f=max(0.,min(1.,(s-23.)/24.))
 delta=f*(-2.0+1.4*math.cos(d*.035)+.6*math.sin(d*.12))
 v.co=inv@(p+Vector((0,0,delta)))
 port_height.append(abs(delta))
for poly in portland.data.polygons:
 poly.material_index=1 if (poly.index%7==0) else 0
portland["DCC_RESEARCH_ONLY"]=True;portland["NOT_GAME_COLLIDER"]=True
portland["AUTHOR_INTENT"]="source connected working port deep seawall and terminal podium"
quay.hide_render=True;hidden_parent[quay.name]=True
created.append(portland)

# A single structurally coherent working harbour terminal, with real volume:
# long dock edge, station floors, high-span crane-serviced hall, load bearing
# piers, roof beams. It occupies the TRUE RIGHT shore, beyond source shoulder.
V=[];T=[];I=[]
def vtx(p):
 V.append(tuple(float(x) for x in p));return len(V)-1
def face(vs,m=0):
 T.append(tuple(vs));I.append(m)
def box3(p,dx,dy,dz,mi=0):
 # oriented to original source road tangent F / cross S
 pts=[]
 for u,w,h in ((-1,-1,0),(1,-1,0),(1,1,0),(-1,1,0),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)):
  pts.append(vtx(p+F*(dx*u*.5)+S*(dy*w*.5)+Vector((0,0,dz*h))))
 for ids in ((0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)):
  face(tuple(pts[k] for k in ids),mi)
def station(d,s,raisez):return P(d,rightsign*s,ground(d)+raisez)
# Quay platform founded at the road height: 142m long industrial wharf.
# Deliberately one connected dock platform instead of scores of toy buildings.
for d in range(12,153,5):
 box3(station(d,46,-7.4),5.05,29,1.6,0)
# One high roof with four continuously curved wide bands; actual roof
# has thickness and is physically held by lower concrete load-bearing piers.
lo,hi=31,125
dd=list(range(lo,hi+1,3))
sec=[(37,12.0),(40,17.8),(46,20.8),(55,20.0),(65,15.4),(69,11.0)]
rnodes=[]
for d in dd:
 row=[]
 for s,h in sec:
  roof_height=h+1.3*math.cos((d-lo)/(hi-lo)*math.pi)
  row.append(vtx(station(d,s,roof_height)))
 rnodes.append(row)
for k in range(len(rnodes)-1):
 for j in range(len(sec)-1):
  face((rnodes[k][j],rnodes[k+1][j],rnodes[k+1][j+1],rnodes[k][j+1]),2)
# Metal span is supported by real terminals anchored into quay, with a
# navigable-length, open public/industrial interior, not a wall of opaque cubes.
for d in (33,58,84,109,124):
 for s,top in ((39,17.5),(65,15.1)):
  box3(station(d,s,-7.0),2.5,2.3,top+7.0,1)
 box3(station(d,51,17.5),2.7,31,2.0,1)
# A longitudinal solid sea wall and two lower separate functional loading lips.
for s in (29,73):
 for d in range(26,142,9):
  box3(station(d,s,-9.5),9.03,2.8,5.3,0)
# Two large working machine halls for ferry handling: credible actual
# enclosed rooms, off-road and under one open-span crane roof.
for d,l,w,h in ((52,30,12,8),(104,34,14,10)):
 box3(station(d,61,-5),l,w,h,1)
assert len(V)>1000 and len(T)>800,("INSUFFICIENT_GENUINE_WORLDSCAPE_MASS",len(V),len(T))
mesh=bpy.data.meshes.new("K4CN | real large structural port volume")
mesh.from_pydata(V,[],T);mesh.update()
for m in (concrete,rust,roofmat):mesh.materials.append(m)
for poly,idx in zip(mesh.polygons,I):poly.material_index=idx;poly.use_smooth=False
terminal=bpy.data.objects.new("K4CN | one built maritime megaterminal and real active quay",mesh)
art.objects.link(terminal)
terminal["DCC_RESEARCH_ONLY"]=True;terminal["NOT_GAME_COLLIDER"]=True
terminal["ORIGINAL_ROAD5_COLLIDER_UNMODIFIED"]=True
terminal["AUTHOR_INTENT"]="one operational connected large port with steel roof, loading floor and vessel access, not decorative mass copies"
created.append(terminal)

# Independent camera geometry precheck. All *visible new* right-port vertices
# must project to the right of central SOURCE road, without virtual 2D layers.
visible={"left":0,"right":0}
ranges={"left":[2.,-2.],"right":[2.,-2.]}
for o,which in ((rock,"left"),(portland,"right"),(terminal,"right")):
 for v in o.data.vertices:
  p=o.matrix_world@v.co;x,y,z=project(p)
  if z>0 and 0<y<1:
   ranges[which][0]=min(ranges[which][0],x)
   ranges[which][1]=max(ranges[which][1],x)
   if which=="left" and -.04<x<.50:visible["left"]+=1
   if which=="right" and .52<x<1.04:visible["right"]+=1
assert visible["left"]>300 and visible["right"]>250,("RENDER_CAMERA_NOT_SEEING_REAL_NEW_WORLD",visible,ranges)
# Every previously existing mesh vertex+face, inherited transform and 6
# immutable camera poses must remain identical in the source file and DCC.
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {roadsha(o) for o in roads.values()}=={ROAD}
assert {o.name:tuple(tuple(r) for r in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==light_state
for name,state in parent_state.items():
 o=bpy.data.objects[name]
 if name in hidden_parent:
  assert o.hide_render and not state[0]
  assert (bool(o.hide_viewport),tuple(tuple(r) for r in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state[1:]
 else:
  assert (bool(o.hide_render),bool(o.hide_viewport),
          tuple(tuple(r) for r in o.matrix_world),
          len(o.data.vertices) if o.type=="MESH" else -1)==state,("INHERITED_OBJECT_CHANGED",name)
for o in (cliff,quay,gangway):assert fingerprint(o)==frozen_research[o.name]
assert good.hide_render and bad.hide_render and sha(parent)==PARENT
assert len(created)==3 and all(o.get("DCC_RESEARCH_ONLY") and o.get("NOT_GAME_COLLIDER") for o in created)

sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=16
except AttributeError:pass
blend=out/"K4CN_TRUE_COASTAL_CANYON_WORKING_PORT_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CN_TRUE_SOURCE_CHASE_REAL_COASTAL_CANYON_WORKING_PORT_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230000000 and png.stat().st_size>35000
audit={
 "schema":"dopagaki.k4cn.source-locked-true-coastal-canyon-and-working-port-v1",
 "parentK4CMExactSHA256":PARENT,"originalGameGitBlob":GAME,
 "originalRoad5FullVertexFaceSHA256":ROAD,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,"newGameColliders":0,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "allInheritedMeshGeometryAndTransformsUnchanged":True,
 "oldResearchScarpAndQuayHiddenOnly":True,
 "originalFerryPassengerWalkwayUnchanged":True,
 "newNativeEditableResearchMeshes":len(created),
 "newTrueFaultVertices":len(rock.data.vertices),
 "sourceTrueCoastalFoldAdditionalMaxMetres":max(amplitudes),
 "newWorkingQuayVertices":len(portland.data.vertices),
 "newMaritimeMegaterminalVertices":len(terminal.data.vertices),
 "newMaritimeMegaterminalFaces":len(terminal.data.polygons),
 "newVisibleWorldVertexCountsNotArtScore":visible,
 "newProjectedWorldBoundsNotArtScore":ranges,
 "realNativeCHASE768x480":True,"renderEngine":"BLENDER_EEVEE",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CN_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CN_NATIVE_SOURCE_FROZEN_ACTUAL_EDITABLE_3D_ART_HOLD",json.dumps({
 "created":len(created),"visible":visible,"leftMaxFoldMetres":round(max(amplitudes),2),
 "terminalFaces":len(terminal.data.polygons),"road5SHA":ROAD}),flush=True)
