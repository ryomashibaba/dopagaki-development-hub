# G4E-7DZ R6D: extend the genuine DR PRIVATE Blender source to 10 native
# camera snapshots (14–18.5s). This makes NO new city and NO game change.
# 240Hz point-sampled B51 data is NOT continuous-time collision certification.
import bpy, json, math, os, sys
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index('--')+1:]
def arg(k):
    assert k in args,k
    return args[args.index(k)+1]
road=arg('--road')
assert road in ('true-pinch','pinch-switch')
out=arg('--out')
os.makedirs(out,exist_ok=True)
native=json.load(open(arg('--native'),encoding='utf-8'))
assert native['schema']=='dopagaki.g4e7dz-r6d-native-tenframe-timeline/1'
assert native['road']==road and native['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert native['sourceB48']==7 and native['sourceB51']==28 and native['sourceGap52']
assert native['sourceOriginalBlenderCameras']==5 and native['sourcePhysicsHz']==240
shots=native['frames']
expected=['t1400','t1450','t1500','t1550','t1600','t1650','t1700','t1750','t1800','t1850']
assert [x['id'] for x in shots]==expected
assert native['sourceMachine04TickStudy']['sampleCount']==1081
assert native['sourceMachine04TickStudy']['candidateCollisionCertification']=='NOT_TESTED'
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert scene.get('DR_ACTUAL_B48_MESH_COUNT')==7
assert scene.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert scene.get('DR_ACTUAL_B48_VOID_CELL52') is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
original_cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(cx),len(b48),len(b51),len(original_cams.objects))==(18,7,28,5)
assert set(x['SOURCE_ORIGINAL_B51_ID'] for x in b51)==set(p['id'] for p in shots[0]['sourceMoving'])

def signatures():
    return {
      'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
      'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
      'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51),
      'camera':sorted((o.name,float(o['true_240hz_time']),tuple(round(x,4) for x in o.location)) for o in original_cams.objects),
    }
before=signatures()
cam_collection=bpy.data.collections.new('R6D PRIVATE ORIGINAL EXTRA 240HZ CAMERA POSES')
scene.collection.children.link(cam_collection)
moving_collection=bpy.data.collections.new('R6D PRIVATE TEN-SNAPSHOT B51 VISUAL REPLAY / NOT COLLIDERS')
scene.collection.children.link(moving_collection)
camera_for={}
projection_errors={}
for frame in shots:
    id=frame['id']
    existing=original_cams.objects.get(id+' REAL ORIGINAL 240HZ')
    if existing:
        cam=existing
        assert abs(float(cam['true_240hz_time'])-frame['timeSeconds'])<.0001
        assert max(abs(cam.location[i]-frame['eye'][i]) for i in range(3))<.001
    else:
        lens=bpy.data.cameras.new('R6D real sampled game projection '+id)
        lens.type='PERSP'
        lens.sensor_fit='VERTICAL'
        lens.sensor_height=36
        lens.lens=36*1.35/2
        lens.clip_start=1.4
        lens.clip_end=9000
        cam=bpy.data.objects.new('R6D '+id+' REAL ORIGINAL 240HZ EXTRA',lens)
        cam_collection.objects.link(cam)
        eye=Vector(frame['eye'])
        right,up,front=frame['right'],frame['up'],frame['front']
        cam.location=eye
        cam.rotation_mode='QUATERNION'
        cam.rotation_quaternion=Matrix(((right[0],up[0],-front[0]),
                                        (right[1],up[1],-front[1]),
                                        (right[2],up[2],-front[2]))).to_quaternion()
        cam['R6D_UNALTERED_NATIVE_SOURCE_EXTRA']=True
        cam['R6D_REAL_SOURCE_TICK']=frame['tick']
    bpy.context.view_layer.update()
    eye,front,right,up=map(Vector,(frame['eye'],frame['front'],frame['right'],frame['up']))
    probe=eye+front*100+right*16+up*7
    projected=world_to_camera_view(scene,cam,probe)
    expected_ndc=(frame['projectionProbePixels'][0]/1008,1-frame['projectionProbePixels'][1]/645)
    error=max(abs(projected.x-expected_ndc[0]),abs(projected.y-expected_ndc[1]))
    assert error<.0001,(road,id,error,expected_ndc,(projected.x,projected.y))
    projection_errors[id]=error
    camera_for[id]=cam
assert len(cam_collection.objects)==5
assert len(camera_for)==10

proxies={}
for source in b51:
    o=source.copy()
    o.data=source.data.copy()
    o.animation_data_clear()
    o.name='R6D TIMELINE DISPLAY '+source['SOURCE_ORIGINAL_B51_ID']
    moving_collection.objects.link(o)
    id=source['SOURCE_ORIGINAL_B51_ID']
    del o['SOURCE_ORIGINAL_B51_ID']
    o['R6D_SOURCE_B51_ID']=id
    o['R6D_DIAGNOSTIC_ONLY_NOT_COLLIDER']=True
    o.rotation_mode='XYZ'
    source.hide_render=True
    proxies[id]=o
assert len(proxies)==28
for fi,frame in enumerate(shots,1):
    assert len(frame['sourceMoving'])==28
    assert {p['id'] for p in frame['sourceMoving']}==set(proxies)
    for p in frame['sourceMoving']:
        obj=proxies[p['id']]
        obj.location=tuple(p['center'])
        obj.rotation_euler=(0,p['yawRadians'],0)
        obj.scale=tuple(p['halfSize'])
        obj.hide_render=not p['enabled']
        for attr in ('location','rotation_euler','scale','hide_render'):
            obj.keyframe_insert(data_path=attr,frame=fi)
for o in proxies.values():
    action=o.animation_data.action
    if hasattr(action,'fcurves'):
        for curve in action.fcurves:
            for key in curve.keyframe_points:key.interpolation='CONSTANT'
assert before==signatures(),'original source identity changed'
scene.frame_start=1
scene.frame_end=10
scene.frame_set(1)
scene.camera=camera_for['t1400']
scene['R6D_PRIVATE_SOURCE_TIME_SEQUENCE']=True
scene['R6D_ORIGINAL_GAME_CHANGED']=False
scene['R6D_NEW_GAME_COLLIDERS']=0
scene['R6D_NEW_CITY_MESHES']=0
scene['R6D_ART']=scene['R6D_HUMAN']=scene['R6D_RELEASE']='HOLD'
scene['R6D_B51_CERTIFIED_CONTINUOUS_SAFETY']=False
scene.cycles.device='CPU'
scene.cycles.samples=2
scene.cycles.use_denoising=False
scene.render.threads_mode='FIXED'
scene.render.threads=2
scene.render.image_settings.file_format='PNG'
blend='R6D_'+road+'_ORIGINAL_TENFRAME_CAMERAS_B51_EDITABLE_PRIVATE_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for fi,frame in enumerate(shots,1):
    scene.frame_set(fi)
    scene.camera=camera_for[frame['id']]
    bpy.context.view_layer.update()
    file='R6D_'+road+'_'+frame['id']+'_GENUINE_BLENDER_NOT_GAME_WEBGL.png'
    scene.render.filepath=os.path.join(out,file)
    bpy.ops.render.render(write_still=True)
    renders.append(file)
after=signatures()
assert before==after
assert sum(o.get('SOURCE_ORIGINAL_B51_ID') is not None for o in bpy.data.objects)==28
assert sum(o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER') is not None for o in bpy.data.objects)==7
audit={
  'schema':'dopagaki.g4e7dz-r6d-extended-original-blender/1',
  'road':road,'sourceCX':18,'sourceB48':7,'sourceB51':28,
  'originalUnchangedCameras':5,'newExactNativeSampledCameras':5,
  'authenticNativeFrameCount':10,
  'sourceIdentityPreserved':before==after,
  'sourceGameChanged':False,'newCityMeshes':0,'newGameColliders':0,
  'originalSources':'UNCHANGED_G4E7DR_REFERENCE_BLENDER_PLUS_R6D_NATIVE_TIMELINE',
  'cameraProjectionErrorNdcMax':max(projection_errors.values()),
  'renderedOriginalNativeBlenderFrames':renders,
  'editableBlender':blend,
  'machine04TickSamples':native['sourceMachine04TickStudy']['sampleCount'],
  'machine04TickAabb':native['sourceMachine04TickStudy']['sampleAabb'],
  'machine04ContinuousTimeOccupancy':'NOT_CERTIFIED',
  'sourceB51DynamicCollisionWithNewCity':'NOT_TESTED_NO_NEW_CITY',
  't1850':'OFF_ROAD_DIAGNOSTIC_DO_NOT_ASSIGN_APPROVED_BEAT',
  'fourBeatVisualLegibility':'PENDING_HUMAN_IMAGE_REVIEW',
  'realNewCityWebGL':'NOT_RENDERED',
  'officialArt':0,'officialSlope2Metres':0,
  'TECH':'SOURCE_REFERENCES_ONLY','ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
  'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
with open(os.path.join(out,'R6D_'+road+'_AUDIT.json'),'w',encoding='utf-8') as f:
    json.dump(audit,f,ensure_ascii=False,indent=2)
print('R6D_PRIVATE_REAL_TENFRAME_BLENDER_NOT_WEBGL',road,len(renders),blend)
