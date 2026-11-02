# G4E-7DZ R0: two spatially different void-first 3D studies.
# Private Blender artifact ONLY. Not a game/WebGL/human quality certificate.
import bpy,json,os,sys,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
argv=sys.argv[sys.argv.index('--')+1:]
def val(k):return argv[argv.index(k)+1]
road=val('--road');variant=val('--variant');out=val('--out')
assert road in ('true-pinch','pinch-switch')
assert variant in ('excavated-estuary','open-cell-confluence')
os.makedirs(out,exist_ok=True)
data=json.load(open(val('--site-report'),encoding='utf8'))
assert data['schema']=='dopagaki.g4e7dy-r1-native-road-approach-city/1'
assert data['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
stations=data['roads'][road]['stations']
assert len(stations)==21 and data['unchangedPhysics'] and data['newColliders']==0
bpy.ops.wm.open_mainfile(filepath=val('--source'))
scene=bpy.context.scene
assert scene['DO_SCENE_IS_NOT_GAME_WEBGL'] is True
assert scene['DR_ACTUAL_B48_MESH_COUNT']==7
assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert scene['DR_ACTUAL_B48_VOID_CELL52'] is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
moving=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert len(cx)==18 and len(roads)==7 and len(moving)==28 and len(cams.objects)==5
frozen_cx=sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx)
frozen_road=sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads)
frozen_moving=sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in moving)
col=bpy.data.collections.new('DZ '+variant+' / PRIVATE ART HOLD')
scene.collection.children.link(col)
def mat(name,color):
 m=bpy.data.materials.new('DZ '+name);m.use_nodes=True
 m.diffuse_color=(*color,1)
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*color,1)
 bs.inputs['Roughness'].default_value=.52
 return m
stone=mat('calcareous curved town mass',(.52,.71,.72))
void=mat('excavated void inside civic earth',(.18,.37,.43))
res=mat('inhabited upper cut',(.66,.61,.48))
rail=mat('tram station circulation',(.35,.67,.71))
def point(i,side,off,h):
 p=stations[i];c=Vector(p['center']);e=Vector(p['left'] if side=='L' else p['right'])
 t=e-c;t.y=0;t.normalize()
 return e+t*off+Vector((0,h,0))
def new_mesh(name,vertices,faces,material,role):
 mesh=bpy.data.meshes.new('DZ REAL 3D '+name)
 mesh.from_pydata([tuple(v) for v in vertices],[],faces)
 mesh.update()
 ob=bpy.data.objects.new(name,mesh);col.objects.link(ob)
 mesh.materials.append(material)
 ob['DZ_ROLE']=role;ob['DZ_ART_APPROVED']=False;ob['DZ_GAME_COLLIDER']=False
 return ob
def thick_bank(name,side,lo,hi,near,far,fn,depth,material,role):
 n=hi-lo+1;verts=[]
 for d in (0,-depth):
  for i in range(lo,hi+1):
   t=(i-lo)/(hi-lo)
   for x in (near,far):verts.append(point(i,side,x,fn(x,t)+d))
 faces=[];half=n*2
 for i in range(n-1):
  a=2*i;b=a+2
  faces.extend([(a,b,a+1),(a+1,b,b+1),
                (half+a,half+a+1,half+b),(half+a+1,half+b+1,half+b)])
 for a in (0,half-2):
  faces.append((a,a+1,half+a+1,half+a))
 for a in range(0,half-2,2):
  for j in (0,1):
   q=a+j;faces.append((q,q+2,half+q+2,half+q))
 return new_mesh(name,verts,faces,material,role)
if variant=='excavated-estuary':
 # A: two NONCONTIGUOUS real banks frame a 36m-deep open civic cut.
 # The near slope is below horizon; the far bank rises to inhabited town.
 def near(x,t):return -20-28*math.sin(t*math.pi)**2-.20*(x-24)
 def distant(x,t):return -22+1.03*(x-84)+15*math.sin(t*math.pi)**2
 def right(x,t):return -30+.57*(x-79)+8*math.sin(t*math.pi)
 thick_bank('A massive SUBTRACTED near shore','L',7,20,25,49,near,13,void,'CONTINUOUS_LOWER_CITY')
 thick_bank('A continuous occupied far city edge','L',7,20,85,145,distant,15,stone,'FAR_TOWN_WITH_OPEN_CUT')
 thick_bank('A nonmatching lower transit district','R',10,20,79,127,right,11,res,'DISTANT_TRANSPORT_BANK')
 def way(x,t):return 9+6*math.sin(t*math.pi)+.10*(x-91)
 thick_bank('A visibly occupied civic way within far bank','L',9,19,89,104,way,2.5,rail,'PUBLIC_CIRCULATION')
else:
 # B: one true continuous curved, THICK, asymmetric 3D city body with
 # a very large missing road-facing front surface and an empty atrium.
 # Unlike the excavated A, this is a vertical, open-cell inhabited shell.
 nz=13;na=40;verts=[]
 for radial in (0,1):
  for i in range(8,21):
   t=(i-8)/12
   for j in range(na+1):
    a=math.pi+.89+(2*math.pi-1.78)*j/na+.08*math.sin(t*2*math.pi)
    rx=62-radial*14;ry=73-radial*14
    off=100+rx*math.cos(a)+5*math.sin(t*math.pi)
    h=42+ry*math.sin(a)+10*math.sin(t*math.pi)
    verts.append(point(i,'R',off,h))
 N=nz*(na+1);faces=[]
 for i in range(nz-1):
  for j in range(na):
   a=i*(na+1)+j;b=a+na+1
   faces.extend([(a,b,a+1),(a+1,b,b+1),
                 (N+a,N+a+1,N+b),(N+a+1,N+b+1,N+b)])
 for k in (0,nz-1):
  for j in range(na):
   a=k*(na+1)+j;faces.append((a,a+1,N+a+1,N+a))
 for j in (0,na):
  for k in range(nz-1):
   a=k*(na+1)+j;b=a+na+1
   faces.append((a,b,N+b,N+a))
 new_mesh('B ONE open-faced hollow metropolitan cell',verts,faces,stone,'CURVED_SINGLE_HOLLOW_MEGA_BODY')
 def inner(x,t):return -15+8*math.sin(t*math.pi)+.07*(x-74)
 thick_bank('B rail hall INSIDE open vertical cell','R',10,18,73,102,inner,4,rail,'RECESSED_TRANSIT')
 def homes(x,t):return 55+7*math.sin(t*math.pi)-.16*(x-107)
 thick_bank('B high inhabited inner city','R',12,18,108,132,homes,7,res,'RECESSED_HOUSING')
 def valley(x,t):return -40+.30*(x-48)+8*math.sin(t*math.pi)
 thick_bank('B nonmatching low opposite civic relief','L',9,18,48,96,valley,12,void,'LOW_PUBLIC_TOPOGRAPHY')
assert len(col.objects)==4
assert frozen_cx==sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx)
assert frozen_road==sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads)
assert frozen_moving==sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in moving)
def bvh(ob):
 return BVHTree.FromPolygons([tuple(ob.matrix_world@v.co) for v in ob.data.vertices],
       [tuple(f.vertices) for f in ob.data.polygons],all_triangles=False)
built=[(o,bvh(o)) for o in col.objects]
static=[]
for o,b in built:
 for source in roads:
  n=len(b.overlap(bvh(source)))
  if n:static.append([o.name,source.name,n])
moving_hits={}
for f,s in enumerate(('t1550','t1600','t1650','t1700'),2):
 scene.frame_set(f);bpy.context.view_layer.update()
 records=[]
 for mover in moving:
  mb=bvh(mover)
  for o,b in built:
   if b.overlap(mb):records.append([o.name,mover['SOURCE_ORIGINAL_B51_ID']])
 moving_hits[s]=records
scene['DZ_ART']='HOLD'
scene['DZ_ORIGINAL_PHYSICS_MUTATED']=False
scene['DZ_ADDED_GAME_COLLIDERS']=0
scene.cycles.device='CPU';scene.cycles.samples=3
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'G4E7DZ_'+variant+'_'+road+'_EDITABLE_NONADOPTED.blend'))
frame_info=[]
for f,s in enumerate(('t1550','t1600','t1650','t1700'),2):
 scene.frame_set(f)
 cam=cams.objects.get(s+' REAL ORIGINAL 240HZ')
 assert cam is not None
 scene.camera=cam
 bpy.context.view_layer.update()
 scene.render.filepath=os.path.join(out,'G4E7DZ_'+variant+'_'+road+'_'+s+'_GENUINE_BLENDER_NOT_GAME_WEBGL.png')
 bpy.ops.render.render(write_still=True)
 frame_info.append({'frame':s,'sourceCamera':cam.name,'originalTime':cam['true_240hz_time']})
audit={'schema':'G4E7DZ_VOID_FIRST_REAL_BLENDER/1','variant':variant,'road':road,
 'originalCX':len(cx),'originalB48':len(roads),'originalB51':len(moving),
 'originalNativeCamera':len(cams.objects),'architecturalMeshes':len(col.objects),
 'originalCXUnchanged':True,'originalB48Unchanged':True,
 'newPhysicalGameColliders':0,'staticRoadTriangleOverlaps':static,
 'movingB51AtSampleOverlaps':moving_hits,'fullSweptSphereSafety':'NOT_TESTED',
 'renderedGenuineBlenderFrames':frame_info,'originalGameWebGL':'NOT_RENDERED',
 'humanPlay':'NOT_RUN','performance':'NOT_TESTED','art':'HOLD',
 'adoptedArtCount':0,'officialSlope2Meters':0,'publish':'HOLD','merge':'HOLD'}
with open(os.path.join(out,'G4E7DZ_'+variant+'_'+road+'_AUDIT.json'),'w') as f:json.dump(audit,f,indent=2)
print('DZ_PRIVATE_RESEARCH_FINISHED',variant,road,len(static),
      {s:len(v) for s,v in moving_hits.items()})
