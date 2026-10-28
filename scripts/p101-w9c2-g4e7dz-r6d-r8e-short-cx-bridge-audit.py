# R6D-R8E: truly original CX floor -> chronological early city site,
# corridor 6m wide; actual original scene BVH and 28x721 B51 envelopes.
# Only an early model feasibility *falsifier*, not a constructed footbridge.
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in argv,k;return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
source=json.load(open(arg('--native'),encoding='utf8'))
r8b=json.load(open(arg('--r8b'),encoding='utf8'))
r8d=json.load(open(arg('--r8d'),encoding='utf8'))
hazards=json.load(open(arg('--hazards'),encoding='utf8'))
assert source['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert r8b['schema']=='dopagaki.g4e7dz-r6d-r8b-chronology-grade-constrained/1'
assert r8d['schema']=='dopagaki.g4e7dz-r6d-r8d-alternative-existing-cx-floor/1'
assert hazards['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert source['road']==r8b['road']==r8d['road']==hazards['road']==road
assert source['sourceCXBlob']==r8b['sourceCXBlob']==r8d['sourceCXBlob']==hazards['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--blend'))
s=bpy.context.scene
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(cx),len(roads),len(b51),len(cams.objects))==(18,7,28,5)
def sig():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51),
 sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
before=sig()
candidate=r8d['bestExistingSourceCxFloorCandidate']
assert candidate is not None,('R8D_NO_SHORT_CLEAR_SOURCE_FLOOR',road)
sourceFloor=[o for o in cx if o.name==candidate['sourceCXObject']]
assert len(sourceFloor)==1
floor=sourceFloor[0]
face=floor.data.polygons[candidate['sourcePolygonIndex']]
centre=floor.matrix_world@face.center
normal=(floor.matrix_world.to_3x3()@face.normal).normalized()
assert normal.y>=.82 and face.area>=10
assert (centre-Vector(candidate['trueWorldCentroid'])).length<.001
start=centre;end=Vector(r8b['selectedChronologicalSites'][1]['xyz'])
horizontal=Vector((end.x-start.x,0,end.z-start.z))
assert horizontal.length>20
upRight=Vector((-horizontal.z,0,horizontal.x)).normalized()
rise=abs(end.y-start.y)
grade=rise/horizontal.length
assert abs(grade-candidate['directLineGrade'])<.00002
assert grade<=.09 and horizontal.length<=150
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
    [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
original=[('CX',o,bvh(o)) for o in cx]+[('B48',o,bvh(o)) for o in roads]
def trace(pa,pb):
 diff=pb-pa;length=diff.length
 if length<.2:return None
 best=None
 for typ,o,t in original:
  h,n,idx,d=t.ray_cast(pa,diff.normalized(),length-.20)
  if h is not None and d is not None and (best is None or d<best['distance']):
   best={'type':typ,'mesh':o.name,'distance':round(float(d),4)}
 return best
def overlaps(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
count=math.ceil((end-start).length/8)
samples=[];hits=[];hazardsWarn=set()
for i in range(count):
 a=start.lerp(end,i/count);b=start.lerp(end,(i+1)/count)
 if i==0:a+=Vector((0,.9,0))
 rayHits=[]
 for side in (-3,0,3):
  h=trace(a+upRight*side,b+upRight*side)
  if h:rayHits.append({'offsetFromCentreMetres':side,'sourceMeshHit':h})
 if rayHits:hits.append({'segment':i,'originalSourceIntersections':rayHits})
 mm={'min':[min(a[j],b[j])-4 for j in range(3)],
     'max':[max(a[j],b[j])+4 for j in range(3)]}
 for hz in hazards['hazards']:
  if hz['sampledAabb'] and overlaps(mm,hz['sampledAabb']):hazardsWarn.add(hz['id'])
 mid=(a+b)/2
 below=[]
 for typ,o,t in original:
  hit,n,idx,d=t.ray_cast(mid,Vector((0,-1,0)),400)
  if hit is not None and d is not None and n.y>.7:below.append((float(d),typ,o.name))
 gap=min(below) if below else None
 samples.append({'segment':i,'corridorOffsetCentreMetres':round(float((mid-start).length),2),
  'actualExistingSourceFloorBelowMetres':round(gap[0],3) if gap else None,
  'existingBelowType':gap[1] if gap else None,
  'existingBelowObject':gap[2] if gap else None,
  'originalSixMetreWidthBlocked':bool(rayHits)})
assert before==sig()
floorCount=sum(x['actualExistingSourceFloorBelowMetres'] is not None for x in samples)
nearFloor=sum(x['actualExistingSourceFloorBelowMetres'] is not None and x['actualExistingSourceFloorBelowMetres']<=20 for x in samples)
realWidthPass=len(hits)==0 and not hazardsWarn
report={'schema':'dopagaki.g4e7dz-r6d-r8e-source-cx-early-6m-corridor/1',
 'road':road,'originalSourceCX18B48_7B51_28Unchanged':True,
 'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceActualFloorMesh':floor.name,
 'sourceActualFace':int(face.index),
 'sourceActualAreaMetresSquared':round(float(face.area),3),
 'sourceFaceNormalUp':round(float(normal.y),3),
 'actualSourceFloorWorld':list(map(float,start)),
 'originalR8AChronologicalEarlyPublicSite':list(map(float,end)),
 'distancePlanMetres':round(horizontal.length,3),
 'verticalRiseMetres':round(rise,3),'slopeMetresPerHorizontalMetre':round(grade,5),
 'originalSources6mWidePer8mCorridorSamples':count,
 'exactSourceTriangleCentreAndSideObstructionSamples':hits,
 'all28OriginalMoving721TickSampledAabbWarnings':sorted(hazardsWarn),
 'allSamplesDownwardExistingFloor':samples,
 'samplesAnyActualExistingFloorBelow':floorCount,
 'samplesActualExistingFloorBelowWithin20m':nearFloor,
 'provisionalWidthAndHazardSampleClear':realWidthPass,
 'supportsActuallyDesignedAndBuilt':False,
 'publicPedestrianRouteBuilt':False,
 'originalCxSourceFaceIsLegitimateHumanEntrance':'NOT_CERTIFIED',
 'continuousTimeSafety':'NOT_CERTIFIED',
 'earlyUrbanInternalArtView':'NO_NEW_CITY_MESH',
 'nextGate':'GEOMETRIC_RESEARCH_ONLY' if realWidthPass else 'STOP_SOURCE_CORRIDOR_OBSTRUCTED',
 'newBlenderCityMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
 'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R8E_'+road+'_CX_EARLY_SIX_METRE_SOURCE.json'),'w',encoding='utf-8') as f:json.dump(report,f,indent=2,ensure_ascii=False)
print('R8E_AUTHENTIC_SHORT_SOURCE_ANCHOR',road,'from CX',floor.name,
 'distance',report['distancePlanMetres'],'grade',report['slopeMetresPerHorizontalMetre'],
 '6mObstacleSampleHits',len(hits),'B51Warnings',len(hazardsWarn),
 'realFloorWithin20m',nearFloor,'of',count,'noNewArt')
