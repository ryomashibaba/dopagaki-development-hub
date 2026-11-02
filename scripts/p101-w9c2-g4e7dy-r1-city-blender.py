# G4E-7DY R1 — REAL 3D INHABITED SKY-CUT / ROAD-THROUGHPASS EXPERIMENT.
# EDITABLE TRUE BLENDER MESHES. NOT native WebGL, not imported game colliders.
# DO/DR untouched CX18+B48x7+B51x28 and exact original native 240Hz cameras.
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def arg(k):return args[args.index(k)+1]
road=arg('--road');out=arg('--out')
os.makedirs(out,exist_ok=True)
assert road in ('true-pinch','pinch-switch')
data=json.load(open(arg('--site-report'),encoding='utf-8'))
assert data['schema']=='dopagaki.g4e7dy-r1-native-road-approach-city/1'
assert data['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert data['unchangedPhysics'] and data['newColliders']==0
area=data['roads'][road];stations=area['stations']
assert area['section']==1 and len(stations)==21
assert len(area['gates'])==5
assert area['visibility']['t1550']>=2 and area['visibility']['t1600']>=2
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
scene=bpy.context.scene
assert scene['DO_SCENE_IS_NOT_GAME_WEBGL'] is True
assert scene['DR_ACTUAL_B48_MESH_COUNT']==7
assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert scene['DR_ACTUAL_B48_VOID_CELL52'] is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
moving=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert len(cx)==18 and len(roads)==7 and len(moving)==28
assert cams is not None and len(cams.objects)==5
frozen_cx=sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx)
frozen_roads=sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads)
frozen_moving=sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in moving)

col=bpy.data.collections.new('DY R1 INHABITED METROPOLITAN SKYCUT / REAL 3D / UNADOPTED')
scene.collection.children.link(col)
def mat(n,c,metal=.16,rough=.55,emission=None):
 m=bpy.data.materials.new(n);m.use_nodes=True;m.diffuse_color=(*c,1)
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*c,1)
 bs.inputs['Roughness'].default_value=rough
 bs.inputs['Metallic'].default_value=metal
 if emission:
  bs.inputs['Emission Color'].default_value=(*emission,1)
  bs.inputs['Emission Strength'].default_value=.9
 return m
ivory=mat('DY civic limestone / luminous warm-grey',(.57,.69,.72),.3,.48)
shell=mat('DY transit concourse ceramic shell',(.28,.51,.57),.4,.39)
frame=mat('DY true structural fins warm platinum',(.62,.62,.55),.43,.48)
floor=mat('DY occupied ochre pedestrian floor',(.49,.38,.24),.2,.55)
habitat=mat('DY inhabited shadowed interiors',(.19,.34,.38),.18,.54)
garden=mat('DY blue-green community gardens',(.19,.40,.33),.02,.63)
glow=mat('DY inset activity lighting',(.67,.48,.32),.25,.42,(.85,.35,.12))
rail=mat('DY real transit wayfinding',(.21,.55,.68),.35,.30,(.08,.48,.72))
basalt=mat('DY deep inhabited structural roots',(.17,.25,.31),.32,.67)

def mesh(n,vs,faces,m,typ):
 objmesh=bpy.data.meshes.new('DY real mesh '+n)
 objmesh.from_pydata([tuple(p) for p in vs],[],faces)
 objmesh.update()
 ob=bpy.data.objects.new(n,objmesh)
 col.objects.link(ob);objmesh.materials.append(m)
 ob['DY_TYPE']=typ
 ob['DY_REAL_CITY_MESH']=True
 ob['DY_GAME_COLLIDER']=False
 ob['DY_ART_APPROVED']=False
 return ob

def p(i,side,off,height):
 s=stations[i]
 c=Vector(s['center'])
 e=Vector(s['left'] if side=='L' else s['right'])
 vec=e-c
 flat=Vector((vec.x,0,vec.z))
 assert flat.length>1
 flat.normalize()
 return e+flat*off+Vector((0,height,0))

def solid(n,foot,down,up,m,typ):
 # Thick faceted prism with a deliberately small footprint; never a flat billboard.
 vs=[Vector(v)+Vector((0,down,0)) for v in foot]
 vs +=[Vector(v)+Vector((0,up,0)) for v in foot]
 k=len(foot)
 faces=[tuple(range(k-1,-1,-1)),tuple(range(k,k*2))]
 for j in range(k):faces.append((j,(j+1)%k,(j+1)%k+k,j+k))
 return mesh(n,vs,faces,m,typ)

def deck(n,ia,ib,side,a,b,height,thickness,m):
 # A real 3D occupiable terrace, not a paper-thin roof VFX.
 q=[p(ia,side,a,height),p(ib,side,a,height),
    p(ib,side,b,height),p(ia,side,b,height)]
 return solid(n,q,-thickness,0,m,'HABITABLE_FLOOR_NOT_GAME_COLLIDER')

def girder(n,a,b,width,deep,m,typ):
 va=Vector(a);vb=Vector(b)
 axis=vb-va
 if axis.length<1:raise RuntimeError('DY degenerate built structural member')
 normal=axis.normalized()
 ref=Vector((0,1,0))
 if abs(normal.dot(ref))>.89:ref=Vector((1,0,0))
 side=normal.cross(ref).normalized()
 up=normal.cross(side).normalized()
 v=[]
 for q in (va,vb):
  for sy,sz in ((-1,-1),(1,-1),(1,1),(-1,1)):
   v.append(q+side*width*.5*sy+up*deep*.5*sz)
 return mesh(n,v,[(0,1,2,3),(4,7,6,5),(0,4,5,1),
                     (1,5,6,2),(2,6,7,3),(3,7,4,0)],m,typ)

# This section's running direction, road width and height are inherited from
# the ORIGINAL source B48. The wider open mid-region is intentionally civic.
# Left city: lower terraced public amphitheatre and occupied civic floors;
# deformations & asymmetry prevent the giant featureless-wall outcome (DX/DT).
# All road-side construction begins outside actual B48 by >=12m in local
# sampled cross-section; this is NOT sufficient proof of swept-volume clearance.
for idx,(ia,ib,a,b,h) in enumerate([
 (4,6,14,61,10),(6,8,16,68,13),
 (8,10,19,74,18),(10,12,18,65,25)
]):
 deck('DY LEFT active stepped civic court '+str(idx),ia,ib,'L',a,b,h,4.4,floor if idx%2==0 else garden)
# Thick side supports and open air split into true physical bays. No monolithic wall.
for i,(station,top,offset) in enumerate([(5,36,38),(8,41,44),(11,50,36)]):
 girder('DY LEFT geologically rooted terraced arch-foot '+str(i),
        p(station,'L',offset,-40),p(station,'L',offset-5,top),7.4,10.5,basalt,
        'ROOTED_STRUCTURAL_SUPPORT')
# Real urban program visible behind the open forecourt: occupied gallery decks
deck('DY LEFT human-scale library reading floor',6,8,'L',22,61,29,4.4,ivory)
deck('DY LEFT open upper reading hall',8,10,'L',28,68,39,4.7,habitat)
girder('DY LEFT civic deep structural sill',p(8,'L',67,20),p(10,'L',66,32),10,16,shell,'DEEP_EXTERIOR_MASS')
# A large actual public aperture, not windows pasted onto a solid elevation.
for i,h in [(7,28),(10,33)]:
 girder('DY LEFT exposed reading auditorium portal '+str(i),
        p(i,'L',58,-7),p(i,'L',60,h),7.2,9.5,frame,
        'OPEN_TO_STREET_HABITABLE_STRUCTURE')

# Right city: deliberately taller and offset from the left, a civic transit
# exchange rather than another residential box or duplicate crescent.
for idx,(ia,ib,inner,outer,height) in enumerate([
 (8,11,18,59,15),(11,14,22,73,29),
 (14,17,17,69,24),(17,19,22,52,39)
]):
 deck('DY RIGHT inhabited station interchange terrace '+str(idx),
      ia,ib,'R',inner,outer,height,5.3,habitat if idx==2 else ivory)
# Volumetric deep civic hall behind open rail frontage, deliberately irregular,
# with missing facade surface above the central atrium (actual open air).
for i,low,high in [(9,-45,49),(13,-51,74),(17,-37,57)]:
 a=p(i,'R',55,low);b=p(i,'R',59,high)
 girder('DY RIGHT service hall rooted load tower '+str(i),
        a,b,9.5,13,basalt,'THICK_CITY_FOUNDATION')
 girder('DY RIGHT atrium open-front public frame '+str(i),
        p(i,'R',23,15),p(i,'R',35,high),6,6,frame,
        'ATRIUM_VOID_BOUNDARY')
# True internal floors and activity zones visible from the central road
deck('DY RIGHT transit ticket hall deep through-air floor',11,13,'R',26,66,43,4.3,floor)
deck('DY RIGHT inhabited winter garden',13,15,'R',38,72,49,4.5,garden)
deck('DY RIGHT upper station rooms',16,18,'R',27,61,54,4.5,ivory)
girder('DY RIGHT inhabited canopy ONLY over right concourse',
        p(11,'R',54,61),p(17,'R',53,68),9.0,10.0,shell,
        'CIVIC_INHABITED_UPPER_SPINE_NOT_ROAD_ROOF')

# A single real elevated urban cross-link with structural function (not ribbons).
# Above the road by >55m, high above the 0.65m physical game ball.
# All roadway below remains OPEN and uses exclusively original B48 collision.
girder('DY ONCE-CROSSING high occupied public sky-concourse',
       p(13,'L',31,66),p(13,'R',31,66),12.0,7.5,ivory,
       'CROSS_ROAD_SKY_PUBLIC_GALLERY')
# Deep side entrance landings tie the sky gallery into buildings, not just ornament.
for side in ('L','R'):
 deck('DY sky-concourse inhabited landing '+side,12,14,side,28,49,64,6.2,floor)
# Roadward real 3D visible activity / lighting, far fewer than a facade atlas.
for side,i,j in [('L',8,10),('R',12,14),('R',17,19)]:
 girder('DY recessed ticket/reading interior civic light '+side+str(i),
        p(i,side,29,19),p(j,side,30,21),2.2,3.5,glow,'LOCAL_ACTIVITY_LIGHT')
for side,i,j in [('L',6,9),('R',11,15)]:
 girder('DY road-oriented public transit axis '+side+str(i),
        p(i,side,17,9),p(j,side,18,12),1.1,1.3,rail,'OCCUPIED_CITY_WAYFINDING')

assert len(col.objects)>20 and len(col.objects)<65
assert not any(o.type!='MESH' for o in col.objects)
assert frozen_cx==sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx)
assert frozen_roads==sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads)
assert frozen_moving==sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in moving)
assert len(cams.objects)==5

# Triangle-on-triangle overlap checks against all REAL source B48 road surfaces.
# This is not full swept-ball or moving-hazard safety validation.
dg=bpy.context.evaluated_depsgraph_get()
def exact_mesh_bvh(ob):
 verts=[tuple(ob.matrix_world @ v.co) for v in ob.data.vertices]
 faces=[tuple(poly.vertices) for poly in ob.data.polygons]
 return BVHTree.FromPolygons(verts,faces,all_triangles=False)
new_bvhs=[(o,exact_mesh_bvh(o)) for o in col.objects]
road_bvhs=[(o,exact_mesh_bvh(o)) for o in roads]
road_intersections=[]
for candidate,bvh in new_bvhs:
 for original,world_bvh in road_bvhs:
  overlaps=bvh.overlap(world_bvh)
  if overlaps:
   road_intersections.append({'new':candidate.name,'road':original.name,'trianglePairs':len(overlaps)})
moving_intersections={}
for f,shot in enumerate(('t1550','t1600','t1650','t1700'),start=2):
 scene.frame_set(f);bpy.context.view_layer.update()
 collisions=[]
 for mover in moving:
  mobvh=exact_mesh_bvh(mover)
  for candidate,bvh in new_bvhs:
   if bvh.overlap(mobvh):collisions.append([candidate.name,mover['SOURCE_ORIGINAL_B51_ID']])
 moving_intersections[shot]=collisions
# Do not claim a static road/moving obstruction check covers the full route.
scene['DY_REAL_B48_SOURCE_ROADS']=7
scene['DY_REAL_B51_SOURCE_MOVERS']=28
scene['DY_REAL_CX_SOURCE_MESHES']=18
scene['DY_REAL_GAME_COLLIDERS_ADDED']=0
scene['DY_REAL_SOURCE_GEOMETRY_EDITED']=False
scene['DY_ARCHITECTURE_MESH_COUNT']=len(col.objects)
scene['DY_B48_STATIC_MESH_OVERLAPS']=len(road_intersections)
scene['DY_SKY_VOID_NO_OPAQUE_ROAD_ROOF']=True
scene['DY_ORIGINAL_GAME_WEBGL_RENDERED']=False
scene['DY_ART']=scene['DY_HUMAN']=scene['DY_PUBLISH']='HOLD'

scene.cycles.device='CPU';scene.cycles.samples=3
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
scene.frame_set(1)
blend=os.path.join(out,'G4E7DY_R1_'+road+'_REAL3D_INTEGRATED_CITY_NONADOPTED.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
frames=[]
for f,shot in enumerate(('t1550','t1600','t1650','t1700'),start=2):
 scene.frame_set(f)
 camera=cams.objects.get(shot+' REAL ORIGINAL 240HZ')
 assert camera is not None
 scene.camera=camera
 bpy.context.view_layer.update()
 viewScores=[]
 for gate in area['gates']:
  world=Vector(gate['world'])
  pview=world_to_camera_view(scene,camera,world+Vector((0,16,0)))
  viewScores.append({'name':gate['name'],'screenX':float(pview.x),
   'screenY':float(1-pview.y),'depth':float(pview.z),
   'insideNominalCanvas':bool(pview.z>0 and 0<pview.x<1 and 0<pview.y<1),
   'occlusionNotDeterminedByProjection':True})
 scene.render.filepath=os.path.join(out,'G4E7DY_R1_'+road+'_'+shot+'_BLENDER_NOT_GAME_WEBGL.png')
 bpy.ops.render.render(write_still=True)
 frames.append({'shot':shot,'originalCameraName':camera.name,
  'originalCamera240HzTime':camera['true_240hz_time'],
  'roadAndBuildingsSameWorld':True,
  'nativeProjectionOfFutureCivicLocations':viewScores})
audit={'schema':'G4E7DY_R1_REAL_EDITABLE_CITY_WORLD_SPATIAL_RESEARCH/1','road':road,
 'study':'SKY CUT INHABITED CITY THROUGHPASS / NOT APPROVED',
 'sourceRoad':area['sourceSurface'],
 'realWindowMeters':data['lengthMetres'],
 'originalCX':len(cx),'originalB48':len(roads),'originalMovingB51':len(moving),
 'originalCameraObjects':len(cams.objects),'actual3DArchitecturalMeshes':len(col.objects),
 'architecturalRoles':{x:sum(1 for o in col.objects if o['DY_TYPE']==x)
                       for x in sorted({o['DY_TYPE'] for o in col.objects})},
 'actualOpenAirCivicVoid':True,'oneElevatedCrossCityPublicGallery':True,
 'trueSourceB48OverlapRecords':road_intersections,
 'sourceB51MovingOverlapRecordsAtOriginal240HzShots':moving_intersections,
 'roadOrMovingObstructionFullyCertified':False,
 'originalCXHashes':frozen_cx,'originalB48Hashes':frozen_roads,
 'newGameColliders':0,'originalGamePhysicsChanged':False,
 'actuallyRenderedNative240HzBlenderShots':frames,
 'actualGameWebGL':'NOT_RENDERED','humanPlay':'NOT_RUN',
 'art':'HOLD','human':'HOLD','ready':'HOLD','publish':'HOLD','merge':'HOLD',
 'formalSlope2Meters':0,'artAdoptionCount':0}
with open(os.path.join(out,'G4E7DY_R1_'+road+'_TRUE_CITY_ART_AUDIT.json'),'w') as f:json.dump(audit,f,indent=2)
print('DY_R1_ACTUAL_BLENDER_3D_CITY_UNADOPTED',json.dumps({
 'road':road,'meshes':len(col.objects),'frames':len(frames),
 'roadTriangleOverlaps':len(road_intersections),
 'movingObbOverlapCounts':{k:len(v) for k,v in moving_intersections.items()},
 'art':'HOLD','realWebGL':'NOT_RENDERED'}))
