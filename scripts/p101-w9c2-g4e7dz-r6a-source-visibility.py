# G4E-7DZ R6A: actual unchanged DR Blender source-object visibility (NOT new-city art).
import bpy,json,os,sys
from collections import Counter
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

a=sys.argv[sys.argv.index('--')+1:]
def arg(k):
 assert k in a,k
 return a[a.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
site=json.load(open(arg('--site-report')))
contact=json.load(open(arg('--contact')))
assert site['schema']=='dopagaki.g4e7dy-r1-native-road-approach-city/1'
assert site['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert (site['originalB48'],site['originalB51'],site['newColliders'])==(7,28,0)
assert site['gap52'] and site['unchangedPhysics']
assert contact['road']==road and contact['best'] and contact['best']['preliminaryCandidate']
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert s.get('DR_ACTUAL_B48_MESH_COUNT')==7
assert s.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert s.get('DR_ACTUAL_B48_VOID_CELL52') is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
movers=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(cx),len(roads),len(movers),len(cams.objects))==(18,7,28,5)
original=(sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in movers),
 sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world @ v.co) for v in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
static=[(o,'CX',tree(o)) for o in cx]+[(o,'B48',tree(o)) for o in roads]
W,H=64,40
pal={'sky':(.15,.18,.23,1),'road':(.38,.47,.56,1),'hazard':(.91,.32,.24,1),
 'cx_near':(.95,.67,.29,1),'cx_mid':(.30,.77,.70,1),'cx_far':(.67,.59,.94,1)}
def source_rays(cam):
 assert cam.data.type=='PERSP'
 f=cam.data.view_frame(scene=s)
 x0,x1=min(p.x for p in f),max(p.x for p in f)
 y0,y1=min(p.y for p in f),max(p.y for p in f)
 z=sum(p.z for p in f)/len(f);eye=cam.matrix_world.translation.copy()
 for j in range(H):
  for i in range(W):
   x=x0+(x1-x0)*(i+.5)/W;y=y0+(y1-y0)*(1-(j+.5)/H)
   direction=(cam.matrix_world@Vector((x,y,z))-eye).normalized()
   yield i,j,eye,direction
def winner(eye,direction,entries):
 best=None
 for ob,group,bvh in entries:
  loc,n,idx,d=bvh.ray_cast(eye,direction,2000)
  if loc is not None and d is not None and (best is None or d<best[0]):
   best=(float(d),group,ob.name)
 return best
def mask(path,colors):
 im=bpy.data.images.new('R6A source mask '+road,width=W,height=H,alpha=True,float_buffer=False)
 pixels=[0.0]*(W*H*4)
 for j in range(H):
  for i in range(W):
   k=((H-1-j)*W+i)*4
   pixels[k:k+4]=colors[j*W+i]
 im.pixels.foreach_set(pixels);im.filepath_raw=path;im.file_format='PNG';im.save()
 bpy.data.images.remove(im)
shots=('t1550','t1600','t1650','t1700')
frames=[]
for fi,shot in enumerate(shots,2):
 s.frame_set(fi);bpy.context.view_layer.update()
 cam=cams.objects.get(shot+' REAL ORIGINAL 240HZ');assert cam
 moving=[(o,'B51',tree(o)) for o in movers]
 colors=[None]*(W*H);count=Counter();depths=Counter();objects=Counter()
 for i,j,eye,direction in source_rays(cam):
  hit=winner(eye,direction,static+moving)
  if hit is None:
   label='sky';count['sky']+=1
  elif hit[1]=='B48':
   label='road';count['B48']+=1
  elif hit[1]=='B51':
   label='hazard';count['B51']+=1
  else:
   depth='near' if hit[0]<100 else 'mid' if hit[0]<350 else 'far'
   label='cx_'+depth;count['CX']+=1;depths[depth]+=1;objects[hit[2]]+=1
  colors[j*W+i]=pal[label]
 maskname='R6A_'+road+'_'+shot+'_SOURCE_RAYS_NOT_WEBGL.png'
 mask(os.path.join(out,maskname),colors)
 s.camera=cam;s.cycles.device='CPU';s.cycles.samples=5
 s.cycles.use_denoising=False;s.view_layers[0].cycles.use_denoising=False
 s.render.threads_mode='FIXED';s.render.threads=2
 s.render.image_settings.file_format='PNG'
 rawname='R6A_'+road+'_'+shot+'_ORIGINAL_BLENDER_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,rawname)
 bpy.ops.render.render(write_still=True)
 contact_points={}
 for name,p in [('proposedRoadOutside',contact['best']['proposedOutsideRoadPointXYZ']),
                ('nearestSourceCX',contact['best']['CXcontactWorldXYZ'])]:
  v=world_to_camera_view(s,cam,Vector(p))
  contact_points[name]={'xy':[round(float(v.x),4),round(float(1-v.y),4)],
      'inFrame':bool(v.z>0 and 0<v.x<1 and 0<v.y<1)}
 frames.append({'shot':shot,'trueCameraTime':float(cam['true_240hz_time']),
  'sampleResolution':[W,H],'categories':dict(count),'CXDepthBins':dict(depths),
  'CXByUnchangedSourceObject':dict(objects),'R5AContactProjection':contact_points,
  'actualOriginalBlenderPNG':rawname,'analyticalRayMaskPNG':maskname})
after=(sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in movers),
 sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
assert original==after
audit={'schema':'dopagaki.g4e7dz-r6a-source-visibility/1','road':road,
 'sourceCX':18,'sourceB48':7,'sourceB51':28,'sourceCameras':5,'gap52':True,
 'originalCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'method':'64x40 perspective sample rays against actual source CX/B48/B51 in original Blender; not per-pixel full-resolution segmentation',
 'frames':frames,'R5AContactObject':contact['best']['CX'],
 'roadToCXPedestrianConnectionCertified':False,'sourceGameChanged':False,
 'newArtMeshes':0,'newGameColliders':0,'newCityWebGL':'NOT_RENDERED',
 'humanPlay':'NOT_RUN','newCityFunctionalLegibility':'NOT_ASSESSED',
 'continuousTimeSafety':'NOT_PROVEN','officialArt':0,'officialSlope2Meters':0,
 'TECH':'SOURCE-ONLY DIAGNOSTIC','ART':'HOLD','GAMEPLAY':'HOLD',
 'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'caveats':['source coverage is not visual quality',
  'CX shape does not identify residential/transport/public functions',
  'sampled original camera rays do not prove future art visibility or collision safety']}
json.dump(audit,open(os.path.join(out,'R6A_'+road+'_SOURCE_AUDIT.json'),'w'),indent=2)
print('R6A_REAL_DR_SOURCE_ONLY',road,[x['categories'] for x in frames])
