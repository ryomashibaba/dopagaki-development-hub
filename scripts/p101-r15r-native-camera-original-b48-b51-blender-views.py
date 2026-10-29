"""R15R SOURCE NATIVE CAMERA VISUALS (not actual browser WebGL).

Reuse actual R15Q3 edit-ready Blender road meshes and source-native R15R 240Hz
replayed chase camera at exactly t=17,22,23. Each time also show 28 time-exact
moving B51 OBB collision-volume proxies from ORIGINAL source, not author-visible
B51 decorations. Research scene only; no new game collider, no ART approval.
"""
import bpy,sys,os,glob,json,math
from mathutils import Vector

argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):
 assert k in argv,k
 return argv[argv.index(k)+1]
src=arg("--source");camera_data=arg("--camera");dest=arg("--out")
os.makedirs(dest,exist_ok=True)
D=json.load(open(camera_data,encoding="utf8"))
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
assert D["originalSourceGameBlob"]==SHA
assert D["actualPhysicalTrialCount"]==8
worlds=["true-pinch","pinch-switch"]
modes=["B16_ONLY_REFERENCE","B_C1_SHIFT_40M_SOURCE_WIDTH","C_CURVE_SHIFT_30M_NARROW_16M"]
times=[17,22,23]
def w(p):
 return Vector((float(p[0]),-float(p[2]),float(p[1])))
def matt(name,color):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name)
 m.use_nodes=True;m.diffuse_color=(*color,1)
 bs=m.node_tree.nodes.get("Principled BSDF")
 bs.inputs["Base Color"].default_value=(*color,1)
 bs.inputs["Metallic"].default_value=.10
 bs.inputs["Roughness"].default_value=.5
 bs.inputs["Emission Color"].default_value=(*color,1)
 bs.inputs["Emission Strength"].default_value=.28
 return m
summary={"schema":"dopagaki.r15r-source-native-240hz-camera-and-b51-obb-original-two-b48-road-proxies/1",
 "originalGameBlob":SHA,"genuineRunnerCameraReplayed240Hz":True,
 "sourceGameWebGLShaderPerspectiveNormalizedScaleY":1.35,
 "sourcePerspectivePixelDimensions":[1008,645],
 "sourcePerspectiveEquivalentBlenderLensMM":round(18*1.35*645/1008,6),
 "sourceCameraMatchesOriginalGLSLPerspectiveNotOnlyEyeAndFront":True,
 "actualOriginalCameraMathFromGameSource":True,
 "actualBrowserWebGLRendered":False,"originalGameB51VisualMeshUsed":False,
 "sourceOriginalB51CollisionVolumeProxiesOnly":True,
 "sourceOriginalRoadsActualMeshCountPerScene":2,
 "sourceCameraNativeRoadWorlds":worlds,"sourceModes":modes,
 "noRealGameEditing":True,"newSourceColliders":0,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD",
 "scenes":{}}
for road in worlds:
 for mode in modes:
  key=road+"|"+mode
  files=glob.glob(os.path.join(src,road,mode,"*_EDITABLE_ORIGINAL_B48_STUDY.blend"))
  assert len(files)==1,(key,files)
  bpy.ops.wm.open_mainfile(filepath=os.path.abspath(files[0]))
  scene=bpy.context.scene
  assert scene["R15Q3_SOURCE_REAL_MESH_TESSELLATION"]
  realmesh=[o for o in scene.objects if o.type=="MESH" and o.get("SOURCE_B48_REAL_PHYSICS_TRIANGLES_ONLY")]
  assert len(realmesh)==2,(key,len(realmesh))
  for o in scene.objects:
   if o not in realmesh and (o.type=="CURVE" or o.name.startswith("Native240Hz")):o.hide_render=True
  samples=D["actualNativeCameraResults"][road][mode]["actualNativeQuarterSecondCameraFrames"]
  assert D["actualNativeCameraResults"][road][mode]["nativeOriginalGameReplayMatchingR15QStoredPhysics"]
  original_camera=bpy.data.objects.get("R15Q3 ANALYSIS 3_4_CAMERA NOT SOURCE PLAYER")
  if original_camera:original_camera.hide_render=True
  cam=bpy.data.cameras.new("R15R real source player camera 240Hz NOT WEBGL")
  cam_obj=bpy.data.objects.new("R15R original source-camera state not WebGL",cam)
  scene.collection.objects.link(cam_obj)
  cam.type="PERSP"
  # Source original WebGL shader: x_ndc=1.35*x/(aspect*z), y_ndc=1.35*y/z.
  # Blender horizontal sensor 36mm => lens=18*1.35/aspect (not arbitrary 30mm).
  cam.sensor_fit="HORIZONTAL";cam.sensor_width=36
  cam.lens=18*1.35*645/1008
  cam.clip_start=.65
  scene.camera=cam_obj
  scene.render.engine="CYCLES";scene.cycles.samples=8
  scene.cycles.device="CPU";scene.cycles.use_denoising=False
  scene.render.threads_mode="FIXED";scene.render.threads=2
  scene.render.resolution_x=1008;scene.render.resolution_y=645
  scene.render.resolution_percentage=100;scene.render.image_settings.file_format="PNG"
  scene.render.film_transparent=False
  if scene.world is None:scene.world=bpy.data.worlds.new("R15R SOURCE camera neutral")
  scene.world.color=(.14,.17,.21)
  color=matt("R15R exact original time B51 collision-volume proxy NOT visual B51 render",(.95,.23,.35))
  scene["R15R_TRUE_SOURCE_CHASE_CAMERA_REPLAYED"]=True
  scene["R15R_ORIGINAL_GAME_BROWSER_WEBGL"]=False
  scene["R15R_FAITHFUL_VISUAL_B51_MODEL"]=False
  scene["R15R_OFFICIAL_ART_HOLD"]=True
  per=[]
  for second in times:
   frames=[s for s in samples if abs(s["seconds"]-second)<.00001]
   assert len(frames)==1,(key,second,len(frames))
   sample=frames[0]
   assert sample["tick"]==int(second*240)
   assert len(sample["sourceRealB51TimeSyncedPhysicalOBBs"])==28
   eye=w(sample["sourceOriginalGameCameraEyeXYZ"])
   front=w(sample["sourceOriginalGameCameraFrontUnitXYZ"])
   assert abs(front.length-1)<.0001
   cam_obj.location=eye
   cam_obj.rotation_euler=front.to_track_quat("-Z","Y").to_euler()
   cam_obj.data.clip_end=12000
   boxes=[]
   for b in sample["sourceRealB51TimeSyncedPhysicalOBBs"]:
    if not b["enabled"]:continue
    center=w(b["centerXYZ"]);hx,hy,hz=b["halfSizeXYZ"]
    bpy.ops.mesh.primitive_cube_add(size=1,location=center)
    obj=bpy.context.object
    obj.name="SOURCE B51 original 3D OBB proxy (not rendered game) "+b["id"]
    obj.dimensions=(2*hx,2*hz,2*hy)
    obj.rotation_euler[2]=float(b["yawRadians"])
    obj.data.materials.append(color)
    obj["realSourceTimeSeconds"]=second
    obj["originalB51ID"]=b["id"]
    obj["sourceB51OBBNotVisibleAuthoredMesh"]=True
    boxes.append(obj)
   frame_dir=os.path.join(dest,road,mode)
   os.makedirs(frame_dir,exist_ok=True)
   pngname="R15R_TRUE_NATIVE_SOURCE_CAMERA_T"+str(second)+"_B51_PHYSICAL_OBBS_ONLY.png"
   png=os.path.join(frame_dir,pngname)
   scene.render.filepath=png
   bpy.ops.render.render(write_still=True)
   assert os.path.getsize(png)>12000
   per.append({"second":second,"tick":sample["tick"],
    "sourceNativeCameraEyeXYZ":sample["sourceOriginalGameCameraEyeXYZ"],
    "sourceNativeCameraFrontUnitXYZ":sample["sourceOriginalGameCameraFrontUnitXYZ"],
    "sourceActualB51TimeExactProxyCount":len(boxes),
    "sourceNativePlayerGrounded":sample["sourceNativeEngineGrounded"],
    "sourceNativeContactRoad":sample["sourceNativeContactRoad"],
    "image":os.path.relpath(png,dest),
    "originalWebGLOrArtApproved":False})
   if second==22:
    blendname="R15R_"+road+"_"+mode+"_T22_SOURCE_CAMERA_AND_ORIGINAL_B51_EDITABLE.blend"
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(frame_dir,blendname))
    assert os.path.getsize(os.path.join(frame_dir,blendname))>100000
   for b in boxes:bpy.data.objects.remove(b,do_unlink=True)
  summary["scenes"][key]={"nativeOriginalRealB48Meshes":len(realmesh),
   "sourceCameraSamples":per,"editableNativeCameraBLENDAt22":blendname,
   "actualSource28B51PhysicalVolumeOnly":True,
   "nativeGameWebGLRendered":False,
   "sourceGLSLPerspectiveEquivalentBlenderLensMM":round(cam.lens,6)}
  print("R15R_TRUE_SOURCE_CAMERA_BLENDER_B48_B51_SOURCE_ONLY",key,
   [p["second"] for p in per],flush=True)
assert len(summary["scenes"])==6
with open(os.path.join(dest,"R15R_TRUE_SOURCE_PLAYER_CAMERA_B48_B51_BLENDER_IMAGES_AND_EDITABLE_QA.json"),"w",encoding="utf8") as f:json.dump(summary,f,indent=2,ensure_ascii=False)
