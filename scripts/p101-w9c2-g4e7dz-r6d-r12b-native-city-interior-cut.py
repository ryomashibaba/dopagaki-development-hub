# R6D-R12B private ONE design proposal: INHABITED ESTUARY / road-open thick city.
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
newCollection=bpy.data.collections.new('R12B ONE INHABITED ESTUARY - ORIGINAL-GAME-UNADOPTED')
s.collection.children.link(newCollection)
def material(name,c,metal=.22,emission=0):
 m=bpy.data.materials.new('R12B '+name)
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
 dat=bpy.data.meshes.new('R12B '+name)
 dat.from_pydata([tuple(x) for x in vertices],[],faces);dat.update()
 ob=bpy.data.objects.new('R12B '+name,dat)
 newCollection.objects.link(ob)
 dat.materials.append(M[mat])
 ob['R12B_PROGRAM']=role;ob['R12B_SECTOR']=sector
 ob['R12B_ART']='HOLD';ob['R12B_SOURCE_GEOMETRY_CHANGED']=False
 ob['R12B_NOT_GAME_COLLIDER']=True
 new.append(ob)
 return ob
def block(name,quad,bot,top,mat,role,sector):
 assert len(quad)==4 and top>bot,(name,bot,top)
 vs=[Vector((v.x,bot,v.z)) for v in quad]+[Vector((v.x,top,v.z)) for v in quad]
 faces=((3,2,1,0),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7))
 return mesh(name,vs,faces,mat,role,sector)
# R12B: choose fully-source-cleared 26x30x36m 3D volumes BEFORE geometry.
# Prefer an actual near-camera region over the 220m distant 'best' location.
gate=json.load(open(arg('--r12a'),encoding='utf8'))
assert gate['schema']=='dopagaki.g4e7dz-r6d-r12a-source-cameras-safe-volume-field/1'
assert gate['road']==road and gate['sourceCXBlob']==src['sourceCXBlob']
assert gate['sourceCX18B48_7B51_28Cameras5Unchanged']
frames={f['id']:f for f in src['frames']}
eras=[('CIVIC','EARLY'),('HABITAT','MIDDLE'),('TRANSIT','LATE')]
districts=[]
selected=[]
def local(center,forward,right,u,v,y):
 return center+right*u+forward*v+Vector((0,y,0))
def patch(name,quad,y0,y1,color,role,sector):
 assert y1>y0
 return block(name,quad,y0,y1,color,role,sector)
for sector,era in eras:
 window=[v for v in gate['allSafeCameraVisibleCandidatePositions']
  if v['era']==era and v['side']==1 and
  v['cameraFramesWithTwoClearInteriorHeights']>=(4 if era=='EARLY' else 3)]
 assert window,('R12B_NO_SAFE_SOURCE_SITE',road,era)
 # 99-137m from the original player instead of huge, unrecognizable R12B walls.
 window.sort(key=lambda v:(math.hypot(v['relativeForward'],v['relativeLateral']),
   -v['cameraFramesWithTwoClearInteriorHeights']))
 best=window[0]
 selected.append(best)
 core=Vector(best['worldXYZ'])
 f=frames[best['anchor']]
 front=Vector(f['front']);front.y=0;front.normalize()
 right=front.cross(Vector((0,1,0))).normalized()
 def rect(name,u0,u1,v0,v1,lo,hi,color,role):
  assert -8<=u0<u1<=8 and -8<=v0<v1<=8 and 0<=lo<hi<=36,(name,u0,u1,v0,v1,lo,hi)
  quad=[local(core,front,right,u0,v0,0),
   local(core,front,right,u0,v1,0),
   local(core,front,right,u1,v1,0),
   local(core,front,right,u1,v0,0)]
  return patch(sector+' '+name,quad,core.y+lo,core.y+hi,color,role,sector)
 # ONE road-open 16x16m real inhabited multi-floor city cut, no roof
 # over the courtyard void. No screen facade across v=-8 (road-side).
 rect('real civic court supporting slab',-7.7,7.7,-7.5,7.5,0,1.6,
   'civic' if sector=='CIVIC' else 'garden' if sector=='HABITAT' else 'water',
   sector+'_OPEN_AIR_PUBLIC_FLOOR_PHYSICS_NOT_CERTIFIED')
 rect('west occupied solid structural mass',-8,-6.3,-7.7,7.8,1.5,33.5,
   'mineral',sector+'_THICK_REAL_SIDE_BUILDING_AND_LOAD_PATH_UNVERIFIED')
 rect('east occupied solid structural mass',6.3,8,-7.7,7.8,1.5,33.5,
   'mineral',sector+'_THICK_REAL_SIDE_BUILDING_AND_LOAD_PATH_UNVERIFIED')
 rect('rear inhabited integrated vertical spine',-8,8,6.5,8,1.5,33.5,
   'habitat' if sector=='HABITAT' else 'mineral',
   sector+'_SOLID_REAL_REAR_CITY_BUILDING')
 for story,height in enumerate((8.4,17.5,26.5),1):
  # Deliberately open 6.4m-wide vertical hollow. In camera-facing half:
  # no cross-wall, no cap and no false enclosed city facade.
  rect('left habitable terrace floor '+str(story),
      -6.3,-2.8,-6.5,6.5,height,height+1.5,
      'habitat' if sector=='HABITAT' else 'civic',
      sector+'_REAR_OPEN_INHABITED_PUBLIC_GALLERY')
  rect('right habitable terrace floor '+str(story),
      2.8,6.3,-6.5,6.5,height,height+1.5,
      'water' if sector=='TRANSIT' else 'glass',
      sector+'_REAR_OPEN_INHABITED_PUBLIC_GALLERY')
  # Not fake thin upper line; 4m deep, three-dimensional rooms around
  # each floor, with visible side window panels in the open shaft.
  for side,ulo,uhi in (('west',-6.3,-3.4),('east',3.4,6.3)):
   rect(side+' actual occupied room '+str(story),ulo,uhi,1.0,5.8,
       height+1.7,height+6.7,
       'habitat' if sector=='HABITAT' else 'water' if sector=='TRANSIT' else 'civic',
       sector+'_REAL_HEIGHT_ROOM_VOLUME_NOT_A_PAINTED_ROLE')
   rect(side+' court facing bright window volume '+str(story),
       (uhi-.35) if side=='west' else ulo,
       uhi if side=='west' else ulo+.35,1.3,5.4,
       height+3.4,height+5.0,'seam',
       sector+'_INTERIOR_WINDOW_NOT_A_FAKE_SCREEN_FACADE')
 # 16m outdoor court with actual stepped entrance on near camera side
 # where the road is visible. The steps are source-private and unconnected
 # to real gameplay by design.
 for i in range(4):
  v=-7.7+i*1.15
  rect('large civic entry step '+str(i),-3.6,3.6,v,min(7.9,v+1.25),
       1.6,2.3+i*.46,'civic',
       sector+'_OPEN_FRONT_COURT_ENTRY_STAIRS_NOT_REAL_PLAYER_ACCESS')
 # A physical elevated rail platform behind the open shaft, not giant
 # overhead B48-crossing gate. The city is one architectural section.
 rect('inside-city transit station concourse',-5.8,5.8,3.2,6.6,12.7,14.9,
   'water',sector+'_DEEP_TRANSIT_PLATFORM_INSIDE_OPEN_COURT')
 rect('transit passenger transfer edge',-3.5,3.5,5.0,6.5,14.9,16.0,
   'glass',sector+'_TRANSFER_AREA_PROVEN_GEOMETRY_NOT_WALKABILITY')
 # Offset vertical stair in existing small building section, with stairs
 # genuinely stepping vertically. Non-B48 game entity.
 for i in range(8):
  vv=-4.9+i*.9
  rect('side vertical stair '+str(i),3.9,6.1,vv,vv+.82,
    2.2+i*.70,2.9+i*.70,'civic',
    sector+'_ACTUAL_RISERS_UNCONNECTED_TO_UPPER_LEVEL')
 # Sloped solid upper roof lips fold around air void; central top is
 # deliberately EMPTY for sunlight and sightline into housing.
 for side,lo,hi in (('WEST',-8,-3.9),('EAST',3.9,8)):
  roof=[local(core,front,right,lo,-7,0),
        local(core,front,right,lo,7.5,0),
        local(core,front,right,hi,7.5,0),
        local(core,front,right,hi,-7,0)]
  # Tall 2m roof slab, not a thin billboard.
  patch(sector+' '+side+' solid folded roof garden',roof,
    core.y+32.2,core.y+34.4,'garden',
    sector+'_ONLY_ROOF_ABOVE_SIDE_HABITATION',sector)
 # Real window-lit inner courtyard gardens at 3 distinct staggered levels
 for i,(u0,u1,v0,v1,hh) in enumerate(((-6.2,-3,0,3,9.9),(3,6.2,-5,-1,19),(-6.2,-3,2,5.5,28)),1):
  rect('inhabited terrace garden '+str(i),u0,u1,v0,v1,hh,hh+1.15,
   'garden',sector+'_LANDSCAPED_REAL_PUBLIC_POCKET')
 districts.append({'name':sector,'anchor':best['anchor'],
  'centerWorld':best['worldXYZ'],'siteOriginalSourcePreclear':True,
  'sourceEmptyResearchBoxMetres':[26,30,36],
  'physicalPublicConnectionToOtherErasCertified':False,
  'cameraFramesWithTwoClearBeforeModel':best['cameraFramesWithTwoClearInteriorHeights'],
  'roadOpenTerracedPublicVoidWidthMetres':5.6,
  'realFloorLevels':[1.6,9.9,19.0,28.0]})
# Keep independent spatial zones rather than inventing several-hundred
# metre skywalks that intersect game obstacles / lack source supports.
assert len(new)>=70,len(new)
# Strictly confine EVERY city vertex to the actual original precleared AABB
# box for that selected era. This is a stronger premodel bounding rule than
# source-first facade speculation.
for sector,best in zip(('CIVIC','HABITAT','TRANSIT'),selected):
 target=Vector(best['worldXYZ'])
 relevant=[o for o in new if o['R12B_SECTOR']==sector]
 assert len(relevant)>=20
 for ob in relevant:
  for v in ob.data.vertices:
   p=ob.matrix_world@v.co
   assert abs(p.x-target.x)<=13.001 and abs(p.z-target.z)<=15.001,(ob.name,'outside original precleared 3D volume')
   assert target.y-.01<=p.y<=target.y+36.01,(ob.name,'outside precleared height')

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
 objs=[('R12B',o,t) for o,t in newTree]+protected+live
 counts={'R12B':0,'CX':0,'B48':0,'B51':0,'SKY':0}
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
   if best[1]=='R12B':
    program=best[2]['R12B_PROGRAM'].split('_')[0]
    rolehits[program]=rolehits.get(program,0)+1
 assert sum(counts.values())==W*H
 views[key]={'sourceNativeCamera':True,'firstHitGrid':counts,
  'newCityFirstHitFraction':round(counts['R12B']/(W*H),4),
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
 objs=[('R12B',o,t) for o,t in newTree]+protected+[
   ('B51',o,bvh(o)) for o in MOV if o['R1_B51_ID'] in active]
 found=[]
 for district in districts:
  for height in (5,15,27):
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
s['R12B_UNADOPTED_CITY_PROPOSAL']=True
s['R12B_ORIGINAL_PHYSICS_CHANGED']=False
s['R12B_ART']='HOLD'
s['R12B_NEW_GAME_COLLIDERS']=0
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R12B_'+road+'_INHABITED_ESTUARY_NATIVE_SOURCE_EDITABLE_ART_HOLD.blend'
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for key in keys:
 fi,f=frames[key];s.frame_set(fi)
 cam=ORIGINAL.objects.get(key+' REAL ORIGINAL 240HZ')
 if not cam:cam=EXT.objects.get('R1 '+key+' SOURCE CAMERA')
 s.camera=cam
 file='R12B_'+road+'_'+key+'_ACTUAL_NATIVE_CAMERA_BLENDER_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,file)
 bpy.ops.render.render(write_still=True)
 renders.append(file)
assert signature()==before
audit={'schema':'dopagaki.g4e7dz-r6d-r12b-source-safe-real-city-cut/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'unchangedOriginalCX18_B48_7_B51_28_Cameras5':True,'originalGap52':True,
 'originalNativeFrames':len(src['frames']),'actualOriginalSourceCameraFrames':list(keys),
 'newBlenderResearchMeshes':len(new),'districtsWithActualWorldCoordinates':districts,
 'oneContinuousIntegratedCityHypothesis':False,
 'separateThreeRoadTimeErasOneConsistentCityLanguage':True,
 'trueStructuralInterEraConnections':'NOT_DESIGNED_OR_CERTIFIED',
 'originalEmptyBoxSourcePreflightR12A':True,'noAcrossGameRoadBuildingGate':True,
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
with open(os.path.join(out,'R12B_'+road+'_ACTUAL_SOURCE_AUDIT.json'),'w',encoding='utf8') as fd:
 json.dump(audit,fd,ensure_ascii=False,indent=2)
print('R12B_ONE_REAL_HOLLOW_CITY',road,'objects',len(new),
 'road source triangle collision objects',len(hitsRoad),
 'CX source triangle collision objects',len(hitsCX),
 'all28 721Tick sampled box warnings',len(movingEnvelope),
 'seven camera new real first-hit fractions',[(k,views[k]['newCityFirstHitFraction']) for k in keys],
 'actual seven Blender images, editable blend and no game modifications')
