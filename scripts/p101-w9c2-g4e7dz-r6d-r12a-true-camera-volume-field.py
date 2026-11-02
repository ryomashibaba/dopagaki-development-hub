# R6D-R12A original-R1 camera AND true original-CX/B48/B51 3D space preflight
# No new art, no new game geometry. Do not allow source-occluding wall prototypes.
import bpy,json,sys,os,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
a=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in a,k;return a[a.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
native=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert native['road']==haz['road']==road
assert native['sourceCXBlob']==haz['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--blend'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
movers=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
originalB51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
originalCams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(roads),len(movers),len(originalB51),len(originalCams.objects),len(early.objects))==(18,7,28,28,5,8)
def sig():
 return [sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in originalB51),
 sorted((o.name,float(o['true_240hz_time'])) for o in originalCams.objects)]
before=sig()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
world=[('CX',o,bvh(o)) for o in cx]+[('B48',o,bvh(o)) for o in roads]
frames=native['frames']
cameraFrame={}
for idx,f in enumerate(frames,1):
 s.frame_set(idx);bpy.context.view_layer.update()
 key=f['id']
 cam=originalCams.objects.get(key+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+key+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 active={m['id'] for m in f['moving'] if m['enabled']}
 cameraFrame[key]=(cam,[('B51',x,bvh(x)) for x in movers if x['R1_B51_ID'] in active])
 assert len(cameraFrame[key][1])==len(active)
def visible(p,key):
 cam,live=cameraFrame[key]
 ndc=world_to_camera_view(s,cam,p)
 if not(ndc.z>0 and .05<ndc.x<.95 and .07<ndc.y<.93):return False
 dir=p-cam.location
 if dir.length<1:return False
 for typ,o,tree in world+live:
  h,n,i,d=tree.ray_cast(cam.location,dir.normalized(),dir.length-.3)
  if h is not None:return False
 return True
def hazard(bb):
 hits=[]
 for q in haz['hazards']:
  h=q['sampledAabb']
  if h and all(bb['min'][k]<=h['max'][k] and h['min'][k]<=bb['max'][k] for k in range(3)):
   hits.append(q['id'])
 return hits
def box(p,sx=13,sz=15,height=36):
 # 26 x 30 x 36m potential occupied room plus courtyard pocket.
 verts=[(p.x+dx,p.y+dy,p.z+dz) for dy in (0,height) for dx,dz in
  ((-sx,-sz),(-sx,sz),(sx,sz),(sx,-sz))]
 faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 return BVHTree.FromPolygons(verts,faces,all_triangles=False),{
  'min':[min(x[j] for x in verts)-4 for j in range(3)],
  'max':[max(x[j] for x in verts)+4 for j in range(3)]}
anchors=[('EARLY','t1200',('t1100','t1150','t1200','t1250','t1300')),
         ('MIDDLE','t1450',('t1350','t1400','t1450','t1500','t1550')),
         ('LATE','t1700',('t1600','t1650','t1700'))]
byid={f['id']:f for f in frames}
candidate=[]
for era,anchor,timeWindow in anchors:
 f=byid[anchor];p=Vector(f['playerPosition'])
 forward=Vector(f['front']);forward.y=0;forward.normalize()
 right=forward.cross(Vector((0,1,0))).normalized()
 for side in (-1,1):
  for along in (65,115,165,215):
   for lateral in (75,120,175,230):
    for rise in (10,35,65):
     center=p+forward*along+right*side*lateral+Vector((0,rise,0))
     t,bb=box(center)
     if hazard(bb):continue
     hits=[]
     for typ,obj,tr in world:
      ov=t.overlap(tr)
      if ov:hits.append([typ,obj.name,len(ov)])
     if hits:continue
     # A genuinely empty shell envelope is not proof of habitable access.
     # Camera can see an interior at multiple heights rather than only its skin.
     exposure={}
     for key in timeWindow:
      exposure[key]=[h for h in (4,18,32) if visible(center+Vector((0,h,0)),key)]
     count=sum(len(v)>=2 for v in exposure.values())
     if count==0:continue
     full={key:len(exposure.get(key,[])) for key in timeWindow}
     candidate.append({'era':era,'anchor':anchor,'side':side,
      'relativeForward':along,'relativeLateral':lateral,'relativeRise':rise,
      'worldXYZ':[round(float(x),4) for x in center],
      'clearOriginalCXAndB48SourceTriangles':True,
      'clearAll28Moving721TickSampleAABBs':True,
      'originalCameraWindow3DHeightVisible':full,
      'cameraFramesWithTwoClearInteriorHeights':count,
      'cameraFramesWithAnyInteriorHeight':sum(bool(v) for v in exposure.values()),
      'zeroNewGameColliders':True})
chosen={}
for era,anchor,window in anchors:
 rows=[x for x in candidate if x['era']==era]
 rows.sort(key=lambda x:(-x['cameraFramesWithTwoClearInteriorHeights'],
  -x['cameraFramesWithAnyInteriorHeight'],
  abs(x['relativeLateral']-120),x['relativeForward']))
 chosen[era]=rows[0] if rows else None
# The three eras are researchable independent pockets. A continuous walkable
# city graph and aesthetic identity remain UNPROVEN even when all found.
assert before==sig()
report={'schema':'dopagaki.g4e7dz-r6d-r12a-source-cameras-safe-volume-field/1',
 'road':road,'sourceCXBlob':native['sourceCXBlob'],
 'sourceCX18B48_7B51_28Cameras5Unchanged':True,
 'candidateCount':len(candidate),'candidateCountByEra':{a:sum(v['era']==a for v in candidate) for a,k,w in anchors},
 'testedSourceBoxDimensionsMetres':[26,30,36],
 'allSafeCameraVisibleCandidatePositions':candidate,'bestPerEra':chosen,
 'originalR1Native13FramesUsed':True,'all28Moving721TickConservativeAABBUsed':True,
 'sourceGameChanged':False,'newResearchArchitectureMeshes':0,'newGameColliders':0,
 'officialArt':0,'officialSlope2Metres':0,
 'humanCityWayfindingApproved':False,'bridgeFloorOrEngineeringCertified':False,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R12A_'+road+'_SAFE_NATIVE_VOLUME_FIELD.json'),'w',encoding='utf8') as f:json.dump(report,f,ensure_ascii=False,indent=2)
print('R12A',road,'physical source SAFE candidate',len(candidate),'per era',report['candidateCountByEra'],
 'chosen',[(k,v['worldXYZ'] if v else None) for k,v in chosen.items()], 'ART HOLD')
