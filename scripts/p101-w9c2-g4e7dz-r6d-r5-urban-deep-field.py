# R6D-R5: one falsifiable genuinely 3D depth-field city hypothesis.
# Distinct, deeply spaced inhabited cliffs, aerial transit and civic voids.
# The original game road, ball path and controls stay absolutely unchanged.
# Never adopt as art without independent human image review.
import bpy,math,json,os,sys,statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(a):assert a in argv,a;return argv[argv.index(a)+1]
road=arg('--road'); assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
d=json.load(open(arg('--native'),encoding='utf8'))
h=json.load(open(arg('--hazards'),encoding='utf8'))
c=json.load(open(arg('--contact'),encoding='utf8'))
assert d['road']==h['road']==c['road']==road
assert d['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert h['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert c['schema']=='dopagaki.g4e7dz-r5a-source-contact/1'
assert d['sourceCXBlob']==h['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert len(d['originalTrajectoryParity'])==7 and len(h['hazards'])==28 and h['frames721']==721
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
PROXIES=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
CAMS=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
EARLY=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(PROXIES),len(CAMS.objects),len(EARLY.objects))==(18,7,28,28,5,8)
def signature():
 return {
 'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 'CAMS':sorted((o.name,float(o['true_240hz_time']),tuple(round(float(x),4) for x in o.location)) for o in CAMS.objects)}
before=signature()
def bv(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
     [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
F={f['id']:f for f in d['frames']}
def native(t):
 # Piecewise-linear true *measured* 240Hz half-second player anchor.
 anchor=(t-14)*2;left=max(0,min(5,int(anchor)));w=max(0,min(1,anchor-left))
 pa=Vector(F['t'+str(1400+50*left)]['playerPosition'])
 pb=Vector(F['t'+str(1450+50*left)]['playerPosition'])
 forward=pb-pa;forward.y=0;assert forward.length>25
 forward.normalize()
 right=Vector((-forward.z,0,forward.x))
 return pa.lerp(pb,w),forward,right
def site(t,side,offset,dy):
 p,f,r=native(t)
 return p+side*offset*r+Vector((0,dy,0))
# Three district nodes: civic at t14.65, residential at 15.62, rail/exchange at16.45.
# These are *large* inhabited 3D spaces, not geometry occupying the road.
nodes=[
 {'time':14.65,'side':-1,'radius':51,'role':'PUBLIC','height':112,'size':44},
 {'time':15.62,'side':1,'radius':56,'role':'RESIDENTIAL','height':150,'size':53},
 {'time':16.45,'side':-1,'radius':54,'role':'INTERCHANGE','height':134,'size':47}
]
coll=bpy.data.collections.new('R5 PRIVATE CITY DEPTH FIELD UNADOPTED')
s.collection.children.link(coll)
def mat(name,rgb,metal=.17):
 m=bpy.data.materials.new('R5 '+name);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*rgb,1)
 bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=.42
 return m
outer=mat('split pearl mineral vertical structure',(.33,.42,.48),.27)
public=mat('sunlit civic living decks',(.71,.61,.44))
home=mat('warm resident balcony galleries',(.56,.31,.29),.32)
rail=mat('urban transit coral glass conductor',(.09,.59,.61),.4)
garden=mat('sky ecological court',(.28,.48,.38))
service=mat('dark shaded interlevel cavity',(.17,.23,.29))
materials={'PUBLIC':public,'RESIDENTIAL':home,'INTERCHANGE':rail}
objs=[]
def mesh(name,verts,faces,m,role):
 data=bpy.data.meshes.new(name);data.from_pydata([tuple(v) for v in verts],[],faces);data.update()
 assert data.polygons
 obj=bpy.data.objects.new('R5 '+name,data);coll.objects.link(obj);data.materials.append(m)
 obj['R5_FUNCTION']=role;obj['R5_UNADOPTED']=True;obj['R5_NO_NEW_GAME_COLLIDER']=True
 objs.append(obj);return obj
def girder(name,a,b,w,h,material,role):
 # A real 8-vertex enclosed asymmetric beam, not a line or billboard.
 a=Vector(a);b=Vector(b);v=b-a
 tangent=Vector((v.x,0,v.z))
 if tangent.length<.1:tangent=Vector((1,0,0))
 tangent.normalize(); across=Vector((-tangent.z,0,tangent.x))
 vs=[]
 for p in (a,b):
  for side in (-1,1):
   for level in (-1,1):
    vs.append(p+across*(w*side/2)+Vector((0,h*level/2,0)))
 fs=[(0,2,6,4),(1,5,7,3),(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6)]
 return mesh(name,vs,fs,material,role)
def arc(name,center,side,r0,r1,cy,dy,ang0,ang1,m,role,sections=14):
 # A real thick crescent with open gaps, not solid annular wall.
 pts=[]
 p,along,across=native(center)
 anchor=site(center,side,nodes[[x['time'] for x in nodes].index(center)]['radius'],cy)
 for i in range(sections+1):
  a=ang0+(ang1-ang0)*i/sections
  for radius,y in ((r0,-dy/2),(r1,-dy/2),(r0,dy/2),(r1,dy/2)):
   pts.append(anchor+along*(math.cos(a)*radius)+across*(math.sin(a)*radius)+Vector((0,y,0)))
 faces=[]
 for i in range(sections):
  j=i*4;k=j+4
  faces.extend(((j,j+1,k+1,k),(j+2,k+2,k+3,j+3),(j,k,k+2,j+2),(j+1,j+3,k+3,k+1)))
 faces.extend(((0,2,3,1),(4*sections,4*sections+1,4*sections+3,4*sections+2)))
 return mesh(name,pts,faces,m,role)
def pillar(name,centre,up,m,role):
 a=Vector(centre);b=a+Vector((0,up,0))
 return girder(name,a,b,6.6,5.3,m,role)
# Porous mega-building volumes: distinct 3D functional levels, deep
# inhabited courts, non-contiguous vertical loads and large negative voids.
for idx,node in enumerate(nodes,1):
 t=node['time'];side=node['side'];radius=node['radius'];height=node['height']
 mat_func=materials[node['role']]
 # Three stacked, rotated crescents, NEVER an opaque wall.
 for layer,(low,angles) in enumerate(((20,(-.15,1.10)),
                                    (55,(2.05,3.35)),
                                    (91,(3.90,5.35))),1):
  if low+4>height:continue
  arc(f'{idx} function deck {layer}',t,side,14,34,low,5.8,
     angles[0],angles[1],mat_func,
     node['role']+'_ACTIVE_COURT_HOLLOW_NEGATIVE_CORE')
 # A deeply varied, slanted load bearing mast on the OUTER side, never road centre.
 base=site(t,side,radius+18,6)
 tops=site(t+.05,side,radius+28,height-8)
 girder(f'{idx} diagonal primary support',base,tops,7.8,7.4,outer,
   node['role']+'_FULL_HEIGHT_BEARING_UNCERTIFIED')
 # Two distinct side fins give vertical scale without forming solid skyline wall.
 for limb,dt,shift,dy in ((1,-.10,9,78),(2,.12,-3,height-20)):
  start=site(t+dt,side,radius+16,31)
  tip=site(t+dt+.04,side,radius+shift,dy)
  girder(f'{idx} split flying balcony load {limb}',start,tip,8.7,4.7,service,
   node['role']+'_INHABITED_SPLIT_SUPPORT')
 # Real window strips: thin but substantial, oriented across a functioning court.
 for layer,yd in enumerate((35,70,107),1):
  a=site(t-.12,side,radius+14,yd)
  b=site(t+.10,side,radius+13,yd+4)
  girder(f'{idx} inhabited inner gallery {layer}',a,b,8.1,3.2,
    garden if layer==1 else mat_func,node['role']+'_PEDESTRIAN_LEVEL_NOT_CERTIFIED')
# Grade separated, visually understandable railway threading between districts
# on CITY-ONLY outer side; never a new roadway or ball collision surface.
for i in range(len(nodes)-1):
 a=nodes[i];b=nodes[i+1]
 # Both endpoints at side of districts; the center span is high above road.
 for lane,offset in enumerate((-2.0,2.0),1):
  orig=site(a['time'],a['side'],a['radius']+14,100+offset)
  mid=site((a['time']+b['time'])/2,1,2,142+offset)
  dest=site(b['time'],b['side'],b['radius']+15,110+offset)
  girder('suspended rail '+str(i)+' lane '+str(lane)+' ingress',orig,mid,1.0,1.0,rail,
   'TRANSIT_COURT_CONNECTION_UNCERTIFIED')
  girder('suspended rail '+str(i)+' lane '+str(lane)+' egress',mid,dest,1.0,1.0,rail,
   'TRANSIT_COURT_CONNECTION_UNCERTIFIED')
# Distinct CX anchor: a source-existing real pedestrian contact, NOT a welded stair.
contact=c['best'];assert contact and contact['preliminaryCandidate']
target=[o for o in CX if o.name==contact['CX']];assert len(target)==1
actual,normal,poly,distance=bv(target[0]).find_nearest(Vector(contact['CXcontactWorldXYZ']))
assert distance<.025 and normal.y>.65
c0=Vector(actual)+Vector((0,2.7,0))
c1=site(16.45,-1,63,10)
c2=site(16.45,-1,70,25)
girder('cx human access candidate lower',c0,c1,4.0,1.5,public,
 'SOURCE_CX_POINT_ALIGNED_NOT_WELDED')
girder('cx human access candidate upper',c1,c2,4.0,1.5,public,
 'SOURCE_CX_POINT_ALIGNED_NOT_WELDED')
assert len(objs)>=35,len(objs)
assert signature()==before
# Prove static mesh intersections. Building colliding with physical B48 is FAIL.
new=[(o,bv(o)) for o in objs]
static=[(o,bv(o)) for o in B48]
old=[(o,bv(o)) for o in CX]
B48hits=[];CXhits=[]
for o,bt in new:
 for r,rt in static:
  ix=bt.overlap(rt)
  if ix:B48hits.append([o.name,r.name,len(ix)])
 for r,rt in old:
  ix=bt.overlap(rt)
  if ix:CXhits.append([o.name,r.name,len(ix)])
# Conservative 28*721 historical sampled AABB rejection signal.
# This can falsely reject: union across all 3s; NEVER automatically approve.
def aabbox(o):
 vs=[o.matrix_world@p.co for p in o.data.vertices]
 return {'min':[min(p[k] for p in vs) for k in range(3)],
         'max':[max(p[k] for p in vs) for k in range(3)]}
def overlaps(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
sampleWarning=[]
for ob in objs:
 bb=aabbox(ob)
 for hz in h['hazards']:
  hb=hz['sampledAabb']
  if hb and overlaps(bb,hb):sampleWarning.append([ob.name,hz['id']])
# R1 actual B51 visual proxies contain the original frame's raw pose keys.
B51snap={}
for fi,f in enumerate(d['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 active={m['id'] for m in f['moving'] if m['enabled']}
 moverTrees=[(ob,bv(ob)) for ob in PROXIES if ob['R1_B51_ID'] in active]
 ix=[]
 for ob,tree in new:
  for m,mt in moverTrees:
   hit=tree.overlap(mt)
   if hit:ix.append([ob.name,m['R1_B51_ID'],len(hit)])
 B51snap[f['id']]=ix
# Projection evidence: which physical urban components can potentially
# be seen by the ACTUAL source cameras (not a human ART judgment).
times=['t1400','t1450','t1500','t1550','t1600','t1650','t1700']
views={}
for t in times:
 fi=d['frames'].index(F[t])+1;s.frame_set(fi)
 cam=CAMS.objects.get(t+' REAL ORIGINAL 240HZ')
 if cam is None:cam=EARLY.objects.get('R1 '+t+' SOURCE CAMERA')
 assert cam
 inview=[]
 for o in objs:
  verts=[o.matrix_world@v.co for v in o.data.vertices]
  p=[world_to_camera_view(s,cam,v) for v in verts]
  # Any vertex projected on screen is a weak potential, not visible coverage.
  if any(v.z>0 and 0<v.x<1 and 0<v.y<1 for v in p):inview.append(o.name)
 views[t]={'potentialVertexInFrameMeshes':inview,'potentialCount':len(inview),
  'actualOcclusionNotTested':True}
assert signature()==before
s['R5_NEW_CITY_NOT_ADOPTED']=True
s['R5_NEW_GAME_COLLIDERS']=0;s['R5_WEBGL_GAME_CITY']='NOT_RENDERED'
s['R5_ART']=s['R5_GAMEPLAY']=s['R5_RELEASE']='HOLD'
s.frame_set(9)
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R5_'+road+'_DEPTH_FIELD_CIVIC_HOUSING_TRANSIT_EDITABLE_PRIVATE_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for t in times:
 fi=d['frames'].index(F[t])+1;s.frame_set(fi)
 cam=CAMS.objects.get(t+' REAL ORIGINAL 240HZ')
 if cam is None:cam=EARLY.objects.get('R1 '+t+' SOURCE CAMERA')
 s.camera=cam
 filename='R5_'+road+'_'+t+'_ACTUAL_BLENDER_NOT_GAME_WEBGL.png'
 s.render.filepath=os.path.join(out,filename)
 bpy.ops.render.render(write_still=True)
 renders.append(filename)
assert signature()==before
res={
 'schema':'dopagaki.g4e7dz-r6d-r5-city-depth-field/1','road':road,
 'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceCX':18,'originalB48':7,'originalB51':28,
 'originalCameras':5,'gap52':True,'originalObjectsUnchanged':True,
 'newRealCityMeshes':len(objs),'cityMeshRoles':{o.name:o['R5_FUNCTION'] for o in objs},
 'threeSourceCityDistrictTimes':[x['time'] for x in nodes],
 'provisionalCXContact':contact,'originalCXContactWelded':False,
 'originalB48TriangleIntersections':B48hits,
 'originalCXTriangleIntersections':CXhits,
 'all28X721SourceHazardsConservativeAabbOverlapWarnings':sampleWarning,
 'B51ThirteenPreciseSampleTriangleIntersections':B51snap,
 'sourceCameraVertexPotentialNotHumanLegibility':views,
 'noContinuousTimeCollisionCertification':True,
 'physicalRoadClearAtSourceB48':len(B48hits)==0,
 'sampledWarningsCount':len(sampleWarning),
 'newGameColliders':0,'newCityGameWebGL':'NOT_RENDERED','sourceGameChanged':False,
 'originalPhysicsAndPlayerControlsUnchanged':True,
 'genuineBlenderPngs':renders,'editableBlender':blend,
 'officialArt':0,'officialSlope2Metres':0,
 'TECH':'SOURCE_PROTECTION_AND_GEOMETRIC_TESTS_ONLY',
 'ART':'HOLD_PENDING_ACTUAL_IMAGE_REVIEW',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R5_'+road+'_AUDIT.json'),'w',encoding='utf8') as f:
 json.dump(res,f,indent=2,ensure_ascii=False)
print('R5_ACTUAL_ONE_CITY_PRIVATE',road,'meshes',len(objs),
 'b48',len(B48hits),'B51snap',sum(map(len,B51snap.values())),
 'B51_721tAABBwarnings',len(sampleWarning),'cx',len(CXhits))
