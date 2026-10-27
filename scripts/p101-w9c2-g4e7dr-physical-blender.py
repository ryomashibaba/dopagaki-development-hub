# G4E-7DR native physical city evaluation stage / Blender NOT GAME WebGL.
# Load one unchanged DO authentic-camera editable scene, physically exact B48
# tessellation and the 28 actual moving-OBB volumes from original 240Hz ticks.
import bpy,os,sys,json,struct,hashlib,math
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def val(k):return args[args.index(k)+1]
src=json.load(open(val('--source'),encoding='utf-8'))
out=val('--out');os.makedirs(out,exist_ok=True)
assert src['schema']=='dopagaki.g4e7dr-original-b48-b51-private/1'
assert src['surfaces']==7 and src['movers']==28 and src['gap52Confirmed']
assert src['art']==src['human']==src['publish']=='HOLD'
binary=open(val('--binary'),'rb').read()
assert len(binary)==src['binaryBytes']
assert hashlib.sha256(binary).hexdigest()==src['binarySha256']
bpy.ops.wm.open_mainfile(filepath=val('--master'))
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert scene.get('DO_ROAD')==src['road']
cameras=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert cameras is not None and len(cameras.objects)==5
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
frozen=[(o.name,len(o.data.polygons),o['source_sha256']) for o in cx]
assert len(cx)==18
def collection(n):
 c=bpy.data.collections.new(n);scene.collection.children.link(c);return c
roads=collection('DR ACTUAL 7 B48 PHYSICAL MESHES / REVIEW ONLY')
hazards=collection('DR ACTUAL 28 B51 PHYSICAL ORIENTED BOXES / REVIEW ONLY')
guides=bpy.data.collections.get('DO B48 ROAD GUIDE CURVES / NOT ACTUAL PHYSICAL ROAD MESH')
if guides:
 for ob in guides.objects:ob.hide_render=True
def mat(name,rgb):
 m=bpy.data.materials.new(name);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*rgb,1)
 bs.inputs['Roughness'].default_value=.63
 m.diffuse_color=(*rgb,1)
 return m
roadMat=mat('DR PHYSICAL highway paint is Blender approximate NOT WEBGL',(.25,.40,.49))
underside=mat('DR PHYSICAL lower skin and true exposed gap walls',(.14,.21,.29))
roofMat=mat('DR PHYSICAL roof SOURCE material color proxy',(.40,.49,.58))
color={'slider':(.93,.42,.13),'rotator':(.94,.62,.18),'piston':(.75,.25,.53)}
hazardMats={k:mat('DR source OBB '+k+' non-game original skin',v) for k,v in color.items()}
sourceMeshes=[]
for info in src['b48']:
 i=info['index']
 assert i==len(sourceMeshes)
 offset=info['fileByteOffset'];length=info['fileByteLength']
 portion=binary[offset:offset+length]
 assert hashlib.sha256(portion).hexdigest()==info['sha256']
 pn=info['positionsScalarCount'];ix=info['indexCount']
 assert len(portion)==pn*8+ix*4 and pn%3==0 and ix%3==0
 xyz=struct.unpack_from('<%dd'%pn,portion,0)
 indices=struct.unpack_from('<%dI'%ix,portion,pn*8)
 assert all(k<pn//3 for k in indices)
 positions=[tuple(xyz[k:k+3]) for k in range(0,pn,3)]
 polygons=[tuple(indices[k:k+3]) for k in range(0,ix,3)]
 m=bpy.data.meshes.new('DR exact original game tessellation '+info['id'])
 m.from_pydata(positions,[],polygons);m.update()
 o=bpy.data.objects.new('B48 original physics '+info['id'],m)
 roads.objects.link(o)
 m.materials.append(roofMat if info['material']=='roof' else roadMat)
 m.materials.append(underside)
 for poly in m.polygons:
  if poly.index>=info['topIndexCount']//3:poly.material_index=1
 o['ORIGINAL_GAME_B48_SHA256']=info['sha256']
 o['MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER']=True
 sourceMeshes.append({'id':info['id'],'sourceSha256':info['sha256'],
  'vertices':len(positions),'faces':len(polygons)})
assert len(sourceMeshes)==7 and src['b48'][0]['gapProof']['topSlot52Absent']
corners=[(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),
         (-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]
faces=[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(0,3,7,4)]
cube=bpy.data.meshes.new('DR exact center halfsize yaw B51 OBB local unit volume')
cube.from_pydata(corners,[],faces);cube.update()
movers={}
for p in src['shots'][0]['moving']:
 o=bpy.data.objects.new('B51 physical volume '+p['id'],cube.copy())
 hazards.objects.link(o);o.rotation_mode='XYZ'
 o.scale=tuple(p['halfSize'])
 o.data.materials.append(hazardMats[p['type']])
 o['SOURCE_ORIGINAL_B51_ID']=p['id']
 o['SOURCE_ORIGINAL_B51_TYPE']=p['type']
 o['IS_PHYSICS_REVIEW_VOLUME_NOT_NEW_GAME_COLLIDER']=True
 movers[p['id']]=o
assert len(movers)==28 and len(set(src['b51Ids']))==28
for frame,shot in enumerate(src['shots'],1):
 scene.frame_set(frame)
 assert len(shot['moving'])==28 and {p['id'] for p in shot['moving']}==set(src['b51Ids'])
 for p in shot['moving']:
  o=movers[p['id']]
  o.location=tuple(p['center'])
  o.rotation_euler=(0,p['yawRadians'],0)
  o.keyframe_insert('location',frame=frame)
  o.keyframe_insert('rotation_euler',frame=frame)
  for curve in o.animation_data.action.fcurves:
   for key in curve.keyframe_points:key.interpolation='CONSTANT'
 cam=cameras.objects.get(shot['id']+' REAL ORIGINAL 240HZ')
 assert cam is not None
 assert abs(cam['true_240hz_time']-shot['timeSeconds'])<.0001
scene.frame_start=1;scene.frame_end=5
scene.frame_set(1)
assert [(o.name,len(o.data.polygons),o['source_sha256']) for o in cx]==frozen
scene['DR_NOT_NATIVE_GAME_WEBGL']=True
scene['DR_ACTUAL_B48_MESH_COUNT']=7
scene['DR_ACTUAL_B51_POSES_PER_FRAME']=28
scene['DR_ACTUAL_B48_VOID_CELL52']=True
scene['DR_NEW_COLLIDERS']=0
scene['DR_ART']=scene['DR_HUMAN']=scene['DR_PUBLISH']='HOLD'
scene.cycles.device='CPU';scene.cycles.samples=2
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
blend=os.path.join(out,'G4E7DR_'+src['road']+'_B48_B51_240HZ_EDITABLE_ART_HOLD.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
renderProof=[]
max_float32_quantization_m=0.0
# Blender stores object transforms and mesh vertices in IEEE754 float32 even
# when the ORIGINAL protected game physics was exported losslessly as float64.
# Demand byte-equivalent representable float32 poses, not false f64 equality.
def f32(x):return struct.unpack('<f',struct.pack('<f',x))[0]
for frame,shot in enumerate(src['shots'],1):
 scene.frame_set(frame)
 scene.camera=cameras.objects.get(shot['id']+' REAL ORIGINAL 240HZ')
 bpy.context.view_layer.update()
 for p in shot['moving']:
  o=movers[p['id']]
  expected=[f32(v) for v in p['center']]
  delta=max(abs(o.location[j]-expected[j]) for j in range(3))
  raw_error=max(abs(expected[j]-p['center'][j]) for j in range(3))
  max_float32_quantization_m=max(max_float32_quantization_m,raw_error)
  if delta>=1e-6 or abs(o.rotation_euler[1]-f32(p['yawRadians']))>=1e-6:
   raise RuntimeError('DR blender native physical pose failed float32 parity '+repr({
    'frame':frame,'id':p['id'],'actual':list(o.location),
    'expected_f32':expected,'error_after_quantization':delta,
    'yaw_actual':o.rotation_euler[1],'yaw_expected_f32':f32(p['yawRadians'])}))
  assert raw_error<.0005,('DR float32 precision exceeds 0.5mm',raw_error)
 scene.render.filepath=os.path.join(out,'G4E7DR_'+src['road']+'_'+shot['id']+'_GENUINE_BLENDER_NOT_WEBGL.png')
 bpy.ops.render.render(write_still=True)
 renderProof.append({'id':shot['id'],'tick':shot['tick'],
  'timeSeconds':shot['timeSeconds'],'movingObstacles':28})
audit={'schema':'G4E7DR_B48_B51_ORIGINAL_PHYSICS_BLENDER_AUDIT',
 'road':src['road'],'sourceStageId':src['originalStageId'],
 'sourceOriginalDocSha256':src['originalDocSha256'],
 'originalPhysicsBinarySha256':src['binarySha256'],
 'originalPhysicalSurfaces':7,'originalMovingObstacles':28,
 'maxBlenderFloat32PositionQuantizationMeters':max_float32_quantization_m,
 'actualGap52':True,'originalCXSourceObjects':len(cx),
 'unchangedOriginal240HzCameras':len(cameras.objects),
 'roadMeshes':sourceMeshes,'frameProof':renderProof,
 'roadMesh':'ORIGINAL_TESSELLATED_GAME_B48_F64_ALL_FACES',
 'movingGeometry':'PHYSICALLY_EXACT_B51_COLLISION_OBB_NOT_ORIGINAL_GAME_MACHINE_ART',
 'gameRendererParity':'NOT_CLAIMED',
 'gamePhysicsChanged':False,'addedColliders':0,
 'art':'HOLD','human':'HOLD','publish':'HOLD','ready':'HOLD','merge':'HOLD',
 'officialSlope2Meters':0}
with open(os.path.join(out,'G4E7DR_'+src['road']+'_PHYSICAL_AUDIT.json'),'w') as f:
 json.dump(audit,f,indent=2)
print('DR_REAL_B48_B51_BLENDER_PREVIEW_PASS',json.dumps({
 'road':src['road'],'surfaces':7,'moving':28,'frames':5,
 'gap52':True,'originalGameWebGL':'NOT_CLAIMED'}))