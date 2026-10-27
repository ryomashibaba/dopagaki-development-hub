# G4E-7DO original native 240Hz camera-aligned Blender MASTER reference.
# Outputs actual Blender .blend and offline renders, NEVER claims native WebGL.
# No landscape or aesthetic candidate added. All original CX triangles are
# copied once as editable meshes; B48 lines are guides, NOT physical driveways.
import bpy, json, math, os, sys, hashlib
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def arg(flag):
 i=argv.index(flag)
 return argv[i+1]
src=arg('--source')
out=arg('--out')
os.makedirs(out,exist_ok=True)
data=json.load(open(src,encoding='utf-8'))
assert data['schema']=='dopagaki.g4e7do-native-master-editable-blender/1'
assert data['physics']=={'surfaces':7,'movingHazards':28,'gap52':True,
 'noNewRoad':True,'noNewCollider':True,'officialSlope2Meters':0}
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.resolution_x=1008;scene.render.resolution_y=645
scene.render.resolution_percentage=100
scene.render.film_transparent=False
scene.unit_settings.system='METRIC'
engine='BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in {i.identifier for i in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items} else 'BLENDER_EEVEE'
scene.render.engine=engine
scene.render.image_settings.file_format='PNG'
scene.world.color=(.12,.18,.26)
def group(name):
 c=bpy.data.collections.new(name)
 scene.collection.children.link(c)
 return c
camera_collection=group('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
city_collection=group('DO UNMODIFIED CX ARCHITECTURE / EDITABLE SOURCE GROUPS')
roads_collection=group('DO B48 ROAD GUIDE CURVES / NOT ACTUAL PHYSICAL ROAD MESH')
provenance=group('DO ART HOLD / NO NEW ARCHITECTURE')
def material(name,c):
 m=bpy.data.materials.get(name)
 if m:return m
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1)
 return m
kind_color={'anchored-civic-crescent':(.75,.84,.79),
 'roadbank-promenade':(.17,.52,.65),'roadbank-inhabited':(.38,.53,.58),
 'civic-concourse':(.58,.42,.26),'distant-folded-roofline':(.40,.51,.72)}
def create_mesh(src):
 verts=src['coordsAndColor']
 assert len(verts)==src['triangles']*18
 positions=[tuple(verts[j:j+3]) for j in range(0,len(verts),6)]
 faces=[(j,j+1,j+2) for j in range(0,len(positions),3)]
 mesh=bpy.data.meshes.new('CX SOURCE TRIANGLES '+str(src['id']))
 mesh.from_pydata(positions,[],faces);mesh.update()
 obj=bpy.data.objects.new('%02d '%src['id']+src['kind']+' '+str(src['slot']),mesh)
 city_collection.objects.link(obj)
 obj.data.materials.append(material('Source: '+src['kind'],kind_color.get(src['kind'],(.29,.51,.59))))
 obj['cx_kind']=src['kind'];obj['original_first_triangle']=src['originalFirstTriangle']
 obj['source_sha256']=src['sourceSha256'];obj['game_world_xyz_unmodified']=True
 return obj
triangles=0
for s in data['structures']:
 create_mesh(s)
 triangles+=s['triangles']
assert triangles==data['cxTriangleCount']
assert sum(s['kind']=='anchored-civic-crescent' for s in data['structures'])==2
road_count=0
for line in data['lineGuides']:
 for track in line['tracks']:
  cu=bpy.data.curves.new('NONPHYSICAL ROAD EDGE GUIDE','CURVE');cu.dimensions='3D'
  cu.resolution_u=1;cu.bevel_depth=.08;cu.bevel_resolution=0
  spline=cu.splines.new('POLY')
  spline.points.add(len(track['points'])-1)
  for p,point in zip(spline.points,track['points']):
   p.co=(*point,1)
  ob=bpy.data.objects.new('ROAD%02d_lateral_%s_NONPHYSICAL'%(line['surface'],track['lane']),cu)
  roads_collection.objects.link(ob);road_count+=1
assert road_count==21
camera_records=[]
max_projection_error=0.
for sample in data['cameras']:
 cam=bpy.data.cameras.new('GAME VIEW '+sample['id'])
 cam.type='PERSP'
 cam.sensor_fit='VERTICAL'
 cam.sensor_height=36
 cam.lens=36*1.35/2
 cam.clip_start=1.4;cam.clip_end=9000.
 obj=bpy.data.objects.new(sample['id']+' REAL ORIGINAL 240HZ',cam)
 camera_collection.objects.link(obj)
 eye=Vector(sample['eye'])
 front=Vector(sample['front'])
 right=Vector(sample['right'])
 up=Vector(sample['up'])
 # Blender camera local -Z is the forward ray and +Y is camera up;
 # retain exact original game XYZ coordinates rather than swapping Y/Z.
 obj.location=eye
 obj.rotation_mode='QUATERNION'
 obj.rotation_quaternion=Matrix(((right[0],up[0],-front[0]),
                                 (right[1],up[1],-front[1]),
                                 (right[2],up[2],-front[2]))).to_quaternion()
 check=eye+front*100+right*16+up*7
 ndc=world_to_camera_view(scene,obj,check)
 expected_x=sample['samplePixel'][0]/1008
 expected_y=1-sample['samplePixel'][1]/645
 error=max(abs(ndc.x-expected_x),abs(ndc.y-expected_y))
 max_projection_error=max(max_projection_error,error)
 if error>1e-4:raise RuntimeError('REAL NATIVE CAMERA PROJECTIVE DRIFT '+sample['id']+' '+str(error))
 obj['shot_id']=sample['id'];obj['true_240hz_time']=sample['timeSeconds']
 obj['speed_mps']=sample['speedMps'];obj['origin']='UNMODIFIED_240HZ_NONHUMAN_FIXED_P96'
 obj['projection_alignment_error_ndc']=error
 camera_records.append({'id':sample['id'],'time':sample['timeSeconds'],
  'projectionErrorNormalized':error})
 # World lighting is auxiliary for reference renders, not a WebGL copy.
scene.camera=camera_collection.objects.get('t1600 REAL ORIGINAL 240HZ')
world=scene.world
world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.15,.20,.28,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.8
light_data=bpy.data.lights.new('DO PREVIEW ONLY / NOT GAME LIGHT','AREA')
light_obj=bpy.data.objects.new('DO PREVIEW ONLY / NOT GAME LIGHT',light_data)
provenance.objects.link(light_obj);light_obj.location=(20,300,60)
light_data.energy=20000;light_data.shape='DISK';light_data.size=300.
scene['DO_SCENE_IS_NOT_GAME_WEBGL']=True
scene['DO_ART']=scene['DO_HUMAN']=scene['DO_PUBLISH']='HOLD'
scene['DO_ROAD']=data['road']
scene['DO_SOURCE_HASH']=data['cxVertexSha256']
scene['DO_GAME_CAMERAS']=5
scene.render.filepath=os.path.join(out,'placeholder.png')
blend=os.path.join(out,'G4E7DO_'+data['road']+'_ORIGINAL_NATIVE_CAMERA_MASTER_ART_HOLD.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
for sample in data['cameras']:
 scene.camera=camera_collection.objects.get(sample['id']+' REAL ORIGINAL 240HZ')
 scene.render.filepath=os.path.join(out,'G4E7DO_'+data['road']+'_'+sample['id']+'_ACTUAL_BLENDER_NOT_WEBGL.png')
 bpy.ops.render.render(write_still=True)
report={'schema':'G4E7DO_REAL_BLENDER_NATIVE_PROJECTION_AUDIT',
 'road':data['road'],'sources':len(data['structures']),'triangles':triangles,
 'cameraCount':len(camera_records),'roadNonPhysicalGuideCurves':road_count,
 'maxProjectionErrorNormalized':max_projection_error,
 'exactOriginalCXVertexSha256':data['cxVertexSha256'],'original240hz':True,
 'nativeGameFramebufferOrShaderMatch':'NOT_CLAIMED',
 'originalGame3dSceneMesh':'EXACT_CX_VERTEX_TRIANGLES',
 'art':'HOLD','human':'HOLD','ready':'HOLD','publish':'HOLD','merge':'HOLD',
 'officialSlope2Meters':0,'cameras':camera_records}
with open(os.path.join(out,'G4E7DO_'+data['road']+'_BLENDER_CAMERA_AUDIT.json'),'w') as f:
 json.dump(report,f,indent=2)
print('G4E7DO_BLENDER_NATIVE_CAMERA_MASTER_SUCCESS',json.dumps(report))
