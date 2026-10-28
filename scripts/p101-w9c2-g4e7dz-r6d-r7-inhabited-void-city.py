# G4E-7DZ R6D-R7: one habitable negative-space research prototype.
# Original R1 240 Hz cameras, B48 physics and B51 pose data; private Blender ONLY.
# Every unit has a real floor/wall volume; the 3D courtyards have no caps.
# Original CX source meshes, camera, physical roads, gameplay and public are immutable.
import bpy, json, math, sys, os, statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):
 assert k in argv,k
 return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
native=json.load(open(arg('--native'),encoding='utf-8'))
hazards=json.load(open(arg('--hazards'),encoding='utf-8'))
contact=json.load(open(arg('--contact'),encoding='utf-8'))
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert hazards['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert contact['schema']=='dopagaki.g4e7dz-r5a-source-contact/1'
assert native['road']==hazards['road']==contact['road']==road
assert native['sourceCXBlob']==hazards['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert len(native['frames'])==13 and len(hazards['hazards'])==28
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
P=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(P),len(cams.objects),len(early.objects))==(18,7,28,28,5,8)
def signature():
 return (
 sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o['true_240hz_time']),tuple(round(float(x),4) for x in o.location)) for o in cams.objects))
before=signature()
frames={f['id']:f for f in native['frames']}
f17=frames['t1700'];eye=Vector(f17['eye'])
front=Vector(f17['front']);front.y=0;front.normalize()
right=front.cross(Vector((0,1,0))).normalized()
player=Vector(f17['playerPosition'])
def pt(u,v,h):
 return player+front*u+right*v+Vector((0,h,0))
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@x.co) for x in o.data.vertices],
  [tuple(poly.vertices) for poly in o.data.polygons],all_triangles=False)
protected=[('CX',o,bvh(o)) for o in CX]+[('B48',o,bvh(o)) for o in B48]
col=bpy.data.collections.new('R7 ONE TRUE INHABITED OPEN COURT CITY NOT GAME')
s.collection.children.link(col)
def mat(name,rgba,met=.24):
 m=bpy.data.materials.new('R7 '+name);m.use_nodes=True
 b=m.node_tree.nodes.get('Principled BSDF')
 b.inputs['Base Color'].default_value=(*rgba,1)
 b.inputs['Metallic'].default_value=met
 b.inputs['Roughness'].default_value=.48
 return m
m={
 'public':mat('warm occupied public galleries',(.74,.58,.43)),
 'residence':mat('residential copper skin',(.64,.33,.29)),
 'transit':mat('blue green transit concourse',(.16,.51,.58),.35),
 'structural':mat('compressed stone titanium skeleton',(.30,.37,.41),.40),
 'glass':mat('sky courts glazed inner face',(.27,.49,.53),.34),
 'garden':mat('elevated public ecological land',(.31,.51,.34)),
 'walk':mat('accessible public ramp study not certified',(.76,.72,.61))
}
new=[]
def box(name,u0,u1,v0,v1,y0,y1,material,role,zone):
 assert u1>u0 and v1>v0 and y1>y0,(name,u0,u1,v0,v1,y0,y1)
 vs=[pt(u,v,y) for u,v,y in
   ((u0,v0,y0),(u0,v1,y0),(u1,v1,y0),(u1,v0,y0),
    (u0,v0,y1),(u0,v1,y1),(u1,v1,y1),(u1,v0,y1))]
 faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 data=bpy.data.meshes.new('R7 '+name)
 data.from_pydata([tuple(x) for x in vs],[],faces);data.update()
 ob=bpy.data.objects.new('R7 '+name,data)
 col.objects.link(ob);data.materials.append(m[material])
 ob['R7_ZONE']=zone;ob['R7_ROLE']=role
 ob['R7_NOT_NEW_GAME_COLLIDER']=True;ob['R7_UNADOPTED']=True
 new.append(ob);return ob
def ramp(name,pa,pb,width,thickness,zone):
 a=Vector(pa);b=Vector(pb)
 v=b-a;horizontal=Vector((v.x,0,v.z))
 assert horizontal.length>1
 across=Vector((-horizontal.z,0,horizontal.x)).normalized()
 verts=[]
 for p in (a,b):
  for sign in (-1,1):
   for d in (0,-thickness):
    verts.append(p+across*(sign*width/2)+Vector((0,d,0)))
 faces=[(0,2,6,4),(1,5,7,3),(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6)]
 dat=bpy.data.meshes.new('R7 '+name)
 dat.from_pydata([tuple(v) for v in verts],[],faces);dat.update()
 ob=bpy.data.objects.new('R7 '+name,dat);col.objects.link(ob)
 dat.materials.append(m['walk']);ob['R7_ZONE']=zone
 ob['R7_ROLE']='REAL_SLOPED_PUBLIC_RAMP_WITH_LANDING_CONNECTION_STUDY'
 ob['R7_UNADOPTED']=True;ob['R7_NOT_NEW_GAME_COLLIDER']=True
 new.append(ob)
 distance=math.hypot(v.x,v.z)
 return abs(v.y)/distance
# Build ONE continuous three-bay inhabited city on each bank.
# Its characteristic visible architectural feature is 12 genuinely EMPTY
# 35x32m floor-to-sky courtyard shafts, with surrounding solid occupied 3D.
# The floors are closed perimeters, not endless facade walls or fake portal.
bays=[116,198,280]
zones=[]
voids=[]
for side,prog in ((-1,'public'),(1,'residence')):
 vcentre=side*109
 for seq,u in enumerate(bays,1):
  zone=('CIVIC_' if side<0 else 'LIVING_')+str(seq)
  zones.append(zone)
  uu0,uu1=u-32,u+32
  vv0,vv1=vcentre-39,vcentre+39
  # A 34 x 36 real void from floor y15 up to sky y140. No caps.
  inU0,inU1=u-17,u+17
  inV0,inV1=vcentre-18,vcentre+18
  voids.append({'zone':zone,'centerWorld':[round(float(x),3) for x in pt(u,vcentre,45)],
   'trueEmptyCoreMetres':[34,36,125],
   'voidName':'REAL_OPEN_SKY_3D_ATRIUM_NOT_EMPTY_LABEL'})
  for k,y in enumerate((16,38,60,82,104,126),1):
   if k==6 and seq==3:continue
   # ring is four real solids in each gallery, center empty at every level
   box(zone+' L'+str(k)+' front occupied deck',uu0,inU0,vv0,vv1,y,y+4,
       'public' if side<0 else 'residence','INHABITABLE_FRONT_GALLERY_TRUE_3D',zone)
   box(zone+' L'+str(k)+' rear occupied deck',inU1,uu1,vv0,vv1,y,y+4,
       'garden' if k in (2,4) else prog,'INHABITABLE_REAR_GALLERY_TRUE_3D',zone)
   box(zone+' L'+str(k)+' inner occupied arcade',inU0,inU1,vv0,inV0,y,y+4,
       'glass','INHABITABLE_COURTYARD_ARCADE_TRUE_3D',zone)
   box(zone+' L'+str(k)+' outer occupied arcade',inU0,inU1,inV1,vv1,y,y+4,
       'public' if side<0 else 'residence','INHABITABLE_OUTER_GALLERY_TRUE_3D',zone)
  # Load-bearing building corners; long continuous vertical mass anchored
  # into the building's actual floors without erecting a 100m opaque screen.
  for ci,(u0,v0) in enumerate(((uu0,vv0),(uu0,vv1-8),(uu1-8,vv0),(uu1-8,vv1-8)),1):
   height=132 if seq<3 else 110
   box(zone+' occupied vertical core '+str(ci),u0,u0+8,v0,v0+8,7,height,
    'structural','CONTINUOUS_VERTICAL_OCCUPIED_LOAD_PATH_STUDY',zone)
  # Each building gets an actual warm 3D dwelling module, open to inner court,
  # with backing solid rooms; not a facade billboard or painted stripe.
  for k,y in enumerate((45,89),1):
   box(zone+' inner habitat floor '+str(k),u-12,u+13,vcentre+side*24,
     vcentre+side*24+8 if side>0 else vcentre+side*24+8,y,y+3,prog,
     'ROOM_FLOOR_REAL_VOLUME',zone)
   box(zone+' inner habitat back '+str(k),u-12,u-9,vcentre+side*24,
     vcentre+side*24+8,y+3,y+14,'glass',
     'ROOM_BACK_WALL_REAL_VOLUME_WITH_OPEN_WINDOW',zone)
# CONNECTED human-scale movement along bank, not visually detached terraces.
links=[]
for side in (-1,1):
 zone='PUBLIC' if side<0 else 'LIVING'
 v=side*109
 for i in range(2):
  ua=bays[i]+32;ub=bays[i+1]-32
  assert ub-ua==18
  for y in (38,82):
   box(zone+' gallery interbay '+str(i)+' level '+str(y),
     ua,ub,v-19,v-7,y,y+3,'walk','HORIZONTAL_WALK_GALLERY_DIRECT_ENDPOINT',zone)
   links.append({'start':[ua,v-13,y],'end':[ub,v-13,y],
       'verticalDelta':0,'length':18,'level':y})
# Two explicit physically sloped access switchbacks, each 22m rise split
# across four flights: source pads and endpoints meet via 6m landings.
rampGrades=[]
for side in (-1,1):
 zone='PUBLIC' if side<0 else 'LIVING';u=bays[1]
 v=side*109+side*46
 for level in (16,38,60,82):
  for i in range(4):
   x0,x1=(u-29,u+29) if i%2==0 else (u+29,u-29)
   vhere=v+side*i*8
   y0=level+i*5.5;y1=level+(i+1)*5.5
   grade=ramp(zone+' level '+str(level)+' flight '+str(i),
     pt(x0,vhere,y0),pt(x1,vhere,y1),5,1.8,zone)
   assert grade<.11,grade
   rampGrades.append(grade)
   if i<3:
    box(zone+' level '+str(level)+' switchback landing '+str(i),
      min(x1-4,x1+4),max(x1-4,x1+4),
      min(vhere,vhere+side*8)-3,max(vhere,vhere+side*8)+3,
      y1-1.2,y1+1.2,'walk','CONTIGUOUS_SWITCHBACK_LANDING_STUDY',zone)
# Both banks have longitudinal public routes. Connect high transit and living
# programs WITHOUT constructing a huge low-slung road-crossing gateway.
# Rail stays in CIVIC bank, residential high galleries connect at same level
# in dedicated elevated, air-transparent crossing only above original road.
for u in (122,286):
 v0,v1=-109,109
 box('TRAM station CIVIC side '+str(u),u-10,u+17,-160,-126,96,101,
     'transit','RAIL_STATION_PLATFORM_REAL_VOLUME','TRANSIT')
 box('TRAM resident stop '+str(u),u-10,u+17,126,161,96,101,
     'transit','RAIL_STATION_PLATFORM_REAL_VOLUME','TRANSIT')
# Transit between civic stops within actual bank corridors.
box('TRAM urban backbone',105,302,-160,-153,101,105,
    'transit','LINEAR_TRAM_NETWORK_VISUAL_ONLY','TRANSIT')
# No "role name" equals a certified physical connected city: roads/path/units
# still require actual walking, load paths, exits and independent art review.
assert len(new)>200 and len(voids)==6 and len(rampGrades)==32
assert signature()==before
newTree=[(o,bvh(o)) for o in new]
roadTree=[(o,bvh(o)) for o in B48]
cxTree=[(o,bvh(o)) for o in CX]
roadHits=[];cxHits=[]
for o,t in newTree:
 for r,tr in roadTree:
  h=t.overlap(tr)
  if h:roadHits.append([o.name,r.name,len(h)])
 for r,tr in cxTree:
  h=t.overlap(tr)
  if h:cxHits.append([o.name,r.name,len(h)])
def bbox(o):
 vs=[o.matrix_world@x.co for x in o.data.vertices]
 return {'min':[min(p[i] for p in vs) for i in range(3)],
         'max':[max(p[i] for p in vs) for i in range(3)]}
def bboxHit(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
hzWarnings=[]
for ob in new:
 bb=bbox(ob)
 for h in hazards['hazards']:
  if h['sampledAabb'] and bboxHit(bb,h['sampledAabb']):
   hzWarnings.append([ob.name,h['id']])
# A real geometric empty-void test: vertically raycast from each 3D
# atrium centre, and independently require no R7 mesh caps for >100m.
actualVoidChecks=[]
for site in voids:
 origin=Vector(site['centerWorld'])
 hits=[]
 for ob,tr in newTree:
  hit,normal,poly,dist=tr.ray_cast(origin,Vector((0,1,0)),85)
  if hit is not None:
   hits.append([ob.name,round(float(dist),4)])
 actualVoidChecks.append({'zone':site['zone'],'upwardRayHits':hits,
   'realOpenSky85m':len(hits)==0})
# Do not call it an empty 3D atrium if the real mesh roof/bridge blocks the ray.
assert all(v['realOpenSky85m'] for v in actualVoidChecks),actualVoidChecks
movers={}
for fi,f in enumerate(native['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 active={x['id'] for x in f['moving'] if x['enabled']}
 mts=[(o,bvh(o)) for o in P if o['R1_B51_ID'] in active]
 hits=[]
 for o,tr in newTree:
  for mo,tm in mts:
   h=tr.overlap(tm)
   if h:hits.append([o.name,mo['R1_B51_ID'],len(h)])
 movers[f['id']]=hits
# 7 source cameras; real rays give first hit coverage, not vertex projection.
times=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
W,H=17,11;views={}
for id in times:
 f=frames[id];fi=native['frames'].index(f)+1
 s.frame_set(fi);bpy.context.view_layer.update()
 cam=cams.objects.get(id+' REAL ORIGINAL 240HZ')
 if cam is None:cam=early.objects.get('R1 '+id+' SOURCE CAMERA')
 assert cam
 e=Vector(f['eye']);forward=Vector(f['front']).normalized()
 r=forward.cross(Vector((0,1,0))).normalized()
 up=r.cross(forward).normalized()
 counts={'NEW_R7':0,'ORIGINAL_CX':0,'ORIGINAL_B48':0,'ORIGINAL_B51':0,'SKY':0}
 firstNames={}
 active={x['id'] for x in f['moving'] if x['enabled']}
 currentB51=[('B51',obj,bvh(obj)) for obj in P if obj['R1_B51_ID'] in active]
 rayCandidates=[('NEW_R7',ob,tr) for ob,tr in newTree]+protected+currentB51
 for j in range(H):
  for i in range(W):
   u=(i+.5)/W;v=(j+.5)/H
   ray=(forward+r*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   closest=(2000,'SKY','')
   for category,obj,tr in rayCandidates:
    hit,n,idx,d=tr.ray_cast(e,ray,closest[0])
    if hit is not None and d is not None and d<closest[0]:
     closest=(d,'ORIGINAL_CX' if category=='CX' else 'ORIGINAL_B48' if category=='B48' else 'ORIGINAL_B51' if category=='B51' else category,obj.name)
   counts[closest[1]]+=1
   if closest[1]=='NEW_R7':
    firstNames[closest[2]]=firstNames.get(closest[2],0)+1
 assert sum(counts.values())==W*H
 views[id]={'firstHitGrid':counts,
  'R7_fraction':round(counts['NEW_R7']/(W*H),4),
  'R7DistinctMeshesFirstHit':len(firstNames),
  'R7MainFirstHitMeshes':sorted(firstNames.items(),key=lambda q:-q[1])[:7],
  'trueOcclusionAwareCoarseRaycast':True,
  'humanFunctionLegibility':'NOT_CERTIFIED'}
assert signature()==before
s.frame_set(1)
s['R7_PRIVATE_RESEARCH_NOT_GAME']=True;s['R7_NEW_GAME_COLLIDERS']=0
s['R7_ART']=s['R7_HUMAN']=s['R7_RELEASE']='HOLD'
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R7_'+road+'_TRUE_HABITABLE_OPEN_COURTS_EDITABLE_UNADOPTED.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
png=[]
for id in times:
 f=frames[id];fi=native['frames'].index(f)+1;s.frame_set(fi)
 cam=cams.objects.get(id+' REAL ORIGINAL 240HZ')
 if cam is None:cam=early.objects.get('R1 '+id+' SOURCE CAMERA')
 s.camera=cam
 name='R7_'+road+'_'+id+'_ACTUAL_GAME_CAMERA_BLENDER_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,name)
 bpy.ops.render.render(write_still=True)
 png.append(name)
assert signature()==before
report={'schema':'dopagaki.g4e7dz-r6d-r7-true-volume-court-city/1','road':road,
 'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceCX':18,'sourceB48':7,'sourceB51':28,'sourceCameras':5,
 'sourceProtected':True,'gap52':True,
 'newEditableBlenderMeshes':len(new),
 'sourceWorldCourtBays':bays,'openRealSkyVoidProof':voids,
 'realWalkwayHorizontalGraphEdges':links,
 'realSourceMeshSkyVoidRayChecks':actualVoidChecks,
 'actual32SlopeSegments':len(rampGrades),'maxSegmentVerticalGrade':max(rampGrades),
 'unverifiedSwitchbackLandingContinuity':True,
 'sourceCivicCxAnchor':contact['best']['CXcontactWorldXYZ'] if contact['best'] else None,
 'physicalSourceCXHumanAccess':'NOT_CERTIFIED',
 'newR7ExactB48TriangleIntersections':roadHits,
 'newR7ExactCXTriangleIntersections':cxHits,
 'newR7All28B51_721TickConservativeAabbWarnings':hzWarnings,
 'newR7Actual13SourcePoseB51TriangleIntersections':movers,
 'sevenRealSourceCameraCoarseFirstHit':views,
 'continuousTimeCollisionSafety':'NOT_CERTIFIED',
 'cityTissueConnectedForHumanPlay':'NOT_CERTIFIED',
 'trueGameWebGL':'NOT_RENDERED','newGameColliders':0,'sourceGameChanged':False,
 'actualBlenderImages':png,'editableBlender':blend,
 'officialArt':0,'officialSlope2Meters':0,'TECH':'SOURCE_PROTECTION_ONLY',
 'ART':'HOLD_REQUIRES_INDEPENDENT_IMAGE_REVIEW',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R7_'+road+'_AUDIT.json'),'w',encoding='utf-8') as o:
 json.dump(report,o,indent=2,ensure_ascii=False)
print('R7_TRUE_SOURCE_INHABITED_COURTS',road,'meshes',len(new),
 'roadHits',len(roadHits),'cxHits',len(cxHits),'721TickHazardWarnings',len(hzWarnings),
 'realFrustumCoverage',[(k,views[k]['R7_fraction']) for k in times])
