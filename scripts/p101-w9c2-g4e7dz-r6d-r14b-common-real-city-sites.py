# R14B — truly shared original-world coordinates verified in BOTH
# source roads, including original 13 time-synchronised native cameras.
# Never treat separate near-by sites or two independent box checks as
# proof that one common game site is safe in both road variants.
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
a=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in a,k;return a[a.index(k)+1]
out=arg('--out');os.makedirs(out,exist_ok=True)
SHA='af076d67492a677d2235e4730aef8cdf4808e106'
study={}
for road in ('true-pinch','pinch-switch'):
 r14=json.load(open(arg('--r14a-'+road),encoding='utf8'))
 r1=json.load(open(arg('--native-'+road),encoding='utf8'))
 hz=json.load(open(arg('--hazards-'+road),encoding='utf8'))
 assert r14['schema']=='dopagaki.g4e7dz-r6d-r14a-original-same-time-play-camera-source-volume/1'
 assert r1['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
 assert hz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
 assert r14['road']==r1['road']==hz['road']==road
 assert r14['sourceCXBlob']==r1['sourceCXBlob']==hz['sourceCXBlob']==SHA
 study[road]=(r14,r1,hz)
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
def volume(c,hx,hz,h):
 v=[c+Vector((dx,dy,dz)) for dy in (0,h)
 for dx,dz in ((-hx,-hz),(-hx,hz),(hx,hz),(hx,-hz))]
 return BVHTree.FromPolygons(v,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7),(3,0,4,7)],all_triangles=False),v
def overlapping(bb,v,margin=3):
 return all(min(p[j] for p in v)-margin<=bb['max'][j] and
  bb['min'][j]<=max(p[j] for p in v)+margin for j in range(3))
sourceWorld={}
for road in ('true-pinch','pinch-switch'):
 r14,r1,hz=study[road]
 bpy.ops.wm.open_mainfile(filepath=arg('--source-'+road))
 s=bpy.context.scene
 assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
 cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
 roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
 b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
 movers=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
 cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
 early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
 assert (len(cx),len(roads),len(b51),len(movers),len(cameras.objects),len(early.objects))==(18,7,28,28,5,8)
 def sig():
  return [sorted((x.name,x['source_sha256'],len(x.data.polygons)) for x in cx),
   sorted((x.name,x['ORIGINAL_GAME_B48_SHA256'],len(x.data.polygons)) for x in roads),
   sorted((x.name,x['SOURCE_ORIGINAL_B51_ID'],len(x.data.vertices)) for x in b51)]
 before=sig()
 solids=[('CX',o,bvh(o)) for o in cx]+[('B48',o,bvh(o)) for o in roads]
 # Scene disappears after next bpy.ops.wm.open_mainfile, so complete this
 # road's geometry and visibility scoring before loading other variant.
 candidates=[]
 for phase in ('EARLY','MIDDLE','LATE'):
  ours=study[road][0]['threeOriginalTimePhasesActualCandidates'][phase]['topFiveAlignedActualSiteCandidates']
  opposite='pinch-switch' if road=='true-pinch' else 'true-pinch'
  theirs=study[opposite][0]['threeOriginalTimePhasesActualCandidates'][phase]['topFiveAlignedActualSiteCandidates']
  for aa in ours:
   for bb in theirs:
    if abs(aa['time']-bb['time'])>.01:continue
    pa,pb=Vector(aa['originalSourceClearXYZ']),Vector(bb['originalSourceClearXYZ'])
    separation=(pa-pb).length
    if separation>30:continue
    # Site must be identical coordinates in both original variants:
    # selected midpoint here then genuinely tested independently below.
    common=(pa+pb)*.5
    hclass='LARGE' if aa['sizeClass']==bb['sizeClass']=='LARGE' else 'MEDIUM'
    hx,halfZ,height=(16,18,36) if hclass=='LARGE' else (10,12,26)
    key=(phase,round(aa['time'],2),hclass,
     tuple(round(float(x),3) for x in common))
    if any(x['key']==key for x in candidates):continue
    vtree,verts=volume(common,hx,halfZ,height)
    moverWarnings=[x['id'] for x in hz['hazards'] if x['sampledAabb'] and overlapping(x['sampledAabb'],verts)]
    collide=[]
    if not moverWarnings:
     for typ,obj,bt in solids:
      ov=vtree.overlap(bt)
      if ov:collide.append([typ,obj.name,len(ov)])
    visible={}
    for frameIndex,f in enumerate(r1['frames'],1):
     if abs(float(f['seconds'])-aa['time'])>1.0:continue
     s.frame_set(frameIndex);bpy.context.view_layer.update()
     cam=cameras.objects.get(f['id']+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+f['id']+' SOURCE CAMERA')
     assert cam and (cam.location-Vector(f['eye'])).length<.0002
     live=[bvh(x) for x in movers if x['R1_B51_ID'] in {z['id'] for z in f['moving'] if z['enabled']}]
     points=[common+Vector((0,h,0)) for h in ((5,18,31) if hclass=='LARGE' else (4,13,22))]
     sight=0
     if not moverWarnings and not collide:
      for p in points:
       q=world_to_camera_view(s,cam,p)
       if not(q.z>0 and .05<q.x<.95 and .07<q.y<.93):continue
       ray=p-cam.location
       obscured=False
       for typ,obj,bt in solids:
        hit,n,idx,d=bt.ray_cast(cam.location,ray.normalized(),ray.length-.35)
        if hit is not None:obscured=True;break
       if not obscured:
        for bt in live:
         hit,n,idx,d=bt.ray_cast(cam.location,ray.normalized(),ray.length-.35)
         if hit is not None:obscured=True;break
       if not obscured:sight+=1
     visible[f['id']]=sight
    sourceFrame='t'+str(int(aa['time']*100))
    # Displayable same source time in each road not just different times.
    same=sight if False else visible.get(sourceFrame,0)
    candidates.append({'key':key,'phase':phase,'sameTimeSeconds':aa['time'],
      'realCommonXYZ':[round(float(q),5) for q in common],
      'realR14ASeparateSafeSitesMetres':round(float(separation),4),
      'sourceResearchPhysicalSize':[2*hx,2*halfZ,height],
      'srcGameOriginalB51_721AabbOverlapIds':moverWarnings,
      'sourceGameCXB48ExactTriangleOverlaps':collide,
      'trueOriginalNativeVisibility':visible,
      'originalSameFrameVisibleInsideThreeLevels':same,
      'originalWorldCommon3DVolumeClear':not moverWarnings and not collide,
      'humanAccessAndSourceLoadPathCertified':False})
 assert before==sig()
 sourceWorld[road]=candidates
# A site is allowed into a COMMON 3D trial only when the exactly same
# world site/size satisfies both original road physical and camera checks.
both={}
for phase in ('EARLY','MIDDLE','LATE'):
 hits=[]
 for cand in sourceWorld['true-pinch']:
  if cand['phase']!=phase:continue
  match=[v for v in sourceWorld['pinch-switch'] if v['key']==cand['key']]
  assert len(match)==1,(cand['key'],len(match))
  other=match[0]
  if not(cand['originalWorldCommon3DVolumeClear'] and other['originalWorldCommon3DVolumeClear']):continue
  if min(cand['originalSameFrameVisibleInsideThreeLevels'],other['originalSameFrameVisibleInsideThreeLevels'])<2:continue
  hits.append({'phase':phase,'sharedOriginal3DWorldXYZ':cand['realCommonXYZ'],
    'bothActualRoadVariantsSourceVolumeClear':True,
    'bothSameFrameCameraIntoInteriorCount':[cand['originalSameFrameVisibleInsideThreeLevels'],other['originalSameFrameVisibleInsideThreeLevels']],
    'trueOriginalFrame':cand['sameTimeSeconds'],
    'commonPhysicalBoxMetres':cand['sourceResearchPhysicalSize'],
    'separateRoadVariantOriginalSourceCandidateDistanceMetres':cand['realR14ASeparateSafeSitesMetres'],
    'notAnActualBuiltPublicCity':True})
 hits.sort(key=lambda x:(x['commonPhysicalBoxMetres'][0]==32,
   min(x['bothSameFrameCameraIntoInteriorCount']),
   -x['separateRoadVariantOriginalSourceCandidateDistanceMetres']),reverse=True)
 both[phase]={'sourceCandidatePairsTried':sum(v['phase']==phase for v in sourceWorld['true-pinch']),
  'actuallySafeCommonNativeWorldSites':len(hits),
  'topAllVerifiedRealSharedSites':hits[:10],
  'bestSharedSite':hits[0] if hits else None}
report={'schema':'dopagaki.g4e7dz-r6d-r14b-two-real-roads-identical-world-source-city-site/1',
 'sourceCXBlob':SHA,'originalTrueAndSwitchCX18B48_7B51_28Cameras5Unchanged':True,
 'actualOriginalGame13FrameAllMovingAndCameraData':True,
 'bothOriginalRoadSameCoordinatesConfirmedPerPhase':both,
 'bothRoadAllCandidateAudit':sourceWorld,
 'commonCityPhysicalAndCameraSiteAlreadyBuilt':False,
 'commonSiteSourceLoadBearingAndPlayerIngressCertified':False,
 'newGameColliders':0,'newBlenderArchitectureMeshes':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R14B_REAL_BOTH_ROADS_COMMON_SITE_AUDIT.json'),'w',encoding='utf8') as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print('R14B_ACTUAL_SAME_SOURCE_WORLD_BOTH_ROADS', {phase:{'pairs':v['sourceCandidatePairsTried'],
 'safeSamePhysicalAndCamera':v['actuallySafeCommonNativeWorldSites'],
 'best':v['bestSharedSite']['sharedOriginal3DWorldXYZ'] if v['bestSharedSite'] else None}
 for phase,v in both.items()},'GAME AND ART HOLD')
