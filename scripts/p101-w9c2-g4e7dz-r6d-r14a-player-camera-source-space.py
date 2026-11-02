# R14A: true original player AND camera at SAME 240Hz sampled times.
# Site-level actual CX/B48 triangle and all 28 B51 721-tick envelope checks.
# Does not claim to prove real engineered floor or public access.
import bpy,sys,os,json,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in args,k;return args[args.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
source=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
r13=json.load(open(arg('--r13c'),encoding='utf8'))
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
assert source['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert r13['schema']=='dopagaki.g4e7dz-r6d-r13c-real-source-art-and-floor-governance/1'
assert source['road']==haz['road']==r13['road']==road
assert source['sourceCXBlob']==haz['sourceCXBlob']==r13['sourceCXBlob']==SHA
assert len(source['frames'])==13 and len(haz['hazards'])==28
bpy.ops.wm.open_mainfile(filepath=arg('--scene'))
scene=bpy.context.scene
assert scene['DO_SCENE_IS_NOT_GAME_WEBGL'] and scene['DR_ACTUAL_B48_MESH_COUNT']==7
assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and scene['DR_ACTUAL_B48_VOID_CELL52']
CX=[x for x in bpy.data.objects if x.get('game_world_xyz_unmodified')]
B48=[x for x in bpy.data.objects if x.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[x for x in bpy.data.objects if x.get('SOURCE_ORIGINAL_B51_ID')]
PROXY=[x for x in bpy.data.objects if x.get('R1_B51_ID')]
camCollection=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(PROXY),len(camCollection.objects),len(early.objects))==(18,7,28,28,5,8)
def sig():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o['true_240hz_time'])) for o in camCollection.objects))
before=sig()
def tree(obj):
 return BVHTree.FromPolygons([tuple(obj.matrix_world@v.co) for v in obj.data.vertices],
 [tuple(f.vertices) for f in obj.data.polygons],all_triangles=False)
static=[('CX',obj,tree(obj)) for obj in CX]+[('B48',obj,tree(obj)) for obj in B48]
frames=source['frames']
record=[]
for idx,f in enumerate(frames,1):
 scene.frame_set(idx);bpy.context.view_layer.update()
 camera=camCollection.objects.get(f['id']+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert camera and (camera.location-Vector(f['eye'])).length<.0002
 active={m['id'] for m in f['moving'] if m['enabled']}
 live=[('B51',o,tree(o)) for o in PROXY if o['R1_B51_ID'] in active]
 assert len(live)==len(active)
 record.append((f,camera,live))
def box(c,halfX,halfZ,height):
 v=[c+Vector((x,y,z)) for y in (0,height)
 for x,z in ((-halfX,-halfZ),(-halfX,halfZ),(halfX,halfZ),(halfX,-halfZ))]
 faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 return BVHTree.FromPolygons(v,faces,all_triangles=False),v
def boxAABB(v,margin=3):
 return ([min(p[i] for p in v)-margin for i in range(3)],
 [max(p[i] for p in v)+margin for i in range(3)])
def envelopes(v):
 lo,hi=boxAABB(v)
 result=[]
 for h in haz['hazards']:
  bb=h['sampledAabb']
  if bb and all(lo[i]<=bb['max'][i] and bb['min'][i]<=hi[i] for i in range(3)):
   result.append(h['id'])
 return result
def sourceOcclusion(cam,point,live):
 proj=world_to_camera_view(scene,cam,point)
 if not(proj.z>0 and .04<proj.x<.96 and .06<proj.y<.94):return None
 ray=point-cam.location
 if ray.length<=1:return None
 for typ,obj,bvh in static+live:
  hit,n,face,d=bvh.ray_cast(cam.location,ray.normalized(),ray.length-.35)
  if hit is not None:return None
 return [round(float(proj.x),5),round(float(proj.y),5)]
# Geometric source boxes only, never a claim to support a building.
# 32x36x36 large and 20x24x26 medium. Try generous first.
sizes=[('LARGE',16,18,36),('MEDIUM',10,12,26)]
counts=collections.Counter()
hits=[]
for frameIndex,(f,cam,live) in enumerate(record):
 player=Vector(f['playerPosition'])
 front=Vector(f['front']);front.y=0;front.normalize()
 right=front.cross(Vector((0,1,0))).normalized()
 for side in (-1,1):
  for ahead in (38,66,95,130):
   for lateral in (35,65,95,125):
    for rise in (-10,0,16,32):
     center=player+front*ahead+right*(side*lateral)+Vector((0,rise,0))
     planar=math.hypot(center.x-player.x,center.z-player.z)
     if planar>158:continue
     for label,hx,hz,height in sizes:
      counts['tested_'+label]+=1
      bvh,vertices=box(center,hx,hz,height)
      if envelopes(vertices):
       counts['moving_envelope_reject_'+label]+=1;continue
      collisions=[]
      for typ,obj,solid in static:
       if bvh.overlap(solid):collisions.append([typ,obj.name])
      if collisions:
       counts['static_reject_'+label]+=1;continue
      counts['original_source_clear_'+label]+=1
      # Query 3 true interior heights in exactly this frame and a
      # small interior cross-section to reject mere silhouette visibility.
      heights=(4,13,22) if label=='MEDIUM' else (5,18,31)
      points=[center+Vector((0,k,0)) for k in heights]
      points.extend([center+right*7+Vector((0,13,0)),center-right*7+Vector((0,13,0))])
      real=[sourceOcclusion(cam,p,live) for p in points]
      visible=[v for v in real if v is not None]
      if len(visible)<2:
       counts['same_time_camera_reject_'+label]+=1;continue
      across=[]
      for o,(af,othercam,otherlive) in enumerate(record):
       if abs(o-frameIndex)>2:continue
       vis=sum(sourceOcclusion(othercam,p,otherlive) is not None for p in points)
       across.append([af['id'],round(float(af['seconds']),1),vis])
      nearby=[item for item in across if item[2]>=2]
      if not nearby:continue
      same_frame_vis=len(visible)
      # Original player's closest time to this site in ORIGINAL 13
      # positions, unlike the R13 misleading original "EARLY" label.
      distances=[math.hypot(center.x-Vector(af['playerPosition']).x,center.z-Vector(af['playerPosition']).z) for af,_,_ in record]
      nearest=distances.index(min(distances))
      same_time_near=abs(nearest-frameIndex)<=1
      sourceY=player.y
      counts['same_time_visible_'+label]+=1
      hits.append({'time':round(float(f['seconds']),1),'cameraFrameId':f['id'],
       'originalFrameIndex':frameIndex,
       'sizeClass':label,'originalSourceClearXYZ':[round(float(x),4) for x in center],
       'realPrecheckedBoxMetres':[hx*2,hz*2,height],
       'actualOriginalPlayerPlanarMetres':round(float(planar),3),
       'actualOriginalPlayerVerticalOffsetToSiteFloorMetres':round(float(center.y-sourceY),3),
       'originalPlayerClosestFrameId':record[nearest][0]['id'],
       'originalPlayerClosestTimeSeconds':round(float(record[nearest][0]['seconds']),1),
       'candidateTimeAndOriginalPlayerClosestTimeAlignedWithin0_5s':same_time_near,
       'sameTimeVisibleUnoccludedInteriorProbePoints':same_frame_vis,
       'sameTimeInteriorProjectedNDC':visible,
       'nearbyCameraFrameInteriorViews':across,
       'nearbyTimeFramesWith2VisibleInteriorPoints':len(nearby),
       'originalCxB48ExactBVHIntersections':0,
       'all28B51_721TickConservativeAabbIntersections':0,
       'actualHumanPedestrianIngressCertified':False,
       'structuralLoadAndFoundationCertified':False})
# Rank same time, near and actually visible site. Equal original source
# time is a hard condition; highest image fill alone cannot beat collision.
def score(q):
 return (q['candidateTimeAndOriginalPlayerClosestTimeAlignedWithin0_5s'],
   q['nearbyTimeFramesWith2VisibleInteriorPoints'],
   q['sameTimeVisibleUnoccludedInteriorProbePoints'],
   q['sizeClass']=='LARGE',
   -abs(q['actualOriginalPlayerVerticalOffsetToSiteFloorMetres']),
   -q['actualOriginalPlayerPlanarMetres'])
hits.sort(key=score,reverse=True)
bucket={}
for phase,lo,hi in (('EARLY',11,13.01),('MIDDLE',13.5,15.51),('LATE',16,17.01)):
 match=[x for x in hits if lo<=x['time']<=hi]
 bucket[phase]={'testedFound':len(match),
   'sameTimePlayerAlignedFound':sum(q['candidateTimeAndOriginalPlayerClosestTimeAlignedWithin0_5s'] for q in match),
   'largeCandidateFound':sum(q['sizeClass']=='LARGE' for q in match),
   'topFiveAlignedActualSiteCandidates':[x for x in match if x['candidateTimeAndOriginalPlayerClosestTimeAlignedWithin0_5s']][:5],
   'topThreeAllActualSiteCandidates':match[:3]}
assert sig()==before
report={'schema':'dopagaki.g4e7dz-r6d-r14a-original-same-time-play-camera-source-volume/1',
 'road':road,'sourceCXBlob':SHA,'originalCX18B48_7B51_28Cameras5Unchanged':True,
 'originalR1Native13CameraAndPlayerSourceFramesUsed':True,
 'trueOriginalB51All28x721TickAABBUsed':True,
 'physicalResearchBoxesMetres':[[32,36,36],[20,24,26]],
 'testedSourceProbeCounters':dict(counts),
 'actualSitesFoundWithSameOriginalTimeCamera':len(hits),
 'originalRealFrameMatchedBest25':hits[:25],
 'threeOriginalTimePhasesActualCandidates':bucket,
 'sourceHumanPlayerWalkToCandidateProved':False,
 'structuralFoundationProved':False,
 'originalSourcePlayPhysicsModified':False,
 'safeBuildingCityArtFullyModeled':False,'newBlenderCityMeshes':0,
 'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R14A_'+road+'_TRUE_ORIGINAL_TIME_PLAYER_CAMERA_SITES.json'),'w',encoding='utf8') as w:
 json.dump(report,w,indent=2,ensure_ascii=False)
print('R14A_NATIVE_SAME_TIME_SITE_EVIDENCE',road,'found',len(hits),
 'count',dict(counts),
 'phases',{k:(v['testedFound'],v['sameTimePlayerAlignedFound'],v['largeCandidateFound']) for k,v in bucket.items()},
 'ART HOLD')
