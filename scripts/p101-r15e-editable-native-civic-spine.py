"""R15E genuine Blender 3D transport-spine visual probe from R15D's original
two-road B48/CX/B51 12m-safe swept A* corridor. PRIVATE EDITABLE ART HOLD.

Not finished city, not a walkable public street, not actual supported bridge,
not source game collider, not genuine WebGL. A visual read test only.
"""
import bpy,sys,json,os,math,statistics,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view
args=sys.argv[sys.argv.index('--')+1:]
def arg(k):
 assert k in args,k
 return args[args.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
d=json.load(open(arg('--r15d'),encoding='utf8'))
native=json.load(open(arg('--native'),encoding='utf8'))
haz=json.load(open(arg('--hazards'),encoding='utf8'))
assert d['schema']=='dopagaki.r15d-two-original-world-nonstraight-conservative-swept-a-star/1'
assert d['sourceCXBlob']==SOURCE
assert d['allTwoRoadConservativeSourceSweptRoutesFound']==8
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert haz['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert native['road']==haz['road']==road
assert native['sourceCXBlob']==haz['sourceCXBlob']==SOURCE
assert len(native['frames'])==13 and len(haz['hazards'])==28
selected={}
for q in d['researchWorldNonStraightDetours4CandidatePairs']:
 if q['volumeWidthMetres']==12 and q['pair'] in ('E_M1','M1_M2','M2_L'):
  assert q['conservativeSWEPT_OriginalWorldSafeRouteExists']
  assert len(q['routeWorldXYZ'])>=5 and len(q['trueConservativeSweptProofEachEdge'])==len(q['routeWorldXYZ'])-1
  assert all(z['sourceTwoRoadsRealSweptAABB']['true-pinch']['safe'] and
             z['sourceTwoRoadsRealSweptAABB']['pinch-switch']['safe']
             for z in q['trueConservativeSweptProofEachEdge'])
  selected[q['pair']]=q
assert len(selected)==3
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_VOID_CELL52']
assert s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
MOV=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(MOV),len(cams.objects),len(early.objects))==(18,7,28,28,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
  sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
  sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
  sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
before=signature()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
protected=[('CX',x,tree(x)) for x in CX]+[('B48',x,tree(x)) for x in B48]
coll=bpy.data.collections.new('R15E 12M SOURCE SAFE 3D CIVIC WAY / PRIVATE ART HOLD')
s.collection.children.link(coll)
def mat(name,color,metal=0.2,emission=0):
 m=bpy.data.materials.new('R15E '+name)
 m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*color,1)
 p.inputs['Metallic'].default_value=metal
 p.inputs['Roughness'].default_value=.44
 if emission:
  p.inputs['Emission Color'].default_value=(*color,1)
  p.inputs['Emission Strength'].default_value=emission
 return m
materials={
 'floor':mat('translucent ceramic ivory',(.82,.74,.58),.36),
 'structure':mat('sculpted dark basalt',(.15,.22,.28),.28),
 'copper':mat('warm copper civic bulkhead',(.58,.33,.2),.48),
 'light':mat('low-noise turquoise light',(.23,.72,.78),.24,.75),
 'garden':mat('living midstructure hanging garden',(.24,.44,.28)),
 'glass':mat('satin azurite glass',(.27,.44,.56),.52)}
created=[]
def mesh(name,verts,faces,material,role):
 obdata=bpy.data.meshes.new('R15E '+name)
 obdata.from_pydata([tuple(p) for p in verts],[],faces)
 obdata.update()
 ob=bpy.data.objects.new('R15E '+name,obdata)
 coll.objects.link(ob)
 obdata.materials.append(materials[material])
 ob['R15E_ROLE']=role
 ob['R15E_SOURCE_ROADS_SHARED_WORLD']=True
 ob['R15E_GAME_COLLIDER']=False
 ob['R15E_ART']='HOLD'
 created.append(ob)
 return ob
def cube(name,p0,p1,rad,material,role):
 # Bounded by conservative swept source AABB of 12m corridor edge,
 # with smaller (<=5m) cross-section. No mesh outside original clearance.
 a=Vector(p0);b=Vector(p1)
 mn=[min(a[i],b[i])-rad for i in range(3)]
 mx=[max(a[i],b[i])+rad for i in range(3)]
 vertices=[Vector((x,y,z)) for y in (mn[1],mx[1]) for x,z in
  ((mn[0],mn[2]),(mn[0],mx[2]),(mx[0],mx[2]),(mx[0],mn[2]))]
 face=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7),(3,0,4,7)]
 return mesh(name,vertices,face,material,role)
def segment_side(a,b):
 q=b-a
 lateral=Vector((-q.z,0,q.x))
 if lateral.length<.001:return Vector((1,0,0))
 return lateral.normalized()
def ribbon(name,points,left,right,below,above,material,role):
 # Only closes a ribbon with genuine thickness; no "flat art sheet".
 vertices=[]
 for i,p in enumerate(points):
  if i==0:t=points[1]-points[0]
  elif i==len(points)-1:t=points[-1]-points[-2]
  else:t=points[i+1]-points[i-1]
  lateral=segment_side(Vector((0,0,0)),t)
  vertices.extend([p+lateral*left+Vector((0,below,0)),
   p+lateral*right+Vector((0,below,0)),
   p+lateral*right+Vector((0,above,0)),
   p+lateral*left+Vector((0,above,0))])
 faces=[(3,2,1,0),
   (4*(len(points)-1),4*(len(points)-1)+1,4*(len(points)-1)+2,4*(len(points)-1)+3)]
 for i in range(len(points)-1):
  for j in range(4):
   k=(j+1)%4
   faces.append((4*i+j,4*i+k,4*(i+1)+k,4*(i+1)+j))
 return mesh(name,vertices,faces,material,role)
# Three NONIDENTICAL programmatic districts. One uninterrupted directional
# geometry with open sky, variable left/right margins, two-layer civic way,
# and multi-height asymmetric sculpted parapets. Not tiled arches/facades.
for name,(floor,asym,roofseq) in {
 'E_M1':('floor',2.5,(0,)),
 'M1_M2':('copper',1.3,(1,)),
 'M2_L':('floor',3.5,(2,))}.items():
 q=selected[name]
 P=[Vector(p) for p in q['routeWorldXYZ']]
 assert len(P)>=5
 ribbon(name+' true full-length usable-width floor research',P,-3.5,3.5,-3.6,-3.1,
        floor,'SOURCE_SAFE_CONTIGUOUS_FLOOR_MESH_NOT_LOAD_TESTED')
 # A long non-symmetrical open valley. Floor left and right are not identical,
 # giving genuinely different hierarchy and semi-open internal void.
 ribbon(name+' earthfold left side plinth',P,-5.0,-4.45,-3.6,.1,'structure',
        'REAL_THICK_CARVED_SIDE_VOLUME_NOT_WALKABLE_CERTIFIED')
 ribbon(name+' inhabited right gallery parapet',P,4.38,4.95,-3.5,1.65,'copper',
        'PRIVATE_GALLERY_BULKHEAD_NOT_ACTUAL_RESIDENTIAL_INGRESS')
 ribbon(name+' side-lit directional public edge',P,-4.42,-4.18,-2.1,-1.8,'light',
        'RESEARCH_R15E_LIGHT_STRIP')
 if name=='M1_M2':
  # Noncontinuous terraced overhang, retains airy negative space
  p=P[1:-1]
  ribbon(name+' spatial void overlooking upper layer',p,3.65,4.56,2.0,2.6,'glass',
    'OPEN_SKY_RIDGE_NOT_CLOSED_WALL')
 if name=='M2_L':
  p=P[2:9] if len(P)>9 else P[1:-1]
  ribbon(name+' living garden top',p,-4.95,-4.55,1.6,2.1,'garden',
    'GREEN_VIEW_RESEARCH_NOT_INHABITABLE_COURT')
assert len(created)==14,(len(created),[o.name for o in created])
# Geometry must not pierce original physics. Compare triangles not just
# source AABB; original route proof also validates 12m swept envelopes.
intersection=[]
for ob in created:
 tr=tree(ob)
 for kind,original,ot in protected:
  overlaps=tr.overlap(ot)
  if overlaps:intersection.append([ob.name,kind,original.name,len(overlaps)])
assert not intersection,intersection
# Conservative self-sufficient bbox check for EACH new vertex: a vertex
# must lie within at least ONE *source proven 12m swept edge*; a road's
# source proof is from both original road variants.
proofboxes=[]
for q in selected.values():
 for edge in zip(q['routeWorldXYZ'],q['routeWorldXYZ'][1:]):
  a,b=[Vector(v) for v in edge]
  proofboxes.append((
   [min(a[i],b[i])-6.001 for i in range(3)],
   [max(a[i],b[i])+6.001 for i in range(3)]))
def inbounds(p,bb):
 lo,hi=bb
 return all(lo[i]<=p[i]<=hi[i] for i in range(3))
escaped=[]
for o in created:
 for v in o.data.vertices:
  xyz=o.matrix_world@v.co
  if not any(inbounds(xyz,bb) for bb in proofboxes):
   escaped.append((o.name,tuple(xyz)))
assert not escaped,(len(escaped),escaped[:5])
assert signature()==before
# SOURCE CAMERA VIEWS. 228 rays each 13 frame. This is not WebGL pixels.
fps={}
for fi,f in enumerate(native['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 cam=cams.objects.get(f['id']+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 front=Vector(f['front']).normalized()
 right=front.cross(Vector((0,1,0))).normalized()
 up=right.cross(front).normalized()
 live=[tree(x) for x in MOV if x['R1_B51_ID'] in {m['id'] for m in f['moving'] if m['enabled']}]
 world=[('R15E',o,tree(o)) for o in created]+protected+[('B51',x,tree(x)) for x in MOV if x['R1_B51_ID'] in {m['id'] for m in f['moving'] if m['enabled']}]
 counts=collections.Counter()
 citytype=collections.Counter()
 for y in range(12):
  for x in range(19):
   u=(x+.5)/19;v=(y+.5)/12
   direction=(front+right*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   hit=(2500.,'SKY',None)
   for kind,obj,t in world:
    q,n,i,d=t.ray_cast(cam.location,direction,hit[0])
    if q is not None and d is not None and d<hit[0]:hit=(d,kind,obj)
   counts[hit[1]]+=1
   if hit[1]=='R15E':citytype[hit[2]['R15E_ROLE']]+=1
 fps[f['id']]={'sourceFrameOriginalCameraFirstHitsOutOf228':dict(counts),
  'sourceResearchCityFirstHitFraction':round(counts['R15E']/228,5),
  'originalSourceResearchGeomVisibleRoles':dict(citytype),
  'trueBrowserWebGL':False}
assert signature()==before
s['R15E_RESEARCH_CITY_NOT_GAME_ASSET']=True
s['R15E_SOURCE_BOTH_ROADS_CX_B48_TRIANGLES_UNCHANGED']=True
s['R15E_NEW_GAME_COLLIDERS']=0
s['R15E_PRIVATE_ART']='HOLD_VISUAL_COMPARISON_REQUIRED'
s['R15E_REAL_FLOOR_SUPPORT']='NOT_VERIFIED'
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
blend='R15E_'+road+'_PRIVATE_EDITABLE_REAL_NATIVE_SOURCE_STREET_ART_HOLD.blend'
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
rendered=[]
for t in ('t1100','t1200','t1300','t1400','t1500','t1600','t1700'):
 fi=next(i for i,f in enumerate(native['frames'],1) if f['id']==t)
 s.frame_set(fi)
 cam=cams.objects.get(t+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+t+' SOURCE CAMERA')
 s.camera=cam
 file='R15E_'+road+'_'+t+'_REAL_BLENDER_SOURCE_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,file)
 bpy.ops.render.render(write_still=True)
 rendered.append(file)
assert signature()==before
audit={
 'schema':'dopagaki.r15e-real-source-twelve-metre-civic-spine-first-blender/1',
 'road':road,'originalGameSourceBlob':SOURCE,'originalR1SourceFrameCount':13,
 'originalCX18B48_7B51_28FiveCamerasUnchanged':True,
 'R15D12mSameWorldSourceSweptBackboneUsed':True,
 'R15DOriginalRoutePairs':['E_M1','M1_M2','M2_L'],
 'genuinePrivateBlenderMeshes':len(created),'joinedCivicRouteResearchMetres':round(
  sum(x['sourceRouteLengthMetres'] for x in selected.values()),3),
 'originalPhysicalTriangleIntersectionPairs':intersection,
 'allNewMeshVerticesWithinRealTwoRoadConservative12mSweptProof':len(escaped)==0,
 'allOriginal13CameraResearchFirstHit':fps,
 'sourceOriginalCameraSevenTrueBlenderImages':rendered,
 'privateEditableBlend':blend,
 'sourceB51ContinuousTimePhysicsAlreadyCertified':False,
 'actualSourceGameWebGLRendered':False,
 'humanGameCivicFloorWalkableCertified':False,
 'realSourceLandscapeLoadBearingAndIngressCertified':False,
 'genuineMonumentalFutureCityArtApproved':False,
 'originalSourceGameChanged':False,'newGameColliders':0,
 'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
 'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R15E_'+road+'_SOURCE_EDITABLE_VISUAL_AND_GEOMETRY_AUDIT.json'),'w',encoding='utf8') as f:
 json.dump(audit,f,ensure_ascii=False,indent=2)
print('R15E_TRUE_R1_CIVIC_3D',road,'meshes',len(created),
 'SourceCXB48Intersections',len(intersection),'all vertex conservative contained',len(escaped)==0,
 'seven original camera new-geometry-firstHits',
 [(k,fps[k]['sourceResearchCityFirstHitFraction']) for k in ('t1100','t1200','t1300','t1400','t1500','t1600','t1700')],
 'ART HOLD')
