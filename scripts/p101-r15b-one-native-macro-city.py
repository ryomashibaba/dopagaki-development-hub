# R15B / first actual 3D macro-city hypothesis. NEVER a public game asset.
# One world-space terrain spanning both original road variants. Geometry is
# designed from paired native player timelines, not a repeat of 32m-safe boxes.
# Every real source collision & image is evaluated before any adoption decision.
import bpy,sys,json,os,math,statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index('--')+1:]
def arg(k):
 assert k in args,k
 return args[args.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
native=json.load(open(arg('--native'),encoding='utf8'))
true=json.load(open(arg('--shared-true'),encoding='utf8'))
pinch=json.load(open(arg('--shared-pinch'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
for d in (native,true,pinch,haz):assert d['sourceCXBlob']==SHA
assert native['road']==haz['road']==road
assert true['road']=='true-pinch' and pinch['road']=='pinch-switch'
assert native['schema']==true['schema']==pinch['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert len(native['frames'])==len(true['frames'])==len(pinch['frames'])==13
assert len(haz['hazards'])==28

bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL']
assert s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
MOV=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
original=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
extra=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(MOV),len(original.objects),len(extra.objects))==(18,7,28,28,5,8)
def signature():
 return (
 sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o['true_240hz_time']),tuple(round(float(v),5) for v in o.location)) for o in original.objects))
before=signature()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
protected=[('CX',o,tree(o)) for o in CX]+[('B48',o,tree(o)) for o in B48]
newCollection=bpy.data.collections.new('R15B - ONE PAIR-CAMERA MACRO CITY - PRIVATE ART HOLD')
s.collection.children.link(newCollection)
def material(n,c,metal=.25,emission=0):
 m=bpy.data.materials.new('R15B '+n)
 m.diffuse_color=(*c,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*c,1)
 p.inputs['Metallic'].default_value=metal
 p.inputs['Roughness'].default_value=.48
 if emission and 'Emission Color' in p.inputs:
  p.inputs['Emission Color'].default_value=(*c,1)
  p.inputs['Emission Strength'].default_value=emission
 return m
M={
 'cliff':material('pale carved basalt',(.72,.72,.64)),
 'strata':material('warm stone exposed megastructure',(.80,.56,.37)),
 'inner':material('copper habitable inner courts',(.49,.33,.26),.36),
 'civic':material('ivory civic floor',(.85,.76,.57)),
 'transit':material('turquoise transit concrete',(.12,.43,.48),.38),
 'garden':material('deep garden terraces',(.21,.53,.36)),
 'glass':material('azure glazed inner volume',(.34,.66,.72),.44,.28),
 'window':material('golden inhabited city light',(.99,.74,.38),.20,.48)}
new=[]
def addmesh(name,vertices,faces,mat,role):
 d=bpy.data.meshes.new('R15B '+name)
 d.from_pydata([tuple(v) for v in vertices],[],faces)
 d.update()
 ob=bpy.data.objects.new('R15B '+name,d)
 newCollection.objects.link(ob)
 d.materials.append(M[mat])
 ob['R15B_ROLE']=role
 ob['R15B_GAME_COLLIDER']=False
 ob['R15B_ART']='HOLD'
 new.append(ob)
 return ob

# Seven precisely paired 240Hz player positions; synthesize just ONE world
# coordinate system, not independently move a city for each road variant.
keys=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
ta={f['id']:f for f in true['frames']}
pa={f['id']:f for f in pinch['frames']}
stations=[]
for key in keys:
 a=ta[key];b=pa[key]
 center=(Vector(a['playerPosition'])+Vector(b['playerPosition']))*.5
 direction=Vector(a['front'])+Vector(b['front']);direction.y=0;direction.normalize()
 lateral=direction.cross(Vector((0,1,0))).normalized()
 stations.append({'key':key,'p':center,'t':direction,'right':lateral})
assert len(stations)==7
distance=sum((stations[i+1]['p']-stations[i]['p']).length for i in range(6))
assert distance>350,(distance,'macro should follow the full game experience')
def at(x,side,up):
 assert 0<=x<=6
 i=min(5,int(x))
 r=x-i
 p=stations[i]['p'].lerp(stations[i+1]['p'],r)
 vec=stations[i]['right'].lerp(stations[i+1]['right'],r).normalized()
 return p+vec*side+Vector((0,up,0))
def voxel_band(name,aa,bb,left,right,low,high,mat,role,steps=7):
 # Longitudinal massive CLOSED prismatic loft with curved centerline and
 # substantial real-world cross section; no thin 2D art panels or fake gaps.
 assert aa<bb and left<right and low<high and steps>=2
 vertices=[]
 for j in range(steps):
  x=aa+(bb-aa)*j/(steps-1)
  # Non-periodic asymmetry: one geological fold, no repeating grid.
  arch=math.sin(math.pi*(x-aa)/(bb-aa))
  bend=4.5*arch*math.sin(x*.65+aa*.7)
  upshift=5*arch*math.sin(x*.55+left*.01)
  corners=[at(x,left+bend,low+upshift),at(x,right+bend,low+upshift),
           at(x,right+bend,high+upshift),at(x,left+bend,high+upshift)]
  vertices.extend(corners)
 faces=[(3,2,1,0),(4*(steps-1),4*(steps-1)+1,4*(steps-1)+2,4*(steps-1)+3)]
 for k in range(steps-1):
  for j in range(4):
   q=(j+1)%4
   faces.append((4*k+j,4*k+q,4*(k+1)+q,4*(k+1)+j))
 return addmesh(name,vertices,faces,mat,role)
def section(a,b,n,top,kind):
 # Deep OPEN central volume: the camera-facing side is physically absent
 # from +26..+top. It's sky-open over the occupied public approach. The
 # rearward thick cliff and overhanging roof are ACTUAL volume, not portals.
 voxel_band(kind+' rough public earth shelf',a,b,77,161,-22,5,'cliff',kind+'_PUBLIC_GROUND_CARVED_MASS')
 voxel_band(kind+' deep outer inhabited escarpment',a,b,141,166,5,top,'strata',kind+'_HABITAT_CLIFF_REAL_DEPTH')
 voxel_band(kind+' monumental overhanging upper civic plateau',a,b,109,166,top-17,top+3,
  'cliff',kind+'_OVERHANG_OPEN_COURT_NO_FAKE_ROOF_VOID')
 # 50+m wide internal void between inner eye and outer cliff:
 # no wall across the camera-facing side between 20m and top-17m.
 for j,loc in enumerate((a+.15*(b-a),a+.72*(b-a))):
  voxel_band(kind+' irregular occupied civic terrace '+str(j),loc,loc+.13*(b-a),
   91,147,20+j*29,24+j*29,'civic',kind+'_INNER_WIDE_OCCUPIED_TERRACE')
 voxel_band(kind+' actual route-width lower civic passage',a+.04*(b-a),b-.04*(b-a),
  86,107,8,12,'transit',kind+'_LOWER_PASSAGE_RESEARCH_ONLY')
 # Sparse substantial habitable rooms, deliberately no small repeated towers.
 for j,loc in enumerate((a+.18*(b-a),a+.63*(b-a))):
  voxel_band(kind+' thick inhabited gallery volume '+str(j),loc,loc+.16*(b-a),
   130,145,37+j*20,50+j*20,'inner',kind+'_TRUE_THREE_DIMENSIONAL_ROOM')
  voxel_band(kind+' interior glazing '+str(j),loc+.012*(b-a),loc+.14*(b-a),
   128,131,40+j*20,47+j*20,'glass',kind+'_INNER_REAL_WINDOW_VOLUME')
 # One deliberately nonrectangular roof garden on the overhanging plateau.
 voxel_band(kind+' vast rooftop planted terrace',a+.10*(b-a),b-.18*(b-a),
  120,154,top+3,top+8,'garden',kind+'_ROOF_GARDEN_REAL_OCCUPIED_VOLUME')

# Three different interlocking land-masses on the same long public spine.
# Avoid R11's single flat vertical wall and the R14 isolated 32m city.
voxel_band('continuous curving publicly readable earth spine',0,6,89,114,-18,2,
 'cliff','CONTINUOUS_GEOMETRIC_BASE_NOT_CERTIFIED_WALKABLE')
voxel_band('inhabited lower transit promenade',.12,5.88,84,108,17,22,
 'transit','CONTINUOUS_GEOMETRIC_TRANSIT_DECK_NOT_CERTIFIED_ACCESSIBLE')
section(.15,1.92,'A_CIVIC_EARTHFOLD',101,'A_CIVIC_EARTHFOLD')
section(2.14,4.15,'B_MEGAVOID_RESIDENTIAL',144,'B_MEGAVOID_RESIDENTIAL')
section(4.39,5.95,'C_SKYGARDEN_EXCHANGE',123,'C_SKYGARDEN_EXCHANGE')
# Real long bridge between adjacent district public floors, no falsely
# certified support, and never across the original game's drivable surfaces.
for i,(a,b) in enumerate(((1.91,2.15),(4.13,4.42))):
 voxel_band('interdistrict broad concourse '+str(i),a,b,84,108,17,23,
  'civic','CONCOURSE_REAL_CONNECTED_MESH_NOT_WALK_CERTIFIED')
# Large courtyard truly opens to sky between inner approach and rear shell.
# Furnished features are intentionally few; test giant void before detail.
assert len(new)>=25
assert signature()==before

def bounds(o):
 verts=[o.matrix_world@p.co for p in o.data.vertices]
 return {'min':[min(v[i] for v in verts) for i in range(3)],
         'max':[max(v[i] for v in verts) for i in range(3)]}
def overlap(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
newTree=[(o,tree(o)) for o in new]
hitCX=[];hitRoad=[];hitEnvelope=[]
for obj,t in newTree:
 for kind,source,tr in protected:
  hit=t.overlap(tr)
  if hit:
   (hitCX if kind=='CX' else hitRoad).append([obj.name,source.name,len(hit)])
 bb=bounds(obj)
 for mover in haz['hazards']:
  if mover['sampledAabb'] and overlap(bb,mover['sampledAabb']):
   hitEnvelope.append([obj.name,mover['id']])
frames={f['id']:(i+1,f) for i,f in enumerate(native['frames'])}
hitMover13={}
for key,(i,f) in frames.items():
 s.frame_set(i);bpy.context.view_layer.update()
 active={m['id'] for m in f['moving'] if m['enabled']}
 live=[(o,tree(o)) for o in MOV if o['R1_B51_ID'] in active]
 events=[]
 for obj,tr in newTree:
  for mover,mt in live:
   ints=tr.overlap(mt)
   if ints:events.append([obj.name,mover['R1_B51_ID'],len(ints)])
 hitMover13[key]=events
views={}
court={}
for key,(i,f) in frames.items():
 s.frame_set(i);bpy.context.view_layer.update()
 cam=original.objects.get(key+' REAL ORIGINAL 240HZ') or extra.objects.get('R1 '+key+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 forward=Vector(f['front']).normalized()
 right=forward.cross(Vector((0,1,0))).normalized()
 up=right.cross(forward).normalized()
 active={m['id'] for m in f['moving'] if m['enabled']}
 movers=[('B51',o,tree(o)) for o in MOV if o['R1_B51_ID'] in active]
 possible=[('R15B',o,t) for o,t in newTree]+protected+movers
 counts={'R15B':0,'CX':0,'B48':0,'B51':0,'SKY':0}
 roles={}
 W=19;H=12
 for row in range(H):
  for col in range(W):
   u=(col+.5)/W;v=(row+.5)/H
   ray=(forward+right*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   best=(2000,'SKY',None)
   for typ,obj,tr in possible:
    q,n,idx,dist=tr.ray_cast(cam.location,ray,best[0])
    if q is not None and dist is not None and dist<best[0]:
     best=(dist,typ,obj)
   counts[best[1]]+=1
   if best[1]=='R15B':
    role=best[2]['R15B_ROLE'].split('_')[0]
    roles[role]=roles.get(role,0)+1
 assert sum(counts.values())==228
 views[key]={'firstHitsOutOf228':counts,
  'newCityFirstHitFraction':round(counts['R15B']/228,5),
  'cityRoleFirstHitCounts':roles,
  'sourceOriginalCameraNotWebGL':True}
 visible=[]
 for si in (1.1,3.1,5.1):
  for height in (27,57,81):
   target=at(si,123,height)
   ndc=world_to_camera_view(s,cam,target)
   inside=ndc.z>0 and 0<ndc.x<1 and 0<ndc.y<1
   blocker=None
   if inside:
    ray=target-cam.location
    for typ,obj,tr in possible:
     q,n,idx,d=tr.ray_cast(cam.location,ray.normalized(),ray.length-.4)
     if q is not None and (blocker is None or d<blocker[0]):
      blocker=(d,typ)
   visible.append({'station':si,'heightAbovePath':height,'inCamera':bool(inside),
    'trulyUnoccluded':bool(inside and blocker is None),'blocker':blocker[1] if blocker else None})
 court[key]=visible
assert signature()==before
s['R15B_PRIVATE_ONE_INTEGRATED_MACRO_CITY']=True
s['R15B_ORIGINAL_GAME_SOURCE_CHANGED']=False
s['R15B_NEW_GAME_COLLIDERS']=0
s['R15B_ART']='HOLD_REQUIRES_REAL_IMAGE_REVIEW'
s['R15B_NOT_WEBGL']=True
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R15B_'+road+'_MACRO_CITY_TRUE_NATIVE_EDITABLE_ART_HOLD.blend'
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for key in keys:
 i,f=frames[key];s.frame_set(i)
 cam=original.objects.get(key+' REAL ORIGINAL 240HZ') or extra.objects.get('R1 '+key+' SOURCE CAMERA')
 s.camera=cam
 filename='R15B_'+road+'_'+key+'_REAL_SOURCE_BLENDER_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,filename)
 bpy.ops.render.render(write_still=True)
 renders.append(filename)
assert signature()==before
summary={'schema':'dopagaki.r15b-one-actual-paired-world-macro-city-source-art/1',
 'road':road,'sourceCXBlob':SHA,'bothOriginalRoadSharedWorldGeometry':True,
 'bothRoadsInputToExactSharedWorldCoords':True,
 'originalCX18B48_7B51_28Cameras5Unchanged':True,'originalPhysicsHz':240,
 'sourceCameraFramesOriginal13':len(frames),
 'originalTrajectoryPathSpanMetres':round(distance,3),
 'trueWorldMacroCityObjectCount':len(new),
 'cityActualWorldBoundingBoxMetres':{
  'min':[round(min(bounds(o)['min'][j] for o in new),3) for j in range(3)],
  'max':[round(max(bounds(o)['max'][j] for o in new),3) for j in range(3)]},
 'actualSourceCXTriangleIntersections':hitCX,
 'actualSourceB48TriangleIntersections':hitRoad,
 'all28B51_721TickSampledEnvelopeWarnings':hitEnvelope,
 'original13MoverPosesTriangleIntersections':hitMover13,
 'original13CameraFirstHit':views,'original13CourtActualRayClear':court,
 'originalSevenTrueBlenderRenders':renders,'realEditableBlender':blend,
 'sourceGameChanged':False,'newGameColliders':0,
 'accessiblePublicEntrancesTested':False,
 'continuousWalkableTrafficFloorCertified':False,
 'originalGameTrueWebGLRendered':False,
 'originalB51ContinuousTimeSafetyCertified':False,
 'realStructuralLoadCertified':False,
 'humanAestheticApproval':False,
 'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD_INDEPENDENT_IMAGE_GATE',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R15B_'+road+'_SOURCE_MACRO_ART_AUDIT.json'),'w',encoding='utf8') as f:
 json.dump(summary,f,ensure_ascii=False,indent=2)
print('R15B_ACTUAL_MACRO_CITY_HYPOTHESIS',road,'objects',len(new),'path',distance,
 'CX',len(hitCX),'B48',len(hitRoad),'B51_721AABB',len(hitEnvelope),
 '7firstHit',[(k,views[k]['newCityFirstHitFraction']) for k in keys],
 'ART HOLD NO GAME ASSET')
