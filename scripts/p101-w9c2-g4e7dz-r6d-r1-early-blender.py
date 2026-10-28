# R6D-R1 PRIVATE genuine earlier-source camera renders; no new urban art.
import bpy, math, json, os, sys
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:]
def arg(s):
 assert s in args,s
 return args[args.index(s)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
d=json.load(open(arg('--native'),encoding='utf-8'))
assert d['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert d['road']==road and len(d['frames'])==13
assert len(d['originalTrajectoryParity'])==7
assert d['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert scene.get('DR_ACTUAL_B48_MESH_COUNT')==7
assert scene.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert scene.get('DR_ACTUAL_B48_VOID_CELL52') is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(cx),len(b48),len(b51),len(cams.objects))==(18,7,28,5)
def provenance():
 return {
  'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
  'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
  'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51),
  'cameras':sorted((o.name,float(o['true_240hz_time']),tuple(round(x,4) for x in o.location)) for o in cams.objects)
 }
source_before=provenance()
# Hide previous R6D B51 visual-only proxies while keeping original source intact.
for o in bpy.data.objects:
 if o.get('R6D_SOURCE_B51_ID'):o.hide_render=True
camera_collection=bpy.data.collections.new('R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION')
scene.collection.children.link(camera_collection)
mover_collection=bpy.data.collections.new('R6D-R1 PRIVATE EARLY B51 POSES NOT GAME COLLIDERS')
scene.collection.children.link(mover_collection)
frame_cams={}
projection={}
for f in d['frames']:
 id=f['id']
 original=cams.objects.get(id+' REAL ORIGINAL 240HZ')
 if original:
  cam=original
  assert abs(float(cam['true_240hz_time'])-f['seconds'])<.0001
 else:
  lens=bpy.data.cameras.new('R1 EXPORTED PHYSICAL VIEW '+id)
  lens.type='PERSP';lens.sensor_fit='VERTICAL';lens.sensor_height=36
  lens.lens=36*1.35/2;lens.clip_start=1.4;lens.clip_end=9000
  cam=bpy.data.objects.new('R1 '+id+' SOURCE CAMERA',lens)
  camera_collection.objects.link(cam)
  eye=Vector(f['eye']);front=Vector(f['front'])
  right=front.cross(Vector((0,1,0))).normalized()
  up=right.cross(front).normalized()
  cam.location=eye;cam.rotation_mode='QUATERNION'
  cam.rotation_quaternion=Matrix(((right.x,up.x,-front.x),
                                  (right.y,up.y,-front.y),
                                  (right.z,up.z,-front.z))).to_quaternion()
  cam['R1_EXTRA_NATIVE_240HZ_SCRIPT_ONLY']=True
  cam['nativeOriginalTick']=f['tick']
 bpy.context.view_layer.update()
 eye=Vector(f['eye']);front=Vector(f['front'])
 right=front.cross(Vector((0,1,0))).normalized()
 up=right.cross(front).normalized()
 probe=eye+front*100+right*16+up*7
 ndc=world_to_camera_view(scene,cam,probe)
 z=(probe-eye).dot(front)
 x=.5+.5*1.35*(probe-eye).dot(right)/(z*(1008/645))
 y=.5+.5*1.35*(probe-eye).dot(up)/z
 error=max(abs(ndc.x-x),abs(ndc.y-y))
 assert error<.0001,(id,error)
 projection[id]=error;frame_cams[id]=cam
assert len(camera_collection.objects)==8 and len(frame_cams)==13
proxies={}
for source in b51:
 obj=source.copy();obj.data=source.data.copy()
 obj.animation_data_clear()
 id=source['SOURCE_ORIGINAL_B51_ID']
 obj.name='R1 TRANSIENT SOURCE OBB '+id
 mover_collection.objects.link(obj)
 del obj['SOURCE_ORIGINAL_B51_ID']
 obj['R1_B51_ID']=id
 obj['R1_NOT_NEW_GAME_COLLIDER']=True
 obj.rotation_mode='XYZ'
 proxies[id]=obj
assert len(proxies)==28
for fi,f in enumerate(d['frames'],1):
 assert len(f['moving'])==28 and {p['id'] for p in f['moving']}==set(proxies)
 for p in f['moving']:
  obj=proxies[p['id']]
  obj.location=tuple(p['center'])
  obj.rotation_euler=(0,p['yawRadians'],0)
  obj.scale=tuple(p['halfSize'])
  obj.hide_render=not p['enabled']
  for field in ('location','rotation_euler','scale','hide_render'):
   obj.keyframe_insert(data_path=field,frame=fi)
for o in proxies.values():
 action=o.animation_data.action
 if hasattr(action,'fcurves'):
  for fc in action.fcurves:
   for key in fc.keyframe_points:key.interpolation='CONSTANT'
assert source_before==provenance()
scene.frame_start=1;scene.frame_end=13;scene.frame_set(1)
scene.camera=frame_cams['t1100']
scene['R1_NATIVE_CAMERA_11_TO_17_SOURCE_ONLY']=True
scene['R1_NEW_CITY_MESHES']=0
scene['R1_NEW_GAME_COLLIDERS']=0
scene['R1_GAME_CHANGED']=False
scene['R1_ART']=scene['R1_GAMEPLAY']=scene['R1_RELEASE']='HOLD'
scene.cycles.device='CPU';scene.cycles.samples=2
scene.cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
blend='R1_'+road+'_11TO17_TRUE_NATIVE_EDITABLE_PRIVATE.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
images=[]
for fi,f in enumerate(d['frames'],1):
 scene.frame_set(fi);scene.camera=frame_cams[f['id']]
 bpy.context.view_layer.update()
 p='R1_'+road+'_'+f['id']+'_TRUE_BLENDER_SOURCE_NOT_WEBGL.png'
 scene.render.filepath=os.path.join(out,p)
 bpy.ops.render.render(write_still=True)
 images.append(p)
assert source_before==provenance()
audit={
 'schema':'dopagaki.g4e7dz-r6d-r1-early-blender/1',
 'road':road,'sourceCX':18,'originalB48':7,'originalB51':28,
 'originalProtectedCameraCount':5,'earlierNewPrivateCameras':8,
 'originalSourceIdentityPreserved':True,
 'nativeScriptSourceParity':len(d['originalTrajectoryParity']),
 'nativeCameraMaxProjectionErrorNdc':max(projection.values()),
 'frames':13,'trueBlenderPngs':images,'editableBlender':blend,
 'unbounded240HzCollision':'NOT_CERTIFIED',
 'newCityMeshes':0,'newGameColliders':0,
 'newCityWebGL':'NOT_RENDERED','human':'NOT_RUN',
 'fourBeatVisuals':'PENDING_REAL_IMAGE_REVIEW',
 'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
with open(os.path.join(out,'R1_'+road+'_AUDIT.json'),'w',encoding='utf-8') as f:json.dump(audit,f,indent=2,ensure_ascii=False)
print('R6D_R1_REAL_EARLY_NATIVE_BLENDER',road,len(images),blend)
