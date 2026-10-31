# G4E-7DZ R6D-R6 — PRIVATE complete coarse 3D city-world blockout, NOT game art.
# Architecture FIRST as connected, inhabited 550m district with actual hollow courts.
# R2 roadside island, R3 props, R5 three isolated points: DO NOT REVIVE.
# No existing physical/visual game asset is mutated.
import bpy,sys,os,math,json,statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
a=sys.argv[sys.argv.index('--')+1:]
def req(key): assert key in a,key;return a[a.index(key)+1]
road=req('--road');assert road in ('true-pinch','pinch-switch')
out=req('--out');os.makedirs(out,exist_ok=True)
native=json.load(open(req('--native'),encoding='utf-8'))
hazards=json.load(open(req('--hazards'),encoding='utf-8'))
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert hazards['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert native['road']==hazards['road']==road
assert native['sourceCXBlob']==hazards['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert len(native['frames'])==13 and len(hazards['hazards'])==28 and hazards['frames721']==721
bpy.ops.wm.open_mainfile(filepath=req('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[x for x in bpy.data.objects if x.get('game_world_xyz_unmodified')]
B48=[x for x in bpy.data.objects if x.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[x for x in bpy.data.objects if x.get('SOURCE_ORIGINAL_B51_ID')]
proxies=[x for x in bpy.data.objects if x.get('R1_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(proxies),len(cams.objects),len(early.objects))==(18,7,28,28,5,8)
def frozen():
 return {'cx':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 'road':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 'moving':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 'cam':sorted((o.name,float(o['true_240hz_time']),tuple(round(v,4) for v in o.location)) for o in cams.objects)}
prev=frozen()
FR={f['id']:f for f in native['frames']}
def to_id(t):return 't'+str(round(t*100)).zfill(4)
def frame(t):
 assert 11<=t<=17
 v=max(11,min(16.5,math.floor(t*2)/2))
 i=to_id(v);j=to_id(v+.5);w=(t-v)*2
 return FR[i],FR[j],w
def path(t):
 f,g,w=frame(t)
 p=Vector(f['playerPosition']).lerp(Vector(g['playerPosition']),w)
 tangent=Vector(g['playerPosition'])-Vector(f['playerPosition'])
 tangent.y=0;assert tangent.length>20;tangent.normalize()
 lateral=Vector((-tangent.z,0,tangent.x))
 return p,tangent,lateral
def loc(t,lateral_offset,along_offset,up):
 p,f,r=path(t)
 return p+f*along_offset+r*lateral_offset+Vector((0,up,0))
# True world-city districts are 2.5 km^2 concepts, not 3 scattered poles.
# Each individually sculpted region is a 120m-ish urban mass with a REAL
# 50-75m-wide open sky atrium, separate near/far inhabited facades, and
# vertically distinct civic/rail/residential levels. Six large tissue zones
# integrate visually along the 11-17s original true ball trajectory.
districts=[
 {'id':'A','t':11.75,'side':-1,'lateral':151,'scale':1.04,'height':248,'function':'CIVIC','flip':1},
 {'id':'B','t':12.65,'side':1,'lateral':150,'scale':1.18,'height':326,'function':'HOUSING','flip':-1},
 {'id':'C','t':13.65,'side':-1,'lateral':142,'scale':1.17,'height':288,'function':'TRANSIT','flip':-1},
 {'id':'D','t':14.65,'side':1,'lateral':146,'scale':1.04,'height':296,'function':'CIVIC','flip':1},
 {'id':'E','t':15.65,'side':-1,'lateral':139,'scale':1.13,'height':343,'function':'HOUSING','flip':-1},
 {'id':'F','t':16.70,'side':1,'lateral':151,'scale':1.13,'height':287,'function':'TRANSIT','flip':1}
]
col=bpy.data.collections.new('R6 UNADOPTED WHOLE URBAN WORLD MASS VOID AND TRANSIT')
s.collection.children.link(col)
def mat(name,base,metal=.2,rough=.42):
 m=bpy.data.materials.new('R6 '+name);m.use_nodes=True
 b=m.node_tree.nodes.get('Principled BSDF')
 b.inputs['Base Color'].default_value=(*base,1)
 b.inputs['Metallic'].default_value=metal;b.inputs['Roughness'].default_value=rough
 return m
materials={
 'CIVIC':mat('warm glazed public life',(.75,.62,.43),.21),
 'HOUSING':mat('copper inhabited terraces',(.67,.34,.27),.24),
 'TRANSIT':mat('turquoise monumental station',(.15,.58,.61),.33),
 'FRAME':mat('sculpted titanium mineral structural',(.30,.39,.47),.43),
 'GLASS':mat('glazed inhabited inner facades',(.20,.43,.54),.48),
 'PLAZA':mat('public plazas and high terraces',(.71,.72,.64)),
 'GARDEN':mat('vertical civic gardens',(.22,.44,.32))
}
objects=[]
def geom(name,verts,faces,ma,role,district):
 mesh=bpy.data.meshes.new('R6 '+name);mesh.from_pydata([tuple(v) for v in verts],[],faces)
 mesh.update();assert mesh.polygons
 ob=bpy.data.objects.new('R6 '+name,mesh);col.objects.link(ob)
 mesh.materials.append(ma)
 ob['R6_ROLE']=role;ob['R6_ZONE']=district
 ob['R6_UNADOPTED']=True;ob['R6_NEW_GAME_COLLIDER']=False
 objects.append(ob);return ob
def closed_loft(name,profiles,ma,role,district):
 # Each profile is a tilted quadrilateral with actual structural thickness.
 # Different profiles permit non-parallel, non-box canyon/skyline cuts.
 verts=[v for quad in profiles for v in quad]
 n=4;faces=[]
 for i in range(len(profiles)-1):
  for j in range(n):
   k=i*n+j;q=i*n+(j+1)%n
   faces.append((k,q,q+n,k+n))
 faces.append((3,2,1,0));faces.append(tuple((len(profiles)-1)*n+j for j in range(4)))
 return geom(name,verts,faces,ma,role,district)
def mass(zone,name,t0,t1,y0,y1,offset0,offset1,width0,width1,material,role,twist=0):
 # A hollow-zone member spans forward direction only; the VOID is NOT capped.
 profiles=[]
 for t,y,width,off,lean in ((t0,y0,width0,offset0,0),
                             (t1,y1,width1,offset1,twist)):
  centre=loc(t,off,lean,y)
  f=path(t)[1];r=path(t)[2]
  hx=max(6,(t1-t0)*48)
  profiles.append([centre+f*hx+r*(-width/2),centre+f*hx+r*(width/2),
                   centre-f*hx+r*(width/2),centre-f*hx+r*(-width/2)])
 # Member is a sloped closed volume: NOT zero thickness in Y, because
 # a third displaced profile creates a solid with actual vertical depth.
 ma=material
 up_profiles=[]
 for t,y,width,off,lean in ((t0,y0,width0,offset0,0),
                             (t1,y1,width1,offset1,twist)):
  centre=loc(t,off,lean,y+8)
  f=path(t)[1];r=path(t)[2];hx=max(6,(t1-t0)*48)
  up_profiles.append([centre+f*hx+r*(-width/2),centre+f*hx+r*(width/2),
                   centre-f*hx+r*(width/2),centre-f*hx+r*(-width/2)])
 # use only paired rectangle profiles along vertical, no superposed distant caps
 # (one object for each slab/skin).
 ob=closed_loft(zone+' '+name,profiles+list(reversed(up_profiles)),ma,role,zone)
 return ob
# Sculpted massive city face: per district columns with 40-80m gap between
# inner and outer occupied frames; tiered terraces at y+35/95/155m.
# Heights are 200-340m; the true open atria remain empty at all elevations.
for z in districts:
 key=z['id'];t=z['t'];sg=z['side'];off=sg*z['lateral'];scale=z['scale']
 role=z['function'];w=18*scale;h=z['height']
 # broad structural legs, far from physical road, and long sectional cuts
 for j,(dt,delt,top) in enumerate(((-.17,-11,h*.81),(.16,16,h)),1):
  mass(key,'asymmetric inhabited cliff '+str(j),
   t+dt-.09,t+dt+.09,8,top,
   off+sg*delt,off+sg*(delt+z['flip']*15),w,w*1.35,materials['FRAME'],
   role+'_MASSIVE_SHELTER_WITH_REAL_OPEN_CANYON',twist=z['flip']*21)
 # vertically stacked public life is NOT a floating flat city roof:
 # each separate storey becomes a thick polygonal segment supporting a real void.
 for j,(y,shift,span) in enumerate(((35,-7,.18),(76,15,.25),(127,-15,.20)),1):
  mass(key,'inhabited floor '+str(j),
   t-span,t+span,y,y+9,off+sg*(shift-11),off+sg*(shift+11),
   22*scale,32*scale,materials[role],
   role+'_HABITABLE_LEVEL_HOLLOW_COURT',twist=z['flip']*8)
 # One high-level bridge joins the two cliff limbs, but NEVER closes road space.
 mass(key,'sky-void upper diagonal lip',t-.18,t+.18,h*.55,h*.61,
  off+sg*4,off-sg*8,18*scale,21*scale,materials['GLASS'],
  role+'_SKY_ATRIUM_LIP',twist=-z['flip']*10)
 # actually colored green shared common at the outer rim, separate entrance from street
 mass(key,'garden and public air ledge',t-.15,t+.12,22,31,
   off+sg*35,off+sg*47,18,23,materials['GARDEN'],
   role+'_PUBLIC_GARDEN_COMMON_SPACE',twist=10)
 # very high sculptural split spire, not repeating towers, offset towards outer skyline
 mass(key,'split outer skyline buttress',t+.04,t+.15,h*.55,h,
   off+sg*51,off+sg*66,16,9,materials['FRAME'],
   role+'_DISTANT_VERTICAL_LANDMARK',twist=z['flip']*16)
# actual, distinct orbital urban distribution over the entire curve:
# occupied civic, housing and transit sides are connected by a raised transit
# infrastructure on both flanks; passage over road stays high (>= 175m).
def girder(name,pa,pb,width,depth,role,material):
 a=Vector(pa);b=Vector(pb)
 line=b-a;horizontal=Vector((line.x,0,line.z))
 if horizontal.length<.1:horizontal=Vector((1,0,0))
 horizontal.normalize();across=Vector((-horizontal.z,0,horizontal.x))
 profiles=[]
 for p in (a,b):
  x=width/2;y=depth/2
  profiles.append([p+across*x+Vector((0,y,0)),
     p-across*x+Vector((0,y,0)),
     p-across*x-Vector((0,y,0)),
     p+across*x-Vector((0,y,0))])
 return closed_loft(name,profiles,material,role,'NETWORK')
# A legible high transit spine through adjacent districts, NOT 3 stand-alone monuments.
for i in range(len(districts)-1):
 aa=districts[i];bb=districts[i+1]
 start=loc(aa['t'],aa['side']*(aa['lateral']+12),0,170)
 end=loc(bb['t'],bb['side']*(bb['lateral']+12),0,170)
 # city rail crosses route at high altitude; no physical game collider is created.
 mid=loc((aa['t']+bb['t'])/2,0,0,214+i%2*11)
 for track,delta in enumerate((-3,3),1):
  v=Vector((0,delta,0))
  girder('district transit '+aa['id']+bb['id']+' track'+str(track)+' 1',start+v,mid+v,1.7,1.8,
    'PUBLIC_RAIL_NETWORK_SPAN_NOT_GAME_ROAD',materials['TRANSIT'])
  girder('district transit '+aa['id']+bb['id']+' track'+str(track)+' 2',mid+v,end+v,1.7,1.8,
    'PUBLIC_RAIL_NETWORK_SPAN_NOT_GAME_ROAD',materials['TRANSIT'])
 # inhabited evacuation/transfer bridge distinct from train
 girder('high pedestrian transfer '+aa['id']+bb['id'],start+Vector((0,12,0)),
 end+Vector((0,13,0)),4.0,4.6,'PEDESTRIAN_NETWORK_TOPOLOGICAL_NOT_ACCESS_CERTIFIED',
 materials['PLAZA'])
# One non-overpromised CX interface: no claim of actual walkability/weld.
# Public city is attached to a real existing city in intention, not physics.
contact=json.load(open(req('--contact'),encoding='utf-8'))
assert contact['road']==road and contact['schema']=='dopagaki.g4e7dz-r5a-source-contact/1'
cp=contact['best'];assert cp and cp['preliminaryCandidate']
near=[o for o in CX if o.name==cp['CX']];assert len(near)==1
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
closest,n,idx,err=bvh(near[0]).find_nearest(Vector(cp['CXcontactWorldXYZ']))
assert err<.025 and n.y>.65
# Do NOT create a long roadside floor as an alleged access corridor.
# Mark only the chosen source anchor in audit; network human link remains HOLD.
cx_anchor=[round(x,4) for x in closest]
assert len(objects)>70,len(objects)
assert prev==frozen()
# No rig/ground/road assets touched. True triangle intersection with B48/CX.
city=[(ob,bvh(ob)) for ob in objects]
roads=[(ob,bvh(ob)) for ob in B48]
original_city=[(ob,bvh(ob)) for ob in CX]
bad_road=[];cx_overlap=[]
for o,bo in city:
 for r,br in roads:
  hit=bo.overlap(br)
  if hit:bad_road.append([o.name,r.name,len(hit)])
 for r,br in original_city:
  hit=bo.overlap(br)
  if hit:cx_overlap.append([o.name,r.name,len(hit)])
# Real 721tick envelopes of 28 individual source B51 moving obstacles.
def bounds(ob):
 v=[ob.matrix_world@p.co for p in ob.data.vertices]
 return {'min':[min(q[i] for q in v) for i in range(3)],
         'max':[max(q[i] for q in v) for i in range(3)]}
def intersects(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
danger=[]
for o in objects:
 aabb=bounds(o)
 for h in hazards['hazards']:
  if h['sampledAabb'] and intersects(aabb,h['sampledAabb']):
   danger.append([o.name,h['id']])
moving={}
for fi,f in enumerate(native['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 active={x['id'] for x in f['moving'] if x['enabled']}
 mover=[(m,bvh(m)) for m in proxies if m['R1_B51_ID'] in active]
 hits=[]
 for ob,bo in city:
  for m,bm in mover:
   h=bo.overlap(bm)
   if h:hits.append([ob.name,m['R1_B51_ID'],len(h)])
 moving[f['id']]=hits
# Seven genuine 11-17s reference native eye cameras. A visible vertex does
# not prove rendered area, correct occlusion, human recognition or gameplay.
times=['t1100','t1200','t1300','t1400','t1500','t1600','t1700']
views={}
for t in times:
 f=FR[t];fi=native['frames'].index(f)+1
 s.frame_set(fi)
 cam=cams.objects.get(t+' REAL ORIGINAL 240HZ')
 if cam is None:cam=early.objects.get('R1 '+t+' SOURCE CAMERA')
 assert cam
 cnt=0
 roles={}
 for ob in objects:
  projected=[world_to_camera_view(s,cam,ob.matrix_world@v.co) for v in ob.data.vertices]
  if any(x.z>0 and 0<x.x<1 and 0<x.y<1 for x in projected):
   cnt+=1;roles[ob['R6_ROLE']]=roles.get(ob['R6_ROLE'],0)+1
 views[t]={'potentialVertexMeshCount':cnt,'rolesWithProjectedVertexCount':roles,
  'occlusionAndHumanExperience':'NOT_TESTED'}
assert prev==frozen()
s.frame_set(1)
s['R6_PRIVATE_UNADOPTED_FULL_WORLD_MASSING']=True
s['R6_NEW_CITY_MESH_COUNT']=len(objects)
s['R6_NEW_GAME_COLLIDER']=0;s['R6_GAME_WEBGL']='NOT_RENDERED'
s['R6_ART']=s['R6_HUMAN']=s['R6_RELEASE']='HOLD'
s.cycles.device='CPU';s.cycles.samples=3;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R6_'+road+'_WHOLE_WORLD_COARSE_CITY_EDITABLE_UNADOPTED.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
imgs=[]
for t in times:
 f=FR[t];fi=native['frames'].index(f)+1;s.frame_set(fi)
 cam=cams.objects.get(t+' REAL ORIGINAL 240HZ')
 if cam is None:cam=early.objects.get('R1 '+t+' SOURCE CAMERA')
 s.camera=cam
 file='R6_'+road+'_'+t+'_REAL_ORIGINAL_CAMERA_CITY_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,file)
 bpy.ops.render.render(write_still=True)
 imgs.append(file)
assert prev==frozen()
audit={
 'schema':'dopagaki.g4e7dz-r6d-r6-world-mass-void-network/1','road':road,
 'originalCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'CX':18,'B48':7,'B51':28,'originalCameras':5,'gap52':True,
 'sourceIdentityUnchanged':True,'realWorldDistricts':districts,
 'newEditableWorldMassMeshes':len(objects),
 'allNewFunctions':{o.name:o['R6_ROLE'] for o in objects},
 'existingCxContactPointSourceOnly':cx_anchor,
 'originalB48TriangleOverlaps':bad_road,'originalCXTriangleOverlaps':cx_overlap,
 'movingB51ThirteenActualSampleTriangleOverlaps':moving,
 'all28B51_721TickSampledAabbCandidateWarnings':danger,
 'allMovingContinuousTimeSafe':'NOT_CERTIFIED',
 'sourceCameraProjectionNotLegibility':views,
 'physicalHumanContinuity':'NOT_CERTIFIED',
 'functionalTransitNetwork':'TOPOLOGICAL_VISUAL_STUDY_NOT_GAMEPLAY_CERTIFIED',
 'trueGameWebGL':'NOT_RENDERED','newGameColliders':0,'sourceGameChanged':False,
 'genuineBlenderImages':imgs,'editableBlender':blend,
 'officialArt':0,'officialSlope2Meters':0,
 'TECH':'ORIGINAL_SOURCE_PROTECTED_LIMITED_INTERSECTION_ONLY',
 'ART':'HOLD_PENDING_REAL_IMAGE_REVIEW',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R6_'+road+'_AUDIT.json'),'w',encoding='utf8') as f:
 json.dump(audit,f,ensure_ascii=False,indent=2)
print('R6_GENUINE_WORLD_CITY_NOT_GAME',road,'meshes',len(objects),
 'roadhits',len(bad_road),'hazardAABB',len(danger),
 'B51_thirteen',sum(map(len,moving.values())),'CXhits',len(cx_overlap))
