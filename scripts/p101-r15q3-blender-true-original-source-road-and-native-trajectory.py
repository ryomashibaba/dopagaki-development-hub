"""R15Q3 original B48 actual mesh/true 240Hz path comparison technical renders.

Uses native OBJ exported directly from ORIGINAL tessellate() function, plus
stored actual original 240Hz Runner sampled positions. No fake game camera,
no invented scenery, no additional road collider, no art/gameplay certification.
Produces 8 real editable BLEND, 8 GLB, 8 3/4 analysis camera PNG.
"""
import bpy,sys,os,math,json,hashlib
from mathutils import Vector
args=sys.argv[sys.argv.index("--")+1:]
def arg(n):
 assert n in args,n
 return args[args.index(n)+1]
root=arg("--source")
out=arg("--out")
os.makedirs(out,exist_ok=True)
data=json.load(open(os.path.join(root,"R15Q3_SOURCE_EIGHT_REAL_MESH_SCENES_MANIFEST.json"),encoding="utf8"))
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
assert data["originalGameSourceBlob"]==SHA
def material(name,rgb,metal=.14,rough=.55,emission=0):
 m=bpy.data.materials.new(name);m.use_nodes=True
 m.diffuse_color=(*rgb,1)
 p=m.node_tree.nodes.get("Principled BSDF")
 p.inputs["Base Color"].default_value=(*rgb,1)
 p.inputs["Metallic"].default_value=metal
 p.inputs["Roughness"].default_value=rough
 if emission:
  p.inputs["Emission Color"].default_value=(*rgb,1)
  p.inputs["Emission Strength"].default_value=emission
 return m
audit={"schema":"dopagaki.r15q3-eight-original-b48-editable-blend-glb-source-path-renders/1",
 "originalGameSourceBlob":SHA,"sourceTrulyOriginalNative240Hz":True,
 "originalGameWebGL":False,"actualOriginalPlayerCamera":False,
 "technicalComparisonCameraNotSourcePlayerCamera":True,
 "actualBuiltGameWorldChanged":False,"newGameColliders":0,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","RELEASE":"HOLD",
 "scenes":{}}
for item in data["pairedRoadAssets"]:
 road=item["road"];mode=item["mode"]
 folder=os.path.join(root,item["relativeFolder"])
 trial=json.load(open(os.path.join(folder,"R15Q3_SOURCE_ROAD_AND_TRUE_240HZ_SAMPLE_TRAIL.json"),encoding="utf8"))
 assert trial["sourceGameBlob"]==SHA
 assert trial["road"]==road and trial["mode"]==mode
 assert trial["sourcePhysicsHz"]==240
 points=trial["actualOriginal240HzQuarterSecondSampledPlayerPositionAndSupport"]
 assert len(points)==item["realNativeSampledTrailPoints"]
 bpy.ops.wm.read_factory_settings(use_empty=True)
 scene=bpy.context.scene
 before=set(o.name for o in bpy.data.objects)
 bpy.ops.wm.obj_import(filepath=os.path.join(folder,item["actualSourceMeshOBJ"]),forward_axis="Y",up_axis="Z")
 # Blender OBJ source convention Y-up is explicitly overridden below
 # to retain the unchanged game world XYZ. Blender's native OBJ import
 # arguments affect coordinate conversion; set axes to negative Z / Y
 # only after verification via original mesh vertices.
 meshes=[o for o in scene.objects if o.type=="MESH" and o.name not in before]
 assert len(meshes)==2,("EXPECTED_TWO_REAL_B48_SOURCE_ROADS",road,mode,[o.name for o in meshes])
 # World coordinates must match original game XYZ exactly.
 # Use imported vertex local coordinates and matrix transform for source
 # point comparison against a source original CROWN/SCISSOR native trace.
 # Both game and Blender are Z-up in their own API? Blender is Z-up but
 # game is Y-up. Insert explicit world conversion X_game -> X_blender,
 # Y_game -> Z_blender, Z_game -> -Y_blender.
 from mathutils import Matrix
 conv=Matrix(((1,0,0,0),(0,0,-1,0),(0,1,0,0),(0,0,0,1)))
 # File OBJ imported with no built-in axis conversion is preferable:
 # any Blender importer rotation is overwritten with explicit conv.
 for o in meshes:o.matrix_world=conv
 mats={
  "crown":material("R15Q3 source original B48 CROWN/B16 structural dark steel",(.16,.24,.32),.49),
  "scissor":material("R15Q3 source actual physical B48 SCISSOR",(.52,.69,.79),.32),
  "grounded":material("R15Q3 true original runner sampled grounded",(.06,.91,.51),.19,emission=.35),
  "air":material("R15Q3 true original runner sampled air",(.97,.34,.12),.15,emission=.35),
  "line":material("R15Q3 source sampled trajectory connector, not continuous support",(.95,.76,.13),.12,emission=.15)}
 for o in meshes:
  o.data.materials.clear()
  if "B48_1_" in o.name:o.data.materials.append(mats["crown"])
  else:o.data.materials.append(mats["scissor"])
  o["SOURCE_B48_REAL_PHYSICS_TRIANGLES_ONLY"]=True
  o["REAL_GAME_COLLIDER_PRODUCTION"]=False
 def world(p):
  return Vector((float(p[0]),-float(p[2]),float(p[1])))
 allpos=[world(p["playerWorldXYZ"]) for p in points]
 curve=bpy.data.curves.new("Native original 240Hz sampled trace - NOT continuous line contact","CURVE")
 curve.dimensions="3D";curve.bevel_depth=.42;curve.bevel_resolution=2
 path=curve.splines.new("POLY");path.points.add(len(allpos)-1)
 for i,p in enumerate(allpos):path.points[i].co=(*p,1)
 line=bpy.data.objects.new("R15Q3 genuine native sampled player path - intervals are NOT certified support",curve)
 scene.collection.objects.link(line);curve.materials.append(mats["line"])
 countGround=0
 for i,p in enumerate(points):
  grounded=p["engineGrounded"]
  countGround+=1 if grounded else 0
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=(1.3 if grounded else 1.75),
    location=allpos[i])
  ball=bpy.context.object
  ball.name="Native240Hz actual sampled "+("GROUNDED " if grounded else "AIR ")+str(p["tick"])
  ball.data.materials.append(mats["grounded" if grounded else "air"])
  ball["sampledSourceTick"]=p["tick"];ball["exactNative240HzSampleGrounded"]=grounded
  ball["notFullContinuousPhysicsSupportBetweenSamples"]=True
 # Study camera aimed at the actual SOURCE SCISSOR rising entrance and native
 # trace. This is explicitly NOT a source game player camera/real game render.
 aim=world((-725,115,-40))
 bpy.ops.object.camera_add(location=aim+Vector((430,-370,490)))
 camera=bpy.context.object;camera.name="R15Q3 ANALYSIS 3_4_CAMERA NOT SOURCE PLAYER"
 direction=aim-camera.location;camera.rotation_euler=direction.to_track_quat("-Z","Y").to_euler()
 camera.data.type="ORTHO";camera.data.ortho_scale=820
 scene.camera=camera
 # Real mesh road source context, shaded with two area lights.
 for name,offset,power,size in [
  ("Key real original road",Vector((0,0,550)),4500,420),
  ("Fill 3D structural steel",Vector((-200,250,500)),3000,420)]:
  bpy.ops.object.light_add(type="AREA",location=aim+offset)
  light=bpy.context.object;light.name=name
  light.data.energy=power;light.data.shape="DISK";light.data.size=size
  direction=aim-light.location;light.rotation_euler=direction.to_track_quat("-Z","Y").to_euler()
 scene.world.color=(.10,.10,.12)
 scene.render.engine="CYCLES";scene.cycles.samples=8
 scene.cycles.device="CPU";scene.cycles.use_denoising=False
 scene.render.threads_mode="FIXED";scene.render.threads=2
 scene.render.resolution_x=1184;scene.render.resolution_y=768
 scene.render.resolution_percentage=100
 scene.render.image_settings.file_format="PNG"
 scene.render.film_transparent=False
 scene["R15Q3_NATIVE_ACTUAL_GAME_WEBGL"]=False
 scene["R15Q3_NATIVE_SOURCE_ORIGINAL_PLAYER_CAMERA"]=False
 scene["R15Q3_SOURCE_REAL_MESH_TESSELLATION"]=True
 scene["R15Q3_C1_ROAD_ART_REJECT_NOT_BEAUTY_RENDER"]=True
 dest=os.path.join(out,road,mode)
 os.makedirs(dest,exist_ok=True)
 png=os.path.join(dest,"R15Q3_SOURCE_"+road+"_"+mode+"_TECHNICAL_ORTHO.png")
 scene.render.filepath=png
 bpy.ops.render.render(write_still=True)
 blend=os.path.join(dest,"R15Q3_SOURCE_"+road+"_"+mode+"_EDITABLE_ORIGINAL_B48_STUDY.blend")
 bpy.ops.wm.save_as_mainfile(filepath=blend)
 for o in bpy.context.selected_objects:o.select_set(False)
 for o in scene.objects:
  if o.type in ("MESH","CURVE"):
   o.select_set(True)
 bpy.context.view_layer.objects.active=meshes[0]
 glb=os.path.join(dest,"R15Q3_SOURCE_"+road+"_"+mode+"_EDITABLE_MODEL.glb")
 bpy.ops.export_scene.gltf(filepath=glb,export_format="GLB",use_selection=True,
  export_animations=False)
 assert os.path.getsize(glb)>10000 and os.path.getsize(blend)>100000
 key=road+"|"+mode
 audit["scenes"][key]={
  "sourceActualRoadWorld":road,"sourceStudyMode":mode,
  "sourceOriginalPhysics240HzTrue":True,
  "twoRealOriginalB48SourceMeshes":len(meshes),
  "sampledNativePlayerPoints":len(points),
  "sampledNativePhysicallyGroundedPoints":countGround,
  "sampledNativeAirPoints":len(points)-countGround,
  "sampledNativeTraceNotContinuousSupport":True,
  "allActualNativeTriangulationSourceFaces":[s["sourceOriginalTriangleCount"] for s in trial["originalSourceRoadMeshes"]],
  "analysisCameraOnlyNotNativeOriginal":True,
  "actualNativeSourceRealRoadCodeEdited":False,
  "newGameColliders":0,"officialArt":0,"officialSlope2Meters":0,
  "outputRelative":os.path.relpath(dest,out),
  "BLEND":os.path.basename(blend),"GLB":os.path.basename(glb),"PNG":os.path.basename(png)}
 print("R15Q3_RENDERED_REAL_SOURCE_B48_AND_NATIVE_TRAIL",key,
  "mesh",len(meshes),"points",len(points),"actualGrounded",countGround,flush=True)
assert len(audit["scenes"])==8
with open(os.path.join(out,"R15Q3_EIGHT_REAL_SOURCE_MESHES_EDITOR_3D_AND_TRAILS_QA.json"),"w",encoding="utf8") as f:
 json.dump(audit,f,indent=2,ensure_ascii=False)
