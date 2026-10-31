# R4 PRIVATE: ground-coupled inhabited urban cut, NOT R3 gate revision.
# Actual DR Blender original B48/B51/CX cameras; NO game collider/WebGL/adoption.
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def val(k): assert k in args,k;return args[args.index(k)+1]
road=val('--road');assert road in ('true-pinch','pinch-switch')
out=val('--out');os.makedirs(out,exist_ok=True)
site=json.load(open(val('--site-report'),encoding='utf8'))
assert site['schema']=='dopagaki.g4e7dy-r1-native-road-approach-city/1'
assert site['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert (site['originalB48'],site['originalB51'],site['newColliders'])==(7,28,0)
assert site['gap52'] and site['unchangedPhysics']
stations=site['roads'][road]['stations'];assert len(stations)==21
bpy.ops.wm.open_mainfile(filepath=val('--source'))
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert scene.get('DR_ACTUAL_B48_MESH_COUNT')==7
assert scene.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert scene.get('DR_ACTUAL_B48_VOID_CELL52') is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
movers=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert len(cx)==18 and len(roads)==7 and len(movers)==28
assert cams is not None and len(cams.objects)==5
before={
 'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in movers),
 'camera':sorted((o.name,o['true_240hz_time']) for o in cams.objects)}
art=bpy.data.collections.new('R4 PRIVATE urban landform no portal no gate')
scene.collection.children.link(art)
def material(name,rgb):
 m=bpy.data.materials.new('R4 '+name+' / BLENDER ONLY');m.use_nodes=True
 m.diffuse_color=(*rgb,1)
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*rgb,1)
 bs.inputs['Roughness'].default_value=.59;bs.inputs['Metallic'].default_value=.23
 return m
stone=material('continuous mass',(.30,.43,.51))
plaza=material('civic surface',(.63,.55,.43))
housing=material('inhabited terraces',(.61,.49,.39))
park=material('civic garden',(.25,.47,.36))
transit=material('embedded transport',(.15,.56,.61))
track=material('rail on transit floor',(.10,.22,.25))
def point(i,side,offset,height=0):
 c=Vector(stations[i]['center']);e=Vector(stations[i]['left' if side=='L' else 'right'])
 d=e-c;d.y=0;assert d.length>1;d.normalize()
 return e+offset*d+Vector((0,height,0))
def mesh(name,verts,faces,mats,role):
 m=bpy.data.meshes.new('R4 '+name);m.from_pydata([tuple(v) for v in verts],[],faces);m.update()
 ob=bpy.data.objects.new('R4 '+name,m);art.objects.link(ob)
 for x in mats:m.materials.append(x)
 ob['R4_ROLE']=role;ob['R4_COLLIDER']=False;ob['R4_ART_ACCEPTED']=False
 return ob
# This is a connected urban topography: no upright portal, arch, roof,
# floating rail or series of shop boxes. Low foreground -> middle civic/transit
# -> inhabited upper slope. Both are anchored to unchanged B48 station coords.
P={'L':[(35,-13),(49,-9),(64,-8),(78,-1),(101,24),(121,35)],
   'R':[(39,-17),(55,-7),(68,1),(86,3),(108,28),(132,45)]}
def h(i,side,j):
 return P[side][j][1]+(3 if side=='L' else 4)*math.sin(.36*i+.61*j+(0 if side=='L' else 1.2))
def floor_height(i,side,offset):
 p=P[side]
 j=next(j for j in range(len(p)-1) if p[j][0]<=offset<=p[j+1][0])
 u=(offset-p[j][0])/(p[j+1][0]-p[j][0])
 return (1-u)*h(i,side,j)+u*h(i,side,j+1)
def terrain(side,i0,i1,mats):
 n=len(P[side]);count=(i1-i0+1)*n
 top=[point(i,side,offset,h(i,side,j)) for i in range(i0,i1+1)
      for j,(offset,_) in enumerate(P[side])]
 verts=top+[v-Vector((0,24,0)) for v in top]
 faces=[]
 for k in range(i1-i0):
  for j in range(n-1):
   a=k*n+j;b=(k+1)*n+j
   faces.extend([(a,b,b+1),(a,b+1,a+1)])
 for k in range(i1-i0):
  for j in range(n-1):
   a=k*n+j;b=(k+1)*n+j
   faces.extend([(count+a,count+b+1,count+b),(count+a,count+a+1,count+b+1)])
 for k in range(i1-i0):
  for j in (0,n-1):
   a=k*n+j;b=(k+1)*n+j
   faces.append((a,count+a,count+b,b))
 for k in (0,i1-i0):
  for j in range(n-1):
   a=k*n+j;faces.append((a,a+1,count+a+1,count+a))
 ob=mesh(side+' continuous living landform',verts,faces,mats,'CONTINUOUS_INHABITED_GROUND')
 for k in range(i1-i0):
  for j in range(n-1):
   for p in ob.data.polygons[2*(k*(n-1)+j):2*(k*(n-1)+j)+2]:
    p.material_index=min(j,len(mats)-1)
 return ob
terrain('L',6,18,[stone,plaza,plaza,park,housing])
terrain('R',7,19,[stone,transit,transit,park,housing])
def inset(name,side,i0,i1,offsetA,offsetB,mat,role):
 verts=[]
 for i in range(i0,i1+1):
  for off in (offsetA,offsetB):
   verts.append(point(i,side,off,floor_height(i,side,off)+.15))
 faces=[(2*k,2*k+2,2*k+3,2*k+1) for k in range(i1-i0)]
 return mesh(name,verts,faces,[mat],role)
inset('civic public depth walkway','L',7,17,60,64,plaza,'CIVIC_ACCESS_GEOMETRY_NOT_CERTIFIED')
inset('embedded transit station','R',8,18,74,81,transit,'LANDED_TRANSIT_CORRIDOR')
for off in (75.3,78.8):
 inset('inset railway '+str(off),'R',9,18,off,off+.45,track,'INSET_RAIL_NOT_SKY_BAR')
# Irregular inhabited courts are ground-hugging surfaces, not stacked shelves.
def court(name,side,indices,offsets,mat):
 v=[]
 for i,off in zip(indices,offsets):
  for d in (0,11):v.append(point(i,side,off+d,floor_height(i,side,off+d)+.2))
 faces=[(2*k,2*k+2,2*k+3,2*k+1) for k in range(len(indices)-1)]
 return mesh(name,v,faces,[mat],'GROUND_ATTACHED_OPEN_COURT')
court('residential bowl','R',[9,11,13,15,17],[104,99,95,103,106],housing)
court('public amphitheatre','L',[8,10,12,14,16],[88,82,79,84,92],park)
assert len(art.objects)==8
assert before['CX']==sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx)
assert before['B48']==sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads)
assert before['B51']==sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in movers)
assert before['camera']==sorted((o.name,o['true_240hz_time']) for o in cams.objects)
def bvh(ob):
 return BVHTree.FromPolygons([tuple(ob.matrix_world@v.co) for v in ob.data.vertices],
 [tuple(p.vertices) for p in ob.data.polygons],all_triangles=False)
new=[(o,bvh(o)) for o in art.objects]
source=[(o,bvh(o)) for o in roads]
static=[]
for obj,b in new:
 for old,a in source:
  hit=b.overlap(a)
  if hit:static.append([obj.name,old.name,len(hit)])
dynamic={}
shots=('t1550','t1600','t1650','t1700')
for frame,shot in enumerate(shots,2):
 scene.frame_set(frame);bpy.context.view_layer.update();hit=[]
 for ob in movers:
  b=bvh(ob)
  for obj,a in new:
   if b.overlap(a):hit.append([obj.name,ob['SOURCE_ORIGINAL_B51_ID']])
 dynamic[shot]=hit
targets={'left_civic':point(12,'L',62,floor_height(12,'L',62)+1),
 'left_housing':point(13,'L',109,floor_height(13,'L',109)+2),
 'right_transit':point(14,'R',78,floor_height(14,'R',78)+2),
 'right_housing':point(15,'R',117,floor_height(15,'R',117)+2)}
occluders=[(o,bvh(o)) for o in cx+roads+list(art.objects)]
visibility={}
for frame,shot in enumerate(shots,2):
 scene.frame_set(frame);bpy.context.view_layer.update()
 cam=cams.objects.get(shot+' REAL ORIGINAL 240HZ');assert cam
 eye=cam.matrix_world.translation.copy()
 v={}
 for name,target in targets.items():
  p=world_to_camera_view(scene,cam,target)
  diff=target-eye;first=None
  for ob,b in occluders:
   hit,n,index,d=b.ray_cast(eye,diff.normalized(),diff.length-.8)
   if hit is not None and d is not None and (first is None or d<first[1]):
    first=(ob.name,float(d))
  v[name]={'screenXY':[round(float(p.x),4),round(float(1-p.y),4)],
   'inFrame':bool(p.z>0 and 0<p.x<1 and 0<p.y<1),
   'clearRay':first is None,'firstOccluder':first,
   'humanFunctionRecognizability':'NOT_EVALUATED'}
 visibility[shot]=v
# Source CX connection is NOT ASSUMED: report nearest possible touchpoints.
links={}
for key,p in [('left_start',point(6,'L',121,35)),('right_end',point(19,'R',132,45))]:
 near=[]
 for ob in cx:
  loc,n,index,d=bvh(ob).find_nearest(p)
  if loc is not None:near.append([round(float(d),3),ob.name])
 near.sort()
 links[key]={'nearestThreeCX':near[:3],
             'certifiedCityPedestrianConnection':False}
scene['R4_REAL_BLENDER_NOT_GAME_WEBGL']=True
scene['R4_ART']='HOLD';scene['R4_GAMEPLAY']='HOLD'
scene['R4_HUMAN']='HOLD';scene['R4_RELEASE']='HOLD'
scene['R4_GAME_COLLIDERS']=0;scene['R4_HAS_GATES']=False
scene.cycles.device='CPU';scene.cycles.samples=6
scene.cycles.use_denoising=False;scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'R4_'+road+'_EDITABLE_UNADOPTED.blend'))
renders=[]
for frame,shot in enumerate(shots,2):
 scene.frame_set(frame);cam=cams.objects.get(shot+' REAL ORIGINAL 240HZ')
 scene.camera=cam;bpy.context.view_layer.update()
 path=os.path.join(out,'R4_'+road+'_'+shot+'_GENUINE_BLENDER_NOT_WEBGL.png')
 scene.render.filepath=path;bpy.ops.render.render(write_still=True)
 renders.append({'shot':shot,'nativeTime':float(cam['true_240hz_time']),
                 'filename':os.path.basename(path)})
audit={'schema':'dopagaki.g4e7dz-r4-groundcity/1','road':road,'actualEditableMeshes':8,
 'gateMeshes':0,'sourceCX18':18,'originalB48':7,'originalB51':28,
 'originalCameras':5,'gap52Preserved':True,
 'CXOriginalHashes':before['CX'],'B48OriginalHashes':before['B48'],
 'roadTriangleOverlap':static,'B51SampledOBBOverlap':dynamic,
 'CXProximityNotPhysicalConnection':links,'cameraSightlinesNotArtQuality':visibility,
 'trueBlenderImages':renders,'sourceGameChanged':False,'gameNewColliders':0,
 'actualGameWebGL':'NOT_RENDERED','humanPlay':'NOT_RUN',
 'continuousSafety':'NOT_PROVEN','art':'HOLD','officialArt':0,
 'officialSlope2Meters':0,'performance':'HOLD','integration':'HOLD',
 'release':'HOLD','merge':'HOLD'}
with open(os.path.join(out,'R4_'+road+'_ACTUAL_AUDIT.json'),'w') as f:
 json.dump(audit,f,indent=2)
print('R4_REAL_WORLD_BLENDER_RESEARCH',json.dumps({
 'road':road,'B48intersections':len(static),
 'B51fourTimeOverlaps':{k:len(v) for k,v in dynamic.items()},
 'CXTouchpoints':links,'ART':'HOLD','WebGL':'NOT_RENDERED'}))
