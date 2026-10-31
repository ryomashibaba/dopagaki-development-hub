# G4E-7DZ R5B: actual editable Blender contact proof; NOT approved city art.
import bpy,json,sys,os
from mathutils import Vector
from mathutils.bvhtree import BVHTree
a=sys.argv[sys.argv.index('--')+1:]
def v(k):return a[a.index(k)+1]
road=v('--road');out=v('--out');os.makedirs(out,exist_ok=True)
site=json.load(open(v('--site-report')))
r=json.load(open(v('--contact')));c=r['best']
assert road in ('true-pinch','pinch-switch') and r['road']==road
assert c and c['preliminaryCandidate']
assert site['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=v('--source'));s=bpy.context.scene
assert s.get('DR_ACTUAL_B48_MESH_COUNT')==7 and s.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert s.get('DR_ACTUAL_B48_VOID_CELL52') is True and s.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
movers=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(cx),len(roads),len(movers),len(cams.objects))==(18,7,28,5)
frozen=(sorted((o.name,o['source_sha256']) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256']) for o in roads))
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@x.co) for x in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
target=[o for o in cx if o.name==c['CX']];assert len(target)==1
p=Vector(c['CXcontactWorldXYZ']);q=Vector(c['proposedOutsideRoadPointXYZ'])
nearest,n,idx,d=tree(target[0]).find_nearest(p)
assert d<.02 and n.y>.65
i=c['station'];side=c['side'];st=site['roads'][road]['stations']
edge=Vector(st[i]['left' if side=='L' else 'right'])
mid=Vector(st[i]['center'])
outdir=edge-mid;outdir.y=0;outdir.normalize()
start=edge+outdir*1.8+Vector((0,.25,0))
end=Vector(nearest)+Vector((0,.25,0))
mid=q+Vector((0,.25,0))
length=end-start;length.y=0;assert length.length>2;length.normalize()
across=Vector((-length.z,0,length.x))
coll=bpy.data.collections.new('R5B source junction PRIVATE ART HOLD')
s.collection.children.link(coll)
def material(name,rgb):
 m=bpy.data.materials.new(name);m.use_nodes=True
 b=m.node_tree.nodes.get('Principled BSDF')
 b.inputs['Base Color'].default_value=(*rgb,1)
 b.inputs['Roughness'].default_value=.52
 return m
walk=material('R5B human contact surface',(.65,.49,.27))
court=material('R5B existing promenade continuation',(.26,.61,.55))
def slab(name,pts,w,ma):
 verts=[]
 for p in pts:
  for y in (0,-.5):
   verts.extend([p-across*w/2+Vector((0,y,0)),p+across*w/2+Vector((0,y,0))])
 faces=[]
 for k in range(len(pts)-1):
  j=4*k;h=j+4
  faces.extend([(j,h,h+1,j+1),(j+2,j+3,h+3,h+2),
                (j,j+2,h+2,h),(j+1,h+1,h+3,j+3)])
 me=bpy.data.meshes.new(name);me.from_pydata([tuple(p) for p in verts],[],faces);me.update()
 ob=bpy.data.objects.new(name,me);coll.objects.link(ob);me.materials.append(ma)
 ob['R5B_NEW_GAME_COLLIDER']=False;ob['R5B_ART_ADOPTED']=False
 return ob
slab('R5B short physical-width study from actual B48 edge toward CX', [start,mid,end],3.2,walk)
t=Vector(st[i+1]['center'])-Vector(st[i-1]['center']);t.y=0;t.normalize()
slab('R5B civic continuation rooted at CX contact', [end,end+t*6,end+t*13],4.5,court)
# Geometry is a test of continuity, not a new highway, city or public access permit.
source=[(o,tree(o)) for o in roads]
static=[]
for ob in coll.objects:
 tr=tree(ob)
 for obj,b in source:
  if tr.overlap(b):static.append([ob.name,obj.name])
moving={}
frames=['t1550','t1600','t1650','t1700']
for k,tname in enumerate(frames,2):
 s.frame_set(k);bpy.context.view_layer.update()
 moving[tname]=[[o.name,m['SOURCE_ORIGINAL_B51_ID']] for o in coll.objects for m in movers if tree(o).overlap(tree(m))]
assert frozen==(sorted((o.name,o['source_sha256']) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256']) for o in roads))
s['R5B_NOT_GAME_WEBGL']=True;s['R5B_ART']='HOLD';s['R5B_NEW_GAME_COLLIDERS']=0
s.cycles.device='CPU';s.cycles.samples=6;s.cycles.use_denoising=False
s.view_layers[0].cycles.use_denoising=False;s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
s.frame_set(2)
bpy.ops.wm.save_as_mainfile(filepath=out+'/R5B_'+road+'_EDITABLE_UNADOPTED.blend')
imgs=[]
for k,tname in enumerate(frames,2):
 s.frame_set(k);s.camera=cams.objects.get(tname+' REAL ORIGINAL 240HZ');assert s.camera
 s.render.filepath=out+'/R5B_'+road+'_'+tname+'_GENUINE_BLENDER_NOT_WEBGL.png'
 bpy.ops.render.render(write_still=True);imgs.append(os.path.basename(s.render.filepath))
result={'schema':'dopagaki.g4e7dz-r5b-source-junction/1','road':road,
 'sourceCX':18,'sourceB48':7,'sourceB51':28,'sourceCameras':5,'gap52':True,
 'newEditableMeshCount':2,'images':imgs,'B48TriangleOverlaps':static,'B51FourSnapshotOverlaps':moving,
 'roadEdgeWalking':'NOT_CERTIFIED','CXAttachment':'POINT_CONTACT_ONLY_NOT_STRUCTURAL_WELD',
 'gameNewColliders':0,'sourceChanged':False,'newCityWebGL':'NOT_RENDERED',
 'humanPlay':'NOT_RUN','continuousSafety':'NOT_PROVEN','officialArt':0,
 'officialSlope2Meters':0,'art':'HOLD','gameplay':'HOLD',
 'performance':'HOLD','integration':'HOLD','release':'HOLD','merge':'HOLD'}
json.dump(result,open(out+'/R5B_'+road+'_AUDIT.json','w'),indent=2)
print('R5B_EDITABLE_REAL_SOURCE_JUNCTION_HOLD',road,'B48 overlaps',len(static),'B51 four-sample',sum(map(len,moving.values())))
