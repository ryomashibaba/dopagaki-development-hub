# R10B: Genuine original-source foundation search for the short R8E civic connector.
# NO pier, deck, cable, game collider or source asset added. Source geometry
# is only a candidate anchor, never a code-certified load-bearing structure.
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
a=sys.argv[sys.argv.index('--')+1:]
def arg(k):assert k in a,k;return a[a.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
source=json.load(open(arg('--native'),encoding='utf8'))
r8e=json.load(open(arg('--r8e'),encoding='utf8'))
h=json.load(open(arg('--hazards'),encoding='utf8'))
assert source['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert r8e['schema']=='dopagaki.g4e7dz-r6d-r8e-source-cx-early-6m-corridor/1'
assert h['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert source['road']==r8e['road']==h['road']==road
assert source['sourceCXBlob']==r8e['sourceCXBlob']==h['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--scene'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(CX),len(B48),len(B51),len(cameras.objects))==(18,7,28,5)
def signature():
 return (sorted((x.name,x['source_sha256'],len(x.data.polygons)) for x in CX),
 sorted((x.name,x['ORIGINAL_GAME_B48_SHA256'],len(x.data.polygons)) for x in B48),
 sorted((x.name,x['SOURCE_ORIGINAL_B51_ID'],len(x.data.vertices)) for x in B51),
 sorted((x.name,float(x['true_240hz_time'])) for x in cameras.objects))
originalSig=signature()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
 [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
surfaces=[('CX',o,bvh(o)) for o in CX]+[('B48',o,bvh(o)) for o in B48]
def gethit(start,direction,limit,objects):
 best=None
 for typ,obj,tr in objects:
  hit,n,k,depth=tr.ray_cast(start,direction,limit)
  if hit is not None and depth is not None and (best is None or depth<best['depth']):
   best={'depth':float(depth),'type':typ,'object':obj.name,
    'normalY':round(float(n.y),4),'footXYZ':[round(float(q),4) for q in hit]}
 return best
def overlaps(a,b):
 return all(a['min'][j]<=b['max'][j] and b['min'][j]<=a['max'][j] for j in range(3))
start=Vector(r8e['actualSourceFloorWorld'])
end=Vector(r8e['originalR8AChronologicalEarlyPublicSite'])
horizontal=Vector((end.x-start.x,0,end.z-start.z))
side=Vector((-horizontal.z,0,horizontal.x)).normalized()
assert 80<=horizontal.length<=150 and r8e['provisionalWidthAndHazardSampleClear']
N=math.ceil((end-start).length/8)
studies=[]
for i in range(N+1):
 t=i/N
 deck=start.lerp(end,t)
 possible=[]
 for delta in (-32,-20,-10,0,10,20,32):
  landing=deck+side*delta+Vector((0,2.5,0))
  nearest=gethit(landing,Vector((0,-1,0)),240,surfaces)
  if nearest is None:continue
  # A B48 road contact is NOT a legitimate bridge bearing point;
  # even if it is mechanically near, it would interfere with game road.
  if nearest['type']!='CX' or nearest['normalY']<.7:continue
  verticalDrop=max(0,nearest['depth']-2.5)
  if verticalDrop>150:continue
  foot=Vector(nearest['footXYZ'])
  # Source B48 intersects this hypothetical column; forbidden in original
  # game unless a genuine redesign of game physical road is approved.
  originalB48Obstacles=[]
  for obj in B48:
   ray=foot-landing;L=ray.length
   if L<.2:continue
   hit,n,k,d=bvh(obj).ray_cast(landing,ray.normalized(),L-.20)
   if hit is not None:originalB48Obstacles.append(obj.name)
  # conservative all28 × 721 sampled AABB, thin column radius 2.5m
  bb={'min':[min(landing[j],foot[j])-2.5 for j in range(3)],
      'max':[max(landing[j],foot[j])+2.5 for j in range(3)]}
  danger=[q['id'] for q in h['hazards'] if q['sampledAabb'] and overlaps(bb,q['sampledAabb'])]
  possible.append({'lateralOffset':delta,'verticalReachMetres':round(verticalDrop,3),
   'originalFloor':nearest['object'],'footWorldXYZ':nearest['footXYZ'],
   'originalRoadB48PierIntersection':originalB48Obstacles,
   'all28MovingB51_721TickPierEnvelopes':danger,
   'engineeringCapacityKnown':False})
 acceptable=[p for p in possible if not p['originalRoadB48PierIntersection'] and
    not p['all28MovingB51_721TickPierEnvelopes']]
 acceptable.sort(key=lambda q:(q['verticalReachMetres']*.7+abs(q['lateralOffset'])*.3))
 studies.append({'station':i,'t':round(t,5),
  'deckWorldXYZ':[round(float(x),4) for x in deck],
  'possibleSourceCxFootingProposals':len(possible),
  'sourceCxFootingWithoutB48AndB51SampleInterference':len(acceptable),
  'bestGeometricalPotentialFooting':acceptable[0] if acceptable else None,
  'minimumPositiveFoundFootingDropMetres':min((x['verticalReachMetres'] for x in possible),default=None)})
# One actual CX face at start does not establish an exit/terminal anchor.
# Short bridge also needs anchor/counterweight, longitudinal load path,
# supports between stations, and safe construction over moving source.
hasAll=all(x['bestGeometricalPotentialFooting'] is not None for x in studies)
endPotential=studies[-1]['bestGeometricalPotentialFooting'] is not None
found=sum(x['bestGeometricalPotentialFooting'] is not None for x in studies)
assert originalSig==signature()
result={'schema':'dopagaki.g4e7dz-r6d-r10b-real-source-bridge-footing-grid/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalSourceIdentityUnchanged':True,'originalCX':18,'originalB48':7,'originalB51':28,'originalCameras':5,
 'originalR8EShortConnectorHorizontalMetres':r8e['distancePlanMetres'],
 'originalR8EShortConnectorDirectGrade':r8e['slopeMetresPerHorizontalMetre'],
 'bridgeDeckSupportStations':len(studies),
 'stationsWithGeometricSourceCxFootingB48B51SampleClear':found,
 'allStationsAtLeastOneGeometricPotentialFooting':hasAll,
 'terminalPublicDestinationSourceCxFootingPotential':endPotential,
 'realFootingStationSamples':studies,
 'originalSourceFootingCapacityAndTrueLoadPathCertified':False,
 'longSuspendedSpanActualGameArtNotBuilt':True,
 'continuousTimeB51SweptDynamicCollisionCertified':False,
 'engineeringNextStep':'PHYSICAL_STRUCTURAL_REVIEW_REQUIRED_NOT_ART' if hasAll else 'NO_COMPLETE_CX_SOURCE_SUPPORT_PATH_STOP_BRIDGE_ART',
 'newBlenderMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R10B_'+road+'_BRIDGE_SOURCE_SUPPORT.json'),'w',encoding='utf8') as fd:json.dump(result,fd,indent=2,ensure_ascii=False)
print('R10B_TRUE_CX_SOURCE_FOOTING_SCAN',road,'stations',len(studies),
 'source B48 B51 envelope clear opportunities',found,
 'terminal',endPotential,'complete potential line',hasAll,'ART HOLD')
