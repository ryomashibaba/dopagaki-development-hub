"""R15F - genuine native 240Hz two-road original-camera FIRST macro site search.

Corrects R15B and R15E's >97% original camera invisibility. Samples 336
distinct world-axis box hypotheses and derives their geometry from the actual
original paired player directions. Source evidence is CX18/B48x7 true
triangles, B51 28 x 721 tick conservative AABBs, original 13 camera frames
with original moving-object occlusion and original hazard ray veto.

No art is built. No enclosed box is a support foundation, public access or
real attractive future city, and 2D projected bbox area is a rough upper
bound/overestimate, NOT actual rendered city coverage or human ART.
"""
import bpy,json,math,sys,os,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):
 assert k in argv,k
 return argv[argv.index(k)+1]
out=arg('--out');os.makedirs(out,exist_ok=True)
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
ROADS=('true-pinch','pinch-switch')
r1={r:json.load(open(arg('--native-'+r),encoding='utf8')) for r in ROADS}
hz={r:json.load(open(arg('--hazards-'+r),encoding='utf8')) for r in ROADS}
for road in ROADS:
 assert r1[road]['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
 assert hz[road]['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
 assert r1[road]['road']==hz[road]['road']==road
 assert r1[road]['sourceCXBlob']==hz[road]['sourceCXBlob']==SHA
 assert len(r1[road]['frames'])==13 and len(hz[road]['hazards'])==28
assert [x['id'] for x in r1[ROADS[0]]['frames']]==[x['id'] for x in r1[ROADS[1]]['frames']]
F0={x['id']:x for x in r1[ROADS[0]]['frames']}
F1={x['id']:x for x in r1[ROADS[1]]['frames']}
KEYS=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
def flat(v):
 a=Vector(v);a.y=0;return a.normalized()
candidates=[]
seen=set()
for i,key in enumerate(KEYS):
 a,b=F0[key],F1[key]
 pos=(Vector(a['playerPosition'])+Vector(b['playerPosition']))*.5
 forward=flat(Vector(a['front'])+Vector(b['front']))
 right=Vector((-forward.z,0,forward.x))
 for distance in (85,150,225):
  for side in (-100,-50,50,100):
   for rise in (18,50):
    for dimension in ((42,42,58),(76,64,84)):
     # Bottom is relative to original real player Y, not an assumed
     # horizontal test plane; actual floor support never claimed.
     center=pos+forward*distance+right*side+Vector((0,rise,0))
     world=tuple(round(float(x),4) for x in center)
     identity=(world,dimension)
     if identity in seen:continue
     seen.add(identity)
     candidates.append({'id':key+'D'+str(distance)+'S'+str(side)+'H'+str(rise)+'W'+str(dimension[0]),
      'originFrame':key,'originTimeSeconds':float(a['seconds']),
      'boxBottomCenterWorldXYZ':list(world),'boxDimensionsMetres':dimension,
      'distanceForward':distance,'lateralOffset':side,'relativeBottomHeightMetres':rise})
assert len(candidates)>=300
def boxpoints(center,dims):
 c=Vector(center);w,d,h=dims
 return [c+Vector((x,y,z)) for y in (0,h)
   for x,z in ((-w/2,-d/2),(-w/2,d/2),(w/2,d/2),(w/2,-d/2))]
def bounding(v,margin=0):
 return {'min':[min(p[k] for p in v)-margin for k in range(3)],
         'max':[max(p[k] for p in v)+margin for k in range(3)]}
def intersects(a,b):
 return all(a['min'][k]<=b['max'][k] and b['min'][k]<=a['max'][k] for k in range(3))
def bvh(v,face):
 return BVHTree.FromPolygons([tuple(p) for p in v],face,all_triangles=False)
BOX_FACES=((0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7),(3,0,4,7))
def sourceOcclusion(eye,target,solids,live):
 ray=target-eye
 if ray.length<1:return True
 for obj,tr,bb in solids:
  h,n,ind,d=tr.ray_cast(eye,ray.normalized(),ray.length-.3)
  if h is not None:return True
 for tr in live:
  h,n,ind,d=tr.ray_cast(eye,ray.normalized(),ray.length-.3)
  if h is not None:return True
 return False
def rayBox(eye,p,bb):
 delta=p-eye;t0=.001;t1=.999
 for k in range(3):
  if abs(delta[k])<1e-9:
   if eye[k]<bb['min'][k] or eye[k]>bb['max'][k]:return False
  else:
   aa=(bb['min'][k]-eye[k])/delta[k]
   zz=(bb['max'][k]-eye[k])/delta[k]
   t0=max(t0,min(aa,zz));t1=min(t1,max(aa,zz))
   if t1<t0:return False
 return True
raw={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg('--source-'+road))
 scene=bpy.context.scene
 assert scene['DO_SCENE_IS_NOT_GAME_WEBGL'] and scene['DR_ACTUAL_B48_VOID_CELL52']
 assert scene['DR_ACTUAL_B48_MESH_COUNT']==7 and scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
 CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
 B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
 B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
 MOV=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
 cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
 early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
 assert (len(CX),len(B48),len(B51),len(MOV),len(cameras.objects),len(early.objects))==(18,7,28,28,5,8)
 def sig():
  return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
    sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
    sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
    sorted((o.name,float(o['true_240hz_time'])) for o in cameras.objects))
 before=sig()
 sources=[]
 for ob in CX+B48:
  verts=[ob.matrix_world@v.co for v in ob.data.vertices]
  tri=bvh(verts,[tuple(f.vertices) for f in ob.data.polygons])
  sources.append((ob,tri,bounding(verts)))
 frames=[]
 for idx,f in enumerate(r1[road]['frames'],1):
  scene.frame_set(idx);bpy.context.view_layer.update()
  cam=cameras.objects.get(f['id']+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+f['id']+' SOURCE CAMERA')
  assert cam and (cam.location-Vector(f['eye'])).length<.0002
  active={m['id'] for m in f['moving'] if m['enabled']}
  live=[bvh([ob.matrix_world@v.co for v in ob.data.vertices],
   [tuple(p.vertices) for p in ob.data.polygons]) for ob in MOV if ob['R1_B51_ID'] in active]
  frames.append((f,cam,Vector(f['eye']),live))
 dynamic=[x['sampledAabb'] for x in hz[road]['hazards'] if x['sampledAabb']]
 stats=collections.Counter()
 per={}
 for candidate in candidates:
  corners=boxpoints(candidate['boxBottomCenterWorldXYZ'],candidate['boxDimensionsMetres'])
  bb=bounding(corners,margin=1.0)
  blocker=[x for x in dynamic if intersects(x,bb)]
  if blocker:
   stats['B51_721_REJECT']+=1
   per[candidate['id']]={'sourceClear':False,'cause':'B51_721_REJECT','unoccludedInteriorByFrame':{}}
   continue
  volume=bvh(corners,BOX_FACES)
  sourceRejected=[]
  for ob,tr,sourceBounds in sources:
   if not intersects(bb,sourceBounds):continue
   intersection=volume.overlap(tr)
   if intersection:
    sourceRejected.append([ob.name,'SOURCE_TRIANGLES',len(intersection)])
    break
   # Witness for original mesh vertices inside the new candidate AABB.
   if any(all(bb['min'][k]<=p[k]<=bb['max'][k] for k in range(3))
          for p in [ob.matrix_world@v.co for v in ob.data.vertices]):
    sourceRejected.append([ob.name,'SOURCE_VERTEX_CONTAINED',1])
    break
  if sourceRejected:
   stats['ORIGINAL_STATIC_REJECT']+=1
   per[candidate['id']]={'sourceClear':False,'cause':'SOURCE_STATIC_REJECT',
       'originalCollisionEvidence':sourceRejected,'unoccludedInteriorByFrame':{}}
   continue
  stats['CONSERVATIVE_SOURCE_CLEAR']+=1
  center=Vector(candidate['boxBottomCenterWorldXYZ'])
  w,d,h=candidate['boxDimensionsMetres']
  probes=[center+Vector((x,y,z))
    for x,z,y in ((0,0,.25*h),(0,0,.62*h),(.25*w,0,.5*h),
      (-.25*w,0,.5*h),(0,.25*d,.5*h),(0,-.25*d,.5*h))]
  camera={}
  hazardBlocked={}
  for fi,(f,cam,eye,live) in enumerate(frames,1):
   scene.frame_set(fi);bpy.context.view_layer.update()
   points=0
   possible=[]
   for p in probes:
    proj=world_to_camera_view(scene,cam,p)
    if not (proj.z>0 and .055<proj.x<.945 and .075<proj.y<.925):continue
    if sourceOcclusion(eye,p,sources,live):continue
    points+=1
    possible.append([float(proj.x),float(proj.y)])
   camera[f['id']]=points
   # Prefilter: source-original hazard CENTER visible to source camera
   # and within ~2.3s straight-line equivalent, NOT warning-time proof.
   rays=[]
   for m in f['moving']:
    if not m['enabled']:continue
    target=Vector(m['center'])
    if (target-Vector(f['playerPosition'])).length/max(1.,f['speedMps'])>2.3:continue
    q=world_to_camera_view(scene,cam,target)
    if not(q.z>0 and .055<q.x<.945 and .075<q.y<.925):continue
    # IMPORTANT: target mover is not included in self-occluding solids.
    if sourceOcclusion(eye,target,sources,[]):continue
    if rayBox(eye,target,bb):rays.append(m['id'])
   hazardBlocked[f['id']]=rays
  risk=sum(len(v) for v in hazardBlocked.values())
  stats['CLEAR_BUT_HAZARD_WARNING_RAY_BLOCKED' if risk else 'CLEAR_AND_HAZARD_RAY_PRESERVED']+=1
  per[candidate['id']]={'sourceClear':True,
   'cause':'CAMERA_RESEARCH_PROBE_ONLY','unoccludedInteriorByFrame':camera,
   'sourceVisibleHazardCenterRayBlockedByHypothesis':hazardBlocked,
   'sourceVisibleHazardCenterRayBlockTotal':risk}
 assert sig()==before
 raw[road]={'siteOriginalSourceEvaluations':per,'stats':dict(stats)}
 print('R15F_ACTUAL_CAMERA_FIRST_ORIGINAL_WORLD',road,'sites',len(candidates),'counts',dict(stats),flush=True)
# Same site/mass in exact same world; both roads must be safe and avoid
# disturbing any original hazard-center sightline.
combined=[]
reject=collections.Counter()
for candidate in candidates:
 aid=candidate['id'];a=raw[ROADS[0]]['siteOriginalSourceEvaluations'][aid]
 b=raw[ROADS[1]]['siteOriginalSourceEvaluations'][aid]
 if not(a['sourceClear'] and b['sourceClear']):
  reject['anyOriginalCXB48B51GeometryOrEnvelope']+=1
  continue
 if a['sourceVisibleHazardCenterRayBlockTotal'] or b['sourceVisibleHazardCenterRayBlockTotal']:
  reject['sourceHazardCenterCameraLineOccluded']+=1
  continue
 fids=[f['id'] for f in r1[ROADS[0]]['frames']]
 sourceImages=[
  min(a['unoccludedInteriorByFrame'][key],b['unoccludedInteriorByFrame'][key]) for key in fids]
 framesAtLeast2=sum(v>=2 for v in sourceImages)
 if framesAtLeast2<2:
  reject['notVisibleAtTwoMatchedOriginalCameraFrames']+=1;continue
 best=max(sourceImages)
 # a 2D screen-aligned projected footprint is an upper-bound/proxy only,
 # not architecture pixel area; this stage ranks actual 3D interior probes.
 combined.append({**candidate,'sameOriginal13FrameMinBothWorldInteriorProbeCount':sourceImages,
  'bothRoadsSameFrameAtLeastTwoSourceClearInteriorPoints':framesAtLeast2,
  'bestSameOriginalFrameSixInteriorProbesVisible':best,
  'sourceOriginalWorldCXB48AndAllB51AABBClearBoth':True,
  'originalSourceHazardCenterRayRetainedAt13Frames':True,
  'realMonumentalStructureBuilt':False,'realBuildingSupportCertified':False,
  'notActualBrowserGameArtwork':True})
# Deduplicate closely-packed candidate envelopes: smaller shifts within 50m
# are variations of ONE location, not independent architectural breakthroughs.
combined.sort(key=lambda q:(
 q['bothRoadsSameFrameAtLeastTwoSourceClearInteriorPoints'],
 q['bestSameOriginalFrameSixInteriorProbesVisible'],
 q['boxDimensionsMetres'][0]*q['boxDimensionsMetres'][1]*q['boxDimensionsMetres'][2]
 ),reverse=True)
selected={}
for phase,inds in (
 ('EARLY',{'t1100','t1200','t1300'}),
 ('MIDDLE',{'t1300','t1400','t1500'}),
 ('LATE',{'t1500','t1600','t1700'})):
 shortlist=[]
 for c in combined:
  times={f['id']:v for f,v in zip(r1[ROADS[0]]['frames'],
    c['sameOriginal13FrameMinBothWorldInteriorProbeCount'])}
  if sum(times[x]>=2 for x in inds)<2:continue
  if any(math.dist(c['boxBottomCenterWorldXYZ'],x['boxBottomCenterWorldXYZ'])<65 for x in shortlist):
   continue
  shortlist.append(c)
  if len(shortlist)>=5:break
 selected[phase]=shortlist
report={
 'schema':'dopagaki.r15f-source-two-road-camera-first-physical-landmark-site-hypotheses/1',
 'originalSourceCXBlob':SHA,
 'originalCX18B48_7B51_28Cameras5Unchanged':True,
 'trueOriginal13SourceCameraFramesBothRoads':True,
 'sourceOriginalAll28B51x721TickConservativeEnvelopeChecked':True,
 'candidateOriginalWorldSitesTested':len(candidates),
 'originalCandidateSiteCountRaw':len(combined),
 'candidatesPerRoadOriginalSourceStats':{k:v['stats'] for k,v in raw.items()},
 'originalCrossRoadRejectReasons':dict(reject),
 'topActualSharedCameraAndSourceVisibleSpatialSitesByEra':selected,
 'allSourceSafeAndSourceCameraVisibleCandidates':combined,
 'originalGameCameraImagePixelFootprintActuallyMeasured':False,
 'nativeScreenInteriorProbeVisibilityIsNotBuildingPixelArea':True,
 'notAllOriginalSourceWorldSitesExplored':True,
 'buildingFoundationAndIngressCertified':False,
 'monumentalFutureCityOrArtActualBuilt':False,
 'sourceHumanGameOriginalObstacleWarningTwoSecondsCertified':False,
 'trueWebGLBrowserGameEverRendered':False,
 'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R15F_TRUE_TWO_ORIGINAL_CAMERA_FIRST_SHARED_MACRO_SITES.json'),'w',encoding='utf8') as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print('R15F_CAMERA_FIRST_SHARED_RESULT','candidates',len(candidates),
 'sourceClearAndMultipleFrameVisible',len(combined),
 'eraSites',{k:len(v) for k,v in selected.items()},
 'rejectionReasons',dict(reject),'no ART or city generated')
