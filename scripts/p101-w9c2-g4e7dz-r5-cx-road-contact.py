# R5A PRIVATE contact-first audit on genuine DR world, never an art/game pass.
import bpy,json,sys,os,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
a=sys.argv[sys.argv.index('--')+1:]
def get(s): return a[a.index(s)+1]
road=get('--road'); assert road in ('true-pinch','pinch-switch')
out=get('--out');os.makedirs(out,exist_ok=True)
site=json.load(open(get('--site-report')))
assert site['schema']=='dopagaki.g4e7dy-r1-native-road-approach-city/1'
assert site['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert (site['originalB48'],site['originalB51'],site['newColliders'])==(7,28,0)
assert site['gap52'] and site['unchangedPhysics']
stations=site['roads'][road]['stations'];assert len(stations)==21
bpy.ops.wm.open_mainfile(filepath=get('--source'))
s=bpy.context.scene
assert s.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert s.get('DR_ACTUAL_B48_MESH_COUNT')==7 and s.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert s.get('DR_ACTUAL_B48_VOID_CELL52') is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(cx),len(b48),len(b51),len(cams.objects))==(18,7,28,5)
frozen=(sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48))
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
cxdata=[(o,tree(o)) for o in cx];rdata=[(o,tree(o)) for o in b48]
shots=('t1550','t1600','t1650','t1700')
cam={t:cams.objects.get(t+' REAL ORIGINAL 240HZ') for t in shots}
assert all(cam.values())
def ray(a,b,objects):
 d=b-a
 if d.length<2:return False
 o=a+d.normalized()*.65
 return any(bvh.ray_cast(o,d.normalized(),d.length-1.6)[0] is not None for _,bvh in objects)
moving={}
for frame,t in enumerate(shots,2):
 s.frame_set(frame);bpy.context.view_layer.update()
 moving[t]=[(o,tree(o)) for o in b51]
def sp(p,c):
 x=world_to_camera_view(s,c,p)
 return x.z>0 and .07<x.x<.93 and .08<x.y<.92
rows=[]
for i in range(4,20):
 for side in ('L','R'):
  centre=Vector(stations[i]['center'])
  edge=Vector(stations[i]['left' if side=='L' else 'right'])
  direction=edge-centre;direction.y=0;assert direction.length>1
  for off in (12,24,42,64):
   q=edge+direction.normalized()*off
   hits=[]
   for obj,bvh in cxdata:
    p,n,face,d=bvh.find_nearest(q)
    if p is not None:hits.append((float(d),obj,Vector(p),Vector(n),face))
   hits.sort(key=lambda x:x[0])
   if not hits:continue
   d,obj,p,n,face=hits[0]
   horizontal=math.hypot(p.x-q.x,p.z-q.z)
   grade=abs(p.y-q.y)/horizontal if horizontal>1e-4 else 999
   sight=sum(sp(q,cam[t]) and sp(p,cam[t]) and not ray(cam[t].matrix_world.translation,q,rdata)
    for t in shots)
   collision=ray(q,p,rdata)
   movingHits={t:ray(q,p,moving[t]) for t in shots}
   eligible=d<=44 and horizontal>2 and grade<=.12 and n.y>=.65 and sight>=2 and not collision and not any(movingHits.values())
   rows.append({'station':i,'side':side,'outsideEdgeMeters':off,'CX':obj.name,
    'CXSourceSHA':obj['source_sha256'],'CXface':int(face),
    'CXcontactWorldXYZ':[round(float(x),3) for x in p],
    'proposedOutsideRoadPointXYZ':[round(float(x),3) for x in q],
    'distanceMeters':round(d,3),'slope':round(grade,4),'CXfloorNormalY':round(float(n.y),3),
    'endpointFramesInView':sight,'roadRayBlocked':collision,'B51RayFourSnapshots':movingHits,
    'preliminaryCandidate':eligible,'walkableConnectionCertified':False,
    'newGameCollider':False})
rows.sort(key=lambda x:(not x['preliminaryCandidate'],-x['endpointFramesInView'],x['distanceMeters']))
assert frozen==(sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48))
result={'schema':'dopagaki.g4e7dz-r5a-source-contact/1','road':road,
 'sourceCX':18,'originalB48':7,'originalB51':28,'originalCameras':5,'gap52':True,
 'scanned':len(rows),'preliminaryCount':sum(r['preliminaryCandidate'] for r in rows),
 'topCandidates':rows[:20],'best':next((r for r in rows if r['preliminaryCandidate']),None),
 'limitation':'Nearest point + approximate ray tests do not prove traversability, mesh attachment, swept B51 safety, or city function.',
 'actualNewArtMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'realWebGL':'NOT_RENDERED','humanPlay':'NOT_RUN','sourceChanged':False,
 'tech':'SOURCE_AUDIT_ONLY','art':'HOLD','gameplay':'HOLD','performance':'HOLD',
 'integration':'HOLD','release':'HOLD','merge':'HOLD'}
json.dump(result,open(out+'/R5A_'+road+'_SOURCE_CONTACT.json','w'),indent=2)
print('R5A_SOURCE_CONTACT',json.dumps({'road':road,'scanned':len(rows),'preliminary':result['preliminaryCount'],'art':'HOLD'}))
