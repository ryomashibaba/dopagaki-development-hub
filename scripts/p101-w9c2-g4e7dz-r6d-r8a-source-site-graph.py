# R6D-R8A: pre-model site selection. NO ART, no new game geometry.
# Infer projected, unoccluded space from original 13 authentic camera positions.
# Join potential sites to a real existing CX surface via exact topological graph.
# Graph existence is NOT certifiable walkability, structural anchoring or ART.
import bpy,json,sys,os,math,statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
a=sys.argv[sys.argv.index('--')+1:]
def arg(k): assert k in a,k;return a[a.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
source=json.load(open(arg('--native'),encoding='utf-8'))
contact=json.load(open(arg('--contact'),encoding='utf-8'))
hazards=json.load(open(arg('--hazards'),encoding='utf-8'))
assert source['road']==contact['road']==hazards['road']==road
assert source['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert contact['schema']=='dopagaki.g4e7dz-r5a-source-contact/1'
assert hazards['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert source['sourceCXBlob']==hazards['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert len(source['frames'])==13 and len(hazards['hazards'])==28
bpy.ops.wm.open_mainfile(filepath=arg('--blend'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
movers=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
origCams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
earlyCams=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(movers),len(origCams.objects),len(earlyCams.objects))==(18,7,28,28,5,8)
def protected():
 return {'cx':sorted((x.name,x['source_sha256'],len(x.data.polygons)) for x in CX),
  'b48':sorted((x.name,x['ORIGINAL_GAME_B48_SHA256'],len(x.data.polygons)) for x in B48),
  'b51':sorted((x.name,x['SOURCE_ORIGINAL_B51_ID'],len(x.data.vertices)) for x in B51),
  'camera':sorted((x.name,float(x['true_240hz_time'])) for x in origCams.objects)}
frozen=protected()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
    [tuple(face.vertices) for face in o.data.polygons],all_triangles=False)
world=[('CX',o,bvh(o)) for o in CX]+[('B48',o,bvh(o)) for o in B48]
roadTrees=[b for a,o,b in world if a=='B48']
# The *authentic original* public landing, NOT a newly invented site.
c=contact['best'];assert c and c['preliminaryCandidate']
base=[o for o in CX if o.name==c['CX']]
assert len(base)==1
closest,normal,index,distance=bvh(base[0]).find_nearest(Vector(c['CXcontactWorldXYZ']))
assert distance<.025 and normal.y>.65
cxLanding=Vector(closest)
frames=source['frames']
byId={f['id']:f for f in frames}
cameras={}
movingtrees={}
for idx,f in enumerate(frames,1):
 s.frame_set(idx);bpy.context.view_layer.update()
 cam=origCams.objects.get(f['id']+' REAL ORIGINAL 240HZ')
 if cam is None:cam=earlyCams.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 cameras[f['id']]=cam
 active={x['id'] for x in f['moving'] if x['enabled']}
 movingtrees[f['id']]=[('B51',o,bvh(o)) for o in movers if o['R1_B51_ID'] in active]
 assert len(movingtrees[f['id']])==len(active)
def rayfirst(eye,endpoint,objects,maxDistance=None):
 diff=Vector(endpoint)-Vector(eye);distance=diff.length
 if distance<.001:return None
 limit=distance if maxDistance is None else min(distance,maxDistance)
 direction=diff.normalized();best=None
 for group,o,tr in objects:
  hit,n,face,d=tr.ray_cast(Vector(eye),direction,max(0,limit-.30))
  if hit is not None and d is not None and (best is None or d<best['distance']):
   best={'type':group,'name':o.name,'distance':float(d)}
 return best
def visible(point,f):
 id=f['id']
 c=cameras[id]
 projected=world_to_camera_view(s,c,point)
 inframe=bool(projected.z>0 and .06<projected.x<.94 and .08<projected.y<.92)
 if not inframe:return {'inFrame':False,'unblocked':False}
 first=rayfirst(c.location,point,world+movingtrees[id])
 return {'inFrame':True,'unblocked':first is None,
  'occluder':first,
  'pixelUv':[round(float(projected.x),4),round(float(1-projected.y),4)]}
def roadsurfaceDistance(p):
 distances=[tree.find_nearest(p) for tree in roadTrees]
 return min(d for h,n,face,d in distances if d is not None)
def inHazardSampledAabb(p,margin=9):
 hits=[]
 for v in hazards['hazards']:
  box=v['sampledAabb']
  if not box:continue
  if all(box['min'][i]-margin<=p[i]<=box['max'][i]+margin for i in range(3)):
   hits.append(v['id'])
 return hits
# Deliberately look for a longitudinal urban *sequence*, not a single 17s
# billboard. Cameras 12.5, 14, 15.5 and 17 offer distinct bends.
candidateRows=[]
for origin in ('t1250','t1400','t1550','t1700'):
 f=byId[origin]
 eye=Vector(f['eye']);forward=Vector(f['front'])
 horizontal=Vector((forward.x,0,forward.z)).normalized()
 lateral=horizontal.cross(Vector((0,1,0))).normalized()
 p=Vector(f['playerPosition'])
 for dist in (100,160,235):
  for sidem in (-1,1):
   for spread in (46,72,105):
    for height in (24,56):
     point=p+horizontal*dist+lateral*(sidem*spread)+Vector((0,height,0))
     gap=roadsurfaceDistance(point)
     danger=inHazardSampledAabb(point)
     view={g['id']:visible(point,g) for g in frames}
     clearIDs=[k for k,v in view.items() if v['unblocked']]
     # Score exact sample temporal continuity, NOT beauty/ART.
     # Adjacent camera positions at .5s: require two-point continuity.
     longest=0;run=0
     for t in frames:
      if view[t['id']]['unblocked']:run+=1;longest=max(longest,run)
      else:run=0
     candidateRows.append({'anchor':origin,'distanceForward':dist,
       'lateralMetres':sidem*spread,'heightAboveBall':height,
       'worldXYZ':[round(float(x),5) for x in point],
       'originalB48Nearest3dDistance':round(float(gap),4),
       'full721tickB51SampledAabbMargin9mHits':danger,
       'sourceClearFrames':clearIDs,'longestConsecutiveSourceFrames':longest,
       'sourceFrames12_13_clear':sum(v['unblocked'] for k,v in view.items() if k in ('t1200','t1250','t1300')),
       'sourceFrames15_17_clear':sum(v['unblocked'] for k,v in view.items() if k in ('t1500','t1550','t1600','t1650','t1700')),
       'all13NativeCameraResults':view})
# No generic object creation in this stage. A researchable candidate only if
# source road spacing, hazard sample margin and actual 2-frame visible window.
qualified=[v for v in candidateRows
 if v['originalB48Nearest3dDistance']>=12 and not v['full721tickB51SampledAabbMargin9mHits']
 and v['longestConsecutiveSourceFrames']>=2]
# Four separate visual roles selected before any geometry; each needs
# supporting frames in its own time-window so final stage doesn't vanish.
roles=[
 ('EARLY_PUBLIC',('t1150','t1200','t1250','t1300')),
 ('MID_TRANSFER',('t1350','t1400','t1450','t1500')),
 ('LATE_HABITAT',('t1500','t1550','t1600')),
 ('EXIT_INTERIOR',('t1600','t1650','t1700'))]
used=[]
selection={}
for role,window in roles:
 def rank(v):
  clear=sum(v['all13NativeCameraResults'][t]['unblocked'] for t in window)
  allclear=len(v['sourceClearFrames'])
  return (clear,v['longestConsecutiveSourceFrames'],allclear,-v['originalB48Nearest3dDistance']/150)
 eligible=[v for v in qualified if sum(v['all13NativeCameraResults'][t]['unblocked'] for t in window)>=2
           and all(math.dist(v['worldXYZ'],prev['worldXYZ'])>68 for prev in used)]
 if eligible:
  best=max(eligible,key=rank)
  used.append(best)
  selection[role]=best
# Important: if fewer than 4 distinct roles survive, STOP; do not invent scenes.
# A connected route graph is only a TOPOLOGICAL plan without geometry.
entries=[{'node':'ORIGINAL_CX_SURFACE','point':[round(float(x),4) for x in cxLanding],
 'sourceMesh':c['CX'],'faceIndex':c['CXface'],'originalFaceNormalY':round(float(normal.y),4)}]
for role,v in selection.items():
 entries.append({'node':role,'point':v['worldXYZ'],'sourceClearFrames':v['sourceClearFrames']})
edges=[]
for p0,p1 in zip(entries,entries[1:]):
 a=Vector(p0['point']);b=Vector(p1['point'])
 length=(b-a).length;rise=abs(b.y-a.y)
 n=max(1,math.ceil(length/15))
 segments=[]
 for k in range(n):
  aa=a.lerp(b,k/n);bb=a.lerp(b,(k+1)/n)
  # Preliminary free-space clearance: a line not a supporting footbridge.
  # Start at CX + .6m, avoids the known original horizontal top face.
  if k==0 and p0['node']=='ORIGINAL_CX_SURFACE':aa=aa+Vector((0,.65,0))
  hit=rayfirst(aa,bb,world)
  hazardous=sorted(set(x for pos in (aa,bb,(aa+bb)/2) for x in inHazardSampledAabb(pos,6)))
  segments.append({'a':[round(float(x),4) for x in aa],
   'b':[round(float(x),4) for x in bb],
   'lengthMetres':round(float((bb-aa).length),4),
   'rampApproxSlope':round(float(abs(bb.y-aa.y)/max(.001,math.hypot(bb.x-aa.x,bb.z-aa.z))),5),
   'sourceMeshBlocked':hit,'full721TickB51AabbWarning':hazardous})
 edges.append({'from':p0['node'],'to':p1['node'],'straight3dMetres':round(float(length),4),
  'straightRiseMetres':round(float(rise),4),'segments':segments,
  'sourceSegmentMeshBlockCount':sum(x['sourceMeshBlocked'] is not None for x in segments),
  'sourceHazardSampleWindowCount':sum(bool(x['full721TickB51AabbWarning']) for x in segments),
  'pedestrianSupportingSurfacesBuilt':False})
assert protected()==frozen
edgeTopologyClosed=bool(len(entries)==5 and len(edges)==4 and all(e['from']==entries[i]['node'] and e['to']==entries[i+1]['node'] for i,e in enumerate(edges)))
# Existing mesh alone cannot certify new 100m bridges, access ramps, steps,
# load paths, entrances or a 17s authored scene. Mark as premise not success.
routeNeedsModel=bool(edgeTopologyClosed)
physicalPedestrianCertified=False
artEligibility='PREMODEL_SITES_IDENTIFIED_NOT_ART' if edgeTopologyClosed else 'STOP_MISSING_MULTI_BEAT_SITES'
report={'schema':'dopagaki.g4e7dz-r6d-r8a-original-source-premodel-graph/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceCX':18,'sourceB48':7,'sourceB51':28,'originalCameras':5,'gap52':True,
 'sourceProtected':True,'originalSourceCXAccessPoint':c['CXcontactWorldXYZ'],
 'originalCxSourceFaceNearestResidualMetres':round(float(distance),6),
 'all28Moving721TickAabbsUsed':True,
 'candidateCount':len(candidateRows),'qualifiedSourceSites':len(qualified),
 'selection':selection,'siteRolesOrdered':list(selection),
 'pedestrianGraphNodes':entries,'pedestrianGraphEdges':edges,
 'topologicalPathSketchClosed':edgeTopologyClosed,
 'originalMeshSegmentBlockCount':sum(x['sourceSegmentMeshBlockCount'] for x in edges),
 'movingB51_721TickAabbSegmentWarningCount':sum(x['sourceHazardSampleWindowCount'] for x in edges),
 'newSupportingWalkSurfacesBuilt':False,
 'fullPhysicalWalkingRouteCertified':physicalPedestrianCertified,
 'realCityInteriorVolumePresent':False,
 'humanAestheticAndArt':'NOT_EVALUATED_NO_CITY_MESH',
 'preModelEligibility':artEligibility,
 'newBlenderCityMeshes':0,'newGameColliders':0,'sourceGameChanged':False,
 'officialArt':0,'officialSlope2Metres':0,
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R8A_'+road+'_PREMODEL_SOURCE_GRAPH.json'),'w',encoding='utf-8') as o:
 json.dump(report,o,indent=2,ensure_ascii=False)
print('R8A_TRUE_SOURCE_PREMODEL',road,'candidates',len(candidateRows),
 'viable',len(qualified),'roles',list(selection),
 'topologyOnly',edgeTopologyClosed,'routeMeshBlocks',report['originalMeshSegmentBlockCount'],
 'ART','HOLD')
