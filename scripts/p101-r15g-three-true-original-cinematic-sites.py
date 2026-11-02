"""R15G: source-supported three distinct cinematic landmark volumes.

Data-driven reassignment of R15F sites to EARLY/MIDDLE/LATE; investigates
actual original source roads' support/ingress proximity with Blender BVH.
No foundation/real support or pedestrian ingress is built/certified.
"""
import bpy,sys,os,json,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):
 assert k in argv,k
 return argv[argv.index(k)+1]
out=arg('--out');os.makedirs(out,exist_ok=True)
SRC='af076d67492a677d2235e4730aef8cdf4808e106'
data=json.load(open(arg('--r15f'),encoding='utf8'))
assert data['schema']=='dopagaki.r15f-source-two-road-camera-first-physical-landmark-site-hypotheses/1'
assert data['originalSourceCXBlob']==SRC and data['candidateOriginalWorldSitesTested']==336
assert data['originalCandidateSiteCountRaw']==237
a=data['allSourceSafeAndSourceCameraVisibleCandidates']
assert len(a)==237
WINDOWS={'EARLY':(0,1,2,3),'MIDDLE':(5,6,7,8),'LATE':(9,10,11,12)}
selected=[]
evidence={}
for phase,indices in WINDOWS.items():
 choices=[]
 for x in a:
  v=x['sameOriginal13FrameMinBothWorldInteriorProbeCount']
  if len(v)!=13 or any(not isinstance(i,int) for i in v):raise AssertionError('bad source evidence')
  if sum(v[i]>=3 for i in indices)<3:continue
  if x['boxDimensionsMetres'] != [76,64,84] or x['relativeBottomHeightMetres']!=18:continue
  if any(math.dist(x['boxBottomCenterWorldXYZ'],old['boxBottomCenterWorldXYZ'])<150 for old in selected):
   continue
  activity=sum(min(3,v[i]) for i in indices)
  outside=sum(min(3,v[i]) for i in range(13) if i not in indices)
  score=activity*2.8-outside*.48+.76-abs(x['lateralOffset'])*.012
  choices.append((score,x))
 choices.sort(key=lambda x:(-x[0],x[1]['id']))
 assert choices,'no same-source-physics-camera evidence for '+phase
 score,win=choices[0]
 chosen={**win,'phase':phase,'phaseCinematicRankingScore':round(score,4),
  'selectedOnlyOnceAcrossTemporalEras':True,
  'actualOriginalSupportingRoadOrFoundationCertified':False,
  'actualHumanIngressCertified':False,
  'actualArtApproved':False}
 selected.append(chosen)
 evidence[phase]={'distinctAfterPriorTemporalSiteSelections':len(choices),
  'topAlternativeIds':[x[1]['id'] for x in choices[:5]]}
assert len(selected)==3 and len({x['id'] for x in selected})==3
for i,a in enumerate(selected):
 for b in selected[i+1:]:
  assert math.dist(a['boxBottomCenterWorldXYZ'],b['boxBottomCenterWorldXYZ'])>150
  assert a['boxBottomCenterWorldXYZ'][2] < b['boxBottomCenterWorldXYZ'][2]-100

report={}
for road in ('true-pinch','pinch-switch'):
 bpy.ops.wm.open_mainfile(filepath=arg('--source-'+road))
 scene=bpy.context.scene
 assert scene['DO_SCENE_IS_NOT_GAME_WEBGL'] and scene['DR_ACTUAL_B48_VOID_CELL52']
 assert scene['DR_ACTUAL_B48_MESH_COUNT']==7 and scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
 cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
 b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
 mover=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
 cam=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
 assert (len(cx),len(b48),len(mover),len(cam.objects))==(18,7,28,5)
 def signature():
  return (sorted((x.name,x['source_sha256'],len(x.data.polygons)) for x in cx),
   sorted((x.name,x['ORIGINAL_GAME_B48_SHA256'],len(x.data.polygons)) for x in b48),
   sorted((x.name,x['SOURCE_ORIGINAL_B51_ID'],len(x.data.vertices)) for x in mover))
 before=signature()
 roadSurfaces=[]
 for o in b48:
  verts=[o.matrix_world@v.co for v in o.data.vertices]
  tree=BVHTree.FromPolygons([tuple(v) for v in verts],[tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
  roadSurfaces.append((o,tree))
 observations={}
 for site in selected:
  c=Vector(site['boxBottomCenterWorldXYZ'])
  w,d,h=site['boxDimensionsMetres']
  probes=[c+Vector((x,.05,z)) for x in (-w*.3,0,w*.3) for z in (-d*.3,0,d*.3)]
  floorHits=[]
  closest=[]
  for p in probes:
   falls=[]
   for o,t in roadSurfaces:
    hit,n,index,distance=t.ray_cast(p,Vector((0,-1,0)),200)
    if hit is not None:falls.append((distance,o.name))
   if falls:
    dist,obj=min(falls)
    floorHits.append({'probeXYZ':list(p),'originalB48VerticalSourceHitDistance':round(dist,3),
     'originalRoadSourceName':obj})
   else:floorHits.append({'probeXYZ':list(p),'originalB48VerticalSourceHitDistance':None})
   near=[]
   for o,t in roadSurfaces:
    pos,n,index,distance=t.find_nearest(p,200)
    if pos is not None:near.append((distance,o.name))
   closest.append(min(near) if near else (None,None))
  report.setdefault(road,{})[site['phase']]={
   'siteId':site['id'],'actualOriginalB48BelowNineProbeDistances':floorHits,
   'originalB48DownwardSupportWitnessCount':sum(x['originalB48VerticalSourceHitDistance'] is not None for x in floorHits),
   'closestOriginalRoadSurfaceMetresToSiteFootprint':round(min(v[0] for v in closest if v[0] is not None),3) if any(v[0] is not None for v in closest) else None,
   'realFoundationBuilt':False,'structureSupportedCertified':False,
   'pedestrianIngressFromOriginalB48Certified':False}
 assert signature()==before
 print('R15G_TRUE_ORIGINAL_ROAD_PROXIMITY',road,
  [(x['phase'],report[road][x['phase']]['originalB48DownwardSupportWitnessCount'],
    report[road][x['phase']]['closestOriginalRoadSurfaceMetresToSiteFootprint']) for x in selected],flush=True)
outcome={'schema':'dopagaki.r15g-distinct-three-camera-and-world-site-source-foundation-study/1',
 'originalSourceCXBlob':SRC,'R15FOriginalResearchSiteHypotheses':336,
 'R15FOriginalCandidatesSourceClearAndMultiFrameVisible':237,
 'threeGenuinelyDistinctOriginalWorldSiteSelections':selected,
 'evidenceWhyTemporalSitesAreDistinct':evidence,
 'actualOriginalB48SourceProximityByRoadAndEra':report,
 'sourceOriginalWorldsPhysicallyUnmodified':True,
 'singleSharedWorldXYZForBothRoads':True,
 'actualBuildingSupportCertified':False,'realPublicAccessCertified':False,
 'realThreeBuildingArchitectureBuilt':False,'originalWebGLActualGameRendered':False,
 'officialArt':0,'officialSlope2Meters':0,'newGameColliders':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R15G_THREE_DISTINCT_REAL_WORLD_SOURCE_SITES_AND_SUPPORT.json'),'w',encoding='utf8') as f:
 json.dump(outcome,f,ensure_ascii=False,indent=2)
print('R15G_THREE_REAL_SOURCE_DISTINCT_ERA_SITES',[(q['phase'],q['id'],q['boxBottomCenterWorldXYZ']) for q in selected],
 'NO REAL SUPPORT OR ART ADOPTION',flush=True)
