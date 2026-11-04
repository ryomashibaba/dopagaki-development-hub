"""K4CC source-locked coastal relief: replace failed A3 view-blocking study walls,
sculpt native existing non-game slope geometry, render exact true CHASE.
Only isolated DCC research. Original game / Road5 / native cameras never touched.
"""
import bpy, bmesh, hashlib, json, math, struct, sys
from collections import Counter
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(flag):
    return Path(argv[argv.index(flag)+1]).resolve()
parent=arg("--base"); out=arg("--out"); out.mkdir(parents=True,exist_ok=True)
PARENT_SHA="0b581f45de4d4e215515e8dbef9a4038c7f1b9bdb0e1935943c4445529193e6c"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(p):
    h=hashlib.sha256()
    with open(p,"rb") as f:
        for block in iter(lambda:f.read(1<<20),b""):
            h.update(block)
    return h.hexdigest()
assert sha(parent)==PARENT_SHA,("INVALID_TRUE_A3_PARENT_SHA",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
scene=bpy.context.scene
assert (scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
    return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
            for o in rig.objects if o.type=="CAMERA"}
source_poses=poses()
assert len(source_poses)>=6
cams=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cams)==1 and scene.camera==cams[0]
cam=cams[0]; frozen_chase=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
roads=[]
for label in ("CONTROL","ULTRA"):
    c=bpy.data.collections["K4AY SOURCE B48 | "+label+" | TRUE TESSELLATED ROAD5"]
    assert len(c.objects)==1
    roads.append(next(iter(c.objects)))
def road_hash(o):
    h=hashlib.sha256()
    for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
    for p in o.data.polygons:h.update(struct.pack("<3i",*[int(q) for q in p.vertices]))
    return h.hexdigest()
assert {road_hash(o) for o in roads}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
pine=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
canopy=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
coastal=[o for o in bpy.data.objects if o.name.startswith("K4CA | actual Poly Haven island_tree_02")]
assert (len(pine),len(canopy),len(coastal))==(8,1,2)
trees=pine+canopy+coastal
frozen_trees={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
frozen_lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
preexisting={o.name:(bool(o.hide_render),bool(o.hide_viewport)) for o in bpy.data.objects}
research_a3=[o for o in bpy.data.objects if o.name.startswith("K4CB A3 | ") and o.type=="MESH"]
assert len(research_a3)==10,("A3_EDITABLE_OBJECT_COUNT_CHANGED",len(research_a3))
a3_geometry={o.name:(len(o.data.vertices),len(o.data.polygons),tuple(tuple(row) for row in o.matrix_world))
             for o in research_a3}
# A3 rendered the occupied port as a blind beige wall. Remove only
# FIVE *research-only* opaque obstructions from this experiment's rendering.
# Their mesh datablocks, transforms and viewport editability are retained.
sup_tokens=("deep boat service hall western sidewall",
            "deep boat service hall eastern sidewall",
            "single continuous monumental head beam",
            "monolithic entrance shoulder -1",
            "monolithic entrance shoulder 1")
suppressed=[]
for token in sup_tokens:
    matches=[o for o in research_a3 if token in o.name]
    assert len(matches)==1,("AMBIGUOUS_RESEARCH_WALL",token,[o.name for o in matches])
    ob=matches[0]
    assert ob.get("NOT_GAME_COLLIDER") is True and ob.get("DCC_RESEARCH_ONLY") is True
    assert ob.hide_render is False
    ob.hide_render=True
    suppressed.append(ob.name)
# Actual native-camera pixel rays: resolve the visible left slope and avoid
# ever generating a camera-aligned replacement image or touching a road.
def ray(px,py):
    fr=cam.data.view_frame(scene=scene)
    x0=min(v.x for v in fr);x1=max(v.x for v in fr)
    y0=min(v.y for v in fr);y1=max(v.y for v in fr)
    z=sum(v.z for v in fr)/len(fr)
    q=Vector((x0+(x1-x0)*(px+.5)/768,y0+(y1-y0)*(1-(py+.5)/480),z))
    origin=cam.matrix_world.translation.copy()
    direction=(cam.matrix_world.to_quaternion()@q).normalized()
    cursor=origin.copy()
    for i in range(25):
        ok,loc,normal,index,ob,matrix=scene.ray_cast(bpy.context.evaluated_depsgraph_get(),cursor,direction,distance=2000)
        if not ok:return None
        if ob.type=="MESH" and not ob.hide_render:
            return ob.name
        cursor=loc+direction*.13
    return None
samples=[(48,245),(67,265),(87,325),(110,290),(123,348),(151,254),
         (165,296),(202,274),(205,330),(51,350),(139,256),(97,278)]
hits=[ray(*pt) for pt in samples]
counts=Counter(name for name in hits if name and "K4" in name)
assert counts,("LEFT_TERRAIN_CAMERA_RAYS_FAILED",hits)
slopename,n=counts.most_common(1)[0]
assert n>=4,("LEFT_SCENE_NO_CONSISTENT_GROUND",dict(counts))
slope=bpy.data.objects[slopename]
assert slope.type=="MESH" and slope not in roads and slope!=bad and slope!=good
assert slope not in research_a3
assert "SOURCE PHYSICAL ROAD" not in slopename
assert not slope.hide_render and len(slope.data.vertices)>100
def fingerprint(ob):
    h=hashlib.sha256()
    for v in ob.data.vertices:h.update(struct.pack("<3d",*[float(k) for k in v.co]))
    for p in ob.data.polygons:
        h.update(struct.pack("<I",len(p.vertices)))
        for vi in p.vertices:h.update(struct.pack("<I",int(vi)))
    return h.hexdigest()
slope_before=fingerprint(slope)
origin_materials=[m.name for m in slope.data.materials]
# Create a real spatial 3D copy of a *non-game* terrain mesh. Save original
# unchanged but hide original for the research render only. No road skin.
coll=bpy.data.collections.new("K4CC | true sculpted windward geology | NEVER GAME COLLIDER")
scene.collection.children.link(coll)
sculpt=slope.copy();sculpt.data=slope.data.copy()
sculpt.name="K4CC | TRUE_EDITABLE_NATIVE_ROCK_RELIEF | NO_GAME_COLLIDER"
coll.objects.link(sculpt)
sculpt["DCC_RESEARCH_ONLY"]=True;sculpt["NOT_GAME_COLLIDER"]=True
sculpt["SOURCE_TERRAIN_FINGERPRINT"]=slope_before
slope.hide_render=False
# Keep the untouched source terrain as continuous backing below the sculpted research relief.
bm=bmesh.new();bm.from_mesh(sculpt.data)
# The incoming study slope is relatively coarse: actual subdivided mesh
# before per-vertex geological sculpting, never a parallax/fake image.
bmesh.ops.subdivide_edges(bm,edges=list(bm.edges),cuts=2,use_grid_fill=True)
bm.to_mesh(sculpt.data);bm.free();sculpt.data.update()
world=sculpt.matrix_world.copy()
inv=world.inverted_safe()
modified=0;max_delta=0.;oldverts=len(slope.data.vertices)
for vertex in sculpt.data.vertices:
    p=world@vertex.co
    q=world_to_camera_view(scene,cam,p)
    if q.z<=0:continue
    x=float(q.x);y=float(q.y)
    # Geological escarpment concentrated on actual LEFT slope rather than
    # the game/racing road: off-road and below the far ridge horizon.
    edge_in=max(0.,min(1.,(x-.015)/.035))
    edge_out=max(0.,min(1.,(.338-x)/.060))
    rise=max(0.,min(1.,(y-.29)/.105))
    recede=max(0.,min(1.,(.77-y)/.115))
    coverage=edge_in*edge_out*rise*recede
    # A small constant elevation keeps the duplicate above the unchanged original terrain,
    # which remains visible as a seam-free backing at the shoulder.
    if coverage<=.001:
        vertex.co=inv@(p+Vector((0.,0.,.055)))
        continue
    ridge1=3.75*math.exp(-((x-.139)/.081)**2-((y-.535)/.092)**2)
    ridge2=2.65*math.exp(-((x-.267)/.066)**2-((y-.525)/.082)**2)
    gully=2.25*math.exp(-((x-.211)/.026)**2-((y-.520)/.12)**2)
    # Physically volumetric, non-repeating creases; medium geologic bedding
    # adds relief at driving speed without random point-by-point spikes.
    bedding=(.56*math.sin(p.x*.31+p.y*.14)+
             .24*math.sin(p.x*.59-p.y*.37))
    dz=.055+coverage*max(0.,ridge1+ridge2-gully+bedding)
    if abs(dz)<.012:continue
    vertex.co=inv@(p+Vector((0.,0.,dz)))
    modified+=1;max_delta=max(max_delta,abs(dz))
assert modified>=80 and max_delta>=1.0,("A4_NOT_TRUE_MESH_SCULPT",modified,max_delta,oldverts,len(sculpt.data.vertices))
assert fingerprint(slope)==slope_before,("FROZEN_PARENT_TERRAIN_EDITED",slopename)
assert fingerprint(sculpt)!=slope_before
# Natural rock bedding: multi-scale position-driven surface grain and
# erosional dampness. Actual editable Blender shader, no raster mockup.
mat=bpy.data.materials.new("K4CC | stratified coastal limestone and mineral erosion native")
mat.use_nodes=True
N=mat.node_tree.nodes;N.clear();L=mat.node_tree.links
outnode=N.new("ShaderNodeOutputMaterial");shader=N.new("ShaderNodeBsdfPrincipled")
shader.inputs["Roughness"].default_value=.88
shader.inputs["Metallic"].default_value=0.
L.new(shader.outputs["BSDF"],outnode.inputs["Surface"])
geo=N.new("ShaderNodeNewGeometry")
noise=N.new("ShaderNodeTexNoise");noise.inputs["Scale"].default_value=.15
noise.inputs["Detail"].default_value=6.
noise.inputs["Roughness"].default_value=.78
L.new(geo.outputs["Position"],noise.inputs["Vector"])
colors=N.new("ShaderNodeValToRGB")
colors.color_ramp.elements.remove(colors.color_ramp.elements[1])
for k,(loc,shade) in enumerate([
    (.12,(.125,.137,.133,1)),(.31,(.225,.232,.207,1)),
    (.49,(.345,.337,.294,1)),(.69,(.422,.405,.351,1)),
    (.84,(.511,.490,.423,1))]):
    el=colors.color_ramp.elements[0] if k==0 else colors.color_ramp.elements.new(loc)
    el.position=loc;el.color=shade
L.new(noise.outputs["Fac"],colors.inputs["Fac"])
L.new(colors.outputs["Color"],shader.inputs["Base Color"])
fine=N.new("ShaderNodeTexNoise");fine.inputs["Scale"].default_value=3.8
fine.inputs["Detail"].default_value=3.
L.new(geo.outputs["Position"],fine.inputs["Vector"])
bump=N.new("ShaderNodeBump")
bump.inputs["Strength"].default_value=.22
bump.inputs["Distance"].default_value=.12
L.new(fine.outputs["Fac"],bump.inputs["Height"])
L.new(bump.outputs["Normal"],shader.inputs["Normal"])
sculpt.data.materials.clear();sculpt.data.materials.append(mat)
# Invariance checks include all frozen SOURCE geometry, camera, trees and
# lights. Existing study meshes remain the same editable objects.
assert poses()==source_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==frozen_chase
assert {road_hash(o) for o in roads}=={ROAD}
assert fingerprint(slope)==slope_before
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==frozen_trees
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==frozen_lights
assert {o.name:(len(o.data.vertices),len(o.data.polygons),tuple(tuple(row) for row in o.matrix_world)) for o in research_a3}==a3_geometry
assert bad.hide_render and not good.hide_render
assert all((bool(bpy.data.objects[n].hide_render),bool(bpy.data.objects[n].hide_viewport))==v
           for n,v in preexisting.items() if n not in set(suppressed))
assert all(bpy.data.objects[n].hide_render for n in suppressed)
assert not slope.hide_render and not sculpt.hide_render
assert sha(parent)==PARENT_SHA
scene.camera=cam;scene.render.engine="BLENDER_EEVEE"
scene.render.resolution_x=768;scene.render.resolution_y=480;scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG"
try:scene.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CC_COASTAL_RELIEF_EDITABLE_DCC_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CC_TRUE_SAME_CHASE_COASTAL_RELIEF_NOT_GAME.png"
scene.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cc.true-native-coastal-relief/1",
 "parentK4CB_A3_exact_sha256":PARENT_SHA,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "K4BZ_bad_duplicate_road_hidden":True,"originalResearchA3MeshesUnedited":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,"newGameColliders":0,
 "noExtraRoadSurfaceAdded":True,"researchOnlyVisibilityChanges":suppressed,
 "sourceTerrainRenderedBehindRaisedSculpt":True,
 "newResearchTerrainMesh":sculpt.name,"terrainSourceObject":slope.name,
 "sourceTerrainMeshFingerprint":slope_before,
 "sourceTerrainMaterialNames":origin_materials,
 "subdividedRealTerrainOldVertexCount":oldverts,
 "sculptedRealTerrainNewVertexCount":len(sculpt.data.vertices),
 "sculptedVertexCount":modified,"maximumTrueRockVerticalReliefMetres":max_delta,
 "raycastVisibleLeftGroundSamples":dict(counts),
 "realResearchMeshAdded":1,"sourceTerrainObjectRetained":True,
 "originalChase768x480":True,"renderEngine":"BLENDER_EEVEE",
 "materialClaims":"Editable authored procedural geological mineral strata. Not photoscan nor original Slope source.",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CC_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CC_TRUE_NATIVE_RENDER_COMPLETE_ART_HOLD",json.dumps(
 {"sculptedVertices":modified,"reliefMaxM":max_delta,
  "slope":slope.name,"suppressedResearchWalls":suppressed},ensure_ascii=False),flush=True)
