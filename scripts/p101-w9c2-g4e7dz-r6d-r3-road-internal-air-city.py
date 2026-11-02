# G4E-7DZ R6D-R3. Private falsifiable prototype: ROAD-INTERNAL AIR DISTRICT.
# Source 240Hz B48 trajectory is the open negative space, not the outside object.
# A pair of asymmetrical districts straddles it with distinct terraces,
# elevated transit and a CX-rooted human branch. ZERO new game colliders.
import bpy, sys, os, math, json
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:]
def arg(x):
 assert x in args,x
 return args[args.index(x)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
timeline=json.load(open(arg('--timeline'),encoding='utf-8'))
contact=json.load(open(arg('--contact'),encoding='utf-8'))
assert timeline['road']==contact['road']==road
assert timeline['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert contact['schema']=='dopagaki.g4e7dz-r5a-source-contact/1'
assert timeline['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert len(timeline['frames'])==13 and len(timeline['originalTrajectoryParity'])==7
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(cx),len(b48),len(b51),len(cameras.objects),len(early.objects))==(18,7,28,5,8)
def signature():
 return {
 'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
 'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in b51),
 'camera':sorted((o.name,float(o['true_240hz_time']),tuple(round(float(v),4) for v in o.location)) for o in cameras.objects)}
frozen=signature()
def bvh(ob):
 return BVHTree.FromPolygons([tuple(ob.matrix_world@v.co) for v in ob.data.vertices],
  [tuple(p.vertices) for p in ob.data.polygons],all_triangles=False)
def vec(x):return Vector(x)
frames={f['id']:f for f in timeline['frames']}
key=('t1450','t1500','t1550','t1600','t1650','t1700')
def ip(a,b,t):
 p=vec(frames[a]['playerPosition']);q=vec(frames[b]['playerPosition'])
 return p.lerp(q,t)
def basis(a,b,t):
 p=ip(a,b,t)
 tang=vec(frames[b]['playerPosition'])-vec(frames[a]['playerPosition'])
 tang.y=0;assert tang.length>20
 tang.normalize()
 right=Vector((-tang.z,0,tang.x))
 return p,tang,right
# 0.0–1.0 param on 15s–17s. All nodes use genuine physical-ball trajectory,
# never the old off-road R2 icon/monument anchor.
def traj(t):
 if t<=.25:return basis('t1500','t1550',t/.25)
 if t<=.5:return basis('t1550','t1600',(t-.25)/.25)
 if t<=.75:return basis('t1600','t1650',(t-.5)/.25)
 return basis('t1650','t1700',(t-.75)/.25)
def point(t,side,offset,height):
 p,tang,right=traj(t)
 return p+right*(side*offset)+Vector((0,height,0))
# Architectural objects in true world xyz, fully editable, not game actors.
citycol=bpy.data.collections.new('R3 ROAD CENTRED NEGATIVE SPACE PRIVATE ART HOLD')
s.collection.children.link(citycol)
def mat(name,col,metal=.3):
 m=bpy.data.materials.new('R3 '+name);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*col,1)
 bs.inputs['Metallic'].default_value=metal
 bs.inputs['Roughness'].default_value=.35
 m.diffuse_color=(*col,1)
 return m
civic=mat('pearl layered open public courtyards',(.68,.63,.48))
residential=mat('copper rose lived-in terraces',(.57,.28,.28),.35)
structure=mat('dark mineral structural branching',(.22,.32,.43),.4)
transit=mat('cyan raised public transport',(.06,.57,.69),.45)
park=mat('ecological public civic gardens',(.27,.45,.37),.2)
light=mat('pale open walkable circulation',(.69,.70,.63))
objs=[]
def solid(name,pa,pb,width,depth,material,role):
 a=vec(pa);b=vec(pb);along=b-a
 hor=Vector((along.x,0,along.z))
 if hor.length<.05: hor=Vector((1,0,0))
 hor.normalize()
 across=Vector((-hor.z,0,hor.x))
 vs=[]
 for p in (a,b):
  for side in (-1,1):
   for d in (-1,1):
    vs.append(p+across*(side*width/2)+Vector((0,d*depth/2,0)))
 fs=[(0,2,6,4),(1,5,7,3),(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6)]
 me=bpy.data.meshes.new(name);me.from_pydata([tuple(x) for x in vs],[],fs);me.update()
 ob=bpy.data.objects.new('R3 '+name,me)
 citycol.objects.link(ob);me.materials.append(material)
 ob['R3_ROLE']=role;ob['R3_NOT_NEW_GAME_COLLIDER']=True
 ob['R3_UNADOPTED']=True
 objs.append(ob);return ob
def route(name,pts,width,depth,material,role):
 for i in range(len(pts)-1):
  solid(name+' section '+str(i+1),pts[i],pts[i+1],width,depth,material,role)
# The central playable area stays truly empty: no facade/crosswalk under
# altitude +32 from the player at any place over the player trajectory.
# PUBLIC LEFT: stepped courtyard islands, edge railing and two forked
# circulation branches with a real gap between districts. Not one long slab.
route('01 civic outer plaza',
 [point(.08,-1,43,7),point(.17,-1,52,11),point(.25,-1,59,15)],10,2.1,civic,
 'PUBLIC_OPEN_FORUM_ONE')
route('02 civic inner cantilever',
 [point(.12,-1,35,10),point(.23,-1,41,17),point(.33,-1,50,18)],6,2.5,light,
 'PUBLIC_OPEN_CIRCULATION_BRANCH')
route('03 protected green split',
 [point(.33,-1,56,6),point(.44,-1,66,10),point(.52,-1,60,16)],10,2.1,park,
 'PUBLIC_GARDEN_ORGANIC_COURT')
route('04 civic upper viewing path',
 [point(.51,-1,48,19),point(.67,-1,58,27),point(.80,-1,48,18)],5,2,light,
 'PUBLIC_MULTILEVEL_WALK_NEEDS_ACCESS_QA')
# RIGHT: visually distinct inhabited tier with void-facing courtyards.
route('05 housing lower inhabited gallery',
 [point(.22,1,41,12),point(.34,1,48,15),point(.46,1,47,20)],13,5,residential,
 'RESIDENTIAL_LIVED_IN_GALLERY_LOWER')
route('06 housing upper stepped terrace',
 [point(.36,1,53,33),point(.53,1,54,39),point(.65,1,47,32)],10,7,residential,
 'RESIDENTIAL_UPPER_COURTYARD_INHABITED')
route('07 housing shifted second court',
 [point(.68,1,48,12),point(.84,1,58,19),point(.96,1,54,23)],12,6,residential,
 'RESIDENTIAL_DISCONTINUOUS_SECOND_COURT')
# Non-repeating load-bearing fork supports: slanted, physically substantial.
for i,t,side in ((1,.25,-1),(2,.55,-1),(3,.42,1),(4,.85,1)):
 base=point(t,side,53 if side<0 else 57,2)
 tip=point(t+.025,side,43 if side<0 else 48,28 if side<0 else 37)
 solid('08 structural diagonal root '+str(i),base,tip,4.8,6,structure,
  'ASYMMETRIC_LOAD_TRANSFER_NOT_STRUCTURALLY_CERTIFIED')
# One suspended diagonal rail exchange ABOVE road. The ball must never
# encounter a collision; TWO thin strands. This is NOT a gateway or wall.
for j,shift in enumerate((-1.3,1.3),1):
 railnodes=[point(.34,-1,48,36)+Vector((0,shift*.2,0)),
            point(.47,-1,19,43)+Vector((0,shift*.2,shift)),
            point(.57,1,18,47)+Vector((0,shift*.2,shift)),
            point(.70,1,49,42)+Vector((0,shift*.2,0))]
 route('09 diagonal high rail '+str(j),railnodes,.65,.45,transit,
  'ELEVATED_RAIL_VISUAL_NOT_NEW_GAME_ROAD')
# Separation of railway travellers and public users (no assumed stairs).
route('10 aerial pedestrian transfer',
 [point(.47,-1,36,31),point(.56,-1,16,39),point(.63,1,36,38)],
 4.1,1.7,light,'HIGH_PEDESTRIAN_TRANSFER_UNCERTIFIED')
# Original public CX contact: only an endpoint study, not a welded link.
c=contact['best']
assert c and c['preliminaryCandidate']
cxroot=vec(c['CXcontactWorldXYZ'])
orig=[o for o in cx if o.name==c['CX']]
assert len(orig)==1
cp,n,face,err=bvh(orig[0]).find_nearest(cxroot)
assert err<.025 and n.y>.65
cxroot=vec(cp)
# Connect near t17 *left off-road* civic edge to CX without overriding B48.
branch=point(.95,-1,41,2)
route('11 original CX civic pedestrian branch candidate',
 [branch,branch.lerp(cxroot+Vector((0,1,0)),.48),cxroot+Vector((0,1,0))],
 3.6,1.1,light,'ORIGINAL_CX_CONTACT_NOT_WELDED_ACCESS_UNCERTIFIED')
assert len(objs)>=26,len(objs)
assert signature()==frozen
# Static original collision geometry and 13 true source B51 animation samples.
roads=[(o,bvh(o)) for o in b48]
existing=[(o,bvh(o)) for o in cx]
new=[(o,bvh(o)) for o in objs]
b48hits=[];cxhits=[]
for a,at in new:
 for b,bt in roads:
  h=at.overlap(bt)
  if h:b48hits.append((a.name,b.name,len(h)))
 for b,bt in existing:
  h=at.overlap(bt)
  if h:cxhits.append((a.name,b.name,len(h)))
proxies=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
assert len(proxies)==28
moving={}
for i,f in enumerate(timeline['frames'],1):
 s.frame_set(i);bpy.context.view_layer.update()
 poses=[(o,bvh(o)) for o in proxies]
 hits=[]
 for a,at in new:
  for b,bt in poses:
   over=at.overlap(bt)
   if over:hits.append((a.name,b['R1_B51_ID'],len(over)))
 moving[f['id']]=hits
# Forward vision is an independent source of failure, not an automatic PASS.
targets={
 'leftCivic':point(.25,-1,46,18),
 'rightHousing':point(.48,1,49,31),
 'railCross':point(.55,1,0,44),
 'originalCx':cxroot
}
sight={}
shots=['t1400','t1450','t1500','t1550','t1600','t1650','t1700']
for f in timeline['frames']:
 if f['id'] not in shots:continue
 i=timeline['frames'].index(f)+1;s.frame_set(i)
 cam=cameras.objects.get(f['id']+' REAL ORIGINAL 240HZ')
 if not cam:cam=early.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam
 sight[f['id']]={}
 for name,loc in targets.items():
  v=world_to_camera_view(s,cam,loc)
  sight[f['id']][name]={
   'projected':[round(float(v.x),4),round(float(1-v.y),4)],
   'inFrame':bool(v.z>0 and 0<v.x<1 and 0<v.y<1),
   'occlusionUnmeasured':True}
# Mark collisions as design failure if ANY genuine source B48 tri intersections.
unsafe=len(b48hits)>0 or any(moving.values())
s.frame_start=1;s.frame_end=13;s.frame_set(1)
s['R3_CITY_NOT_GAME_WEBGL']=True;s['R3_NEW_GAME_COLLIDERS']=0
s['R3_ART']=s['R3_HUMAN']=s['R3_RELEASE']='HOLD'
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R3_'+road+'_ROAD_INTERNAL_AIR_DISTRICT_EDITABLE_NOT_ADOPTED.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
images=[]
for f in timeline['frames']:
 if f['id'] not in shots:continue
 i=timeline['frames'].index(f)+1
 s.frame_set(i)
 cam=cameras.objects.get(f['id']+' REAL ORIGINAL 240HZ')
 if not cam:cam=early.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 s.camera=cam
 img='R3_'+road+'_'+f['id']+'_ORIGINAL_CAMERA_CITY_HOLD.png'
 s.render.filepath=os.path.join(out,img);bpy.ops.render.render(write_still=True)
 images.append(img)
assert signature()==frozen
audit={
 'schema':'dopagaki.g4e7dz-r6d-r3-road-internal-private/1','road':road,
 'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceCX':18,'sourceB48':7,'sourceB51':28,'sourceCameras':5,'gap52':True,
 'sourceIdentityPreserved':True,'newCityMeshes':len(objs),
 'newRoles':{o.name:o['R3_ROLE'] for o in objs},
 'roadInternalNegativeSpaceHypothesis':'15_TO_17_SECONDS_NO_LOW_CROSSING_ART_ONLY',
 'mainRoadCentreTrajectoryUnmodified':True,
 'originalB48TriangleIntersections':b48hits,
 'originalCXTriangleIntersections':cxhits,
 'B51ThirteenSampleIntersections':moving,
 'sampledDesignClear':not unsafe,
 'all28ContinuousTimeMovingObstacleSafety':'NOT_PROVEN',
 'pedestrianWalkability':'NOT_CERTIFIED','transitPhysicalConnection':'NOT_CERTIFIED',
 'originalCXStructuralWeld':'NOT_CERTIFIED',
 'originalCameraProjectedTargets':sight,
 'genuineBlenderPngs':images,'editableBlender':blend,
 'newGameColliders':0,'newCityWebGL':'NOT_RENDERED','sourceGameChanged':False,
 'officialArt':0,'officialSlope2Metres':0,
 'TECH':'LIMITED_GEOMETRIC_INTERSECTION_EVIDENCE_ONLY',
 'ART':'HOLD_PENDING_INDEPENDENT_IMAGE_REVIEW',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R3_'+road+'_AUDIT.json'),'w',encoding='utf-8') as o:
 json.dump(audit,o,indent=2,ensure_ascii=False)
print('R3_ACTUAL_BLENDER_SOURCE_PROTECTED',road,
 'meshes',len(objs),'b48',len(b48hits),
 'b51_sampled',sum(len(x) for x in moving.values()),
 'cx_intersections',len(cxhits),'ART_PENDING')
