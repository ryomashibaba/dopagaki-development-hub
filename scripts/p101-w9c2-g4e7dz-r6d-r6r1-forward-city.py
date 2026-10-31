# R6D-R6R1 whole-city blockout: fix measured 16-17s camera disappearance.
# Focal urban core is not guessed from road-side offsets alone:
# its unbuilt world coordinates are projected from the ORIGINAL 17s forward
# camera and physically separated from protected B48/B51.
# No game asset modified; failures remain art/safety hold.
import bpy,math,json,sys,os
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def req(k):assert k in argv,k;return argv[argv.index(k)+1]
road=req('--road');assert road in ('true-pinch','pinch-switch')
out=req('--out');os.makedirs(out,exist_ok=True)
d=json.load(open(req('--native'),encoding='utf-8'))
haz=json.load(open(req('--hazards'),encoding='utf-8'))
assert d['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert d['road']==haz['road']==road
assert d['sourceCXBlob']==haz['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=req('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
oldcity=[o for o in bpy.data.objects if o.get('R6_UNADOPTED')]
cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(oldcity),len(cameras.objects),len(early.objects))==(18,7,28,73,5,8)
def signature():
 return (
 sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o['true_240hz_time']),tuple(round(v,4) for v in o.location)) for o in cameras.objects),
 sorted((o.name,o['R6_ROLE'],len(o.data.polygons)) for o in oldcity))
before=signature()
f17=next(f for f in d['frames'] if f['id']=='t1700')
p=Vector(f17['playerPosition'])
front=Vector(f17['front']);front.y=0;front.normalize()
right=front.cross(Vector((0,1,0))).normalized()
# forward frames at 17s are calculated FROM original camera orientation,
# but are NOT extrapolated proof of safe gameplay after 17s.
def point(a,l,h):
 return p+front*a+right*l+Vector((0,h,0))
col=bpy.data.collections.new('R6R1 FORWARD INHABITED SKYLINE NOT GAME')
s.collection.children.link(col)
def mat(name,color,met=.28):
 m=bpy.data.materials.new('R6R1 '+name);m.use_nodes=True
 shader=m.node_tree.nodes.get('Principled BSDF')
 shader.inputs['Base Color'].default_value=(*color,1)
 shader.inputs['Metallic'].default_value=met
 shader.inputs['Roughness'].default_value=.32
 return m
light=mat('warm public mineral terraces',(.83,.72,.51))
homes=mat('copper residential arcade',(.72,.36,.27))
rail=mat('cool teal transit interchange',(.10,.63,.68),.43)
frame=mat('architectural spaceframe dark titanium',(.26,.36,.43),.50)
park=mat('sky gardens and civic courts',(.32,.56,.39))
glaze=mat('glazed vertical neighborhood skin',(.23,.50,.62),.40)
new=[]
def mesh(name,verts,faces,material,role):
 data=bpy.data.meshes.new('R6R1 '+name)
 data.from_pydata([tuple(v) for v in verts],[],faces);data.update()
 assert data.polygons
 ob=bpy.data.objects.new('R6R1 '+name,data);col.objects.link(ob)
 data.materials.append(material);ob['R6R1_ROLE']=role
 ob['R6R1_NEW_GAME_COLLIDER']=False;ob['R6R1_ART']='HOLD'
 new.append(ob)
 return ob
def loft(name,rs,material,role):
 # Closed solid with different cross-sectional corners at each elevation.
 vs=[x for ring in rs for x in ring];faces=[]
 for i in range(len(rs)-1):
  j=i*4;k=(i+1)*4
  faces.extend(((j,j+1,k+1,k),(j+1,j+2,k+2,k+1),
                (j+2,j+3,k+3,k+2),(j+3,j,k,k+3)))
 faces.extend(((3,2,1,0),tuple(range((len(rs)-1)*4,len(rs)*4))))
 return mesh(name,vs,faces,material,role)
def tower(name,a,l,h,ow,od,twist,material,role):
 rs=[]
 for dy,slant,scale in ((1,0,1),(h*.35,twist*.28,.90),(h*.74,twist*.74,.73),(h,twist,.59)):
  centre=point(a+slant,l+slant*.38,dy)
  rs.append([centre+front*ow*scale/2+right*od*scale/2,
             centre+front*ow*scale/2-right*od*scale/2,
             centre-front*ow*scale/2-right*od*scale/2,
             centre-front*ow*scale/2+right*od*scale/2])
 return loft(name,rs,material,role)
def beam(name,start,end,width,depth,material,role):
 a=Vector(start);b=Vector(end)
 u=b-a;u.y=0
 if u.length<.01:u=Vector((1,0,0))
 u.normalize();lat=Vector((-u.z,0,u.x))
 rings=[]
 for p in (a,b):
  rings.append([p+lat*width/2+Vector((0,depth/2,0)),
    p-lat*width/2+Vector((0,depth/2,0)),
    p-lat*width/2-Vector((0,depth/2,0)),
    p+lat*width/2-Vector((0,depth/2,0))])
 return loft(name,rings,material,role)
# One continuous terminal city VISIBLE AHEAD on the genuine late camera.
# Distances 160m, 325m, 525m ahead of 17s native ball;
# at each distance asymmetric functional city volumes split by 160-260m air void.
rings=[
 {'a':172,'left':-108,'right':114,'height':148,'width':54,'program':'CIVIC'},
 {'a':342,'left':-140,'right':166,'height':202,'width':69,'program':'RESIDENTIAL'},
 {'a':548,'left':-174,'right':183,'height':291,'width':90,'program':'INTERCHANGE'}
]
for i,part in enumerate(rings,1):
 a=part['a'];L=part['left'];R=part['right'];h=part['height'];w=part['width'];program=part['program']
 primary=light if program=='CIVIC' else homes if program=='RESIDENTIAL' else rail
 # True open-air canyon between asymmetric inhabited city megamasses, not portal wall.
 tower(str(i)+' left occupied cliff',a-15,L,h,w,42,-24,primary,program+'_VERTICAL_NEIGHBORHOOD')
 tower(str(i)+' right occupied cliff',a+18,R,h*1.12,w*1.05,48,27,glaze,program+'_INHABITED_GALLERY')
 # Deep open public courts at both sides, NOT decks crossing above the road.
 for side,off in [('west',L),('east',R)]:
  tower(str(i)+' '+side+' inner public edge',a+31,off*1.32,h*.75,26,24,-15 if side=='west' else 18,
   frame,program+'_REAL_DEPTH_TWO_PIER_OPEN_COURT')
  # Civic floor is a solid, connects two off-road city buildings within a district.
  beam(str(i)+' '+side+' garden public upper route',
   point(a-15,off,52),point(a+31,off*1.32,66),
   14,5,park,program+'_HABITABLE_PUBLIC_COURT_NOT_ACCESS_CERTIFIED')
 # Staggered elevated local transit, above road but no game collider created.
 beam(str(i)+' aerial interchange diagonal',
  point(a,L,133),point(a+18,R,154),5.5,3,rail,
  'TRANSIT_CROSSING_ABOVE_SOURCE_ROAD_UNCERTIFIED')
 # Sky-layer relation to existing whole-city prior R6: overlapping city network
 # exists but no false claim of structural welding or human walking certification.
# Add actual longitudinal continuity of public and rail functions (not free-floating lines).
for i in range(len(rings)-1):
 left=rings[i];right_zone=rings[i+1]
 for side in ('left','right'):
  x=left[side];y=right_zone[side]
  beam('coarse inhabited interdistrict corridor '+side+str(i),
   point(left['a']+31,x*1.3,78),
   point(right_zone['a']-15,y,91),
   14,8,light,'PUBLIC_CITY_NETWORK_LINK_NOT_HUMAN_CERTIFIED')
  beam('rail track urban spine '+side+str(i),
   point(left['a']+10,x,153),
   point(right_zone['a']+8,y,159),
   5,3,rail,'REGIONAL_RAIL_NETWORK_NOT_GAME_ROAD')
assert len(new)>=20,len(new)
assert signature()==before
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
newTrees=[(o,bvh(o)) for o in new]
roadTrees=[(o,bvh(o)) for o in B48]
originalCX=[(o,bvh(o)) for o in CX]
hitsRoad=[];hitsCX=[]
for ob,bt in newTrees:
 for o,t in roadTrees:
  hits=bt.overlap(t)
  if hits:hitsRoad.append([ob.name,o.name,len(hits)])
 for o,t in originalCX:
  hits=bt.overlap(t)
  if hits:hitsCX.append([ob.name,o.name,len(hits)])
def bounds(o):
 vs=[o.matrix_world@v.co for v in o.data.vertices]
 return {'min':[min(q[i] for q in vs) for i in range(3)],
         'max':[max(q[i] for q in vs) for i in range(3)]}
def intersects(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
aabbWarnings=[]
for o in new:
 bb=bounds(o)
 for hz in haz['hazards']:
  if hz['sampledAabb'] and intersects(bb,hz['sampledAabb']):
   aabbWarnings.append([o.name,hz['id']])
# Sampled true R1 source mover OBB meshes for each native frame.
movers=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
assert len(movers)==28
moving={}
for fi,f in enumerate(d['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 active={p['id'] for p in f['moving'] if p['enabled']}
 targets=[(o,bvh(o)) for o in movers if o['R1_B51_ID'] in active]
 overlaps=[]
 for city,ct in newTrees:
  for mov,mt in targets:
   h=ct.overlap(mt)
   if h:overlaps.append([city.name,mov['R1_B51_ID'],len(h)])
 moving[f['id']]=overlaps
# Compare all first R6 masses and R6R1 masses in exact original cameras.
frames=['t1100','t1200','t1300','t1400','t1500','t1600','t1700']
views={}
for t in frames:
 f=next(f for f in d['frames'] if f['id']==t)
 fi=d['frames'].index(f)+1;s.frame_set(fi)
 cam=cameras.objects.get(t+' REAL ORIGINAL 240HZ')
 if cam is None:cam=early.objects.get('R1 '+t+' SOURCE CAMERA')
 assert cam
 def project(objects):
  n=0
  for o in objects:
   if any((lambda v: v.z>0 and 0<v.x<1 and 0<v.y<1)
      (world_to_camera_view(s,cam,o.matrix_world@p.co)) for p in o.data.vertices):n+=1
  return n
 views[t]={'initialR6SourceCityMeshesWithPotentialVertex':project(oldcity),
  'newForwardCityMeshesWithPotentialVertex':project(new),
  'visibilityIsNotHumanArt':'TRUE'}
assert signature()==before
s.frame_start=1;s.frame_end=13;s.frame_set(1)
s['R6R1_GAME_NOT_CHANGED']=True;s['R6R1_NEW_GAME_COLLIDERS']=0
s['R6R1_ART']=s['R6R1_RELEASE']='HOLD'
s.cycles.device='CPU';s.cycles.samples=3;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R6R1_'+road+'_FORWARD_FRUSTUM_CITY_EDITABLE_UNADOPTED.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for t in frames:
 f=next(f for f in d['frames'] if f['id']==t)
 s.frame_set(d['frames'].index(f)+1)
 cam=cameras.objects.get(t+' REAL ORIGINAL 240HZ')
 if cam is None:cam=early.objects.get('R1 '+t+' SOURCE CAMERA')
 s.camera=cam
 name='R6R1_'+road+'_'+t+'_REAL_ORIGINAL_CAMERA_HOLD.png'
 s.render.filepath=os.path.join(out,name)
 bpy.ops.render.render(write_still=True)
 renders.append(name)
assert signature()==before
audit={
 'schema':'dopagaki.g4e7dz-r6d-r6r1-forward-world-camera/1','road':road,
 'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalCX':18,'originalB48':7,'originalB51':28,'originalCameras':5,
 'sourceOldR6WholeCityCount':len(oldcity),'newR6R1ForwardMeshes':len(new),
 'sourceIdentityUnchanged':True,'gap52':True,
 'forwardTownPlan':rings,
 'originalRoadB48ExactTriangleIntersections':hitsRoad,
 'originalCXExactTriangleIntersections':hitsCX,
 'all28B51_721TickAabbWarnings':aabbWarnings,
 'originalB51True13PoseTriangleIntersections':moving,
 'sevenTrueCameraProjection':views,
 'continuousTimeB51Safety':'NOT_CERTIFIED',
 'post17sOriginalDriveTrajectory':'NOT_EXTRAPOLATED_OR_CERTIFIED',
 'cityHumanWalkability':'NOT_CERTIFIED',
 'newGameColliders':0,'newCityGameWebGL':'NOT_RENDERED',
 'sourceGameChanged':False,'genuineBlenderPNGs':renders,'editableBlender':blend,
 'officialArt':0,'officialSlope2Meters':0,'ART':'HOLD',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R6R1_'+road+'_AUDIT.json'),'w',encoding='utf-8') as f:
 json.dump(audit,f,indent=2,ensure_ascii=False)
print('R6R1_TRUE_CAMERA_FORWARD_CITY',road,'new',len(new),
 'road',len(hitsRoad),'CX',len(hitsCX),'hazardAabb',len(aabbWarnings),
 'forwardPotential',[views[t]['newForwardCityMeshesWithPotentialVertex'] for t in frames])
