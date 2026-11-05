"""K4CF single-hero coastal escarpment ART-FIRST:
two native editable 3D cliff variants from inherited K4CC research geology.
Do not move the original Slope, physical Road5, physics, cameras, water,
ferry, trees or original K4CE source.  Same true CHASE / real EEVEE A/B.
TECH/ART/HUMAN verdicts stay separate.  Research Blender only.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):return Path(argv[argv.index(k)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT_SHA="3f0bc2f048dec39bc263151e2117b374d40b7422478c7e9b49583865c836d63e"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for block in iter(lambda:f.read(1<<20),b""):h.update(block)
 return h.hexdigest()
assert sha(parent)==PARENT_SHA,("K4CF_WRONG_OR_MODIFIED_K4CE_PARENT",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
frozen_poses=poses()
assert len(frozen_poses)>=6
chase_cams=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(chase_cams)==1 and sc.camera==chase_cams[0]
cam=chase_cams[0]
cam_lock=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
roads=[]
for mode in ("CONTROL","ULTRA"):
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roads.append(next(iter(col.objects)))
def roadsha(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in o.data.polygons:h.update(struct.pack("<3i",*[int(i) for i in p.vertices]))
 return h.hexdigest()
assert {roadsha(o) for o in roads}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
rock=bpy.data.objects.get("K4CC | TRUE_EDITABLE_NATIVE_ROCK_RELIEF | NO_GAME_COLLIDER")
assert rock and rock.type=="MESH" and not rock.hide_render
assert rock.get("DCC_RESEARCH_ONLY") is True and rock.get("NOT_GAME_COLLIDER") is True
assert len(rock.data.vertices)>12000 and len(rock.data.materials)>=1
trees=([o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
       +[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
       +[o for o in bpy.data.objects if o.name.startswith("K4CA | actual Poly Haven island_tree_02")])
assert len(trees)==11
treeposes={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
lightstates={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
original={o.name:(bool(o.hide_render),bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world),
                  len(o.data.vertices) if o.type=="MESH" else -1)
          for o in bpy.data.objects}
def meshfingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in o.data.polygons:
  h.update(struct.pack("<I",len(p.vertices)))
  for k in p.vertices:h.update(struct.pack("<I",int(k)))
 return h.hexdigest()
rocksha=meshfingerprint(rock)
def project(p):
 q=world_to_camera_view(sc,cam,p)
 return float(q.x),float(q.y),float(q.z)
def smoothstep(x):
 t=max(0.,min(1.,float(x)))
 return t*t*(3.-2.*t)
# World-space rock displacement confined to existing visible LEFT slope.
# Screen-position is a conservative ART composition envelope, NOT a rendered
# billboard, fake geometry, camera pose change, or replacement source road.
def weight(x,y):
 return (smoothstep((x-.017)/.065)*smoothstep((.345-x)/.095)*
         smoothstep((y-.235)/.17)*smoothstep((.84-y)/.16))
def mineral_material(label,variant):
 # The R1 SINE(Z) material produced regular zebra-like stripes that read as
 # fabricated layered cakes, not real weathered rock. R2 uses irregular
 # low-contrast mineral noise and true world-surface bump instead.
 m=bpy.data.materials.new("K4CF R2 | "+label+" | natural mineral aggregate")
 m.use_nodes=True
 n=m.node_tree.nodes;n.clear();links=m.node_tree.links
 output=n.new("ShaderNodeOutputMaterial")
 bs=n.new("ShaderNodeBsdfPrincipled")
 bs.inputs["Roughness"].default_value=.88 if variant=="A" else .93
 bs.inputs["Metallic"].default_value=0.
 links.new(bs.outputs["BSDF"],output.inputs["Surface"])
 pos=n.new("ShaderNodeNewGeometry")
 large=n.new("ShaderNodeTexNoise")
 large.inputs["Scale"].default_value=.24 if variant=="A" else .31
 large.inputs["Detail"].default_value=4.
 large.inputs["Roughness"].default_value=.69
 links.new(pos.outputs["Position"],large.inputs["Vector"])
 ramp=n.new("ShaderNodeValToRGB")
 if variant=="A":
  # Naturally worn coastal limestone, no high-contrast horizontal bands.
  shades=[(.18,(.23,.25,.24)),(.33,(.32,.33,.31)),
          (.48,(.40,.40,.36)),(.63,(.46,.45,.39)),
          (.82,(.53,.51,.46))]
 else:
  # Darker fracture slabs without the former striped-cone illusion.
  shades=[(.18,(.16,.20,.21)),(.33,(.24,.28,.29)),
          (.48,(.32,.34,.34)),(.63,(.40,.40,.38)),
          (.82,(.47,.46,.43))]
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(loc,c) in enumerate(shades):
  el=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(loc)
  el.position=loc;el.color=(*c,1.)
 links.new(large.outputs["Fac"],ramp.inputs["Fac"])
 links.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 fine=n.new("ShaderNodeTexNoise")
 fine.inputs["Scale"].default_value=2.8
 fine.inputs["Detail"].default_value=3.
 links.new(pos.outputs["Position"],fine.inputs["Vector"])
 bump=n.new("ShaderNodeBump")
 bump.inputs["Strength"].default_value=.13 if variant=="A" else .20
 bump.inputs["Distance"].default_value=.095
 links.new(fine.outputs["Fac"],bump.inputs["Height"])
 links.new(bump.outputs["Normal"],bs.inputs["Normal"])
 return m
coll=bpy.data.collections.new("K4CF | windward carved continental headland | TRUE DCC ART HOLD")
sc.collection.children.link(coll)
variants={}
audit_shape={}
base_material=rock.data.materials[0]
old_world=rock.matrix_world.copy()
old_inverse=old_world.inverted_safe()
for variant in ("A","B"):
 o=rock.copy()
 o.data=rock.data.copy()
 o.name="K4CF | "+("warm layered cliff and wind-eroded headland A" if variant=="A" else
                       "deep slate folded continental escarpment B")
 coll.objects.link(o)
 o["DCC_RESEARCH_ONLY"]=True
 o["NOT_GAME_COLLIDER"]=True
 o["K4CF_VARIANT"]=variant
 o["PARENT_RESEARCH_ROCK_SHA256"]=rocksha
 o.data.materials.clear()
 o.data.materials.append(base_material)
 o.data.materials.append(mineral_material("wind sculpted coastal escarpment",variant))
 weights=[]
 count=0;mx=0.;max_x=0.
 for v in o.data.vertices:
  p=old_world@v.co
  sx,sy,sz=project(p)
  w=weight(sx,sy) if sz>0 else 0.
  weights.append(w)
  if w<.008:continue
  # Extensive macro layers are real spatial sculpting. Continuous masked
  # displacement makes one coherent cliff rather than multiple pasted rocks.
  # R1's pixel-space Gaussian lobes formed two perfect cones with a
  # detached triangular foot. R2 is one gently descending, broad continuous
  # limestone escarpment, with subdued world-space fault erosion.
  # This is *actual world-Z deformation*, not image warping.
  profile=1.-.40*smoothstep((sx-.07)/.27)
  plateau=math.exp(-((sy-.52)/.32)**4)
  high=(4.5 if variant=="A" else 5.6)*profile*plateau
  # Two shallow fault gullies break symmetry without mountain-like peaks.
  crevasse=(.82 if variant=="A" else 1.30)*math.exp(-((sx-.19)/.033)**2)*plateau
  streamcut=(.42 if variant=="A" else .68)*math.exp(-((sx-.277)/.021)**2)*plateau
  grain=(.30*math.sin(p.x*.13+p.y*.11)+.18*math.sin(p.x*.31-p.y*.17))
  dz=w*max(.035,high-crevasse-streamcut+grain)
  if abs(dz)<.009:continue
  np=p+Vector((0.,0.,dz))
  sx2,sy2,sz2=project(np)
  # The 3D cliff may never physically project into the protected road view.
  assert sx2<.455,("K4CF_LEFT_CLIFF_ENTERED_RACING_VIEW",variant,(sx,sy),(sx2,sy2))
  v.co=old_inverse@np
  count+=1;mx=max(mx,abs(dz));max_x=max(max_x,sx2)
 for face in o.data.polygons:
  s=sum(weights[i] for i in face.vertices)/len(face.vertices)
  face.material_index=1 if s>.15 else 0
 o.data.update()
 assert count>250 and mx>3.0,("K4CF_CLIFF_INVISIBLE_OR_FLAT",variant,count,mx)
 assert meshfingerprint(o)!=rocksha and meshfingerprint(rock)==rocksha
 o.hide_render=(variant=="B")
 variants[variant]=o
 audit_shape[variant]={"realSculptedVertices":count,"maxHeightDeltaWorldMetres":mx,
                       "maxProjectedXOfAffectedVertices":max_x,
                       "totalEditableVertices":len(o.data.vertices),
                       "geologyMeshSHA256":meshfingerprint(o)}
# The K4CC research rock is still an editable original and fully unchanged;
# it is hidden only in this K4CF output so A/B cannot z-fight. The backed
# original source slope from K4BQ remains visually and structurally intact.
rock.hide_render=True
assert not variants["A"].hide_render and variants["B"].hide_render
assert all(o.get("NOT_GAME_COLLIDER") is True for o in variants.values())
assert poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_lock
assert {roadsha(o) for o in roads}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==treeposes
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==lightstates
for name,state in original.items():
 ob=bpy.data.objects[name]
 if ob is rock:
  assert ob.hide_render and not state[0]
  assert (bool(ob.hide_viewport),tuple(tuple(r) for r in ob.matrix_world),
          len(ob.data.vertices))==state[1:]
 else:
  assert (bool(ob.hide_render),bool(ob.hide_viewport),
          tuple(tuple(r) for r in ob.matrix_world),
          len(ob.data.vertices) if ob.type=="MESH" else -1)==state,(name,"PARENT_CHANGED")
assert meshfingerprint(rock)==rocksha
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT_SHA
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CF_TWO_REAL_GEOLOGICAL_HEADLAND_DIRECTIONS_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
a=out/"K4CF_A_WARM_STRATIFIED_HEADLAND_TRUE_CHASE_NOT_GAME.png"
sc.render.filepath=str(a);bpy.ops.render.render(write_still=True)
variants["A"].hide_render=True
variants["B"].hide_render=False
b=out/"K4CF_B_DARK_FOLDED_ESCARPMENT_TRUE_CHASE_NOT_GAME.png"
sc.render.filepath=str(b);bpy.ops.render.render(write_still=True)
variants["A"].hide_render=False
variants["B"].hide_render=True
assert blend.stat().st_size>230_000_000 and a.stat().st_size>30000 and b.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cf.genuine-native-headland-art-directions/1",
 "parentK4CEExactSHA256":PARENT_SHA,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "K4BZ_bad_duplicate_road_hidden":True,
 "allSourceObjectsRetainedAndSourceGeometryUnmodified":True,
 "sourceRockEditableMeshUnmodifiedSHA256":rocksha,
 "K4CCOriginalResearchRockHiddenInK4CFRenderOnly":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,"newGameColliders":0,
 "realNewResearchMeshes":2,"noFakeImagesOrBillboards":True,
 "headlandRealGeometry":audit_shape,
 "defaultEditableBlendVariant":"A","renderEngine":"BLENDER_EEVEE",
 "originalChase768x480":True,"ART":"UNJUDGED_HOLD",
 "formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","HUMAN":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,a,b)}
}
(out/"K4CF_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CF_TRUE_EDITABLE_DCC_NATIVE_A_B_COMPLETE_ART_HOLD",
      json.dumps(audit_shape,ensure_ascii=False),flush=True)
