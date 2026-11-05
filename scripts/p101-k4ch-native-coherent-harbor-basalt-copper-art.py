"""K4CH: coherent basalt-cut coastal road and working copper/wood ferry harbor.

This is genuine editable Blender native geometry, not a backdrop screenshot.
Use exact authentic K4CG R2 DCC parent; all original game/road/physics/
cameras and every source mesh are preserved. Research-only art visibility
swaps are explicitly audited. No game collider or official ART adoption.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(key):return Path(argv[argv.index(key)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="5a2215677fd41c420bac3b44b78b65b0e42aa74b79399498a87a57b7b85946f1"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for chunk in iter(lambda:f.read(1<<20),b""):h.update(chunk)
 return h.hexdigest()
assert sha(parent)==PARENT,("WRONG_GENUINE_K4CG_R2_PARENT",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
sourceposes=poses();assert len(sourceposes)>=6
cameras=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cameras)==1 and sc.camera==cameras[0]
cam=cameras[0];chasestate=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
def screen(p):
 q=world_to_camera_view(sc,cam,p)
 return (float(q.x),float(q.y),float(q.z))
roads=[]
for mode in ("CONTROL","ULTRA"):
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roads.append(next(iter(col.objects)))
def roadsha(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in o.data.polygons:h.update(struct.pack("<3i",*[int(q) for q in p.vertices]))
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
treestate={o.name:tuple(tuple(r) for r in o.matrix_world) for o in trees}
lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
parentstates={o.name:(bool(o.hide_render),bool(o.hide_viewport),
                      tuple(tuple(r) for r in o.matrix_world),
                      len(o.data.vertices) if o.type=="MESH" else -1)
              for o in bpy.data.objects}
def fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in o.data.polygons:
  h.update(struct.pack("<I",len(p.vertices)))
  for q in p.vertices:h.update(struct.pack("<I",int(q)))
 return h.hexdigest()
def get(name):
 # Blender 4.0 truncates long object display names to its 63-byte ID limit.
 # Use a long unique semantic research prefix and fail on zero or >1 matches,
 # rather than guessing an object or ever querying by source-game content.
 prefix=name[:49]
 matches=[o for o in bpy.data.objects if o.name==name or o.name.startswith(prefix)]
 assert len(matches)==1,(name,"RESEARCH_MESH_NAME_NOT_UNIQUE_OR_MISSING",[o.name for o in matches])
 o=matches[0]
 assert o.type=="MESH" and o not in roads and o not in (bad,good) and not o.hide_render
 assert o.get("NOT_GAME_COLLIDER") is True,(name,"NOT_RESEARCH_GEO")
 print("K4CH_REAL_RESEARCH_OBJECT_IDENTITY",name,"=>",o.name,flush=True)
 return o
left=get("K4CG | physically fractured coastal grey limestone headland")
back=get("K4CG | true muted mineral ground underlying the entire visible coastal slope")
sea1=get("K4CG | restored natural deep blue harbor basin connected to the open sea")
sea2=get("K4CG | actual 3D world-scale connected offshore tidal water")
island=get("K4CG | one broad true offshore eroded peninsula with contoured ridge")
roofs=[o for o in bpy.data.objects if o.name.startswith("K4BW | folded coastal museum and boat service canopy shell")]
piers=[o for o in bpy.data.objects if o.name.startswith("K4BW | galvanized slender structural pier")]
assert len(roofs)==1 and len(piers) in (12,14)
roof=roofs[0]
assert roof.type=="MESH" and not roof.hide_render and roof not in roads
assert all(o.type=="MESH" and not o.hide_render for o in piers)
parent_geom={o.name:fingerprint(o) for o in [left,back,sea1,sea2,island,roof,*piers]}
replaced=[left,back,sea1,sea2,island,roof,*piers]
coll=bpy.data.collections.new("K4CH | INTEGRATED COASTAL CANYON AND WORKING FERRY TERMINAL | ART HOLD")
sc.collection.children.link(coll)
new=[]
def cloned(o,newname,mat,role):
 p=o.copy();p.data=o.data.copy();p.name="K4CH | "+newname
 coll.objects.link(p)
 p["DCC_RESEARCH_ONLY"]=True;p["NOT_GAME_COLLIDER"]=True
 p["ART_WORLDSCAPE_ROLE"]=role
 p.data.materials.clear();p.data.materials.append(mat)
 new.append(p)
 return p
def mesh(name,verts,faces,mat,role):
 data=bpy.data.meshes.new("K4CH | "+name)
 data.from_pydata([tuple(v) for v in verts],[],[tuple(f) for f in faces]);data.update()
 obj=bpy.data.objects.new("K4CH | "+name,data)
 coll.objects.link(obj)
 obj["DCC_RESEARCH_ONLY"]=True;obj["NOT_GAME_COLLIDER"]=True
 obj["ART_WORLDSCAPE_ROLE"]=role
 data.materials.append(mat);new.append(obj)
 return obj
def material(name,swatches,scale,rough=.8,metal=.0,cracks=False):
 m=bpy.data.materials.new("K4CH | "+name)
 m.use_nodes=True;n=m.node_tree.nodes;n.clear();ln=m.node_tree.links
 output=n.new("ShaderNodeOutputMaterial")
 bs=n.new("ShaderNodeBsdfPrincipled")
 bs.inputs["Roughness"].default_value=rough
 bs.inputs["Metallic"].default_value=metal
 ln.new(bs.outputs["BSDF"],output.inputs["Surface"])
 geo=n.new("ShaderNodeNewGeometry")
 noise=n.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale
 noise.inputs["Detail"].default_value=5.
 noise.inputs["Roughness"].default_value=.68
 ln.new(geo.outputs["Position"],noise.inputs["Vector"])
 ramp=n.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(loc,color) in enumerate(swatches):
  e=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(loc)
  e.position=loc;e.color=(*color,1.)
 ln.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 if cracks:
  vor=n.new("ShaderNodeTexVoronoi")
  vor.feature="DISTANCE_TO_EDGE";vor.inputs["Scale"].default_value=.24
  ln.new(geo.outputs["Position"],vor.inputs["Vector"])
  line=n.new("ShaderNodeValToRGB")
  line.color_ramp.elements[0].position=.008
  line.color_ramp.elements[0].color=(.22,.25,.24,1)
  line.color_ramp.elements[1].position=.065
  line.color_ramp.elements[1].color=(1,1,1,1)
  ln.new(vor.outputs["Distance"],line.inputs["Fac"])
  mult=n.new("ShaderNodeMixRGB");mult.blend_type="MULTIPLY"
  mult.inputs[0].default_value=.78
  ln.new(ramp.outputs["Color"],mult.inputs[1])
  ln.new(line.outputs["Color"],mult.inputs[2])
  ln.new(mult.outputs[0],bs.inputs["Base Color"])
 else:
  ln.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 fine=n.new("ShaderNodeTexNoise")
 fine.inputs["Scale"].default_value=3.2
 fine.inputs["Detail"].default_value=4.
 ln.new(geo.outputs["Position"],fine.inputs["Vector"])
 bump=n.new("ShaderNodeBump")
 bump.inputs["Strength"].default_value=.21 if cracks else .11
 bump.inputs["Distance"].default_value=.13 if cracks else .07
 ln.new(fine.outputs["Fac"],bump.inputs["Height"])
 ln.new(bump.outputs["Normal"],bs.inputs["Normal"])
 return m
basalt=material("broken weathered coastal blue-grey basalt with real joint cracks",
 [(.12,(.075,.095,.098)),(.29,(.15,.17,.16)),(.49,(.25,.27,.25)),
  (.66,(.32,.33,.29)),(.86,(.42,.41,.36))],.22,.91,0.,True)
copper=material("aged deep bronze oxidized copper ferry terminal",[
 (.09,(.095,.17,.16)),(.29,(.20,.30,.27)),(.49,(.31,.33,.30)),
 (.68,(.46,.37,.25)),(.89,(.58,.44,.29))],.13,.45,.67)
wood=material("weather-resistant warm laminated harbor timber",[
 (.12,(.13,.09,.07)),(.34,(.29,.18,.12)),(.53,(.40,.29,.20)),
 (.76,(.50,.36,.25)),(.88,(.55,.43,.31))],.23,.62,0.)
sea_color=material("dark natural tidal water, coherent offshore and berth",[
 (.09,(.016,.059,.071)),(.34,(.042,.095,.106)),(.52,(.082,.15,.16)),
 (.80,(.16,.23,.23))],.095,.26,.17)
slate=material("distant layered low-slung sandstone coast",[
 (.10,(.11,.17,.19)),(.29,(.20,.23,.24)),(.51,(.29,.32,.30)),
 (.74,(.40,.41,.36)),(.90,(.49,.47,.41))],.15,.89,0.,True)
# 1. Source slope and foreground were both in frame, but were previously too
# pale and soft. Coherent physically jointed stone, actual facet geometry.
slope=cloned(left,"true broken coastal bedrock and fractured road cut",basalt,
             "ONE_UNIFIED_LEFT_WORLDSCAPE_ROAD_CUT")
land=cloned(back,"connected same-basalt coastal ground beneath headland",basalt,
            "ONE_UNIFIED_LEFT_SOURCE_BACKED_CLIFF")
facets=0;real_lift=0
for obj in (slope,land):
 inv=obj.matrix_world.inverted_safe()
 for v in obj.data.vertices:
  p=obj.matrix_world@v.co
  x,y,depth=screen(p)
  if depth<=0 or not (.028<x<.29 and .20<y<.76):continue
  # Fold broad geological cracks in the actual 3D rock geometry.
  # Low amplitude, planar fault displacements, never a Gaussian cartoon cone.
  fault_phase=(p.x*.053+p.y*.087)
  stepped=.46*math.tanh(5.*math.sin(fault_phase))
  shear=.21*math.sin(p.x*.29-p.y*.11)
  dz=.22+stepped+shear
  pp=p+Vector((0,0,dz))
  x2,y2,z2=screen(pp)
  assert x2<.44,("ROAD_VIEW_RISK_LEFT_CLIFF",obj.name,x2)
  v.co=inv@pp;real_lift+=1
 obj.data.update()
 for polygon in obj.data.polygons:
  if polygon.area>.012 and abs(polygon.normal.z)<.83:
   polygon.use_smooth=False;facets+=1
assert real_lift>350 and facets>200,("VISIBLE_GEOLOGY_NOT_AUTHORED",real_lift,facets)
# Retire ONLY source-LOCKED-RESEARCH DCC layers from this render; their
# immutable mesh/visibility data remains intact in K4CG parent .blend.
left.hide_render=True;back.hide_render=True

# 2. A working berth, not a decorative roof model: preserve actual pavilion
# mesh and 12/14 true support locations, reauthor a materially cohesive
# deep copper terminal canopy, using all same world-space anchor geometry.
canopy=cloned(roof,"full-span aged copper coastal terminal canopy",copper,
              "ONE_OCCUPIED_REAL_HARBOR_SHELTER")
cworld=canopy.matrix_world.copy();cinv=cworld.inverted_safe()
rpts=[roof.matrix_world@v.co for v in roof.data.vertices]
zc=sum(q.z for q in rpts)/len(rpts)
modified_roof=0
for vertex in canopy.data.vertices:
 p=cworld@vertex.co
 # Lower and broaden the old oversized dome (the parent remains unchanged);
 # physically reform its curvature with a gentle real-Z scaling.
 z=zc+.72*(p.z-zc)+.13
 vertex.co=cinv@Vector((p.x,p.y,z))
 modified_roof+=1
canopy.data.update()
assert modified_roof>15
roof.hide_render=True
# One combined structural timber assembly, not a crop of duplicate boxes.
vtotal=[];ftotal=[]
for pier in piers:
 offset=len(vtotal)
 vtotal.extend(pier.matrix_world@v.co for v in pier.data.vertices)
 for face in pier.data.polygons:
  ftotal.append(tuple(offset+i for i in face.vertices))
 assert pier not in roads
 timber_pier_count=len(piers)
supports=mesh("one structurally continuous timber ferry station post assembly",
              vtotal,ftotal,wood,"REAL_SUPPORTS_AT_EXISTING_INHERITED_TERMINAL_COLUMN_POSITIONS")
assert len(supports.data.vertices)>timber_pier_count*6
for pier in piers:pier.hide_render=True

# 3. Physical seawater and distant low broad coastal ridge retain the
# existing world position and actual mesh, rather than pasting a background.
harbor=cloned(sea1,"one coherent blue-green water volume at existing berth",sea_color,
              "CONTINUOUS_HARBOR_WITH_ORIGINAL_WATER_LEVEL")
ocean=cloned(sea2,"one connected dark slate tidal ocean to the horizon",sea_color,
             "CONTINUOUS_WORLD_SCALE_OFFSHORE_SEA")
sea1.hide_render=True;sea2.hide_render=True
offshore=cloned(island,"low eroded coastal landmass instead of a tiny sharp peak",slate,
               "HORIZONTAL_OFFSHORE_HORIZON_GEOGRAPHY")
w=offshore.matrix_world.copy();inv=w.inverted_safe()
isle_p=[w@v.co for v in offshore.data.vertices]
isle_z=min(p.z for p in isle_p)
isle_center=sum(isle_p,Vector())/len(isle_p)
# lower the triangular isolated mountain, broaden its entire real 3D body.
for v in offshore.data.vertices:
 p=w@v.co
 q=isle_center+Vector(((p.x-isle_center.x)*1.36,
                       (p.y-isle_center.y)*1.36,
                       isle_z+(p.z-isle_z)*.46-isle_center.z))
 v.co=inv@q
offshore.data.update();island.hide_render=True
# The shore silhouette must stay off the roadway center under unchanged CHASE.
samples=[screen(offshore.matrix_world@v.co) for v in offshore.data.vertices[::14]]
assert all(p[2]>0 for p in samples)
xrange=(min(p[0] for p in samples),max(p[0] for p in samples))
assert xrange[0]>.50,("OFFSHORE_CLIFF_OVERLAPS_ORIGINAL_ROAD",xrange)

# Protected source inherited geometry, camera and original scene matrices.
assert len(new)==7 and all(o.get("NOT_GAME_COLLIDER") is True for o in new)
assert poses()==sourceposes
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==chasestate
assert {roadsha(o) for o in roads}=={ROAD}
assert {o.name:tuple(tuple(r) for r in o.matrix_world) for o in trees}==treestate
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==lights
modified_visibility={o.name for o in replaced}
for name,state in parentstates.items():
 obj=bpy.data.objects[name]
 if name in modified_visibility:
  assert obj.hide_render and not state[0],("PARENT_VISIBILITY_SWAP_FAILED",name)
  assert (bool(obj.hide_viewport),tuple(tuple(r) for r in obj.matrix_world),
          len(obj.data.vertices) if obj.type=="MESH" else -1)==state[1:]
 else:
  assert (bool(obj.hide_render),bool(obj.hide_viewport),
          tuple(tuple(r) for r in obj.matrix_world),
          len(obj.data.vertices) if obj.type=="MESH" else -1)==state,("FROZEN_PARENT_CHANGED",name)
for obj in [left,back,sea1,sea2,island,roof,*piers]:
 assert fingerprint(obj)==parent_geom[obj.name],("PARENT_MESH_MUTATED",obj.name)
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
bl=out/"K4CH_BASALT_AND_COPPER_HARBOR_FULL_FRAME_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(bl))
png=out/"K4CH_TRUE_CHASE_BASALT_COPPER_HARBOR_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert bl.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4ch.actual-integrated-basalt-copper-harbor-v1",
 "parentK4CGR2ExactSHA256":PARENT,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "originalParentObjectGeometryAndMatrixUnchanged":True,
 "originalResearchVisibilityDisabledOnly":sorted(modified_visibility),
 "originalK4CGResearchMeshesFingerprint":parent_geom,
 "K4BZ_bad_duplicate_road_hidden":True,
 "newGameColliders":0,"sourceGameEdited":False,"sourcePhysicsEdited":False,
 "newResearchEditableMeshObjects":len(new),
 "newGenuineVisibleGeologicalVertexChanges":real_lift,
 "newGenuineVisibleAngularRockFacets":facets,
 "actualTerminalOriginalSupportCount":timber_pier_count,
 "trueReformedCopperRoofVertices":modified_roof,
 "actualRealOffshoreWorldScreenX":xrange,
 "renderEngine":"BLENDER_EEVEE","originalChase768x480":True,
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (bl,png)}
}
(out/"K4CH_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CH_GENUINE_BLENDER_INTEGRATED_HARBOR_ART_UNJUDGED",
 json.dumps({"newMeshes":len(new),"sculpted":real_lift,"facets":facets,
             "roofVertices":modified_roof,"supports":timber_pier_count},ensure_ascii=False),flush=True)
