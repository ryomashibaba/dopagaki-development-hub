# G4E-7DV / ROAD-TO-ENTRANCE DIAGNOSTIC: truthful unadopted
# lift+pedestrian bridge concept from closest ORIGINAL game B48 skin.
# Path NOT certified traversable or free of other original geometry. No game edits.
import bpy,json,os,sys,math
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def arg(v):return args[args.index(v)+1]
report=json.load(open(arg('--survey'),encoding='utf-8'))
out=arg('--out');os.makedirs(out,exist_ok=True)
assert report['schema']=='dopagaki.g4e7dv-road-to-civic-entrance-survey/1'
assert report['realPlayableConnectionCreated'] is False
assert report['actualGamePhysicsModified'] is False
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
sc=bpy.context.scene
assert sc['DR_ACTUAL_B48_MESH_COUNT']==7
assert sc['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert sc['DR_ACTUAL_B48_VOID_CELL52'] is True
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
movers=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
assert len(roads)==7 and len(movers)==28 and len(cx)==18
identity={
 'roads':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads),
 'cx':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 'hazards':sorted(o['SOURCE_ORIGINAL_B51_ID'] for o in movers)
}
cams=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert cams and len(cams.objects)==5
city=bpy.data.collections.new('DV UNADOPTED ROAD LIFT SKYBRIDGE STATION / REFERENCE NOT GAME')
sc.collection.children.link(city)
def mat(name,rgb,glow=False):
 m=bpy.data.materials.new(name);m.diffuse_color=(*rgb,1)
 m.use_nodes=True;b=m.node_tree.nodes.get('Principled BSDF')
 b.inputs['Base Color'].default_value=(*rgb,1)
 b.inputs['Roughness'].default_value=.48
 if glow:
  b.inputs['Emission Color'].default_value=(*rgb,1)
  b.inputs['Emission Strength'].default_value=1.65
 return m
steel=mat('DV physically untested station steel',(.48,.64,.73))
glass=mat('DV untested tinted elevator glass',(.18,.48,.62))
floor=mat('DV untested occupied passage floor',(.54,.40,.23))
illume=mat('DV provisional station portal threshold',(.84,.67,.30),True)
red=mat('DV direct 18 PERCENT GRADE REJECT - NOT A RAMP',(.89,.11,.15),True)
def mesh(name,vs,fs,m):
 data=bpy.data.meshes.new(name);data.from_pydata(vs,[],fs);data.update()
 o=bpy.data.objects.new(name,data);city.objects.link(o)
 data.materials.append(m);o['DV_ONLY_VISUAL_REFERENCE']=True;o['DV_NEW_COLLIDER']=False
 return o
def box(name,center,size,m):
 x,y,z=center;w,h,d=[a*.5 for a in size]
 p=[(x-w,y-h,z-d),(x+w,y-h,z-d),(x+w,y-h,z+d),(x-w,y-h,z+d),
  (x-w,y+h,z-d),(x+w,y+h,z-d),(x+w,y+h,z+d),(x-w,y+h,z+d)]
 return mesh(name,p,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],m)
def beam(name,a,b,width,height,m):
 v=Vector(a);w=Vector(b);delta=w-v
 side=Vector((-delta.z,0,delta.x))
 if side.length<1e-6:side=Vector((1,0,0))
 side.normalize();side=side*(width/2)
 rise=Vector((0,height/2,0))
 p=[v-side-rise,v+side-rise,w+side-rise,w-side-rise,
  v-side+rise,v+side+rise,w+side+rise,w-side+rise]
 return mesh(name,[tuple(z) for z in p],
  [(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],m)
entry=next(v for v in report['targetAudits'] if v['id']=='FRONT_CENTRE')
road=entry['nearestActualPhysicsTop']['point'];target=entry['point']
r=Vector(road);e=Vector(target)
assert abs(e.y-r.y)>8 and e.y>r.y
assert (e-r).length>58
# A transparent unverified lift core: road footpoint to DU 95m entrance level.
p0=(r.x,r.y,r.z);p1=(r.x,e.y,r.z)
box('DV road-level landing actual B48 top FOOTPOINT NOT SAFE LANE ACCESS',
 (r.x,r.y+.55,r.z),(7,1.1,8),floor)
for sx in (-2.3,2.3):
 for sz in (-2.4,2.4):
  box('DV cantilever lift cabin steel pier %s %s'%(sx,sz),
   (r.x+sx,(e.y+r.y)/2,r.z+sz),(.8,e.y-r.y+.8,.8),steel)
box('DV lift upper platform at 95m unproven',
 (r.x,e.y+.9,r.z),(8,1.8,8),floor)
# Elevated actual volume, not projected colored line or phantom passage.
beam('DV 63m enclosed station access deck / NOT GAME ROAD',p1,target,7.8,3.4,floor)
# Distinct low-opacity enclosure faces and actual air space: only 2 flank rails.
delta=e-r;horizontal=Vector((delta.x,0,delta.z))
offset=Vector((-horizontal.z,0,horizontal.x)).normalized()
for s in (-1,1):
 a=Vector(p1)+s*offset*3.6+Vector((0,3.6,0))
 b=Vector(target)+s*offset*3.6+Vector((0,3.6,0))
 beam('DV skybridge upper safety bearer %s'%s,a,b,1.0,1.4,glass)
# A meaningful open entrance threshold to the proven DU (not a fake solid gate).
for sx in (-5.8,5.8):
 box('DV genuine 3D station portal pier '+str(sx),
  (e.x+sx,e.y+9.5,e.z),(2.1,19,4),steel)
box('DV real 3D transit station lintel',
 (e.x,e.y+19,e.z),(15,3.0,5),illume)
box('DV public entrance plaza / NONPHYSICAL',
 (e.x,e.y-1.4,e.z-7),(17,2.8,18),floor)
# Show infeasible direct-incline centerline as red reference ONLY, hidden from
# collision or human play. Thin 3D beacon, not a physical slope.
beam('DV DIRECT 18.6 PERCENT GRADE REJECT / VISUAL QA LINE ONLY',
 (r.x,r.y+4.5,r.z),(e.x,e.y+4.5,e.z),.25,.25,red)
# The DU 120 m continuation is NOT a real supported walkway. Do not depict a
# fully built 120 m road and falsely pass pedestrian accessibility.
assert sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in roads)==identity['roads']
assert sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx)==identity['cx']
assert sorted(o['SOURCE_ORIGINAL_B51_ID'] for o in movers)==identity['hazards']
assert len(city.objects)==14,(len(city.objects),[o.name for o in city.objects])
sc['DV_NEW_GAME_COLLIDERS']=0
sc['DV_SOURCE_B48_CONTACT_POINT']=list(p0)
sc['DV_EXISTING_GAME_ACCESS_CERTIFIED']=False
sc['DV_SOURCE_B48_TO_ENTRY_ELEVATION_DIFFERENCE_METERS']=entry['nearestActualPhysicsTop']['elevationDeltaMeters']
sc['DV_SKYBRIDGE_IS_NOT_TESTED_FOR_COLLISION']=True
sc['DV_FORMAL_ART_APPROVED']=False
sc['DV_RENDER_IS_NOT_GAME_WEBGL']=True
sc['DV_ART']=sc['DV_HUMAN']=sc['DV_PUBLISH']='HOLD'
sc.cycles.device='CPU';sc.cycles.samples=3;sc.cycles.use_denoising=False
sc.view_layers[0].cycles.use_denoising=False
sc.render.threads_mode='FIXED';sc.render.threads=2
sc.render.image_settings.file_format='PNG'
blend=os.path.join(out,'G4E7DV_'+report['road']+'_ROAD_TO_STATION_LIFT_VISUAL_NOT_PLAYABLE.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
for index,shot in enumerate(('t1550','t1600','t1650'),start=2):
 sc.frame_set(index)
 sc.camera=cams.objects.get(shot+' REAL ORIGINAL 240HZ')
 assert sc.camera is not None
 sc.render.filepath=os.path.join(out,'G4E7DV_'+report['road']+'_'+shot+'_NOT_WEBGL_NOT_PLAYABLE.png')
 bpy.ops.render.render(write_still=True)
audit={'schema':'dopagaki.g4e7dv-real-b48-footpoint-nonplayable-visual/1',
 'road':report['road'],'trueOriginalRoadContactPoint':list(p0),
 'civicSightlinePortal':list(target),
 'realPhysicsB48SurfacesRetained':len(roads),
 'realPhysicsB51OBBsRetained':len(movers),'originalCXRetained':len(cx),
 'originalCameraCount':len(cams.objects),
 'roadToPortalShortest3dMeters':entry['nearestActualPhysicsTop']['distanceMeters'],
 'roadToPortalRiseMeters':entry['nearestActualPhysicsTop']['elevationDeltaMeters'],
 'directInclineTooSteepGrade':entry['straightBridgeGrade'],
 'newVisualCityObjects':len(city.objects),'newGameColliders':0,
 'proposedLiftElevatedBridgeMaterialsNotGameOriginal':True,
 'realStationPhysicalAccessCertified':False,
 'sourceGameTrianglesEdited':False,
 'newCityArtAdopted':False,'actualGameWebGL':'NOT_RUN',
 'art':'HOLD','human':'HOLD','publish':'HOLD','merge':'HOLD',
 'officialSlope2Meters':0}
with open(os.path.join(out,'G4E7DV_'+report['road']+'_ACCESS_VISUAL_AUDIT.json'),'w') as f:
 json.dump(audit,f,indent=2)
print('DV_ORIGINAL_ROAD_SKYBRIDGE_LOCOMOTION_UNPROVEN_BLENDER_REFERENCE',json.dumps({
 'road':report['road'],'rise':audit['roadToPortalRiseMeters'],
 'distance':audit['roadToPortalShortest3dMeters'],
 'objects':len(city.objects),'gameplayConnection':False}))