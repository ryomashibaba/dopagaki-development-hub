# G4E-7DZ R6D-R2 ONE private falsifiable city: POROUS CONFLUENCE.
# A three-dimensional asymmetric, inhabited void anchored to original CX,
# not a wall, giant portal, repeated column city, or road-aligned slab.
# Never write to game assets, cameras, physics, collisions, or production.
import bpy, json, math, os, sys
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index('--')+1:]
def arg(flag):
 assert flag in argv,flag
 return argv[argv.index(flag)+1]
road=arg('--road')
assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
contact=json.load(open(arg('--contact'),encoding='utf-8'))
timeline=json.load(open(arg('--timeline'),encoding='utf-8'))
assert contact['schema']=='dopagaki.g4e7dz-r5a-source-contact/1'
assert timeline['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert contact['road']==timeline['road']==road
assert timeline['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert (contact['sourceCX'],contact['originalB48'],contact['originalB51'],contact['originalCameras'])==(18,7,28,5)
assert contact['best'] and contact['best']['preliminaryCandidate']
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert scene.get('DR_ACTUAL_B48_MESH_COUNT')==7
assert scene.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert scene.get('DR_ACTUAL_B48_VOID_CELL52') is True
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
protected_cameras=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
r1c=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(protected_cameras.objects),len(r1c.objects))==(18,7,28,5,8)
def source_signature():
 return {
  'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
  'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
  'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
  'camera':sorted((o.name,float(o['true_240hz_time']),tuple(round(x,4) for x in o.location)) for o in protected_cameras.objects)
 }
before=source_signature()
def tree(obj):
 return BVHTree.FromPolygons([tuple(obj.matrix_world @ v.co) for v in obj.data.vertices],
      [tuple(p.vertices) for p in obj.data.polygons],all_triangles=False)
anchor=Vector(contact['best']['CXcontactWorldXYZ'])
outside=Vector(contact['best']['proposedOutsideRoadPointXYZ'])
reference=[o for o in CX if o.name==contact['best']['CX']]
assert len(reference)==1
nearest,normal,index,err=tree(reference[0]).find_nearest(anchor)
assert err<.025 and normal.y>.65,(err,normal)
anchor=Vector(nearest)
away=anchor-outside;away.y=0
assert away.length>2
away.normalize()
side=Vector((-away.z,0,away.x))
# A compact, intentionally off-road, CX-rooted courtyard. The ball never uses it.
centre=anchor+away*39+Vector((0,8,0))
col=bpy.data.collections.new('R2 PRIVATE POROUS CONFLUENCE / UNADOPTED')
scene.collection.children.link(col)
def material(name,color,metal=.2):
 m=bpy.data.materials.new('R2 '+name);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*color,1)
 bs.inputs['Metallic'].default_value=metal
 bs.inputs['Roughness'].default_value=.52
 m.diffuse_color=(*color,1)
 return m
stone=material('split mineral load-bearing structure',(.29,.41,.50))
public=material('light mineral inhabitable public court',(.68,.64,.47))
housing=material('warm inhabited volumes',(.51,.36,.31))
rail=material('turquoise rail route',(.10,.51,.60),.38)
shadow=material('deep void and transit enclosure',(.15,.23,.33))
support=material('primary support transfer',(.50,.53,.52))
garden=material('public garden inset',(.28,.49,.37))
objects=[]
def geom(name,points,faces,mat,role):
 m=bpy.data.meshes.new('R2 '+name)
 m.from_pydata([tuple(p) for p in points],[],faces);m.update()
 assert len(m.polygons)>0
 obj=bpy.data.objects.new('R2 '+name,m);col.objects.link(obj)
 m.materials.append(mat)
 obj['R2_ROLE']=role;obj['R2_UNADOPTED']=True;obj['R2_NEW_GAME_COLLIDER']=False
 objects.append(obj)
 return obj
def local(x,y,z):
 return centre+away*x+side*z+Vector((0,y,0))
def sector(name,r0,r1,a0,a1,y0,y1,mat,role,n=22):
 # A true thick curved polygonal architectural volume, NOT a flat painted patch.
 points=[]
 for k in range(n+1):
  a=a0+(a1-a0)*k/n
  for rad,vert in ((r0,y0),(r1,y0),(r0,y1),(r1,y1)):
   points.append(local(rad*math.cos(a),vert,rad*math.sin(a)))
 faces=[]
 for k in range(n):
  i=4*k;j=i+4
  faces.extend(((i,i+1,j+1,j),(i+2,j+2,j+3,i+3),
   (i,j,j+2,i+2),(i+1,i+3,j+3,j+1)))
 faces.extend(((0,2,3,1),(4*n,4*n+1,4*n+3,4*n+2)))
 return geom(name,points,faces,mat,role)
def tapered(name,a,b,wa,wb,depth,ma,role):
 # Closed, tapered bearing spine with a real vertical thickness.
 tangent=b-a;tangent.y=0
 assert tangent.length>1
 across=Vector((-tangent.z,0,tangent.x)).normalized()
 vertices=[]
 for point,width in ((a,wa),(b,wb)):
  for side_sign in (-1,1):
   for offset in (-depth/2,depth/2):
    vertices.append(point+across*side_sign*width/2+Vector((0,offset,0)))
 faces=[(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6),(0,2,6,4),(1,5,7,3)]
 return geom(name,vertices,faces,ma,role)
def tube(name,pts,width,ma,role):
 # Open linear transit core presented as a true solid rail volume.
 for j in range(len(pts)-1):
  tapered(name+' span'+str(j),pts[j],pts[j+1],width,width,.35,ma,role)
# Local y is relative to center.y, so near CX floor is y=-8.
# Three unequal horseshoe-like districts surround a clear central air void.
sector('01 civic split courtyard',19,34,math.radians(113),math.radians(244),-5,-1,public,
 'CIVIC_OPEN_FORUM_AND_PEDESTRIAN_LEVEL')
sector('02 transit concourse west',22,30,math.radians(245),math.radians(332),1,5,shadow,
 'STATION_CONCOURSE_ENCLOSURE')
sector('03 transit concourse upper',27,36,math.radians(15),math.radians(80),9,13,rail,
 'TRANSIT_MULTILEVEL_GALLERY')
sector('04 inhabited terrace lower',28,41,math.radians(-24),math.radians(42),-3,2,housing,
 'RESIDENTIAL_COURTYARD')
sector('05 inhabited terrace upper',35,47,math.radians(5),math.radians(67),10,15,housing,
 'RESIDENTIAL_UPPER_DECK')
sector('06 garden observation in civic cavity',21,31,math.radians(85),math.radians(122),-3,-1,garden,
 'PUBLIC_GARDEN_COURT')
# No central cap: the air void (radius 19m) is intentionally truly empty.
# Real attachment candidate at unchanged CX floor, with fork supporting city
# rather than a shallow single R5B road-access slab.
p0=anchor+Vector((0,.9,0))
p1=local(-24,-3.3,0)
p2=local(-26,-1.3,-16)
p3=local(-22,0,17)
tapered('07 primary bifurcating CX root',p0,p1,5.5,7.5,5.0,support,
 'CX_ROOTED_BEARING_APPROXIMATION_NOT_WELDED')
tapered('08 first public branch',p1,p2,7.5,5.2,3.4,support,
 'CIVIC_WALKING_AND_LOAD_BRANCH')
tapered('09 second public branch',p1,p3,7.5,4.5,3.2,support,
 'CIVIC_WALKING_AND_LOAD_BRANCH')
# Distinct elevated circulation, joining upper public and transit quarters.
tapered('10 vertical interlevel passenger transfer',local(-18,-3,-19),local(-16,10,-27),
  4.0,5.2,4.2,stone,'PASSENGER_LEVEL_CHANGE_STUDY_NOT_ACCESS_CERTIFIED')
tapered('11 transit-to-residence passage',local(25,11,19),local(31,13,29),
  5.2,4.3,2.7,public,'TRANSIT_RESIDENTIAL_ACCESS_NOT_CERTIFIED')
# This is not a new game road. Rail continuity is shown only as an editable
# three-dimensional artistic hypothesis; no claimed connection to a source train.
rail_points=[local(-14,5,-26),local(0,7,-35),local(20,10,-28),local(27,11,-12)]
tube('12 elevated double rail A',[p+Vector((0,0,-1.4)) for p in rail_points],
 .6,rail,'RAIL_TRUE_3D_ROUTE_UNCONNECTED_TO_ORIGINAL_TRAIN')
tube('13 elevated double rail B',[p+Vector((0,0,1.4)) for p in rail_points],
 .6,rail,'RAIL_TRUE_3D_ROUTE_UNCONNECTED_TO_ORIGINAL_TRAIN')
# Asymmetric full-thickness compact enclosure envelopes, not cloned kiosks.
sector('14 residential living wall perforation',38,41,math.radians(-28),math.radians(17),
 2,18,housing,'RESIDENTIAL_SHELTER_OPAQUE_SCREEN')
sector('15 public atrium deep shoulder',31,34,math.radians(146),math.radians(201),
 2,22,stone,'PUBLIC_LOADBEARING_THICK_WALL')
assert 15<=len(objects)<=25,len(objects)
assert source_signature()==before
# Actual B48 and source CX overlap from original source triangles (not AABBs).
physical=[(o,tree(o)) for o in B48]
city=[(o,tree(o)) for o in objects]
existing=[(o,tree(o)) for o in CX]
B48hits=[]
CXhits=[]
for a,ta in city:
 for b,tb in physical:
  h=ta.overlap(tb)
  if h:B48hits.append([a.name,b.name,len(h)])
 for b,tb in existing:
  h=ta.overlap(tb)
  if h:CXhits.append([a.name,b.name,len(h)])
# R6D R1 set of 13 precise B51 sampled poses. The collection is animation-
# driven and not a *continuous* swept moving obstacle volume.
movers=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
assert len(movers)==28
sampled={}
for frame,f in enumerate(timeline['frames'],1):
 scene.frame_set(frame);bpy.context.view_layer.update()
 active=[(m,tree(m)) for m in movers]
 overlap=[]
 for o,t in city:
  for b,tb in active:
   h=t.overlap(tb)
   if h:overlap.append([o.name,b['R1_B51_ID'],len(h)])
 sampled[f['id']]=overlap
# Additional conservative broadphase against prior R6D 1081-tick machine04
# sampled union, for all new polygon vertices. Intersection means no safety.
machine04=json.load(open(arg('--r6d-ticks'),encoding='utf-8'))['sourceMachine04TickStudy']['sampleAabb']
def aabb_overlap(a,b):
 return all(a['min'][i]<=b['max'][i] and b['min'][i]<=a['max'][i] for i in range(3))
withheld=[]
for ob in objects:
 v=[ob.matrix_world@x.co for x in ob.data.vertices]
 bb={'min':[min(p[i] for p in v) for i in range(3)],
     'max':[max(p[i] for p in v) for i in range(3)]}
 if aabb_overlap(bb,machine04):withheld.append(ob.name)
# Camera-specific representative projection visibility (not automatic art PASS).
views={}
frames=('t1400','t1500','t1550','t1600','t1650','t1700')
for fi,f in enumerate(timeline['frames'],1):
 if f['id'] not in frames:continue
 scene.frame_set(fi)
 id=f['id']
 cam=protected_cameras.objects.get(id+' REAL ORIGINAL 240HZ')
 if cam is None:cam=r1c.objects.get('R1 '+id+' SOURCE CAMERA')
 assert cam
 bpy.context.view_layer.update()
 targets={'CXroot':anchor,'voidCentre':centre,'publicForum':local(-20,-2,-17),
          'transit':local(0,10,-30),'housing':local(33,10,23)}
 views[id]={}
 for key,pos in targets.items():
  projected=world_to_camera_view(scene,cam,pos)
  views[id][key]={'inFrame':bool(projected.z>0 and 0<projected.x<1 and 0<projected.y<1),
    'normalizedXY':[round(float(projected.x),5),round(float(1-projected.y),5)],
    'occlusionNotCertified':True,'readableToHuman':'NOT_CERTIFIED'}
assert source_signature()==before
scene.frame_start=1;scene.frame_end=13;scene.frame_set(1)
scene['R6D_R2_PRIVATE_ONE_UNADOPTED_CITY']=True
scene['R2_SOURCE_UNMODIFIED']=True
scene['R2_NEW_GAME_COLLIDER']=0
scene['R2_ART']=scene['R2_HUMAN']=scene['R2_RELEASE']='HOLD'
scene.cycles.device='CPU';scene.cycles.samples=4
scene.cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
blend='R2_'+road+'_POROUS_CONFLUENCE_UNADOPTED_EDITABLE.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders=[]
for f in timeline['frames']:
 if f['id'] not in frames:continue
 fi=timeline['frames'].index(f)+1
 scene.frame_set(fi)
 cam=protected_cameras.objects.get(f['id']+' REAL ORIGINAL 240HZ')
 if cam is None:cam=r1c.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam
 scene.camera=cam
 file='R2_'+road+'_'+f['id']+'_ACTUAL_BLENDER_NEW_CITY_NOT_WEBGL.png'
 scene.render.filepath=os.path.join(out,file)
 bpy.ops.render.render(write_still=True)
 renders.append(file)
report={
 'schema':'dopagaki.g4e7dz-r6d-r2-porous-confluence-private/1',
 'road':road,'sourceCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceCX':18,'sourceB48':7,'sourceB51':28,'originalCameras':5,
 'gap52':True,'sourceUnmodified':source_signature()==before,
 'R5AContactSource':contact['best'],'contactIsWelded':'NOT_CERTIFIED',
 'sourceCxRootWorld':[round(float(x),4) for x in anchor],
 'cityCentreWorld':[round(float(x),4) for x in centre],
 'newEditableCityMeshes':len(objects),
 'newRoles':{o.name:o['R2_ROLE'] for o in objects},
 'voidRadiusMetres':19,
 'sourceB48ExactTriangleOverlaps':B48hits,
 'sourceCXExactTriangleOverlaps':CXhits,
 'newCityVsB51ThirteenSampleTriangleOverlaps':sampled,
 'machine04Prior1081TickSampleEnvelopeAabbOverlap':withheld,
 'machine04PreviousUnionIsCertifiedSweep':False,
 'newCityPhysicallyCleared':False,
 'everyMoverContinuousTimeSafe':'NOT_TESTED',
 'pedestrianWalkable':'NOT_CERTIFIED',
 'structuralSafety':'NOT_CERTIFIED',
 'railNetworkActualConnection':'NOT_CERTIFIED',
 'gameplayObstacleSightline':'NOT_CERTIFIED',
 'nativeCameraProjectionOnlyNotHumanLegibility':views,
 'originalBlenderSource':arg('--source'),
 'editableBlender':blend,'genuineBlenderPngs':renders,
 'newGameColliders':0,'sourceGameChanged':False,'newCityWebGL':'NOT_RENDERED',
 'humanPlay':'NOT_RUN','officialArt':0,'officialSlope2Meters':0,
 'TECH':'SOURCE_PROTECTION_AND_LIMITED_GEOMETRY_ONLY',
 'ART':'HOLD_PENDING_INDEPENDENT_IMAGE_REVIEW',
 'GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R2_'+road+'_AUDIT.json'),'w',encoding='utf-8') as file:
 json.dump(report,file,ensure_ascii=False,indent=2)
print('R6D_R2_PRIVATE_GENUINE_CITY_NOT_ADOPTED',road,
 'meshes',len(objects),'b48hits',len(B48hits),
 'b51_samples',sum(len(v) for v in sampled.values()),
 'cxhits',len(CXhits),'machine04_box_hits',len(withheld))
