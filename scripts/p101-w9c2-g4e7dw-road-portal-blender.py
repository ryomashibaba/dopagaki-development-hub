# DW / true-original B48 roadside low-elevation entrance silhouette overlay.
# Focus: 2m rise @ 42m offset is 0.016px below arbitrary 18px threshold,
# yet both original 240Hz camera routes can see all 4 portal probes unobstructed.
# This is a DIAGNOSTIC WIRE OUTLINE, not habitable art or game WebGL.
import bpy,sys,os,json,math
from mathutils import Vector
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def arg(x):return argv[argv.index(x)+1]
source=arg('--source');out=arg('--out');os.makedirs(out,exist_ok=True)
report=json.load(open(arg('--site-report'),encoding='utf-8'))
assert report['schema']=='dopagaki.g4e7dw-visibility-pixel-and-actual-original-b48-road-candidate-study/1'
road=arg('--road');assert road in ('true-pinch','pinch-switch')
site=next(c for c in report['candidates'] if c['id']=='B481_U62_V0_O42_H2')
assert site['originalWorldPortalRaysAllClear'] is True
assert site['simpleLiftToPortalCenterlineStaticClear'] is True
assert site['outboardOffsetMeters']==42 and site['verticalRiseMeters']==2
assert site['minimumReadableWidthPixels']>=17.9 and site['minimumReadableWidthPixels']<18
assert site['gradeProxy']<.05
other=next(c for c in report['candidates'] if c['id']=='B481_U62_V0_O42_H24')
assert other['minimumReadableWidthPixels']>=18
bpy.ops.wm.open_mainfile(filepath=source)
sc=bpy.context.scene
assert sc['DR_ACTUAL_B48_MESH_COUNT']==7
assert sc['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert sc['DR_ACTUAL_B48_VOID_CELL52'] is True
assert sc['DO_SOURCE_HASH']==report['originalPhysics'].get('sourceCXVertexSha256',sc['DO_SOURCE_HASH'])
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
road_objs=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
moving=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
assert len(cx)==18 and len(road_objs)==7 and len(moving)==28
frozen_cx=[(o.name,o['source_sha256'],len(o.data.polygons)) for o in cx]
frozen_b48=[(o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in road_objs]
frozen_b51={o['SOURCE_ORIGINAL_B51_ID'] for o in moving}
cams=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert cams and len(cams.objects)==5
col=bpy.data.collections.new('DW REFERENCE ONLY H2 ENTRANCE WIRE / NOT REAL CIVIC BUILDING')
sc.collection.children.link(col)
def emission(name,rgba):
 m=bpy.data.materials.new(name);m.diffuse_color=tuple(rgba)
 m.use_nodes=True;m.node_tree.nodes.clear()
 n=m.node_tree.nodes.new('ShaderNodeEmission')
 n.inputs['Color'].default_value=tuple(rgba)
 n.inputs['Strength'].default_value=2.5
 output=m.node_tree.nodes.new('ShaderNodeOutputMaterial')
 m.node_tree.links.new(n.outputs[0],output.inputs['Surface'])
 return m
cyan=emission('DW blue actual original road edge to projected civic threshold',(0.08,0.95,1,1))
gold=emission('DW 18m x 19m candidate entrance wire not built',(1.0,.72,.18,1))
p0=Vector(site['originalB48TopEdgeFootpoint'])
c=Vector(site['worldCenter']);right=Vector(site['fixedPortalRight'])
def wire(name,points,r,mat):
 cv=bpy.data.curves.new(name,'CURVE');cv.dimensions='3D'
 cv.resolution_u=1;cv.bevel_depth=r;cv.bevel_resolution=2
 sp=cv.splines.new('POLY');sp.points.add(len(points)-1)
 for a,v in zip(sp.points,points):a.co=(*v,1)
 obj=bpy.data.objects.new(name,cv);col.objects.link(obj)
 obj.data.materials.append(mat)
 obj['DW_NEW_GAME_COLLIDER']=False
 obj['DW_DIAGNOSTIC_NOT_CITY_ART']=True
 return obj
# Exactly measured 18m wide and 19m high; do not rotate to flatter screen.
L=c-right*9;R=c+right*9
wire('DW 18m portal frame 2m-rise candidate LOW TRUE B48 EDGE',
 [L,L+Vector((0,19,0)),R+Vector((0,19,0)),R,L],.48,gold)
wire('DW physical original source edge contact-to-proposed threshold',
 [p0+Vector((0,1.8,0)),c],.21,cyan)
# Small original B48 edge-contact locator, no fake railing/road collider.
wire('DW original B48 road edge source FOOTPOINT verify visually',
 [p0+Vector((0,-2,0)),p0+Vector((0,6,0))],.36,cyan)
# A vertical gauge makes the 2m rise explicit.
wire('DW 2 METRE rise from road edge to speculative entrance',
 [p0,p0+Vector((0,2,0))],.17,gold)
assert len(col.objects)==4
assert [(o.name,o['source_sha256'],len(o.data.polygons)) for o in cx]==frozen_cx
assert [(o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in road_objs]==frozen_b48
assert {o['SOURCE_ORIGINAL_B51_ID'] for o in moving}==frozen_b51
sc['DW_REVIEW_CANDIDATE_ID']=site['id']
sc['DW_ONLY_GEOMETRY_ASSESSMENT']=True
sc['DW_GAME_GRAPHICS_NOT_RENDERED']=True
sc['DW_NEW_GAME_COLLIDERS']=0
sc['DW_SCREEN_MIN_PX']=site['minimumReadableWidthPixels']
sc['DW_ART']=sc['DW_HUMAN']=sc['DW_PUBLISH']='HOLD'
sc.cycles.device='CPU';sc.cycles.samples=3
sc.cycles.use_denoising=False;sc.view_layers[0].cycles.use_denoising=False
sc.render.threads_mode='FIXED';sc.render.threads=2
sc.render.image_settings.file_format='PNG'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'G4E7DW_'+road+'_LOWLIFT_2M_PORTAL_ORIGINAL_ROAD_BLENDER_UNADOPTED.blend'))
for f,id in enumerate(('t1550','t1600','t1650'),start=2):
 sc.frame_set(f)
 sc.camera=cams.objects.get(id+' REAL ORIGINAL 240HZ')
 assert sc.camera is not None
 sc.render.filepath=os.path.join(out,'G4E7DW_'+road+'_'+id+'_ORIGINAL_BLENDER_NOT_WEBGL.png')
 bpy.ops.render.render(write_still=True)
audit={'schema':'dopagaki.g4e7dw-actual-road-edge-2m-lift-silhouette-art-gate/1',
 'road':road,'originalExactB48Count':len(road_objs),'originalCXCount':len(cx),
 'originalB51MovingCount':len(moving),'originalNativeCameraCount':len(cams.objects),
 'provenProjectionsBothRoads':len(site['nativeCameraProjection']),
 'entryCandidateH2MinWidthPixels':site['minimumReadableWidthPixels'],
 'entryCandidateH24MinWidthPixels':other['minimumReadableWidthPixels'],
 'h2CandidateWorldPosition':list(c),
 'sourceRealB48RoadEdge':list(p0),
 'proposedDirectGradeH2':site['gradeProxy'],
 'largerGapToPreviousDU3dMeters':64.5252489601258,
 'addedWireDiagnosticsOnly':len(col.objects),'addedGameColliders':0,
 'originalPhysicsModified':False,'actualPlayableRoadAccess':'UNPROVEN',
 'actualWebGLFramebuffer':'NOT_RENDERED',
 'art':'HOLD','human':'HOLD','publish':'HOLD','ready':'HOLD','merge':'HOLD',
 'officialSlope2Meters':0}
with open(os.path.join(out,'G4E7DW_'+road+'_LOWLIFT_2M_ART_AUDIT.json'),'w') as fh:json.dump(audit,fh,indent=2)
print('DW_TRUE_B48_FOOTPOINT_H2_PHYSICAL_CAMERA_BLENDER_QA',json.dumps({
 'road':road,'nearMiss18px':site['minimumReadableWidthPixels'],
 'roadToPortalGrade':site['gradeProxy'],'art':'HOLD','gamePhysics':False}))