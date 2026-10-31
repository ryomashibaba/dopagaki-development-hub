# R9B — test actual 8x8x32m potential civic building on original CX,
# real source triangles and original moving obstacle data, before making art.
# A BVH test prism is NOT a game asset, new collider or certified foundation.
import bpy,json,sys,os,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
a=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in a,k;return a[a.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
r9=json.load(open(arg('--r9a'),encoding='utf8'))
r1=json.load(open(arg('--native'),encoding='utf8'))
h=json.load(open(arg('--hazards'),encoding='utf8'))
assert r9['schema']=='dopagaki.g4e7dz-r6d-r9a-existing-cx-supported-footprint/1'
assert r1['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert h['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert r9['road']==r1['road']==h['road']==road
assert r9['sourceCXBlob']==r1['sourceCXBlob']==h['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
PROX=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
assert (len(CX),len(B48),len(B51),len(PROX))==(18,7,28,28)
def sig():
 return (sorted((x.name,x['source_sha256'],len(x.data.polygons)) for x in CX),
 sorted((x.name,x['ORIGINAL_GAME_B48_SHA256'],len(x.data.polygons)) for x in B48),
 sorted((x.name,x['SOURCE_ORIGINAL_B51_ID'],len(x.data.vertices)) for x in B51))
before=sig()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
original=[('CX',o,tree(o)) for o in CX]+[('B48',o,tree(o)) for o in B48]
def box(center,halfwidth=4,top=32,bottom=1):
 x,y,z=center
 vertices=[(x+dx,y+hh,z+dz) for hh in (bottom,top)
 for dx,dz in ((-halfwidth,-halfwidth),(-halfwidth,halfwidth),
   (halfwidth,halfwidth),(halfwidth,-halfwidth))]
 polygons=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 return BVHTree.FromPolygons(vertices,polygons,all_triangles=False),vertices
def box_intersects_aabb(verts,bb,margin=3):
 return all(min(v[i] for v in verts)-margin<=bb['max'][i] and
  bb['min'][i]<=max(v[i] for v in verts)+margin for i in range(3))
# Source original 13 half-second moving poses, not future continuous safety.
frames=r1['frames']
checks=[]
for candidate in r9['topSourceFloorResearchFaces']:
 if candidate['genuine8mPadCornersHavingSourceFloorWithin2_3m']!=4:continue
 if candidate['longestConsecutiveEarlyCamerasWithVisibleMultiFloor']<2:continue
 world=Vector(candidate['centerWorld'])
 t,vertices=box(world)
 staticConflicts=[]
 for typ,obj,bvh in original:
  overlap=t.overlap(bvh)
  if overlap:staticConflicts.append({'sourceType':typ,'object':obj.name,'trianglePairs':len(overlap)})
 hazardWarnings=[x['id'] for x in h['hazards'] if x['sampledAabb'] and
  box_intersects_aabb(vertices,x['sampledAabb'])]
 movingConflicts=[]
 nearestBall=min(math.hypot(f['playerPosition'][0]-world.x,f['playerPosition'][2]-world.z) for f in frames)
 for fi,f in enumerate(frames,1):
  s.frame_set(fi);bpy.context.view_layer.update()
  active={x['id'] for x in f['moving'] if x['enabled']}
  for mover in PROX:
   if mover['R1_B51_ID'] not in active:continue
   overlap=t.overlap(tree(mover))
   if overlap:movingConflicts.append({'frame':f['id'],'id':mover['R1_B51_ID'],'trianglePairs':len(overlap)})
 checks.append({'sourceFloor':candidate['existingCXMesh'],
  'sourceFaceIndex':candidate['faceIndex'],'world':candidate['centerWorld'],
  'sourceAreaMetresSquared':candidate['originalFaceArea'],
  'original4FootprintCornersConfirmed':True,
  'earlySourceMultiFloorVisibleFrames':candidate['earlyCamerasWithVisibleMultiFloorVolume'],
  'actual8x8x31mBVHSourceTriangleConflicts':staticConflicts,
  'all28OriginalB51_721TickAabbWarnings':hazardWarnings,
  'originalB51_13SourceFrameTriangleConflicts':movingConflicts,
  'minimumOriginalPlayerHorizontalDistanceMetres':round(float(nearestBall),3),
  'physicalGameRoadAndSourceColliderGeometryClear':not staticConflicts and not movingConflicts and not hazardWarnings,
  'sourceRoomActualHumanEntranceBuilt':False,
  'sourceExistingFloorLoadCapacityProven':False,
  'ART':'HOLD'})
# Initial same original face may be blocked; choose actual most feasible research
# candidate only, not by numerical score alone.
eligible=[x for x in checks if x['physicalGameRoadAndSourceColliderGeometryClear'] and
 x['minimumOriginalPlayerHorizontalDistanceMetres']>=24]
best=eligible[0] if eligible else None
assert before==sig()
report={'schema':'dopagaki.g4e7dz-r6d-r9b-actual-footprint-physical-sample-gate/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalCX18B48_7B51_28Unchanged':True,
 'candidateGenuineSourceFloorFootprintsTested':len(checks),
 'physicalGameRoadAndB51_721TickSampleClearCandidateCount':len(eligible),
 'independentExistingFloorBVHPrismChecks':checks,
 'bestSafeResearchSiteForOnePrivateEditableBlenderTrial':best,
 'originalPhysicalWalkingBridgeCertified':False,
 'existingOriginalCXHumanEntranceCertified':False,
 'actualLoadBearingSafetyCertified':False,
 'movingB51ContinuousTimeSafe':'NOT_CERTIFIED',
 'ARTAcceptableWithoutTrueImageReview':False,
 'conditionalNextAction':'PRIVATE_BLENDER_ONE_BUILDING_VIEW_TEST_ONLY' if best else 'STOP_NO_GEOMETRIC_SAFETY_CLEAR_SOURCE_FLOOR',
 'actualNewCityMeshesBuilt':0,'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R9B_'+road+'_REAL_EIGHT_METRE_VOLUME_AUDIT.json'),'w',encoding='utf8') as fd:json.dump(report,fd,indent=2,ensure_ascii=False)
print('R9B_REAL_SOURCE_8M_BUILDING_PHYSICAL_GATE',road,
 'tested',len(checks),'eligible',len(eligible),
 'best',best['sourceFaceIndex'] if best else None,
 'source game unchanged and art HOLD')
