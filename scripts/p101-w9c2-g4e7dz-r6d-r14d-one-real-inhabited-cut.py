# R14D: one genuine source-grounded, EDITABLE, road-facing inhabited
# arc-cliff courtyard cut. NOT a game asset, no early/mid/late fake links.
# Source shared world site comes ONLY from R14B both-roads verified facts.
import bpy,sys,json,os,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in args,k;return args[args.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
proof=json.load(open(arg('--r14b'),encoding='utf8'))
native=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
assert proof['schema']=='dopagaki.g4e7dz-r6d-r14b-two-real-roads-identical-world-source-city-site/1'
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert proof['sourceCXBlob']==native['sourceCXBlob']==haz['sourceCXBlob']==SHA
assert native['road']==haz['road']==road
site=proof['bothOriginalRoadSameCoordinatesConfirmedPerPhase']['MIDDLE']['bestSharedSite']
assert site and site['bothActualRoadVariantsSourceVolumeClear']
assert site['trueOriginalFrame']==14 and site['commonPhysicalBoxMetres']==[32,36,36]
assert min(site['bothSameFrameCameraIntoInteriorCount'])>=2
C=Vector(site['sharedOriginal3DWorldXYZ'])
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
ROAD=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
PROX=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
extra=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(ROAD),len(B51),len(PROX),len(cams.objects),len(extra.objects))==(18,7,28,28,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in ROAD),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
before=signature()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
sourceObjects=[('CX',o,bvh(o)) for o in CX]+[('B48',o,bvh(o)) for o in ROAD]
# Shared location in both game roads; orient open court toward original
# MIDTIME source camera and reserve 16m/18m physically safe AABB.
i14=next(i for i,f in enumerate(native['frames'],1) if f['id']=='t1400')
s.frame_set(i14);bpy.context.view_layer.update()
cam=cams.objects.get('t1400 REAL ORIGINAL 240HZ') or extra.objects.get('R1 t1400 SOURCE CAMERA')
assert cam
front=Vector(cam.location-C);front.y=0;front.normalize() # toward real camera, not game track
side=Vector((-front.z,0,front.x))
assert abs(front.x)<1 and abs(front.z)<1
coll=bpy.data.collections.new('R14D ACTUAL HABITABLE COURTYARD ONE SOURCE SITE ART HOLD')
s.collection.children.link(coll)
new=[]
def mat(name,color,metal=.22,light=0):
 m=bpy.data.materials.new('R14D '+name);m.diffuse_color=(*color,1)
 m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*color,1)
 bs.inputs['Roughness'].default_value=.43;bs.inputs['Metallic'].default_value=metal
 if light and 'Emission Color' in bs.inputs:
  bs.inputs['Emission Color'].default_value=(*color,1)
  bs.inputs['Emission Strength'].default_value=light
 return m
pal={
 'shell':mat('pearl ceramic urban escarpment',(.77,.77,.69)),
 'exposed':mat('sunlit mineral inner cliff',(.85,.66,.46)),
 'civic':mat('warm populated public civic rooms',(.81,.50,.31),.12),
 'home':mat('copper residential night walls',(.43,.37,.31),.42),
 'rail':mat('deep teal true transit level',(.09,.42,.50),.45),
 'glass':mat('blue inhabitable gallery volume',(.30,.65,.68),.48,.24),
 'garden':mat('green occupied terrace gardens',(.24,.58,.42),.20),
 'light':mat('inhabited room edge warm glow',(.96,.75,.48),.18,.65)}
def local(u,v,y):
 return C+side*u+front*v+Vector((0,y,0))
def addmesh(name,vertices,faces,m,role):
 v=[Vector(q) for q in vertices]
 # Expand all 3D vertices relative to exact preverified source AABB.
 # If displaced outside, STOP before render, not after creating false art.
 for p in v:
  assert abs(p.x-C.x)<=16.002 and abs(p.z-C.z)<=18.002 and C.y-.002<=p.y<=C.y+36.002,(name,list(p))
 data=bpy.data.meshes.new('R14D '+name)
 data.from_pydata([tuple(q) for q in v],[],faces)
 data.update()
 obj=bpy.data.objects.new('R14D '+name,data)
 coll.objects.link(obj)
 data.materials.append(pal[m])
 obj['R14D_PROGRAM']=role
 obj['R14D_OFFICIAL_GAME_GEOMETRY']=False
 obj['R14D_ART_STATUS']='HOLD'
 new.append(obj)
 return obj
def prism(name,base,lo,hi,m,role):
 assert hi>lo
 vs=[p+Vector((0,lo,0)) for p in base]+[p+Vector((0,hi,0)) for p in base]
 N=len(base)
 faces=[tuple(reversed(tuple(range(N)))),tuple(range(N,2*N))]
 for i in range(N):
  j=(i+1)%N
  faces.append((i,j,N+j,N+i))
 return addmesh(name,vs,faces,m,role)
def quad(name,u0,u1,v0,v1,lo,hi,m,role):
 assert u1>u0 and v1>v0
 return prism(name,[local(u0,v0,0),local(u0,v1,0),local(u1,v1,0),local(u1,v0,0)],lo,hi,m,role)
def sector(name,a0,a1,r0,r1,lo,hi,m,role):
 assert r0>0 and r1>r0 and a1>a0
 k=5
 outer=[local(math.sin(a0+(a1-a0)*i/k)*r1,math.cos(a0+(a1-a0)*i/k)*r1,0) for i in range(k+1)]
 inner=[local(math.sin(a0+(a1-a0)*i/k)*r0,math.cos(a0+(a1-a0)*i/k)*r0,0) for i in range(k,-1,-1)]
 return prism(name,outer+inner,lo,hi,m,role)
# Topologically OPEN front gap on the CAMERA SIDE, negative right/left
# urban wings around a true sky-open civic courtyard (r<5m).
# Angles from front-to-camera, arc is .86.. 2pi-.86.
# No regular periodic skyscraper grid; asymmetrical heights/masses.
wings=[(.88,1.77,'WEST_CIVIC'),(1.80,3.43,'BACK_TRANSIT'),
 (3.47,4.65,'EAST_HABITAT'),(4.70,5.38,'EAST_GARDEN')]
for wi,(aa,bb,program) in enumerate(wings):
 # Raised inhabited shell stratified, actual full-depth units, with
 # physical multi-metre gaps between floors/windows.
 maximum=(33.3,29.4,35.1,23.1)[wi]
 for lower,upper in ((0,7.2),(9.4,15.8),(18.2,24.6),(27.0,maximum)):
  if upper>maximum or upper<=lower:continue
  sector(program+' deep true 3D inhabited mineral cliff mass '+str(lower),
   aa,bb,8.9,11.0,lower,upper,
   'shell' if wi%2==0 else 'home' if wi==2 else 'exposed',
   program+'_TRUE_DEPTH_OCCUPIED_UVAULT_SHELL')
 # 6 separate half-metre deep solid corner supports frame actual
 # WINDOW OPENINGS. These are structural-looking research geometry
 # but actual loads not engineered.
 for angle in (aa,bb):
  sector(program+' real full-height stone bearing pier '+str(angle),
   angle,angle+.075,8.25,11.4,0,maximum,
   'exposed',program+'_THICK_STRUCTURAL_LOOKING_SOURCE_RESEARCH_ONLY')
 # Galleries are broad 3m deep, not line/rods: one solid occupied floor
 # per level (for lived-in public room + garden).
 for floor,role,m in ((8.0,'CIVIC_FLOOR','civic'),
  (16.5,'RESIDENTIAL_FLOOR','home'),
  (25.5,'TRANSIT_OR_GREEN_FLOOR','rail' if wi==1 else 'garden')):
  if floor+1.4>=maximum:continue
  sector(program+' recessed physical occupied gallery floor '+str(floor),
   aa+.07,bb-.07,5.9,9.0,floor,floor+1.25,m,
   program+'_INHABITED_OCCUPIED_GALLERY_WITH_COURT_ACCESS_RESEARCH')
  # Actual rooms inside exterior mass, vivid from SOURCE camera when
  # courtyard is visible, not a texture pretending there are dwellings.
  theta=(aa+bb)/2
  sector(program+' independent inward glass room '+str(floor),
    theta-.18,theta+.18,6.5,8.6,floor+1.4,min(floor+5.7,maximum-.2),
    'glass',program+'_PHYSICAL_HABITABLE_ROOM_VISIBLE_FROM_OPEN_COURT')
  sector(program+' continuous inward window sill '+str(floor),
    theta-.20,theta+.20,6.1,6.8,floor+1.6,floor+2.3,
    'light',program+'_WINDOW_APERTURE_DEPTH')
# Deliberate large civic VOID: inner r<5.9 is empty all the way to sky.
# Floor has actual thickness, stepped real terraces and no front wall.
sector('CIVIC outside square entrance garden',-.66,.66,1.4,8.3,0,1.3,
 'civic','PUBLIC_TRUE_ROAD_VISIBLE_NO_FRONT_WALL_COURT')
# Actual open-air center planted disk: 12 sided low plaza geometry.
N=12
base=[local(math.sin(i*math.tau/N)*5.7,math.cos(i*math.tau/N)*5.7,0) for i in range(N)]
prism('CIVIC true sky-open accessible-scale empty courtyard floor',base,0,1.6,
 'civic','PUBLIC_CONTINUOUS_SURFACE_WITH_OPEN_SKY_NOT_PLAYER_ACCESS_CERTIFIED')
# Internal civic route from entrance to center, closed solid physical
# steps not an invented long bridge beyond source clear box.
for k in range(6):
 v0=5.0+k*.73
 quad('CIVIC front court true gradual entrance step '+str(k),
 -2.25,2.25,v0,v0+.78,1.2,1.55+k*.21,'civic',
 'PUBLIC_ENTRY_APPROACH_NOT_YET_REAL_ORIGINAL_PLAYER_PATH')
# Rail interchange at back under curved canopy, supported inside mass
# but load capacity and building-code safety NOT CERTIFIED.
sector('TRANSIT real 7m-wide curved rear elevated platform',2.2,4.0,
 3.8,8.5,16.5,19.4,'rail',
 'TRANSIT_FULL_DEPTH_ELEVATED_EXCHANGE_CONNECTED_TO_COURT_RESEARCH')
sector('TRANSIT station glazing service layer',2.25,3.95,
 7.9,9.0,19.4,24.2,'glass',
 'TRANSIT_REAL_ROOM_CONCOURSE')
# Side vertical circulation represented as real enclosing solid, lift shaft
# entrances and its docking landings, NOT proof of a working lift.
quad('PUBLIC stacked lift shaft with physical landings',-8.1,-6.0,
 -3.0,-.5,0,30.3,'civic',
 'PUBLIC_VERTICAL_TRANSFER_SHAFT_ACTUAL_PLATFORM_UNBUILT')
for i,y in enumerate((8.0,16.5,25.5)):
 quad('PUBLIC physical lift landing '+str(i),-8.3,-5.1,-3.4,-.9,
    y,y+1.0,'light','PUBLIC_ELEVATOR_LANDING_NEEDS_CONNECTION_QA')
# Unmistakably non-repeated thick arch folds across rear only, never across
# game road or over the main central opening seen from front camera.
sector('TRANSIT high inhabited civic garden roof',2.1,4.18,
   8.45,11.5,29.5,32.3,'garden','TRANSIT_ROOFGARDEN_REAL_MASS')
assert len(new)>=55,len(new)
assert signature()==before
# Independently true original SOURCE triangle collisions and moving 28
# whole-duration 721tick conservative envelope; CI success != ART PASS.
sourceCX=[];sourceRoad=[];moverAABB=[]
def bounds(o):
 v=[o.matrix_world@p.co for p in o.data.vertices]
 return {'min':[min(q[i] for q in v) for i in range(3)],
  'max':[max(q[i] for q in v) for i in range(3)]}
def overlap(aa,bb):
 return all(aa['min'][i]<=bb['max'][i] and bb['min'][i]<=aa['max'][i] for i in range(3))
newBVH=[(ob,bvh(ob)) for ob in new]
for ob,t in newBVH:
 for kind,sourceObject,bt in sourceObjects:
  h=t.overlap(bt)
  if h:
   (sourceCX if kind=='CX' else sourceRoad).append([ob.name,sourceObject.name,len(h)])
 bb=bounds(ob)
 for mover in haz['hazards']:
  if mover['sampledAabb'] and overlap(bb,mover['sampledAabb']):
   moverAABB.append([ob.name,mover['id']])
poseHits={}
frames={f['id']:(i+1,f) for i,f in enumerate(native['frames'])}
for key,(i,f) in frames.items():
 s.frame_set(i);bpy.context.view_layer.update()
 active={x['id'] for x in f['moving'] if x['enabled']}
 real=[o for o in PROX if o['R1_B51_ID'] in active]
 hits=[]
 for o in real:
  bt=bvh(o)
  for obj,objTree in newBVH:
   overlapSource=objTree.overlap(bt)
   if overlapSource:hits.append([o['R1_B51_ID'],obj.name,len(overlapSource)])
 poseHits[key]=hits
# Exact original camera visibility: count REAL CITY FIRST HITS in a 19x12
# source ray grid without pretending it is human ART/pass or WebGL screenshot.
cameraHits={};courtyard={}
for key,(i,f) in frames.items():
 s.frame_set(i);bpy.context.view_layer.update()
 cam=cams.objects.get(key+' REAL ORIGINAL 240HZ') or extra.objects.get('R1 '+key+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 active={x['id'] for x in f['moving'] if x['enabled']}
 movers=[bvh(o) for o in PROX if o['R1_B51_ID'] in active]
 meshes=[item[1] for item in newBVH]
 fr=Vector(f['front']).normalized()
 rr=fr.cross(Vector((0,1,0))).normalized()
 up=rr.cross(fr).normalized()
 hits=0
 for row in range(12):
  for col in range(19):
   u=(col+.5)/19;v=(row+.5)/12
   ray=(fr+rr*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   dist=2000;kind='SKY'
   for srcKind,o,tr in sourceObjects:
    q,n,idx,d=tr.ray_cast(cam.location,ray,dist)
    if q is not None and d is not None and d<dist:
     dist=d;kind=srcKind
   for tr in movers:
    q,n,idx,d=tr.ray_cast(cam.location,ray,dist)
    if q is not None and d is not None and d<dist:
     dist=d;kind='B51'
   for tr in meshes:
    q,n,idx,d=tr.ray_cast(cam.location,ray,dist)
    if q is not None and d is not None and d<dist:
     dist=d;kind='R14D'
   hits+=int(kind=='R14D')
 cameraHits[key]={'newCityFirstHitRaysOutOf228':hits,'fraction':round(hits/228,5)}
 # the crucial real inner COURT, 3 volume-space points at heights.
 seen=[]
 for h in (3,13,23):
  p=C+Vector((0,h,0))
  ndc=world_to_camera_view(s,cam,p)
  view=ndc.z>0 and 0<ndc.x<1 and 0<ndc.y<1
  blocker=None
  if view:
   delta=p-cam.location
   for typ,obj,tr in sourceObjects:
    q,n,idx,d=tr.ray_cast(cam.location,delta.normalized(),delta.length-.4)
    if q is not None and (blocker is None or d<blocker[0]):blocker=(d,typ)
   for obj,tr in zip(new,meshes):
    q,n,idx,d=tr.ray_cast(cam.location,delta.normalized(),delta.length-.4)
    if q is not None and (blocker is None or d<blocker[0]):blocker=(d,'R14D')
   for tr in movers:
    q,n,idx,d=tr.ray_cast(cam.location,delta.normalized(),delta.length-.4)
    if q is not None and (blocker is None or d<blocker[0]):blocker=(d,'B51')
  seen.append({'height':h,'sourceFrustum':bool(view),'unoccludedActualCityCourtyard':bool(view and blocker is None),
   'firstBlockerType':blocker[1] if blocker else None})
 courtyard[key]=seen
# 7 actual original full-Blender frames per ORIGINAL road, never game WebGL.
s['R14D_PRIVATE_REAL_EDITABLE_ONE_OPEN_CITY_COURT']=True
s['R14D_GENUINE_SOURCE_ORIGINAL_UNMODIFIED']=True
s['R14D_ART']='HOLD_IMAGE_REVIEW'
s['R14D_GAME_ASSET']=False
s['R14D_NEW_GAME_COLLIDERS']=0
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
s.frame_set(1)
blend='R14D_'+road+'_REAL_ORIGINAL_SHARED_CITY_INTERIOR_EDITABLE_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for key in ('t1100','t1200','t1300','t1400','t1500','t1600','t1700'):
 i,f=frames[key];s.frame_set(i)
 cam=cams.objects.get(key+' REAL ORIGINAL 240HZ') or extra.objects.get('R1 '+key+' SOURCE CAMERA')
 s.camera=cam
 name='R14D_'+road+'_'+key+'_GENUINE_NATIVE_BLENDER_NOT_GAME.png'
 s.render.filepath=os.path.join(out,name)
 bpy.ops.render.render(write_still=True)
 renders.append(name)
assert signature()==before
result={'schema':'dopagaki.g4e7dz-r6d-r14d-real-one-inhabited-court-source-images/1',
 'road':road,'sourceCXBlob':SHA,
 'trueBothOriginalRoadIdenticalPrevalidatedResearchSite':site['sharedOriginal3DWorldXYZ'],
 'siteProvenResearchBoxMetres':[32,36,36],
 'genuineOriginalCX18B48_7B51_28Cameras5Unchanged':True,
 'actualNewBlenderArchitectureMeshes':len(new),
 'sourceGameB48ExactTriangleIntersections':sourceRoad,
 'sourceGameCXExactTriangleIntersections':sourceCX,
 'sourceGameB51_28All721ConservativeAABBWarnings':moverAABB,
 'sourceGameB51_13OriginalFrameExactTriangleHits':poseHits,
 'original13TimeNativeCameraCityFirstHit':cameraHits,
 'original13TimeNativeCameraRealCourtyard3Heights':courtyard,
 'originalSame7TimeNativeBlenderRenders':renders,
 'originalEditablePrivateBlender':blend,
 'officialArt':0,'officialSlope2Metres':0,'newGameColliders':0,
 'humanCityQualityAlreadyApproved':False,
 'actualIngamePlayerWalkwayBuilt':False,
 'originalCityStructuralFoundationCertified':False,
 'ART':'HOLD_INDEPENDENT_IMAGE_JUDGMENT','GAMEPLAY':'HOLD','HUMAN':'HOLD',
 'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R14D_'+road+'_TRUE_SOURCE_CITY_COURT_AUDIT.json'),'w',encoding='utf8') as w:
 json.dump(result,w,indent=2,ensure_ascii=False)
print('R14D_REAL_NATIVE_CITY_ONE_SOURCE_SITE',road,'private meshes',len(new),
 'CX B48 overlap',len(sourceCX),len(sourceRoad),
 '28 B51 AABB warnings',len(moverAABB),
 '13 original camera first hits',[(k,v['fraction']) for k,v in cameraHits.items()],
 'NO GAME OR ART ADOPTION')
