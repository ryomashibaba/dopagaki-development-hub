# G4E-7DQ: original authored BW R3 architecture, placed in G4E-7DO master.
# Comparison only. NOT a new final city and NOT native game WebGL.
import bpy,json,os,sys
from mathutils import Vector,Matrix
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def flag(s):return args[args.index(s)+1]
ref=flag('--reference')
asset=flag('--asset')
siteFile=flag('--site')
out=flag('--out')
os.makedirs(out,exist_ok=True)
site=json.load(open(siteFile,encoding='utf-8'))
assert site['schema']=='dopagaki.g4e7dq-readonly-original-bw-r3-site/1'
assert site['newRoads']==site['newColliders']==site['newMovers']==0
bpy.ops.wm.open_mainfile(filepath=ref)
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL')==True
assert scene.get('DO_SOURCE_HASH')==site['cxVertexSha256']
masterCameras=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert len(masterCameras.objects)==5
orig=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
baseline=[(o.name,len(o.data.polygons),o.get('source_sha256')) for o in orig]
assert len(orig)==18
archive=bpy.data.collections.new('DQ ACTUAL BW R3 DETAILED ORIGINAL 3D / ART HOLD')
scene.collection.children.link(archive)
with bpy.data.libraries.load(asset,link=False) as (source,destination):
 destination.objects=[name for name in source.objects]
candidates=[]
for obj in destination.objects:
 if obj is None or obj.type!='MESH':continue
 if obj.get('exclude_glb') or 'STUDIO-ONLY' in obj.name:continue
 # Include only the authored R3 mesh, never studio floor or old cameras.
 archive.objects.link(obj)
 candidates.append(obj)
assert 1000<len(candidates)<2500,len(candidates)
# BW R3 is in the original Blender Z-up coordinates.
# Game is Y-up; use exact road tangent and outward basis for *one* asset root.
basis=site['worldBasis']
outward=Vector(basis['sourceX'])
along=Vector(basis['sourceY'])
up=Vector(basis['sourceZ'])
scale=site['scale'];world=Vector(site['worldOrigin'])
matrix=Matrix(((outward.x*scale,along.x*scale,up.x*scale,world.x),
               (outward.y*scale,along.y*scale,up.y*scale,world.y),
               (outward.z*scale,along.z*scale,up.z*scale,world.z),
               (0,0,0,1)))
# Root parenting preserves all source-authored local transformations and
# avoids physically scaling individual mesh vertices, nodes or materials.
root=bpy.data.objects.new('DQ_BW_R3_AUTHORED_WORLD_RIG_NOT_GAME_PHYSICS',None)
archive.objects.link(root)
root.matrix_world=matrix
for obj in candidates:
 old=obj.matrix_world.copy()
 # If BW R3 contains nested object parenting, fail rather than corrupt art.
 if obj.parent is not None:
  raise RuntimeError('DQ R3 needs explicit parent transform baking: '+obj.name)
 obj.parent=root
 obj.matrix_parent_inverse=Matrix.Identity(4)
 obj.matrix_basis=old
bpy.context.view_layer.update()
assert [(o.name,len(o.data.polygons),o.get('source_sha256')) for o in orig]==baseline
assert len(masterCameras.objects)==5
scene['DQ_ART']='HOLD';scene['DQ_HUMAN']='HOLD';scene['DQ_PUBLISH']='HOLD'
scene['DQ_SOURCE']='EXISTING_BW_R3_UNADOPTED'
scene['DQ_GAME_PHYSICS_CHANGED']=False
scene['DQ_REAL_NATIVE_WEBGL']='NOT_TESTED'
scene.cycles.device='CPU'
scene.cycles.samples=3
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
destBlend=os.path.join(out,'G4E7DQ_'+site['road']+'_BW_R3_ACTUAL_CAMERAS_ART_HOLD.blend')
bpy.ops.wm.save_as_mainfile(filepath=destBlend)
for cam in ['t1500','t1550','t1600','t1650','t1700']:
 scene.camera=masterCameras.objects.get(cam+' REAL ORIGINAL 240HZ')
 assert scene.camera is not None
 scene.render.filepath=os.path.join(out,'G4E7DQ_'+site['road']+'_'+cam+'_BLENDER_NOT_GAME_WEBGL.png')
 bpy.ops.render.render(write_still=True)
report={'schema':'G4E7DQ_REAL_ARTIST_R3_REFRAMED_NATIVE_CAMERA',
 'road':site['road'],'sourceFile':site['asset'],'originalBWObjects':len(candidates),
 'originalCXObjects':len(orig),'originalCXTriangles':22920,
 'sourceBWBlenderZUp':True,'genuineCameras':5,'worldOrigin':list(world),
 'sourceToGameScale':scale,'authoredBWOriginalNotAccepted':True,
 'gamePhysicsChanged':False,'addedRoads':0,'addedColliders':0,'addedHazards':0,
 'nativeWebGL':'NOT_TESTED','art':'HOLD','human':'HOLD','publish':'HOLD',
 'ready':'HOLD','merge':'HOLD','officialSlope2Meters':0}
with open(os.path.join(out,'G4E7DQ_'+site['road']+'_AUDIT.json'),'w') as f:json.dump(report,f,indent=2)
print('G4E7DQ_REAL_EXISTING_R3_REFRAMED_BLENDER_COMPLETE',json.dumps(report))
