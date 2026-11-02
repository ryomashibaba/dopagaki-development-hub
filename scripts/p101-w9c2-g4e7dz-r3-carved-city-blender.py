# G4E-7DZ R3 - PRIVATE real Blender test: inhabitable through-city socket.
# Read-only source DR .blend with original CX18 / B48x7 / B51x28 /
# camera 5. No game change, no new game collider, no ART or human certification.
# Geometry is deliberately a single prototype, not 3 candidates disguised as art.
import bpy,sys,os,json,math
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def argument(k):
 if k not in argv:raise ValueError('Required argument '+k)
 return argv[argv.index(k)+1]
road=argument('--road')
assert road in ('true-pinch','pinch-switch')
out=argument('--out');os.makedirs(out,exist_ok=True)
report=json.load(open(argument('--site-report'),encoding='utf-8'))
assert report['schema']=='dopagaki.g4e7dy-r1-native-road-approach-city/1'
assert report['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert report['originalB48']==7 and report['originalB51']==28
assert report['gap52'] is True and report['unchangedPhysics'] is True
assert report['newColliders']==0
stations=report['roads'][road]['stations']
assert len(stations)==21
bpy.ops.wm.open_mainfile(filepath=argument('--source'))
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
assert cams and len(cams.objects)==5
frozen={
 'cx':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 'road':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 'moving':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in moving)
}
collection=bpy.data.collections.new('R3 ACTUAL DEPTH CITY THROUGH-PASS / PRIVATE ART HOLD')
scene.collection.children.link(collection)
def material(name,color,rough=.48,metal=.2,emit=None):
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*color,1)
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*color,1)
 bs.inputs['Roughness'].default_value=rough
 bs.inputs['Metallic'].default_value=metal
 if emit:
  bs.inputs['Emission Color'].default_value=(*emit,1)
  bs.inputs['Emission Strength'].default_value=.8
 return m
outside=material('R3 warm silver stone / root mass',(.46,.60,.64),.54,.23)
inside=material('R3 dark recessed inhabited depth',(.16,.30,.34),.58,.14)
plaza=material('R3 true public-use paving',(.52,.43,.32),.65,.08)
transit=material('R3 rapid rail electrical ceramic',(.18,.57,.65),.43,.4,(.05,.30,.4))
home=material('R3 warm human activity floor',(.64,.58,.42),.62,.12)
vegetation=material('R3 rooftop commons vegetation',(.16,.42,.32),.75,.01)
structure=material('R3 load-bearing off-axis support',(.35,.42,.47),.57,.32)
def point(i,side,offset,height):
 c=Vector(stations[i]['center'])
 e=Vector(stations[i]['left' if side=='L' else 'right'])
 flat=e-c;flat.y=0
 if flat.length<1:raise ValueError('Road edge degenerate at '+str(i))
 flat.normalize()
 return e+flat*offset+Vector((0,height,0))
def mesh(name,verts,faces,mat,role):
 datab=bpy.data.meshes.new('R3 ACTUAL 3D '+name)
 datab.from_pydata([tuple(Vector(x)) for x in verts],[],faces)
 datab.update()
 o=bpy.data.objects.new(name,datab)
 collection.objects.link(o);datab.materials.append(mat)
 o['R3_ROLE']=role;o['R3_ART_APPROVED']=False
 o['R3_GAME_COLLIDER']=False
 o['R3_ACTUAL_EDITABLE_MESH']=True
 return o
def block(name,corners,down,up,mat,role):
 n=len(corners)
 assert n>=3
 v=[Vector(q)+Vector((0,down,0)) for q in corners]
 v += [Vector(q)+Vector((0,up,0)) for q in corners]
 faces=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]
 faces += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
 return mesh(name,v,faces,mat,role)
def occupied(name,ia,ib,side,near,far,height,depth,mat,role):
 return block(name,[point(ia,side,near,height),
  point(ib,side,near,height),point(ib,side,far,height),
  point(ia,side,far,height)],-depth,0,mat,role)
def column(name,lower,upper,width,depth,mat,role):
 a,b=Vector(lower),Vector(upper);axis=b-a
 assert axis.length>1
 direction=axis.normalized()
 ref=Vector((0,1,0)) if abs(direction.y)<.89 else Vector((1,0,0))
 side=direction.cross(ref).normalized()
 up=direction.cross(side).normalized()
 v=[]
 for p in (a,b):
  for x,y in ((-1,-1),(1,-1),(1,1),(-1,1)):
   v.append(p+x*side*width/2+y*up*depth/2)
 return mesh(name,v,[(0,1,2,3),(4,7,6,5),(0,4,5,1),
  (1,5,6,2),(2,6,7,3),(3,7,4,0)],mat,role)
def aperture(name,side,ia,ib,offset,width,low,high,inner_low,inner_high,depth,mat,role):
 # Exactly one connected VOLUMETRIC annular surface; genuine open center:
 # NO opaque triangle is ever placed across the internal entrance.
 # Intervening bay is longitudinal (along B48), not a flat image billboard.
 assert ib-ia>=4 and high-inner_high>5 and inner_low-low>5
 assert 0<width<ib-ia
 i0=ia+width;i1=ib-width
 assert i1>i0
 outer=[point(ia,side,offset,low),point(ib,side,offset,low),
        point(ib,side,offset,high),point(ia,side,offset,high)]
 inner=[point(i0,side,offset,inner_low),point(i1,side,offset,inner_low),
        point(i1,side,offset,inner_high),point(i0,side,offset,inner_high)]
 # A ring repeated outward from original road, with actual air volume inside.
 outer_back=[point(ia,side,offset+depth,low),point(ib,side,offset+depth,low),
        point(ib,side,offset+depth,high),point(ia,side,offset+depth,high)]
 inner_back=[point(i0,side,offset+depth,inner_low),point(i1,side,offset+depth,inner_low),
        point(i1,side,offset+depth,inner_high),point(i0,side,offset+depth,inner_high)]
 v=outer+inner+outer_back+inner_back
 faces=[]
 for i in range(4):
  j=(i+1)%4
  faces += [(i,j,4+j,4+i),(8+j,8+i,12+i,12+j),
   (i,8+i,8+j,j),(4+j,12+j,12+i,4+i)]
 o=mesh(name,v,faces,mat,role)
 o['R3_REAL_OPENING']=True
 o['R3_HOLE_AREA_PROXY_M2']=(inner_high-inner_low)*(i1-i0)*18
 return o
# A REAL LEFT CIVIC CAVITY. The rear floor is 38-80 m beyond the visible
# opening, providing genuine fore/mid/back parallax instead of a single wall.
left=aperture('R3 LEFT deeply pierced public inlet','L',7,15,27,1,-30,72,4,57,17,outside,'HOLLOW_CIVIC_STRUCTURE')
occupied('R3 LEFT civic inner forum walkable court',9,14,'L',47,84,7,3,plaza,'INTERIOR_PUBLIC_WALKABLE_FLOOR')
occupied('R3 LEFT elevated inhabited library inner floor',11,14,'L',62,82,30,3,home,'INTERIOR_OCCUPIED_HOUSING_FLOOR')
occupied('R3 LEFT inner winter garden',10,13,'L',72,91,45,3,vegetation,'PUBLIC_GARDEN_WITHIN_HOLE')
# Structurally supported rooms are deep INSIDE, not rows of free-floating desks.
for ia in (10,14):
 column('R3 LEFT rooted rear support '+str(ia),
  point(ia,'L',79,-29),point(ia,'L',79,54),7.5,9.5,structure,'FOUNDATION_TO_UPPER_OCCUPIED_FLOOR')
# Internal pedestrian link from lower public court to upper quarters:
# Traversable gradient, not a painted annotation. Not a proven code/pathing navmesh.
occupied('R3 LEFT multi-level inhabited ramp lower',9,11,'L',69,76,14,3,plaza,'REAL_MULTI_LEVEL_CIRCULATION')
column('R3 LEFT library diagonal lifting walkway',
 point(11,'L',70,14),point(13,'L',79,30),9,3,plaza,'REAL_ELEVATED_HUMAN_CIRCULATION')
# RIGHT transit void is spatially different: staggered entrance, distinctly
# lower station inner way and higher residential terraces. No mirrored gimmick.
right=aperture('R3 RIGHT open station cut in deep civic volume','R',10,18,37,1,-34,88,0,68,19,structure,'HOLLOW_TRANSPORT_STRUCTURE')
occupied('R3 RIGHT deep passenger concourse',12,17,'R',58,98,9,3,transit,'REAL_TRANSIT_PASSENGER_PLATFORM')
occupied('R3 RIGHT inhabited upper quiet terrace',13,17,'R',70,101,39,4,home,'REAL_OCCUPIED_UPPER_FLOOR')
occupied('R3 RIGHT inhabited rear commons',14,17,'R',84,108,60,3.5,vegetation,'COMMONS_BETWEEN_TRANSIT_AND_HOUSING')
for i in (12,17):
 column('R3 RIGHT deeply rooted platform support '+str(i),
  point(i,'R',94,-32),point(i,'R',94,69),8.5,9,structure,'ROOTED_STATION_STRUCTURE')
# Rail guide physically seated on the transit platform (not a decorative
# roof ribbon floating in the original roadway).
for off in (76,79):
 column('R3 RIGHT real rail edge '+str(off),
  point(12,'R',off,11),point(17,'R',off,13),1.4,1.7,transit,'ACTUAL_RAIL_CORRIDOR_WITH_PLATFORM')
# One slender and OBLIQUE service transfer linking the two city quarters,
# visibly high above native roadway. This is not an unsafe/fake road surface.
column('R3 single sky-crossing structural diagonal',
 point(14,'L',80,71),point(16,'R',83,80),6.2,5.4,structure,'HIGH_ABOVE_GAME_ROAD_CIVIC_TRANSFER')
# Side-to-side roots of crossing connect to occupied floor, avoid floating sky bridge.
column('R3 left transfer backstay',point(14,'L',80,25),point(14,'L',80,71),6.5,6.5,structure,'SUPPORTED_TRANSFER')
column('R3 right transfer backstay',point(16,'R',83,37),point(16,'R',83,80),6.5,6.5,structure,'SUPPORTED_TRANSFER')
assert 18<=len(collection.objects)<=30
assert sum(bool(o.get('R3_REAL_OPENING')) for o in collection.objects)==2
assert frozen['cx']==sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx)
assert frozen['road']==sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads)
assert frozen['moving']==sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in moving)
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world @ v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
new_bvh=[(ob,bvh(ob)) for ob in collection.objects]
source_bvh=[(ob,bvh(ob)) for ob in roads]
static=[]
for obj,mesh_bvh in new_bvh:
 for existing,original in source_bvh:
  pairs=mesh_bvh.overlap(original)
  if pairs:static.append({'new':obj.name,'sourceRoad':existing.name,'pairs':len(pairs)})
moving_hits={}
for frame,shot in enumerate(('t1550','t1600','t1650','t1700'),2):
 scene.frame_set(frame);bpy.context.view_layer.update()
 hits=[]
 for mover in moving:
  mbvh=bvh(mover)
  for obj,mesh_bvh in new_bvh:
   if mesh_bvh.overlap(mbvh):hits.append([obj.name,mover['SOURCE_ORIGINAL_B51_ID']])
 moving_hits[shot]=hits
# Clear 3D depth is more important than the on-screen area alone.
# Native-camera rays to the actual interiors include SOURCE city, B48,
# and all NEW modeled mass; record if an earlier surface blocks each target.
targets={
 'left_public_interior':point(12,'L',69,10),
 'left_habitation':point(13,'L',71,32),
 'right_rail_concourse':point(15,'R',83,15),
 'right_inhabited':point(15,'R',88,43)
}
occluders=[(o,bvh(o)) for o in [*cx,*roads,*collection.objects]]
visibility={}
for frame,shot in enumerate(('t1550','t1600','t1650','t1700'),2):
 scene.frame_set(frame);bpy.context.view_layer.update()
 cam=cams.objects.get(shot+' REAL ORIGINAL 240HZ')
 assert cam is not None
 origin=cam.matrix_world.translation.copy()
 results={}
 for name,target in targets.items():
  proj=world_to_camera_view(scene,cam,target)
  diff=target-origin;distance=diff.length
  if distance<2:continue
  direction=diff.normalized()
  nearest=None
  for ob,mesh_bvh in occluders:
   hit,normal,index,dist=mesh_bvh.ray_cast(origin,direction,distance-1.25)
   if hit is not None and dist is not None and (nearest is None or dist<nearest['distance']):
    nearest={'object':ob.name,'distance':round(float(dist),3)}
  results[name]={'screen':[round(float(proj.x),4),round(float(1-proj.y),4)],
    'cameraFront':proj.z>0,'withinCanvas':bool(proj.z>0 and 0<proj.x<1 and 0<proj.y<1),
    'unobstructedRayToPoint':nearest is None,'firstOccluder':nearest,
    'noHumanGameplayInference':True}
 visibility[shot]=results
scene['R3_ACTUAL_B48']=7;scene['R3_ACTUAL_B51']=28;scene['R3_CX']=18
scene['R3_NEW_GAME_COLLIDERS']=0
scene['R3_GAME_SOURCE_UNTOUCHED']=True
scene['R3_GENUINE_HOLES']=2
scene['R3_NEW_REAL_BLENDER_MESHES']=len(collection.objects)
scene['R3_ART']='HOLD';scene['R3_HUMAN']='HOLD'
scene.cycles.device='CPU'
scene.cycles.samples=6
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
scene.frame_set(1)
blend=os.path.join(out,'G4E7DZ_R3_'+road+'_ACTUAL_CARVED_CITY_PRIVATE_UNADOPTED.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
rendered=[]
for frame,shot in enumerate(('t1550','t1600','t1650','t1700'),2):
 scene.frame_set(frame)
 cam=cams.objects.get(shot+' REAL ORIGINAL 240HZ')
 assert cam is not None
 scene.camera=cam
 bpy.context.view_layer.update()
 dest=os.path.join(out,'G4E7DZ_R3_'+road+'_'+shot+'_REAL_BLENDER_NOT_WEBGL.png')
 scene.render.filepath=dest
 bpy.ops.render.render(write_still=True)
 rendered.append({'shot':shot,'camera':cam.name,'source240HzTime':cam['true_240hz_time'],'path':os.path.basename(dest)})
audit={'schema':'dopagaki.g4e7dz-r3-real-deep-city-blender/1',
 'road':road,'originalCX':len(cx),'originalB48':len(roads),
 'originalB51':len(moving),'originalNativeCameras':len(cams.objects),
 'frozenCXSourceSHA256':frozen['cx'],'frozenB48SourceSHA256':frozen['road'],
 'actualEditableNewMeshes':len(collection.objects),
 'genuineMeshApertures':sum(bool(o.get('R3_REAL_OPENING')) for o in collection.objects),
 'sourceRoadTriangleIntersections':static,'B51AtFourOriginalFramesIntersections':moving_hits,
 'actualNativeCameraDepthAndRayAudits':visibility,
 'realRenderedBlenderFrames':rendered,'newGameColliders':0,
 'sourcePhysicsChanged':False,'continuousTimeSafety':'NOT_TESTED',
 'actualNewCityWebGL':'NOT_RENDERED','humanPlay':'NOT_RUN','performance':'NOT_TESTED',
 'art':'HOLD','artAdoptionCount':0,'officialSlope2Meters':0,'publish':'HOLD','merge':'HOLD'}
with open(os.path.join(out,'G4E7DZ_R3_'+road+'_REAL3D_AUDIT.json'),'w') as f:
 json.dump(audit,f,indent=2)
print('DZ_R3_REAL_3D_UNADOPTED',json.dumps({'road':road,
 'meshes':len(collection.objects),'apertures':audit['genuineMeshApertures'],
 'sourceRoadIntersections':len(static),
 'B51FourFrames':{s:len(v) for s,v in moving_hits.items()},
 'interiorRayViews':{s:sum(v['withinCanvas'] and v['unobstructedRayToPoint'] for v in x.values()) for s,x in visibility.items()},
 'art':'HOLD','newGameWebGL':'NOT_RENDERED'}))
