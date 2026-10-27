# G4E-7DS / MERIDIAN FIVE — deliberate authored one-world inhabited city.
# Add ONLY visual Blender art in the DR exact original physical road/OBB scene.
# No environment/game source modifications; NEVER claim original WebGL capture.
import bpy,sys,json,os,math
from math import sin,cos,pi
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def flag(x):return args[args.index(x)+1]
src=flag('--source');plan=json.load(open(flag('--plan'),encoding='utf-8'))
out=flag('--out');os.makedirs(out,exist_ok=True)
assert plan['schema']=='dopagaki.g4e7ds-one-world-meridian-native-camera-planning/1'
assert plan['siteCount']==5 and not plan['gamePhysicsChanged']
assert plan['originalGameWebGL']=='NOT_RENDERED'
bpy.ops.wm.open_mainfile(filepath=src)
scene=bpy.context.scene
assert scene['DR_ACTUAL_B48_MESH_COUNT']==7
assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert scene['DR_ACTUAL_B48_VOID_CELL52'] is True
assert scene['DO_SOURCE_HASH']==plan['originalCXVertexSha256']
road_orig=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
hazard_orig=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cx_orig=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
original=[(o.name,len(o.data.polygons),o.get('source_sha256')) for o in cx_orig]
hashes=[o['ORIGINAL_GAME_B48_SHA256'] for o in road_orig]
hazard_names={o['SOURCE_ORIGINAL_B51_ID'] for o in hazard_orig}
assert len(road_orig)==7 and len(hazard_orig)==28 and len(cx_orig)==18
cameras=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert cameras and len(cameras.objects)==5
col=bpy.data.collections.new('DS UNADOPTED MERIDIAN FIVE REAL URBAN MASSING')
scene.collection.children.link(col)
def material(name,color,metal=0,rough=.5,emit=None):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1)
 m.use_nodes=True;node=m.node_tree.nodes.get('Principled BSDF')
 node.inputs['Base Color'].default_value=(*color,1)
 node.inputs['Metallic'].default_value=metal
 node.inputs['Roughness'].default_value=rough
 if emit is not None:
  node.inputs['Emission Color'].default_value=(*emit,1)
  node.inputs['Emission Strength'].default_value=2.7
 return m
quartz=material('DS mineral light facade with real door holes',(.62,.74,.74),.35,.3)
charcoal=material('DS black basalt deep internal structure',(.05,.105,.14),.48,.45)
copper=material('DS warm copper traversable civic floors',(.49,.31,.16),.6,.39)
indigo=material('DS prismatic blue ceramic piers',(.14,.35,.48),.4,.3)
green=material('DS green inhabited upper court',(.17,.34,.29),.3,.55)
orange=material('DS genuine internal ambient amber',(.96,.49,.16),.25,.38,(1,.36,.085))
cyan=material('DS powered transit line underglass',(.13,.64,.81),.22,.28,(.04,.65,.97))
neon=material('DS road approach beacons NOT in physical lane',(.78,.88,.94),.21,.3,(.60,.87,1))
def mesh(name,verts,faces,mat):
 m=bpy.data.meshes.new(name)
 m.from_pydata([tuple(p) for p in verts],[],faces)
 m.update()
 ob=bpy.data.objects.new(name,m);col.objects.link(ob)
 m.materials.append(mat)
 ob['DS_ART']='HOLD';ob['DS_NEW_COLLIDER']=False
 return ob
def wedge(name,polygon,low,high,mat,mod=0):
 # Fully closed convex 3D volume, not one floating flat sheet.
 nv=len(polygon)
 verts=[(x,low,z) for x,z in polygon]+[(x,high+mod*sin(2*pi*j/nv),z) for j,(x,z) in enumerate(polygon)]
 faces=[tuple(reversed(tuple(range(nv)))),tuple(range(nv,2*nv))]
 for j in range(nv):
  k=(j+1)%nv;faces.append((j,k,k+nv,j+nv))
 return mesh(name,verts,faces,mat)
def pad(x,y,z,sx,sy,sz,name,mat):
 verts=[(x-sx/2,y-sy/2,z-sz/2),(x+sx/2,y-sy/2,z-sz/2),
 (x+sx/2,y-sy/2,z+sz/2),(x-sx/2,y-sy/2,z+sz/2),
 (x-sx/2,y+sy/2,z-sz/2),(x+sx/2,y+sy/2,z-sz/2),
 (x+sx/2,y+sy/2,z+sz/2),(x-sx/2,y+sy/2,z+sz/2)]
 return mesh(name,verts,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],mat)
def link(a,b,width,height,name,mat):
 v1=Vector(a);v2=Vector(b);ray=v2-v1
 lateral=Vector((-ray.z,0,ray.x))
 if lateral.length<1e-6:lateral=Vector((1,0,0))
 lateral.normalize();widths=lateral*width/2
 v=[v1-widths+Vector((0,-height/2,0)),v1+widths+Vector((0,-height/2,0)),
    v2+widths+Vector((0,-height/2,0)),v2-widths+Vector((0,-height/2,0)),
    v1-widths+Vector((0,height/2,0)),v1+widths+Vector((0,height/2,0)),
    v2+widths+Vector((0,height/2,0)),v2-widths+Vector((0,height/2,0))]
 return mesh(name,v,[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],mat)
count={'shells':0,'publicAtria':0,'realDoorOpenings':0,'occupiedFloors':0,
 'inhabitedWindowVoids':0,'transitSegments':0,'roots':0}
sites=plan['sites']
for i,s in enumerate(sites):
 x,base,z=s['worldCenter'];r=s['radius'];h=s['height']
 # Five distinct but related residential civic structures. Each has two
 # substantial, multi-storey architectural banks divided by open AIR atrium.
 # No enormous monolithic wall across the camera or single hero skyscraper.
 for side in (-1,1):
  center=x+side*(r*.56)
  width=r*.62
  for tier in range(3):
   lo=base+h*tier/3;hi=base+h*(tier+1)/3
   shift=side*(tier*3.2)+6*sin(i*1.8+tier)
   z_shift=(tier-1)*5+5*cos((i+1)*tier)
   xx=center+shift; zz=z+z_shift
   depth=36+3*(i%3)
   # Real structural sidewalls and a rear enclosure. The front is deliberately
   # OPEN (actual missing polygon) in a two-storey civic portal; occupants
   # face into the atrium via open-air floor edges rather than painted lights.
   left=xx-width/2;right=xx+width/2;rear=zz+depth/2;front=zz-depth/2
   for j,edgeX in enumerate((left,right)):
    pad(edgeX,(hi+lo)/2,(rear+front)/2,3.8,hi-lo,depth,
        f'DS {s["id"]} shell pier {side}-{tier}-{j}',quartz if tier==2 else indigo)
    count['shells']+=1
   pad(xx,(hi+lo)/2,rear-1.8,width,hi-lo,3.6,
       f'DS {s["id"]} occupied rear mass {side}-{tier}',charcoal)
   # Top floor is a REAL occupied layer / roof, minimum 8m thickness.
   pad(xx,hi-4,zz,width+3,8,depth+4,
       f'DS {s["id"]} 8m loadbearing inhabited cap {side}-{tier}',
       green if tier==2 else quartz)
   count['shells']+=1
   # Floor, inter-floor bays, and open corridor. Explicitly no continuous
   # front wall: the large passage is real, not a black-painted doorway.
   floor_n=3 if tier!=2 else 2
   for floor in range(floor_n):
    level=lo+7+floor*(hi-lo-10)/floor_n
    pad(xx,level,zz,width-3,3.8,depth-7,
        f'DS {s["id"]} civic court gallery {side}-{tier}-{floor}',
        copper if (floor+i)%2==0 else charcoal)
    count['occupiedFloors']+=1
    for pole in range(4):
     u=(pole+1)/5
     xxpost=left+u*(right-left)
     # Deliberate truly empty frontage openings between these narrow piers.
     pad(xxpost,level+4,front+2,1.4,8,2.8,
         f'DS {s["id"]} open facade stone mullion {side}-{tier}-{floor}-{pole}',quartz)
     count['inhabitedWindowVoids']+=1
    # Warm interiors INSIDE physical 3D rooms, not sky-facing billboard.
    pad(xx,level+6,rear-5,width-9,2.2,1.5,
        f'DS {s["id"]} warm room backing {side}-{tier}-{floor}',orange)
   count['realDoorOpenings']+=1
   # Different skyline per site: asymmetrically thick cut roof shoulders.
   if tier==2:
    polygon=[(left-3,front-1),(right-2,front-6),(right+4,rear-1),
     (right-5,rear+8),(left+2,rear+5),(left-6,zz+4)]
    wedge(f'DS {s["id"]} sculpted NONTHIN 12m roof shoulder {side}',
         polygon,hi,hi+13+5*sin(i+side),quartz if side==1 else green,2.6)
    count['shells']+=1
  # Physical buttresses descend beneath building floors in outboard space.
  for k in range(2):
   px=center+(-1 if k==0 else 1)*(width*.30)
   link((px,base-42,z-11),(px+side*4,base+9,z+13),4.6,6.8,
      f'DS {s["id"]} rooted cliff foundation {side}-{k}',charcoal)
   count['roots']+=1
 # Central social spaces between banks, clearly open to sky and with no walls
 # in the center; the audience can see 3D depth between terraces.
 for floor,rr in enumerate((.35,.60)):
  py=base+16+floor*(h*.37)
  pad(x,py,z,r*.70,5.5,36,
      f'DS {s["id"]} publicly connected atrium mezzanine {floor}',copper)
  count['publicAtria']+=1
  # Diagonal accessible ramps to the next occupied stratum.
  link((x-r*.27,py,z-16),(x+r*.24,py+9,z+15),6.5,2.8,
      f'DS {s["id"]} inter-level public ramp {floor}',quartz)
 # Roof garden pavilions at a meaningful district rather than repeated boxes.
 if i in (1,3,4):
  pad(x,base+h*.76,z+7,r*.30,4.5,14,
      f'DS {s["id"]} visible garden court',green)
  for k in range(3):
   ppx=x+(k-1)*r*.10
   pad(ppx,base+h*.76+5,z+8,2.5,10,2.5,
       f'DS {s["id"]} garden pavilion pier {k}',quartz)
 # Station entrance, true 3D void with constructional piers.
 pad(x-r*.12,base+9,z-22,3.5,23,6,f'DS {s["id"]} terminal entrance left',quartz)
 pad(x+r*.12,base+9,z-22,3.5,23,6,f'DS {s["id"]} terminal entrance right',quartz)
 pad(x,base+22,z-22,r*.31,7,6,f'DS {s["id"]} portal upper load-bearing lintel',quartz)
 count['realDoorOpenings']+=1
# Spatial continuity is the PUBLIC TRANSIT BOULEVARD, spanning actual districts
# rather than disconnected monoliths. It is well ABOVE road collision level,
# visual only. TWO I-beam guideways and distinct 3D station-to-station hubs.
for i in range(len(sites)-1):
 a=sites[i]['worldCenter'];b=sites[i+1]['worldCenter']
 sa=Vector((a[0],a[1]+sites[i]['height']*.72,a[2]))
 sb=Vector((b[0],b[1]+sites[i+1]['height']*.72,b[2]))
 ort=Vector((-(sb-sa).z,0,(sb-sa).x)).normalized()
 for side in (-1,1):
  d=ort*side*5.5
  link(sa+d,sb+d,2.9,3.2,
   f'DS east-west suspended maglev REAL 3D structure {i}-{side}',indigo)
  link(sa+d+Vector((0,-4,0)),sb+d+Vector((0,-4,0)),1.1,1.4,
   f'DS inhabited maglev induction channel {i}-{side}',cyan)
  count['transitSegments']+=1
 # Not a continuous thin ribbon: short substantial supported station volumes.
 for n,anchor in enumerate((sa,sb)):
  pad(anchor.x,anchor.y-8,anchor.z,14,13,16,
      f'DS real transit station kernel {i}-{n}',charcoal)
  pad(anchor.x,anchor.y+1,anchor.z,14,2.8,17,
      f'DS transit amber public signage {i}-{n}',orange)
# Physical, source and camera proof must survive artistic authoring.
assert [(o.name,len(o.data.polygons),o.get('source_sha256')) for o in cx_orig]==original
assert sorted(o['ORIGINAL_GAME_B48_SHA256'] for o in road_orig)==sorted(hashes)
assert {o['SOURCE_ORIGINAL_B51_ID'] for o in hazard_orig}==hazard_names
assert len(cameras.objects)==5 and len(col.objects)>300
assert count['realDoorOpenings']>=30 and count['occupiedFloors']>=55
scene['DS_ART']='HOLD'
scene['DS_HUMAN']='HOLD';scene['DS_PUBLISH']='HOLD'
scene['DS_SOURCE']='MERIDIAN_FIVE_CITY_PROPOSAL_UNADOPTED'
scene['DS_NEW_GAME_COLLIDERS']=0
scene['DS_USING_ORIGINAL_GAME_CAMERAS_AND_PHYSICS']=True
scene['DS_EXACT_GAME_WEBGL_RENDERER']=False
scene.cycles.device='CPU';scene.cycles.samples=3
scene.cycles.use_denoising=False;scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.render.image_settings.file_format='PNG'
blend=os.path.join(out,'G4E7DS_'+plan['road']+'_MERIDIAN_FIVE_EDITABLE_ART_HOLD.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
for frame,tag in enumerate(('t1500','t1550','t1600','t1650','t1700'),1):
 scene.frame_set(frame)
 scene.camera=cameras.objects.get(tag+' REAL ORIGINAL 240HZ')
 assert scene.camera is not None
 scene.render.filepath=os.path.join(out,
  'G4E7DS_'+plan['road']+'_'+tag+'_GENUINE_BLENDER_NOT_GAME_WEBGL.png')
 bpy.ops.render.render(write_still=True)
report={'schema':'G4E7DS_MERIDIAN_FIVE_ORIGINAL_REAL_PHYSICAL_STAGE_ART_AUDIT',
 'road':plan['road'],'siteCount':5,'sitePlans':sites,'originalB48Surfaces':len(road_orig),
 'originalB51MovingOBB':len(hazard_orig),'originalCXObjects':len(cx_orig),
 'genuineCameraFrames':len(cameras.objects),'originalGap52':True,
 'addedArchitecturalObjects':len(col.objects),'geometricIntent':count,
 'sourceCXHash':plan['originalCXVertexSha256'],
 'sourceB48Hashes':sorted(hashes),'authoredGeometryOnly':True,
 'newGameColliders':0,'originalGamePhysicsEdited':False,
 'originalWebGLGameFramebuffer':'NOT_RENDERED',
 'art':'HOLD','human':'HOLD','ready':'HOLD','publish':'HOLD','merge':'HOLD',
 'formalSlope2Meters':0}
with open(os.path.join(out,'G4E7DS_'+plan['road']+'_ART_AUDIT.json'),'w') as f:
 json.dump(report,f,indent=2)
print('DS_MERIDIAN_REAL_B48_B51_BLENDER_UNADOPTED_ART_REVIEW',json.dumps({
 'road':plan['road'],'sites':5,'created':len(col.objects),
 'occupiedFloors':count['occupiedFloors'],'cameraCount':5,'art':'HOLD'}))