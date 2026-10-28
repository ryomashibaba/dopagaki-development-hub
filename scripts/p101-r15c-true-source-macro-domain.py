"""R15C: actual two-road source+camera safe macro-domain BEFORE producing city art.

Uses exactly the same coordinates in original true-pinch / pinch-switch.
Reads native R1 240Hz original timeline, original source Blender meshes and
B51 28-moving-object 721-tick conservative envelopes, R14B verified sites.
Does not edit original meshes, camera, gameplay or release state. AABB volume
is a PREMODEL probe, not a closed game collider or a supported building.
"""
import sys,os,math,json,collections
import bpy
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
SCHEMA='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
HZSCHEMA='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
r14=json.load(open(arg('--r14b'),encoding='utf8'))
assert r14['schema']=='dopagaki.g4e7dz-r6d-r14b-two-real-roads-identical-world-source-city-site/1'
assert r14['sourceCXBlob']==SHA
native={r:json.load(open(arg('--native-'+r),encoding='utf8')) for r in ROADS}
haz={r:json.load(open(arg('--hazards-'+r),encoding='utf8')) for r in ROADS}
for r in ROADS:
 assert native[r]['schema']==SCHEMA and native[r]['road']==r
 assert haz[r]['schema']==HZSCHEMA and haz[r]['road']==r
 assert native[r]['sourceCXBlob']==haz[r]['sourceCXBlob']==SHA
 assert len(native[r]['frames'])==13 and len(haz[r]['hazards'])==28
 assert len(native[r]['originalTrajectoryParity'])==7 and native[r]['physicsHz']==240
 assert native[r]['sourceGameChanged'] is False

# Reuse ONLY R14B sites actually verified in BOTH source game variants.
# Retain original world-coordinate identity; NEVER shift the two variants
# independently for a false positive. Test 3 larger scales as new hypotheses.
anchors=[]
rawR14BVerifiedRows=0
seenAnchorIdentity=set()
for phase,prefix in (('EARLY','E'),('MIDDLE','M'),('LATE','L')):
 x=r14['bothOriginalRoadSameCoordinatesConfirmedPerPhase'][phase]
 assert x['actuallySafeCommonNativeWorldSites']>=1
 verified=x['topAllVerifiedRealSharedSites']
 assert len(verified)<=10
 for i,s in enumerate(verified):
  assert s['phase']==phase and s['bothActualRoadVariantsSourceVolumeClear']
  assert len(s['sharedOriginal3DWorldXYZ'])==3
  assert len(s['commonPhysicalBoxMetres'])==3
  rawR14BVerifiedRows+=1
  # R14B can record the SAME original-world site in multiple time rows.
  # Count it once before scaling; 2 rows are not 2 independent urban sites.
  identity=(tuple(round(float(v),3) for v in s['sharedOriginal3DWorldXYZ']),
            tuple(s['commonPhysicalBoxMetres']))
  if identity in seenAnchorIdentity:continue
  seenAnchorIdentity.add(identity)
  anchors.append({'id':prefix+str(i+1).zfill(2),'phase':phase,
   'center':s['sharedOriginal3DWorldXYZ'],
   'referenceMetres':s['commonPhysicalBoxMetres'],
   'referenceOriginalFrame':s['trueOriginalFrame']})
assert len(anchors)>=9
sites=[]
for a in anchors:
 specs=[('R14B_REFERENCE',a['referenceMetres']),
        ('EXPANDED_48',[48,48,48]),('EXPANDED_72',[72,60,64]),
        ('EXPANDED_96',[96,72,80])]
 for label,dimensions in specs:
  key=a['id']+':'+label
  sites.append({**a,'key':key,'scale':label,'dimensions':dimensions})

# Probe the most promising neighboring EARLY->MIDDLE and MIDDLE->LATE site
# pairs with 7 volume samples, NOT merely center points. A safe sampled line
# does NOT prove a continuous corridor, or a physical supported floor.
links=[]
for first,next_phase in (('EARLY','MIDDLE'),('MIDDLE','LATE')):
 pairs=[]
 for a in anchors:
  if a['phase']!=first:continue
  for b in anchors:
   if b['phase']!=next_phase:continue
   gap=math.dist(a['center'],b['center'])
   if 10<gap<=250:pairs.append((gap,a,b))
 for dist,a,b in sorted(pairs,key=lambda x:x[0])[:12]:
  links.append({'key':a['id']+'--'+b['id'],'from':a['id'],
   'to':b['id'],'separationMetres':round(dist,3),
   'samples':[[a['center'][i]*(1-t/8)+b['center'][i]*t/8 for i in range(3)]
              for t in range(1,8)]})

def box_volume(pos,dims):
 # Bottom at coordinate Y; exactly same frame/box as R14B.
 c=Vector(pos);w,d,h=dims
 vertices=[c+Vector((dx,dy,dz)) for dy in (0,h)
  for dx,dz in ((-w/2,-d/2),(-w/2,d/2),(w/2,d/2),(w/2,-d/2))]
 faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7),(3,0,4,7)]
 return BVHTree.FromPolygons(vertices,faces,all_triangles=False),vertices

def bounds(v,margin=0.0):
 return {'min':[min(x[j] for x in v)-margin for j in range(3)],
         'max':[max(x[j] for x in v)+margin for j in range(3)]}
def overlaps(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
def inside(pos,lo,hi):
 return all(lo[i]-1e-6<=pos[i]<=hi[i]+1e-6 for i in range(3))
def point_projection(scene,cam,p):
 ndc=world_to_camera_view(scene,cam,p)
 return bool(ndc.z>0 and .055<ndc.x<.945 and .075<ndc.y<.925)

def ray_hits_box(start,end,bb):
 d=end-start
 lower=0.001;upper=.995
 for i in range(3):
  if abs(d[i])<1e-8:
   if start[i]<bb['min'][i] or start[i]>bb['max'][i]:return False
  else:
   t0=(bb['min'][i]-start[i])/d[i]
   t1=(bb['max'][i]-start[i])/d[i]
   lower=max(lower,min(t0,t1))
   upper=min(upper,max(t0,t1))
   if lower>upper:return False
 return True

def static_occluded(start,target,solids,live):
 direction=target-start
 length=direction.length
 if length<=1:return True
 direction.normalize()
 for _,_,tree,_ in solids:
  hit,n,index,d=tree.ray_cast(start,direction,length-.3)
  if hit is not None:return True
 for tr in live:
  hit,n,index,d=tr.ray_cast(start,direction,length-.3)
  if hit is not None:return True
 return False

result={}
for road in ROADS:
 bpy.ops.wm.open_mainfile(filepath=arg('--source-'+road))
 scene=bpy.context.scene
 assert scene['DO_SCENE_IS_NOT_GAME_WEBGL']
 assert scene['DR_ACTUAL_B48_MESH_COUNT']==7
 assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and scene['DR_ACTUAL_B48_VOID_CELL52']
 CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
 B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
 B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
 PROXY=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
 cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
 ext=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
 assert (len(CX),len(B48),len(B51),len(PROXY),len(cams.objects),len(ext.objects))==(18,7,28,28,5,8)
 def sig():
  return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
   sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
   sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
   sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
 before=sig()
 def tree(obj):
  return BVHTree.FromPolygons([tuple(obj.matrix_world@v.co) for v in obj.data.vertices],
   [tuple(f.vertices) for f in obj.data.polygons],all_triangles=False)
 static=[('CX',obj,tree(obj),
    bounds([obj.matrix_world@v.co for v in obj.data.vertices]))
         for obj in CX]
 static.extend(('B48',obj,tree(obj),
    bounds([obj.matrix_world@v.co for v in obj.data.vertices])) for obj in B48)
 frames=[]
 for index,f in enumerate(native[road]['frames'],1):
  scene.frame_set(index);bpy.context.view_layer.update()
  cam=cams.objects.get(f['id']+' REAL ORIGINAL 240HZ') or ext.objects.get('R1 '+f['id']+' SOURCE CAMERA')
  assert cam and (cam.location-Vector(f['eye'])).length<.0002
  live=[tree(o) for o in PROXY
        if o['R1_B51_ID'] in {m['id'] for m in f['moving'] if m['enabled']}]
  assert len(live)==sum(x['enabled'] for x in f['moving'])
  frames.append((f,Vector(f['eye']),live,cam))
 # Native cameras used in scene frame context: Blender scene camera NDC
 # projection depends on frame_set; store independent camera for each frame.
 def collisioncheck(center,dims,extra=1):
  volume,verts=box_volume(center,dims)
  bb=bounds(verts,extra)
  dynamic=[h['id'] for h in haz[road]['hazards']
   if h['sampledAabb'] and overlaps(bb,h['sampledAabb'])]
  collisions=[]
  for typ,obj,solid,srcbounds in static:
   if not overlaps(bb,srcbounds):continue
   tri=solid.overlap(volume)
   if tri:
    collisions.append([typ,obj.name,'TRIANGLE',len(tri)])
    continue
   # Extra containment witness; BVH intersection alone cannot detect a
   # source mesh fully INSIDE a volume. This check errs toward REJECT.
   lo,hi=bounds(verts)['min'],bounds(verts)['max']
   if any(inside(tuple(obj.matrix_world@p.co),lo,hi) for p in obj.data.vertices):
    collisions.append([typ,obj.name,'SOURCE_VERTEX_INSIDE_PROBE',1])
  return {'sourceCXB48CollisionEvidence':collisions,
   'all28B51_721TickBufferedEnvelopeWarnings':dynamic,
   'sourceStaticAndMoverConservativeClear':not collisions and not dynamic}
 scanned={}
 tally=collections.Counter()
 for item in sites:
  spec=collisioncheck(item['center'],item['dimensions'])
  tally['siteScalesTested']+=1
  if spec['sourceStaticAndMoverConservativeClear']:
   tally['siteScalesSourceClear']+=1
  else:
   tally['siteScalesUnsafe']+=1
  visible={}
  blockerRisk={}
  if spec['sourceStaticAndMoverConservativeClear']:
   bb=bounds(box_volume(item['center'],item['dimensions'])[1],0)
   w,d,h=item['dimensions'];c=Vector(item['center'])
   # Clear interior samples rather than silhouette-only "visible".
   points=[c+Vector((x,h*y,z)) for x in (-w*.16,0,w*.16)
                for z in (-d*.17,0,d*.17) for y in (.15,.5,.84)]
   for fi,(f,eye,live,cam) in enumerate(frames):
    scene.frame_set(fi+1);bpy.context.view_layer.update()
    count=0
    for p in points:
     if point_projection(scene,cam,p) and not static_occluded(eye,p,static,live):
      count+=1
    visible[f['id']]=count
    # 2-second equivalent is a rough prefilter, NOT 2 seconds of
    # genuinely visible actionable warning or a collision prediction.
    risk=[]
    for m in f['moving']:
     if not m['enabled']:continue
     center=Vector(m['center'])
     eq=(center-Vector(f['playerPosition'])).length/max(1,f['speedMps'])
     if eq>2.3:continue
     if not point_projection(scene,cam,center):continue
     # Exclude the target mover itself from the occluder list: otherwise
     # its own triangle surface hides its center and falsely reports no risk.
     # Testing CX/B48 only is conservative wrt other live movers.
     if static_occluded(eye,center,static,[]):continue
     if ray_hits_box(eye,center,bb):
      risk.append(m['id'])
    # Only flag an originally clear source-camera hazard-center ray
    # blocked by hypothetical new macro volume. Conservative, not human QA.
    blockerRisk[f['id']]=risk
  slot=[visible.get(f['id'],0)>=3 for f in native[road]['frames']]
  run=0;best=0
  for ok in slot:
   run=run+1 if ok else 0
   best=max(best,run)
  scanned[item['key']]={'source':spec,
    'originalNative13FrameInteriorVisiblePointCounts':visible,
    'originalNative13FrameHazardCenterSightlineRisks':blockerRisk,
    'framesAtLeastThreeInteriorPoints':sum(slot),
    'maxConsecutiveHalfSecondFramesWith3Inside':best,
    'originalCameraTwoSecondEquivalentSourceHazardRayBlockedCount':sum(len(x) for x in blockerRisk.values()),
    'originalGameAssetModified':False}
 # Sample 7 positions per potential link at fixed 12x12x12 cubic volume.
 # A safe 7-sample link is NOT a guarantee of continuous-time source safety.
 routes={}
 for link in links:
  probes=[collisioncheck(Vector(x)+Vector((0,-6,0)),[12,12,12],1) for x in link['samples']]
  routes[link['key']]={'distanceMetres':link['separationMetres'],
   'sevenCrossSectionSamplesWithoutOriginalGeometryOrB51Envelope':sum(
      p['sourceStaticAndMoverConservativeClear'] for p in probes),
   'allSevenSourceSamplesClear':all(p['sourceStaticAndMoverConservativeClear'] for p in probes),
   'sampleProbeDetails':probes,
   'realFloorSupportOrWalkableConnectivityCertified':False}
 assert sig()==before
 result[road]={'road':road,'sourceGameBlob':SHA,
  'sourceWorldOriginalCX18B48_7B51_28Cameras5Unchanged':True,
  'originalR1NativeHalfSecondFrames':13,'originalPhysicsHz':240,
  'scannedSourceSafeDomains':scanned,'sampledLinks':routes,
  'counters':dict(tally)}
 print('R15C_ACTUAL_SOURCE_DOMAIN_SCAN',road,dict(tally),
  'links_7of7',sum(x['allSevenSourceSamplesClear'] for x in routes.values()))
# Fail-closed merge: a truly shared eligible domain must be exact same
# source coordinate and dimensions, safe in BOTH original roads, visible in
# SAME at-least-4-frame window in BOTH, and block no source B51 center ray.
eligible=[]
rejection=collections.Counter()
for item in sites:
 a=result['true-pinch']['scannedSourceSafeDomains'][item['key']]
 b=result['pinch-switch']['scannedSourceSafeDomains'][item['key']]
 if not(a['source']['sourceStaticAndMoverConservativeClear'] and
        b['source']['sourceStaticAndMoverConservativeClear']):
  rejection['sourceUnsafeEitherRoad']+=1
  continue
 if a['originalCameraTwoSecondEquivalentSourceHazardRayBlockedCount'] or b['originalCameraTwoSecondEquivalentSourceHazardRayBlockedCount']:
  rejection['sourceHazardLineRiskEitherRoad']+=1
  continue
 paired=[a['originalNative13FrameInteriorVisiblePointCounts'].get(f['id'],0)>=3
         and b['originalNative13FrameInteriorVisiblePointCounts'].get(f['id'],0)>=3
         for f in native['true-pinch']['frames']]
 maxrun=0;run=0
 for ok in paired:
  run=run+1 if ok else 0
  maxrun=max(maxrun,run)
 if maxrun<5:
  rejection['noTwoSecondsContinuousBothCameraInteriors']+=1
  continue
 eligible.append({'id':item['key'],'phase':item['phase'],'worldXYZ':item['center'],
   'volumeDimensionsMetres':item['dimensions'],'pairedOriginalCameraConsecutiveFrames':maxrun,
   'pairedOriginalCameraVisibleFrames':[f['id'] for f,ok in zip(native['true-pinch']['frames'],paired) if ok],
   'originalCXB48TriangleEvidenceClearBoth':True,
   'all28OriginalB51Conservative721TickAABBDoesNotOverlapBoth':True,
   'originalSourceVisibleHazardCenterRayNotOccludedAt13SamplesBoth':True,
   'realWorldStructuralSupportCertified':False,'actualPedestrianIngressCertified':False,
   'trueWebGLGameVisualQualityCertified':False,'humanArtApproved':False})
# Link qualification uses BOTH variants and all 7 sampled corridor stations,
# but cannot prove continuously collision-free construction or real walkways.
jointlinks=[l for l in links if
 result['true-pinch']['sampledLinks'][l['key']]['allSevenSourceSamplesClear']
 and result['pinch-switch']['sampledLinks'][l['key']]['allSevenSourceSamplesClear']]
report={'schema':'dopagaki.r15c-both-original-native-source-safety-camera-macro-domain/1',
 'sourceGameBlob':SHA,'sourceGameUnchanged':True,
 'originalCX':18,'originalB48':7,'originalB51':28,'originalCameras':5,'physicsHz':240,
 'originalGap52':True,'bothVariantsSameWorldXYZAndExactDimension':True,
 'R14BOriginalSharedCandidateRowsIncludingRepeatedLocations':rawR14BVerifiedRows,
 'R14BProvenSharedUniqueSmallSitesReused':len(anchors),
 'R14BProvenSharedSmallSitesReused':len(anchors),
 'R15CNewGeometryScaleTests':len(sites),
 'R15CSourceScaleKinds':['R14B_REFERENCE','EXPANDED_48','EXPANDED_72','EXPANDED_96'],
 'R15CProgressiveMacroVolumeOnlyNotActualArchitecture':True,
 'R15COriginalSourceRoadResults':result,
 'sourceBothVariantsCandidateSummaryRejects':dict(rejection),
 'bothVariantsCameraAndSourceSafeTwoSecondEquivalentHazardNoObstructionEligible':eligible,
 'bothVariantsEligibleCount':len(eligible),
 'linkCandidatePairsTested':len(links),
 'bothVariants7DiscreteStationClearCandidateLinks':[{'id':x['key'],'distanceMetres':x['separationMetres']} for x in jointlinks],
 'sevenDiscreteStationsDoNotProveContinuous3DCorridor':True,
 'actualCityStructuralSupportCertified':False,'trueHumanIngressCertified':False,
 'trueSourceGameWebGLRendered':False,'actualGameObstacleWarningTwoSecondsCertified':False,
 'continuousTimeB51SafetyCertified':False,'genuineIntegratedCityArchitectureBuilt':False,
 'originalGameColliderChangeCount':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R15C_BOTH_SOURCE_MACRO_DOMAIN_AUDIT.json'),'w',encoding='utf8') as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print('R15C_SHARED_SOURCE_AND_ORIGINAL_CAMERA_RESEARCH',
 'raw_original_shared_rows',rawR14BVerifiedRows,'unique_shared_small_sites',len(anchors),'scales',len(sites),
 'truly_eligible_at_two_seconds_source_sampled',len(eligible),
 'sampled_joint_links',len(jointlinks),
 'reject_causes',dict(rejection),'ART/HUMAN/RELEASE HOLD')
