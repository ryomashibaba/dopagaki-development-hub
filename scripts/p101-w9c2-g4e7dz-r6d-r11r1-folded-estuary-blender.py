# R6D-R11 private ONE design proposal: INHABITED ESTUARY / road-open thick city.
# True immutable R1 original 240Hz cameras & B48×7, B51×28, CX18.
# No game geometry, no approvals, no public or main changes.
import bpy,sys,os,json,math,statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in argv,k;return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
src=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
assert src['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert src['road']==haz['road']==road
assert src['sourceCXBlob']==haz['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert len(src['frames'])==13 and len(haz['hazards'])==28 and haz['frames721']==721
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
MOV=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
ORIGINAL=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
EXT=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(MOV),len(ORIGINAL.objects),len(EXT.objects))==(18,7,28,28,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o['true_240hz_time']),tuple(round(float(x),4) for x in o.location)) for o in ORIGINAL.objects))
before=signature()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@p.co) for p in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
protected=[('CX',o,bvh(o)) for o in CX]+[('B48',o,bvh(o)) for o in B48]
newCollection=bpy.data.collections.new('R11 ONE INHABITED ESTUARY - ORIGINAL-GAME-UNADOPTED')
s.collection.children.link(newCollection)
def material(name,c,metal=.22,emission=0):
 m=bpy.data.materials.new('R11 '+name)
 m.diffuse_color=(*c,1);m.use_nodes=True
 shader=m.node_tree.nodes.get('Principled BSDF')
 shader.inputs['Base Color'].default_value=(*c,1)
 shader.inputs['Metallic'].default_value=metal
 shader.inputs['Roughness'].default_value=.38
 if emission and 'Emission Color' in shader.inputs:
  shader.inputs['Emission Color'].default_value=(*c,1)
  shader.inputs['Emission Strength'].default_value=emission
 return m
M={
 'mineral':material('warm ivory carved city limestone',(.74,.73,.62)),
 'civic':material('warm golden public civic interior',(.84,.52,.24),.15,.16),
 'habitat':material('oxidized copper residential district',(.53,.32,.27),.35),
 'water':material('deep ocean blue transit city',(.14,.46,.54),.40,.10),
 'garden':material('habitable green city garden',(.27,.57,.41)),
 'glass':material('azure inner open concourse glazing',(.24,.70,.72),.48,.25),
 'seam':material('warm city-room window reveals',(.98,.80,.48),.20,.55)}
new=[]
def mesh(name,vertices,faces,mat,role,sector):
 assert len(vertices)>=4 and len(faces)>=4,name
 dat=bpy.data.meshes.new('R11 '+name)
 dat.from_pydata([tuple(x) for x in vertices],[],faces);dat.update()
 ob=bpy.data.objects.new('R11 '+name,dat)
 newCollection.objects.link(ob)
 dat.materials.append(M[mat])
 ob['R11R1_PROGRAM']=role;ob['R11R1_SECTOR']=sector
 ob['R11R1_ART']='HOLD';ob['R11R1_SOURCE_GEOMETRY_CHANGED']=False
 ob['R11R1_NOT_GAME_COLLIDER']=True
 new.append(ob)
 return ob
def folded_mass(name,quad,bot,innerTop,outerTop,mat,role,sector):
 # Not a vertical billboard. The ORIGINAL proposed thick city shell folds
 # down toward the real open air metropolitan court and faces native cameras.
 # Road-facing opening is not roofed across the native B48 centerline.
 vs=[Vector((v.x,bot,v.z)) for v in quad]
 vs.extend(Vector((v.x,innerTop if i in (0,3) else outerTop,v.z))
           for i,v in enumerate(quad))
 faces=((3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7))
 assert bot<innerTop<outerTop
 return mesh(name,vs,faces,mat,role,sector)
def block(name,quad,bot,top,mat,role,sector):
 assert len(quad)==4 and top>bot,(name,bot,top)
 vs=[Vector((v.x,bot,v.z)) for v in quad]+[Vector((v.x,top,v.z)) for v in quad]
 faces=((3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7))
 return mesh(name,vs,faces,mat,role,sector)
frames={f['id']:f for f in src['frames']}
# Original road bends almost 90 degrees: each center/rotation MUST use its
# own genuine frame, not a single local coordinate blindly copied everywhere.
definitions=[
 ('CIVIC','t1200',147,100,48,82,.78, 'civic',0),
 ('HABITAT','t1450',210,108,52,112,.78, 'habitat',0),
 ('TRANSIT','t1700',146,113,58,124,.86, 'water',168)]
districts=[]
def ringPoint(c,right,along,a,r):
 return c+right*math.cos(a)*r+along*math.sin(a)*r
for sector,key,lateral,outer,inner,high,gap,programMat,forwardOffset in definitions:
 f=frames[key]
 origin=Vector(f['playerPosition']);along=Vector(f['front']);along.y=0;along.normalize()
 right=along.cross(Vector((0,1,0))).normalized()
 center=origin+along*forwardOffset-right*lateral
 floorY=float(origin.y)+(10 if sector=='CIVIC' else 18 if sector=='HABITAT' else 24)
 district={'name':sector,'anchor':key,'centerWorld':[round(float(x),3) for x in center],
  'outerRMetres':outer,'innerOpenCourtyardRMetres':inner,
  'genuineOpenRoadFacingAngleRadians':2*gap,'originalRoadEdgeApproxLateralDistance':lateral-outer,
  'floorHeightWorld':round(floorY,3),'originalCameraMassCliffNotApproved':True}
 districts.append(district)
 n=13
 for i in range(n):
  aa=gap+(math.pi*2-2*gap)*i/n
  bb=gap+(math.pi*2-2*gap)*(i+1)/n
  mid=(aa+bb)/2
  # Recessed, thick continuous inhabited cliff, variable height (not
  # pillars, void gates, or a flat facade screen). Actual radial thickness.
  ro=outer+5.5*math.sin(mid*2+1.1)
  ri=inner+3.5*math.sin(mid*3+.4)
  top=floorY+high*(.66+.32*(.5-.5*math.cos(mid)))
  corner=[
    ringPoint(center,right,along,aa,ri),
    ringPoint(center,right,along,aa,ro),
    ringPoint(center,right,along,bb,ro),
    ringPoint(center,right,along,bb,ri)]
  folded_mass(sector+' inclined open-air inhabited cliff '+str(i),
   corner,floorY-4,floorY+high*(.24+.05*math.sin(mid)),top,
   'mineral' if i%5 else programMat,
   sector+'_REAL_THICK_INCLINED_OCCUPIED_CLIFF_SHELL',sector)
  # Expose actual interior streets: a habitable terrace attaches INSIDE
  # the cliff, opens towards the no-roof central court, and can read as
  # a large continuous internal floor rather than 5m wire rails.
  if i%2==0:
   mid_ri=ri-13
   balcony=[
    ringPoint(center,right,along,aa,mid_ri),
    ringPoint(center,right,along,aa,ri+1),
    ringPoint(center,right,along,bb,ri+1),
    ringPoint(center,right,along,bb,mid_ri)]
   deckY=floorY+29+(7 if sector=='HABITAT' else 11 if sector=='TRANSIT' else 0)
   block(sector+' actual accessible-width internal civic room terrace '+str(i),
     balcony,deckY,deckY+6,
     programMat,sector+'_INTERIOR_WIDE_OCCUPIED_GALLERY_WITH_OPEN_COURT',sector)
   # Warm glazed habitable room is a real 3D radial volume, not
   # merely a line/light plane on a preexisting original source object.
   glazed=[
    ringPoint(center,right,along,aa,ri-11),
    ringPoint(center,right,along,aa,ri-4),
    ringPoint(center,right,along,bb,ri-4),
    ringPoint(center,right,along,bb,ri-11)]
   block(sector+' inhabited inner glass room '+str(i),glazed,deckY+7,deckY+22,
     'glass' if sector!='HABITAT' else 'habitat',
     sector+'_ACTUAL_ROOM_WITH_WALLS_AND_RAISED_FLOOR',sector)
  # Inhabited garden strata are intentionally asymmetric, never repetitive
  # thin lines: 3 substantial planted spatial decks in each city mass.
  if i in (2,6,10):
   garden=[
    ringPoint(center,right,along,aa,ri+6),
    ringPoint(center,right,along,aa,ro-4),
    ringPoint(center,right,along,bb,ro-4),
    ringPoint(center,right,along,bb,ri+6)]
   block(sector+' true-depth rooftop public garden '+str(i),garden,
      floorY+high*.62,floorY+high*.62+5,
      'garden',sector+'_DEEP_ROOF_GARDEN_INHABITED_SPACE',sector)
 # A broad actual public entry surface (not a thin bridge/portal),
 # contained within the road-facing gap of the dense city arc. Uncertified
 # pedestrian connection: never implies a player can step off original road.
 entry=[
    ringPoint(center,right,along,-gap*.37,inner-13),
    ringPoint(center,right,along,-gap*.37,outer+6),
    ringPoint(center,right,along, gap*.37,outer+6),
    ringPoint(center,right,along, gap*.37,inner-13)]
 block(sector+' road-visible civic court approach volume',entry,
    floorY+3,floorY+11,programMat,
    sector+'_GENUINE_OPEN_COURT_APPROACH_UNCERTIFIED_TO_GAME_ROAD',sector)
 # No wall/roof across the ROAD-FACING SECTOR. Sky open over actual 90m
 # diameter civic atrium, contained far from original game road.
 floorVertices=[center+Vector((0,floorY-2,0))]+[
   ringPoint(center,right,along,2*math.pi*i/16,inner-9)+Vector((0,floorY-2,0)) for i in range(16)]
 topVertices=[p+Vector((0,6,0)) for p in floorVertices]
 vs=floorVertices+topVertices
 faces=[]
 for i in range(1,17):
  j=1+(i%16)
  faces.extend(((0,i,j),(17,17+j,17+i)))
  faces.append((i,17+i,17+j,j))
 mesh(sector+' real outdoor metropolitan plaza FLOOR no roof',vs,faces,
  'civic' if sector=='CIVIC' else 'garden' if sector=='HABITAT' else 'water',
  sector+'_TRUE_OUTDOOR_FUNCTIONAL_PLAZA_VOLUME',sector)
 # A broad interchange floor set within the same arc, not a fake thin line
 # strung over original road/players.
 if sector=='TRANSIT':
  aa=2.00;bb=3.25
  q=[ringPoint(center,right,along,aa,inner-15),
   ringPoint(center,right,along,aa,outer-18),
   ringPoint(center,right,along,bb,outer-18),
   ringPoint(center,right,along,bb,inner-15)]
  block('TRANSIT multilayer exchange concourse true volume',q,
     floorY+39,floorY+50,'water',
     'TRANSIT_REAL_BROAD_EXCHANGE_FLOOR_IN_DISTRICT',sector)
# Physically readable continuity of one urban organism: broad, deep
# habitable city ridge follows the BACK, not a overhead gate crossing road.
for i in range(2):
 a=districts[i];b=districts[i+1]
 ca=Vector(a['centerWorld']);cb=Vector(b['centerWorld'])
 delta=cb-ca;delta.y=0
 direction=delta.normalized()
 left=direction.cross(Vector((0,1,0))).normalized()
 # Shift to the back of the escarpment opposite the original road.
 fA=frames[a['anchor']]; fB=frames[b['anchor']]
 aFace=Vector(fA['front']);aFace.y=0;aFace.normalize()
 bFace=Vector(fB['front']);bFace.y=0;bFace.normalize()
 backA=-aFace.cross(Vector((0,1,0))).normalized()
 backB=-bFace.cross(Vector((0,1,0))).normalized()
 # The corridor has 24m real width and 14m thick closed mass.
 pa=ca+backA*(a['outerRMetres']-23)
 pb=cb+backB*(b['outerRMetres']-23)
 v=(pb-pa);v.y=0
 perp=v.normalized().cross(Vector((0,1,0))).normalized()
 quad=(pa+perp*12,pa-perp*12,pb-perp*12,pb+perp*12)
 deckY=(a['floorHeightWorld']+b['floorHeightWorld'])/2+65
 block('INTERDISTRICT inhabitable ridge continuous '+str(i),quad,
    deckY-14,deckY+2,'water',
    'TRANSIT_AND_PUBLIC_FULL_WIDTH_24M_CLOSED_3D_BACKBONE','CITY_NETWORK')
assert len(new)>=65,len(new)
assert signature()==before
# Genuine source triangle overlap. No false "physics safe" if art collides.
newTree=[(o,bvh(o)) for o in new]
sourceB48=[(o,bvh(o)) for o in B48]
sourceCX=[(o,bvh(o)) for o in CX]
hitsRoad=[];hitsCX=[]
for ob,t in newTree:
 for o,tr in sourceB48:
  h=t.overlap(tr)
  if h:hitsRoad.append([ob.name,o.name,len(h)])
 for o,tr in sourceCX:
  h=t.overlap(tr)
  if h:hitsCX.append([ob.name,o.name,len(h)])
def bounds(o):
 vs=[o.matrix_world@p.co for p in o.data.vertices]
 return {'min':[min(v[i] for v in vs) for i in range(3)],
  'max':[max(v[i] for v in vs) for i in range(3)]}
def intersects(a,b):
 return all(a['min'][k]<=b['max'][k] and b['min'][k]<=a['max'][k] for k in range(3))
movingEnvelope=[]
for ob,t in newTree:
 bb=bounds(ob)
 for q in haz['hazards']:
  if q['sampledAabb'] and intersects(bb,q['sampledAabb']):
   movingEnvelope.append([ob.name,q['id']])
moving13={}
for fi,f in enumerate(src['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 active={x['id'] for x in f['moving'] if x['enabled']}
 m=[(o,bvh(o)) for o in MOV if o['R1_B51_ID'] in active]
 count=0;examples=[]
 for obj,t in newTree:
  for mv,tr in m:
   hits=t.overlap(tr)
   if hits:
    count+=1
    if len(examples)<8:examples.append([obj.name,mv['R1_B51_ID'],len(hits)])
 moving13[f['id']]={'intersectionObjectPairs':count,'firstEight':examples}
# Original 7 true source cameras, physically first-hit classified with
# original protected world, original moving B51, and new REAL city triangles.
# This is coarse visibility, not gameplay, pixel segmentation, or human ART.
keys=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
frames={f['id']:(i+1,f) for i,f in enumerate(src['frames'])}
views={}
for key in keys:
 fi,f=frames[key];s.frame_set(fi);bpy.context.view_layer.update()
 cam=ORIGINAL.objects.get(key+' REAL ORIGINAL 240HZ')
 if not cam:cam=EXT.objects.get('R1 '+key+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 forward=Vector(f['front']).normalized()
 right=forward.cross(Vector((0,1,0))).normalized()
 up=right.cross(forward).normalized()
 active={x['id'] for x in f['moving'] if x['enabled']}
 live=[('B51',obj,bvh(obj)) for obj in MOV if obj['R1_B51_ID'] in active]
 objs=[('R11',o,t) for o,t in newTree]+protected+live
 counts={'R11':0,'CX':0,'B48':0,'B51':0,'SKY':0}
 rolehits={};W=19;H=12
 for j in range(H):
  for i in range(W):
   u=(i+.5)/W;v=(j+.5)/H
   d=(forward+right*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   best=(2000,'SKY',None)
   for typ,obj,tr in objs:
    h,n,idx,t=tr.ray_cast(cam.location,d,best[0])
    if h is not None and t is not None and t<best[0]:
     best=(t,typ,obj)
   counts[best[1]]+=1
   if best[1]=='R11':
    program=best[2]['R11R1_PROGRAM'].split('_')[0]
    rolehits[program]=rolehits.get(program,0)+1
 assert sum(counts.values())==W*H
 views[key]={'sourceNativeCamera':True,'firstHitGrid':counts,
  'newCityFirstHitFraction':round(counts['R11']/(W*H),4),
  'roleFirstHitGridCounts':rolehits,
  'realOriginalMoverFrameChecked':len(live)==len(active),
  'notActualGameWebGLAndNotHumanArt':True}
# ray from original source camera to the open COURT volume center:
# 3 height sample points per 3 basins, blocked by source/new meshes?
courtViews={}
for key in keys:
 fi,f=frames[key];s.frame_set(fi);bpy.context.view_layer.update()
 cam=ORIGINAL.objects.get(key+' REAL ORIGINAL 240HZ')
 if not cam:cam=EXT.objects.get('R1 '+key+' SOURCE CAMERA')
 active={x['id'] for x in f['moving'] if x['enabled']}
 objs=[('R11',o,t) for o,t in newTree]+protected+[
   ('B51',o,bvh(o)) for o in MOV if o['R1_B51_ID'] in active]
 found=[]
 for district in districts:
  for height in (9,26,47):
   p=Vector(district['centerWorld'])+Vector((0,height,0))
   ndc=world_to_camera_view(s,cam,p)
   frame=ndc.z>0 and 0<ndc.x<1 and 0<ndc.y<1
   blocked=None
   if frame:
    ray=p-cam.location
    for typ,o,tr in objs:
     h,n,idx,dist=tr.ray_cast(cam.location,ray.normalized(),ray.length-.32)
     if h is not None and (blocked is None or dist<blocked['distance']):
      blocked={'type':typ,'name':o.name,'distance':round(float(dist),3)}
   found.append({'sector':district['name'],'heightAboveCenter':height,
     'inOriginalSourceFrustum':bool(frame),
     'realThreeDimensionalRayClearToCourt':bool(frame and blocked is None),
     'firstOccluder':blocked})
 courtViews[key]=found
assert signature()==before
# Editability is evidenced by Blender .blend; must never be compiled into
# native WebGL/game assets in this study.
s['R11R1_UNADOPTED_CITY_PROPOSAL']=True
s['R11R1_ORIGINAL_PHYSICS_CHANGED']=False
s['R11R1_ART']='HOLD'
s['R11R1_NEW_GAME_COLLIDERS']=0
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R11R1_'+road+'_INHABITED_ESTUARY_NATIVE_SOURCE_EDITABLE_ART_HOLD.blend'
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for key in keys:
 fi,f=frames[key];s.frame_set(fi)
 cam=ORIGINAL.objects.get(key+' REAL ORIGINAL 240HZ')
 if not cam:cam=EXT.objects.get('R1 '+key+' SOURCE CAMERA')
 s.camera=cam
 file='R11R1_'+road+'_'+key+'_ACTUAL_NATIVE_CAMERA_BLENDER_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,file)
 bpy.ops.render.render(write_still=True)
 renders.append(file)
assert signature()==before
audit={'schema':'dopagaki.g4e7dz-r6d-r11r1-folded-estuary-true-source/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'unchangedOriginalCX18_B48_7_B51_28_Cameras5':True,'originalGap52':True,
 'originalNativeFrames':len(src['frames']),'actualOriginalSourceCameraFrames':list(keys),
 'newBlenderResearchMeshes':len(new),'districtsWithActualWorldCoordinates':districts,
 'oneContinuousIntegratedCityHypothesis':True,
 'revisionFromR11':'FOLDED_REAL_SLOPED_INNER_CLIFF_FACES_AND_REAL_LATE_FORWARD_SOURCE_CAMERA_OFFSET',
 'noAutomaticArtAdoptionAfterGeometricVisibilityGain':True,'noAcrossGameRoadBuildingGate':True,
 'originalSourceB48ExactTrianglesIntersectionPairs':hitsRoad,
 'originalSourceCXExactTrianglesIntersectionPairs':hitsCX,
 'all28MovingB51_721TickSampledAabbIntersectionPairs':movingEnvelope,
 'original13TimedMoverB51ExactTriangleIntersections':moving13,
 'original7CamerasActualBVHFirstHit':views,
 'original7CamerasActualCourt3DRay':courtViews,
 'oneResearchCityNotGameAsset':True,'actualBlenderRenders':renders,'editableBlender':blend,
 'sourceGameChanged':False,'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD_INDEPENDENT_REAL_IMAGE_REVIEW',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R11R1_'+road+'_ACTUAL_SOURCE_AUDIT.json'),'w',encoding='utf8') as fd:
 json.dump(audit,fd,ensure_ascii=False,indent=2)
print('R11R1_ONE_REAL_HOLLOW_CITY',road,'objects',len(new),
 'road source triangle collision objects',len(hitsRoad),
 'CX source triangle collision objects',len(hitsCX),
 'all28 721Tick sampled box warnings',len(movingEnvelope),
 'seven camera new real first-hit fractions',[(k,views[k]['newCityFirstHitFraction']) for k in keys],
 'actual seven Blender images, editable blend and no game modifications')
