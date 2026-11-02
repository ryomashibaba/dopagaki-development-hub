# G4E-7DU — native 3D sightline REPORT, not an art asset.
# Loads unchanged DR original B48+B51+CX stage; annotates the non-playable
# spatial hypothesis that passed exact original-world triangle/OBB ray tests.
import bpy,json,sys,os
from mathutils import Vector
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def val(k):return argv[argv.index(k)+1]
plan=json.load(open(val('--plan'),encoding='utf-8'))
out=val('--out');os.makedirs(out,exist_ok=True)
assert plan['schema']=='dopagaki.g4e7du-exact-world-civic-visibility-gate/1'
assert plan['rayVisibilityAllClear'] is True
assert plan['onScreenAllFrames'] is True
assert plan['actualCameraRaysTested']==117
assert plan['actualGeometryPathSegmentsTested']==36
assert plan['originalSourceGeometryCount']==56012
assert plan['originalGeometryPathIntersections']==0
assert plan['movingBlockers']==plan['staticBlockers']==0
assert plan['newGameColliders']==0
assert plan['actualB48PhysicalSurfaces']==7
assert plan['actualB51MovingVolumes']==28
assert plan['blockedControlFrames']>=1
bpy.ops.wm.open_mainfile(filepath=val('--source'))
scene=bpy.context.scene
assert scene['DR_ACTUAL_B48_MESH_COUNT']==7
assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert scene['DR_ACTUAL_B48_VOID_CELL52'] is True
assert scene['DO_SOURCE_HASH']==plan['originalCXVertexSha256']
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
roads=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
obbs=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
assert len(cx)==18 and len(roads)==7 and len(obbs)==28
orig_cx=[(o.name,len(o.data.polygons),o.get('source_sha256')) for o in cx]
orig_b48=[(o.name,len(o.data.polygons),o.get('ORIGINAL_GAME_B48_SHA256')) for o in roads]
orig_b51=sorted(o['SOURCE_ORIGINAL_B51_ID'] for o in obbs)
cams=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert cams is not None and len(cams.objects)==5
col=bpy.data.collections.new('DU PROVEN CLEAR CAMERA SIGHTLINES / QA OVERLAY NOT ART')
scene.collection.children.link(col)
def emissive(name,color):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1)
 m.use_nodes=True;n=m.node_tree.nodes
 n.clear();e=n.new('ShaderNodeEmission');e.inputs['Color'].default_value=(*color,1)
 e.inputs['Strength'].default_value=3.0
 o=n.new('ShaderNodeOutputMaterial');m.node_tree.links.new(e.outputs[0],o.inputs['Surface'])
 return m
cyan=emissive('DU non-game public path sightline / CYAN',(.05,.95,.98))
amber=emissive('DU non-game actual 3D threshold / AMBER',(1,.55,.12))
red=emissive('DU intentionally OCCLUDED rejected gate / RED',(.95,.10,.11))
def path(name,points,width,material):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=2
 c.bevel_depth=width;c.bevel_resolution=2
 sp=c.splines.new('POLY');sp.points.add(len(points)-1)
 for t,p in zip(sp.points,points):t.co=(*p,1)
 o=bpy.data.objects.new(name,c);col.objects.link(o)
 c.materials.append(material)
 o['DU_GAME_COLLIDER']=False
 return o
street=plan['sameCivicAxisBothRoads']
assert street['widthMeters']==12 and street['floorY']==95
x=street['axisX'];y=street['floorY']
near=street['nearZ'];far=street['farZ']
# Three thin translucent non-physical rays along the ACTUAL proven-open 120m.
# No solid carriageway is generated; markers DO NOT represent city architecture.
for lane in [-1,0,1]:
 xx=x+lane*street['widthMeters']*.5
 path('DU EXACT 6-camera 13-sample PROOF / edge '+str(lane),
   [(xx,y,z+.8) for z in range(near,far+1,10)],
   .26 if lane else .36,cyan)
def label(name,position,size,material):
 f=bpy.data.curves.new(name,'FONT');f.body=name
 f.size=size;f.extrude=.035;f.align_x='CENTER'
 o=bpy.data.objects.new(name,f);col.objects.link(o)
 o.location=position
 # text defaults to local XY, map so title stands in vertical XY plane.
 o.rotation_euler=(1.57079632679,0,0)
 f.materials.append(material)
 o['DU_GAME_COLLIDER']=False
 return o
for i,(z,caption) in enumerate([(near,'PUBLIC ENTRY'),(-415,'OPEN CIVIC PLAZA'),(far,'DEEP URBAN STREET')]):
 # A literal CAMERA REVIEW outline, not proposed habitable station geometry.
 path('DU sightline opening left '+str(i),
  [(x-6,y-.7,z),(x-6,y+17,z)],.58,amber)
 path('DU sightline opening right '+str(i),
  [(x+6,y-.7,z),(x+6,y+17,z)],.58,amber)
 path('DU sightline opening upper '+str(i),
  [(x-6,y+17,z),(x+6,y+17,z)],.58,amber)
 label('DU '+caption,(x,y+21,z),4.2,amber)
# Negative control: the former attractive-looking gate is actually occluded.
# Keep an explicit red camera-independent marker, but do not render it as
# architecture or score it as accessible.
a=plan['cameraTests'][0]['blindGateNegativeControl']['point']
path('DU NEGATIVE CONTROL OCCLUDED DO NOT DESIGN HERE',
  [(a[0],a[1]-8,a[2]),(a[0],a[1]+8,a[2])],.7,red)
# Original object identity/source geometry stays provably unchanged.
assert [(o.name,len(o.data.polygons),o.get('source_sha256')) for o in cx]==orig_cx
assert [(o.name,len(o.data.polygons),o.get('ORIGINAL_GAME_B48_SHA256')) for o in roads]==orig_b48
assert sorted(o['SOURCE_ORIGINAL_B51_ID'] for o in obbs)==orig_b51
assert len(cams.objects)==5
scene['DU_SOURCE_WORLD']='EXACT_DR_ORIGINAL_NO_EDIT'
scene['DU_DID_NOT_BUILD_ANY_CITY_ART']=True
scene['DU_3D_OVERLAY_IS_DIAGNOSTIC_ONLY']=True
scene['DU_PROVEN_ORIGINAL_STATIC_VISIBILITY_RAYS']=117
scene['DU_PROVEN_COLLISION_FREE_AXIS_SAMPLES']=36
scene['DU_ACTUAL_TRAVERSAL_FROM_ROAD']='NOT_TESTED'
scene['DU_ADDED_ORIGINAL_GAME_COLLIDERS']=0
scene['DU_ACTUAL_GAME_WEBGL']=False
scene['DU_ART']=scene['DU_HUMAN']=scene['DU_PUBLISH']='HOLD'
scene.cycles.device='CPU';scene.cycles.samples=3
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
blend=os.path.join(out,'G4E7DU_'+plan['road']+'_EXACT_VISIBILITY_DIAGNOSTIC_ART_HOLD.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
for idx,c in enumerate(plan['authentic240HzCameraIDs']):
 # Original B51 physical mover pose frames map 15.5->2, 16.0->3, 16.5->4
 scene.frame_set(idx+2)
 scene.camera=cams.objects.get(c+' REAL ORIGINAL 240HZ')
 assert scene.camera is not None
 scene.render.filepath=os.path.join(out,
 'G4E7DU_'+plan['road']+'_'+c+'_ACTUAL_BLENDER_DIAGNOSTIC_NOT_GAME_WEBGL.png')
 bpy.ops.render.render(write_still=True)
audit={'schema':'G4E7DU_REAL_NATIVE_CAMERA_EXACT_GEOMETRY_SIGHTLINE_VISUAL_QA',
 'road':plan['road'],'cxSourceCount':len(cx),'realB48Count':len(roads),
 'realB51Count':len(obbs),'originalCameras':len(cams.objects),
 'originalActualTrianglesTested':plan['originalSourceGeometryCount'],
 'originalCameraRaysClear':plan['actualCameraRaysTested'],
 'originalWorldCorridorSegmentChecks':plan['actualGeometryPathSegmentsTested'],
 'negativeControlBlockedFrames':plan['blockedControlFrames'],
 'overlayObjects':len(col.objects),
 'newCityArchitecture':0,'newGameColliders':0,
 'realGameWebGL':'NOT_RENDERED','physicalGameplayAccess':'NOT_TESTED',
 'art':'HOLD','human':'HOLD','publish':'HOLD','merge':'HOLD',
 'officialSlope2Meters':0}
with open(os.path.join(out,'G4E7DU_'+plan['road']+'_VISIBILITY_AUDIT.json'),'w') as f:json.dump(audit,f,indent=2)
print('DU_EXACT_RAY_120M_3D_REVIEW_PASS',json.dumps(audit))