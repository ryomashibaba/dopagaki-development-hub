"""K4BZ shadow-vs-overlapping-surface controlled true Blender A/B.

From exact original K4BY A3 native.blend, hide ONLY the diagnosed K4BY
new photo pavement ribbon in an isolated research copy and rerender same
source-locked CHASE. Do NOT alter actual SOURCE Road5, cameras, trees,
lights, texture source or game. This is a controlled visual ablation.
"""
import bpy,sys,hashlib,struct,json
from pathlib import Path
argv=sys.argv[sys.argv.index('--')+1:]
def patharg(x):return Path(argv[argv.index(x)+1]).resolve()
BASE=patharg('--base');OUT=patharg('--out');OUT.mkdir(parents=True,exist_ok=True)
SHA="f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
def digest(path):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for data in iter(lambda:f.read(1<<20),b''):h.update(data)
 return h.hexdigest()
assert digest(BASE)==SHA
bpy.ops.wm.open_mainfile(filepath=str(BASE))
sc=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def camera_poses():
 return {x.name:(tuple(x.location),tuple(x.rotation_euler),x.data.lens)
         for x in rig.objects if x.type=="CAMERA"}
poses=camera_poses()
assert len(poses)>=6
cam=[x for x in bpy.data.objects if x.type=="CAMERA" and x.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cam)==1
cam=cam[0];frozen=(tuple(cam.location),tuple(cam.rotation_euler),cam.data.lens)
assert sc.camera==cam
sources=[]
for suffix in ("CONTROL","ULTRA"):
 collection=bpy.data.collections["K4AY SOURCE B48 | "+suffix+" | TRUE TESSELLATED ROAD5"]
 assert len(collection.objects)==1
 sources.append(next(iter(collection.objects)))
def shape(ob):
 h=hashlib.sha256()
 for v in ob.data.vertices:h.update(struct.pack("<3d",*[float(x) for x in v.co]))
 for p in ob.data.polygons:h.update(struct.pack("<3i",*[int(i) for i in p.vertices]))
 return h.hexdigest()
assert {shape(x) for x in sources}=={ROAD}
original_trees=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
new_trees=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
assert len(original_trees)==8 and len(new_trees)==1
tree_mat={o.name:tuple(tuple(row) for row in o.matrix_world) for o in original_trees+new_trees}
target_name="K4BY | actual source raycast 1m road surface | NO GAME COLLIDER"
target=bpy.data.objects.get(target_name)
assert target is not None and target.type=="MESH"
assert target.get('RESEARCH_DCC_ONLY') is True and target.get('NOT_GAME_COLLIDER') is True
assert target.hide_render is False
assert len(target.data.polygons)==3800
alt=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert alt is not None and alt.type=="MESH" and not alt.hide_render
assert alt.data.materials and alt.data.materials[0].name.startswith("K4BR | ACTUAL CC0 PHOTO PBR")
original_alt_state=alt.hide_render
original_light_states={x.name:(x.hide_render,float(x.data.energy)) for x in bpy.data.objects if x.type=="LIGHT"}
# Change ONLY the render flag of precisely identified non-game top mesh.
target.hide_render=True
assert alt.hide_render==original_alt_state
assert {x.name:(x.hide_render,float(x.data.energy)) for x in bpy.data.objects if x.type=="LIGHT"}==original_light_states
assert camera_poses()==poses and (tuple(cam.location),tuple(cam.rotation_euler),cam.data.lens)==frozen
assert {shape(x) for x in sources}=={ROAD}
assert all(tuple(tuple(row) for row in o.matrix_world)==tree_mat[o.name] for o in original_trees+new_trees)
assert digest(BASE)==SHA
assert sc.render.resolution_x==768 and sc.render.resolution_y==480
sc.camera=cam;sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
native=OUT/"K4BZ_ONE_OBJECT_DISABLED_PROVEN_ROAD_CROSSFADE_EDITABLE_DCC_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(native))
new_image=OUT/"K4BZ_SAME_CHASE_SINGLE_RAYCAST_PROXY_HIDDEN_REAL_AB_NOT_GAME.png"
sc.render.filepath=str(new_image)
bpy.ops.render.render(write_still=True)
assert native.stat().st_size>190000000
assert new_image.stat().st_size>50000
j={"schema":"dopagaki.k4bz.single-object-research-only-shading-ablation/1",
 "canonicalParentBlenderSHA256":SHA,
 "canonicalOriginalGameBlob":GAME,"canonicalRoad5VertexFaceSHA256":ROAD,
 "sourceRigSixCameraUnchanged":True,"researchChaseUnchanged":True,
 "originalNineTreesMatricesUnchanged":True,"allLightsIdentical":True,
 "onlyRenderVisibilityEdited":[target_name],
 "originalK4BYRoadRibbonHiddenRenderOnly":True,
 "existingPhotographicAlternateRoadRemainsVisible":True,
 "physicalOriginalRoad5Unchanged":True,"newGameColliders":0,"gameSourceEdited":False,
 "formalArtAccepted":0,"formalSlope2DNAMetres":0,
 "realFixedCameraBlenderRerender":True,
 "ART":"UNJUDGED_HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","HUMAN":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":digest(p)} for p in (native,new_image)}}
(OUT/'K4BZ_ONE_OBJECT_ABLATION_AUTHENTIC_NATIVE_AUDIT.json').write_text(
 json.dumps(j,indent=2,ensure_ascii=False),encoding='utf-8')
print("K4BZ_SINGLE_OBJECT_DISABLED_NATIVE_AB_RENDER_COMPLETED_WITHOUT_REAL_GAME_CHANGE",
      {"blend":j["files"][native.name],"image":j["files"][new_image.name]},flush=True)
