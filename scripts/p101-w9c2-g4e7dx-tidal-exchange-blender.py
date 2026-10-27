# G4E-7DX / OPEN TIDAL EXCHANGE — ONE INHABITED PUBLIC CITY SEGMENT.
# Genuine unchanged DR B48 all-seven source roads, B51 all-28 OBB poses,
# CX 18 original meshes, original nonhuman 240Hz game cameras.
# DESIGN RESEARCH ONLY. No playable collision, production update or game WebGL.
import bpy,json,sys,os,math
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def arg(k):return args[args.index(k)+1]
plan=json.load(open(arg('--site-report'),encoding='utf-8'))
road=arg('--road');out=arg('--out');os.makedirs(out,exist_ok=True)
assert road in ('true-pinch','pinch-switch')
assert plan['schema']=='dopagaki.g4e7dw-visibility-pixel-and-actual-original-b48-road-candidate-study/1'
site=next(c for c in plan['candidates'] if c['id']=='B481_U62_V0_O42_H2')
assert site['originalWorldPortalRaysAllClear'] and site['simpleLiftToPortalCenterlineStaticClear']
assert abs(site['gradeProxy']-2/42)<1e-8
assert site['minimumReadableWidthPixels']>17.9
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
sc=bpy.context.scene
assert sc['DO_SCENE_IS_NOT_GAME_WEBGL'] is True
assert sc['DR_ACTUAL_B48_MESH_COUNT']==7
assert sc['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert sc['DR_ACTUAL_B48_VOID_CELL52'] is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
ro=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
obbs=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert len(cx)==18 and len(ro)==7 and len(obbs)==28 and cams is not None and len(cams.objects)==5
frozen_cx=sorted((o.name,len(o.data.polygons),o['source_sha256']) for o in cx)
frozen_roads=sorted((o.name,len(o.data.polygons),o['ORIGINAL_GAME_B48_SHA256']) for o in ro)
frozen_moving=sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in obbs)
col=bpy.data.collections.new('DX OPEN TIDAL EXCHANGE / ONE NONREPEATING CITY SPATIAL SECTION / ART HOLD')
sc.collection.children.link(col)
def material(n,c,met=.25,rough=.43,emit=None):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1)
 m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*c,1)
 p.inputs['Roughness'].default_value=rough
 p.inputs['Metallic'].default_value=met
 if emit is not None:
  p.inputs['Emission Color'].default_value=(*emit,1)
  p.inputs['Emission Strength'].default_value=2.1
 return m
sinter=material('DX Light sintered limestone civic shell',(.65,.78,.76),.27,.43)
basalt=material('DX Thick dark structural undercroft',(.065,.13,.20),.24,.62)
copper=material('DX Warm navigable civic floors',(.50,.34,.21),.40,.42)
dark=material('DX Inhabited interiors open onto street',(.16,.27,.32),.30,.60)
jade=material('DX Terraced planted gardens & promenades',(.22,.40,.36),.13,.52)
light=material('DX Physically recessed interior light',(.86,.46,.22),.22,.42,(1,.33,.10))
blue=material('DX Station wayfinding / power conduits',(.20,.61,.72),.35,.27,(.08,.52,.92))
accent=material('DX Inner civic heatline / public counter',(.68,.53,.32),.38,.4,(.80,.38,.12))
P=Vector(site['worldCenter']);foot=Vector(site['originalB48TopEdgeFootpoint'])
fwd=Vector((P.x-foot.x,0,P.z-foot.z)).normalized()
side=Vector(site['fixedPortalRight']).normalized()
assert abs(fwd.dot(side))<1e-6
def xyz(l,d,y=0):
 return tuple(P+side*l+fwd*d+Vector((0,y,0)))
def mesh(name,points,faces,mat):
 ma=bpy.data.meshes.new(name)
 ma.from_pydata([tuple(p) for p in points],[],faces);ma.update()
 o=bpy.data.objects.new(name,ma);col.objects.link(o);ma.materials.append(mat)
 o['DX_ORIGINAL_GAME_GEOMETRY_CHANGED']=False
 o['DX_GAME_COLLIDER']=False
 o['DX_ART_APPROVED']=False
 return o
def unit(name,l,d,y,sx,sz,sy,mat):
 # thick true 3D independent street-axis box (not an image/billboard)
 corners=[xyz(l+u*sx/2,d+v*sz/2,y+w*sy/2)
          for w,v,u in [(-1,-1,-1),(-1,-1,1),(-1,1,1),(-1,1,-1),
                        (1,-1,-1),(1,-1,1),(1,1,1),(1,1,-1)]]
 return mesh(name,corners,[(0,3,2,1),(4,5,6,7),(0,1,5,4),
                            (1,5,6,2),(2,6,7,3),(3,7,4,0)],mat)
def plank(name,a,b,width,thickness,mat):
 s=Vector(a);e=Vector(b)
 sideways=Vector((-(e-s).z,0,(e-s).x))
 if sideways.length<1e-4:sideways=side
 sideways.normalize();sideways*=width/2
 h=Vector((0,thickness/2,0))
 v=[s-sideways-h,s+sideways-h,e+sideways-h,e-sideways-h,
    s-sideways+h,s+sideways+h,e+sideways+h,e-sideways+h]
 return mesh(name,v,[(0,1,2,3),(4,7,6,5),(0,4,5,1),
                       (1,5,6,2),(2,6,7,3),(3,7,4,0)],mat)
def native_volume(name,footprint,ylo,yhi,mat):
 # six or seven vertices leave a monumental jagged skyline; actual
 # massive occupied cliff volume, never floating thin panels.
 n=len(footprint);vs=[xyz(l,d,ylo) for l,d in footprint]+[xyz(l,d,yhi) for l,d in footprint]
 faces=[tuple(range(n-1,-1,-1)),tuple(range(n,n*2))]
 for k in range(n):
  j=(k+1)%n;faces.append((k,j,j+n,k+n))
 return mesh(name,vs,faces,mat)
c={'access':0,'structuralMasses':0,'occupiedPublicFloors':0,
   'physicallyOpenDoorways':0,'independentLivingWings':0,'fullStreetRoofSheets':0,
   'thinDecorativeBands':0,'placePublicThreshold':0,'longSightlineContinuity':0,
   'trueGameColliders':0}
# 1) A genuine continuous *visual* podium from source B48 road edge to entry.
# Start 2m above original source road edge; anchor fully outboard and stage
# geometry NOT counted as safe player path.
for idx in range(3):
 frac0=idx/3;frac1=(idx+1)/3
 a=foot.lerp(P,frac0)+Vector((0,1.8+0.2*frac0,0))
 b=foot.lerp(P,frac1)+Vector((0,1.8+0.2*frac1,0))
 plank('DX Outboard 10.5m civic transit approach SEGMENT '+str(idx),
       a,b,10.5,2.4,copper);c['access']+=1
 # Real constructional legs, optically distinct on side of source road.
 if idx>0:
  base=a-Vector((0,8.0,0))
  plank('DX Source-based road-contact structural leg '+str(idx),base,a,2.1,2.8,basalt);c['structuralMasses']+=1
# 2) Big social open square: the centre is OPEN AIR, not an opaque roof slab.
unit('DX 35m wide PUBLIC OPEN TO SKY ARRIVAL TERRACE',0,9,-1.6,36,30,3.4,copper)
c['occupiedPublicFloors']+=1
unit('DX Low real station east/west civic split platform',0,33,-1.6,42,30,3.2,copper)
c['occupiedPublicFloors']+=1
unit('DX Deep uncovered courtyard suspended over real original outskirts',
     0,63,-2.8,42,35,5.5,basalt)
c['occupiedPublicFloors']+=1
# 3) Left civic wing: broad tiered **inhabited** native volumes, curved-notched
# irregular exterior, no vertical box/tower repeating.
left_base=[(-21,0),(-47,0),(-54,23),(-50,57),(-36,68),(-22,50),(-21,24)]
native_volume('DX LEFT inhabited TRANSPORT LIBRARY masonry foundation',left_base,-17,9,basalt)
c['structuralMasses']+=1;c['independentLivingWings']+=1
left_upper=[(-24,4),(-48,14),(-57,39),(-46,70),(-32,62),(-24,43)]
native_volume('DX LEFT asymmetric civic cantilever stepped inhabited TOP',left_upper,9,28,sinter)
c['structuralMasses']+=1
# Actually occupied open floors, not just windows painted onto walls.
unit('DX LEFT exposed Library floor with transparent civic-air front',
     -32,24,10.2,18,28,3.0,copper);c['occupiedPublicFloors']+=1
unit('DX LEFT upper outdoor reading theatre under vast OPEN sky',
     -36,49,29.3,25,35,4.2,jade);c['occupiedPublicFloors']+=1
# An actual opening in between two structures: nothing closes the centre.
c['physicallyOpenDoorways']+=1
# 4) Right civic wing: lower terraced interchange + deep real station bay.
# Asymmetry is intentional: lower spread toward road, no identical twin.
right_base=[(21,-6),(45,-13),(66,13),(65,46),(42,72),(24,61),(21,26)]
native_volume('DX RIGHT broad rooted civic interchange geological shell',
              right_base,-19,4,sinter)
c['structuralMasses']+=1;c['independentLivingWings']+=1
right_upper=[(28,14),(54,10),(65,28),(56,49),(34,61),(27,49)]
native_volume('DX RIGHT sloping park terrace habitable mechanical loft',right_upper,4,20,basalt)
c['structuralMasses']+=1
unit('DX RIGHT real light-filled ticket hall side opening toward street',
     33,10,5.6,16,30,2.4,copper);c['occupiedPublicFloors']+=1
unit('DX RIGHT elevated inhabited community garden above hall',
     43,33,22,25,36,4.4,jade);c['occupiedPublicFloors']+=1
c['physicallyOpenDoorways']+=1
# 5) Street narrative: two open vertically generous entrance banks. Portal
# measures 18m but civic gap stays >40m throughout: player sees through.
for sign in (-1,1):
 unit('DX 3D OPEN station entry PIER near 18m portal %s'%sign,
      9*sign,0,9.5,3.4,4.8,19,sinter)
 c['structuralMasses']+=1
unit('DX Open portal cross-structure real load-bearing raised lintel',
     0,0,20.7,23,5.4,3.4,sinter);c['structuralMasses']+=1
unit('DX Human civic wayfinding slab behind entry NOT a blocking facade',
     0,10,0.7,14,1.2,2,light)
# 6) Legible large actual occupied concourse, bounded by independent masses
# and illuminated *recessed* side rooms. Not a neon billboard facade.
for side_ in (-1,1):
 unit('DX commercial cafe interior luminous BACK room '+str(side_),
      side_*19.7,30,7.0,4.3,19,7.4,light)
 unit('DX civic hall communal counter 3D '+str(side_),
      side_*18.5,44,5.0,4.8,16,5.7,accent)
 c['occupiedPublicFloors']+=1
# 7) Two distinct overhead transit terminals CONNECT the public street
# visually and architecturally, WITHOUT closing the central open-air slot.
for side_ in (-1,1):
 plank('DX TRUE THREE-DIMENSIONAL nonphysical regional light rail beam '+str(side_),
   xyz(side_*17,43,29),xyz(side_*16,104,37),
   6.3,6.5,dark)
 c['structuralMasses']+=1
# Far end a small credible transit exchange occupied deck, not a huge wall.
unit('DX FAR active transit court eye-line destination remains OPEN AIR',
     0,106,-0.6,29,20,3.4,copper);c['occupiedPublicFloors']+=1
unit('DX FAR low sheltered district circulation EXPOSED facade',
     -14.5,105,8.7,6,14,15,jade);c['structuralMasses']+=1
# Pedestrian scale perimeter marker with pure material emissive but actually
# lying on a physical courtyard floor; not thousands of 0.2m windows.
for side_ in (-1,1):
 plank('DX embedded long-distance clearly directional station spine '+str(side_),
   xyz(side_*13,16,0.9),xyz(side_*13,78,0.9),.7,.6,blue)
 c['longSightlineContinuity']+=1
# Structures deliberately fewer than DS 709, different from DT giant opaque wall.
assert len(col.objects)==30,(len(col.objects),c)
assert c['occupiedPublicFloors']>=9
assert c['independentLivingWings']==2
assert c['fullStreetRoofSheets']==0
assert c['thinDecorativeBands']==0
assert c['physicallyOpenDoorways']==2
assert sorted((o.name,len(o.data.polygons),o['source_sha256']) for o in cx)==frozen_cx
assert sorted((o.name,len(o.data.polygons),o['ORIGINAL_GAME_B48_SHA256']) for o in ro)==frozen_roads
assert sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in obbs)==frozen_moving
assert len(cams.objects)==5
sc['DX_ORIGINAL_GAME_ROAD_TOUCHED']=False
sc['DX_ART_ADOPTED']=False
sc['DX_ACTUAL_GAME_WEBGL_RENDERED']=False
sc['DX_TRUE_GAME_NEW_COLLIDERS']=0
sc['DX_PREVIOUS_DW_CANDIDATE']=site['id']
sc['DX_VISUAL_ARCHITECTURAL_ELEMENTS']=len(col.objects)
sc['DX_ART']=sc['DX_HUMAN']=sc['DX_PUBLISH']='HOLD'
sc.cycles.device='CPU';sc.cycles.samples=3
sc.cycles.use_denoising=False;sc.view_layers[0].cycles.use_denoising=False
sc.render.threads_mode='FIXED';sc.render.threads=2
sc.render.image_settings.file_format='PNG'
blend=os.path.join(out,'G4E7DX_'+road+'_OPEN_TIDAL_EXCHANGE_EDITABLE_UNADOPTED.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
# A visual path is only true if representative interior sightlines survive
# the original CX/B48/28 B51 and ALL newly authored city walls. This uses
# Blender's complete scene ray-cast, not a hand-written facade projection.
# Five sparse point probes per original shot are DIAGNOSTIC, not a safety pass.
proven=[]
for i,id in enumerate(('t1550','t1600','t1650'),start=2):
 sc.frame_set(i)
 sc.camera=cams.objects.get(id+' REAL ORIGINAL 240HZ')
 assert sc.camera is not None
 sc.render.filepath=os.path.join(out,'G4E7DX_'+road+'_'+id+'_REAL_BLENDER_NOT_GAME_WEBGL.png')
 bpy.context.view_layer.update()
 sourceEye=sc.camera.matrix_world.translation.copy()
 dg=bpy.context.evaluated_depsgraph_get()
 sightTargets=[
  ('ENTRY',xyz(0,3,8)),
  ('FIRST_PUBLIC_COURT',xyz(0,25,8)),
  ('DEEP_PUBLIC_COURT',xyz(0,60,7)),
  ('DISTANT_TRANSIT',xyz(0,103,8)),
  ('LEFT_READING_TERRACE',xyz(-32,23,14))
 ]
 sightChecks=[]
 for tag,target in sightTargets:
  dest=Vector(target);ray=dest-sourceEye;dist=ray.length
  hit,loc,norm,face,ob,matrix=sc.ray_cast(dg,sourceEye,ray.normalized(),distance=max(0.1,dist-.35))
  label='CLEAR'
  if hit:
   if ob.name in col.objects:label='NEW_DX_ART'
   elif ob.name in {x.name for x in ro}:label='EXISTING_B48'
   elif ob.name in {x.name for x in cx}:label='EXISTING_CX'
   elif ob.name in {x.name for x in obbs}:label='EXISTING_B51'
   else:label='OTHER_SOURCE'
  sightChecks.append({'target':tag,'rayLengthMeters':dist,'firstOcclusionType':label,
   'firstObject':ob.name if hit else None,'pointOnlyNotFullInteriorProof':True})
 bpy.ops.render.render(write_still=True)
 proven.append({'shot':id,'sourceOBBs':len(obbs),'sourceRoads':len(ro),
  'actualBlenderSceneRaycastIntoCivicInterior':sightChecks})
audit={'schema':'G4E7DX_REAL_DR_NATIVE_3D_PUBLIC_URBAN_SECTION_ART_QA',
 'road':road,'artProposal':'OPEN TIDAL EXCHANGE ONE CONNECTED NONREPEATING SECTION',
 'originalB48Count':len(ro),'originalB51MovingCount':len(obbs),
 'originalCXCount':len(cx),'nativeOriginalCameras':len(cams.objects),
 'originalB48Hashes':frozen_roads,'originalCXHashes':frozen_cx,
 'actualGeneratedArchitecturalParts':len(col.objects),'intent':c,
 'approachDistanceMetres':site['outboardOffsetMeters'],
 'originalRoadTopEdgeWorldPosition':list(foot),
 'originalSourcePortalWorldPosition':list(P),
 'straightRiseMetres':site['verticalRiseMeters'],
 'sourcePortalMinScreenWidthPx':site['minimumReadableWidthPixels'],
 'fixedWorldSameInTwoVariants':True,
 'visualNotPhysicalConnection':True,'newGameColliderCount':0,
 'originalRoadEdited':False,
 'actualGameWebGL':'NOT_RENDERED','humanAccess':'NOT_TESTED',
 'renderedNative240HzShots':proven,
 'art':'HOLD','human':'HOLD','ready':'HOLD','publish':'HOLD','merge':'HOLD',
 'formalSlope2Meters':0}
with open(os.path.join(out,'G4E7DX_'+road+'_NONADOPTED_CITY_AUDIT.json'),'w') as h:json.dump(audit,h,indent=2)
print('DX_OPEN_TIDAL_EXCHANGE_ORIGINAL_PHYSICAL_BLENDER_ART_QA',json.dumps({
 'road':road,'meshes':len(col.objects),'shots':len(proven),'art':'HOLD'}))
